// src/utils/openaiClient.ts

import { incrementRequestCount, getRequestCount } from './requestCounter';
import { getSettings, saveSettings } from './settings';

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export async function generateChatResponse(messages: ChatMessage[], model: string) {
    // Check the request count
    const requestCount = getRequestCount();
    if (requestCount >= 100) {
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

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.details || 'Failed to get response');
        }

        const data = await response.json();

        // Increment the request count
        incrementRequestCount();

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