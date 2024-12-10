// src/components/ChatInterface.tsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ConversationList } from './ConversationList';
import { MessagesContainer } from './MessagesContainer';
import { PromptTemplateList } from './PromptTemplateList';
import { DeleteConfirmationPopup } from './DeleteConfirmationPopup';
import { ClearConfirmationPopup } from './ClearConfirmationPopup';
import { SettingsForm } from './SettingsForm';
import { EditConversationForm } from './EditConversationForm';
import { NewConversationForm } from './NewConversationForm';
import { NewTemplateForm } from './NewTemplateForm'; // Add this import
import { RequestCount } from './RequestCount';
import { generateChatResponse, ChatMessage as Message } from '../utils/openaiClient';
import { saveChatRecord, getChatRecords, deleteChatRecord, clearChatRecords, ChatRecord, saveChatConversation, getChatConversations, deleteChatConversation, clearChatConversations, ChatConversation, PromptTemplate, savePromptTemplate, getPromptTemplates, deletePromptTemplate } from '../utils/localStorage';
import { getSettings, saveSettings, Settings } from '../utils/settings';

export const ChatInterface: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUserScrolling, setIsUserScrolling] = useState(false); // Track user scrolling
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [deleteMessageId, setDeleteMessageId] = useState<string | null>(null); // Track message to be deleted
    const [deleteConversationId, setDeleteConversationId] = useState<string | null>(null); // Track conversation to be deleted
    const [showClearPopup, setShowClearPopup] = useState(false);
    const [showSettingsForm, setShowSettingsForm] = useState(false);
    const [showEditConversationForm, setShowEditConversationForm] = useState(false);
    const [showNewConversationForm, setShowNewConversationForm] = useState(false);
    const [showNewTemplateForm, setShowNewTemplateForm] = useState(false); // Track new template form visibility
    const [settings, setSettings] = useState<Settings>(getSettings());
    const [conversations, setConversations] = useState<ChatConversation[]>(getChatConversations());
    const [templates, setTemplates] = useState<PromptTemplate[]>(getPromptTemplates());
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(settings.conversationId);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = useCallback(() => {
        if (!isUserScrolling) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isUserScrolling]);

    useEffect(() => {
        scrollToBottom();
    }, [scrollToBottom, messagesEndRef, settings.conversationId, conversations.length]);

    useEffect(() => {
        const records = getChatRecords().filter(record => record.conversationId === settings.conversationId);
        const loadedMessages: Message[] = records.flatMap(record => [
            { role: 'user' as const, content: record.request },
            { role: 'assistant' as const, content: record.response }
        ]);
        setMessages(loadedMessages);

        if (conversations.length > 0) {
            const lastConversation = conversations.find(conv => conv.id === settings.conversationId);
            if (lastConversation) {
                setSettings(prev => ({ ...prev, conversationId: lastConversation.id }));
            }
        } else {
            const newConversation: ChatConversation = {
                id: uuidv4().toString(),
                title: 'New Conversation',
                description: '',
                created_at: new Date().toISOString(),
                username: settings.username,
                spaceId: null
            };
            saveChatConversation(newConversation);
            setSettings(prev => ({ ...prev, conversationId: newConversation.id }));
            saveSettings({ ...settings, conversationId: newConversation.id });
            setConversations([newConversation]);
        }
    }, [settings.conversationId]);

    const handleSendMessage = useCallback(async (userMessage: string) => {
        if (!userMessage.trim()) return;

        const currentSettings = getSettings();
        const newUserMessage: Message = { role: 'user', content: userMessage };
        setMessages(prev => [...prev, newUserMessage]);
        setIsLoading(true);

        try {
            const response = await generateChatResponse([
                { role: 'system', content: currentSettings.systemPrompt },
                ...messages,
                newUserMessage
            ], currentSettings.model);

            const newAIMessage: Message = { role: 'assistant', content: response };
            setMessages(prev => [...prev, newAIMessage]);

            const chatRecord: ChatRecord = {
                id: uuidv4().toString(),
                request: userMessage,
                response: response,
                timestamp: new Date().toISOString(),
                model: currentSettings.model,
                systemPrompt: currentSettings.systemPrompt,
                username: currentSettings.username,
                conversationId: currentSettings.conversationId
            };
            saveChatRecord(chatRecord);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: 'Sorry, I encountered an error while processing your request.' }
            ]);
        } finally {
            setIsLoading(false);
        }
    }, [messages]);

    const handleScroll = () => {
        if (chatContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
            setIsUserScrolling(scrollTop + clientHeight < scrollHeight);
        }
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
            description: '',
            created_at: new Date().toISOString(),
            username: settings.username,
            spaceId: null
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

    const handleDeleteMessageClick = (messageId: string) => {
        setDeleteMessageId(messageId);
        setShowDeletePopup(true);
    };

    const handleDeleteClick = (conversationId: string) => {
        setDeleteConversationId(conversationId);
        setShowDeletePopup(true);
    };

    const confirmDelete = () => {
        if (deleteMessageId) {
            deleteChatRecord(deleteMessageId);
            const updatedMessages = messages.filter(message => message.id !== deleteMessageId);
            setMessages(updatedMessages);
            setDeleteMessageId(null);
            setShowDeletePopup(false);
        } else if (deleteConversationId) {
            deleteChatConversation(deleteConversationId);
            const updatedConversations = conversations.filter(conv => conv.id !== deleteConversationId);
            setConversations(updatedConversations);
            localStorage.setItem('chat_conversations', JSON.stringify(updatedConversations));

            const updatedMessages = getChatRecords().filter(record => record.conversationId !== deleteConversationId);
            localStorage.setItem('chat_records', JSON.stringify(updatedMessages));
            setMessages(updatedMessages.flatMap(record => [
                { role: 'user', content: record.request },
                { role: 'assistant', content: record.response }
            ]));

            setDeleteConversationId(null);
            setShowDeletePopup(false);
        }
    };

    const cancelDelete = () => {
        setDeleteMessageId(null);
        setDeleteConversationId(null);
        setShowDeletePopup(false);
    };

    const handleAddTemplateClick = () => {
        setShowNewTemplateForm(true);
    };

    const handleEditTemplateClick = (templateId: string) => {
        // Implement edit template logic
    };

    const handleDeleteTemplateClick = (templateId: string) => {
        deletePromptTemplate(templateId);
        setTemplates(getPromptTemplates());
    };

    const closeNewTemplateForm = (newTemplate?: PromptTemplate) => {
        if (newTemplate) {
            setTemplates(prev => [...prev, newTemplate]);
        }
        setShowNewTemplateForm(false);
    };

    return (
        <div className="flex h-[85vh] bg-white rounded-xl shadow-lg overflow-hidden">
            <PromptTemplateList
                templates={templates}
                handleLoadTemplate={handleSendMessage}
                handleEditTemplateClick={handleEditTemplateClick}
                handleDeleteTemplateClick={handleDeleteTemplateClick}
                handleNewTemplateClick={handleAddTemplateClick}
            />

            <MessagesContainer
                messages={messages}
                isLoading={isLoading}
                handleSendMessage={handleSendMessage}
                handleDeleteMessageClick={handleDeleteMessageClick}
                chatContainerRef={chatContainerRef}
                messagesEndRef={messagesEndRef}
                handleScroll={handleScroll}
                settings={settings}
                conversations={conversations}
                handleSettingsClick={handleSettingsClick}
            />

            <ConversationList
                conversations={conversations}
                handleLoadConversation={handleLoadConversation}
                handleEditConversationClick={handleEditConversationClick}
                handleDeleteClick={handleDeleteClick}
                handleNewConversationClick={handleNewConversationClick}
            />

            {showDeletePopup && (
                <DeleteConfirmationPopup
                    confirmDelete={confirmDelete}
                    cancelDelete={cancelDelete}
                />
            )}

            {showClearPopup && (
                <ClearConfirmationPopup
                    confirmClear={confirmClear}
                    cancelClear={cancelClear}
                />
            )}

            {showSettingsForm && <SettingsForm onClose={() => setShowSettingsForm(false)} onSave={closeSettingsForm} />}

            {showEditConversationForm && selectedConversationId && (
                <EditConversationForm
                    conversationId={selectedConversationId}
                    onClose={() => setShowEditConversationForm(false)}
                    onSave={closeEditConversationForm}
                />
            )}

            {showNewConversationForm && (
                <NewConversationForm
                    onClose={() => setShowNewConversationForm(false)}
                    onSave={closeNewConversationForm}
                    username={settings.username}
                />
            )}

            {showNewTemplateForm && (
                <NewTemplateForm
                    onClose={() => setShowNewTemplateForm(false)}
                    onSave={closeNewTemplateForm}
                    username={settings.username}
                />
            )}

            <button
                className="fixed bottom-4 right-4 p-4 bg-red-500 text-white rounded-full shadow-lg"
                onClick={handleClearClick}
                title="Clear All Chat Records"
            >
                🗑️
            </button>

            <RequestCount />
        </div>
    );
};