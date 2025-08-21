import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, ArrowLeft } from 'lucide-react';

const TylerAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm Tyler from Benchmark Equipment.",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;

  const callClaudeAPI = async (userMessage: string, conversationHistory: any[]) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          history: conversationHistory
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Claude API error:', error);
      return "Sorry, I'm having trouble connecting right now. Please call us at (817) 403-4334 or use our contact form for immediate assistance. You can also check our available equipment at https://rent.benchmarkequip.com/items";
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      text: message,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = message;
    setMessage('');
    setIsLoading(true);

    try {
      // Convert messages to Claude format (excluding the AI's initial greeting)
      const conversationHistory = messages.slice(1).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      const aiResponseText = await callClaudeAPI(currentMessage, conversationHistory);
      const aiResponse = {
        id: messages.length + 2,
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      const errorResponse = {
        id: messages.length + 2,
        text: "Sorry, I'm having trouble connecting right now. Please call us at (817) 403-4334 or use our contact form for immediate assistance.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Widget Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-red-600 hover:bg-red-700 text-white p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
        >
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 sm:bottom-6 sm:right-6 sm:inset-auto sm:w-80 sm:h-96 bg-white sm:rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
          {/* Header */}
          <div className="bg-red-600 text-white p-4 sm:rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* Mobile back button */}
              <button
                onClick={() => setIsOpen(false)}
                className="sm:hidden hover:bg-red-700 p-1 rounded mr-1"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <MessageCircle className="w-5 h-5" />
              <span className="font-semibold">Ask Tyler AI</span>
            </div>
            {/* Desktop close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="hidden sm:block hover:bg-red-700 p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs sm:max-w-xs px-4 py-3 rounded-lg text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.text.split('\n').map((line, index) => (
                    <div key={index} className={index > 0 ? 'mt-1' : ''}>
                      {line || '\u00A0'}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
            <div className="flex space-x-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about equipment rentals..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white p-3 rounded-lg transition-colors"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default TylerAI;