import React from 'react';
import { MessagesSquare } from 'lucide-react';
import PersonInfo from './middle/PersonInfo';
import MessageList from './middle/MessageList';
import MessageInput from './middle/MessageInput';
import { useChat } from '../ChatContext';

const EmptyState = () => (
    <div className="h-full flex flex-col items-center justify-center text-center px-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/10 to-teal-500/10 flex items-center justify-center mb-4">
            <MessagesSquare size={36} className="text-cyan-600" strokeWidth={1.5} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Your messages</h2>
        <p className="text-sm text-gray-500 mt-2 max-w-xs">
            Pick a conversation from the list, or search for someone to start a new chat.
        </p>
    </div>
);

const MiddlePanel = ({ onToggleInfo, onBack }) => {
    const { activeConversation } = useChat();

    if (!activeConversation) return <EmptyState />;

    return (
        <div className="flex flex-col h-full min-h-0">
            <PersonInfo onToggleInfo={onToggleInfo} onBack={onBack} />
            <MessageList />
            <MessageInput />
        </div>
    );
};

export default MiddlePanel;
