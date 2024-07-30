/* import AWS from 'aws-sdk';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path'; */
import {pipeline} from 'node:stream/promises';
import {createWriteStream} from 'node:fs';
import { Readable } from 'stream';
import got from 'got';

    
    
    export const generateAudio = async (APIKEY, text, voice, outputPath) => {
    
        await pipeline(
            Readable.from([text]),
            got.stream.post(
                `https://api.narakeet.com/text-to-speech/mp3?voice=${voice}&voice-volume=loud`,
                {
                    headers: {
                        'accept': 'application/octet-stream',
                        'x-api-key': APIKEY,
                        'content-type': 'text/plain'
                    }
                },
            ),
            createWriteStream(outputPath)
        )
    };
    