import React from 'react'
import LeftSection from '../Components/profile/leftSection'
import RightSection from '../Components/profile/rightSection'

const ProfilePage = () => {
    return (
        <div className="w-full h-screen flex justify-center items-center">
            <div className='grid grid-cols-[1.25fr_2.75fr] gap-4 w-10/12 h-10/12'>
                <LeftSection />
                <RightSection />
            </div>
        </div>
    )
}

export default ProfilePage