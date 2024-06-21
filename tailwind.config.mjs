/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: "class",
	theme: {
		screens: {
			xs: "280px",
			sm: "480px",
			md: "768px",
			lg: "976px",
			xl: "1440px",
			"2xl": "1536px",
		},
		extend: {
			fontFamily: 'sans-serif',
			colors: {
				rgbaBGLight: "rgba(0,0,0,0.08)",
				rgbaBGDark: "rgba(255,255,255,0.1)"
			}
		}
	},
	plugins: [],
}
