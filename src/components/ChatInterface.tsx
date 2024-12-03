import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { generateChatResponse, ChatMessage as Message } from '../utils/openaiClient';

export const ChatInterface: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'system', content: 'You are a helpful AI assistant.' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = useCallback(async (userMessage: string) => {
        if (!userMessage.trim()) return;

        // Add user message
        const newUserMessage: Message = { role: 'user', content: userMessage };
        setMessages(prev => [...prev, newUserMessage]);
        setIsLoading(true);

        try {
            // Get AI response
            const response = await generateChatResponse([
                ...messages,
                newUserMessage
            ]);

            // Add AI message
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: response }
            ]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: 'Sorry, I encountered an error while processing your request.'
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    }, [messages]);

    return (
        <div className="flex flex-col h-[85vh] bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages
                    .filter(msg => msg.role !== 'system')
                    .map((message, index) => (
                        <ChatMessage
                            key={index}
                            content={message.content}
                            role={message.role}
                        />
                    ))}

                {/* Loading indicator */}
                {isLoading && (
                    <div className="flex items-center justify-center space-x-2">
                        <div className="animate-bounce">•</div>
                        <div className="animate-bounce delay-100">•</div>
                        <div className="animate-bounce delay-200">•</div>
                    </div>
                )}

                {/* Auto-scroll anchor */}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200">
                <ChatInput
                    onSendMessage={handleSendMessage}
                    disabled={isLoading}
                />
            </div>
        </div>
    );
};