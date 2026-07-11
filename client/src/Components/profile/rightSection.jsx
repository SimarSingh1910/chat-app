import React from 'react'
import Status from './status'
import Hobbies from './hobbies'
import Pronouns from './pronouns'
import ProfileSettings from './online'
import Save from './save'

const RightSection = (
    {
        user,
        selectedImage,
        onlineStatus, setOnlineStatus,
        statusMood, setStatusMood,
        hobbies, setHobbies,
        customHobby, setCustomHobby,
        pronoun, setPronoun
    }) => {

    return (
        <div className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'>
            <div className='space-y-6 p-6'>
                <ProfileSettings value={onlineStatus} setValue={setOnlineStatus} />
                <Status value={statusMood} setValue={setStatusMood} />
                <Hobbies
                    selected={hobbies}
                    setSelected={setHobbies}
                    customHobby={customHobby}
                    setCustomHobby={setCustomHobby}
                />
                <Pronouns value={pronoun} setValue={setPronoun} />
            </div>
            <div className='border-t border-slate-100 bg-slate-50/50 p-6'>
                <Save
                    data={{
                        username: user.username,
                        selectedImage,
                        onlineStatus,
                        statusMood,
                        hobbies,
                        pronoun
                    }}
                    customHobby={customHobby}
                />
            </div>
        </div>
    )
}

export default RightSection
