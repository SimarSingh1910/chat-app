import React from 'react'
import Status from './status'
import Hobbies from './hobbies'
import Pronouns from './pronouns'
import ProfileSettings from './online'
import Save from './save'

const RightSection = (
    { selectedImage,
        onlineStatus, setOnlineStatus,
        statusMood, setStatusMood,
        hobbies, setHobbies,
        customHobby, setCustomHobby,
        pronoun, setPronoun
    }) => {

    return (
        <div className='rounded-2xl shadow-2xl bg-white'>
            <ProfileSettings value={onlineStatus} setValue={setOnlineStatus} />
            <Status value={statusMood} setValue={setStatusMood} />
            <Hobbies
                selected={hobbies}
                setSelected={setHobbies}
                customHobby={customHobby}
                setCustomHobby={setCustomHobby}
            />
            <Pronouns value={pronoun} setValue={setPronoun} />
            <Save
                data={{
                    selectedImage,
                    onlineStatus,
                    statusMood,
                    hobbies,
                    pronoun
                }}
                customHobby={customHobby}
            />
        </div>
    )
}

export default RightSection