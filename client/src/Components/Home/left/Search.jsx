import React from 'react';
import { Search as SearchIcon, X } from 'lucide-react';

// Controlled search box — searches people to start a new chat.
const Search = ({ value, onChange }) => (
    <div className="px-4 pb-3">
        <div className="flex items-center gap-2 bg-gray-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-cyan-400 rounded-full px-4 py-2 transition-all">
            <SearchIcon size={16} className="text-gray-400 shrink-0" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search people to chat with…"
                className="w-full bg-transparent text-sm placeholder-gray-400 focus:outline-none"
            />
            {value && (
                <button
                    onClick={() => onChange('')}
                    aria-label="Clear search"
                    className="text-gray-400 hover:text-gray-600 cursor-pointer shrink-0"
                >
                    <X size={15} />
                </button>
            )}
        </div>
    </div>
);

export default Search;
