import React from 'react'
import searchIcon from '../../../assets/search-svgrepo-com.svg'

const SearchBar = () => {
    return (
        <div className='bg-white w-full max-w-xs sm:max-w-sm md:max-w-md  p-2 mt-2 rounded-full flex items-center gap-2 shadow-sm'>
            <img src={searchIcon} className='w-5 h-5 inline' alt="search icon" />
            <input 
                type='text' 
                placeholder='Search here...'
                className='flex-1 bg-transparent placeholder:font-sans focus:outline-none focus:ring-0 focus:border-transparent placeholder-gray-500 placeholder-opacity-75 text-sm sm:text-base'
            />
        </div>
    )
}

export default SearchBar