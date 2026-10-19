/** @type {import('tailwindcss').Config} */
export default {
    // Scan the sources (not the built HTML) for class names
    content: ['./build.js', './src/**/*.{js,html}'],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Space Grotesk', 'sans-serif'],
            },
            colors: {
                'primary-text': 'rgb(var(--color-primary-text) / <alpha-value>)',
                'muted-text': 'rgb(var(--color-muted-text) / <alpha-value>)',
                'page-bg': 'rgb(var(--color-page-bg) / <alpha-value>)',
                'border-light': 'rgb(var(--color-border-light) / <alpha-value>)',
                'overlay-bg': 'rgb(var(--color-overlay-bg) / <alpha-value>)',
                'nav-link-color': 'rgb(var(--color-nav-link) / <alpha-value>)',
            },
        },
    },
};
