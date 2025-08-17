import React, { useState } from 'react';
import LeftPanel from '../Components/Home/LeftPanel';
import MiddlePanel from '../Components/Home/MiddlePanel';
import RightPanel from '../Components/Home/RightPanel';

const HomePage = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [showRightPanel, setShowRightPanel] = useState(false);

    // Handler to be passed to LeftPanel/ContactCards
    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setShowRightPanel(true);
    };

    return (
        <div className="h-screen">
            <div
                className={`grid gap-[2px] border-purple-500 border-2 h-full p-4 rounded-lg transition-all duration-300
                ${showRightPanel ? 'grid-cols-[1fr_2fr_1fr]' : 'grid-cols-[1fr_2fr]'}`}
            >
                {/* Left Panel */}
                <div className="box-border bg-gray-200 h-full rounded-l-lg">
                    <LeftPanel
                        selectedUser={selectedUser}
                        setSelectedUser={handleSelectUser}
                    />
                </div>

                {/* Middle Panel */}
                <div
                    className={`border-purple-500 bg-gray-300 border-2 border-r-0 border-l-0 box-border h-full
                    ${!showRightPanel ? 'rounded-r-lg' : ''}`}
                >
                    <MiddlePanel
                        selectedUser={selectedUser}
                        setSelectedUser={handleSelectUser}
                    />
                </div>

                {/* Right Panel */}
                {showRightPanel && (
                    <div className="box-border bg-gray-200 h-full rounded-r-lg">
                        <RightPanel selectedUser={selectedUser} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
