import pkg from 'bullmq';
const { Queue, Worker } = pkg;

import cron from 'node-cron';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Redis from 'ioredis';
import { generateAudio } from './narakeet/narakeet.mjs';
import { generateDescription, generateText } from './gpt/gpt-controller.js';
import { create } from './controllers/PodcastController.js';

console.log('BullMQ exports:', Object.keys(pkg));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const redisOptions = {
  maxRetriesPerRequest: null,
  enableReadyCheck: false
};
const redis = new Redis('redis://localhost:6379', redisOptions);

const queue = new Queue('podcastQueue', { 
  connection: redis
});

const worker = new Worker('podcastQueue', async job => {
  const { episode, title, prompt, category } = job.data;
  const text = await generateText(prompt);
  const description = await generateDescription(text)
  const url = await generateAudio(episode, text);
  console.log('podcastUrl = ', url);
  await create(episode, title, category, url, description);
}, { connection: redis });

let currentIndex = 0;

function scheduleNextJob() {
  console.log('Scheduling next job...');
  const jsonFilePath = join(__dirname, 'data.json');
  const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));

  if (currentIndex >= jsonData.length) {
    currentIndex = 0; // Сбрасываем индекс, если достигли конца массива
  }

  const { episode, title, prompt, category } = jsonData[currentIndex];
  queue.add('generatePodcast', { episode, title, prompt, category });
  
  console.log(`Scheduled job for episode ${episode}`);
  currentIndex++;
}

console.log('Starting initial job scheduling...');
scheduleNextJob();

console.log('Starting cron job...');
cron.schedule('*/10 * * * *', () => {
  console.log('Daily cron job triggered. Scheduling next job...');
  scheduleNextJob();
});

console.log('Cron job started. Waiting for next execution...');