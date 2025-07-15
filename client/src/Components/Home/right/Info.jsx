import React from 'react'
import personIcon from '../../../assets/person-male-svgrepo-com.svg'
import heartIcon from '../../../assets/heart-svgrepo-com (5).svg'

const Info = () => {
    return (
        <div className='mt-1 flex flex-wrap items-center justify-center gap-4 sm:gap-8 w-full'>
            <div className='flex items-center gap-2'>
                <img src={personIcon} alt="View Friends" className='w-5 h-5 sm:w-6 sm:h-6' />
                <h3 className='text-xs sm:text-sm'>View Friends</h3>
            </div>
            <div className='flex items-center gap-2'>
                <img src={heartIcon} alt="Add to favourites" className='w-5 h-5 sm:w-6 sm:h-6' />
                <h3 className='text-xs sm:text-sm font-thin'>Add to favourites</h3>
            </div>
        </div>
    )
}

export default Info