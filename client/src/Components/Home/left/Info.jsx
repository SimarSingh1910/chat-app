import React from 'react'
import { useNavigate } from 'react-router-dom'

const Info = () => {
    const navigate = useNavigate();

    return (
        <div className='flex'>
            <img src="src\assets\demo dp.png" alt="none" className='w-15 h-15 rounded-full mt-5 ml-3 border-2' />
            <div className='pt-2 w-50'>
                <h2 className='text-xl font-bold mt-5 ml-5 text-cyan-800'>Dianna Gahlaut</h2>
                <h4 className='text-sm ml-5'>Unemployed</h4>
            </div>
            <div className='relative group w-7 h-7' style={{ marginLeft: '7.5rem', marginTop: '2.25rem' }}>
                <img
                    src="src/assets/pencil-svgrepo-com.svg" alt="Edit Icon" className='w-7 h-7 cursor-pointer'
                />
                <div className='absolute top-full right-0 z-20 w-32 p-5 mt-2 rounded-md border border-gray-500 text-gray-100 hidden group-hover:block backdrop-blur-lg'>
                    <p onClick={() => navigate('/profile')} className='cursor-pointer text-sm text-cyan-800'>Edit Profile</p>
                    <hr className='my-2 border-t border-gray-500' />
                    <p onClick={() => navigate('/login')} className='cursor-pointer text-sm text-cyan-800'>Logout</p>
                </div>
            </div>

        </div>
    )
}

export default Info