import React from 'react'

const Connect = () => {
    return (
        <div>
            <div className='flex mt-4'>
                <div className='mt-2'>
                    <img src='src\assets\message-bubble-svgrepo-com.svg' alt='' className='w-15 ml-28'/>
                    <h4 className='ml-32 text-sm text-'>Chat</h4>
                </div>
                <div className="border-l-2 border-gray-300 h-22 ml-5"></div>
                <div className='mt-2'>
                    <img src="src\assets\video-recorder-2-svgrepo-com.svg" alt="" className='w-15 ml-4' />
                    <h4 className='ml-4 text-sm'>Video Call</h4>
                </div>
            </div>
        </div>
    )
}

export default Connect