import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { Platform } from 'react-native';

export type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

export class HapticManager {
  private static isEnabled = true;

  static setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  static trigger(type: HapticType): void {
    if (!this.isEnabled) return;

    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    };

    switch (type) {
      case 'light':
        ReactNativeHapticFeedback.trigger('impactLight', options);
        break;
      case 'medium':
        ReactNativeHapticFeedback.trigger('impactMedium', options);
        break;
      case 'heavy':
        ReactNativeHapticFeedback.trigger('impactHeavy', options);
        break;
      case 'success':
        if (Platform.OS === 'ios') {
          ReactNativeHapticFeedback.trigger('notificationSuccess', options);
        } else {
          ReactNativeHapticFeedback.trigger('impactLight', options);
        }
        break;
      case 'warning':
        if (Platform.OS === 'ios') {
          ReactNativeHapticFeedback.trigger('notificationWarning', options);
        } else {
          ReactNativeHapticFeedback.trigger('impactMedium', options);
        }
        break;
      case 'error':
        if (Platform.OS === 'ios') {
          ReactNativeHapticFeedback.trigger('notificationError', options);
        } else {
          ReactNativeHapticFeedback.trigger('impactHeavy', options);
        }
        break;
    }
  }

  static selection(): void {
    if (!this.isEnabled) return;
    
    ReactNativeHapticFeedback.trigger('selection', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
  }
}

// Convenience functions
export const hapticLight = () => HapticManager.trigger('light');
export const hapticMedium = () => HapticManager.trigger('medium');
export const hapticHeavy = () => HapticManager.trigger('heavy');
export const hapticSuccess = () => HapticManager.trigger('success');
export const hapticWarning = () => HapticManager.trigger('warning');
export const hapticError = () => HapticManager.trigger('error');
export const hapticSelection = () => HapticManager.selection();