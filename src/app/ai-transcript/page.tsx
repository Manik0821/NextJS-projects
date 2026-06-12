'use client';
import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import './page.css';

type ChatMessage = {
    sender: 'user' | 'ai';
    message: string;
    id: number;
};

const initialChat: ChatMessage[] = [
    { 
        id: 1, 
        sender: 'ai', 
        message: "Hello! I'm your AI assistant. How can I help you with your transcript today?" 
    }
];

const AiTranscript = () => {
    const [chat, setChat] = useState<ChatMessage[]>(initialChat);
    const [inputVal, setInputVal] = useState('');
    const [loading, setLoading] = useState(false);
    const chatWindowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTo({
                top: chatWindowRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [chat, loading]); // Added loading as a dependency to scroll when "thinking" appears

    const handleSendMessage = async (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter' || inputVal.trim() === '' || loading) return;

        const userText = inputVal.trim();
        setInputVal(''); 

        const userMessage: ChatMessage = {
            sender: 'user',
            message: userText,
            id: Date.now(),
        };
        
        const updatedChatWithUser = [...chat, userMessage];
        setChat(updatedChatWithUser);
        setLoading(true);

        try {
            const res = await fetch('/api/ai/ai-transcript', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    history: updatedChatWithUser.map(msg => ({
                        role: msg.sender === 'user' ? 'user' : 'assistant',
                        content: msg.message
                    }))
                }),
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            const aiMessage: ChatMessage = {
                sender: 'ai',
                message: data.response,
                id: Date.now() + 1,
            };
            setChat((prev) => [...prev, aiMessage]);

        } catch (err: any) {
            setChat((prev) => [
                ...prev,
                {
                    sender: 'ai',
                    message: `⚠️ Error generation: ${err.message}. Check terminal logs or API connection.`,
                    id: Date.now() + 2
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='ai-transcript-wrapper'>
            {/* Added Chat Header */}
            <div className="chat-header">
                <div className="header-info">
                    <span className="status-indicator"></span>
                    <h2>Chat Assistant</h2>
                </div>
            </div>

            <div className="chat-block">
                <div className="chat-window" ref={chatWindowRef}>
                    {chat.map((msg) => (
                        <div key={msg.id} className={`message-row ${msg.sender}`}>
                            <div className="message-bubble">
                                {msg.message}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="message-row ai processing">
                            <div className="message-bubble thinking-bubble">
                                Llama thinking...
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="input-block">
                <input 
                    type="text" 
                    placeholder={loading ? "Waiting for AI..." : "Ask a question about your transcripts..."}
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={handleSendMessage} 
                    disabled={loading}
                />
            </div>
        </div>
    );
};

export default AiTranscript;
