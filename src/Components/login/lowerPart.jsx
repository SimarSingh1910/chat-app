import React from 'react'

const LowerPart = () => {

    return (
        <div className='w-full flex flex-col justify-center items-center bg-gray-100 py-8'>
            <div className='w-full max-w-4xl px-4 sm:px-6 lg:px-8'>
                <h2 className='text-xl sm:text-2xl font-semibold text-gray-800 mb-4'>Join the Community</h2>
                <p className='text-gray-600 mb-6'>Connect with like-minded individuals and share your thoughts.</p>
                <button className='bg-sky-500 text-white px-6 py-3 rounded-lg hover:bg-sky-600 transition-colors duration-200'>
                    Sign Up Now
                </button>
            </div>
        </div>
    );
};
export default LowerPart;