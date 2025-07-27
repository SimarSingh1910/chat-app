import React from 'react'
import googleLogo from '../../assets/google-logo.png'

const Google = () => {
    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:3000/auth/google';
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