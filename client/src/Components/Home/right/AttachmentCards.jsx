import React from 'react'

const AttachmentCards = ( {type, img}) => {
    const getTypeLabel = () => {
        switch(type) {
            case 'pdf': return ''
            case 'video': return ''
            case 'audio': return ''
            default: return ''
        }
    }

    return (
        <div className='flex gap-5 mt-1'>
            <img src={ img } alt={`${type} attachment`} className='w-12 h-12 ' />
            <p>{ getTypeLabel() }</p>
        </div>
    )
}

export default AttachmentCards