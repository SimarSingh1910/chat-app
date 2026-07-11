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
        <div className="min-h-screen bg-white">
            <NavbarLogin />
            <TextContent />

            <section id="auth" className="scroll-mt-16 border-b border-slate-200 bg-slate-50">
                <div className="mx-auto max-w-md px-4 py-16 sm:py-20">
                    {notice && (
                        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm text-emerald-700">
                            {notice}
                        </div>
                    )}
                    {isSignUp ? (
                        <SignUp switchToSignIn={() => setIsSignUp(false)} />
                    ) : (
                        <SignIn switchToSignUp={() => setIsSignUp(true)} />
                    )}
                </div>
            </section>

            <LowerPart />
        </div>
    )
}

export default LoginPage