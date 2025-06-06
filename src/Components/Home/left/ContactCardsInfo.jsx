import React from 'react'

const ContactCardsInfo = ({ img, name, text, unreads, time }) => {

    return (
        <div className="w-[98%] h-[13%] flex relative items-center ml-[1%] pb-[2%]" >
            <img src={img} alt="Display Pic" className='w-13 h-13 rounded-full mr-4 object-cover' />
            <div className='pr-20 flex-1 min-w-0'>
                <div className="font-bold truncate">{name}</div>
                <div className='text-gray-600 truncate'>{text}</div>
            </div>
            <div className='absolute right-0 top-1 mt-[3%] flex flex-col items-end'>
                <div className='text-gray-600 text-sm'>{time}</div>
                <div className='bg-cyan-800 w-4 h-4 m-auto rounded-full flex justify-center items-center text-white text-xs'>{unreads}</div>
            </div>
            <div className='absolute left-0 right-0 bottom-0 h-0.5 bg-gray-300 w-full'></div>
        </div>
    )

}

export default ContactCardsInfo