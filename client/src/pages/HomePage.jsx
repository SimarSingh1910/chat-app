import React, { useState } from 'react'
import LeftPanel from '../Components/Home/LeftPanel'
import MiddlePanel from '../Components/Home/MiddlePanel'
import RightPanel from '../Components/Home/RightPanel'

const HomePage = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    return (
        <div className="h-screen">
            <div className={`grid border-purple-500 border-2 h-full p-4 rounded-lg  ${selectedUser ? 'grid-cols-[1fr_1.5fr_1fr]' : 'grid-cols-2'}`}>
                <div className="box-border bg-gray-200 h-full rounded-l-lg">
                    <LeftPanel selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>
                </div>
                {selectedUser ? (
                    <>
                        <div className="border-purple-500 bg-gray-300 border-2 border-r-0 border-l-0 box-border h-full">
                            <MiddlePanel selectedUser={selectedUser}/>
                        </div>
                        <div className="box-border bg-gray-200 h-full rounded-r-lg">
                            <RightPanel />
                        </div>
                        {console.log(selectedUser)}
                    </>
                ) : (
                    <div className="box-border bg-gray-200 h-full rounded-r-lg">
                        <RightPanel />
                    </div>
                )}
            </div>
        </div>
    )
}
export default HomePage