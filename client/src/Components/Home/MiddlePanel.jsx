import React, { useState } from 'react'
import PersonInfo from './middle/PersonInfo'
import ChatPanel from './middle/chatPanel'
import TextPanel from './middle/TextPanel'

const MiddlePanel = ({ selectedUser }) => {
    const [messages, setMessages] = useState([]);

    const addMessage = (message) => {
        setMessages(prev => [...prev, message]);
    };

    console.log(selectedUser);
    return (
        <div>
            <PersonInfo selectedUser={selectedUser}/>
            <ChatPanel messages={messages} />
            <TextPanel addMessage={addMessage} />
        </div>
    )
}

export default MiddlePanel