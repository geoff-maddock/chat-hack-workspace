// src/components/PromptTemplateForm.tsx
import React, { useState } from 'react';
import { PromptTemplate, savePromptTemplate } from '../utils/localStorage';
import { v4 as uuidv4 } from 'uuid';

interface PromptTemplateFormProps {
    onClose: () => void;
    onSave: (template: PromptTemplate) => void;
    username: string;
    template?: PromptTemplate;
}

export const PromptTemplateForm: React.FC<PromptTemplateFormProps> = ({ onClose, onSave, username, template }) => {
    const [title, setTitle] = useState(template?.title || '');
    const [description, setDescription] = useState(template?.description || '');
    const [prompt, setPrompt] = useState(template?.prompt || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newTemplate: PromptTemplate = {
            id: template?.id || uuidv4().toString(),
            title,
            description,
            prompt,
            timestamp: new Date().toISOString(),
            username,
            chatId: template?.chatId || null
        };
        savePromptTemplate(newTemplate);
        onSave(newTemplate);
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">{template ? 'Edit Prompt Template' : 'New Prompt Template'}</h2>
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