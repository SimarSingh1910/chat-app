import React, { useState } from 'react';
import LeftPanel from '../Components/Home/LeftPanel';
import MiddlePanel from '../Components/Home/MiddlePanel';
import RightPanel from '../Components/Home/RightPanel';
import { useChat } from '../Components/ChatContext';

const HomePage = () => {
    const { activeConversation, closeConversation } = useChat();
    const [showInfo, setShowInfo] = useState(false);

    return (
        <div className="h-screen bg-gradient-to-br from-cyan-100 via-white to-teal-100 md:p-4">
            <div className="relative flex h-full bg-white md:rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5">
                {/* Inbox — on mobile it hides once a chat is open */}
                <aside
                    className={`w-full md:w-80 lg:w-87 shrink-0 border-r border-gray-200 bg-white
                        ${activeConversation ? 'hidden md:flex' : 'flex'} flex-col min-h-0`}
                >
                    <LeftPanel />
                </aside>

                {/* Conversation thread */}
                <main
                    className={`flex-1 min-w-0 bg-[#eef6f8]
                        ${activeConversation ? 'flex' : 'hidden md:flex'} flex-col min-h-0`}
                >
                    <MiddlePanel
                        onToggleInfo={() => setShowInfo((v) => !v)}
                        onBack={closeConversation}
                    />
                </main>

                {/* Contact info — inline column on large screens, overlay below */}
                {showInfo && activeConversation && (
                    <aside
                        className="absolute inset-y-0 right-0 z-20 w-full sm:w-96 lg:static lg:w-80 xl:w-88 shrink-0
                            bg-white border-l border-gray-200 shadow-2xl lg:shadow-none flex flex-col min-h-0"
                    >
                        <RightPanel onClose={() => setShowInfo(false)} />
                    </aside>
                )}
            </div>
        </div>
    );
};

export default HomePage;
