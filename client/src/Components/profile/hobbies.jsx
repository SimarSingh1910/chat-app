import React, { useState } from 'react';

const topics = [
    'art', 'music', 'sports', 'travel', 'reading',
    'gaming', 'cooking', 'tech', 'photography', 'fitness', 'other',
];

const Hobbies = ({ selected, setSelected, customHobby, setCustomHobby }) => {
    const [showOtherInput, setShowOtherInput] = useState(!!customHobby);

    const handleToggle = (topic) => {
        if (topic === 'other') {
            setShowOtherInput((prev) => !prev);
        }
        setSelected((prev) => ({
            ...prev,
            [topic]: !prev[topic],
        }));
    };

    return (
        <div>
            <h3 className='mb-2 text-sm font-medium text-slate-700'>Hobbies</h3>
            <div className="flex flex-wrap gap-2">
                {topics.map((topic) => {
                    const active = !!selected[topic];
                    return (
                        <button
                            key={topic}
                            type="button"
                            onClick={() => handleToggle(topic)}
                            className={`rounded-full px-3.5 py-1.5 text-sm capitalize transition ${
                                active
                                    ? 'border border-cyan-500 bg-cyan-50 font-medium text-cyan-700'
                                    : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
                            }`}
                        >
                            {topic === 'other' ? 'Other' : topic}
                        </button>
                    );
                })}
            </div>
            {showOtherInput && selected['other'] && (
                <input
                    type="text"
                    value={customHobby}
                    onChange={(e) => setCustomHobby(e.target.value)}
                    placeholder="Add your hobby…"
                    className="mt-3 w-full max-w-xs rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
            )}
        </div>
    );
};

export default Hobbies;
