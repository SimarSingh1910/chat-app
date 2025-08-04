import React from 'react';
import axios from 'axios';

const Save = ({ data }) => {
    const handleSave = async () => {
        const payload = {
            ...data,
            hobbies: [
                ...Object.keys(data.hobbies).filter((key) => data.hobbies[key]),
                ...(data.customHobby ? [data.customHobby] : []),
            ],
        };

        try {
            await axios.post('/api/save-profile', payload);
            alert('Profile saved successfully!');
        } catch (error) {
            console.error('Save failed:', error);
            alert('Error saving profile');
        }
    };

    return (
        <div className="m-5">
            <button
                onClick={handleSave}
                className="w-full py-2 px-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-md transition"
            >
                Save Profile
            </button>
        </div>
    );
};

export default Save;
