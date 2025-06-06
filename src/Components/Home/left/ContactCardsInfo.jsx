import React from 'react'

const ContactCardsInfo = ({ img, name, text, unreads, time }) => {

    return (
        <>
            <div className="w-[98%] h-[13%] flex relative items-center" >
                <img src={img} alt="Display Pic" className='w-16 h-16 rounded-full mr-4 object-cover' />
                <div className='pr-20 flex-1 min-w-0'>
                    <div className="font-bold truncate">{name}</div>
                    <div className='text-gray-600 truncate'>{text}</div>
                </div>
                <div className='absolute right-0 top-1 mt-[3%] flex flex-col items-end'>
                    <div className='text-gray-600 text-sm'>{time}</div>
                    <div className='bg-blue-600 w-4 h-4 m-auto rounded-full flex justify-center items-center text-white text-xs'>{unreads}</div>
                </div>
            </div>
            <div className='w-full h-0.5 bg-gray-300 mt-1'></div>
        </>
    )

}

export default ContactCardsInfo