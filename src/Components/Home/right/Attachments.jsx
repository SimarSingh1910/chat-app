import React from 'react'
import AttachmentCards from './AttachmentCards'
import documentIcon from '../../../assets/document-svgrepo-com.svg'
import videoIcon from '../../../assets/video-play-svgrepo-com.svg'
import musicIcon from '../../../assets/music-file-1-svgrepo-com.svg'
import imageIcon from '../../../assets/image-file-svgrepo-com.svg'

const Attachments = () => {
    return (
        <div>
            <h1 className='mt-4 ml-5 mb-2 font-bold'>Attachments</h1>
            <div className='flex flex-row gap-1 mb-4'>
                <AttachmentCards img={ documentIcon } type={'pdf'}/>
                <AttachmentCards img={ videoIcon } type={'video'}/>
                <AttachmentCards img={ musicIcon } type={'audio'}/>
                <AttachmentCards img={ imageIcon } type={'image'}/>
            </div>
            <div className='rounded-full border-1 border-cyan-600 text-center w-50 m-auto'>
                <p className='text-cyan-600'>view all</p>
            </div>
        </div>
    )
}

export default Attachments