import React from 'react';
import { UserRoundMinus, MessageCircle, Users } from 'lucide-react';
import Avatar from '../../common/Avatar';
import { useFriends } from '../../FriendsContext';
import { useSocket } from '../../SocketContext';

// Friends view: each row = avatar, name, Message, and a secondary Unfriend.
const FriendsList = ({ onMessage }) => {
    const { friends, unfriend, isBusy } = useFriends();
    const { isOnline } = useSocket();

    if (friends.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-center px-6 py-12 text-gray-400">
                <Users size={40} strokeWidth={1.5} className="mb-3" />
                <p className="text-sm font-medium text-gray-500">No friends yet</p>
                <p className="text-xs mt-1">Search for people above to add them.</p>
            </div>
        );
    }

    const handleUnfriend = (u) => {
        if (window.confirm(`Remove ${u.first_name} ${u.last_name} from your friends?`)) {
            unfriend(u._id);
        }
    };

    return (
        <div className="flex flex-col gap-0.5 px-2 pb-2">
            {friends.map((u) => (
                <div key={u._id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 transition-colors">
                    <Avatar src={u.avatar} alt={u.username} online={isOnline(u._id, false)} />
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 truncate">{u.first_name} {u.last_name}</p>
                        <p className="text-xs text-gray-500 truncate">@{u.username}</p>
                    </div>
                    <button
                        onClick={() => onMessage?.(u)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-cyan-700 cursor-pointer shrink-0"
                    >
                        <MessageCircle size={13} /> Message
                    </button>
                    <button
                        onClick={() => handleUnfriend(u)}
                        disabled={isBusy(u._id)}
                        aria-label="Unfriend"
                        title="Unfriend"
                        className="p-1.5 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 cursor-pointer shrink-0 disabled:opacity-60"
                    >
                        <UserRoundMinus size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default FriendsList;
