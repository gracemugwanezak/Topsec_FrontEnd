/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./Sidebar.tsx",
    ],
    theme: {
        extend: {
            colors: {
                topsec: "#0B1E3D",
                offwhite: "#F9F8F3",
                dashboard: "#E9EBEF",
            },
        },
    },
    plugins: [],
};