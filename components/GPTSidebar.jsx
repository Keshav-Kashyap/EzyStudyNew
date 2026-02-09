
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import PromptInput from '@/components/ui/gptInput';
import { Sparkles, Bot, User, X, Trash2, Copy, Check } from 'lucide-react';

const GPTSidebar = ({ open, onClose, messages: externalMessages }) => {
    const [context, setContext] = useState('general');
    const [messages, setMessages] = useState(externalMessages || []);
    const [loading, setLoading] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const messagesEndRef = useRef(null);

    if (!open) return null;

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    // Send message to backend
    const handleSend = async (input) => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input, context, timestamp: Date.now() };
        setMessages(msgs => [...msgs, userMessage]);
        setLoading(true);

        try {
            const res = await fetch('/api/gpt-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    context,
                    history: messages.slice(-6) // Send last 3 exchanges for context
                })
            });

            const data = await res.json();

            if (data.ok && data.reply) {
                setMessages(msgs => [...msgs, {
                    role: 'assistant',
                    content: data.reply,
                    context,
                    timestamp: Date.now()
                }]);
            } else {
                setMessages(msgs => [...msgs, {
                    role: 'assistant',
                    content: '❌ Error: ' + (data.error || 'Unknown error occurred'),
                    context,
                    timestamp: Date.now(),
                    isError: true
                }]);
            }
        } catch (e) {
            setMessages(msgs => [...msgs, {
                role: 'assistant',
                content: '❌ Network Error: Could not connect to AI service',
                context,
                timestamp: Date.now(),
                isError: true
            }]);
        }
        setLoading(false);
    };

    // Clear all messages
    const handleClearChat = () => {
        if (confirm('Clear all chat history?')) {
            setMessages([]);
        }
    };

    // Copy message to clipboard
    const handleCopy = async (content, index) => {
        try {
            await navigator.clipboard.writeText(content);
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="fixed right-0 top-0 bottom-0 w-full sm:w-[500px] z-50 bg-zinc-900 border-l border-zinc-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="border-b border-zinc-800 bg-zinc-900 sticky top-0 z-10">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                                <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
                            </div>
                            <div>
                                <h2 className="font-bold text-lg text-zinc-100">AI Assistant</h2>
                                <p className="text-xs text-zinc-400">Powered by Groq</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {messages.length > 0 && (
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleClearChat}
                                    className="text-zinc-400 hover:text-red-400 hover:bg-red-950/30"
                                    title="Clear chat"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            )}
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={onClose}
                                className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center px-6">
                            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-8 rounded-2xl mb-4 border border-zinc-800">
                                <Sparkles className="w-16 h-16 text-blue-400 mx-auto" />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-100 mb-2">Start a Conversation</h3>
                            <p className="text-zinc-400 text-sm max-w-sm">
                                Ask me anything! I'm here to help you with your studies, homework, and questions.
                            </p>
                        </div>
                    ) : (
                        <>
                            {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-3 duration-300`}
                            >
                                {msg.role === 'assistant' && (
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                                            <Bot className="w-5 h-5 text-white" />
                                        </div>
                                    </div>
                                )}

                                <div className={`max-w-[80%] group ${msg.role === 'user' ? 'order-first' : ''}`}>
                                    <div className={`rounded-2xl px-4 py-3 shadow-sm ${msg.role === 'user'
                                            ? 'bg-blue-600 text-white'
                                            : msg.isError
                                                ? 'bg-red-950/50 text-red-200 border border-red-800/50'
                                                : 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                                        }`}>
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                            {msg.content}
                                        </p>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex items-center gap-2 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleCopy(msg.content, idx)}
                                            className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 px-2 py-1 rounded hover:bg-zinc-800/50"
                                            title="Copy message"
                                        >
                                            {copiedIndex === idx ? (
                                                <>
                                                    <Check className="w-3 h-3" />
                                                    <span>Copied!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-3 h-3" />
                                                    <span>Copy</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {msg.role === 'user' && (
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {loading && (
                            <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                                        <Bot className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                                <div className="bg-zinc-800 rounded-2xl px-4 py-3 border border-zinc-700">
                                    <div className="flex gap-1.5">
                                        <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                {/* Input Area */}
                <div className="border-t border-zinc-800 bg-zinc-900 p-4">
                    <PromptInput
                        onSend={handleSend}
                        context={context}
                        setContext={setContext}
                        disabled={loading}
                    />
                </div>
            </div>
    );
};

export default GPTSidebar;
