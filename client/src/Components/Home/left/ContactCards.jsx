import React from 'react';
import { MessageSquareDashed } from 'lucide-react';
import ContactCard from './ContactCard';
import { useChat } from '../../ChatContext';
import { useAuth } from '../../AuthContext';
import { useSocket } from '../../SocketContext';

// The real inbox: conversations sorted by recency (server returns them sorted,
// and ChatContext keeps the most recently active on top).
const ContactCards = () => {
    const { userId } = useAuth();
    const { isOnline } = useSocket();
    const {
        conversations,
        loadingConversations,
        activeConversation,
        selectConversation,
        getOtherUser,
        unreadFor,
        isTyping,
    } = useChat();

    if (loadingConversations) {
        return (
            <div className="flex flex-col gap-3 px-4 py-3">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                        <div className="w-12 h-12 rounded-full bg-gray-200" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3 bg-gray-200 rounded w-2/5" />
                            <div className="h-2.5 bg-gray-100 rounded w-4/5" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (conversations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-center px-6 py-12 text-gray-400">
                <MessageSquareDashed size={40} strokeWidth={1.5} className="mb-3" />
                <p className="text-sm font-medium text-gray-500">No conversations yet</p>
                <p className="text-xs mt-1">Search for someone above to start chatting.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-0.5 px-2 pb-2">
            {conversations.map((conv) => {
                const other = getOtherUser(conv);
                return (
                    <ContactCard
                        key={conv._id}
                        otherUser={other}
                        lastMessage={conv.lastMessage?.text}
                        lastMessageIsMine={
                            (conv.lastMessage?.sender?._id || conv.lastMessage?.sender) === userId
                        }
                        time={conv.lastMessage?.createdAt || conv.updatedAt}
                        unread={unreadFor(conv)}
                        online={other ? isOnline(other._id, other.online) : false}
                        typing={isTyping(conv._id)}
                        isSelected={activeConversation?._id === conv._id}
                        onClick={() => selectConversation(conv)}
                    />
                );
            })}
        </div>
    );
};

export default ContactCards;
