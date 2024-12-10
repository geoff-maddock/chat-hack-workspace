// src/components/ConversationList.tsx

export const ConversationList: React.FC<ConversationListProps> = ({
    conversations,
    handleLoadConversation,
    handleEditConversationClick,
    handleDeleteClick,
    handleNewConversationClick
}) => {
    return (
        <div className="w-1/4 flex flex-col bg-gray-50 border-l border-gray-200">
            <div className="flex items-center justify-between p-4 bg-gray-100 border-b border-gray-200">
                <h2 className="text-xl font-bold">Conversations</h2>
                <button
                    className="p-2 bg-green-500 text-white rounded-full shadow-lg"
                    onClick={handleNewConversationClick}
                    title="New Conversation"
                >
                    ➕
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {conversations.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map(conversation => (
                    <div key={conversation.id} className="p-4 bg-white rounded-lg shadow">
                        <p className="font-bold">{conversation.title}</p>
                        <p className="text-xs text-gray-500">Username: {conversation.username}</p>
                        <p className="text-xs text-gray-500">Created: {new Date(conversation.created_at).toLocaleString()}</p>
                        <button
                            className="mt-2 p-2 bg-blue-500 text-white rounded-full shadow-lg"
                            onClick={() => handleLoadConversation(conversation.id)}
                        >
                            Load
                        </button>
                        <button
                            className="mt-2 ml-2 p-2 bg-gray-500 text-white rounded-full shadow-lg"
                            onClick={() => handleEditConversationClick(conversation.id)}
                        >
                            ✏️
                        </button>
                        <button
                            className="mt-2 ml-2 p-2 bg-red-500 text-white rounded-full shadow-lg"
                            onClick={() => handleDeleteClick(conversation.id)}
                        >
                            🗑️
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};