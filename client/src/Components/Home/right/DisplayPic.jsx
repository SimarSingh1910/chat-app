import React from 'react'
import displayPic from '../../../assets/demo dp.png'

const DisplayPic = () => {
    return (
        <div className="w-full flex flex-col  py-1">
            <img src={displayPic} alt="Display Picture" className='rounded-full w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-cover m-auto' />
            <div className='flex flex-col items-center w-full'>
                <h1 className='text-lg sm:text-xl md:text-2xl font-bold text-center mt-2'>Dianne Gahlaut</h1>
                <h3 className='text-xs sm:text-sm md:text-base text-center'>Unemployed</h3>
            </div>
        </div>
    )
}

export default DisplayPic