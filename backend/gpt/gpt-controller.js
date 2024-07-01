import 'dotenv/config';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


export const generateText = async (systemPrompt) => {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: systemPrompt,
                }
            ],
        });

        const resText = response.choices[0].message.content;
        if (resText) {
            console.log(resText);
            return resText;
        }
    } catch (e) {
        console.log(e.message);
        return null;
    }
};
