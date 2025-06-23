# One O One Fitness

A comprehensive React Native fitness application built with modern technologies and best practices.

## Features

- **Authentication & Authorization**: Secure JWT-based authentication with biometric support
- **Comprehensive Onboarding**: Multi-step survey to personalize user experience
- **Workout Management**: Browse, filter, and track workouts with detailed exercise information
- **Equipment Database**: Comprehensive equipment guide with usage instructions and safety tips
- **Progress Tracking**: Visual progress charts, achievement system, and body metrics tracking
- **Profile Management**: Complete user profile with fitness goals and preferences

## Tech Stack

- **Framework**: React Native CLI
- **Language**: TypeScript
- **Navigation**: React Navigation 6
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: React Context + Hooks
- **Charts**: React Native Chart Kit
- **Icons**: React Native Vector Icons
- **Styling**: StyleSheet with custom theme system
- **Storage**: AsyncStorage + Keychain (secure)
- **Permissions**: React Native Permissions
- **Image Handling**: React Native Image Picker

## Prerequisites

- Node.js 18+
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- Java Development Kit (JDK) 11+

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd OneOOneFitness
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **iOS Setup (macOS only)**
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Database Setup**
   - Create a Supabase project
   - Run the migration files in `supabase/migrations/`
   - Update the environment variables

## Running the App

### Development

```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios
```

### Production Builds

```bash
# Android Release Build
npm run build:android

# Android Bundle (for Play Store)
npm run build:android:bundle

# iOS Release Build (macOS only)
npm run build:ios
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── common/         # Common components (ErrorBoundary, LoadingSpinner)
├── config/             # App configuration and constants
├── contexts/           # React Context providers
├── navigation/         # Navigation configuration
├── screens/            # Screen components
│   ├── auth/          # Authentication screens
│   ├── tabs/          # Main tab screens
│   └── onboarding/    # Onboarding flow
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
    ├── errorHandler.ts # Error handling utilities
    ├── validation.ts   # Form validation
    ├── storage.ts      # Storage utilities
    ├── permissions.ts  # Permission management
    └── haptics.ts      # Haptic feedback
```

## Key Features

### Authentication
- Email/password authentication
- Secure token storage
- Biometric authentication support
- Password reset functionality

### Onboarding
- Multi-step personalization survey
- Fitness goal setting
- Equipment accessibility assessment
- Medical condition considerations

### Workouts
- Comprehensive exercise database
- Difficulty-based filtering
- Target muscle group selection
- Progress tracking and logging

### Equipment
- Detailed equipment information
- Safety guidelines and tips
- Usage instructions
- Category-based organization

### Progress Tracking
- Visual progress charts
- Achievement system
- Body measurement tracking
- Workout history and statistics

## Development Guidelines

### Code Style
- ESLint configuration for consistent code style
- Prettier for code formatting
- TypeScript for type safety
- Husky for pre-commit hooks

### Testing
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Linting
```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix
```

### Type Checking
```bash
# Run TypeScript type checking
npm run type-check
```

## Security Features

- Secure token storage using Keychain
- Input validation and sanitization
- Network security configuration
- Biometric authentication support
- Row Level Security (RLS) in database

## Performance Optimizations

- Code splitting and lazy loading
- Image optimization
- Bundle size optimization
- ProGuard/R8 minification for Android
- Hermes JavaScript engine

## Deployment

### Android
1. Generate a signed APK or AAB
2. Upload to Google Play Console
3. Configure app signing and release management

### iOS
1. Archive the app in Xcode
2. Upload to App Store Connect
3. Configure app metadata and submit for review

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.