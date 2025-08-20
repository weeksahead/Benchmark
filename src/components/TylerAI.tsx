import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const TylerAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm Tyler AI, your equipment rental assistant. How can I help you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: message,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');

    // Placeholder for AI response - you'll connect this to Claude later
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        text: "Thanks for your message! I'm currently being set up to help you with equipment rentals. Please call (817) 403-4334 for immediate assistance.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <>
      {/* Chat Widget Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
          {/* Header */}
          <div className="bg-red-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <span className="font-semibold">Ask Tyler AI</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-red-700 p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    msg.sender === 'user'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about equipment rentals..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              />
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default TylerAI;