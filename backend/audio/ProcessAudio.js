import { generateText } from "../gpt/gpt-controller.js";
import { generateAudio } from "./AudioGenerator.mjs";
import { combineAudioFiles } from "./AudioCombine.js";
import path from 'path';
import {fileURLToPath} from "url";
import {dirname} from "path";



const APIKEY = process.env.NARAKEET_API_KEY;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function processAudio(systemPrompt, outputFilename) {
    try {
        const resultText = await generateText(systemPrompt);
        function cleanJSONString(str) {
            // Удаляем все символы до первой открывающей квадратной скобки
            const startIndex = str.indexOf('[');
            // Удаляем все символы после последней закрывающей квадратной скобки
            const endIndex = str.lastIndexOf(']') + 1;
            if (startIndex !== -1 && endIndex !== -1) {
                return str.slice(startIndex, endIndex);
            }
            throw new Error('Invalid JSON structure');
        }
        
        // Использование:
        const cleanedText = cleanJSONString(resultText);
        console.log('Cleaned text:', cleanedText);
        
        const jsonResultText = JSON.parse(cleanedText);

        const audioPromises = jsonResultText.map((entry, index) => {
            const voice = entry.name;
            const participant_text = entry.text;
            const outputPath = path.join(__dirname, `${index + 1}.mp3`);

            return generateAudio(APIKEY, participant_text, voice, outputPath);
        });

        // Ждем завершения генерации всех аудиофайлов
        await Promise.all(audioPromises);
        console.log('All audio files generated successfully'); 

        // Теперь, когда все аудиофайлы сгенерированы, объединяем их
        const url = await combineAudioFiles(outputFilename);
        console.log('Audio files combined successfully');
        return url;
    } catch (err) {
        console.error('Error in audio processing:', err);
    }
}

export default processAudio;