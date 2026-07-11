import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const status = [
    'Exploring new ideas',
    'Feeling creative',
    'Need a break',
    'Open to chat',
    'Deep focus mode',
];

const Status = ({ value, setValue }) => {
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
        setValue(mood);
        setShowDropdown(false);
    };

    return (
        <div className="relative" ref={containerRef}>
            <label htmlFor="status" className="mb-1.5 block text-sm font-medium text-slate-700">
                Status / Mood
            </label>
            <div className="relative">
                <input
                    type="text"
                    name="status"
                    id="status"
                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3.5 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                    placeholder="Say something about yourself"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <button
                    type="button"
                    onClick={() => setShowDropdown((prev) => !prev)}
                    aria-label="Suggested moods"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                >
                    <ChevronDown size={16} />
                </button>
            </div>
            {showDropdown && (
                <ul className="absolute z-10 mt-2 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
                    {status
                        .filter((mood) => mood.toLowerCase().includes(value.toLowerCase()))
                        .map((mood, index) => (
                            <li
                                key={index}
                                onClick={() => handleSelect(mood)}
                                className="cursor-pointer px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-cyan-50 hover:text-cyan-700"
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
