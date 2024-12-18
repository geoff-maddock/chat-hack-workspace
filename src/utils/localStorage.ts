// src/utils/localStorage.ts

export interface ChatRecord {
    id: string;
    request: string;
    response: string;
    timestamp: string;
    model: string;
    systemPrompt: string;
    username: string;
    conversationId: string | null;
}

export interface ChatConversation {
    id: string;
    title: string;
    description: string;
    created_at: string;
    username: string;
    spaceId: string | null;
}

export interface Space {
    id: string;
    title: string;
    description: string;
    created_at: string;
    username: string;
}

export interface PromptTemplate {
    id: string;
    title: string;
    description: string;
    prompt: string;
    timestamp: string;
    username: string;
    chatId: string | null;
}

const CHAT_RECORDS_KEY = 'chat_records';
const CHAT_CONVERSATIONS_KEY = 'chat_conversations';
const SPACES_KEY = 'spaces';
const PROMPT_TEMPLATES_KEY = 'prompt_templates';

export function saveChatRecord(record: ChatRecord) {
    const records = getChatRecords();
    records.push(record);
    localStorage.setItem(CHAT_RECORDS_KEY, JSON.stringify(records));
}

export function getChatRecords(): ChatRecord[] {
    const records = localStorage.getItem(CHAT_RECORDS_KEY);
    return records ? JSON.parse(records) : [];
}

export function deleteChatRecord(id: string) {
    const records = getChatRecords();
    const updatedRecords = records.filter(record => record.id !== id);
    localStorage.setItem(CHAT_RECORDS_KEY, JSON.stringify(updatedRecords));
}

export function clearChatRecords() {
    localStorage.removeItem(CHAT_RECORDS_KEY);
}

export function saveChatConversation(conversation: ChatConversation) {
    const conversations = getChatConversations();
    conversations.push(conversation);
    localStorage.setItem(CHAT_CONVERSATIONS_KEY, JSON.stringify(conversations));
}

export function getChatConversations(): ChatConversation[] {
    const conversations = localStorage.getItem(CHAT_CONVERSATIONS_KEY);
    return conversations ? JSON.parse(conversations) : [];
}

export function deleteChatConversation(id: string) {
    const conversations = getChatConversations();
    const updatedConversations = conversations.filter(conversation => conversation.id !== id);
    localStorage.setItem(CHAT_CONVERSATIONS_KEY, JSON.stringify(updatedConversations));
}

export function clearChatConversations() {
    localStorage.removeItem(CHAT_CONVERSATIONS_KEY);
}

export function saveSpace(space: Space) {
    const spaces = getSpaces();
    spaces.push(space);
    localStorage.setItem(SPACES_KEY, JSON.stringify(spaces));
}

export function getSpaces(): Space[] {
    const spaces = localStorage.getItem(SPACES_KEY);
    return spaces ? JSON.parse(spaces) : [];
}

export function deleteSpace(id: string) {
    const spaces = getSpaces();
    const updatedSpaces = spaces.filter(space => space.id !== id);
    localStorage.setItem(SPACES_KEY, JSON.stringify(updatedSpaces));
}

export function clearSpaces() {
    localStorage.removeItem(SPACES_KEY);
}

// Functions to handle PromptTemplates
export function savePromptTemplate(template: PromptTemplate) {
    const templates = getPromptTemplates();
    templates.push(template);
    localStorage.setItem(PROMPT_TEMPLATES_KEY, JSON.stringify(templates));
}

export function getPromptTemplates(): PromptTemplate[] {
    const templates = localStorage.getItem(PROMPT_TEMPLATES_KEY);
    return templates ? JSON.parse(templates) : [];
}

export function deletePromptTemplate(id: string) {
    const templates = getPromptTemplates();
    const updatedTemplates = templates.filter(template => template.id !== id);
    localStorage.setItem(PROMPT_TEMPLATES_KEY, JSON.stringify(updatedTemplates));
}

export function clearPromptTemplates() {
    localStorage.removeItem(PROMPT_TEMPLATES_KEY);
}