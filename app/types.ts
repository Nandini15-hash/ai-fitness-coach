export type FitnessGoal = 'weight_loss' | 'muscle_gain' | 'maintenance';
export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';

// Matches exactly what UserForm collects.
export interface UserData {
  name: string;
  age: number;
  gender: string;
  height: number; // cm
  weight: number; // kg
  fitnessGoal: FitnessGoal;
  fitnessLevel: FitnessLevel;
}

export interface Exercise {
  exercise: string;
  sets: number;
  reps: number;
  rest: string;
}

export interface Meals {
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string;
}

export interface FitnessPlan {
  workout: { dailyRoutine: Exercise[] };
  diet: { meals: Meals };
  tips: string[];
}
