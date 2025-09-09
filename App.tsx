
import React, { useState, useEffect, useRef } from 'react';
import type { Chat } from '@google/genai';
import { Message, Role } from './types';
import { VEXA_SYSTEM_PROMPT } from './constants';
import { initChat, sendMessageStream } from './services/geminiService';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';

const App: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { role: Role.MODEL, content: "Hello! I'm Vexa, your AI assistant. How can I help you today?" }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        try {
            const newChat = initChat(VEXA_SYSTEM_PROMPT);
            setChat(newChat);
        } catch (error) {
            console.error("Failed to initialize chat:", error);
            setMessages(prev => [...prev, { role: Role.ERROR, content: "Failed to initialize the AI assistant. Please check your API key and refresh the page." }]);
        }
    }, []);

    useEffect(() => {
        chatContainerRef.current?.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }, [messages]);

    const handleSendMessage = async (userMessage: string) => {
        if (!chat) {
            setMessages(prev => [...prev, { role: Role.ERROR, content: "Chat is not initialized. Cannot send message." }]);
            return;
        }

        setIsLoading(true);
        const newUserMessage: Message = { role: Role.USER, content: userMessage };
        setMessages(prev => [...prev, newUserMessage]);
        
        // Add a placeholder for the model's response
        setMessages(prev => [...prev, { role: Role.MODEL, content: "" }]);

        try {
            const stream = await sendMessageStream(chat, userMessage);
            let text = '';
            for await (const chunk of stream) {
                text += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { role: Role.MODEL, content: text };
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage = "Sorry, something went wrong. Please try again.";
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { role: Role.ERROR, content: errorMessage };
                return newMessages;
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/50 text-white font-sans">
            <header className="text-center p-4 border-b border-gray-700/50 shadow-lg bg-gray-900/50 backdrop-blur-sm">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
                    Vexa AI
                </h1>
                <p className="text-sm text-gray-400">Your Advanced AI Assistant by Ayan Ali</p>
            </header>
            
            <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="max-w-4xl mx-auto">
                    {messages.map((msg, index) => (
                        <ChatMessage key={index} message={msg} />
                    ))}
                    {isLoading && messages[messages.length-1].role !== Role.ERROR && (
                         <div className="flex items-start gap-3 my-4">
                             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0 animate-pulse"></div>
                             <div className="p-4 max-w-xl rounded-2xl bg-gray-700/80 rounded-bl-none">
                                 <div className="flex items-center space-x-2">
                                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                 </div>
                             </div>
                         </div>
                    )}
                </div>
            </main>
            
            <footer className="w-full">
                <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
            </footer>
        </div>
    );
};

export default App;
