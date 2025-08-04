import React from 'react'

const Pronouns = ({value,setValue}) => {
    return (
        <div className='m-5'>
            <h3 className='font-medium mb-1'>Pronouns</h3>
            <div>
                <input
                    type="text"
                    name="pronoun"
                    id="pronoun"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className='border border-gray-300 w-full mt-2 rounded-lg placeholder:text-gray-700 bg-gray-100 p-2 focus:outline-none focus:ring-1 focus:ring-black'
                    placeholder='i.e He/Him ,She/Her ,etc'
                />
            </div>
        </div >
    )
}

export default Pronouns