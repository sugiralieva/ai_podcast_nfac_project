import 'dotenv/config';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `
2 минут ішінде «Ғылым мен технологиядағы әйелдер» тақырыбына подкаст мәтінін жасаңыз.
Алдымен тыңдаушыларыңызбен амандасып, тақырыпқа шолу жасап, содан кейін фактілерді, статистиканы, қызықты оқиғаларды және т.б. қосып, бір ағында мәтін жазыңыз. 
Әрбір фактті толық ашып, алдымен шетелдік, кейін Қазақстандық мысалдарды да ескеріңіз.
Мәтінді тыңдау тыңдаушыларға қызықты болатындай етіп құрастыр.
Нәтижені толық мәтіндік форматта қайтарыңыз.
`;

const fullPrompt = systemPrompt;

export const generateText = async () => {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: fullPrompt,
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
