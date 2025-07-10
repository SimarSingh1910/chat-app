import React from 'react'
import Info from './left/Info';
import Search from './left/Search';
import ContactCards from './left/ContactCards';

const LeftPanel = () => {
    return (
        <div>
            <Info />
            <Search />
            <ContactCards />
        </div>
    )
}


export default LeftPanel;