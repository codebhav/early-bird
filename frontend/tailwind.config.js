// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				// Define a custom color scheme based on the duck theme
				duck: {
					yellow: "#FFD43B",
					orange: "#FF9800",
					green: "#4CAF50",
					blue: "#2196F3",
				},
			},
			fontFamily: {
				sans: ["var(--font-geist-sans)"],
				mono: ["var(--font-geist-mono)"],
			},
			animation: {
				wobble: "wobble 1s ease-in-out infinite",
				"bounce-slow": "bounce 2s infinite",
			},
			keyframes: {
				wobble: {
					"0%, 100%": { transform: "rotate(-3deg)" },
					"50%": { transform: "rotate(3deg)" },
				},
			},
		},
	},
	plugins: [
		// Add the forms plugin for better styling of form elements
		require("@tailwindcss/forms")({
			strategy: "class",
		}),
	],
};
