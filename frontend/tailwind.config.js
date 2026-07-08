/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                "primary": "#17b0cf",
                "off-white": "#f8f8f7",
                "soft-charcoal": "#2c2c2c",
                "brand-teal": "#17b0cf",
                "glass-white": "rgba(255, 255, 255, 0.4)",
            },
            fontFamily: {
                "display": ["Plus Jakarta Sans", "sans-serif"],
                "serif": ["Cormorant Garamond", "serif"]
            },
        },
    },
    plugins: [],
}