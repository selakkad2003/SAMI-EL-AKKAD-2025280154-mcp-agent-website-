
import React, { useState, useRef, useEffect } from 'react';
import { Message, ToolCallInfo } from '../types';
import { GoogleGenAI, Type } from "@google/genai";
import { Send, Bot, User, ChevronDown, ChevronUp, Terminal, Image as ImageIcon, Music, Video, Sparkles, Loader2 } from 'lucide-react';

interface AgentChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const AgentChat: React.FC<AgentChatProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your Learning Copilot. I can help you start a new journey, explain concepts, or even generate visuals. What's on your mind?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: (process.env.GEMINI_API_KEY || "") });
      
      // Define tools for the agent
      const tools = [
        {
          functionDeclarations: [
            {
              name: "start_learning_journey",
              parameters: {
                type: Type.OBJECT,
                properties: {
                  topic: { type: Type.STRING, description: "The topic to learn about" },
                  heroName: { type: Type.STRING, description: "The name of the hero" }
                },
                required: ["topic", "heroName"]
              }
            }
          ]
        }
      ];

      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: "You are a helpful Learning Copilot. You have access to tools to start learning journeys. If the user wants to learn something, use the 'start_learning_journey' tool. Always explain what you are doing.",
          tools,
        },
        history: messages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }))
      });

      const result = await chat.sendMessage({ message: input });
      
      // Check for function calls to visualize them
      const functionCalls = result.functionCalls;
      if (functionCalls && functionCalls.length > 0) {
        for (const call of functionCalls) {
          // Add a message showing the tool call
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: `I'm using a tool to help you...`,
            toolCall: {
              name: call.name,
              args: call.args,
              output: "Processing..." // Placeholder
            }
          }]);

          // Simulate tool output for visualization
          setTimeout(() => {
            setMessages(prev => {
              const newMessages = [...prev];
              const lastMsg = newMessages[newMessages.length - 1];
              if (lastMsg.toolCall) {
                lastMsg.toolCall.output = `Successfully initiated journey for ${call.args.topic} with ${call.args.heroName}.`;
              }
              return newMessages;
            });
          }, 1500);
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: result.text || "" }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 w-[400px] h-[600px] glass-panel rounded-3xl shadow-2xl flex flex-col z-[100] border border-white/20 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-gradient-to-r from-purple-600/20 to-pink-600/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-purple-500 p-1.5 rounded-lg">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">Learning Copilot</h3>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-purple-200 uppercase tracking-widest font-bold">Agent Online</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">✕</button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${
              msg.role === 'user' 
                ? 'bg-purple-600 text-white rounded-tr-none' 
                : 'bg-white/10 text-purple-50 text-white rounded-tl-none border border-white/5'
            }`}>
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-1 mb-1 opacity-50">
                  <Bot size={12} />
                  <span className="text-[10px] font-bold uppercase">Copilot</span>
                </div>
              )}
              
              {/* Tool Call Visualization (Advanced Feature) */}
              {msg.toolCall && (
                <div className="mb-3 bg-black/40 rounded-xl border border-purple-500/30 overflow-hidden">
                  <div className="bg-purple-500/20 px-3 py-1.5 flex items-center gap-2 border-b border-purple-500/30">
                    <Terminal size={12} className="text-purple-300" />
                    <span className="text-[10px] font-mono text-purple-200">Tool Call: {msg.toolCall.name}</span>
                  </div>
                  <div className="p-2 font-mono text-[10px] text-purple-100/70 whitespace-pre-wrap">
                    {JSON.stringify(msg.toolCall.args, null, 2)}
                  </div>
                  {msg.toolCall.output && (
                    <div className="border-t border-purple-500/30">
                      <div className="bg-green-500/10 px-3 py-1 flex items-center gap-2">
                        <ChevronDown size={10} className="text-green-400" />
                        <span className="text-[10px] font-mono text-green-400">Output</span>
                      </div>
                      <div className="p-2 font-mono text-[10px] text-green-100/70">
                        {msg.toolCall.output}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="leading-relaxed">
                {msg.content}
              </div>

              {/* Multi-media support (Optional Feature) */}
              {msg.media && (
                <div className="mt-3 space-y-2">
                  {msg.media.type === 'image' && (
                    <img src={msg.media.url} alt="Generated" className="rounded-lg w-full border border-white/10" />
                  )}
                  {msg.media.type === 'audio' && (
                    <audio controls src={msg.media.url} className="w-full h-8" />
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/10 rounded-2xl rounded-tl-none p-3 border border-white/5">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-black/20">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white text-sm focus:outline-none focus:border-purple-500 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 disabled:opacity-50 transition-all"
          >
            <Send size={16} />
          </button>
        </div>
        <div className="mt-2 flex items-center gap-3 px-1">
          <button className="text-[10px] text-white/30 hover:text-purple-300 flex items-center gap-1 transition-colors">
            <ImageIcon size={10} /> Generate Image
          </button>
          <button className="text-[10px] text-white/30 hover:text-purple-300 flex items-center gap-1 transition-colors">
            <Music size={10} /> Text to Speech
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentChat;
