import React, { useState } from 'react';
import { userDummyData } from '../../../assets/userDummyData';
import avatar from '../../../assets/avatar.svg';
import demoDP1 from '../../../assets/demo-DP-NPC.jpg'
import { span } from 'framer-motion/client';
import { div } from 'framer-motion/m';



const ContactCards = () => {
    const [userChat, setUserChat] = useState(false);
    return (
        <div>
            <div className='flex flex-col'>
                {userDummyData.map((user, index) => {
                    const isSelected = userChat && userChat._id === user._id;
                    return (
                        <div
                            key={user._id || index}
                            className={`relative flex items-center gap-2 p-2 pl-2 rounded cursor-pointer h-15 max-sm:text-sm transition-colors duration-150 ${isSelected ? 'bg-[#282142]/35' : 'hover:bg-[#b5bdbf]'}`}
                            onClick={() => setUserChat(user)}
                        >
                            <img src={demoDP1 || avatar} alt="display-Pic" className='w-[50px] aspect-[1/1] rounded-full'/>
                            <div className='flex flex-col leading-5'>
                                <div className='flex items-center gap-2'>
                                    <p className='-mt-7'>{`${user.first_name} ${user.last_name}`}</p>
                                    {user.online ? 
                                    <span className='inline-block rounded-full bg-[#488b50] w-2 h-2 -mt-7'></span> : 
                                    <span className='inline-block rounded-full bg-gray-500 w-2 h-2 -mt-7'></span>
                                    }
                                    <span className='absolute right-4 top-0'>{user.time}</span>
                                </div>
                            </div>
                            {user.unread > 0 && <p className="absolute top-7 right-4 flex items-center justify-center h-5 w-5 rounded-full bg-[#a7dae7] text-xs text-center">
                                {user.unread} </p>}
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default ContactCards