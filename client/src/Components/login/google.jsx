import React from 'react'
import googleLogo from '../../assets/google-logo.png'
import { API_URL } from '../../lib/config'

const Google = () => {
    const handleGoogleLogin = () => {
        // Full-page redirect to the backend OAuth entrypoint (not an XHR),
        // so use the configured API origin rather than the axios instance.
        window.location.href = `${API_URL}/auth/google`;
    };
    return (
        <button
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
            <img src={googleLogo} alt="" className="h-5 w-5" />
            <span>Continue with Google</span>
        </button>
    )
}

export default Google
