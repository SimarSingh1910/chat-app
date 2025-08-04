import React, { useState } from 'react';

const Hobbies = ({ selected, setSelected, customHobby, setCustomHobby }) => {
    const topics = [
        'art',
        'music',
        'sports',
        'travel',
        'reading',
        'gaming',
        'cooking',
        'tech',
        'photography',
        'fitness',
        'other',
    ];

    const [showOtherInput, setShowOtherInput] = useState(!!customHobby);

    const handleCheckboxChange = (topic) => {
        if (topic === 'other') {
            setShowOtherInput((prev) => !prev);
        }

        setSelected((prev) => ({
            ...prev,
            [topic]: !prev[topic]
        }));
    };

    return (
        <div className='mx-5'>
            <h3 className='font-medium mb-2'>Hobbies</h3>
            <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                {topics.map((topic) => (
                    <label
                        key={topic}
                        className="flex items-center gap-1 cursor-pointer capitalize"
                    >
                        <input
                            type="checkbox"
                            checked={!!selected[topic]}
                            onChange={() => handleCheckboxChange(topic)}
                            className="accent-gray-600 w-4 h-4"
                        />
                        {topic === 'other' ? 'Other' : topic}
                    </label>
                ))}
            </div>
            {showOtherInput && selected['other'] && (
                <div className="mt-2">
                    <input
                        type="text"
                        value={customHobby}
                        onChange={(e) => setCustomHobby(e.target.value)}
                        placeholder="Add your hobby..."
                        className="border border-gray-300 w-1/3 mt-1 rounded-lg placeholder:text-gray-700 bg-gray-100 p-2 focus:outline-none focus:ring-1 focus:ring-black"
                    />
                </div>
            )}
        </div>
    );
};

export default Hobbies;
