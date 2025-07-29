import React from 'react'
import SearchBar from './right/SearchBar'
import DisplayPic from './right/DisplayPic'
import Connect from './right/Connect'
import Info from './right/Info'
import Attachments from './right/Attachments'

const RightPanel = () => {
    return (
        <div className="flex flex-col p-2 w-full h-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
            <SearchBar />
            <DisplayPic />
            <Connect />
            <Info />
            <Attachments />
        </div>
    )
}

export default RightPanel