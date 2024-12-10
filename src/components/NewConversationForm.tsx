// src/components/NewConversationForm.tsx
import React, { useState } from 'react';
import { ChatConversation, saveChatConversation, getSpaces, Space } from '../utils/localStorage';
import { v4 as uuidv4 } from 'uuid';

interface NewConversationFormProps {
    onClose: () => void;
    onSave: (conversation: ChatConversation) => void;
    username: string;
}

export const NewConversationForm: React.FC<NewConversationFormProps> = ({ onClose, onSave, username }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [spaceId, setSpaceId] = useState<string | null>(null); // Add this line

    const spaces: Space[] = getSpaces(); // Add this line

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newConversation: ChatConversation = {
            id: uuidv4().toString(),
            title,
            description,
            created_at: new Date().toISOString(),
            username,
            spaceId // Add this line
        };
        saveChatConversation(newConversation);
        onSave(newConversation);
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3"> {/* Adjusted width */}
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
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Space</label>
                        <select
                            value={spaceId || ''}
                            onChange={(e) => setSpaceId(e.target.value || null)}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">None</option>
                            {spaces.map(space => (
                                <option key={space.id} value={space.id}>
                                    {space.title}
                                </option>
                            ))}
                        </select>
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