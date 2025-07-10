import React from 'react'

const DisplayPic = () => {
    return (
        <div>
            <img src="src\assets\demo dp.png" alt="Display Picture" className='rounded-full w-30 h-30 m-auto mt-9'/>
            <div className='flex justify-center flex-col'>
                <h1 className='text-xl font-bold text-center mt-2'>Dianne Gahlaut</h1>
                <h3 className='text-sm text-center'>Unemployed</h3>
            </div>
        </div>
    )
}

export default DisplayPic