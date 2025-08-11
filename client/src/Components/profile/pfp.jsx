import React, { useState } from 'react';
import DefaultProfilePic from '../../assets/default-profile-pic.jpg';
import { Pencil } from 'lucide-react';

const Pfp = ({ selectedImage, setSelectedImage }) => {
    const [showSelector, setShowSelector] = useState(false);

    const handleSelect = (imgPath) => {
        setSelectedImage(imgPath);
        setShowSelector(false);
    };

    const avatarImages = Array.from(
        { length: 105 },
        (_, i) => `/images/Bust/peep-${i + 1}.png`
    );

    return (
        <div className="w-48 h-48 relative">
            <div className="cursor-pointer block w-full h-full relative" onClick={() => setShowSelector(true)}>
                <img
                    src={selectedImage || DefaultProfilePic}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover transition shadow-[0_0_15px_2px_rgba(6,182,212,0.4),_0_0_25px_5px_rgba(20,184,166,0.4)]
                   hover:shadow-[0_0_20px_6px_rgba(6,182,212,0.5),_0_0_40px_12px_rgba(20,184,166,0.5)]"
                />
                <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-700">
                    <Pencil size={16} className="text-white" />
                </div>
            </div>

            {showSelector && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-10 p-4">
                    <div className="bg-white p-4 rounded-lg shadow-lg max-w-[700px] max-h-[90vh] overflow-auto">
                        <h2 className="text-lg font-semibold mb-4">Choose an Avatar</h2>
                        <div className="grid grid-cols-6 gap-4">
                            {avatarImages.map((src, index) => (
                                <img
                                    key={index}
                                    src={src}
                                    alt={`Avatar ${index + 1}`}
                                    className="w-20 h-20 rounded-full object-cover cursor-pointer border-2 hover:border-blue-500"
                                    onClick={() => handleSelect(src)}
                                />
                            ))}
                        </div>
                        <div className="flex justify-end mt-4">
                            <button onClick={() => setShowSelector(false)} className="px-4 py-2 bg-gray-300 rounded hover:cursor-pointer">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pfp;
