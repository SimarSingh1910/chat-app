import React from 'react';
import { Zap, ShieldCheck, MessageSquareText } from 'lucide-react';

const features = [
    { icon: Zap, label: 'Real-time messaging' },
    { icon: ShieldCheck, label: 'Private & ephemeral' },
    { icon: MessageSquareText, label: 'Clean, focused chats' },
];

const TextContent = () => (
    <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-20 text-center sm:py-28">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                Messages that disappear in 24 hours
            </span>

            <h1 className="max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Talk freely, connect <span className="text-cyan-600">instantly</span>.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
                Real-time messaging with a clean, distraction-free design. Say hello,
                share a thought, and move on — your world, one chat away.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                {features.map((feature) => {
                    const Icon = feature.icon;
                    return (
                        <span
                            key={feature.label}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600"
                        >
                            <Icon size={15} className="text-cyan-600" />
                            {feature.label}
                        </span>
                    );
                })}
            </div>

            <a
                href="#auth"
                className="mt-10 inline-flex items-center rounded-lg bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-700"
            >
                Get started
            </a>
        </div>
    </section>
);

export default TextContent;
