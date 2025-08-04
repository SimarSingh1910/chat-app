import React from 'react';
import demoDP from '../../../../public/images/demo-DP-NPC.jpg';
import search from '../../../assets/search-svgrepo-com.svg'
import phone from '../../../assets/phone-svgrepo-com.svg'

const PersonInfo = ({ selectedUser }) => {
  console.log(selectedUser)
  console.log(`selected user in middlepanel: ${selectedUser.first_name}`)
  return (
    <div>
      <div className='flex items-center justify-between py-3 mx-4 border-b-2 border-stone-200'>
        <div className='flex space-around items-center gap-3 w-70'>
          <img src={demoDP} alt="display pic" className='w-15 rounded-full object-cover h-15'/>
          <p>{`${selectedUser.first_name} ${selectedUser.last_name}`}</p>
          <span className='rounded-full w-3 h-3 bg-green-600'></span>
        </div>
        <div className='flex items-center justify-evenly w-20'>
          <img src={search} alt="" className='relative w-9 h-9'/>
          <img src={phone} alt="" className='relative w-9 h-9'/>     
        </div>
      </div>
    </div>
  );
};

export default PersonInfo;    