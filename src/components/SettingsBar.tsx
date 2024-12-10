// src/components/SettingsBar.tsx
import React from 'react';
import { ChatConversation } from '../utils/localStorage';
import { Settings } from '../utils/settings';

interface SettingsBarProps {
    settings: Settings;
    conversations: ChatConversation[];
    handleSettingsClick: () => void;
}

export const SettingsBar: React.FC<SettingsBarProps> = ({
    settings,
    conversations,
    handleSettingsClick
}) => {
    const currentConversation = conversations.find(conv => conv.id === settings.conversationId);

    return (
        <div className="flex items-center justify-between p-4 bg-gray-100 border-b border-gray-200">
            <span>
                <p className="font-bold">Conversation:</p> {currentConversation ? currentConversation.title : '<none>'}
            </span>
            <span><p className="font-bold">Model:</p> {settings.model}</span>
            <button
                className="p-2 bg-gray-500 text-white rounded-full shadow-lg"
                onClick={handleSettingsClick}
                title="Open Settings"
            >
                ⚙️
            </button>
        </div>
    );
};