import React from 'react'
import Pfp from './pfp'
import UsernameSec from './usernameSec'

const LeftSection = () => {
    return (
        <div className='rounded-2xl flex flex-col justify-center items-center gap-2 shadow-2xl bg-white'>
            <Pfp />
            <UsernameSec />
        </div>
    )
}

export default LeftSection