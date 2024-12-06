// src/components/RequestCount.tsx
import React, { useEffect, useState } from 'react';
import { getRequestCount } from '../utils/requestCounter';
import { getSettings } from '../utils/settings';

export const RequestCount: React.FC = () => {
    const [requestCount, setRequestCount] = useState<number>(0);
    const [totalRequests, setTotalRequests] = useState<number>(0);

    useEffect(() => {
        const updateRequestCount = () => {
            setRequestCount(getRequestCount());
            const settings = getSettings();
            setTotalRequests(settings.totalRequests || 0);
        };

        // Update the request count initially
        updateRequestCount();

        // Set an interval to update the request count every minute
        const intervalId = setInterval(updateRequestCount, 60000);

        // Clear the interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="fixed bottom-4 right-20 p-2 bg-gray-800 text-white rounded-full shadow-lg">
            <div>Total requests: {totalRequests}</div>
            <div>Last hour: {requestCount}</div>
        </div>
    );
};