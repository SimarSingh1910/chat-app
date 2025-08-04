import React, { useState, useEffect, useRef } from 'react';
import { Menu } from 'lucide-react';

const status = [
    'Exploring new ideas',
    'Feeling creative',
    'Need a break',
    'Open to chat',
    'Deep focus mode',
];

const Status = () => {
    const [inputValue, setInputValue] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const containerRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (mood) => {
        setInputValue(mood);
        setShowDropdown(false);
    };

    return (
        <div className="m-5 relative" ref={containerRef}>
            <label htmlFor="status" className="font-medium">
                Status/Mood
            </label>
            <div className="relative">
                <input
                    type="text"
                    name="status"
                    id="status"
                    className="border border-gray-300 w-full mt-2 rounded-lg placeholder:text-gray-700 bg-gray-100 p-2 focus:outline-none focus:ring-1 focus:ring-black"
                    placeholder="Say something about yourself"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button
                    type="button"
                    onClick={() => setShowDropdown((prev) => !prev)}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                    <Menu
                        size={18}
                        className='mt-2'
                    />
                </button>
            </div>
            {showDropdown && (
                <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {status
                        .filter((mood) =>
                            mood.toLowerCase().includes(inputValue.toLowerCase())
                        )
                        .map((mood, index) => (
                            <li
                                key={index}
                                onClick={() => handleSelect(mood)}
                                className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-gray-800"
                            >
                                {mood}
                            </li>
                        ))}
                </ul>
            )}
        </div>
    );
};

export default Status;

