
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, User, Bot, Loader2, Sparkles, Mic } from 'lucide-react';
import { sendChatMessage } from '../services/geminiService';
import { ChatMessage, MessageRole } from '../types';
import { useLanguage } from '../LanguageContext';

const ChatInterface: React.FC = () => {
  const { t, language, dir } = useLanguage();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  
  // Initialize welcome message when language changes
  useEffect(() => {
    // Only reset if messages are empty to avoid wiping conversation on language switch, 
    // or if we really want to ensure the welcome message is in correct lang on first load
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: MessageRole.MODEL,
        text: t('chat_welcome'),
        timestamp: new Date()
      }]);
    }
  }, [language, t, messages.length]); 

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors on cleanup
        }
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role === MessageRole.USER ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const responseText = await sendChatMessage(history, userMsg.text, language);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: MessageRole.MODEL,
        text: responseText || t('chat_offline'),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: MessageRole.MODEL,
        text: t('chat_error'),
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoiceInput = useCallback(() => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
            recognitionRef.current.stop();
        } catch(e) { console.warn(e); }
      }
      setIsListening(false);
      return;
    }

    // Safety check for window existence (SSR protection)
    if (typeof window === 'undefined') return;

    // Browser support check
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'ar' ? 'ar-SA' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
            setInput(prev => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      console.error("Failed to start speech recognition:", error);
      setIsListening(false);
    }
  }, [isListening, language]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800">{t('ai_assistant')}</h2>
            <p className="text-xs text-slate-500 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mx-1"></span>
              Online • Powered by Gemini
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[80%] ${msg.role === MessageRole.USER ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                msg.role === MessageRole.USER ? 'bg-slate-200' : 'bg-brand-600'
              }`}>
                {msg.role === MessageRole.USER ? (
                  <User className="w-5 h-5 text-slate-600" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>
              
              <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === MessageRole.USER 
                  ? 'bg-slate-800 text-white rounded-tr-none rtl:rounded-tl-none rtl:rounded-tr-2xl' 
                  : msg.isError 
                    ? 'bg-red-50 text-red-600 border border-red-100 rounded-tl-none rtl:rounded-tr-none rtl:rounded-tl-2xl'
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none rtl:rounded-tr-none rtl:rounded-tl-2xl'
              }`}>
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div className={`text-[10px] mt-2 opacity-70 ${msg.role === MessageRole.USER ? 'text-slate-300' : 'text-slate-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-600 rounded-full flex-shrink-0 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-tl-none rtl:rounded-tr-none rtl:rounded-tl-2xl border border-slate-100 shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100 flex-shrink-0">
        <div className="relative">
          {/* Voice Input Button */}
          <button
            onClick={toggleVoiceInput}
            disabled={isLoading}
            title={isListening ? t('listening') : 'Voice Input'}
            className={`absolute ${dir === 'rtl' ? 'right-2' : 'left-2'} top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-200 z-10 ${
              isListening 
                ? 'bg-red-100 text-red-600 animate-pulse' 
                : 'text-slate-400 hover:text-brand-600 hover:bg-slate-100'
            } disabled:opacity-50`}
          >
            <Mic className={`w-4 h-4 ${isListening ? 'scale-110' : ''}`} />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={isListening ? t('listening') : t('chat_placeholder')}
            className={`w-full ${dir === 'rtl' ? 'pr-12 pl-12' : 'pl-12 pr-12'} py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-700 placeholder:text-slate-400`}
            disabled={isLoading}
          />
          
          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`absolute ${dir === 'rtl' ? 'left-2' : 'right-2'} top-1/2 transform -translate-y-1/2 p-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:hover:bg-brand-600 transition-colors ${dir === 'rtl' ? 'rotate-180' : ''}`}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
