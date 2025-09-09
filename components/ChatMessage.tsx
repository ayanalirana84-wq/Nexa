
import React from 'react';
import { Message, Role } from '../types';

const VexaIcon = () => (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
    </div>
);

const UserIcon = () => (
    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
    </div>
);

const ErrorIcon = () => (
    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
    </div>
);


export const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
    const isUser = message.role === Role.USER;
    const isVexa = message.role === Role.MODEL;
    const isError = message.role === Role.ERROR;

    const wrapperClasses = `flex items-start gap-3 my-4 ${isUser ? 'justify-end' : ''}`;
    const bubbleClasses = `p-4 max-w-xl rounded-2xl ${isUser ? 'bg-blue-600 text-white rounded-br-none' : isError ? 'bg-red-900/50 text-red-200 border border-red-500/50 rounded-bl-none' : 'bg-gray-700/80 text-gray-200 rounded-bl-none'}`;
    
    const Icon = isUser ? UserIcon : isError ? ErrorIcon : VexaIcon;
    const messageContent = message.content.replace(/```(\w+)?\n/g, '```\n').replace(/```\n/g, '```');
    
    return (
        <div className={wrapperClasses}>
            {!isUser && <Icon />}
            <div className={bubbleClasses}>
                 <div className="prose prose-invert prose-sm max-w-none" style={{whiteSpace: 'pre-wrap'}}>
                    {messageContent}
                </div>
            </div>
            {isUser && <Icon />}
        </div>
    );
};
