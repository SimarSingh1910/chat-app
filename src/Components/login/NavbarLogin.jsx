import React, { useState } from 'react'

const NavbarLogin = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className='py-4 px-4 sm:px-6 w-full flex flex-row justify-between items-center sticky top-0 bg-white shadow-md z-50'>
            <img src="src/assets/logo.jpg" alt="Logo" className='h-10 sm:h-12 rounded-3xl' />

            {/* Desktop Menu */}
            <ul className='hidden lg:flex mr-4 flex-row justify-center items-center gap-4 xl:gap-6 font-semibold text-sm xl:text-base'>
                <li className='hover:underline hover:underline-offset-8 hover:decoration-2 hover:decoration-sky-500 hover:cursor-pointer transition-all duration-200'>Features</li>
                <li className='hover:underline hover:underline-offset-8 hover:decoration-2 hover:decoration-sky-500 hover:cursor-pointer transition-all duration-200'>Privacy and Safety</li>
                <li className='hover:underline hover:underline-offset-8 hover:decoration-2 hover:decoration-sky-500 hover:cursor-pointer transition-all duration-200'>Desktop App</li>
                <li className='hover:underline hover:underline-offset-8 hover:decoration-2 hover:decoration-sky-500 hover:cursor-pointer transition-all duration-200'>For Developers</li>
                <li className='hover:underline hover:underline-offset-8 hover:decoration-2 hover:decoration-sky-500 hover:cursor-pointer transition-all duration-200'>Help Centre</li>
            </ul>

            {/* Mobile Menu Button */}
            <button
                className='lg:hidden flex flex-col justify-center items-center w-6 h-6'
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
            >
                <span className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`block w-6 h-0.5 bg-gray-600 mt-1.5 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block w-6 h-0.5 bg-gray-600 mt-1.5 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </button>

            {/* Mobile Menu */}
            <div className={`lg:hidden absolute top-full left-0 w-full bg-white shadow-lg transition-all duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <ul className='flex flex-col py-4 font-semibold'>
                    <li className='px-6 py-3 hover:bg-gray-50 hover:text-sky-500 cursor-pointer transition-all duration-200'>Features</li>
                    <li className='px-6 py-3 hover:bg-gray-50 hover:text-sky-500 cursor-pointer transition-all duration-200'>Privacy and Safety</li>
                    <li className='px-6 py-3 hover:bg-gray-50 hover:text-sky-500 cursor-pointer transition-all duration-200'>Desktop App</li>
                    <li className='px-6 py-3 hover:bg-gray-50 hover:text-sky-500 cursor-pointer transition-all duration-200'>For Developers</li>
                    <li className='px-6 py-3 hover:bg-gray-50 hover:text-sky-500 cursor-pointer transition-all duration-200'>Help Centre</li>
                </ul>
            </div>
        </nav>
    )
}

export default NavbarLogin