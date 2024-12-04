import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { SettingsForm } from './SettingsForm';
import { generateChatResponse, ChatMessage as Message } from '../utils/openaiClient';
import { saveChatRecord, getChatRecords, deleteChatRecord, clearChatRecords, ChatRecord } from '../utils/localStorage';
import { getSettings, saveSettings, Settings } from '../utils/settings';

export const ChatInterface: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [deleteRecordId, setDeleteRecordId] = useState<string | null>(null);
    const [showClearPopup, setShowClearPopup] = useState(false);
    const [showSettingsForm, setShowSettingsForm] = useState(false);
    const [settings, setSettings] = useState<Settings>(getSettings());
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Load chat records from local storage on initialization
    useEffect(() => {
        const records = getChatRecords();
        const loadedMessages: Message[] = records.flatMap(record => [
            { role: 'user', content: record.request },
            { role: 'assistant', content: record.response }
        ]);
        setMessages(loadedMessages);
    }, []);

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
                { role: 'system', content: settings.systemPrompt },
                ...messages,
                newUserMessage
            ]);

            // Add AI message
            const newAIMessage: Message = { role: 'assistant', content: response };
            setMessages(prev => [
                ...prev,
                newAIMessage
            ]);

            // Save chat record to local storage
            const chatRecord: ChatRecord = {
                id: Date.now().toString(),
                request: userMessage,
                response: response,
                timestamp: new Date().toISOString()
            };
            saveChatRecord(chatRecord);
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
    }, [messages, settings]);

    const handleDeleteClick = (id: string) => {
        setDeleteRecordId(id);
        setShowDeletePopup(true);
    };

    const confirmDelete = () => {
        if (deleteRecordId) {
            deleteChatRecord(deleteRecordId);
            const updatedMessages = getChatRecords().flatMap(record => [
                { role: 'user', content: record.request },
                { role: 'assistant', content: record.response }
            ]);
            setMessages(updatedMessages);
            setDeleteRecordId(null);
            setShowDeletePopup(false);
        }
    };

    const cancelDelete = () => {
        setDeleteRecordId(null);
        setShowDeletePopup(false);
    };

    const handleClearClick = () => {
        setShowClearPopup(true);
    };

    const confirmClear = () => {
        clearChatRecords();
        setMessages([]);
        setShowClearPopup(false);
    };

    const cancelClear = () => {
        setShowClearPopup(false);
    };

    const handleSettingsClick = () => {
        setShowSettingsForm(true);
    };

    const closeSettingsForm = (newSettings?: Settings) => {
        if (newSettings) {
            setSettings(newSettings);
            saveSettings(newSettings);
        }
        setShowSettingsForm(false);
    };

    return (
        <div className="flex flex-col h-[85vh] bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Settings Bar */}
            <div className="flex items-center justify-between p-4 bg-gray-100 border-b border-gray-200">
                <span>Model: {settings.model}</span>
                <button
                    className="p-2 bg-gray-500 text-white rounded-full shadow-lg"
                    onClick={handleSettingsClick}
                >
                    ⚙️
                </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <div key={index} className="relative">
                        <ChatMessage
                            content={message.content}
                            role={message.role}
                        />
                        {index % 2 === 0 && (
                            <button
                                className="absolute top-0 right-0 p-2 text-red-500"
                                onClick={() => handleDeleteClick(getChatRecords()[Math.floor(index / 2)].id)}
                            >
                                🗑️
                            </button>
                        )}
                    </div>
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

            {/* Delete Confirmation Popup */}
            {showDeletePopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <p>Are you sure you want to delete this chat record?</p>
                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded"
                                onClick={confirmDelete}
                            >
                                Yes
                            </button>
                            <button
                                className="bg-gray-300 px-4 py-2 rounded"
                                onClick={cancelDelete}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Clear Confirmation Popup */}
            {showClearPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <p>Are you sure you want to clear all chat records?</p>
                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded"
                                onClick={confirmClear}
                            >
                                Yes
                            </button>
                            <button
                                className="bg-gray-300 px-4 py-2 rounded"
                                onClick={cancelClear}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Settings Form */}
            {showSettingsForm && <SettingsForm onClose={closeSettingsForm} onSave={setSettings} />}

            {/* Clear All Button */}
            <button
                className="fixed bottom-4 right-4 p-4 bg-red-500 text-white rounded-full shadow-lg"
                onClick={handleClearClick}
            >
                🗑️
            </button>
        </div>
    );
};