import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot, Sparkles, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const categories = [
  'North Indian', 'Pizza', 'Burger', 'Sushi', 'Mexican', 
  'Desserts', 'Cake', 'Biryani', 'South Indian', 'Salad', 
  'Dosa', 'Rolls', 'Coffee', 'Chinese'
];

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I am Piggy AI. 🐽 Craving something? Just say "I want pizza" or "Take me to burgers" and I will handle the rest!' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await api.post('/chat', { 
        message: userMessage,
        history: messages 
      });
      
      const botResponse = response.data.text;
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
      
      // Check for navigation trigger
      if (botResponse.includes('NAVIGATE:')) {
        const parts = botResponse.split('NAVIGATE:');
        const categoryToNavigate = parts[1].trim().split('\n')[0].replace(/[.!?]/g, '');
        
        // Find if this is a valid category
        const matched = categories.find(cat => 
          categoryToNavigate.toLowerCase().includes(cat.toLowerCase())
        );

        if (matched) {
          setTimeout(() => {
            navigate(`/category/${encodeURIComponent(matched)}`);
          }, 1500);
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage = err.response?.data?.text || "I'm having trouble connecting to my brain. 🐽 Please make sure the backend is running!";
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: errorMessage 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-[350px] h-[500px] bg-white rounded-[2rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-orange-500 p-6 flex items-center justify-between text-white shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-black text-lg leading-none">Piggy AI</h3>
                  <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest flex items-center gap-1">
                    <Sparkles size={8} /> Online
                  </span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Chat Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth"
            >
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-3xl text-sm font-medium ${
                    msg.role === 'user' 
                      ? 'bg-gray-100 text-gray-800 rounded-tr-none' 
                      : 'bg-orange-50 text-orange-900 rounded-tl-none border border-orange-100'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-orange-50 p-4 rounded-3xl rounded-tl-none border border-orange-100 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-orange-300 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-orange-300 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-orange-300 rounded-full animate-bounce delay-150"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-6 pt-0">
              <div className="relative group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask for pizza, sushi, or just say hi..."
                  className="w-full pl-5 pr-14 py-4 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-2xl text-sm font-semibold transition-all outline-none"
                />
                <button 
                  type="submit"
                  disabled={!input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white p-2.5 rounded-xl disabled:opacity-30 transition-all hover:bg-black"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all ${
          isOpen ? 'bg-gray-900 text-white rotate-90' : 'bg-orange-500 text-white'
        }`}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-orange-600"></span>
          </span>
        )}
      </motion.button>
    </div>
  );
}
