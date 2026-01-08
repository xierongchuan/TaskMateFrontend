/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // MD3 Primary Colors
        primary: {
          DEFAULT: 'var(--md-sys-color-primary)',
          container: 'var(--md-sys-color-primary-container)',
        },
        'on-primary': {
          DEFAULT: 'var(--md-sys-color-on-primary)',
          container: 'var(--md-sys-color-on-primary-container)',
        },

        // MD3 Secondary Colors
        secondary: {
          DEFAULT: 'var(--md-sys-color-secondary)',
          container: 'var(--md-sys-color-secondary-container)',
        },
        'on-secondary': {
          DEFAULT: 'var(--md-sys-color-on-secondary)',
          container: 'var(--md-sys-color-on-secondary-container)',
        },

        // MD3 Tertiary Colors
        tertiary: {
          DEFAULT: 'var(--md-sys-color-tertiary)',
          container: 'var(--md-sys-color-tertiary-container)',
        },
        'on-tertiary': {
          DEFAULT: 'var(--md-sys-color-on-tertiary)',
          container: 'var(--md-sys-color-on-tertiary-container)',
        },

        // MD3 Error Colors
        error: {
          DEFAULT: 'var(--md-sys-color-error)',
          container: 'var(--md-sys-color-error-container)',
        },
        'on-error': {
          DEFAULT: 'var(--md-sys-color-on-error)',
          container: 'var(--md-sys-color-on-error-container)',
        },

        // MD3 Success Colors (custom extension)
        success: {
          DEFAULT: 'var(--md-sys-color-success)',
          container: 'var(--md-sys-color-success-container)',
        },
        'on-success': {
          DEFAULT: 'var(--md-sys-color-on-success)',
          container: 'var(--md-sys-color-on-success-container)',
        },

        // MD3 Warning Colors (custom extension)
        warning: {
          DEFAULT: 'var(--md-sys-color-warning)',
          container: 'var(--md-sys-color-warning-container)',
        },
        'on-warning': {
          DEFAULT: 'var(--md-sys-color-on-warning)',
          container: 'var(--md-sys-color-on-warning-container)',
        },

        // MD3 Surface Colors
        background: 'var(--md-sys-color-background)',
        'on-background': 'var(--md-sys-color-on-background)',
        surface: {
          DEFAULT: 'var(--md-sys-color-surface)',
          variant: 'var(--md-sys-color-surface-variant)',
          'container-lowest': 'var(--md-sys-color-surface-container-lowest)',
          'container-low': 'var(--md-sys-color-surface-container-low)',
          container: 'var(--md-sys-color-surface-container)',
          'container-high': 'var(--md-sys-color-surface-container-high)',
          'container-highest': 'var(--md-sys-color-surface-container-highest)',
        },
        'on-surface': {
          DEFAULT: 'var(--md-sys-color-on-surface)',
          variant: 'var(--md-sys-color-on-surface-variant)',
        },

        // MD3 Outline Colors
        outline: {
          DEFAULT: 'var(--md-sys-color-outline)',
          variant: 'var(--md-sys-color-outline-variant)',
        },

        // MD3 Inverse Colors
        'inverse-surface': 'var(--md-sys-color-inverse-surface)',
        'inverse-on-surface': 'var(--md-sys-color-inverse-on-surface)',
        'inverse-primary': 'var(--md-sys-color-inverse-primary)',

        // Scrim
        scrim: 'var(--md-sys-color-scrim)',
      },
      fontFamily: {
        sans: ['Roboto', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
      },
      boxShadow: {
        'elevation-0': 'var(--md-sys-elevation-level0)',
        'elevation-1': 'var(--md-sys-elevation-level1)',
        'elevation-2': 'var(--md-sys-elevation-level2)',
        'elevation-3': 'var(--md-sys-elevation-level3)',
        'elevation-4': 'var(--md-sys-elevation-level4)',
        'elevation-5': 'var(--md-sys-elevation-level5)',
      },
      borderRadius: {
        'none': 'var(--md-sys-shape-corner-none)',
        'xs': 'var(--md-sys-shape-corner-extra-small)',
        'sm': 'var(--md-sys-shape-corner-small)',
        'md': 'var(--md-sys-shape-corner-medium)',
        'lg': 'var(--md-sys-shape-corner-large)',
        'xl': 'var(--md-sys-shape-corner-extra-large)',
        'full': 'var(--md-sys-shape-corner-full)',
      },
      transitionDuration: {
        'short1': 'var(--md-sys-motion-duration-short1)',
        'short2': 'var(--md-sys-motion-duration-short2)',
        'short3': 'var(--md-sys-motion-duration-short3)',
        'short4': 'var(--md-sys-motion-duration-short4)',
        'medium1': 'var(--md-sys-motion-duration-medium1)',
        'medium2': 'var(--md-sys-motion-duration-medium2)',
        'medium3': 'var(--md-sys-motion-duration-medium3)',
        'medium4': 'var(--md-sys-motion-duration-medium4)',
        'long1': 'var(--md-sys-motion-duration-long1)',
        'long2': 'var(--md-sys-motion-duration-long2)',
        'long3': 'var(--md-sys-motion-duration-long3)',
        'long4': 'var(--md-sys-motion-duration-long4)',
      },
      transitionTimingFunction: {
        'emphasized': 'var(--md-sys-motion-easing-emphasized)',
        'emphasized-decelerate': 'var(--md-sys-motion-easing-emphasized-decelerate)',
        'emphasized-accelerate': 'var(--md-sys-motion-easing-emphasized-accelerate)',
        'standard': 'var(--md-sys-motion-easing-standard)',
        'standard-decelerate': 'var(--md-sys-motion-easing-standard-decelerate)',
        'standard-accelerate': 'var(--md-sys-motion-easing-standard-accelerate)',
      },
      animation: {
        'md3-fade-in': 'md3-fade-in 300ms cubic-bezier(0.05, 0.7, 0.1, 1)',
        'md3-fade-out': 'md3-fade-out 200ms cubic-bezier(0.3, 0, 0.8, 0.15)',
        'md3-slide-up': 'md3-slide-up 300ms cubic-bezier(0.05, 0.7, 0.1, 1)',
        'md3-slide-down': 'md3-slide-down 300ms cubic-bezier(0.05, 0.7, 0.1, 1)',
        'md3-scale-in': 'md3-scale-in 250ms cubic-bezier(0.05, 0.7, 0.1, 1)',
        'md3-ripple': 'md3-ripple 400ms cubic-bezier(0.2, 0, 0, 1)',
      },
      keyframes: {
        'md3-fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'md3-fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        'md3-slide-up': {
          from: { transform: 'translateY(16px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'md3-slide-down': {
          from: { transform: 'translateY(-16px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'md3-scale-in': {
          from: { transform: 'scale(0.9)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        'md3-ripple': {
          from: { transform: 'scale(0)', opacity: '0.24' },
          to: { transform: 'scale(4)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
