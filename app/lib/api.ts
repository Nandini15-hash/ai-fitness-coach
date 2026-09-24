import type { FitnessPlan, UserData } from '../types';
import { getMockPlan, validatePlan } from './mockPlan';

// Browser side: asks our own server route for a plan. No API key here.
export async function generateFitnessPlan(userData: UserData): Promise<FitnessPlan> {
  try {
    const res = await fetch('/api/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error(`Server error: ${res.status}`);

    const data = await res.json();
    return validatePlan(data?.plan) ?? getMockPlan(userData);
  } catch (error) {
    console.error('Error generating plan:', error);
    return getMockPlan(userData);
  }
}
