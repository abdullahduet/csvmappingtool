/**
 * Theme configuration for consistent styling across the application
 */

export const theme = {
    // Company/Brand Information
    brand: {
      name: 'ReactRedux Pro',
      tagline: 'Streamlined Solutions for Complex Challenges',
      logo: {
        light: '/assets/images/logo.png',
        dark: '/assets/images/logo-dark.svg',
      },
      mission: 'To empower businesses with intelligent, scalable solutions that streamline operations and enhance productivity.',
    },
    
    // Colors (mirroring Tailwind config)
    colors: {
      primary: '#2c5282',
      secondary: '#4299e1',
      accent: '#ebf8ff',
      text: '#2d3748',
      border: '#cbd5e0',
      success: '#48bb78',
      error: '#f56565',
      background: '#f8fafc',
    },
    
    // Typography
    typography: {
      fontFamily: {
        sans: 'Inter, "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        heading: 'Inter, "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        mono: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      },
      fontSize: {
        xs: '0.75rem',     // 12px
        sm: '0.875rem',    // 14px
        base: '1rem',      // 16px
        lg: '1.125rem',    // 18px
        xl: '1.25rem',     // 20px
        '2xl': '1.5rem',   // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem',  // 36px
        '5xl': '3rem',     // 48px
        '6xl': '3.75rem',  // 60px
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      lineHeight: {
        none: 1,
        tight: 1.25,
        snug: 1.375,
        normal: 1.5,
        relaxed: 1.625,
        loose: 2,
      },
    },
    
    // Spacing (consistent across app)
    spacing: {
      0: '0',
      1: '0.25rem',  // 4px
      2: '0.5rem',   // 8px
      3: '0.75rem',  // 12px
      4: '1rem',     // 16px
      5: '1.25rem',  // 20px
      6: '1.5rem',   // 24px
      8: '2rem',     // 32px
      10: '2.5rem',  // 40px
      12: '3rem',    // 48px
      16: '4rem',    // 64px
      20: '5rem',    // 80px
      24: '6rem',    // 96px
      32: '8rem',    // 128px
    },
    
    // Border radius
    borderRadius: {
      none: '0',
      sm: '0.125rem',  // 2px
      DEFAULT: '0.25rem', // 4px
      md: '0.375rem',  // 6px
      lg: '0.5rem',    // 8px
      xl: '0.75rem',   // 12px
      '2xl': '1rem',   // 16px
      '3xl': '1.5rem', // 24px
      full: '9999px',
    },
    
    // Shadows
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      none: 'none',
    },
    
    // Animation
    animation: {
      transitionProperty: {
        DEFAULT: 'background-color, border-color, color, fill, stroke, opacity, box-shadow, transform',
        colors: 'background-color, border-color, color, fill, stroke',
        opacity: 'opacity',
        shadow: 'box-shadow',
        transform: 'transform',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
        linear: 'linear',
        in: 'cubic-bezier(0.4, 0, 1, 1)',
        out: 'cubic-bezier(0, 0, 0.2, 1)',
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        DEFAULT: '150ms',
        75: '75ms',
        100: '100ms',
        150: '150ms',
        200: '200ms',
        300: '300ms',
        500: '500ms',
        700: '700ms',
        1000: '1000ms',
      },
    },
    
    // Media queries (responsive design)
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    
    // Email template defaults
    email: {
      fontFamily: 'Arial, sans-serif',
      colors: {
        background: '#ffffff',
        text: '#2d3748',
        heading: '#2c5282',
        link: '#4299e1',
        footer: '#f8fafc',
        footerText: '#718096',
      },
      spacing: {
        body: '30px',
        container: '600px',
      },
      signature: {
        text: 'Streamlined Solutions for Complex Challenges',
        logo: 'https://your-domain.com/assets/images/logo.png',
        socialLinks: {
          twitter: 'https://twitter.com/your-twitter',
          linkedin: 'https://linkedin.com/company/your-company',
          github: 'https://github.com/your-github',
        },
      },
    },
    
    // PDF document defaults
    pdf: {
      fontFamily: 'Inter, sans-serif',
      colors: {
        primary: '#2c5282',
        text: '#2d3748',
        heading: '#1a202c',
        accent: '#4299e1',
      },
      margins: {
        top: '1in',
        right: '0.75in',
        bottom: '1in',
        left: '0.75in',
      },
      header: {
        logo: '/assets/images/logo.png',
        tagline: 'Streamlined Solutions for Complex Challenges',
      },
      footer: {
        text: '© ReactRedux Pro. All rights reserved.',
        pageNumbers: true,
      },
    },
  };
  
  export default theme;