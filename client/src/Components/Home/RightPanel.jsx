import React from 'react'
import SearchBar from './right/SearchBar'
import DisplayPic from './right/DisplayPic'
import Connect from './right/Connect'
import Info from './right/Info'
import Attachments from './right/Attachments'

const RightPanel = () => {
    return (
        <div>
            <SearchBar />
            <DisplayPic />
            <Connect />
            <Info />
            <Attachments />
        </div>
    )
}

export default RightPanel