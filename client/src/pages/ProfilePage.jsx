import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import LeftSection from '../Components/profile/leftSection'
import RightSection from '../Components/profile/rightSection'
import api from '../lib/api'

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
                const { data } = await api.get('/profile');
                const profile = data.profile;

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
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
                    >
                        <ArrowLeft size={16} /> Back to chats
                    </Link>
                    <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        Edit profile
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Customize how you appear to others across ChatApp.
                    </p>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
                    <LeftSection
                        user={user}
                        setUser={setUser}
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
        </div>
    )
}

export default ProfilePage