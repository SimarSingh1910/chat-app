import React, { useState } from 'react'
import Status from './status'
import Hobbies from './hobbies'
import Pronouns from './pronouns'
import ProfileSettings from './online'
import Save from './save'

const RightSection = () => {
    const [onlineStatus, setOnlineStatus] = useState('active');
    const [statusMood, setStatusMood] = useState('');
    const [hobbies, setHobbies] = useState({});
    const [customHobby, setCustomHobby] = useState('');
    const [pronoun, setPronoun] = useState("");

    return (
        <div className='rounded-2xl shadow-2xl bg-white'>
            <ProfileSettings value={onlineStatus} setValue={setOnlineStatus } />
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
                    onlineStatus,
                    statusMood,
                    hobbies,
                    customHobby,
                    pronoun
                }}
            />
        </div>
    )
}

export default RightSection