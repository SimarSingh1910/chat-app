import React from 'react'
import { useState } from 'react'
import NavbarLogin from '../Components/login/NavbarLogin'
import TextContent from '../Components/login/textContent'
import SignUp from '../Components/login/signUp'
import SignIn from '../Components/login/signIn'
import LowerPart from '../Components/login/lowerPart'

const LoginPage = () => {
    const [isSignUp, setIsSignUp] = useState(true);
    return (
        <div className="min-h-screen bg-gray-50">
            <NavbarLogin />
            <TextContent />
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