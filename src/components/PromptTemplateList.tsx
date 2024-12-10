// src/components/PromptTemplateList.tsx
import React, { useState } from 'react';
import { PromptTemplate, getPromptTemplates, deletePromptTemplate } from '../utils/localStorage';
import { NewTemplateForm } from './NewTemplateForm';
import { EditTemplateForm } from './EditTemplateForm';
import { getSettings, saveSettings } from '../utils/settings';

interface PromptTemplateListProps {
    templates: PromptTemplate[];
    handleLoadTemplate: (templateId: string) => void;
    handleEditTemplateClick: (templateId: string) => void;
    handleDeleteTemplateClick: (templateId: string) => void;
    handleNewTemplateClick: () => void;
}

export const PromptTemplateList: React.FC<PromptTemplateListProps> = ({
    templates,
    handleLoadTemplate,
    handleEditTemplateClick,
    handleDeleteTemplateClick,
    handleNewTemplateClick
}) => {
    const [showNewTemplateForm, setShowNewTemplateForm] = useState(false);
    const [showEditTemplateForm, setShowEditTemplateForm] = useState(false);
    const [currentTemplateId, setCurrentTemplateId] = useState<string | null>(null);

    const handleNewTemplateSave = (newTemplate: PromptTemplate) => {
        handleNewTemplateClick();
        setShowNewTemplateForm(false);
    };

    const handleEditTemplateSave = (updatedTemplate: PromptTemplate) => {
        handleEditTemplateClick(updatedTemplate.id);
        setShowEditTemplateForm(false);
    };

    const handleEditClick = (templateId: string) => {
        setCurrentTemplateId(templateId);
        setShowEditTemplateForm(true);
    };

    const handleSetAsSystemPrompt = (prompt: string) => {
        const settings = getSettings();
        settings.systemPrompt = prompt;
        saveSettings(settings);
    };

    return (
        <div className="w-1/3 flex flex-col bg-gray-50 border-r border-gray-200">
            <div className="flex items-center justify-between p-4 bg-gray-100 border-b border-gray-200">
                <h2 className="text-xl font-bold">Prompt Templates</h2>
                <button
                    className="p-2 bg-green-500 text-white rounded-full shadow-lg"
                    onClick={() => setShowNewTemplateForm(true)}
                    title="New Template"
                >
                    ➕
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {templates.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(template => (
                    <div key={template.id} className="p-4 bg-white rounded-lg shadow">
                        <p className="font-bold">{template.title}</p>
                        <p className="text-xs text-gray-500">Username: {template.username}</p>
                        <p className="text-xs text-gray-500">Created: {new Date(template.timestamp).toLocaleString()}</p>
                        <button
                            className="mt-2 p-2 bg-blue-500 text-white rounded-full shadow-lg"
                            onClick={() => handleEditClick(template.id)}
                        >
                            ✏️
                        </button>
                        <button
                            className="mt-2 ml-2 p-2 bg-red-500 text-white rounded-full shadow-lg"
                            onClick={() => handleDeleteTemplateClick(template.id)}
                        >
                            🗑️
                        </button>
                        <button
                            className="mt-2 ml-2 p-2 bg-gray-500 text-white rounded-full shadow-lg"
                            onClick={() => handleSetAsSystemPrompt(template.prompt)}
                            title="Set as System Prompt"
                        >
                            ➡️
                        </button>
                    </div>
                ))}
            </div>

            {showNewTemplateForm && (
                <NewTemplateForm
                    onClose={() => setShowNewTemplateForm(false)}
                    onSave={handleNewTemplateSave}
                    username="current_user" // Replace with actual username
                />
            )}

            {showEditTemplateForm && currentTemplateId && (
                <EditTemplateForm
                    templateId={currentTemplateId}
                    onClose={() => setShowEditTemplateForm(false)}
                    onSave={handleEditTemplateSave}
                    username="current_user" // Replace with actual username
                />
            )}
        </div>
    );
};