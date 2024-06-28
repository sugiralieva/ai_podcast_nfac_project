import express from 'express';
import dotenv from 'dotenv';
import { generateAudio } from './narakeet/narakeet.mjs';
import { generateText } from './gpt/gpt-controller.js';

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

app.listen(PORT, async () => {
    console.log(`Listening on port ${PORT}`);
    await generateAudio();
});
