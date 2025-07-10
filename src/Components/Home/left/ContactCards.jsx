import React from 'react'
import ContactCardsInfo from './ContactCardsInfo'
import demoDP from '../../../assets/demo-DP-NPC.jpg'
import demoDP1 from '../../../assets/demo-DP-Raju-rastogi.jpg'


const ContactCards = () => {
    return (
        <div className='w-[100%] h-[15%] mt-[3%] flex flex-col gap-2'>
            <ContactCardsInfo img={ demoDP } name={ "Guddu Gaurav" } text={ "bai paise dedo" } unreads={ 1 } time={"10:45 AM"}/>
            <ContactCardsInfo img={ demoDP1 } name={ "Raju Rastogi" } text={ "bai chutki ka number mile to dena plzzz" } unreads={ 1 } time={"10:45 AM"}/>
        </div>
    )
}

export default ContactCards