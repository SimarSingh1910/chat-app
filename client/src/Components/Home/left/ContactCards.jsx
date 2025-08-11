// components/Chat/ContactCards.jsx
import React from 'react';
import { userDummyData } from '../../../assets/userDummyData';
import ContactCard from './ContactCard';

const ContactCards = ({ selectedUser, setSelectedUser }) => {
    return (
        <div className="flex flex-col">
            {userDummyData.map(user => (
                <ContactCard
                    key={user._id}
                    user={user}
                    isSelected={selectedUser?._id === user._id}
                    onClick={() => setSelectedUser(user)}
                />
            ))}
        </div>
    );
};

export default ContactCards;
