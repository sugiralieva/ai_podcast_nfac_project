import express from 'express';
import dotenv from 'dotenv';
import { generateAudio } from './narakeet/narakeet.mjs';
import { generateText } from './gpt/gpt-controller.js';
import * as path from "node:path";
import * as fs from "node:fs";
import {fileURLToPath} from "url";
import {dirname} from "path";
import {create, getAll, getOne} from "./controllers/PodcastController.js";
import connectDB from "./connectDB.js";
import cors from "cors";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors());

app.get('/podcasts', getAll)
app.get('/podcasts/:id', getOne)

app.listen(PORT, async () => {
    console.log(`Listening on port ${PORT}`);
    connectDB()
    console.log('Connected MongoDB successfully');

    // // Читаем JSON файл для генерации аудио
    // const jsonFilePath = path.join(__dirname, 'data.json');
    // const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
    //
    // // Итерируемся по каждому элементу и генерируем аудио
    // for (const item of jsonData) {
    //     const { episode, title, prompt } = item;
    //     const text = await generateText(prompt);
    //     const url = await generateAudio(episode, text)
    //     console.log('podcastUrl = ', url)
    //     await create(episode, title, url);
    // }
});
