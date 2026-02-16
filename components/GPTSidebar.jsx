"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { PromptBox } from '@/components/ui/chatgpt-prompt-input';
import { Sparkles, Bot, User, X, Trash2, Copy, Check } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';

const GPTSidebar = ({ open, onClose, messages: externalMessages, onWidthChange }) => {
    const { user } = useUser();
    console.log("user ", user);
    const [messages, setMessages] = useState(externalMessages || []);
    const [loading, setLoading] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [width, setWidth] = useState(500);
    const [isResizing, setIsResizing] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isUserScrolling, setIsUserScrolling] = useState(false);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    // Check if mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Smart auto-scroll: only scroll if user hasn't manually scrolled up
    useEffect(() => {
        if (!isUserScrolling && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, loading, isUserScrolling]);

    // Detect if user is manually scrolling
    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

            // If user is within 100px of bottom, enable auto-scroll
            // Otherwise, they've scrolled up manually
            setIsUserScrolling(distanceFromBottom > 100);
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle resize
    useEffect(() => {
        let animationFrameId = null;

        const handleMouseMove = (e) => {
            if (!isResizing) return;

            // Cancel previous animation frame
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }

            // Use requestAnimationFrame for smooth resizing
            animationFrameId = requestAnimationFrame(() => {
                const newWidth = window.innerWidth - e.clientX;
                if (newWidth >= 300 && newWidth <= 800) {
                    setWidth(newWidth);
                    onWidthChange?.(newWidth);
                }
            });
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };

        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'ew-resize';
            document.body.style.userSelect = 'none';
            // Prevent text selection during resize
            document.body.style.pointerEvents = 'none';
        } else {
            document.body.style.pointerEvents = '';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            document.body.style.pointerEvents = '';
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [isResizing, onWidthChange]);

    if (!open) return null;

    // Send message to backend with typing animation
    const handleSend = async (input) => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input, timestamp: Date.now() };
        setMessages(msgs => [...msgs, userMessage]);
        setLoading(true);

        // Don't add placeholder, we'll show loading indicator instead

        try {
            const res = await fetch('/api/gpt-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    history: messages.slice(-6)
                })
            });

            const data = await res.json();

            if (data.ok && data.reply) {
                // Stop loading immediately when response arrives
                setLoading(false);

                // Simulate typing animation
                const fullText = data.reply;
                let currentIndex = 0;

                // Add initial message
                const assistantMsg = {
                    role: 'assistant',
                    content: '',
                    timestamp: Date.now(),
                    isTyping: true
                };
                setMessages(msgs => [...msgs, assistantMsg]);

                // Type character by character - update the last message
                const typeInterval = setInterval(() => {
                    if (currentIndex < fullText.length) {
                        const nextChunk = fullText.slice(0, currentIndex + 2); // 2 chars at a time for speed
                        currentIndex += 2;

                        setMessages(msgs => {
                            const newMsgs = [...msgs];
                            newMsgs[newMsgs.length - 1] = {
                                ...newMsgs[newMsgs.length - 1],
                                content: nextChunk,
                                isTyping: true
                            };
                            return newMsgs;
                        });
                    } else {
                        clearInterval(typeInterval);
                        setMessages(msgs => {
                            const newMsgs = [...msgs];
                            newMsgs[newMsgs.length - 1] = {
                                ...newMsgs[newMsgs.length - 1],
                                isTyping: false
                            };
                            return newMsgs;
                        });
                    }
                }, 10); // 10ms delay between characters for smooth typing
            } else {
                setMessages(msgs => [...msgs, {
                    role: 'assistant',
                    content: 'Error: ' + (data.error || 'Unknown error occurred'),
                    timestamp: Date.now(),
                    isError: true
                }]);
                setLoading(false);
            }
        } catch (e) {
            setMessages(msgs => [...msgs, {
                role: 'assistant',
                content: 'Network Error: Could not connect to AI service',
                timestamp: Date.now(),
                isError: true
            }]);
            setLoading(false);
        }
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
        <div
            className="fixed right-0 top-0 bottom-0 z-40 bg-zinc-900 border-l border-zinc-800 shadow-2xl flex flex-col transition-none"
            style={{
                width: isMobile ? '100%' : `${width}px`,
                pointerEvents: isResizing ? 'none' : 'auto'
            }}
        >
            {/* Resize Handle - Wide and Easy to Click */}
            {!isMobile && (
                <div
                    className="absolute -left-1 top-0 bottom-0 w-3 cursor-ew-resize z-50 group flex items-center justify-center hover:bg-blue-500/10"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsResizing(true);
                    }}
                    style={{
                        background: 'transparent',
                        pointerEvents: 'auto'
                    }}
                >
                    {/* Visible handle bar */}
                    <div className="w-1 h-full bg-zinc-700/50 group-hover:bg-blue-500 transition-all duration-200 group-hover:w-1.5 relative">
                        {/* Center indicator */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-16 bg-zinc-600 group-hover:bg-blue-400 rounded-full transition-all duration-200 group-hover:h-20 group-hover:w-2 shadow-lg" />
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="border-b border-zinc-800 bg-zinc-900 sticky top-0 z-10">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10  flex items-center justify-center overflow-hidden">
                                <Image
                                    src="/aiLogo.png"
                                    alt="AI Assistant"
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                        </div>
                        <div>
                            <h2 className="font-bold text-lg text-zinc-100">AI Assistant</h2>
                          
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
            <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
            >
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center px-6">

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
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                                            <Image
                                                src="/aiLogo.png"
                                                alt="AI"
                                                width={33}
                                                height={33}
                                                className="w-full h-full object-cover"
                                            />
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
                                    {!msg.isTyping && (
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
                                    )}
                                </div>

                                {msg.role === 'user' && (
                                    <div className="flex-shrink-0 mt-1">
                                        {user?.imageUrl ? (
                                            <div className="w-8 h-8 rounded-full overflow-hidden shadow-lg ring-2 ring-emerald-500/50">
                                                <Image
                                                    src={user.imageUrl}
                                                    alt={user.firstName || 'User'}
                                                    width={32}
                                                    height={32}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                                                <User className="w-5 h-5 text-white" />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}

                        {loading && (
                            <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg overflow-hidden">
                                        <Image
                                            src="/aiLogo.png"
                                            alt="AI"
                                            width={32}
                                            height={32}
                                            className="w-full h-full object-cover"
                                        />
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
                <PromptBox
                    onSend={handleSend}
                    disabled={loading}
                />
            </div>
        </div>
    );
};

export default GPTSidebar;
