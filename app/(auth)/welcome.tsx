import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Dumbbell, Target, TrendingUp } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function Welcome() {
  return (
    <LinearGradient
      colors={['#2563EB', '#1D4ED8', '#1E40AF']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Dumbbell size={40} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={styles.logo}>One O One</Text>
            <Text style={styles.logoSubtitle}>FITNESS</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Transform Your</Text>
          <Text style={styles.titleAccent}>Fitness Journey</Text>
          <Text style={styles.subtitle}>
            Join thousands of users achieving their fitness goals with personalized workouts and expert guidance.
          </Text>

          <View style={styles.features}>
            <View style={styles.feature}>
              <Target size={24} color="#FFFFFF" />
              <Text style={styles.featureText}>Personalized Plans</Text>
            </View>
            <View style={styles.feature}>
              <TrendingUp size={24} color="#FFFFFF" />
              <Text style={styles.featureText}>Track Progress</Text>
            </View>
            <View style={styles.feature}>
              <Dumbbell size={24} color="#FFFFFF" />
              <Text style={styles.featureText}>Expert Guidance</Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => router.push('/(auth)/signup')}
          >
            <Text style={styles.signupButtonText}>Get Started</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.loginButtonText}>Already have an account? Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 12,
    letterSpacing: 1,
  },
  logoSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#E0E7FF',
    letterSpacing: 3,
    marginTop: 4,
  },
  content: {
    flex: 0.5,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
  title: {
    fontSize: 42,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 48,
  },
  titleAccent: {
    fontSize: 42,
    fontFamily: 'Inter-Bold',
    color: '#FED7AA',
    textAlign: 'center',
    lineHeight: 48,
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#E0E7FF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  feature: {
    alignItems: 'center',
  },
  featureText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#E0E7FF',
    marginTop: 8,
    textAlign: 'center',
  },
  actions: {
    flex: 0.2,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
  signupButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  signupButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
    textAlign: 'center',
  },
  loginButton: {
    paddingVertical: 12,
  },
  loginButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#E0E7FF',
    textAlign: 'center',
  },
});