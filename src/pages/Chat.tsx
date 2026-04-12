import { useState, useRef, useEffect } from 'react';
import { Send, Menu, Sparkles, Copy, Check, Bot, User, Brain, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';
import { generateChatResponse } from '../services/ai';
import { db, ChatMessage } from '../lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '../lib/utils';

export default function Chat() {
  const { toggleSidebar, settings } = useStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [mode, setMode] = useState<'standard' | 'deepseek' | 'grok'>('standard');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const messages = useLiveQuery(() => db.messages.orderBy('timestamp').toArray()) || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    await db.messages.add(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      // Format history for Gemini
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      const responseText = await generateChatResponse(input, history, mode);
      
      let agentName = 'Seraph Core';
      if (mode === 'deepseek') agentName = 'Seraph Deep Thinking';
      if (mode === 'grok') agentName = 'Seraph Unfiltered';

      const aiMessage: ChatMessage = {
        role: 'model',
        content: responseText,
        timestamp: Date.now(),
        agent: agentName
      };
      
      await db.messages.add(aiMessage);
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = {
        role: 'system',
        content: 'Failed to connect to SeraphAI. Please check your connection.',
        timestamp: Date.now(),
      };
      await db.messages.add(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id?: number) => {
    navigator.clipboard.writeText(text);
    if (id) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-black">
      {/* Header */}
      <header className="flex items-center justify-between px-4 h-14 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="p-2 -ml-2 mr-2 md:hidden text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center">
            {mode === 'standard' && <Sparkles className="w-5 h-5 text-orange-500 mr-2" />}
            {mode === 'deepseek' && <Brain className="w-5 h-5 text-blue-500 mr-2" />}
            {mode === 'grok' && <Zap className="w-5 h-5 text-purple-500 mr-2" />}
            <h2 className="font-semibold text-gray-900 dark:text-white">
              {mode === 'standard' && 'Seraph Core'}
              {mode === 'deepseek' && 'Deep Thinking'}
              {mode === 'grok' && 'Unfiltered Mode'}
            </h2>
          </div>
        </div>
        <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <button 
            onClick={() => setMode('standard')}
            className={cn("px-2 py-1 text-xs font-medium rounded-md transition-colors", mode === 'standard' ? "bg-white dark:bg-gray-700 shadow-sm text-orange-600 dark:text-orange-400" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300")}
          >
            Standard
          </button>
          <button 
            onClick={() => setMode('deepseek')}
            className={cn("px-2 py-1 text-xs font-medium rounded-md transition-colors", mode === 'deepseek' ? "bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300")}
          >
            Deep Thinking
          </button>
          <button 
            onClick={() => setMode('grok')}
            className={cn("px-2 py-1 text-xs font-medium rounded-md transition-colors", mode === 'grok' ? "bg-white dark:bg-gray-700 shadow-sm text-purple-600 dark:text-purple-400" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300")}
          >
            Unfiltered
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-tr from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome to SeraphAI</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
              I am your super-intelligent companion. Ask me anything, and I will provide deep, truthful, and structured answers.
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div 
              key={msg.id || idx} 
              className={cn(
                "flex w-full",
                msg.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn(
                "flex max-w-[85%] md:max-w-[75%]",
                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}>
                {/* Avatar */}
                <div className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1",
                  msg.role === 'user' 
                    ? "ml-3 bg-blue-500 text-white" 
                    : "mr-3 bg-gradient-to-tr from-orange-400 to-red-500 text-white"
                )}>
                  {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                {/* Message Bubble */}
                <div className={cn(
                  "flex flex-col space-y-1",
                  msg.role === 'user' ? "items-end" : "items-start"
                )}>
                  {msg.role === 'model' && (
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-1">
                      {msg.agent || 'SeraphAI'}
                    </span>
                  )}
                  
                  <div className={cn(
                    "px-4 py-3 rounded-2xl shadow-sm",
                    msg.role === 'user' 
                      ? "bg-blue-600 text-white rounded-tr-sm" 
                      : msg.role === 'system'
                        ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/30"
                        : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-tl-sm"
                  )}>
                    {msg.role === 'user' ? (
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    ) : (
                      <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-gray-900 prose-pre:text-gray-100">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {msg.role === 'model' && (
                    <div className="flex items-center space-x-2 mt-1 ml-1">
                      <button 
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center space-x-1"
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span className="text-xs">{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex w-full justify-start">
            <div className="flex max-w-[85%] md:max-w-[75%] flex-row">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 mr-3 bg-gradient-to-tr from-orange-400 to-red-500 text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div className="flex flex-col items-start space-y-1">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-1">SeraphAI is thinking...</span>
                <div className="px-4 py-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-tl-sm flex space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto relative flex items-end bg-gray-100 dark:bg-gray-800 rounded-3xl border border-transparent focus-within:border-orange-500/50 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={mode === 'standard' ? "Ask SeraphAI anything..." : mode === 'deepseek' ? "Ask a complex question for deep analysis..." : "Ask anything, unfiltered..."}
            className="w-full max-h-32 min-h-[52px] bg-transparent border-none focus:ring-0 resize-none py-3.5 pl-5 pr-12 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 bottom-2 p-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 disabled:hover:bg-orange-500 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="text-center mt-2">
          <p className="text-[10px] text-gray-400 dark:text-gray-500">
            SeraphAI can make mistakes. Consider verifying important information.
          </p>
        </div>
      </div>
    </div>
  );
}
