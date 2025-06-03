import React from 'react'

const NavbarLogin = () => {
    return (
        <div className='py-8 px-6 h-auto w-full flex flex-row justify-between items-center sticky top-0 bg-white shadow-md'>
            <img src="src/assets/logo.jpg" alt="Logo" className='h-12 rounded-3xl' />
            <ul className='mr-4 flex flex-row justify-center items-center gap-4 font-semibold '>
                <li className='hover:underline hover:underline-offset-8 hover:decoration-2 hover:decoration-sky-500 hover:cursor-pointer'>Features</li>
                <li className='hover:underline hover:underline-offset-8 hover:decoration-2 hover:decoration-sky-500 hover:cursor-pointer'>Privacy and Safety</li>
                <li className='hover:underline hover:underline-offset-8 hover:decoration-2 hover:decoration-sky-500 hover:cursor-pointer'>Desktop App</li>
                <li className='hover:underline hover:underline-offset-8 hover:decoration-2 hover:decoration-sky-500 hover:cursor-pointer'>For Developers</li>
                <li className='hover:underline hover:underline-offset-8 hover:decoration-2 hover:decoration-sky-500 hover:cursor-pointer'>Help Centre</li>
            </ul>
        </div>
    )
}

export default NavbarLogin