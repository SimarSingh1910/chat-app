import React from 'react';
import demoDP from '../../../assets/demo-DP-Raju-Rastogi.jpg';

const PersonInfo = ({ user }) => {
  if (!user) return <div>Select a user</div>;
  return (
    <div>
      <div className='w-full border h-17 mt-2 p-2 flex'>
        <img src={user.img || demoDP} alt="dp" className='relative rounded-full w-15 h-15 object-cover'/>
        <p>{`${user.first_name} ${user.last_name}`}</p>
      </div>
    </div>
  );
};

export default PersonInfo;