import React, { useState } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';

const TylerAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm Tyler from Benchmark Equipment. How can I help you find the right equipment for your project today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);

  const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;

  const callClaudeAPI = async (userMessage: string) => {
    const systemPrompt = `You are Tyler, a knowledgeable and friendly equipment rental specialist for Benchmark Equipment in Denton, Texas. Your role is to help customers find the right equipment for their construction, landscaping, and industrial projects.

COMPANY INFORMATION:
- Company: Benchmark Equipment
- Location: Denton, Texas (3310 Fort Worth Dr, Denton, TX 76205)
- Services: Equipment rental and sales
- Phone: (817) 403-4334
- Email: tyler@benchmarkequip.com
- Inventory: https://rent.benchmarkequip.com/items

YOUR MAIN GOALS:
1. Ask customers what type of project they're working on
2. Find out their location to ensure we can serve them
3. Understand their timeline and budget constraints
4. Recommend appropriate equipment from our inventory
5. Direct them to https://rent.benchmarkequip.com/items to see availability
6. Encourage them to call (817) 403-4334 or fill out the contact form for quotes

EQUIPMENT CATEGORIES YOU CAN HELP WITH:
- Excavators (mini, small, medium, large)
- Skid steers and track loaders
- Wheel loaders
- Dump trucks and hauling equipment
- Compaction equipment (rollers, plate compactors)
- Concrete equipment
- Landscaping tools
- General construction tools

CONVERSATION FLOW:
1. Greet warmly and ask how you can help
2. Ask about their project type and location
3. Discuss equipment needs based on project requirements
4. Recommend specific equipment types
5. Direct them to the inventory website or contact options
6. Offer to help with any other questions

IMPORTANT GUIDELINES:
- Keep responses concise and helpful (2-3 sentences max)
- Always ask follow-up questions to better understand needs
- If you don't know specific inventory details, direct them to the website
- Never make up equipment availability or pricing
- Always be honest about service areas and capabilities
- Encourage contact via phone or contact form for detailed quotes

Remember: You represent Benchmark Equipment professionally. Be helpful, knowledgeable, and always aim to connect customers with the right equipment solutions.`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 300,
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: userMessage
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.content[0].text;
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
      const aiResponseText = await callClaudeAPI(currentMessage);
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
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors"
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