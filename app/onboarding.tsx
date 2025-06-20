import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft, 
  ArrowRight, 
  Target, 
  Activity, 
  Calendar,
  Dumbbell,
  Heart,
  User
} from 'lucide-react-native';

interface OnboardingData {
  height: string;
  weight: string;
  age: string;
  fitness_goal: string;
  fitness_level: string;
  weekly_availability: number;
  preferred_workouts: string[];
  equipment_access: string[];
  medical_conditions: string;
  target_muscles: string[];
}

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<OnboardingData>({
    height: '',
    weight: '',
    age: '',
    fitness_goal: '',
    fitness_level: '',
    weekly_availability: 3,
    preferred_workouts: [],
    equipment_access: [],
    medical_conditions: '',
    target_muscles: [],
  });

  const fitnessGoals = [
    'Weight Loss',
    'Muscle Gain',
    'Strength Building',
    'Endurance',
    'General Fitness',
    'Flexibility',
  ];

  const fitnessLevels = [
    { value: 'beginner', label: 'Beginner', description: 'New to fitness' },
    { value: 'intermediate', label: 'Intermediate', description: 'Some experience' },
    { value: 'advanced', label: 'Advanced', description: 'Very experienced' },
  ];

  const workoutTypes = [
    'Strength Training',
    'Cardio',
    'HIIT',
    'Yoga',
    'Pilates',
    'Running',
    'Cycling',
    'Swimming',
  ];

  const equipmentOptions = [
    'Dumbbells',
    'Barbell',
    'Resistance Bands',
    'Kettlebells',
    'Pull-up Bar',
    'Yoga Mat',
    'Treadmill',
    'Stationary Bike',
    'None',
  ];

  const targetMuscles = [
    'Arms',
    'Chest',
    'Back',
    'Shoulders',
    'Abs',
    'Legs',
    'Glutes',
    'Full Body',
  ];

  const updateFormData = (field: keyof OnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof OnboardingData, item: string) => {
    const currentArray = formData[field] as string[];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    updateFormData(field, newArray);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          height: formData.height ? parseInt(formData.height) : null,
          weight: formData.weight ? parseInt(formData.weight) : null,
          age: formData.age ? parseInt(formData.age) : null,
          fitness_goal: formData.fitness_goal,
          fitness_level: formData.fitness_level,
          weekly_availability: formData.weekly_availability,
          preferred_workouts: formData.preferred_workouts,
          equipment_access: formData.equipment_access,
          medical_conditions: formData.medical_conditions || null,
          target_muscles: formData.target_muscles,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      Alert.alert(
        'Profile Updated!',
        'Your fitness profile has been updated successfully.',
        [
          {
            text: 'Continue',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: 'Personal Info',
      icon: User,
      content: (
        <View style={styles.stepContent}>
          <Text style={styles.stepDescription}>
            Let's start with some basic information about you.
          </Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Height (cm)</Text>
            <TextInput
              style={styles.input}
              value={formData.height}
              onChangeText={(value) => updateFormData('height', value)}
              placeholder="175"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Weight (kg)</Text>
            <TextInput
              style={styles.input}
              value={formData.weight}
              onChangeText={(value) => updateFormData('weight', value)}
              placeholder="70"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Age</Text>
            <TextInput
              style={styles.input}
              value={formData.age}
              onChangeText={(value) => updateFormData('age', value)}
              placeholder="25"
              keyboardType="numeric"
            />
          </View>
        </View>
      ),
    },
    {
      title: 'Fitness Goal',
      icon: Target,
      content: (
        <View style={styles.stepContent}>
          <Text style={styles.stepDescription}>
            What's your primary fitness goal?
          </Text>
          
          <View style={styles.optionsGrid}>
            {fitnessGoals.map((goal) => (
              <TouchableOpacity
                key={goal}
                style={[
                  styles.optionCard,
                  formData.fitness_goal === goal && styles.optionCardSelected
                ]}
                onPress={() => updateFormData('fitness_goal', goal)}
              >
                <Text style={[
                  styles.optionText,
                  formData.fitness_goal === goal && styles.optionTextSelected
                ]}>
                  {goal}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ),
    },
    {
      title: 'Fitness Level',
      icon: Activity,
      content: (
        <View style={styles.stepContent}>
          <Text style={styles.stepDescription}>
            What's your current fitness level?
          </Text>
          
          <View style={styles.levelOptions}>
            {fitnessLevels.map((level) => (
              <TouchableOpacity
                key={level.value}
                style={[
                  styles.levelCard,
                  formData.fitness_level === level.value && styles.levelCardSelected
                ]}
                onPress={() => updateFormData('fitness_level', level.value)}
              >
                <Text style={[
                  styles.levelTitle,
                  formData.fitness_level === level.value && styles.levelTitleSelected
                ]}>
                  {level.label}
                </Text>
                <Text style={[
                  styles.levelDescription,
                  formData.fitness_level === level.value && styles.levelDescriptionSelected
                ]}>
                  {level.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ),
    },
    {
      title: 'Availability',
      icon: Calendar,
      content: (
        <View style={styles.stepContent}>
          <Text style={styles.stepDescription}>
            How many days per week can you work out?
          </Text>
          
          <View style={styles.availabilityContainer}>
            <Text style={styles.availabilityValue}>
              {formData.weekly_availability} days per week
            </Text>
            
            <View style={styles.daysGrid}>
              {[1, 2, 3, 4, 5, 6, 7].map((days) => (
                <TouchableOpacity
                  key={days}
                  style={[
                    styles.dayButton,
                    formData.weekly_availability === days && styles.dayButtonSelected
                  ]}
                  onPress={() => updateFormData('weekly_availability', days)}
                >
                  <Text style={[
                    styles.dayButtonText,
                    formData.weekly_availability === days && styles.dayButtonTextSelected
                  ]}>
                    {days}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      ),
    },
    {
      title: 'Workout Types',
      icon: Dumbbell,
      content: (
        <View style={styles.stepContent}>
          <Text style={styles.stepDescription}>
            What types of workouts do you prefer? (Select multiple)
          </Text>
          
          <View style={styles.optionsGrid}>
            {workoutTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.optionCard,
                  formData.preferred_workouts.includes(type) && styles.optionCardSelected
                ]}
                onPress={() => toggleArrayItem('preferred_workouts', type)}
              >
                <Text style={[
                  styles.optionText,
                  formData.preferred_workouts.includes(type) && styles.optionTextSelected
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ),
    },
    {
      title: 'Equipment',
      icon: Dumbbell,
      content: (
        <View style={styles.stepContent}>
          <Text style={styles.stepDescription}>
            What equipment do you have access to? (Select multiple)
          </Text>
          
          <View style={styles.optionsGrid}>
            {equipmentOptions.map((equipment) => (
              <TouchableOpacity
                key={equipment}
                style={[
                  styles.optionCard,
                  formData.equipment_access.includes(equipment) && styles.optionCardSelected
                ]}
                onPress={() => toggleArrayItem('equipment_access', equipment)}
              >
                <Text style={[
                  styles.optionText,
                  formData.equipment_access.includes(equipment) && styles.optionTextSelected
                ]}>
                  {equipment}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ),
    },
    {
      title: 'Target Areas',
      icon: Target,
      content: (
        <View style={styles.stepContent}>
          <Text style={styles.stepDescription}>
            Which muscle groups do you want to focus on? (Select multiple)
          </Text>
          
          <View style={styles.optionsGrid}>
            {targetMuscles.map((muscle) => (
              <TouchableOpacity
                key={muscle}
                style={[
                  styles.optionCard,
                  formData.target_muscles.includes(muscle) && styles.optionCardSelected
                ]}
                onPress={() => toggleArrayItem('target_muscles', muscle)}
              >
                <Text style={[
                  styles.optionText,
                  formData.target_muscles.includes(muscle) && styles.optionTextSelected
                ]}>
                  {muscle}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ),
    },
    {
      title: 'Health Info',
      icon: Heart,
      content: (
        <View style={styles.stepContent}>
          <Text style={styles.stepDescription}>
            Do you have any medical conditions or injuries we should know about?
          </Text>
          
          <TextInput
            style={styles.textArea}
            value={formData.medical_conditions}
            onChangeText={(value) => updateFormData('medical_conditions', value)}
            placeholder="Optional: List any conditions, injuries, or limitations..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      ),
    },
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <LinearGradient
      colors={['#2563EB', '#1D4ED8']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : router.back()}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {currentStep + 1} of {steps.length}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.stepHeader}>
            <View style={styles.stepIcon}>
              <currentStepData.icon size={32} color="#2563EB" />
            </View>
            <Text style={styles.stepTitle}>{currentStepData.title}</Text>
          </View>

          <ScrollView 
            style={styles.stepContainer}
            showsVerticalScrollIndicator={false}
          >
            {currentStepData.content}
          </ScrollView>

          <TouchableOpacity
            style={[styles.nextButton, loading && styles.disabledButton]}
            onPress={handleNext}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.nextButtonText}>
                  {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
                </Text>
                <ArrowRight size={20} color="#FFFFFF" />
              </>
            )}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    marginRight: 16,
  },
  progressContainer: {
    flex: 1,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#E0E7FF',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  stepIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  stepContainer: {
    flex: 1,
  },
  stepContent: {
    paddingBottom: 32,
  },
  stepDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  textArea: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    minHeight: 120,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: '45%',
    alignItems: 'center',
  },
  optionCardSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    textAlign: 'center',
  },
  optionTextSelected: {
    color: '#FFFFFF',
  },
  levelOptions: {
    gap: 16,
  },
  levelCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 20,
  },
  levelCardSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  levelTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  levelTitleSelected: {
    color: '#2563EB',
  },
  levelDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  levelDescriptionSelected: {
    color: '#2563EB',
  },
  availabilityContainer: {
    alignItems: 'center',
  },
  availabilityValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#2563EB',
    marginBottom: 24,
  },
  daysGrid: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  dayButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  dayButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  dayButtonTextSelected: {
    color: '#FFFFFF',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 32,
    gap: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});