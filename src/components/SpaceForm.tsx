// src/components/SpaceForm.tsx
import React, { useState } from 'react';
import { Space, saveSpace, getSpaces, deleteSpace } from '../utils/localStorage';
import { v4 as uuidv4 } from 'uuid';

interface SpaceFormProps {
    onClose: () => void;
    onSave: (space: Space) => void;
    space?: Space;
}

export const SpaceForm: React.FC<SpaceFormProps> = ({ onClose, onSave, space }) => {
    const [title, setTitle] = useState(space?.title || '');
    const [description, setDescription] = useState(space?.description || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newSpace: Space = {
            id: space?.id || uuidv4().toString(),
            title,
            description,
            created_at: space?.created_at || new Date().toISOString(),
            username: space?.username || 'defaultUser' // Replace with actual username logic
        };
        saveSpace(newSpace);
        onSave(newSpace);
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">{space ? 'Edit Space' : 'New Space'}</h2>
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