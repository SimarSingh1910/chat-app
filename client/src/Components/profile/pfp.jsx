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
        `rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
            active ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`;

    return (
        <div className="relative h-36 w-36">
            <button
                type="button"
                className="group relative block h-full w-full rounded-full"
                onClick={() => setShowSelector(true)}
            >
                <img
                    src={selectedImage || DefaultProfilePic}
                    alt="Profile"
                    className="h-full w-full rounded-full object-cover ring-4 ring-slate-100 transition group-hover:ring-cyan-100"
                />
                <span className="absolute bottom-1 right-1 grid h-9 w-9 place-items-center rounded-full bg-cyan-600 text-white ring-4 ring-white transition-colors group-hover:bg-cyan-700">
                    <Pencil size={15} />
                </span>
            </button>

            {showSelector && (
                <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
                    <div className="max-h-[90vh] w-full max-w-[700px] overflow-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-900">Choose an avatar</h2>
                            <div className="flex gap-2">
                                <button onClick={() => setMode('presets')} className={tabClass(mode === 'presets')}>
                                    Presets
                                </button>
                                <button onClick={() => setMode('upload')} className={tabClass(mode === 'upload')}>
                                    Upload
                                </button>
                            </div>
                        </div>

                        {/* --- PRESETS (105-avatar grid) --- */}
                        {mode === 'presets' && (
                            <div className="grid grid-cols-5 gap-3 sm:grid-cols-6">
                                {avatarImages.map((src, index) => {
                                    const active = selectedImage === src;
                                    return (
                                        <img
                                            key={index}
                                            src={src}
                                            alt={`Avatar ${index + 1}`}
                                            className={`h-16 w-16 cursor-pointer rounded-full object-cover ring-2 transition sm:h-[4.5rem] sm:w-[4.5rem] ${
                                                active ? 'ring-cyan-500' : 'ring-transparent hover:ring-cyan-300'
                                            }`}
                                            onClick={() => handleSelect(src)}
                                        />
                                    );
                                })}
                            </div>
                        )}

                        {/* --- UPLOAD (file → crop → save) --- */}
                        {mode === 'upload' && (
                            <div>
                                {!imageSrc ? (
                                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 py-12 text-center">
                                        <p className="mb-4 text-sm text-slate-500">
                                            Upload a photo and crop it to a square.
                                        </p>
                                        <label className="cursor-pointer rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-700">
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
                                        <div className="relative h-64 w-full overflow-hidden rounded-xl bg-slate-900">
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
                                        <div className="mt-4 flex items-center gap-3">
                                            <span className="text-sm text-slate-500">Zoom</span>
                                            <input
                                                type="range"
                                                min={1}
                                                max={3}
                                                step={0.1}
                                                value={zoom}
                                                onChange={(e) => setZoom(Number(e.target.value))}
                                                className="flex-1 accent-cyan-600"
                                            />
                                        </div>
                                        {uploadError && (
                                            <p className="mt-2 text-sm text-red-500">{uploadError}</p>
                                        )}
                                        <div className="mt-4 flex justify-between">
                                            <button
                                                onClick={() => setImageSrc(null)}
                                                disabled={uploading}
                                                className="cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60"
                                            >
                                                Change image
                                            </button>
                                            <button
                                                onClick={handleUploadSave}
                                                disabled={uploading || !croppedAreaPixels}
                                                className="cursor-pointer rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {uploading ? 'Uploading…' : 'Save photo'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="mt-4 flex justify-end border-t border-slate-100 pt-4">
                            <button
                                onClick={closeAll}
                                className="cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100"
                            >
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
