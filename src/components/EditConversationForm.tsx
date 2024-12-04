import React, { useState } from 'react';
import { ChatConversation, saveChatConversation, getChatConversations } from '../utils/localStorage';

interface EditConversationFormProps {
    conversationId: string;
    onClose: () => void;
    onSave: (conversation: ChatConversation) => void;
}

export const EditConversationForm: React.FC<EditConversationFormProps> = ({ conversationId, onClose, onSave }) => {
    const conversations = getChatConversations();
    const conversation = conversations.find(conv => conv.id === conversationId);

    const [title, setTitle] = useState(conversation?.title || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (conversation) {
            const updatedConversation: ChatConversation = {
                ...conversation,
                title,
            };
            saveChatConversation(updatedConversation);
            onSave(updatedConversation);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Edit Conversation</h2>
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