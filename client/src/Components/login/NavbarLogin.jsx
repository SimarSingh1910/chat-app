import React, { useState } from 'react';
import { MessagesSquare } from 'lucide-react';

const links = ['Features', 'Privacy', 'Desktop App', 'Developers', 'Help'];

const NavbarLogin = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
                {/* Wordmark */}
                <a className="flex items-center gap-2 select-none">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-600 text-white">
                        <MessagesSquare size={18} />
                    </span>
                    <span className="text-lg font-bold tracking-tight text-slate-900">ChatApp</span>
                </a>

                {/* Desktop links */}
                <ul className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
                    {links.map((l) => (
                        <li key={l} className="cursor-pointer transition-colors hover:text-slate-900">
                            {l}
                        </li>
                    ))}
                </ul>

                {/* Mobile toggle */}
                <button
                    className="lg:hidden flex flex-col justify-center items-center w-6 h-6"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className={`block h-0.5 w-6 bg-slate-700 transition-all duration-300 ${isMenuOpen ? 'translate-y-1.5 rotate-45' : ''}`} />
                    <span className={`mt-1.5 block h-0.5 w-6 bg-slate-700 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
                    <span className={`mt-1.5 block h-0.5 w-6 bg-slate-700 transition-all duration-300 ${isMenuOpen ? '-translate-y-1.5 -rotate-45' : ''}`} />
                </button>
            </div>

            {/* Mobile menu */}
            <div className={`lg:hidden overflow-hidden border-t border-slate-100 bg-white transition-all duration-300 ${isMenuOpen ? 'max-h-80' : 'max-h-0'}`}>
                <ul className="flex flex-col py-2 text-sm font-medium text-slate-700">
                    {links.map((l) => (
                        <li key={l} className="cursor-pointer px-6 py-3 transition-colors hover:bg-slate-50 hover:text-cyan-600">
                            {l}
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default NavbarLogin;
