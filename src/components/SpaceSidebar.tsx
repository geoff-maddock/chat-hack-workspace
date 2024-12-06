// src/components/SpaceSidebar.tsx
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Space, getSpaces, saveSpace, deleteSpace } from '../utils/localStorage';

interface SpaceSidebarProps {
    onSelectSpace: (spaceId: string | null) => void;
}

export const SpaceSidebar: React.FC<SpaceSidebarProps> = ({ onSelectSpace }) => {
    const [spaces, setSpaces] = useState<Space[]>(getSpaces());
    const [showNewSpaceForm, setShowNewSpaceForm] = useState(false);
    const [showEditSpaceForm, setShowEditSpaceForm] = useState<Space | null>(null);

    const handleAddSpace = (title: string, description: string) => {
        const newSpace: Space = {
            id: uuidv4(),
            title,
            description,
            created_at: new Date().toISOString(),
            username: 'current_user' // Replace with actual username
        };
        saveSpace(newSpace);
        setSpaces([...spaces, newSpace]);
        setShowNewSpaceForm(false);
    };

    const handleEditSpace = (updatedSpace: Space) => {
        const updatedSpaces = spaces.map(space => space.id === updatedSpace.id ? updatedSpace : space);
        setSpaces(updatedSpaces);
        saveSpace(updatedSpace);
        setShowEditSpaceForm(null);
    };

    const handleDeleteSpace = (spaceId: string) => {
        deleteSpace(spaceId);
        setSpaces(spaces.filter(space => space.id !== spaceId));
    };

    return (
        <div className="w-1/4 bg-gray-50 border-r border-gray-200 p-4">
            <h2 className="text-xl font-bold mb-4">Spaces</h2>
            <button
                className="p-2 bg-green-500 text-white rounded-full shadow-lg mb-4"
                onClick={() => setShowNewSpaceForm(true)}
            >
                ➕ Add Space
            </button>
            {spaces.map(space => (
                <div key={space.id} className="p-4 bg-white rounded-lg shadow mb-4">
                    <p className="font-bold">{space.title}</p>
                    <p className="text-xs text-gray-500">Created: {new Date(space.created_at).toLocaleString()}</p>
                    <button
                        className="mt-2 p-2 bg-blue-500 text-white rounded-full shadow-lg"
                        onClick={() => onSelectSpace(space.id)}
                    >
                        Select
                    </button>
                    <button
                        className="mt-2 ml-2 p-2 bg-gray-500 text-white rounded-full shadow-lg"
                        onClick={() => setShowEditSpaceForm(space)}
                    >
                        ✏️ Edit
                    </button>
                    <button
                        className="mt-2 ml-2 p-2 bg-red-500 text-white rounded-full shadow-lg"
                        onClick={() => handleDeleteSpace(space.id)}
                    >
                        🗑️ Delete
                    </button>
                </div>
            ))}
            {showNewSpaceForm && (
                <NewSpaceForm onClose={() => setShowNewSpaceForm(false)} onSave={handleAddSpace} />
            )}
            {showEditSpaceForm && (
                <EditSpaceForm space={showEditSpaceForm} onClose={() => setShowEditSpaceForm(null)} onSave={handleEditSpace} />
            )}
        </div>
    );
};

interface NewSpaceFormProps {
    onClose: () => void;
    onSave: (title: string, description: string) => void;
}

const NewSpaceForm: React.FC<NewSpaceFormProps> = ({ onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(title, description);
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

interface EditSpaceFormProps {
    space: Space;
    onClose: () => void;
    onSave: (space: Space) => void;
}

const EditSpaceForm: React.FC<EditSpaceFormProps> = ({ space, onClose, onSave }) => {
    const [title, setTitle] = useState(space.title);
    const [description, setDescription] = useState(space.description);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...space, title, description });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
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