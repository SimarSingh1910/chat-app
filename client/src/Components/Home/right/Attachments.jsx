import React from 'react'
import AttachmentCards from './AttachmentCards'
import documentIcon from '../../../assets/document-svgrepo-com.svg'
import videoIcon from '../../../assets/video-play-svgrepo-com.svg'
import musicIcon from '../../../assets/music-file-1-svgrepo-com.svg'
import imageIcon from '../../../assets/image-file-svgrepo-com.svg'

const Attachments = () => {
    return (
        <div className="w-full max-w-lg mx-auto p-2">
            <h1 className='mt-0 ml-2 mb-2 font-bold text-base sm:text-lg md:text-xl'>Attachments</h1>
            <div className='flex flex-wrap gap-2 justify-center mb-4'>
                <AttachmentCards img={ documentIcon } type={'pdf'}/>
                <AttachmentCards img={ videoIcon } type={'video'}/>
                <AttachmentCards img={ musicIcon } type={'audio'}/>
                <AttachmentCards img={ imageIcon } type={'image'}/>
            </div>
            <div className='rounded-full border-1 border-cyan-600 text-center w-32 sm:w-40 md:w-48 m-auto cursor-pointer transition hover:bg-cyan-50 mt-1'>
                <p className='text-cyan-600 py-1 text-sm sm:text-base'>view all</p>
            </div>
        </div>
    )
}

export default Attachments