import { Platform, Alert, Linking } from 'react-native';
import { request, check, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';

export type PermissionType = 'camera' | 'photos' | 'location' | 'notifications';

export class PermissionManager {
  static async requestCameraPermission(): Promise<boolean> {
    try {
      const permission = Platform.OS === 'ios' 
        ? PERMISSIONS.IOS.CAMERA 
        : PERMISSIONS.ANDROID.CAMERA;

      const result = await request(permission);
      return result === RESULTS.GRANTED;
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      return false;
    }
  }

  static async requestPhotoLibraryPermission(): Promise<boolean> {
    try {
      const permission = Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

      const result = await request(permission);
      return result === RESULTS.GRANTED;
    } catch (error) {
      console.error('Error requesting photo library permission:', error);
      return false;
    }
  }

  static async requestLocationPermission(): Promise<boolean> {
    try {
      const permission = Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

      const result = await request(permission);
      return result === RESULTS.GRANTED;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }

  static async checkCameraPermission(): Promise<boolean> {
    try {
      const permission = Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;

      const result = await check(permission);
      return result === RESULTS.GRANTED;
    } catch (error) {
      console.error('Error checking camera permission:', error);
      return false;
    }
  }

  static async checkPhotoLibraryPermission(): Promise<boolean> {
    try {
      const permission = Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

      const result = await check(permission);
      return result === RESULTS.GRANTED;
    } catch (error) {
      console.error('Error checking photo library permission:', error);
      return false;
    }
  }

  static async requestPermissionWithAlert(
    type: PermissionType,
    title: string,
    message: string
  ): Promise<boolean> {
    let hasPermission = false;

    switch (type) {
      case 'camera':
        hasPermission = await this.checkCameraPermission();
        if (!hasPermission) {
          hasPermission = await this.requestCameraPermission();
        }
        break;
      case 'photos':
        hasPermission = await this.checkPhotoLibraryPermission();
        if (!hasPermission) {
          hasPermission = await this.requestPhotoLibraryPermission();
        }
        break;
      case 'location':
        hasPermission = await this.requestLocationPermission();
        break;
    }

    if (!hasPermission) {
      Alert.alert(
        title,
        message,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Settings',
            onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:');
              } else {
                openSettings();
              }
            },
          },
        ]
      );
    }

    return hasPermission;
  }

  static async requestCameraWithAlert(): Promise<boolean> {
    return this.requestPermissionWithAlert(
      'camera',
      'Camera Permission Required',
      'This app needs camera access to take progress photos. Please enable camera permission in settings.'
    );
  }

  static async requestPhotosWithAlert(): Promise<boolean> {
    return this.requestPermissionWithAlert(
      'photos',
      'Photo Library Permission Required',
      'This app needs photo library access to save and select photos. Please enable photo library permission in settings.'
    );
  }

  static async requestLocationWithAlert(): Promise<boolean> {
    return this.requestPermissionWithAlert(
      'location',
      'Location Permission Required',
      'This app needs location access to track outdoor workouts. Please enable location permission in settings.'
    );
  }
}

export const requestCameraPermission = PermissionManager.requestCameraWithAlert;
export const requestPhotosPermission = PermissionManager.requestPhotosWithAlert;
export const requestLocationPermission = PermissionManager.requestLocationWithAlert;
export const checkCameraPermission = PermissionManager.checkCameraPermission;
export const checkPhotosPermission = PermissionManager.checkPhotoLibraryPermission;