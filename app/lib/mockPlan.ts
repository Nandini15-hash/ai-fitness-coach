import type { Exercise, FitnessPlan, Meals, UserData } from '../types';

// Single source of truth for the fallback plan (used when there is no API key,
// the API fails, or the AI returns something unusable).
export function getMockPlan(userData: UserData): FitnessPlan {
  let workout: Exercise[];
  let meals: Meals;

  if (userData.fitnessGoal === 'weight_loss') {
    workout = [
      { exercise: 'Jumping Jacks', sets: 4, reps: 30, rest: '30s' },
      { exercise: 'Bodyweight Squats', sets: 3, reps: 15, rest: '45s' },
      { exercise: 'Push-ups', sets: 3, reps: 12, rest: '45s' },
      { exercise: 'High Knees', sets: 3, reps: 30, rest: '30s' },
    ];
    meals = {
      breakfast: 'Oatmeal with mixed berries and a scoop of protein powder',
      lunch: 'Large salad with grilled chicken, olive oil dressing',
      dinner: 'Baked salmon with steamed vegetables and quinoa',
      snacks: 'Apple slices with almond butter, Greek yogurt',
    };
  } else if (userData.fitnessGoal === 'muscle_gain') {
    workout = [
      { exercise: 'Push-ups', sets: 4, reps: 12, rest: '60s' },
      { exercise: 'Bodyweight Squats', sets: 4, reps: 15, rest: '60s' },
      { exercise: 'Plank (30-45s hold)', sets: 3, reps: 1, rest: '45s' },
      { exercise: 'Lunges', sets: 3, reps: 10, rest: '45s' },
      { exercise: 'Tricep Dips', sets: 3, reps: 12, rest: '45s' },
    ];
    meals = {
      breakfast: '3 scrambled eggs with whole wheat toast and avocado',
      lunch: 'Grilled chicken breast with brown rice and mixed vegetables',
      dinner: 'Salmon fillet with sweet potato and broccoli',
      snacks: 'Protein shake, Greek yogurt with nuts and honey',
    };
  } else {
    workout = [
      { exercise: 'Push-ups', sets: 3, reps: 15, rest: '60s' },
      { exercise: 'Bodyweight Squats', sets: 3, reps: 20, rest: '45s' },
      { exercise: 'Plank (30s hold)', sets: 3, reps: 1, rest: '30s' },
      { exercise: 'Jumping Jacks', sets: 3, reps: 30, rest: '45s' },
      { exercise: 'Glute Bridges', sets: 3, reps: 15, rest: '30s' },
    ];
    meals = {
      breakfast: 'Oatmeal with banana, nuts, and a drizzle of honey',
      lunch: 'Quinoa bowl with roasted vegetables and chickpeas',
      dinner: 'Grilled fish with roasted sweet potatoes and green beans',
      snacks: 'Mixed nuts, apple with peanut butter',
    };
  }

  const baseTips = [
    'Stay hydrated - aim for 8-10 glasses of water daily',
    'Get 7-9 hours of quality sleep for optimal recovery',
    'Consistency is key - even short workouts add up over time',
  ];

  const levelTips: Record<string, string[]> = {
    beginner: [
      'Focus on proper form rather than speed or heavy weights',
      'Start slow and gradually increase intensity',
      "Don't compare your progress to others - everyone starts somewhere",
    ],
    intermediate: [
      'Incorporate progressive overload to continue seeing results',
      'Consider tracking your workouts to monitor progress',
      'Mix up your routine every 4-6 weeks to avoid plateaus',
    ],
    advanced: [
      'Pay attention to recovery as much as training intensity',
      'Consider periodization in your training plan',
      'Focus on mobility and injury prevention',
    ],
  };

  return {
    workout: { dailyRoutine: workout },
    diet: { meals },
    tips: [
      ...baseTips,
      ...(levelTips[userData.fitnessLevel] ?? levelTips.beginner),
      `Remember your goal: ${userData.fitnessGoal.replace(/_/g, ' ')}`,
    ],
  };
}

const isText = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;

// Checks an AI response has every field the UI reads. Returns a clean plan,
// or null if anything important is missing so the caller can fall back.
export function validatePlan(raw: any): FitnessPlan | null {
  const routine = raw?.workout?.dailyRoutine;
  const meals = raw?.diet?.meals;
  const tips = raw?.tips;

  if (!Array.isArray(routine) || routine.length === 0) return null;
  if (!meals || !['breakfast', 'lunch', 'dinner', 'snacks'].every((k) => isText(meals[k]))) return null;
  if (!Array.isArray(tips)) return null;

  const cleanRoutine: Exercise[] = routine
    .filter((ex: any) => isText(ex?.exercise))
    .map((ex: any) => ({
      exercise: ex.exercise,
      sets: Number(ex.sets) || 1,
      reps: Number(ex.reps) || 1,
      rest: isText(ex.rest) ? ex.rest : String(ex.rest ?? '30s'),
    }));
  const cleanTips = tips.filter(isText);

  if (cleanRoutine.length === 0 || cleanTips.length === 0) return null;

  return {
    workout: { dailyRoutine: cleanRoutine },
    diet: {
      meals: {
        breakfast: meals.breakfast,
        lunch: meals.lunch,
        dinner: meals.dinner,
        snacks: meals.snacks,
      },
    },
    tips: cleanTips,
  };
}
