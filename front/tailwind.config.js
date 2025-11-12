/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-background',
    'text-foreground',
    'border-border',
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        ring: "var(--ring)",
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      
      addVariant('dark', '&:where(.dark, .dark *)');
    },
  ],
}
