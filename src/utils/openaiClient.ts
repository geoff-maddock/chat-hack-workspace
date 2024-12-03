export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export async function generateChatResponse(messages: ChatMessage[]) {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.details || 'Failed to get response');
        }

        const data = await response.json();
        return data.message.content;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}