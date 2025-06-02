import React from 'react'

const NavbarLogin = () => {
    return (
        <div className='my-4 mx-6 h-16 w-auto flex flex-row justify-between items-center sticky'>
            <img src="src/assets/react.svg" alt="Logo" />
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