import { Alert } from 'react-native';
import { APP_CONFIG } from '@/config/constants';

export interface AppError {
  code: string;
  message: string;
  details?: any;
}

export class ErrorHandler {
  static handle(error: any, showAlert = true): AppError {
    let appError: AppError;

    if (error?.code) {
      // Supabase or custom error
      appError = {
        code: error.code,
        message: error.message || 'An error occurred',
        details: error.details,
      };
    } else if (error?.response) {
      // Network error
      appError = {
        code: 'NETWORK_ERROR',
        message: APP_CONFIG.ERRORS.NETWORK,
        details: error.response,
      };
    } else if (error instanceof Error) {
      // JavaScript error
      appError = {
        code: 'UNKNOWN_ERROR',
        message: error.message,
        details: error.stack,
      };
    } else {
      // Unknown error
      appError = {
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred',
        details: error,
      };
    }

    // Log error for debugging
    console.error('App Error:', appError);

    // Show alert if requested
    if (showAlert) {
      Alert.alert('Error', appError.message);
    }

    return appError;
  }

  static handleAuthError(error: any): AppError {
    const authErrors: Record<string, string> = {
      'invalid_credentials': 'Invalid email or password',
      'email_not_confirmed': 'Please verify your email address',
      'weak_password': 'Password is too weak',
      'email_already_exists': 'An account with this email already exists',
      'signup_disabled': 'Sign up is currently disabled',
      'invalid_email': 'Please enter a valid email address',
    };

    const message = authErrors[error?.code] || error?.message || 'Authentication failed';
    
    return {
      code: error?.code || 'AUTH_ERROR',
      message,
      details: error,
    };
  }

  static handleNetworkError(error: any): AppError {
    if (!error?.response) {
      return {
        code: 'NETWORK_ERROR',
        message: APP_CONFIG.ERRORS.NETWORK,
        details: error,
      };
    }

    const status = error.response.status;
    let message = APP_CONFIG.ERRORS.SERVER;

    switch (status) {
      case 401:
        message = APP_CONFIG.ERRORS.UNAUTHORIZED;
        break;
      case 403:
        message = 'Access denied';
        break;
      case 404:
        message = 'Resource not found';
        break;
      case 422:
        message = APP_CONFIG.ERRORS.VALIDATION;
        break;
      case 500:
        message = APP_CONFIG.ERRORS.SERVER;
        break;
    }

    return {
      code: `HTTP_${status}`,
      message,
      details: error.response,
    };
  }
}

export const handleError = ErrorHandler.handle;
export const handleAuthError = ErrorHandler.handleAuthError;
export const handleNetworkError = ErrorHandler.handleNetworkError;