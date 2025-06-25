import React from 'react'
import NavbarLogin from '../Components/login/NavbarLogin'
import TextContent from '../Components/login/textContent'
import LoginPart from '../Components/login/loginPart'
import LowerPart from '../Components/login/lowerPart'

const LoginPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <NavbarLogin />
            <TextContent />
            <LoginPart />
            <LowerPart />
        </div>
    )
}

export default LoginPage