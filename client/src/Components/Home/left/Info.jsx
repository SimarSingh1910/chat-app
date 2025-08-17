import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Info = () => {
    const navigate = useNavigate();

    const [isHovered, setIsHovered] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [user, setUser] = useState(null);

    // Hover Handlers
    const handleMouseEnter = () => {
        if (!isLocked) setIsHovered(true);
    };

    const handleMouseLeave = () => {
        if (!isLocked) setIsHovered(false);
    };

    // Click Handler
    const handleClick = () => {
        setIsLocked(prev => !prev);
        setIsHovered(true); // Keep dropdown visible after click
    };

    // Fetch user data
    useEffect(() => {
        fetch('http://localhost:3000/profile/', {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => setUser(data.profile))
            .catch(err => console.error(err));
    }, []);

    if (!user) return <div>Loading...</div>;

    const showDropdown = isHovered || isLocked;

    return (
        <div className="flex items-center">
            {/* Profile Picture */}
            <img
                src={user.selectedImage}
                alt="Profile"
                className="w-15 h-15 rounded-full mt-5 ml-3"
            />

            {/* User Info */}
            <div className="pt-2 w-[80%]">
                <h2 className="text-xl font-bold mt-5 ml-5 text-cyan-800">
                    {user.first_name} {user.last_name}
                </h2>
                <h4 className="text-sm ml-5">{user.pronoun}</h4>
            </div>

            {/* Pencil Icon + Dropdown */}
            <div
                className="relative flex items-center justify-center ml-auto mt-5 right-2"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* Circle Background */}
                <div
                    className={`flex items-center justify-center w-7 h-7 rounded-full transition-colors duration-300 cursor-pointer ${
                        isLocked ? 'bg-stone-100' : ''
                    }`}
                    onClick={handleClick}
                >
                    <img
                        src="/src/assets/pencil-svgrepo-com.svg"
                        alt="Edit Icon"
                        className="w-8 h-8"
                    />
                </div>

                {/* Dropdown */}
                {showDropdown && (
                    <div className="absolute top-full right-0 z-20 w-32 p-5 mt-2 rounded-md border border-gray-500 text-gray-800 backdrop-blur-lg bg-white shadow">
                        <p
                            onClick={() => navigate('/profile')}
                            className="cursor-pointer text-sm text-cyan-800"
                        >
                            Edit Profile
                        </p>
                        <hr className="my-2 border-t border-gray-500" />
                        <p
                            onClick={() => navigate('/login')}
                            className="cursor-pointer text-sm text-cyan-800"
                        >
                            Logout
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Info;
