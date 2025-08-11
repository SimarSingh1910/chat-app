import React, { useEffect, useState } from 'react'
import LeftSection from '../Components/profile/leftSection'
import RightSection from '../Components/profile/rightSection'

const ProfilePage = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [onlineStatus, setOnlineStatus] = useState('active');
    const [statusMood, setStatusMood] = useState('');
    const [hobbies, setHobbies] = useState({});
    const [customHobby, setCustomHobby] = useState('');
    const [pronoun, setPronoun] = useState("");
    const [user, setUser] = useState("");

    useEffect(() => {
        const getUserData = async () => {
            try {
                const res = await fetch("http://localhost:3000/profile", {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                const data = await res.json();
                const profile = data.profile;

                console.log(profile);

                setUser(profile);

                if (profile.selectedImage) setSelectedImage(profile.selectedImage);
                if (profile.onlineStatus) setOnlineStatus(profile.onlineStatus);
                if (profile.statusMood) setStatusMood(profile.statusMood);
                if (profile.hobbies) {
                    const hobbiesObj = profile.hobbies.reduce((acc, hobby) => {
                        acc[hobby] = true;
                        return acc;
                    }, {});
                    setHobbies(hobbiesObj);
                }
                if (profile.pronoun) setPronoun(profile.pronoun);

            } catch (err) {
                console.log('Error fetching user data:', err);
            }
        };

        getUserData();
    }, []);

    return (
        <div className="w-full h-screen flex justify-center items-center bg-gray-100">
            <div className='grid grid-cols-[1.25fr_2.75fr] gap-4 w-10/12 h-auto'>
                <LeftSection
                    user={user}
                    selectedImage={selectedImage}
                    setSelectedImage={setSelectedImage}
                />
                <RightSection
                    user={user}
                    selectedImage={selectedImage}
                    setSelectedImage={setSelectedImage}
                    onlineStatus={onlineStatus}
                    setOnlineStatus={setOnlineStatus}
                    statusMood={statusMood}
                    setStatusMood={setStatusMood}
                    hobbies={hobbies}
                    setHobbies={setHobbies}
                    customHobby={customHobby}
                    setCustomHobby={setCustomHobby}
                    pronoun={pronoun}
                    setPronoun={setPronoun}
                />
            </div>
        </div>
    )
}

export default ProfilePage