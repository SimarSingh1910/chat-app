import React from 'react';

const LowerPart = () => (
    <section className="bg-slate-900">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-6 py-16 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Join the community
            </h2>
            <p className="mt-3 max-w-md text-sm text-slate-400 sm:text-base">
                Connect with like-minded people and start conversations that matter — no
                clutter, no noise.
            </p>
            <a
                href="#auth"
                className="mt-8 inline-flex items-center rounded-lg bg-cyan-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-400"
            >
                Sign up now
            </a>
        </div>
    </section>
);

export default LowerPart;
