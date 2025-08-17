import React from 'react';
import axios from 'axios';

const Save = ({ data, customHobby }) => {
    const handleSave = async () => {
        const payload = {
            ...data,
            hobbies: [
                ...(data.hobbies ?
                    Object.keys(data.hobbies).filter((key) => data.hobbies[key])
                    : []),
                ...(customHobby ?
                    [customHobby] :
                    []),
            ],
        };

        try {
            await axios.post('http://localhost:3000/profile', payload, {
                withCredentials: true,
            });
            alert('Profile saved successfully!');
            window.location.replace('/');
        } catch (error) {
            console.error('Save failed:', error);
            alert(error.response?.data?.error || 'Error saving profile');
        }
    };
    return (
        <div className="m-5 mb-5 flex gap-5">
            <button
                onClick={handleSave}
                className="w-full py-2 px-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-md transition hover:cursor-pointer hover:scale-105  hover:from-cyan-600 hover:to-teal-600 "
            >
                Save Profile
            </button>
        </div>
    );
};

export default Save;
