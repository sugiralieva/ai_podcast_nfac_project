import axios from "axios";
import { fileURLToPath } from 'url';
import { dirname, resolve as resolvePath } from 'path';
import fs from "fs";
import { generateText } from "../gpt/gpt-controller.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const API_KEY = process.env.NARAKEET_API_KEY;
const API_URL = 'https://api.narakeet.com/text-to-speech/mp3';
const VOICE = 'gulshat';

async function requestAudioBuild(TEXT_BODY) {
    try {
        console.log('Generated text:', TEXT_BODY);  // Log the generated text
        const response = await axios.post(`${API_URL}?voice=${VOICE}`, TEXT_BODY, {
            headers: {
                'Content-Type': 'text/plain',
                'x-api-key': API_KEY
            }
        });
        return response.data.statusUrl;
    } catch (error) {
        console.error('Error requesting audio build:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function pollStatus(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error polling status:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function downloadFile(url, filePath) {
    try {
        const response = await axios.get(url, { responseType: 'stream' });
        const writer = fs.createWriteStream(filePath);

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error('Error downloading file:', error.response ? error.response.data : error.message);
        throw error;
    }
}

export async function generateAudio() {
    try {
        const TEXT_BODY = await generateText();
        const statusUrl = await requestAudioBuild(TEXT_BODY);
        console.log('Audio build requested. Polling status URL:', statusUrl);

        let buildStatus;
        let pollingInterval = setInterval(async () => {
            try {
                buildStatus = await pollStatus(statusUrl);
                console.log('Polling status:', buildStatus);

                if (buildStatus.finished) {
                    clearInterval(pollingInterval);

                    if (buildStatus.succeeded) {
                        const audioUrl = buildStatus.result;
                        const filePath = resolvePath(__dirname,'output.mp3');
                        console.log('Downloading audio file from:', audioUrl);
                        await downloadFile(audioUrl, filePath);
                        console.log('Audio file downloaded and saved as:', filePath);
                    } else {
                        console.error('Audio build failed:', buildStatus.message);
                    }
                }
            } catch (error) {
                clearInterval(pollingInterval);
                console.error('Error during polling:', error.message);
            }
        }, 5000); // Poll every 5 seconds
    } catch (error) {
        console.error('An error occurred:', error.message);
    }
}
