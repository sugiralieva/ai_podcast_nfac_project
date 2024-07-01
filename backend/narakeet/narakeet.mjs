import AWS from 'aws-sdk';
import axios from "axios";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { generateText } from "../gpt/gpt-controller.js";

// AWS configuration
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const bucketName = process.env.AWS_S3_BUCKET_NAME;

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

async function uploadToS3(stream, key) {
    const params = {
        Bucket: bucketName,
        Key: key,
        Body: stream
    };

    try {
        await s3.upload(params).promise();
        console.log('File uploaded successfully to S3:', key);
        return `https://${bucketName}.s3.amazonaws.com/${key}`;
    } catch (error) {
        console.error('Error uploading file to S3:', error.message);
        throw error;
    }
}

async function downloadFileToS3(url, key) {
    try {
        const response = await axios.get(url, { responseType: 'stream' });

        return await uploadToS3(response.data, key);
    } catch (error) {
        console.error('Error downloading file:', error.response ? error.response.data : error.message);
        throw error;
    }
}

export async function generateAudio(title, text) {
    try {
        const TEXT_BODY = text;
        const statusUrl = await requestAudioBuild(TEXT_BODY);
        console.log('Audio build requested. Polling status URL:', statusUrl);

        let buildStatus;
        return new Promise((resolve, reject) => {
            let pollingInterval = setInterval(async () => {
                try {
                    buildStatus = await pollStatus(statusUrl);
                    console.log('Polling status:', buildStatus);

                    if (buildStatus.finished) {
                        clearInterval(pollingInterval);

                        if (buildStatus.succeeded) {
                            const audioUrl = buildStatus.result;
                            const key = `${title}-${Date.now()}.mp3`;
                            console.log('Downloading audio file from:', audioUrl);
                            const s3Url = await downloadFileToS3(audioUrl, key);
                            console.log('Audio file downloaded and uploaded to S3 as:', key);
                            resolve(s3Url);
                        } else {
                            console.error('Audio build failed:', buildStatus.message);
                            reject(new Error('Audio build failed'));
                        }
                    }
                } catch (error) {
                    clearInterval(pollingInterval);
                    console.error('Error during polling:', error.message);
                    reject(error);
                }
            }, 5000); // Poll every 5 seconds
        });
    } catch (error) {
        console.error('An error occurred:', error.message);
        throw error;
    }
}
