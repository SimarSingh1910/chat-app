import React, { useEffect, useState } from 'react';
import { UserRoundSearch } from 'lucide-react';
import Info from './left/Info';
import Search from './left/Search';
import ContactCards from './left/ContactCards';
import Avatar from '../common/Avatar';
import api from '../../lib/api';
import { useChat } from '../ChatContext';
import { useSocket } from '../SocketContext';

const LeftPanel = () => {
    const { startConversation } = useChat();
    const { isOnline } = useSocket();

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);

    // Debounced people search.
    useEffect(() => {
        const q = query.trim();
        if (!q) {
            setResults([]);
            setSearching(false);
            return;
        }
        setSearching(true);
        const timer = setTimeout(async () => {
            try {
                const { data } = await api.get('/users/search', { params: { q } });
                setResults(data.users || []);
            } catch (err) {
                console.error('User search failed:', err);
                setResults([]);
            } finally {
                setSearching(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const handleStartChat = async (user) => {
        setQuery('');
        setResults([]);
        await startConversation(user);
    };

    const showSearchResults = query.trim().length > 0;

    return (
        <div className="flex flex-col h-full min-h-0">
            <Info />
            <Search value={query} onChange={setQuery} />

            <div className="flex-1 min-h-0 overflow-y-auto chat-scroll">
                {showSearchResults ? (
                    <div className="px-2 pb-2">
                        <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                            People
                        </p>
                        {searching && results.length === 0 && (
                            <p className="px-3 py-2 text-sm text-gray-400">Searching…</p>
                        )}
                        {!searching && results.length === 0 && (
                            <div className="flex flex-col items-center text-center px-6 py-8 text-gray-400">
                                <UserRoundSearch size={32} strokeWidth={1.5} className="mb-2" />
                                <p className="text-sm">No one found for “{query.trim()}”</p>
                            </div>
                        )}
                        {results.map((user) => (
                            <button
                                key={user._id}
                                onClick={() => handleStartChat(user)}
                                className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                            >
                                <Avatar src={user.avatar} alt={user.username} online={isOnline(user._id, user.online)} />
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-gray-900 truncate">
                                        {user.first_name} {user.last_name}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">@{user.username}</p>
                                </div>
                                <span className="text-[11px] font-semibold text-cyan-600 shrink-0">Chat</span>
                            </button>
                        ))}
                    </div>
                ) : (
                    <ContactCards />
                )}
            </div>
        </div>
    );
};

export default LeftPanel;
