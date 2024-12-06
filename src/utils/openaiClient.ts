// src/utils/openaiClient.ts
import { incrementRequestCount, getRequestCount } from './requestCounter';
import { getSettings, saveSettings } from './settings';

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function generateChatResponse(messages: ChatMessage[], model: string, retryCount = 0): Promise<string> {
    // Check the request count
    const currentRequestCount = getRequestCount();
    if (currentRequestCount >= 100) {
        console.warn('API request limit reached. Disabling further requests.');
        throw new Error('API request limit reached. Please try again later.');
    }

    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        // Return mock data
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve('This is a mock response from the assistant.');

                // Increment the request count
                incrementRequestCount();

                // Update total all-time requests in settings
                const settings = getSettings();
                settings.totalRequests = (settings.totalRequests || 0) + 1;
                saveSettings(settings);
            }, 500); // Simulate network delay
        });
    }

    // Log the request to the Vite console
    console.log('Sending request to API with messages:', messages, 'and model:', model);

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages, model }),
        });

        if (response.status === 429) {
            const retryAfter = response.headers.get('retry-after-ms') || response.headers.get('retry-after');
            const retryDelay = retryAfter ? parseInt(retryAfter, 10) : 2000; // Default to 2 seconds if no header
            if (retryCount < 3) {
                console.warn(`Rate limit exceeded. Retrying after ${retryDelay}ms...`);
                await delay(retryDelay);
                return generateChatResponse(messages, model, retryCount + 1);
            } else {
                throw new Error('Rate limit exceeded. Please try again later.');
            }
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.details || 'Failed to get response');
        }

        const data = await response.json();
        console.log('Request successful - should not be retrying');

        // Increment the request count
        incrementRequestCount();
        console.log('Request count:', currentRequestCount + 1);

        // Update total all-time requests in settings
        const settings = getSettings();
        settings.totalRequests = (settings.totalRequests || 0) + 1;
        saveSettings(settings);

        return data.message.content;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}