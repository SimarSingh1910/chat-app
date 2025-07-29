import React from 'react'
import messageIcon from '../../../assets/message-bubble-svgrepo-com.svg'
import videoIcon from '../../../assets/video-recorder-2-svgrepo-com.svg'

const Connect = () => {
    return (
        <div className="w-full flex flex-col items-center">
            <div className='flex flex-row justify-center items-center gap-6 sm:gap-10 mt-0 w-full'>
                <div className='flex flex-col items-center'>
                    <img src={messageIcon} alt='' className='w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16' />
                    <h4 className='text-xs sm:text-sm md:text-base mt-1'>Chat</h4>
                </div>
                <div className="border-l-2 border-gray-300 h-10 sm:h-14 mx-2"></div>
                <div className='flex flex-col items-center'>
                    <img src={videoIcon} alt='' className='w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16' />
                    <h4 className='text-xs sm:text-sm md:text-base mt-1'>Video Call</h4>
                </div>
            </div>
        </div>
    )
}

export default Connect