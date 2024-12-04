import { ChatInterface } from './components/ChatInterface';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="mx-auto p-6 bg-white rounded-xl shadow-lg w-[1200px]"> {/* Combined container */}
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          ChatHack Workspace <small>Alpha</small>
        </h1>
        <div className="flex flex-col h-[75vh]"> {/* Adjusted height for content */}
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}
export default App;