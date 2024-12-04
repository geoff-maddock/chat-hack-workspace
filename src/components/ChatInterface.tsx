import React, { useState, useCallback, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { SettingsForm } from './SettingsForm';
import { EditConversationForm } from './EditConversationForm';
import { NewConversationForm } from './NewConversationForm';
import { generateChatResponse, ChatMessage as Message } from '../utils/openaiClient';
import { saveChatRecord, getChatRecords, deleteChatRecord, clearChatRecords, ChatRecord, saveChatConversation, getChatConversations, ChatConversation } from '../utils/localStorage';
import { getSettings, saveSettings, Settings } from '../utils/settings';

export const ChatInterface: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [deleteRecordId, setDeleteRecordId] = useState<string | null>(null);
    const [showClearPopup, setShowClearPopup] = useState(false);
    const [showSettingsForm, setShowSettingsForm] = useState(false);
    const [showEditConversationForm, setShowEditConversationForm] = useState(false);
    const [showNewConversationForm, setShowNewConversationForm] = useState(false);
    const [settings, setSettings] = useState<Settings>(getSettings());
    const [conversations, setConversations] = useState<ChatConversation[]>(getChatConversations());
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Load chat records and conversations from local storage on initialization
    useEffect(() => {
        const records = getChatRecords();
        const loadedMessages: Message[] = records.flatMap(record => [
            { role: 'user', content: record.request },
            { role: 'assistant', content: record.response }
        ]);
        setMessages(loadedMessages);

        if (conversations.length > 0) {
            const lastConversation = conversations[conversations.length - 1];
            setSettings(prev => ({ ...prev, conversationId: lastConversation.id }));
        } else {
            const newConversation: ChatConversation = {
                id: uuidv4().toString(),
                title: 'New Conversation',
                created_at: new Date().toISOString(),
                username: settings.username
            };
            saveChatConversation(newConversation);
            setSettings(prev => ({ ...prev, conversationId: newConversation.id }));
            saveSettings({ ...settings, conversationId: newConversation.id });
            setConversations(prev => [...prev, newConversation]);
        }
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

        // Load current settings
        const currentSettings = getSettings();

        // Add user message
        const newUserMessage: Message = { role: 'user', content: userMessage };
        setMessages(prev => [...prev, newUserMessage]);
        setIsLoading(true);

        try {
            // Get AI response
            const response = await generateChatResponse([
                { role: 'system', content: currentSettings.systemPrompt },
                ...messages,
                newUserMessage
            ], currentSettings.model);

            // Add AI message
            const newAIMessage: Message = { role: 'assistant', content: response };
            setMessages(prev => [
                ...prev,
                newAIMessage
            ]);

            // Save chat record to local storage
            const chatRecord: ChatRecord = {
                id: uuidv4().toString(),
                request: userMessage,
                response: response,
                timestamp: new Date().toISOString(),
                model: currentSettings.model,
                systemPrompt: currentSettings.systemPrompt,
                username: currentSettings.username,
                relatedMessageIds: messages.map((_, index) => uuidv4().toString()),
                conversationId: currentSettings.conversationId
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
    }, [messages]);

    const handleCreateConversation = (title: string) => {
        const newConversation: ChatConversation = {
            id: uuidv4().toString(),
            title,
            created_at: new Date().toISOString(),
            username: settings.username
        };
        saveChatConversation(newConversation);
        setSettings(prev => ({ ...prev, conversationId: newConversation.id }));
        saveSettings({ ...settings, conversationId: newConversation.id });
        setConversations(prev => [...prev, newConversation]);
    };

    const handleEditConversationClick = (conversationId: string) => {
        setSelectedConversationId(conversationId);
        setShowEditConversationForm(true);
    };

    const closeEditConversationForm = (updatedConversation?: ChatConversation) => {
        if (updatedConversation) {
            const updatedConversations = conversations.map(conv =>
                conv.id === updatedConversation.id ? updatedConversation : conv
            );
            setConversations(updatedConversations);
            localStorage.setItem('chat_conversations', JSON.stringify(updatedConversations));
        }
        setShowEditConversationForm(false);
    };

    const handleNewConversationClick = () => {
        setShowNewConversationForm(true);
    };

    const closeNewConversationForm = (newConversation?: ChatConversation) => {
        if (newConversation) {
            setSettings(prev => ({ ...prev, conversationId: newConversation.id }));
            saveSettings({ ...settings, conversationId: newConversation.id });
            setConversations(prev => [...prev, newConversation]);
            setMessages([]);
        }
        setShowNewConversationForm(false);
    };

    const handleLoadConversation = (conversationId: string) => {
        const records = getChatRecords().filter(record => record.conversationId === conversationId);
        const loadedMessages: Message[] = records.flatMap(record => [
            { role: 'user', content: record.request },
            { role: 'assistant', content: record.response }
        ]);
        setMessages(loadedMessages);
        setSettings(prev => ({ ...prev, conversationId }));
        saveSettings({ ...settings, conversationId });
    };

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
        setConversations([]);
        const newConversation: ChatConversation = {
            id: uuidv4().toString(),
            title: 'New Conversation',
            created_at: new Date().toISOString(),
            username: settings.username
        };
        saveChatConversation(newConversation);
        setSettings(prev => ({ ...prev, conversationId: newConversation.id }));
        saveSettings({ ...settings, conversationId: newConversation.id });
        setConversations([newConversation]);
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
        <div className="flex h-[85vh] bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Chat Interface */}
            <div className="flex flex-col flex-1">
                {/* Settings Bar */}
                <div className="flex items-center justify-between p-4 bg-gray-100 border-b border-gray-200">
                    <span>
                        <p className="font-bold">Conversation:</p> {settings.conversationId ? getChatConversations().find(conv => conv.id === settings.conversationId)?.title || '<none>' : '<none>'}
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

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message, index) => (
                        <div key={index} className="relative">
                            <ChatMessage
                                content={message.content}
                                role={message.role}
                                model={settings.model}
                                username={settings.username}
                                timestamp={new Date().toISOString()}
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
            </div>

            {/* Conversations Section */}
            <div className="w-1/3 flex flex-col bg-gray-50 border-l border-gray-200">
                <div className="flex items-center justify-between p-4 bg-gray-100 border-b border-gray-200">
                    <h2 className="text-xl font-bold">Conversations</h2>
                    <button
                        className="p-2 bg-green-500 text-white rounded-full shadow-lg"
                        onClick={handleNewConversationClick}
                        title="New Conversation"
                    >
                        ➕
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {conversations.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map(conversation => (
                        <div key={conversation.id} className="p-4 bg-white rounded-lg shadow">
                            <p className="font-bold">{conversation.title}</p>
                            <p className="text-xs text-gray-500">Username: {conversation.username}</p>
                            <p className="text-xs text-gray-500">Created: {new Date(conversation.created_at).toLocaleString()}</p>
                            <button
                                className="mt-2 p-2 bg-blue-500 text-white rounded-full shadow-lg"
                                onClick={() => handleLoadConversation(conversation.id)}
                            >
                                Load
                            </button>
                            <button
                                className="mt-2 ml-2 p-2 bg-gray-500 text-white rounded-full shadow-lg"
                                onClick={() => handleEditConversationClick(conversation.id)}
                            >
                                ✏️
                            </button>
                        </div>
                    ))}
                </div>
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
            {showSettingsForm && <SettingsForm onClose={() => setShowSettingsForm(false)} onSave={closeSettingsForm} />}

            {/* Edit Conversation Form */}
            {showEditConversationForm && selectedConversationId && (
                <EditConversationForm
                    conversationId={selectedConversationId}
                    onClose={() => setShowEditConversationForm(false)}
                    onSave={closeEditConversationForm}
                />
            )}

            {/* New Conversation Form */}
            {showNewConversationForm && (
                <NewConversationForm
                    onClose={() => setShowNewConversationForm(false)}
                    onSave={closeNewConversationForm}
                    username={settings.username}
                />
            )}

            {/* Clear All Button */}
            <button
                className="fixed bottom-4 right-4 p-4 bg-red-500 text-white rounded-full shadow-lg"
                onClick={handleClearClick}
                title="Clear All Chat Records"
            >
                🗑️
            </button>
        </div>
    );
};