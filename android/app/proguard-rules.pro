# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# React Native
-keep class com.facebook.react.** { *; }
-keep class com.facebook.jni.** { *; }

# Supabase
-keep class io.supabase.** { *; }

# Vector Icons
-keep class com.oblador.vectoricons.** { *; }

# Linear Gradient
-keep class com.BV.LinearGradient.** { *; }

# Chart Kit
-keep class org.nativescript.** { *; }

# Image Picker
-keep class com.imagepicker.** { *; }

# Keychain
-keep class com.oblador.keychain.** { *; }

# Async Storage
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# Gesture Handler
-keep class com.swmansion.gesturehandler.** { *; }

# Reanimated
-keep class com.swmansion.reanimated.** { *; }

# Safe Area Context
-keep class com.th3rdwave.safeareacontext.** { *; }

# Screens
-keep class com.swmansion.rnscreens.** { *; }

# SVG
-keep class com.horcrux.svg.** { *; }

# Permissions
-keep class com.zoontek.rnpermissions.** { *; }

# Haptic Feedback
-keep class com.mkuczera.** { *; }

# Config
-keep class com.lugg.ReactNativeConfig.** { *; }

# Flipper
-keep class com.facebook.flipper.** { *; }

# General Android optimizations
-optimizationpasses 5
-dontusemixedcaseclassnames
-dontskipnonpubliclibraryclasses
-dontpreverify
-verbose

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep enums
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# Keep Parcelable implementations
-keep class * implements android.os.Parcelable {
  public static final android.os.Parcelable$Creator *;
}

# Remove logging
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int i(...);
    public static int w(...);
    public static int d(...);
    public static int e(...);
}