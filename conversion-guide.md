# Converting One O One Fitness from Expo to React Native CLI

## Prerequisites

Before starting, ensure you have:
- Node.js 18+ installed
- React Native CLI installed globally: `npm install -g @react-native-community/cli`
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- Java Development Kit (JDK) 11 or newer

## Step 1: Create New React Native CLI Project

```bash
# Create new React Native project
npx react-native@latest init OneOOneFitness --template react-native-template-typescript

# Navigate to project directory
cd OneOOneFitness
```

## Step 2: Install Required Dependencies

```bash
# Core navigation
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
npm install react-native-screens react-native-safe-area-context

# For Android
cd android && ./gradlew clean && cd ..

# For iOS (macOS only)
cd ios && pod install && cd ..

# UI and functionality
npm install react-native-linear-gradient
npm install react-native-vector-icons
npm install @react-native-async-storage/async-storage
npm install react-native-keychain
npm install react-native-chart-kit
npm install react-native-svg

# Supabase
npm install @supabase/supabase-js
npm install react-native-url-polyfill

# Additional utilities
npm install react-native-image-picker
npm install react-native-permissions
npm install react-native-haptic-feedback

# Development dependencies
npm install --save-dev @types/react @types/react-native
```

## Step 3: Configure Native Dependencies

### Android Configuration

1. **Add to `android/app/build.gradle`:**
```gradle
dependencies {
    implementation project(':react-native-linear-gradient')
    implementation project(':react-native-vector-icons')
    implementation project(':react-native-svg')
}
```

2. **Add to `android/settings.gradle`:**
```gradle
include ':react-native-linear-gradient'
project(':react-native-linear-gradient').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-linear-gradient/android')

include ':react-native-vector-icons'
project(':react-native-vector-icons').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-vector-icons/android')

include ':react-native-svg'
project(':react-native-svg').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-svg/android')
```

3. **Update `MainApplication.java`:**
```java
import com.BV.LinearGradient.LinearGradientPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.horcrux.svg.SvgPackage;

@Override
protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
        new MainReactPackage(),
        new LinearGradientPackage(),
        new VectorIconsPackage(),
        new SvgPackage()
    );
}
```

### iOS Configuration (macOS only)

1. **Add to `ios/Podfile`:**
```ruby
pod 'RNVectorIcons', :path => '../node_modules/react-native-vector-icons'
pod 'BVLinearGradient', :path => '../node_modules/react-native-linear-gradient'
pod 'RNSVG', :path => '../node_modules/react-native-svg'
```

2. **Run pod install:**
```bash
cd ios && pod install && cd ..
```

## Step 4: Project Structure Setup

Create the following directory structure:
```
src/
├── components/
├── screens/
│   ├── auth/
│   ├── tabs/
│   └── onboarding/
├── navigation/
├── contexts/
├── lib/
├── types/
├── hooks/
└── utils/
```

## Step 5: Environment Configuration

1. **Create `.env` file:**
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. **Install react-native-config:**
```bash
npm install react-native-config
```

3. **Configure for Android (`android/app/build.gradle`):**
```gradle
apply from: project(':react-native-config').projectDir.getPath() + "/dotenv.gradle"
```

## Step 6: Navigation Setup

Create `src/navigation/AppNavigator.tsx`:
```typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider } from '../contexts/AuthContext';

// Import your screens
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import WorkoutsScreen from '../screens/tabs/WorkoutsScreen';
import EquipmentScreen from '../screens/tabs/EquipmentScreen';
import ProgressScreen from '../screens/tabs/ProgressScreen';
import ProfileScreen from '../screens/tabs/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Workouts" component={WorkoutsScreen} />
      <Tab.Screen name="Equipment" component={EquipmentScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Auth" component={AuthStack} />
          <Stack.Screen name="Main" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
```

## Step 7: Update App.tsx

```typescript
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import 'react-native-url-polyfill/auto';

export default function App() {
  return <AppNavigator />;
}
```

## Step 8: Migrate Expo-specific Code

### Replace Expo modules:

1. **expo-linear-gradient** → **react-native-linear-gradient**
2. **expo-font** → Use system fonts or react-native-vector-icons
3. **expo-secure-store** → **react-native-keychain**
4. **expo-camera** → **react-native-image-picker** (for photo capture)

### Update imports throughout your codebase:
```typescript
// Before (Expo)
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';

// After (React Native CLI)
import LinearGradient from 'react-native-linear-gradient';
import * as Keychain from 'react-native-keychain';
```

## Step 9: Icon Setup

1. **Copy icon fonts to Android:**
```bash
cp node_modules/react-native-vector-icons/Fonts/* android/app/src/main/assets/fonts/
```

2. **For iOS, fonts are automatically included via CocoaPods**

## Step 10: Build and Run

### Android:
```bash
npx react-native run-android
```

### iOS (macOS only):
```bash
npx react-native run-ios
```

## Step 11: Additional Configurations

### Permissions (Android - `android/app/src/main/AndroidManifest.xml`):
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

### Permissions (iOS - `ios/OneOOneFitness/Info.plist`):
```xml
<key>NSCameraUsageDescription</key>
<string>This app needs access to camera to take progress photos</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>This app needs access to photo library to save progress photos</string>
```

## Step 12: Testing

1. **Test on Android device/emulator**
2. **Test on iOS device/simulator (macOS only)**
3. **Verify all features work correctly**
4. **Test navigation flows**
5. **Verify database connections**

## Common Issues and Solutions

1. **Metro bundler issues:** Clear cache with `npx react-native start --reset-cache`
2. **Android build issues:** Clean with `cd android && ./gradlew clean && cd ..`
3. **iOS build issues:** Clean build folder in Xcode
4. **Dependency conflicts:** Use `npm ls` to check for version conflicts

## Benefits of React Native CLI

- Full access to native code
- Better performance
- More third-party library compatibility
- Custom native modules
- Advanced debugging capabilities
- Production-ready builds

This conversion will give you a fully native React Native app with all the fitness tracking features while maintaining the same UI/UX design.