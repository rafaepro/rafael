
export interface User {
  name: string;
  birthDate: string; // Postpartum date
  goal: string;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
}

export interface DailyStats {
  water: number; // in ml
  mood: string;
  workoutsCompleted: number;
  mealsLogged: number;
  lastRitual: string | null; // ISO date string
}

export interface Workout {
  id: string;
  title: string;
  category: 'Alongamento' | 'Mobilidade' | 'Respiração' | 'Fortalecimento' | 'Caminhada' | string;
  duration: number; // minutes
  completed: boolean;
  tip?: string; // Guidance on how to perform the exercise
}

export interface Meal {
  id: string;
  type: 'Café' | 'Almoço' | 'Jantar' | 'Lanche';
  description: string;
  image?: string; // base64
  timestamp: string;
}

export interface MealSuggestion {
  id: string;
  title: string;
  description: string;
  benefit: string;
  icon: string;
}

export interface MoodLog {
  id: string;
  emoji: string;
  label: string;
  note: string;
  timestamp: string;
}

export interface ProgressMetric {
  id: string;
  date: string;
  weight: number;
  waist?: number;
  hips?: number;
  photo?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
}

export interface ChallengeDay {
  day: number;
  title: string;
  description: string;
  completed: boolean;
  category: 'nutrition' | 'mind' | 'body';
}

export enum AppScreen {
  HOME = 'HOME',
  WORKOUTS = 'WORKOUTS',
  NUTRITION = 'NUTRITION',
  WATER = 'WATER',
  MOOD = 'MOOD',
  PROGRESS = 'PROGRESS',
  PROFILE = 'PROFILE',
  MAGIC_EDITOR = 'MAGIC_EDITOR',
  CHALLENGE = 'CHALLENGE'
}
