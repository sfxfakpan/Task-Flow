/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [

        "./frontend/src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#0da6f2",
                "background-light": "#f5f7f8",
                "background-dark": "#101c22",
            },
            fontFamily: {
                display: ["Inter", "sans-serif"],
                body: ["Inter", "sans-serif"]
            },
        },
    },
    plugins: [],
};