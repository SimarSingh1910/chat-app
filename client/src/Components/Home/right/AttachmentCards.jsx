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
        <div>
            <img src={ img } alt={`${type} attachment`} className='w-15 h-10 ml-5' />
            <p>{ getTypeLabel() }</p>
        </div>
    )
}

export default AttachmentCards