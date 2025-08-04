import React, { useState } from 'react'
import LeftPanel from '../Components/Home/LeftPanel'
import MiddlePanel from '../Components/Home/MiddlePanel'
import RightPanel from '../Components/Home/RightPanel'

const HomePage = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    return (
        <div className="h-screen">
            <div className={`grid border-purple-500 border-2 h-full p-4 rounded-lg  ${selectedUser ? 'grid-cols-[1fr_1.5fr_1fr]' : 'grid-cols-[3fr_5fr]'}`}>
                <div className="box-border bg-gray-200 h-full rounded-l-lg border-r-2 border-r-stone-100">
                    <LeftPanel selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>
                </div>
                {selectedUser ? (
                    <>
                        <div className="bg-gray-300 box-border h-full border-r-stone-100 border-r-2">
                            <MiddlePanel selectedUser={selectedUser}/>
                        </div>
                        <div className="box-border bg-gray-200 h-full rounded-r-lg">
                            <RightPanel selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
                        </div>
                        {console.log(`selectedUser: ${selectedUser}`)}
                    </>
                ) : (
                    <div className="box-border bg-gray-200 h-full rounded-r-lg">
                        <RightPanel selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
                    </div>
                )}
            </div>
        </div>
    )
}
export default HomePage