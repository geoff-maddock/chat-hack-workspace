// src/components/EditTemplateForm.tsx
import React, { useState, useEffect } from 'react';
import { PromptTemplate, savePromptTemplate, getPromptTemplates } from '../utils/localStorage';

interface EditTemplateFormProps {
    templateId: string;
    onClose: () => void;
    onSave: (template: PromptTemplate) => void;
    username: string;
}

export const EditTemplateForm: React.FC<EditTemplateFormProps> = ({ templateId, onClose, onSave, username }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [prompt, setPrompt] = useState('');

    useEffect(() => {
        const templates = getPromptTemplates();
        const template = templates.find(t => t.id === templateId);
        if (template) {
            setTitle(template.title);
            setDescription(template.description);
            setPrompt(template.prompt);
        }
    }, [templateId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedTemplate: PromptTemplate = {
            id: templateId,
            title,
            description,
            prompt,
            timestamp: new Date().toISOString(),
            username,
            chatId: null
        };
        savePromptTemplate(updatedTemplate);
        onSave(updatedTemplate);
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3"> {/* Adjusted width */}
                <h2 className="text-xl font-bold mb-4">Edit Template</h2>
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
                            rows={10}
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