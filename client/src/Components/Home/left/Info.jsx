import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, UserRoundPen, LogOut } from 'lucide-react';
import { useAuth } from '../../AuthContext';
import Avatar from '../../common/Avatar';
import api from '../../../lib/api';

// Current user's header at the top of the left panel: avatar, name and a
// menu with "Edit profile" / "Logout".
const Info = () => {
    const navigate = useNavigate();
    const { user, setIsAuthenticated } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Close the menu when clicking anywhere else.
    useEffect(() => {
        if (!menuOpen) return;
        const onClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, [menuOpen]);

    const handleLogout = async () => {
        try {
            await api.get('/auth/logout');
        } finally {
            setIsAuthenticated(false);
            navigate('/login', { replace: true });
        }
    };

    return (
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
            <Avatar src={user?.selectedImage} alt="My profile" size="lg" />

            <div className="flex-1 min-w-0">
                <h2 className="text-base font-bold text-gray-900 truncate">
                    {user ? `${user.first_name} ${user.last_name}` : 'Loading…'}
                </h2>
                <p className="text-xs text-gray-500 truncate">
                    {user?.statusMood || (user?.username ? `@${user.username}` : '')}
                </p>
            </div>

            <div className="relative" ref={menuRef}>
                <button
                    onClick={() => setMenuOpen((v) => !v)}
                    aria-label="Menu"
                    className={`p-2 rounded-full transition-colors cursor-pointer ${
                        menuOpen ? 'bg-cyan-50 text-cyan-700' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                >
                    <MoreVertical size={18} />
                </button>

                {menuOpen && (
                    <div className="absolute top-full right-0 z-30 w-44 mt-1 py-1 rounded-xl border border-gray-200 bg-white shadow-lg">
                        <button
                            onClick={() => navigate('/profile')}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-700 cursor-pointer"
                        >
                            <UserRoundPen size={15} /> Edit profile
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                        >
                            <LogOut size={15} /> Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Info;
