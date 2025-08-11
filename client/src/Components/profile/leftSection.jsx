import React from 'react'
import Pfp from './pfp'
import UsernameSec from './usernameSec'

const LeftSection = ({ selectedImage, setSelectedImage, user }) => {
    return (
        <div className='rounded-2xl flex flex-col bg-white justify-center items-center gap-2 shadow-2xl'>
            <Pfp user={user} selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
            <UsernameSec user={user} />
        </div>
    )
}

export default LeftSection