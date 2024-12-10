// src/App.tsx
import React from 'react';
import { ChatInterface } from './components/ChatInterface';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-8xl p-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          ChatHack Workspace <small>Alpha</small>
        </h1>
        <ChatInterface />
      </div>
    </div>
  );
};

export default App;