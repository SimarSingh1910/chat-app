import { div } from 'framer-motion/client';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Info = () => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const [isLocked, setIsLocked] = useState(false);

    const handleMouseEnter = () => {
        if (!isLocked) setIsHovered(true);
    };

    const handleMouseLeave = () => {
        if (!isLocked) setIsHovered(false);
    };

    const handleClick = () => {
        setIsLocked(prev => !prev);
        setIsHovered(true); // Ensure it's visible when clicked

    };

    const showDropdown = isHovered || isLocked;

    return (
        <div className='flex'>
            <img
                src="src/assets/demo dp.png"
                alt="none"
                className='w-15 h-15 rounded-full mt-5 ml-3'
            />
            <div className='pt-2 w-50'>
                <h2 className='text-xl font-bold mt-5 ml-5 text-cyan-800'>Dianna Gahlaut</h2>
                <h4 className='text-sm ml-5'>Unemployed</h4>
            </div>

            {/* Pencil and Dropdown */}
            <div
                className={`relative w-7 h-7 transition-all duration-300 ease-in-out flex justify-center items-center ${isLocked && 'rounded-full w-3 h-3 bg-stone-100'}`}
                style={{ marginLeft: '7.5rem', marginTop: '2.25rem' }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <img
                    src="src/assets/pencil-svgrepo-com.svg"
                    alt="Edit Icon"
                    className={`w-7 h-7 cursor-pointer transition-all duration-300 ease-in-out ${isLocked && 'w-9 h-9'}`}
                    onClick={handleClick}
                />

                {showDropdown && (
                    <div className="absolute top-full right-0 z-20 w-32 p-5 mt-2 rounded-md border border-gray-500 text-gray-800 backdrop-blur-lg bg-white shadow">
                        <p
                            onClick={() => navigate('/profile')}
                            className='cursor-pointer text-sm text-cyan-800'
                        >
                            Edit Profile
                        </p>
                        <hr className='my-2 border-t border-gray-500' />
                        <p
                            onClick={() => navigate('/login')}
                            className='cursor-pointer text-sm text-cyan-800'
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
