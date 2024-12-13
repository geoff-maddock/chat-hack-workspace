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
import { RequestCount } from './RequestCount';
import { generateChatResponse, ChatMessage as Message } from '../utils/openaiClient';
import { saveChatRecord, getChatRecords, deleteChatRecord, clearChatRecords, ChatRecord, saveChatConversation, getChatConversations, deleteChatConversation, clearChatConversations, ChatConversation, PromptTemplate, savePromptTemplate, getPromptTemplates, deletePromptTemplate } from '../utils/localStorage';
import { getSettings, saveSettings, Settings } from '../utils/settings';

export const ChatInterface: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [conversations, setConversations] = useState<ChatConversation[]>(getChatConversations());
    const [templates, setTemplates] = useState<PromptTemplate[]>(getPromptTemplates());

    const [isLoading, setIsLoading] = useState(false);
    const [isUserScrolling, setIsUserScrolling] = useState(false); // Track user scrolling
    const [showDeletePopup, setShowDeletePopup] = useState(false);

    const [deleteMessageId, setDeleteMessageId] = useState<string | null>(null); // Track message to be deleted
    const [deleteConversationId, setDeleteConversationId] = useState<string | null>(null); // Track conversation to be deleted
    const [deleteTemplateId, setDeleteTemplateId] = useState<string | null>(null); // Track template to be deleted

    const [showClearPopup, setShowClearPopup] = useState(false);
    const [showSettingsForm, setShowSettingsForm] = useState(false);

    const [showEditConversationForm, setShowEditConversationForm] = useState(false);
    const [showNewConversationForm, setShowNewConversationForm] = useState(false);

    const [settings, setSettings] = useState<Settings>(getSettings());

    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(settings.conversationId);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(settings.templateId);

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
        setTemplates(getPromptTemplates());
    }, []);


    useEffect(() => {
        const records = getChatRecords().filter(record => record.conversationId === settings.conversationId);
        const loadedMessages: Message[] = records.flatMap(record => [
            { role: 'user' as const, content: record.request, timestamp: record.timestamp, username: record.username, model: record.model, id: record.id },
            { role: 'assistant' as const, content: record.response, timestamp: record.timestamp, username: record.username, model: record.model, id: record.id }
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
    }, []);

    const handleSendMessage = useCallback(async (userMessage: string) => {
        if (!userMessage.trim()) return;

        const currentSettings = getSettings();
        const newUserMessage: Message = { role: 'user', content: userMessage, timestamp: new Date().toISOString(), username: currentSettings.username, model: currentSettings.model, id: uuidv4().toString() };
        setMessages(prev => [...prev, newUserMessage]);
        setIsLoading(true);

        try {
            const response = await generateChatResponse([
                { role: 'system', content: currentSettings.systemPrompt },
                ...messages,
                newUserMessage
            ], currentSettings.model);

            const newAIMessage: Message = { role: 'assistant', content: response, timestamp: new Date().toISOString(), username: currentSettings.username, model: currentSettings.model, id: uuidv4().toString() };
            setMessages(prev => [...prev, newAIMessage]);

            const chatRecord: ChatRecord = {
                id: newUserMessage.id,
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
                { role: 'assistant', content: 'Sorry, I encountered an error while processing your request.', timestamp: new Date().toISOString(), username: currentSettings.username, model: currentSettings.model, id: uuidv4().toString() }
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
            { role: 'user', content: record.request, timestamp: record.timestamp, username: record.username, model: record.model, id: record.id },
            { role: 'assistant', content: record.response, timestamp: record.timestamp, username: record.username, model: record.model, id: record.id }
        ]);
        setMessages(loadedMessages);
        setSettings(prev => ({ ...prev, conversationId }));
        saveSettings({ ...settings, conversationId });
    };

    const handleDeleteMessageClick = (messageId: string) => {
        setDeleteMessageId(messageId);
        setShowDeletePopup(true);
    };

    const handleDeleteConversationClick = (conversationId: string) => {
        setDeleteConversationId(conversationId);
        setShowDeletePopup(true);
    };

    const handleDeleteTemplateClick = (templateId: string) => {
        setDeleteTemplateId(templateId);
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
            // Delete all chat records associated with the conversation
            const records = getChatRecords().filter(record => record.conversationId === deleteConversationId);
            records.forEach(record => deleteChatRecord(record.id));

            // Delete the conversation
            deleteChatConversation(deleteConversationId);

            // Update state
            const updatedConversations = conversations.filter(conv => conv.id !== deleteConversationId);
            setConversations(updatedConversations);
            localStorage.setItem('chat_conversations', JSON.stringify(updatedConversations));

            // Clear messages if the deleted conversation was the selected one
            if (deleteConversationId === selectedConversationId) {
                setMessages([]);
                setSelectedConversationId(null);
            }

            setDeleteConversationId(null);
            setShowDeletePopup(false);
        } else if (deleteTemplateId) {
            deletePromptTemplate(deleteTemplateId);
            const updatedTemplates = templates.filter(template => template.id !== deleteTemplateId);
            setTemplates(updatedTemplates);
            setDeleteTemplateId(null);
            setShowDeletePopup(false);
        }
    };

    const cancelDelete = () => {
        setDeleteMessageId(null);
        setDeleteConversationId(null);
        setShowDeletePopup(false);
    };

    const handleNewTemplateSave = (newTemplate: PromptTemplate) => {
        setTemplates(prevTemplates => [...prevTemplates, newTemplate]);
    };


    const handleEditTemplateClick = (templateId: string) => {
        setSelectedTemplateId(templateId);
        setShowEditTemplateForm(true);
    };


    return (
        <div className="flex h-[85vh] bg-white rounded-xl shadow-lg overflow-hidden">
            <PromptTemplateList
                templates={templates}
                setTemplates={setTemplates}
                handleNewTemplateSave={handleNewTemplateSave}
                handleEditTemplateClick={handleEditTemplateClick}
                handleDeleteTemplateClick={handleDeleteTemplateClick}
                getPromptTemplates={getPromptTemplates}
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
                handleDeleteConversationClick={handleDeleteConversationClick}
                handleNewConversationClick={handleNewConversationClick}
            />

            {showDeletePopup && (
                <DeleteConfirmationPopup
                    confirmDelete={confirmDelete}
                    cancelDelete={cancelDelete}
                    deleteMessage={deleteMessageId ? 'Are you sure you want to delete this message?' : deleteConversationId ? 'Are you sure you want to delete this conversation and all related chats?' : 'Are you sure you want to delete this template?'}
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