'use client';
import { useState } from 'react';
import UserForm from './components/UserForm';
import VoicePlayer from './components/VoicePlayer';
import { exportToPDF } from './lib/pdfExport';

export default function Home() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<any>(null);

  const handleFormSubmit = async (data: any) => {
    setUserData(data);
    setLoading(true);
    
    try {
      // Import and use the AI function
      const { generateFitnessPlan } = await import('./lib/api');
      const aiPlan = await generateFitnessPlan(data);
      setPlan(aiPlan);
    } catch (error) {
      console.error('Error generating plan:', error);
      // Fallback to mock data
      setPlan(getMockPlan(data));
    } finally {
      setLoading(false);
    }
  };

  // Fallback mock data function
  const getMockPlan = (userData: any) => {
    let workout = [];
    let diet = {};
    
    if (userData.fitnessGoal === 'weight_loss') {
      workout = [
        { exercise: "Cardio: Jumping Jacks", sets: 4, reps: 45, rest: "30s" },
        { exercise: "Bodyweight Squats", sets: 3, reps: 15, rest: "45s" },
        { exercise: "Push-ups", sets: 3, reps: 12, rest: "45s" },
        { exercise: "Plank", sets: 3, reps: 1, rest: "30s" }
      ];
      diet = {
        breakfast: "Oatmeal with berries and protein powder",
        lunch: "Grilled chicken salad with light dressing",
        dinner: "Steamed fish with roasted vegetables",
        snacks: "Apple with almond butter"
      };
    } else if (userData.fitnessGoal === 'muscle_gain') {
      workout = [
        { exercise: "Push-ups", sets: 4, reps: 12, rest: "60s" },
        { exercise: "Bodyweight Squats", sets: 4, reps: 15, rest: "60s" },
        { exercise: "Plank", sets: 3, reps: 1, rest: "45s" },
        { exercise: "Lunges", sets: 3, reps: 10, rest: "45s" }
      ];
      diet = {
        breakfast: "Scrambled eggs with whole wheat toast",
        lunch: "Grilled chicken with quinoa and vegetables",
        dinner: "Salmon with sweet potato and greens",
        snacks: "Greek yogurt with nuts"
      };
    } else {
      // Maintenance/default
      workout = [
        { exercise: "Push-ups", sets: 3, reps: 15, rest: "60s" },
        { exercise: "Bodyweight Squats", sets: 3, reps: 20, rest: "45s" },
        { exercise: "Plank", sets: 3, reps: 1, rest: "30s" },
        { exercise: "Jumping Jacks", sets: 3, reps: 30, rest: "45s" }
      ];
      diet = {
        breakfast: "Oatmeal with fruits and nuts",
        lunch: "Grilled chicken salad with olive oil",
        dinner: "Steamed fish with vegetables",
        snacks: "Greek yogurt and apple"
      };
    }

    return {
      workout: {
        dailyRoutine: workout
      },
      diet: {
        meals: diet
      },
      tips: [
        "Stay hydrated - drink at least 8 glasses of water daily",
        "Get 7-8 hours of sleep for optimal recovery",
        "Consistency is more important than intensity",
        `Focus on your goal: ${userData.fitnessGoal}`,
        "Listen to your body and rest when needed"
      ]
    };
  };

  const resetApp = () => {
    setUserData(null);
    setPlan(null);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🏋️ AI Fitness Coach</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get your personalized workout and diet plan powered by artificial intelligence
          </p>
        </div>
        
        {/* Main Content */}
        {!userData ? (
          <UserForm onSubmit={handleFormSubmit} />
        ) : (
          <div className="max-w-4xl mx-auto">
            {loading ? (
              // Loading State
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Creating Your AI Fitness Plan... ⚡</h2>
                <p className="text-gray-600">Our AI is analyzing your profile and generating a personalized plan...</p>
                <div className="mt-6 space-y-3 max-w-md mx-auto">
                  <div className="h-3 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded-full animate-pulse w-3/4 mx-auto"></div>
                  <div className="h-3 bg-gray-200 rounded-full animate-pulse w-1/2 mx-auto"></div>
                </div>
              </div>
            ) : plan ? (
              // Results State
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header with user info */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
                  <h2 className="text-3xl font-bold mb-2">Welcome, {userData.name}! 🎉</h2>
                  <p className="text-blue-100">Your personalized AI fitness plan is ready</p>
                </div>
                
                <div className="p-6 space-y-8">
                  {/* User Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="font-semibold text-blue-800">Age</div>
                      <div className="text-lg font-bold">{userData.age}</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="font-semibold text-green-800">Goal</div>
                      <div className="text-lg font-bold capitalize">{userData.fitnessGoal.replace('_', ' ')}</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="font-semibold text-purple-800">Level</div>
                      <div className="text-lg font-bold">{userData.fitnessLevel}</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="font-semibold text-orange-800">BMI</div>
                      <div className="text-lg font-bold">
                        {((userData.weight / ((userData.height / 100) ** 2)).toFixed(1))}
                      </div>
                    </div>
                  </div>

                  {/* Workout Plan */}
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      💪 Workout Routine
                    </h3>
                    <div className="space-y-4">
                      {plan.workout.dailyRoutine.map((exercise: any, index: number) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-lg text-gray-800">{exercise.exercise}</h4>
                              <p className="text-gray-600 mt-1">
                                {exercise.sets} sets × {exercise.reps} reps | Rest: {exercise.rest}
                              </p>
                            </div>
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                              {index + 1}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Diet Plan */}
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      🍽️ Diet Plan
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-semibold text-green-800 mb-2">Breakfast</h4>
                        <p className="text-gray-700">{plan.diet.meals.breakfast}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-semibold text-green-800 mb-2">Lunch</h4>
                        <p className="text-gray-700">{plan.diet.meals.lunch}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-semibold text-green-800 mb-2">Dinner</h4>
                        <p className="text-gray-700">{plan.diet.meals.dinner}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-semibold text-green-800 mb-2">Snacks</h4>
                        <p className="text-gray-700">{plan.diet.meals.snacks}</p>
                      </div>
                    </div>
                  </div>

                  {/* AI Tips */}
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      💡 AI Tips & Recommendations
                    </h3>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <ul className="space-y-3">
                        {plan.tips.map((tip: string, index: number) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mt-0.5 flex-shrink-0">
                              {index + 1}
                            </span>
                            <span className="text-gray-700">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 border-t">
                    <VoicePlayer text={
                      `Workout Plan: ${plan.workout.dailyRoutine.map((ex: any) => 
                        `${ex.exercise}: ${ex.sets} sets of ${ex.reps} reps with ${ex.rest} rest`
                      ).join('. ')}. Diet Plan: Breakfast: ${plan.diet.meals.breakfast}. Lunch: ${plan.diet.meals.lunch}. Dinner: ${plan.diet.meals.dinner}. Snacks: ${plan.diet.meals.snacks}. Tips: ${plan.tips.join('. ')}`
                    } />
                    
                    <button 
                      onClick={() => exportToPDF(userData, plan)}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      📄 Export PDF
                    </button>
                    
                    <button 
                      onClick={resetApp}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      🔄 Create New Plan
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
        
        {/* Footer */}
        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>Built with Next.js, TypeScript, Tailwind CSS & OpenAI</p>
          <p className="mt-1">AI Fitness Coach © 2024</p>
        </footer>
      </div>
    </main>
  );
}