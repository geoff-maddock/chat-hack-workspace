// src/utils/requestCounter.ts

const REQUEST_COUNT_KEY = 'api_request_count';

interface RequestLog {
    timestamp: number;
}

export function incrementRequestCount() {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;

    let requestLogs: RequestLog[] = JSON.parse(localStorage.getItem(REQUEST_COUNT_KEY) || '[]');

    // Filter out requests older than one hour
    requestLogs = requestLogs.filter(log => log.timestamp > oneHourAgo);

    // Add the new request log
    requestLogs.push({ timestamp: now });

    // Save the updated logs back to local storage
    localStorage.setItem(REQUEST_COUNT_KEY, JSON.stringify(requestLogs));
}

export function getRequestCount() {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;

    const requestLogs: RequestLog[] = JSON.parse(localStorage.getItem(REQUEST_COUNT_KEY) || '[]');

    // Filter out requests older than one hour
    const recentRequests = requestLogs.filter(log => log.timestamp > oneHourAgo);

    return recentRequests.length;
}