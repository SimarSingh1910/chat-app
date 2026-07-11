import React, { useState } from 'react'
import api from '../../lib/api'

const UsernameSec = ({ user, setUser }) => {

    const [edit, setEdit] = useState(false);
    const [draft, setDraft] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const openEditor = () => {
        setDraft(user?.username || '');
        setError('');
        setEdit(true);
    };

    const closeEditor = () => {
        if (saving) return;
        setEdit(false);
        setError('');
    };

    const handleSaveUsername = async () => {
        // Match the User schema's lowercase/trim so local state mirrors the DB.
        const username = draft.trim().toLowerCase();
        if (!username) {
            setError('Username cannot be empty.');
            return;
        }
        if (username === user?.username) {
            closeEditor();
            return;
        }

        setSaving(true);
        setError('');
        try {
            await api.post('/profile', { username });
            setUser({ ...user, username }); // reflect immediately in the UI
            setEdit(false);
        } catch (err) {
            setError(
                err.response?.data?.error ||
                'Failed to update username. Please try again.'
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            try {
                const response = await fetch(`http://localhost:3000/profile/${user._id}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });
                if (response.ok) {
                    // Account deleted successfully
                    alert("Your account has been deleted.");
                    window.location.replace('/login');
                } else {
                    // Handle error
                    alert("An error occurred while deleting your account.");
                }
            } catch (error) {
                console.error("Error deleting account:", error);
            }
        }
    }
    return (
        <div className='text-center mt-2'>
            {edit ? (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-10 p-4">
                    <div className="bg-white p-4 rounded-lg shadow-lg max-w-[700px] max-h-[90vh] overflow-auto">
                        <h2 className="text-lg font-semibold mb-4">Edit Username</h2>
                        <input
                            type="text"
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveUsername()}
                            disabled={saving}
                            autoFocus
                            className='border border-gray-300 p-2 rounded w-full disabled:opacity-60'
                        />
                        {error && (
                            <p className="text-red-500 text-sm mt-2">{error}</p>
                        )}
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={handleSaveUsername}
                                disabled={saving}
                                className="px-4 py-2 bg-gray-300 rounded hover:cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {saving ? 'Saving…' : 'Save'}
                            </button>
                            <button
                                onClick={closeEditor}
                                disabled={saving}
                                className="px-4 py-2 bg-gray-300 rounded hover:cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                user ?
                    <>
                        <p>{user.first_name} {user.last_name}</p>
                        <p>@{user.username}</p>
                    </>
                    :
                    <p>Loading...</p>
            )}
            <div className='flex flex-col gap-3 mt-5'>
                <button
                    onClick={openEditor}
                    className='btn w-full py-2 px-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-md transition hover:cursor-pointer hover:scale-105  hover:from-cyan-600 hover:to-teal-600'>
                    Edit Username
                </button>
                <button
                    onClick={handleDeleteAccount}
                    className='w-full py-2 px-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-md transition hover:cursor-pointer hover:scale-105  hover:from-cyan-600 hover:to-teal-600'>
                    Delete Account
                </button>
            </div>
        </div>
    )
}

export default UsernameSec