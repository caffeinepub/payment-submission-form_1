import typography from '@tailwindcss/typography';
import containerQueries from '@tailwindcss/container-queries';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['index.html', 'src/**/*.{js,ts,jsx,tsx,html,css}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: 'oklch(var(--border))',
        input: 'oklch(var(--input))',
        ring: 'oklch(var(--ring) / <alpha-value>)',
        background: 'oklch(var(--background))',
        foreground: 'oklch(var(--foreground))',
        primary: {
          DEFAULT: 'oklch(var(--primary) / <alpha-value>)',
          foreground: 'oklch(var(--primary-foreground))',
          light: 'oklch(0.92 0.06 162)',
          dark: 'oklch(0.42 0.16 162)',
        },
        secondary: {
          DEFAULT: 'oklch(var(--secondary) / <alpha-value>)',
          foreground: 'oklch(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'oklch(var(--destructive) / <alpha-value>)',
          foreground: 'oklch(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'oklch(var(--muted) / <alpha-value>)',
          foreground: 'oklch(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'oklch(var(--accent) / <alpha-value>)',
          foreground: 'oklch(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'oklch(var(--popover))',
          foreground: 'oklch(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'oklch(var(--card))',
          foreground: 'oklch(var(--card-foreground))',
        },
        chart: {
          1: 'oklch(var(--chart-1))',
          2: 'oklch(var(--chart-2))',
          3: 'oklch(var(--chart-3))',
          4: 'oklch(var(--chart-4))',
          5: 'oklch(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'oklch(var(--sidebar))',
          foreground: 'oklch(var(--sidebar-foreground))',
          primary: 'oklch(var(--sidebar-primary))',
          'primary-foreground': 'oklch(var(--sidebar-primary-foreground))',
          accent: 'oklch(var(--sidebar-accent))',
          'accent-foreground': 'oklch(var(--sidebar-accent-foreground))',
          border: 'oklch(var(--sidebar-border))',
          ring: 'oklch(var(--sidebar-ring))',
        },
        emerald: {
          50: 'oklch(0.97 0.04 162)',
          100: 'oklch(0.93 0.07 162)',
          200: 'oklch(0.87 0.10 162)',
          300: 'oklch(0.78 0.13 162)',
          400: 'oklch(0.68 0.15 162)',
          500: 'oklch(0.58 0.16 162)',
          600: 'oklch(0.50 0.16 162)',
          700: 'oklch(0.42 0.15 162)',
          800: 'oklch(0.35 0.12 162)',
          900: 'oklch(0.28 0.09 162)',
        },
        sky: {
          50: 'oklch(0.97 0.03 220)',
          100: 'oklch(0.93 0.06 220)',
          200: 'oklch(0.87 0.09 220)',
          300: 'oklch(0.78 0.12 220)',
          400: 'oklch(0.68 0.14 220)',
          500: 'oklch(0.58 0.16 220)',
          600: 'oklch(0.50 0.16 220)',
          700: 'oklch(0.42 0.14 220)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: 'calc(var(--radius) + 4px)',
        '2xl': 'calc(var(--radius) + 8px)',
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(0,0,0,0.05)',
        card: '0 4px 6px -1px rgba(0,0,0,0.05), 0 10px 40px -10px rgba(0,0,0,0.08)',
        'green-glow': '0 0 30px oklch(0.55 0.15 162 / 0.2), 0 4px 20px oklch(0.55 0.15 162 / 0.1)',
        'blue-glow': '0 0 30px oklch(0.58 0.16 220 / 0.2), 0 4px 20px oklch(0.58 0.16 220 / 0.1)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'card-float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(-2deg)' },
          '50%': { transform: 'translateY(-8px) rotate(-2deg)' },
        },
        'pos-float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(2deg)' },
          '50%': { transform: 'translateY(-6px) rotate(2deg)' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'card-float': 'card-float 4s ease-in-out infinite',
        'pos-float': 'pos-float 4.5s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [typography, containerQueries, animate],
};
