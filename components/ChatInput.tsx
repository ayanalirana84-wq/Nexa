
import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    isLoading: boolean;
}

const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
);


export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
    const [message, setMessage] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            const scrollHeight = textarea.scrollHeight;
            textarea.style.height = `${scrollHeight}px`;
        }
    }, [message]);

    const handleSend = () => {
        const trimmedMessage = message.trim();
        if (trimmedMessage && !isLoading) {
            onSendMessage(trimmedMessage);
            setMessage('');
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm border-t border-gray-700/50 p-4">
            <div className="relative max-w-4xl mx-auto">
                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask Vexa anything..."
                    rows={1}
                    className="w-full bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600 rounded-2xl py-3 pl-4 pr-16 resize-none focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-200 max-h-48"
                    disabled={isLoading}
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading || !message.trim()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:bg-purple-500/50 text-purple-400 enabled:hover:text-white"
                    aria-label="Send message"
                >
                    <SendIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};
