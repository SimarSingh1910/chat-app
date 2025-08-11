import React from 'react';
import profileDummyData from '../../../assets/profileData';
import search from '../../../assets/search-svgrepo-com.svg';
import phone from '../../../assets/phone-svgrepo-com.svg';

const PersonInfo = ({ selectedUser }) => {
  // Find profile info by matching email
  const profile = profileDummyData.find(profile => profile.email === selectedUser.email);

  return (
    <div>
      <div className='flex items-center justify-between py-3 mx-4 border-b-2 border-stone-200'>
        <div className='flex items-center gap-3'>
          {/* Profile Picture */}
          <img
            src={profile ? `/${profile.dp}` : '/images/default-profile-pic.jpg'}
            alt="display pic"
            className='w-14 h-14 rounded-full object-cover'
          />

          {/* Name and Status */}
          <div className="flex flex-col">
            <p className='font-semibold'>{`${selectedUser.first_name} ${selectedUser.last_name}`}</p>
            <div className="flex items-center gap-2">
              <span className='rounded-full w-2 h-2 bg-green-600'></span>
              <span className="text-sm text-gray-600">online</span>
            </div>
          </div>
        </div>

        {/* Action Icons */}
        <div className='flex items-center gap-4'>
          <img src={search} alt="search" className='w-6 h-6 cursor-pointer' />
          <img src={phone} alt="phone" className='w-6 h-6 cursor-pointer' />
        </div>
      </div>
    </div>
  );
};

export default PersonInfo;
