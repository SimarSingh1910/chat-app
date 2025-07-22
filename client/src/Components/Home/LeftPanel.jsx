import React, { useState } from 'react'
import Info from './left/Info';
import Search from './left/Search';
import ContactCards from './left/ContactCards';
import { useNavigate } from 'react-router-dom';

const LeftPanel = ( { selectedUser, setSelectedUser } ) => {
    return (
        <div>
            <Info />
            <Search />
            <ContactCards selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
        </div>
    )
}

export default LeftPanel;