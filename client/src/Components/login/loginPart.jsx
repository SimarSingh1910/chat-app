import { motion as Motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import React from 'react';
import InputForm from './inputForm';

const LoginPart = () => {


    
    const { ref, inView } = useInView({
        triggerOnce: false,
        threshold: 0.2,
    });


    return (
        <div className='bg-gradient-to-r from-cyan-500 to-teal-500 min-h-screen flex items-center justify-center py-8'>
            <Motion.div
                ref={ref}
                initial={{ opacity: 0, y: 80, scale: 0.90 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className='flex flex-col items-center justify-center w-full max-w-md mx-auto p-4 sm:p-6 lg:p-8'
            >
                <div className='bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full'>
                    <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-6 text-center'>
                        Welcome Back!
                    </h1>

                    <InputForm />

                    <div className='mt-6 text-center'>
                        <p className='text-gray-600 text-sm'>
                            Don't have an account?
                            <button className='text-cyan-500 hover:text-cyan-600 cursor-pointer font-semibold ml-1'>
                                Sign up
                            </button>
                        </p>
                    </div>
                </div>
            </Motion.div>
        </div>
    );
};

export default LoginPart;