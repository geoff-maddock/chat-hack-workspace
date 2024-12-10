// src/utils/settings.ts

export interface Settings {
    conversationId: string | null;
    model: string;
    systemPrompt: string;
    username: string;
    totalRequests?: number; // Add this line
}

const SETTINGS_KEY = 'chat_settings';

export const defaultSettings: Settings = {
    model: 'gpt-4o',
    systemPrompt: `You are a friendly and helpful assistant.

You are able to respond with markdown formatted replies to user messages.

Files may be attached to the user's messages, in which case they will be converted into plain text for you to analyze.

If you have sent a message with a Markdown formatted image in it, go ahead and take credit for generating it, as another AI model was brought in to fulfill that request. Feel free to use that image's description to describe the image if relevant.`,
    username: 'system',
    conversationId: null,
    totalRequests: 0 // Add this line
};

export function saveSettings(settings: Settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function getSettings(): Settings {
    const settings = localStorage.getItem(SETTINGS_KEY);
    return settings ? JSON.parse(settings) : defaultSettings;
}