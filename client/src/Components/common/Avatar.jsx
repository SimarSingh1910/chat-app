import React from 'react';

const DEFAULT_PIC = '/images/default-profile-pic.jpg';

const SIZES = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-14 h-14',
    xl: 'w-24 h-24',
};

// Round profile image with an optional presence dot.
// `online` may be true, false, or undefined (no dot rendered).
const Avatar = ({ src, alt = 'avatar', size = 'md', online, className = '' }) => (
    <div className={`relative shrink-0 ${SIZES[size] || SIZES.md} ${className}`}>
        <img
            src={src || DEFAULT_PIC}
            alt={alt}
            onError={(e) => {
                if (e.currentTarget.src !== window.location.origin + DEFAULT_PIC) {
                    e.currentTarget.src = DEFAULT_PIC;
                }
            }}
            className="w-full h-full rounded-full object-cover bg-cyan-50 ring-1 ring-black/5"
        />
        {online !== undefined && (
            <span
                className={`absolute bottom-0 right-0 block w-3 h-3 rounded-full ring-2 ring-white ${
                    online ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
            />
        )}
    </div>
);

export default Avatar;
