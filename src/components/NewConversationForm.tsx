import React, { useState } from 'react';
import { ChatConversation, saveChatConversation } from '../utils/localStorage';
import { v4 as uuidv4 } from 'uuid';

interface NewConversationFormProps {
    onClose: () => void;
    onSave: (conversation: ChatConversation) => void;
    username: string;
}

export const NewConversationForm: React.FC<NewConversationFormProps> = ({ onClose, onSave, username }) => {
    const [title, setTitle] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newConversation: ChatConversation = {
            id: uuidv4().toString(),
            title,
            created_at: new Date().toISOString(),
            username
        };
        saveChatConversation(newConversation);
        onSave(newConversation);
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">New Conversation</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            className="bg-gray-300 px-4 py-2 rounded"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};