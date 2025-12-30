import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: number | string;
    subtitle: string;
    color: 'orange' | 'blue' | 'red' | 'slate';
    icon: LucideIcon; // Added this to match your dashboard usage
}

const StatCard = ({ title, value, subtitle, color, icon: Icon }: StatCardProps) => {
    const textColor = {
        orange: "text-orange-500",
        blue: "text-blue-600",
        red: "text-red-600",
        slate: "text-[#1B2537]"
    }[color];

    const bgColor = {
        orange: "bg-orange-50",
        blue: "bg-blue-50",
        red: "bg-red-50",
        slate: "bg-slate-50"
    }[color];

    return (
        <div className="bg-white p-6 rounded-[2rem] border border-black/5 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
                <div className={`p-2 rounded-xl ${bgColor} ${textColor}`}>
                    <Icon size={16} />
                </div>
            </div>
            <div className="flex flex-col">
                <span className={`text-4xl font-black italic tracking-tighter ${textColor}`}>
                    {value}
                </span>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase italic">{subtitle}</p>
            </div>
        </div>
    );
};

export default StatCard; // Changed to default export