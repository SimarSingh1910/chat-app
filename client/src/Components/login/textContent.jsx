import React from 'react'

const TextContent = () => {
    return (
        <div className='flex flex-col items-center justify-center h-screen bg-gradient-to-r from-cyan-500 to-teal-500 text-white p-4 sm:p-6 lg:p-8'>
            <h1 className='text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-center leading-tight mb-4'>
                Talk Freely, Connect Instantly — Your World, One Chat Away.
            </h1>
            <p className='w-full sm:w-5/6 lg:w-3/4 xl:w-4/5 pt-2 sm:pt-4 text-sm sm:text-base lg:text-lg text-center leading-relaxed'>
                Stay close to the people who matter. With real-time messaging, seamless chats, and a clean, intuitive design, our app makes connecting with friends, family, and new people easier than ever. Whether it's a quick hello or a deep conversation, start chatting your way — anytime, anywhere.
            </p>
        </div>
    )
}

export default TextContent