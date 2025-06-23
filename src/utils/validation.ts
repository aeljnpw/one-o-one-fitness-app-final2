export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class Validator {
  static email(email: string): ValidationResult {
    const errors: string[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      errors.push('Email is required');
    } else if (!emailRegex.test(email)) {
      errors.push('Please enter a valid email address');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static password(password: string): ValidationResult {
    const errors: string[] = [];

    if (!password) {
      errors.push('Password is required');
    } else {
      if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
      }
      if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
      }
      if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
      }
      if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static name(name: string): ValidationResult {
    const errors: string[] = [];

    if (!name) {
      errors.push('Name is required');
    } else if (name.length < 2) {
      errors.push('Name must be at least 2 characters long');
    } else if (name.length > 50) {
      errors.push('Name must be less than 50 characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static height(height: string): ValidationResult {
    const errors: string[] = [];
    const heightNum = parseFloat(height);

    if (!height) {
      errors.push('Height is required');
    } else if (isNaN(heightNum)) {
      errors.push('Height must be a valid number');
    } else if (heightNum < 100 || heightNum > 250) {
      errors.push('Height must be between 100 and 250 cm');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static weight(weight: string): ValidationResult {
    const errors: string[] = [];
    const weightNum = parseFloat(weight);

    if (!weight) {
      errors.push('Weight is required');
    } else if (isNaN(weightNum)) {
      errors.push('Weight must be a valid number');
    } else if (weightNum < 30 || weightNum > 300) {
      errors.push('Weight must be between 30 and 300 kg');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static age(age: string): ValidationResult {
    const errors: string[] = [];
    const ageNum = parseInt(age, 10);

    if (!age) {
      errors.push('Age is required');
    } else if (isNaN(ageNum)) {
      errors.push('Age must be a valid number');
    } else if (ageNum < 13 || ageNum > 120) {
      errors.push('Age must be between 13 and 120 years');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static required(value: any, fieldName: string): ValidationResult {
    const errors: string[] = [];

    if (!value || (typeof value === 'string' && value.trim() === '')) {
      errors.push(`${fieldName} is required`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateForm(fields: Record<string, any>, rules: Record<string, (value: any) => ValidationResult>): ValidationResult {
    const allErrors: string[] = [];

    Object.entries(rules).forEach(([fieldName, validator]) => {
      const result = validator(fields[fieldName]);
      if (!result.isValid) {
        allErrors.push(...result.errors);
      }
    });

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
    };
  }
}

export const validateEmail = Validator.email;
export const validatePassword = Validator.password;
export const validateName = Validator.name;
export const validateHeight = Validator.height;
export const validateWeight = Validator.weight;
export const validateAge = Validator.age;
export const validateRequired = Validator.required;
export const validateForm = Validator.validateForm;