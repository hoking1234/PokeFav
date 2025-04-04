import type { Config } from 'tailwindcss'

const config: Config = {
  theme: {
    extend: {
      colors: {
        heart: '#EF4444',
        'button-primary': '#FBBF24',
        'button-primary-hover': '#d97706',
        background: '#FDE68A',
        'card-bg': '#FFFFFF',
        'heart-empty': '#F1F5F9',
        text: '#0F172A',
        'text-secondary': '#94A3B8'
      },
      fontFamily: {
        sans: ['Lato', 'sans-serif'],
        title: ['Lato', 'sans-serif']
      },
      fontSize: {
        base: '20pt',
        title: '48pt',
        'xl-title': '62pt'
      }
    }
  }
}

export default config
