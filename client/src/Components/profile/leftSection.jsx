import React from 'react'
import Pfp from './pfp'
import UsernameSec from './usernameSec'

const LeftSection = ({ selectedImage, setSelectedImage, user, setUser }) => {
    return (
        <div className='flex h-fit flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
            <Pfp user={user} selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
            <UsernameSec user={user} setUser={setUser} />
        </div>
    )
}

export default LeftSection
