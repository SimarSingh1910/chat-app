import React, { useState } from 'react'
import LeftPanel from '../Components/Home/LeftPanel'
import MiddlePanel from '../Components/Home/MiddlePanel'
import RightPanel from '../Components/Home/RightPanel'

const HomePage = () => {
    const [selectedUser, setSelectedUser] = useState(false)
    return (
        <div>
            <div className=''>
                <LeftPanel />
                <MiddlePanel />
                <RightPanel />
            </div> 
        </div>
    )
}
export default HomePage