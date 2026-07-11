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
        <div>
            <button
                className='w-full bg-white text-gray-800 mt-2 font-semibold py-2 px-4 rounded-lg shadow hover:bg-gray-100 transition duration-200 flex items-center justify-center space-x-2'
                onClick={handleGoogleLogin}
            >
                <img src={googleLogo} alt="Google Logo" className='w-5 h-5 rounded-full' />
                {/* <span className='hidden sm:inline'>Sign in with</span> */}
                <span>Google</span>
            </button>
        </div>
    )
}

export default Google