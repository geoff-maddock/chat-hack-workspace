import React, { useState } from 'react';
import { getSettings, saveSettings, Settings, defaultSettings } from '../utils/settings';

interface SettingsFormProps {
    onClose: () => void;
    onSave: (settings: Settings) => void;
}

const modelOptions = [
    'gpt-4o',
    'azure/gpt-40',
    'claude-3-5-sonnet-20240620',
    'dalle-e-3',
    'gemini/gemini-1.5-pro',
    'claude-3-haiku-20240307',
    'claude-3-opus-20240229',
    'gemini/gemini-1.5-flash',
    'gpt-4',
    'gpt-4-turbo-preview',
    'gpt-4o-mini'
];

export const SettingsForm: React.FC<SettingsFormProps> = ({ onClose, onSave }) => {
    const [settings, setSettings] = useState<Settings>(getSettings());

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        saveSettings(settings);
        onSave(settings);
        onClose();
    };

    const handleReset = () => {
        setSettings(defaultSettings);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3"> {/* Adjusted width */}
                <h2 className="text-xl font-bold mb-4">Settings</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Model</label>
                        <select
                            name="model"
                            value={settings.model}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        >
                            {modelOptions.map(option => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">System Prompt</label>
                        <textarea
                            name="systemPrompt"
                            value={settings.systemPrompt}
                            onChange={handleChange}
                            rows={6}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={settings.username}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <button
                            type="button"
                            className="bg-gray-300 px-4 py-2 rounded"
                            onClick={handleReset}
                        >
                            Reset
                        </button>
                        <div className="flex space-x-2">
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
                    </div>
                </form>
            </div>
        </div>
    );
};