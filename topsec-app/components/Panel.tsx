import { ReactNode } from "react";

export default function Panel({
    title,
    actions,
    children,
}: {
    title: string;
    actions?: ReactNode;
    children: ReactNode;
}) {
    return (
        <section className="bg-white dark:bg-[#0F172A] rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
                <h2 className="text-lg font-semibold">{title}</h2>
                {actions}
            </div>
            {children}
        </section>
    );
}
