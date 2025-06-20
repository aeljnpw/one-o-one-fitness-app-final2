import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart, ProgressChart } from 'react-native-chart-kit';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Calendar, 
  TrendingUp, 
  Award, 
  Target, 
  Flame,
  Clock,
  Zap,
  Trophy
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface WorkoutSession {
  id: string;
  duration: number;
  calories_burned: number;
  completed_at: string;
}

export default function ProgressTab() {
  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadProgressData();
    }
  }, [user]);

  const loadProgressData = async () => {
    try {
      const { data, error } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', user?.id)
        .order('completed_at', { ascending: false })
        .limit(30);

      if (error) throw error;

      const sessions = data || [];
      setWorkoutSessions(sessions);
      
      // Calculate stats
      setTotalWorkouts(sessions.length);
      setTotalCalories(sessions.reduce((sum, session) => sum + session.calories_burned, 0));
      setTotalMinutes(sessions.reduce((sum, session) => sum + session.duration, 0));
      
      // Calculate streak
      calculateStreak(sessions);
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStreak = (sessions: WorkoutSession[]) => {
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sessions.length; i++) {
      const sessionDate = new Date(sessions[i].completed_at);
      sessionDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }
    
    setCurrentStreak(streak);
  };

  const getWeeklyData = () => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      last7Days.push(date);
    }

    return last7Days.map(date => {
      const sessionsOnDay = workoutSessions.filter(session => {
        const sessionDate = new Date(session.completed_at);
        return sessionDate.toDateString() === date.toDateString();
      });
      
      return sessionsOnDay.reduce((sum, session) => sum + session.calories_burned, 0);
    });
  };

  const chartConfig = {
    backgroundColor: '#FFFFFF',
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#2563EB',
    },
  };

  const progressData = {
    labels: ['Goal'],
    data: [currentStreak / 30], // Assuming 30-day goal
  };

  const progressConfig = {
    backgroundColor: '#FFFFFF',
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
    strokeWidth: 2,
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#2563EB', '#1D4ED8']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Progress</Text>
          <Text style={styles.headerSubtitle}>Track your fitness journey</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Flame size={24} color="#EA580C" />
              </View>
              <Text style={styles.statValue}>{currentStreak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Zap size={24} color="#16A34A" />
              </View>
              <Text style={styles.statValue}>{totalWorkouts}</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Target size={24} color="#DC2626" />
              </View>
              <Text style={styles.statValue}>{totalCalories.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Clock size={24} color="#7C3AED" />
              </View>
              <Text style={styles.statValue}>{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m</Text>
              <Text style={styles.statLabel}>Time</Text>
            </View>
          </View>
        </View>

        {/* Weekly Progress Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Weekly Calories Burned</Text>
          {workoutSessions.length > 0 ? (
            <LineChart
              data={{
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                  data: getWeeklyData(),
                }],
              }}
              width={width - 48}
              height={200}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          ) : (
            <View style={styles.noDataContainer}>
              <TrendingUp size={48} color="#9CA3AF" />
              <Text style={styles.noDataText}>Start working out to see your progress!</Text>
            </View>
          )}
        </View>

        {/* Goal Progress */}
        <View style={styles.goalContainer}>
          <Text style={styles.goalTitle}>Monthly Goal Progress</Text>
          <Text style={styles.goalSubtitle}>
            {currentStreak} of 30 days completed
          </Text>
          
          {workoutSessions.length > 0 ? (
            <ProgressChart
              data={progressData}
              width={width - 48}
              height={160}
              strokeWidth={16}
              radius={50}
              chartConfig={progressConfig}
              hideLegend={true}
              style={styles.progressChart}
            />
          ) : (
            <View style={styles.noDataContainer}>
              <Target size={48} color="#9CA3AF" />
              <Text style={styles.noDataText}>Complete workouts to track your goals!</Text>
            </View>
          )}
        </View>

        {/* Achievements */}
        <View style={styles.achievementsContainer}>
          <Text style={styles.achievementsTitle}>Achievements</Text>
          
          <View style={styles.achievementsList}>
            <View style={[styles.achievementCard, currentStreak >= 7 && styles.achievementCompleted]}>
              <View style={styles.achievementIcon}>
                <Award size={24} color={currentStreak >= 7 ? '#16A34A' : '#9CA3AF'} />
              </View>
              <View style={styles.achievementContent}>
                <Text style={styles.achievementName}>Week Warrior</Text>
                <Text style={styles.achievementDescription}>Complete 7 days in a row</Text>
              </View>
              {currentStreak >= 7 && (
                <Trophy size={20} color="#F59E0B" />
              )}
            </View>

            <View style={[styles.achievementCard, totalWorkouts >= 10 && styles.achievementCompleted]}>
              <View style={styles.achievementIcon}>
                <Zap size={24} color={totalWorkouts >= 10 ? '#16A34A' : '#9CA3AF'} />
              </View>
              <View style={styles.achievementContent}>
                <Text style={styles.achievementName}>Perfect 10</Text>
                <Text style={styles.achievementDescription}>Complete 10 workouts</Text>
              </View>
              {totalWorkouts >= 10 && (
                <Trophy size={20} color="#F59E0B" />
              )}
            </View>

            <View style={[styles.achievementCard, totalCalories >= 1000 && styles.achievementCompleted]}>
              <View style={styles.achievementIcon}>
                <Flame size={24} color={totalCalories >= 1000 ? '#16A34A' : '#9CA3AF'} />
              </View>
              <View style={styles.achievementContent}>
                <Text style={styles.achievementName}>Calorie Crusher</Text>
                <Text style={styles.achievementDescription}>Burn 1,000 calories</Text>
              </View>
              {totalCalories >= 1000 && (
                <Trophy size={20} color="#F59E0B" />
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerContent: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#E0E7FF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  statsContainer: {
    marginVertical: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statIconContainer: {
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  goalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  goalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  goalSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 16,
  },
  progressChart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  noDataText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginTop: 12,
    textAlign: 'center',
  },
  achievementsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  achievementsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  achievementsList: {
    gap: 12,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  achievementCompleted: {
    backgroundColor: '#F0FDF4',
    borderColor: '#16A34A',
  },
  achievementIcon: {
    marginRight: 12,
  },
  achievementContent: {
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
});