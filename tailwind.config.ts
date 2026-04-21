
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px'
      }
    },
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        
        primary: {
          DEFAULT: 'hsl(var(--primary))', // #2979FF
          foreground: 'hsl(var(--primary-foreground))',
          hover: 'hsl(var(--primary-hover))', // #1565C0
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        
        muted: {
          DEFAULT: 'hsl(var(--muted))', // #F5F5F5
          foreground: 'hsl(var(--muted-foreground))', // #757575
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))', // #D32F2F
          foreground: 'hsl(var(--destructive-foreground))',
        },
        
        // Design System Colors
        'accent-green': 'hsl(var(--accent-green))', // #00C853
        'accent-gold': 'hsl(var(--accent-gold))', // #FFD600
        'error': 'hsl(var(--error))', // #D32F2F
        
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        'hero': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }], // 48px
        'section': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.025em' }], // 32px
        'card-title': ['1.25rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }], // 20px
        'body': ['1rem', { lineHeight: '1.5' }], // 16px
        'caption': ['0.875rem', { lineHeight: '1.4' }], // 14px
      },

      borderRadius: {
        'xl': '0.75rem', // 12px - primary button radius
        '2xl': '1rem', // 16px - card radius
        '3xl': '1.5rem',
        DEFAULT: 'var(--radius)',
      },

      boxShadow: {
        'card': '0 2px 6px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'button': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'button-hover': '0 2px 8px rgba(0, 0, 0, 0.15)',
      },

      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        // Design system spacing
        'section': '3.75rem', // 60px
        'card': '1.5rem', // 24px
      },

      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'hover-lift': 'hoverLift 0.2s ease-out',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        hoverLift: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-2px)' }
        }
      },

      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1600px',
      },

      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
