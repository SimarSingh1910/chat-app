import React, { useState } from 'react';
import api from '../../lib/api';

const Save = ({ data, customHobby }) => {
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        const payload = {
            ...data,
            hobbies: [
                ...(data.hobbies
                    ? Object.keys(data.hobbies).filter((key) => data.hobbies[key])
                    : []),
                ...(customHobby ? [customHobby] : []),
            ],
        };

        setSaving(true);
        try {
            await api.post('/profile', payload);
            window.location.replace('/');
        } catch (error) {
            console.error('Save failed:', error);
            alert(error.response?.data?.error || 'Error saving profile');
            setSaving(false);
        }
    };

    return (
        <button
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded-lg bg-cyan-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-700 active:scale-[.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
            {saving ? 'Saving…' : 'Save profile'}
        </button>
    );
};

export default Save;
