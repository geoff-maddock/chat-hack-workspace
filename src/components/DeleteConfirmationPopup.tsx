// src/components/DeleteConfirmationPopup.tsx
import React from 'react';

interface DeleteConfirmationPopupProps {
    confirmDelete: () => void;
    cancelDelete: () => void;
}

export const DeleteConfirmationPopup: React.FC<DeleteConfirmationPopupProps> = ({
    confirmDelete,
    cancelDelete
}) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <p>Are you sure you want to delete this conversation and all related chats?</p>
                <div className="mt-4 flex justify-end space-x-2">
                    <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={confirmDelete}>
                        Yes
                    </button>
                    <button className="bg-gray-300 px-4 py-2 rounded" onClick={cancelDelete}>
                        No
                    </button>
                </div>
            </div>
        </div>
    );
};