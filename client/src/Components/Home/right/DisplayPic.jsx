import React from 'react';
import profileDummy from '../../../assets/profileData';

const DisplayPic = ({ selectedUser }) => {
    const currentProfile = selectedUser
        ? profileDummy.find(profile => profile.email === selectedUser.email.toString())
        : null;

    selectedUser && console.log(`id of selected User in display pic: ${selectedUser.email}`);
    return (
        <div className="w-full flex flex-col mt-5">
            {/* Profile Image Container */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 m-auto mt-2">
                <img
                    src={currentProfile ? currentProfile.dp : '/images/demo-DP-NPC.jpg'}
                    alt="Display Picture"
                    className="rounded-full w-full h-full object-cover"
                />
            </div>

            {/* Name & Subtitle */}
            <div className="flex flex-col items-center w-full mt-1">
                <h1 className="text-sm sm:text-base md:text-lg font-bold text-center">
                    {selectedUser ? selectedUser.first_name + ' ' + selectedUser.last_name : 'Username'}
                </h1>

                <h3 className="text-[10px] sm:text-xs md:text-sm text-center">
                    {selectedUser ? selectedUser.designation : 'unemployed'}
                </h3>
            </div>
        </div>
    );
};

export default DisplayPic;
