// src/components/MessagesContainer.tsx
import React from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { SettingsBar } from './SettingsBar';
import { Message } from '../utils/openaiClient';
import { ChatConversation } from '../utils/localStorage';
import { Settings } from '../utils/settings';

interface MessagesContainerProps {
    messages: Message[];
    isLoading: boolean;
    handleSendMessage: (userMessage: string) => void;
    handleDeleteClick: (id: string) => void;
    chatContainerRef: React.RefObject<HTMLDivElement>;
    messagesEndRef: React.RefObject<HTMLDivElement>;
    handleScroll: () => void;
    settings: Settings;
    conversations: ChatConversation[];
    handleSettingsClick: () => void;
}

export const MessagesContainer: React.FC<MessagesContainerProps> = ({
    messages,
    isLoading,
    handleSendMessage,
    handleDeleteClick,
    chatContainerRef,
    messagesEndRef,
    handleScroll,
    settings,
    conversations,
    handleSettingsClick
}) => {
    return (
        <div className="flex flex-col flex-1" ref={chatContainerRef} onScroll={handleScroll}>
            <SettingsBar
                settings={settings}
                conversations={conversations}
                handleSettingsClick={handleSettingsClick}
            />
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <div key={index} className="relative">
                        <ChatMessage
                            content={message.content}
                            role={message.role}
                            model={message.model}
                            username={message.username}
                            timestamp={message.timestamp}
                            id={message.id}
                            handleDeleteClick={handleDeleteClick}
                        />
                    </div>
                ))}

                {isLoading && (
                    <div className="flex items-center justify-center space-x-2">
                        <div className="animate-bounce">•</div>
                        <div className="animate-bounce delay-100">•</div>
                        <div className="animate-bounce delay-200">•</div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-200">
                <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
            </div>
        </div>
    );
};