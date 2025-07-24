import React, { useState } from 'react';
import { userDummyData } from '../../../assets/userDummyData';
import avatar from '../../../assets/avatar.svg';
import demoDP1 from '../../../assets/demo-DP-NPC.jpg';

const ContactCards = ({ selectedUser, setSelectedUser }) => {
    const [userChat, setUserChat] = useState(null);

    return (
        <div className="flex flex-col">
            {userDummyData.map((user) => (
                <div
                    key={user._id}
                    onClick={() => setUserChat(user)}
                    className={`relative flex items-center p-2 rounded cursor-pointer transition-colors duration-150 mx-1 my-1 
                    ${userChat?._id === user._id ? 'bg-[#282142]/35' : 'hover:bg-[#b5bdbf]'}`}
                >
                    {/* Avatar */}
                    <img
                        src={demoDP1 || avatar}
                        alt="display-pic"
                        className="w-12 h-12 rounded-full object-cover"
                    />

                    {/* Main Content */}
                    <div className="flex-1 min-w-0 ml-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <p className="font-medium text-sm truncate">{`${user.first_name} ${user.last_name}`}</p>
                                <span className={`w-2 h-2 rounded-full mt-0.5 ${user.online ? 'bg-[#168323]' : 'bg-gray-500'}`}></span>
                            </div>
                            <span className="text-xs text-gray-700">{user.time}</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                            <p className="text-xs text-gray-700 truncate max-w-[300px] overflow-hidden whitespace-nowrap">{user.message}</p>
                            {user.unread > 0 && (
                                <span className="h-5 w-5 rounded-full bg-[#a7dae7] text-[10px] text-black flex items-center justify-center">
                                    {user.unread}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ContactCards;
