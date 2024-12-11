// src/components/NewTemplateForm.tsx
import React, { useState } from 'react';
import { PromptTemplate, savePromptTemplate } from '../utils/localStorage';
import { v4 as uuidv4 } from 'uuid';

interface NewTemplateFormProps {
    onClose: () => void;
    onSave: (template: PromptTemplate) => void;
    username: string;
    reloadTemplates: () => void; // Add this prop
}

export const NewTemplateForm: React.FC<NewTemplateFormProps> = ({ onClose, onSave, username, reloadTemplates }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [prompt, setPrompt] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newTemplate: PromptTemplate = {
            id: uuidv4(), // Generate a new UUID each time
            title,
            description,
            prompt,
            timestamp: new Date().toISOString(),
            username,
            chatId: null
        };
        savePromptTemplate(newTemplate);
        onSave(newTemplate);
        reloadTemplates(); // Call the reload function
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <h2 className="text-xl font-bold mb-4">New Template</h2>
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
                        <label className="block text-sm font-medium mb-2">Prompt</label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button type="button" onClick={onClose} className="mr-4 bg-gray-500 text-white p-2 rounded">Cancel</button>
                        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};