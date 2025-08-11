import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import DefaultProfilePic from '../../assets/default-profile-pic.jpg';
import { Pencil } from 'lucide-react';
import getCroppedImg from './cropImage';

const Pfp = () => {
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [showCropper, setShowCropper] = useState(false);

    const onCropComplete = useCallback((_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageDataUrl = URL.createObjectURL(file);
            setImageSrc(imageDataUrl);
            setShowCropper(true);
        }
    };

    const handleCropDone = async () => {
        try {
            const cropped = await getCroppedImg(imageSrc, croppedAreaPixels);
            setCroppedImage(cropped);
            setShowCropper(false);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="w-48 h-48 relative">
            <div className="absolute inset-0 rounded-full 
                bg-gradient-to-br from-green-400 to-blue-500 
                blur-[12px] opacity-90" />

            <label className="cursor-pointer block w-full h-full relative">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                />
                <img
                    src={croppedImage || DefaultProfilePic}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover transition"
                />
                <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-700">
                    <Pencil size={16} className="text-white" />
                </div>
            </label>

            {showCropper && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <div className="relative w-[300px] h-[300px]">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                cropShape="round"
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>
                        <div className="flex justify-between mt-4">
                            <button onClick={() => setShowCropper(false)} className="px-4 py-2 bg-gray-300 rounded hover:cursor-pointer">Cancel</button>
                            <button onClick={handleCropDone} className="px-4 py-2 bg-blue-600 text-white rounded hover:cursor-pointer">Done</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pfp;
