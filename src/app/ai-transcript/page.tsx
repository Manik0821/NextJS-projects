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
    },
    { 
        id: 2, 
        sender: 'user', 
        message: "Can you summarize the main points of our last meeting?" 
    },
    { 
        id: 3, 
        sender: 'ai', 
        message: "Certainly! Based on the transcript, we discussed the Q3 marketing strategy, the new brand guidelines, and the upcoming product launch in October." 
    },
    { 
        id: 4, 
        sender: 'user', 
        message: "Great, thanks! What were the specific action items?" 
    },
    { 
        id: 5, 
        sender: 'ai', 
        message: "The key action items were: 1. Sarah to finalize the ad copy. 2. Mike to coordinate with the design team. 3. Final review scheduled for next Friday." 
    }
];

const AiTranscript = () => {
    // Pass the initialChat to your useState
    const [chat, setChat] = useState<ChatMessage[]>(initialChat);
    const chatWindowRef = useRef<HTMLDivElement>(null);
    
    // ... rest of your logic


    // Auto-scroll whenever chat updates
    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTo({
                top: chatWindowRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [chat]);

    const handleSendMessage = (e: KeyboardEvent<HTMLInputElement>, sender: 'user' | 'ai') => {
        const input = e.currentTarget;
        if (e.key === 'Enter' && input.value.trim() !== '') {
            const newMessage: ChatMessage = {
                sender,
                message: input.value,
                id: Date.now(), // Unique ID based on timestamp
            };
            setChat((prev) => [...prev, newMessage]);
            input.value = ''; // Clear input
        }
    };

    return (
        <div className='ai-transcript-wrapper'>
            <div className="chat-block">
                <div className="chat-window" ref={chatWindowRef}>
                    {chat.map((msg) => (
                        <div key={msg.id} className={`message-row ${msg.sender}`}>
                            <div className="message-bubble">
                                {msg.message}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="input-block">
                <input 
                    type="text" 
                    placeholder="AI Response..." 
                    onKeyDown={(e) => handleSendMessage(e, 'ai')} 
                />
                <input 
                    type="text" 
                    placeholder="User Message..." 
                    onKeyDown={(e) => handleSendMessage(e, 'user')} 
                />
            </div>
        </div>
    );
};

export default AiTranscript;