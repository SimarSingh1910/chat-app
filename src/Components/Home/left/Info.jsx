import React from 'react'

const Info = () => {
    return (
        <div className='flex '>
            <img src="src\assets\demo dp.png" alt="none" className='w-15 h-15 rounded-full mt-3 ml-3' />
            <div>
                <h2 className='text-lg font-bold mt-5 ml-3 text-cyan-800'>Dianna Gahlaut</h2>
                <h4 className='text-sm ml-3'>Unemployed</h4>
            </div>
            <img src="src\assets\pencil-svgrepo-com.svg" alt="" className='w-7 ml-[30%] mt-[4%]'/>
        </div>
    )
}

export default Info