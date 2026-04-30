import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          50: '#f0f0f5',
          900: '#0a0a0f',
          950: '#050508',
        },
        violet: {
          brand: '#6B4FFF',
        },
      },
    },
  },
  plugins: [],
};

export default config;
