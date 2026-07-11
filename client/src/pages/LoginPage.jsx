import React from 'react'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import NavbarLogin from '../Components/login/NavbarLogin'
import TextContent from '../Components/login/textContent'
import SignUp from '../Components/login/signUp'
import SignIn from '../Components/login/signIn'
import LowerPart from '../Components/login/lowerPart'

const LoginPage = () => {
    const location = useLocation();
    const notice = location.state?.notice;
    // Arriving with a notice (e.g. after a password reset) opens the sign-in view.
    const [isSignUp, setIsSignUp] = useState(!notice);
    return (
        <div className="min-h-screen bg-gray-50">
            <NavbarLogin />
            <TextContent />
            {notice && (
                <div className="max-w-md mx-auto px-4">
                    <div className="rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm text-center px-4 py-3">
                        {notice}
                    </div>
                </div>
            )}
            {isSignUp ? (
                <SignUp switchToSignIn={() => setIsSignUp(false)} />
            ) : (
                <SignIn switchToSignUp={() => setIsSignUp(true)} />
            )}
            <LowerPart />
        </div>
    )
}

export default LoginPage