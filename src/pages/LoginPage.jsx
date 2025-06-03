import React from 'react'
import NavbarLogin from '../Components/login/NavbarLogin'
import LeftContent from '../Components/login/leftContent'
import LoginPart from '../Components/login/loginPart'

const LoginPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <NavbarLogin />
            <LeftContent />
            <LoginPart />
        </div>
    )
}

export default LoginPage