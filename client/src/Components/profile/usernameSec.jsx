import React, { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
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
                await api.delete(`/profile/${user._id}`);
                alert("Your account has been deleted.");
                window.location.replace('/login');
            } catch (error) {
                console.error("Error deleting account:", error);
                alert("An error occurred while deleting your account.");
            }
        }
    }

    return (
        <div className='w-full text-center'>
            {user ? (
                <>
                    <p className='text-lg font-semibold text-slate-900'>
                        {user.first_name} {user.last_name}
                    </p>
                    <p className='text-sm text-slate-500'>@{user.username}</p>
                </>
            ) : (
                <p className='text-sm text-slate-400'>Loading…</p>
            )}

            <div className='mt-5 flex flex-col gap-2.5'>
                <button
                    onClick={openEditor}
                    className='inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50'
                >
                    <Pencil size={15} /> Edit username
                </button>
                <button
                    onClick={handleDeleteAccount}
                    className='inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-white py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50'
                >
                    <Trash2 size={15} /> Delete account
                </button>
            </div>

            {edit && (
                <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                        <h2 className="text-lg font-semibold text-slate-900">Edit username</h2>
                        <p className="mt-1 text-sm text-slate-500">Choose a new username. This is how others find you.</p>
                        <input
                            type="text"
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveUsername()}
                            disabled={saving}
                            autoFocus
                            className='mt-4 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-60'
                        />
                        {error && (
                            <p className="mt-2 text-left text-sm text-red-500">{error}</p>
                        )}
                        <div className="mt-5 flex justify-end gap-3">
                            <button
                                onClick={closeEditor}
                                disabled={saving}
                                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-60"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveUsername}
                                disabled={saving}
                                className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving ? 'Saving…' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UsernameSec
