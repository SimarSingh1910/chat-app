import React from "react";
import { ChevronDown } from "lucide-react";

const STATUSES = [
    { value: "active", label: "Active", dot: "bg-emerald-500" },
    { value: "dnd", label: "Do Not Disturb", dot: "bg-red-500" },
    { value: "away", label: "Away", dot: "bg-amber-500" },
    { value: "invisible", label: "Invisible", dot: "bg-slate-400" },
];

const ProfileSettings = ({ value, setValue }) => {
    const current = STATUSES.find((s) => s.value === value) || STATUSES[0];

    return (
        <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Online status</label>
            <div className="relative">
                <span
                    className={`pointer-events-none absolute left-3.5 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full ${current.dot}`}
                />
                <select
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-9 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                >
                    {STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
        </div>
    );
};

export default ProfileSettings;
