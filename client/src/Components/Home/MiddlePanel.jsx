import React from 'react'
import PersonInfo from './middle/personInfo'


const MiddlePanel = ({ selectedUser }) => {
    console.log(selectedUser)
    return (
        <div>
            <PersonInfo selectedUser={selectedUser}/>
        </div>
    )
}

export default MiddlePanel