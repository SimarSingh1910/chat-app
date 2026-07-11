import React, { useEffect, useState } from 'react';
import { UserRoundSearch, MessageSquare, Users, UserPlus } from 'lucide-react';
import Info from './left/Info';
import Search from './left/Search';
import ContactCards from './left/ContactCards';
import FriendsList from './left/FriendsList';
import RequestsPanel from './left/RequestsPanel';
import Avatar from '../common/Avatar';
import FriendActionButton from '../common/FriendActionButton';
import api from '../../lib/api';
import { useSocket } from '../SocketContext';
import { useFriends } from '../FriendsContext';

const TABS = [
    { key: 'chats', label: 'Chats', icon: MessageSquare },
    { key: 'friends', label: 'Friends', icon: Users },
    { key: 'requests', label: 'Requests', icon: UserPlus },
];

const LeftPanel = ({ leftTab, setLeftTab, onMessage }) => {
    const { isOnline } = useSocket();
    const { incomingCount } = useFriends();

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

    const showSearchResults = query.trim().length > 0;

    return (
        <div className="flex flex-col h-full min-h-0">
            <Info />

            {/* Segmented tab switcher */}
            <div className="px-3 pb-2">
                <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
                    {TABS.map((t) => {
                        const Icon = t.icon;
                        const active = leftTab === t.key;
                        return (
                            <button
                                key={t.key}
                                onClick={() => setLeftTab(t.key)}
                                className={`relative flex-1 flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold cursor-pointer transition-colors ${
                                    active ? 'bg-white text-cyan-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <Icon size={14} /> {t.label}
                                {t.key === 'requests' && incomingCount > 0 && (
                                    <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-cyan-600 text-[10px] font-bold text-white flex items-center justify-center">
                                        {incomingCount > 9 ? '9+' : incomingCount}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

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
                            <div
                                key={user._id}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <Avatar src={user.avatar} alt={user.username} online={isOnline(user._id, user.online)} />
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-gray-900 truncate">
                                        {user.first_name} {user.last_name}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">@{user.username}</p>
                                </div>
                                <FriendActionButton user={user} onMessage={onMessage} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {leftTab === 'chats' && <ContactCards />}
                        {leftTab === 'friends' && <FriendsList onMessage={onMessage} />}
                        {leftTab === 'requests' && <RequestsPanel />}
                    </>
                )}
            </div>
        </div>
    );
};

export default LeftPanel;
