// src/components/ClearConfirmationPopup.tsx
import React from 'react';

interface ClearConfirmationPopupProps {
    confirmClear: () => void;
    cancelClear: () => void;
}

export const ClearConfirmationPopup: React.FC<ClearConfirmationPopupProps> = ({
    confirmClear,
    cancelClear
}) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <p>Are you sure you want to clear all chat records?</p>
                <div className="mt-4 flex justify-end space-x-2">
                    <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={confirmClear}>
                        Yes
                    </button>
                    <button className="bg-gray-300 px-4 py-2 rounded" onClick={cancelClear}>
                        No
                    </button>
                </div>
            </div>
        </div>
    );
};