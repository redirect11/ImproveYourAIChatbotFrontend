
const flowbite = require("flowbite-react/tailwind");
const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
    mode: 'jit',
    content: ['./src/**/*.{js,jsx}',  flowbite.content()],
    theme: {
        fontSize: {
            xs: '0.70rem',
            sm: '0.8rem',
            base: '1rem',
            xl: '1.25rem',
            '2xl': '1.563rem',
            '3xl': '1.953rem',
            '4xl': '2.441rem',
            '5xl': '3.052rem',
        },
        extend: {
            colors: {
                primary: '#1B73E8',
            },
        },
    },
    plugins: [
        flowbite.plugin(),
        require('daisyui'),
        // plugin(function({ addUtilities, addComponents, e, config }) {
        //     const newUtilities = {
        //         '.text-shadow': {
        //             textShadow: '0 2px 5px rgba(0, 0, 0, 0.5)',
        //         },
        //     }
        //     addUtilities(newUtilities, ['responsive', 'hover'])
        // }),
    ],
    daisyui: {
        themes: [
            {
                mytheme: {
                    "primary": "#0006ff", 
                    "primary-content": "#c6dbff", 
                    "secondary": "#008500",
                    "secondary-content": "#d3e7d1",
                    "accent": "#0081ff",
                    "accent-content": "#000616",
                    "neutral": "#302416",
                    "neutral-content": "#d2cecb",       
                    "base-100": "#1e2830",
                    "base-200": "#192128",
                    "base-300": "#131b21",
                    "base-content": "#cdcfd1",
                    "info": "#006cdc",
                    "info-content": "#d1e3fb",
                    "success": "#00ae31",
                    "success-content": "#000b01",
                    "warning": "#d79600",
                    "warning-content": "#110800",
                    "error": "#ff6f7d",
                    "error-content": "#160002"
                }
            }, 
            "light", "dark", "cupcake"
        ],
    },
    
};