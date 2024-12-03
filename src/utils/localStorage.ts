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