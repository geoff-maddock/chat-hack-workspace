import React from 'react';
import ReactMarkdown from 'react-markdown';
import { User, Bot } from 'lucide-react';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface ChatMessageProps {
    content: string;
    role: 'user' | 'assistant' | 'system';
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ content, role }) => {
    const isUser = role === 'user';

    return (
        <div className={`flex items-start space-x-3 p-4 ${isUser ? 'bg-blue-50' : 'bg-gray-50'}`}>
            <div className={`p-2 rounded-full ${isUser ? 'bg-blue-500' : 'bg-gray-500'}`}>
                {isUser ? <User className="text-white" size={20} /> : <Bot className="text-white" size={20} />}
            </div>
            <div className="flex-1 prose max-w-full">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                        h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-2" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-xl font-semibold mb-1" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-lg font-medium mb-1" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-2" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-2" {...props} />,
                        code: ({ node, className, children, ...props }) => (
                            <code
                                className={`${className} bg-gray-100 rounded px-1 py-0.5 text-sm font-mono`}
                                {...props}
                            >
                                {children}
                            </code>
                        ),
                        pre: ({ node, children, ...props }) => (
                            <pre
                                className="bg-gray-100 p-3 rounded-md overflow-x-auto text-sm mb-2"
                                {...props}
                            >
                                {children}
                            </pre>
                        ),
                        a: ({ node, ...props }) => (
                            <a
                                className="text-blue-600 hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                                {...props}
                            />
                        ),
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </div>
    );
};