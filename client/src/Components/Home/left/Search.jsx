import { div } from 'framer-motion/client'
import React from 'react'

const Search = () => {
    return (
        <div className='flex flex-col justify-between'>
            <div className='bg-white w-80 m-auto p-2 mt-5 rounded-full flex items-center'>
                <img src='src/assets/search-svgrepo-com.svg' className='w-5 inline' alt='search icon' />
                <input type='text' placeholder='Search here...' className='w-32 placeholder:font-sans focus:outline-none focus:ring-0 focus:border-transparent placeholder-gray-500 placeholder-opacity-75 ml-2' />
            </div>
            <hr className='border border-gray-300 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto mt-3' />
        </div>
    )
}

export default Search