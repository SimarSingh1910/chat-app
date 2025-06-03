// import { useRef } from 'react';
import { motion as Motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';
import React from 'react';

const LoginPart = () => {
    const { ref, inView } = useInView({
        triggerOnce: false, // animate every time in view
        threshold: 0.2,     // adjust as needed
    });

    const [value, setValue] = useState('');
    const [pass, setPass] = useState('');

    return (
        <Motion.div
            ref={ref}
            initial={{ opacity: 0, y: 80, scale: 0.90 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className='bg-gradient-to-r from-teal-500 to-lime-500'
        >
            <div className='flex flex-col items-center justify-center h-auto p-8'>
                <h1 className='text-4xl font-bold text-white mb-6'>Welcome Back!</h1>
                <input type="text" name="email" id="email" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Email" className={`border border-gray-700 rounded-md p-2 w-1/3 mb-4 focus:bg-auto focus:border-2 hover:border-2 outline-none ${value ? ' bg-auto' : 'bg-auto'}`} />
                <input type="password" name="password" id="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Password" className={`border border-gray-700 rounded-md p-2 w-1/3 mb-4 focus:bg-auto focus:border-2 hover:border-2 outline-none ${pass ? ' bg-auto' : 'bg-auto'}`} />
                <button className='bg-black text-white rounded-lg border border-gray-700 p-2 w-1/3 hover:bg-gray-700 transition-colors duration-300'>Login</button>
            </div>
        </Motion.div>
    );
};

export default LoginPart;
