export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          height: number | null;
          weight: number | null;
          age: number | null;
          fitness_goal: string | null;
          fitness_level: string | null;
          weekly_availability: number | null;
          preferred_workouts: string[] | null;
          equipment_access: string[] | null;
          medical_conditions: string | null;
          target_muscles: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          height?: number | null;
          weight?: number | null;
          age?: number | null;
          fitness_goal?: string | null;
          fitness_level?: string | null;
          weekly_availability?: number | null;
          preferred_workouts?: string[] | null;
          equipment_access?: string[] | null;
          medical_conditions?: string | null;
          target_muscles?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
          height?: number | null;
          weight?: number | null;
          age?: number | null;
          fitness_goal?: string | null;
          fitness_level?: string | null;
          weekly_availability?: number | null;
          preferred_workouts?: string[] | null;
          equipment_access?: string[] | null;
          medical_conditions?: string | null;
          target_muscles?: string[] | null;
          updated_at?: string;
        };
      };
      workouts: {
        Row: {
          id: string;
          name: string;
          description: string;
          difficulty: 'beginner' | 'intermediate' | 'advanced';
          duration: number;
          target_muscles: string[];
          equipment_needed: string[];
          exercise_count: number;
          calories_burned: number;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          name: string;
          description: string;
          difficulty: 'beginner' | 'intermediate' | 'advanced';
          duration: number;
          target_muscles: string[];
          equipment_needed: string[];
          exercise_count: number;
          calories_burned: number;
          image_url?: string | null;
        };
        Update: {
          name?: string;
          description?: string;
          difficulty?: 'beginner' | 'intermediate' | 'advanced';
          duration?: number;
          target_muscles?: string[];
          equipment_needed?: string[];
          exercise_count?: number;
          calories_burned?: number;
          image_url?: string | null;
        };
      };
      equipment: {
        Row: {
          id: string;
          name: string;
          description: string;
          category: string;
          difficulty_level: 'beginner' | 'intermediate' | 'advanced';
          safety_tips: string[];
          usage_guide: string;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          name: string;
          description: string;
          category: string;
          difficulty_level: 'beginner' | 'intermediate' | 'advanced';
          safety_tips: string[];
          usage_guide: string;
          image_url?: string | null;
        };
        Update: {
          name?: string;
          description?: string;
          category?: string;
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
          safety_tips?: string[];
          usage_guide?: string;
          image_url?: string | null;
        };
      };
      workout_sessions: {
        Row: {
          id: string;
          user_id: string;
          workout_id: string;
          duration: number;
          calories_burned: number;
          completed_at: string;
          notes: string | null;
        };
        Insert: {
          user_id: string;
          workout_id: string;
          duration: number;
          calories_burned: number;
          completed_at?: string;
          notes?: string | null;
        };
        Update: {
          duration?: number;
          calories_burned?: number;
          notes?: string | null;
        };
      };
    };
  };
}