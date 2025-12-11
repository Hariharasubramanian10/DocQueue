import React, { useState } from 'react';
import { generateMedicalAssistantResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

interface ChatbotAssistantProps {
  currentSymptoms?: string;
  currentDiagnosis?: string;
}

const ChatbotAssistant: React.FC<ChatbotAssistantProps> = ({ currentSymptoms, currentDiagnosis }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const context = `Symptoms: ${currentSymptoms || 'None provided'}. Diagnosis: ${currentDiagnosis || 'None provided'}.`;
    
    try {
      const responseText = await generateMedicalAssistantResponse(context, input);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Error connecting to AI." }]);
    } finally {
      setLoading(false);
    }
  };

  // Minimized State
  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 shadow-lg transition-all z-[60] flex items-center gap-2"
        title="Open AI Assistant"
      >
        <i className="fa-solid fa-robot text-xl"></i>
        <span className="font-semibold hidden sm:inline">AI Assistant</span>
      </button>
    );
  }

  // Expanded State
  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] max-h-[80vh] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col z-[60] overflow-hidden animate-fade-in-up">
      {/* Header - Increased height and padding for better Close button access */}
      <div className="bg-purple-600 p-5 flex justify-between items-center text-white shadow-md">
        <h3 className="font-bold flex items-center gap-3 text-lg">
          <i className="fa-solid fa-robot"></i> Gemini Med-Assist
        </h3>
        <button 
          onClick={(e) => {
             e.stopPropagation();
             setIsOpen(false);
          }} 
          className="hover:bg-purple-700 hover:text-white text-purple-100 p-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Close Chat"
          title="Close"
        >
          <i className="fa-solid fa-times text-xl w-6 h-6 flex items-center justify-center"></i>
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-robot text-purple-600 text-2xl"></i>
            </div>
            <p className="font-medium text-gray-800">Hello, Doctor!</p>
            <p className="text-sm mt-2">I can help you analyze symptoms or draft prescriptions based on your current notes.</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-lg p-3 text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-purple-600 text-white rounded-br-none' 
                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 rounded-lg px-4 py-2 text-sm text-gray-500 animate-pulse flex items-center gap-2">
              <i className="fa-solid fa-circle-notch fa-spin"></i> Thinking...
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 focus:bg-white transition-colors"
            placeholder="Ask AI assistant..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="bg-purple-600 text-white rounded-lg px-4 hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotAssistant;