export const APP_CONFIG = {
  APP_NAME: 'One O One Fitness',
  VERSION: '1.0.0',
  BUILD_NUMBER: 1,
  
  // API Configuration
  API_TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  
  // Cache Configuration
  CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours
  
  // Workout Configuration
  DEFAULT_REST_TIME: 60, // seconds
  MAX_WORKOUT_DURATION: 180, // minutes
  
  // Progress Tracking
  STREAK_RESET_HOURS: 6, // Reset streak at 6 AM
  
  // Image Configuration
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  IMAGE_QUALITY: 0.8,
  
  // Biometric Authentication
  BIOMETRIC_PROMPT_TITLE: 'Authenticate',
  BIOMETRIC_PROMPT_SUBTITLE: 'Use your biometric to access your fitness data',
  
  // Error Messages
  ERRORS: {
    NETWORK: 'Network connection error. Please check your internet connection.',
    UNAUTHORIZED: 'Session expired. Please log in again.',
    SERVER: 'Server error. Please try again later.',
    VALIDATION: 'Please check your input and try again.',
    CAMERA: 'Camera access denied. Please enable camera permissions.',
    STORAGE: 'Storage access denied. Please enable storage permissions.',
  },
  
  // Success Messages
  SUCCESS: {
    WORKOUT_COMPLETED: 'Workout completed successfully!',
    PROFILE_UPDATED: 'Profile updated successfully!',
    PHOTO_SAVED: 'Photo saved successfully!',
    GOAL_ACHIEVED: 'Congratulations! Goal achieved!',
  },
} as const;

export const THEME_COLORS = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  secondary: '#16A34A',
  accent: '#F59E0B',
  error: '#DC2626',
  warning: '#EA580C',
  success: '#16A34A',
  info: '#0EA5E9',
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F8FAFC',
  gray100: '#F1F5F9',
  gray200: '#E2E8F0',
  gray300: '#CBD5E1',
  gray400: '#94A3B8',
  gray500: '#64748B',
  gray600: '#475569',
  gray700: '#334155',
  gray800: '#1E293B',
  gray900: '#0F172A',
  
  // Gradient colors
  gradientStart: '#2563EB',
  gradientEnd: '#1D4ED8',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
} as const;