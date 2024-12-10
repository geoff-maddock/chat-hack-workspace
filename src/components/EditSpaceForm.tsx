// src/components/EditSpaceForm.tsx
import React, { useState } from 'react';
import { getSpaces, saveSpace, Space } from '../utils/localStorage';

interface EditSpaceFormProps {
    spaceId: string;
    onClose: (updatedSpace?: Space) => void;
    onSave: (updatedSpace: Space) => void;
}

export const EditSpaceForm: React.FC<EditSpaceFormProps> = ({ spaceId, onClose, onSave }) => {
    const spaces = getSpaces();
    const space = spaces.find(sp => sp.id === spaceId);

    const [title, setTitle] = useState(space?.title || '');
    const [description, setDescription] = useState(space?.description || '');
    const [username, setUsername] = useState(space?.username || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (space) {
            const updatedSpace: Space = {
                ...space,
                title,
                description,
                username
            };
            saveSpace(updatedSpace);
            onSave(updatedSpace);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3"> {/* Adjusted width */}
                <h2 className="text-xl font-bold mb-4">Edit Space</h2>
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