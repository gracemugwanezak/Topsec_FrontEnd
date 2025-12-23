import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                topsec: "#0B1E3D",
                // A premium off-white beige color
                offwhite: "#F9F8F3",
            },
        },
    },
    plugins: [],
};
export default config;