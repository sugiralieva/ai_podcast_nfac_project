import AWS from 'aws-sdk';
import axios from "axios";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { generateText } from "../gpt/gpt-controller.js";
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import ffprobePath from 'ffprobe-static';
import fs from 'fs';

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath.path);

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

const introPath = join(__dirname, 'intro.mp3');
const outroPath = join(__dirname, 'outro.mp3');

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

function combineAudioFiles(introPath, audioPath, outroPath, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg()
            .input(introPath)
            .input(audioPath)
            .input(outroPath)
            .on('error', (err) => {
                console.error('Error combining audio files:', err.message);
                reject(err);
            })
            .on('end', () => {
                console.log('Audio files combined successfully.');
                resolve(outputPath);
            })
            .mergeToFile(outputPath, __dirname);
    });
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
                            const audioPath = join(__dirname, 'audio.mp3');
                            const combinedPath = join(__dirname, `${title}-${Date.now()}.mp3`);

                            // Download the generated audio file
                            console.log('Downloading audio file from:', audioUrl);
                            const response = await axios.get(audioUrl, { responseType: 'stream' });
                            const writer = fs.createWriteStream(audioPath);
                            response.data.pipe(writer);
                            await new Promise((resolve, reject) => {
                                writer.on('finish', resolve);
                                writer.on('error', reject);
                            });

                            // Combine intro, main audio, and outro
                            await combineAudioFiles(introPath, audioPath, outroPath, combinedPath);

                            // Upload the combined audio file to S3
                            const s3Url = await uploadToS3(fs.createReadStream(combinedPath), `${title}-${Date.now()}.mp3`);
                            console.log('Audio file downloaded, combined, and uploaded to S3 as:', combinedPath);
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
            }, 2000); // Poll every 2 seconds
        });
    } catch (error) {
        console.error('An error occurred:', error.message);
        throw error;
    }
}
