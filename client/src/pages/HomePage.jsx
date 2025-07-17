import React, { useState } from 'react'
import LeftPanel from '../Components/Home/LeftPanel'
import MiddlePanel from '../Components/Home/MiddlePanel'
import RightPanel from '../Components/Home/RightPanel'

const HomePage = () => {
    const [selectedUser, setSelectedUser] = useState(false);
    return (
        <div className="h-screen">
            <div className='flex flex-row border-purple-500 border-2 h-full p-4 rounded-lg bg-gray-500'>
                <div className="w-1/4 box-border bg-gray-200 h-full rounded-l-lg">
                    <LeftPanel />
                </div>
                <div className="w-1/2  border-purple-500 border-2 border-r-0 border-l-0 box-border h-full">
                    <MiddlePanel />
                </div>
                <div className="w-1/4 box-border bg-gray-200 h-full rounded-r-lg">
                    <RightPanel />
                </div>
            </div> 
        </div>
    )
}
export default HomePage