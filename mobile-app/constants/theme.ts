export const Theme = {
  colors: {
    primary: '#f97316', // Orange
    primaryLight: 'rgba(249, 115, 22, 0.15)', // Orange light
    secondary: '#1a1a1a', // Dark surface
    accent: '#ea6c0a', // Orange dark
    text: '#ffffff', // Pure White
    textLight: '#999999', // Gray 400
    background: '#0f0f0f', // Black background
    surface: '#1a1a1a', // Dark surface
    border: '#2a2a2a', // Dark border
    white: '#ffffff',
    error: '#FF4B4B',
    success: '#10B981',
    glass: 'rgba(26, 26, 26, 0.75)',
    overlay: 'rgba(0, 0, 0, 0.6)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  borderRadius: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 24,
    xl: 32,
    full: 999,
  },
  shadows: {
    soft: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 4,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 20,
      elevation: 8,
    },
    premium: {
      shadowColor: '#f97316',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 24,
      elevation: 12,
    }
  }
};

