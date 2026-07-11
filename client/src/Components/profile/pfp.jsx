import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import DefaultProfilePic from '../../assets/default-profile-pic.jpg';
import { Pencil } from 'lucide-react';
import api from '../../lib/api';
import getCroppedImg from '../../lib/cropImage';

const Pfp = ({ selectedImage, setSelectedImage }) => {
    const [showSelector, setShowSelector] = useState(false);
    const [mode, setMode] = useState('presets'); // 'presets' | 'upload'

    // Upload/crop state
    const [imageSrc, setImageSrc] = useState(null); // data URL of the picked file
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');

    const closeAll = () => {
        setShowSelector(false);
        setMode('presets');
        setImageSrc(null);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
        setUploadError('');
    };

    // Pick a preset — only updates local state. If a custom Cloudinary avatar was
    // active, the old cloud asset is cleaned up server-side when the change is
    // persisted via Save Profile, keeping cleanup atomic with the DB write.
    const handleSelect = (imgPath) => {
        setSelectedImage(imgPath);
        closeAll();
    };

    const handleFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadError('');
        const reader = new FileReader();
        reader.onload = () => {
            setImageSrc(reader.result);
            setZoom(1);
            setCrop({ x: 0, y: 0 });
        };
        reader.readAsDataURL(file);
    };

    const onCropComplete = useCallback((_area, pixels) => {
        setCroppedAreaPixels(pixels);
    }, []);

    const handleUploadSave = async () => {
        if (!imageSrc || !croppedAreaPixels) return;
        setUploading(true);
        setUploadError('');
        try {
            const cropped = await getCroppedImg(imageSrc, croppedAreaPixels);
            const { data } = await api.post('/profile/avatar', { image: cropped });
            setSelectedImage(data.selectedImage);
            closeAll();
        } catch (err) {
            setUploadError(
                err.response?.data?.error || 'Upload failed. Please try again.'
            );
        } finally {
            setUploading(false);
        }
    };

    const avatarImages = Array.from(
        { length: 105 },
        (_, i) => `/images/Bust/peep-${i + 1}.png`
    );

    const tabClass = (active) =>
        `px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer ${
            active ? 'bg-cyan-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`;

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
                    <div className="bg-white p-4 rounded-lg shadow-lg max-w-[700px] w-full max-h-[90vh] overflow-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Choose an Avatar</h2>
                            <div className="flex gap-2">
                                <button onClick={() => setMode('presets')} className={tabClass(mode === 'presets')}>
                                    Presets
                                </button>
                                <button onClick={() => setMode('upload')} className={tabClass(mode === 'upload')}>
                                    Upload
                                </button>
                            </div>
                        </div>

                        {/* --- PRESETS (unchanged 105-avatar grid) --- */}
                        {mode === 'presets' && (
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
                        )}

                        {/* --- UPLOAD (file → crop → save) --- */}
                        {mode === 'upload' && (
                            <div>
                                {!imageSrc ? (
                                    <div className="flex flex-col items-center justify-center py-10 text-center">
                                        <p className="text-sm text-gray-600 mb-4">
                                            Upload a photo and crop it to a square.
                                        </p>
                                        <label className="px-4 py-2 bg-cyan-500 text-white rounded-lg cursor-pointer hover:bg-cyan-600">
                                            Choose image
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFile}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="relative w-full h-64 bg-gray-900 rounded-lg overflow-hidden">
                                            <Cropper
                                                image={imageSrc}
                                                crop={crop}
                                                zoom={zoom}
                                                aspect={1}
                                                cropShape="round"
                                                showGrid={false}
                                                onCropChange={setCrop}
                                                onZoomChange={setZoom}
                                                onCropComplete={onCropComplete}
                                            />
                                        </div>
                                        <div className="flex items-center gap-3 mt-4">
                                            <span className="text-sm text-gray-600">Zoom</span>
                                            <input
                                                type="range"
                                                min={1}
                                                max={3}
                                                step={0.1}
                                                value={zoom}
                                                onChange={(e) => setZoom(Number(e.target.value))}
                                                className="flex-1 accent-cyan-500"
                                            />
                                        </div>
                                        {uploadError && (
                                            <p className="text-red-500 text-sm mt-2">{uploadError}</p>
                                        )}
                                        <div className="flex justify-between mt-4">
                                            <button
                                                onClick={() => setImageSrc(null)}
                                                disabled={uploading}
                                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-60 cursor-pointer"
                                            >
                                                Change image
                                            </button>
                                            <button
                                                onClick={handleUploadSave}
                                                disabled={uploading || !croppedAreaPixels}
                                                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded hover:from-cyan-600 hover:to-teal-600 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                                            >
                                                {uploading ? 'Uploading…' : 'Save photo'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex justify-end mt-4">
                            <button onClick={closeAll} className="px-4 py-2 bg-gray-300 rounded hover:cursor-pointer">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pfp;
