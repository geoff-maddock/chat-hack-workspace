import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const model = "gpt-4o";
const openai = new OpenAI({
    apiKey: process.env.VITE_OPENAI_API_KEY,
    baseURL: process.env.VITE_OPENAI_API_BASE_URL
});

export async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    try {
        const { messages } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return new Response(
                JSON.stringify({
                    error: 'Invalid input',
                    details: 'Messages must be an array'
                }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        const response = await openai.chat.completions.create({
            model: model,
            messages: messages,
            max_tokens: 300,
            temperature: 0.7
        });

        return new Response(
            JSON.stringify({
                message: response.choices[0].message,
                usage: response.usage
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }
        );

    } catch (error: any) {
        console.error('OpenAI API Error:', error);
        return new Response(
            JSON.stringify({
                error: 'Server Error',
                details: error.message
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}