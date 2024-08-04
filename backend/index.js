import express from 'express';
import dotenv from 'dotenv';
import * as path from "node:path";
import * as fs from "node:fs";
import processAudio from './audio/ProcessAudio.js';
import {fileURLToPath} from "url";
import {dirname} from "path";
import {create, getAll, getOne} from "./controllers/PodcastController.js";
import connectDB from "./connectDB.js";
import cors from "cors";
import { generateDescription, generateText } from './gpt/gpt-controller.js';

dotenv.config();

/* import './script.js';
 */


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
    
    // Читаем JSON файл для генерации аудио
    const jsonFilePath = path.join(__dirname, 'data.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));

    // Итерируемся по каждому элементу и генерируем аудио
    /* for (const item of jsonData) {
        const { episode, title, prompt, description_prompt } = item;
        try {
            // Проверяем prompt перед вызовом processAudio
            if (!prompt) {
                console.error(`Missing prompt for episode ${episode}`);
                continue;
            }
    
            // Ожидаем завершения processAudio
            const url = await processAudio(prompt, episode);
            
            // Проверяем url после processAudio
            if (!url) {
                console.error(`Failed to get URL for episode ${episode}`);
                continue;
            }
    
            // Проверяем description_prompt перед вызовом generateText
            let description = '';
            if (description_prompt) {
                // Ожидаем завершения generateText
                description = await generateText(description_prompt);
            } else {
                console.warn(`Missing description_prompt for episode ${episode}`);
            }
    
            // Если description пустой, устанавливаем значение по умолчанию
            if (!description) {
                description = `Description for episode ${episode}`;
            }
    
            console.log('podcastUrl = ', url);
    
            // Ожидаем завершения create
            await create(episode, title, url, description);
          
            console.log(`Episode ${episode} processed and saved successfully`);
        } catch (error) {
            console.error(`Error processing episode ${episode}:`, error);
            continue;
        }
    } */

});