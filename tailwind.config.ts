import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class', // <-- ADD THIS LINE
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}', // Optional: scan context files too
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
export default config