import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from "url";
import { dirname } from "path";
import AWS from 'aws-sdk';
import { PassThrough } from 'stream';

ffmpeg.setFfmpegPath(ffmpegStatic);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputDirectory = path.join(__dirname);
const introPath = path.join(__dirname, 'intro/', 'intro.mp3');
const outroPath = path.join(__dirname, 'intro/', 'outro.mp3');

// AWS configuration
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const bucketName = process.env.AWS_S3_BUCKET_NAME;

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

async function combineAudioFiles(outputFilename) {
    try {
        // Get list of all MP3 files in the directory
        const files = await fs.readdir(inputDirectory);
        const mp3Files = files
            .filter(file => path.extname(file).toLowerCase() === '.mp3')
            .sort((a, b) => {
                const numA = parseInt(path.basename(a, '.mp3'));
                const numB = parseInt(path.basename(b, '.mp3'));
                return numA - numB;
            })
            .map(file => path.join(inputDirectory, file));

        if (mp3Files.length === 0) {
            throw new Error('No MP3 files found in the specified directory');
        }

        // Create a temporary file with the list of input files, including intro and outro
        const listFilePath = path.join(inputDirectory, 'file_list.txt');
        const fileList = [
            `file '${introPath}'`,
            ...mp3Files.map(file => `file '${file}'`),
            `file '${outroPath}'`
        ];
        await fs.writeFile(listFilePath, fileList.join('\n'));

        // Create a PassThrough stream to pipe the ffmpeg output
        const passThrough = new PassThrough();

        // Combine files and pipe to S3
        const ffmpegProcess = ffmpeg()
            .input(listFilePath)
            .inputOptions(['-f', 'concat', '-safe', '0'])
            .outputFormat('mp3')
            .pipe(passThrough);

        // Upload to S3
        const s3Key = `${outputFilename}.mp3`;
        const s3Url = await uploadToS3(passThrough, s3Key);

        // Clean up: remove temporary file list and source MP3 files
        await fs.unlink(listFilePath);
        for (const file of mp3Files) {
            await fs.unlink(file);
        }

        console.log('Audio files combined, uploaded to S3, and source files deleted (except intro and outro)');
        return s3Url;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export { combineAudioFiles };