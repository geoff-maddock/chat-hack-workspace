import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// replace these with stored settings
const model = "gpt-4o";
const max_tokens = 300;
const temperature = 0.7;

const openai = new OpenAI({
    apiKey: process.env.VITE_OPENAI_API_KEY,
    baseURL: process.env.VITE_OPENAI_API_BASE_URL
});

export async function handler(req: Request) {
    console.log('Received request in chat.ts handler:', req.method, req.url);

    if (req.method !== 'POST') {
        console.warn('Invalid request method:', req.method);
        return new Response('Method not allowed', { status: 405 });
    }

    try {
        const { messages } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            console.warn('Invalid input: Messages must be an array');
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

        console.log('Sending request to OpenAI API with model:', model);
        console.log('Messages:', messages);
        console.log('Max Tokens:', max_tokens);
        console.log('Temperature:', temperature);


        console.log('---')
        const response = await openai.chat.completions.create({
            model: model,
            messages: messages,
            max_tokens: max_tokens,
            temperature: temperature
        });

        console.log('Received response from OpenAI API:', response);

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