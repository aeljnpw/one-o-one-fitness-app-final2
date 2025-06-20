/*
  # Create Missing Tables for One O One Fitness App

  1. New Tables
    - `workout_sessions` - Track completed workout sessions by users
    - `exercise_sets` - Track individual sets within workout sessions
    - `user_achievements` - Track user achievements and badges
    - `daily_goals` - Track daily fitness goals and progress
    - `body_measurements` - Track body measurements over time
    - `workout_templates` - Predefined workout templates
    - `workout_template_exercises` - Exercises within workout templates
    - `user_favorites` - User's favorite workouts and exercises
    - `progress_photos` - User progress photos
    - `nutrition_logs` - Basic nutrition tracking
    - `equipment_maintenance` - Equipment maintenance tracking

  2. Security
    - Enable RLS on all new tables
    - Add appropriate policies for user data access
    - Ensure users can only access their own data

  3. Indexes
    - Add performance indexes for frequently queried columns
    - Foreign key indexes for better join performance
*/

-- Workout Sessions Table
CREATE TABLE IF NOT EXISTS workout_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_id uuid REFERENCES workouts(id) ON DELETE SET NULL,
  name text NOT NULL,
  duration integer NOT NULL DEFAULT 0, -- in minutes
  calories_burned integer NOT NULL DEFAULT 0,
  notes text,
  completed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Exercise Sets Table (for tracking individual sets in workouts)
CREATE TABLE IF NOT EXISTS exercise_sets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_session_id uuid NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
  exercise_id uuid NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  set_number integer NOT NULL,
  reps integer,
  weight numeric(5,2), -- in kg
  duration integer, -- in seconds for time-based exercises
  distance numeric(8,2), -- in meters for cardio
  rest_time integer, -- in seconds
  notes text,
  completed_at timestamptz DEFAULT now()
);

-- User Achievements Table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type text NOT NULL, -- 'streak', 'workout_count', 'calories', 'duration', etc.
  achievement_name text NOT NULL,
  achievement_description text,
  target_value integer,
  current_value integer DEFAULT 0,
  is_completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Daily Goals Table
CREATE TABLE IF NOT EXISTS daily_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  calorie_goal integer DEFAULT 500,
  exercise_minutes_goal integer DEFAULT 30,
  steps_goal integer DEFAULT 10000,
  water_goal integer DEFAULT 8, -- glasses of water
  calories_burned integer DEFAULT 0,
  exercise_minutes integer DEFAULT 0,
  steps integer DEFAULT 0,
  water_consumed integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Body Measurements Table
CREATE TABLE IF NOT EXISTS body_measurements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  measurement_date date NOT NULL DEFAULT CURRENT_DATE,
  weight numeric(5,2), -- in kg
  body_fat_percentage numeric(4,2),
  muscle_mass numeric(5,2), -- in kg
  chest numeric(5,2), -- in cm
  waist numeric(5,2), -- in cm
  hips numeric(5,2), -- in cm
  bicep_left numeric(4,2), -- in cm
  bicep_right numeric(4,2), -- in cm
  thigh_left numeric(5,2), -- in cm
  thigh_right numeric(5,2), -- in cm
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Workout Templates Table
CREATE TABLE IF NOT EXISTS workout_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  difficulty text NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  estimated_duration integer NOT NULL, -- in minutes
  target_muscles text[] DEFAULT '{}',
  equipment_needed text[] DEFAULT '{}',
  category text NOT NULL DEFAULT 'general',
  is_public boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Workout Template Exercises Table
CREATE TABLE IF NOT EXISTS workout_template_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid NOT NULL REFERENCES workout_templates(id) ON DELETE CASCADE,
  exercise_id uuid NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  order_index integer NOT NULL,
  sets integer DEFAULT 3,
  reps integer,
  duration integer, -- in seconds
  rest_time integer DEFAULT 60, -- in seconds
  notes text
);

-- User Favorites Table
CREATE TABLE IF NOT EXISTS user_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type text NOT NULL CHECK (item_type IN ('exercise', 'workout', 'template')),
  item_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, item_type, item_id)
);

-- Progress Photos Table
CREATE TABLE IF NOT EXISTS progress_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  photo_url text NOT NULL,
  photo_type text NOT NULL CHECK (photo_type IN ('front', 'side', 'back', 'other')),
  taken_date date NOT NULL DEFAULT CURRENT_DATE,
  weight numeric(5,2), -- weight at time of photo
  notes text,
  is_private boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Nutrition Logs Table (Basic)
CREATE TABLE IF NOT EXISTS nutrition_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  meal_type text NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  food_name text NOT NULL,
  calories integer DEFAULT 0,
  protein numeric(5,2) DEFAULT 0, -- in grams
  carbs numeric(5,2) DEFAULT 0, -- in grams
  fat numeric(5,2) DEFAULT 0, -- in grams
  serving_size text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Equipment Maintenance Table
