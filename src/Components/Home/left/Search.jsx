import React from 'react'

const Search = () => {
    return (
        <div className='bg-white w-80 m-auto p-2 mt-5 rounded-full'>
            <img src='src\assets\search-svgrepo-com.svg' className='w-5 inline ' />
            <input type='text' placeholder='Search here...' className='w-50 placeholder:font-sans focus:outline-none focus:ring-0 focus:border-transparent placeholder-gray-500 placeholder-opacity-75 ' />
        </div>
    )
}

export default Search