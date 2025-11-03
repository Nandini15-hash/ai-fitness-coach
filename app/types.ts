export interface UserData {
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  fitnessGoal: string;
  fitnessLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  workoutLocation: 'Home' | 'Gym' | 'Outdoor';
  dietaryPreference: 'Veg' | 'Non-Veg' | 'Vegan' | 'Keto';
  medicalHistory?: string;
  stressLevel?: number;
}

export interface FitnessPlan {
  workout: {
    dailyRoutine: Array<{
      exercise: string;
      sets: number;
      reps: number;
      rest: string;
    }>;
  };
  diet: {
    meals: {
      breakfast: string;
      lunch: string;
      dinner: string;
      snacks: string;
    };
  };
  tips: string[];
}