CREATE TABLE IF NOT EXISTS equipment_maintenance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id uuid NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  maintenance_type text NOT NULL CHECK (maintenance_type IN ('cleaning', 'repair', 'inspection', 'replacement')),
  maintenance_date date NOT NULL DEFAULT CURRENT_DATE,
  description text NOT NULL,
  cost numeric(8,2),
  performed_by text,
  next_maintenance_date date,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_template_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_maintenance ENABLE ROW LEVEL SECURITY;

-- Workout Sessions Policies
CREATE POLICY "Users can view their own workout sessions"
  ON workout_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout sessions"
  ON workout_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout sessions"
  ON workout_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout sessions"
  ON workout_sessions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Exercise Sets Policies
CREATE POLICY "Users can view exercise sets from their workout sessions"
  ON exercise_sets
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workout_sessions 
      WHERE workout_sessions.id = exercise_sets.workout_session_id 
      AND workout_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert exercise sets to their workout sessions"
  ON exercise_sets
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workout_sessions 
      WHERE workout_sessions.id = exercise_sets.workout_session_id 
      AND workout_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update exercise sets in their workout sessions"
  ON exercise_sets
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workout_sessions 
      WHERE workout_sessions.id = exercise_sets.workout_session_id 
      AND workout_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete exercise sets from their workout sessions"
  ON exercise_sets
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workout_sessions 
      WHERE workout_sessions.id = exercise_sets.workout_session_id 
      AND workout_sessions.user_id = auth.uid()
    )
  );

-- User Achievements Policies
CREATE POLICY "Users can view their own achievements"
  ON user_achievements
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements"
  ON user_achievements
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own achievements"
  ON user_achievements
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Daily Goals Policies
CREATE POLICY "Users can view their own daily goals"
  ON daily_goals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily goals"
  ON daily_goals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily goals"
  ON daily_goals
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Body Measurements Policies
CREATE POLICY "Users can view their own body measurements"
  ON body_measurements
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own body measurements"
  ON body_measurements
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own body measurements"
  ON body_measurements
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own body measurements"
  ON body_measurements
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Workout Templates Policies
CREATE POLICY "Everyone can view public workout templates"
  ON workout_templates
  FOR SELECT
  TO authenticated
  USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Users can insert their own workout templates"
  ON workout_templates
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own workout templates"
  ON workout_templates
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own workout templates"
  ON workout_templates
  FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Workout Template Exercises Policies
CREATE POLICY "Users can view exercises in accessible templates"
  ON workout_template_exercises
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workout_templates 
      WHERE workout_templates.id = workout_template_exercises.template_id 
      AND (workout_templates.is_public = true OR workout_templates.created_by = auth.uid())
    )
  );

CREATE POLICY "Users can manage exercises in their own templates"
  ON workout_template_exercises
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workout_templates 
      WHERE workout_templates.id = workout_template_exercises.template_id 
      AND workout_templates.created_by = auth.uid()
    )
  );

-- User Favorites Policies
CREATE POLICY "Users can view their own favorites"
  ON user_favorites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
  ON user_favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON user_favorites
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Progress Photos Policies
CREATE POLICY "Users can view their own progress photos"
  ON progress_photos
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress photos"
  ON progress_photos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress photos"
  ON progress_photos
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress photos"
  ON progress_photos
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Nutrition Logs Policies
CREATE POLICY "Users can view their own nutrition logs"
  ON nutrition_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own nutrition logs"
  ON nutrition_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own nutrition logs"
  ON nutrition_logs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own nutrition logs"
  ON nutrition_logs
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Equipment Maintenance Policies (Admin/Staff access)
CREATE POLICY "Authenticated users can view equipment maintenance"
  ON equipment_maintenance
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_id ON workout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_completed_at ON workout_sessions(completed_at);
CREATE INDEX IF NOT EXISTS idx_exercise_sets_workout_session_id ON exercise_sets(workout_session_id);
CREATE INDEX IF NOT EXISTS idx_exercise_sets_exercise_id ON exercise_sets(exercise_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_goals_user_id_date ON daily_goals(user_id, date);
CREATE INDEX IF NOT EXISTS idx_body_measurements_user_id_date ON body_measurements(user_id, measurement_date);
CREATE INDEX IF NOT EXISTS idx_workout_templates_category ON workout_templates(category);
CREATE INDEX IF NOT EXISTS idx_workout_templates_difficulty ON workout_templates(difficulty);
CREATE INDEX IF NOT EXISTS idx_workout_template_exercises_template_id ON workout_template_exercises(template_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_photos_user_id_date ON progress_photos(user_id, taken_date);
CREATE INDEX IF NOT EXISTS idx_nutrition_logs_user_id_date ON nutrition_logs(user_id, log_date);
CREATE INDEX IF NOT EXISTS idx_equipment_maintenance_equipment_id ON equipment_maintenance(equipment_id);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at columns
CREATE TRIGGER update_workout_sessions_updated_at 
    BEFORE UPDATE ON workout_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_achievements_updated_at 
    BEFORE UPDATE ON user_achievements 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_goals_updated_at 
    BEFORE UPDATE ON daily_goals 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workout_templates_updated_at 
    BEFORE UPDATE ON workout_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();