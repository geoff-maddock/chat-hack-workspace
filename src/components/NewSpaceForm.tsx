// src/components/NewSpaceForm.tsx
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { saveSpace, Space } from '../utils/localStorage';

interface NewSpaceFormProps {
    onClose: (newSpace?: Space) => void;
}

export const NewSpaceForm: React.FC<NewSpaceFormProps> = ({ onClose }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [username, setUsername] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newSpace: Space = {
            id: uuidv4().toString(),
            title,
            description,
            created_at: new Date().toISOString(),
            username
        };
        saveSpace(newSpace);
        onClose(newSpace);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">New Space</h2>
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
                        <label className="block text-sm font-medium mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            className="bg-gray-300 px-4 py-2 rounded"
                            onClick={() => onClose()}
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