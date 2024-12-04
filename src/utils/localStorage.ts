// src/utils/localStorage.ts

export interface ChatRecord {
    id: string;
    request: string;
    response: string;
    timestamp: string;
}

const STORAGE_KEY = 'chat_records';

export function saveChatRecord(record: ChatRecord) {
    const records = getChatRecords();
    records.push(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function getChatRecords(): ChatRecord[] {
    const records = localStorage.getItem(STORAGE_KEY);
    return records ? JSON.parse(records) : [];
}

export function deleteChatRecord(id: string) {
    const records = getChatRecords();
    const updatedRecords = records.filter(record => record.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));
}

export function clearChatRecords() {
    localStorage.removeItem(STORAGE_KEY);
}