export async function generateFitnessPlan(userData: any) {
  // Check if we have a real API key
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  
  if (!apiKey || apiKey === 'your_actual_api_key_here' || apiKey.includes('your_actual_api_key')) {
    console.log('Using mock data - no valid API key found');
    return getMockPlan(userData);
  }

  try {
    console.log('Calling OpenAI API...');
    
    // Add delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'user',
          content: `Create a personalized fitness plan for a ${userData.age} year old ${userData.gender} named ${userData.name}.
          Height: ${userData.height}cm, Weight: ${userData.weight}kg
          Fitness Goal: ${userData.fitnessGoal}
          Fitness Level: ${userData.fitnessLevel}
          
          Provide a brief, practical fitness plan in this JSON format:
          {
            "workout": {
              "dailyRoutine": [
                {"exercise": "string", "sets": 2, "reps": 10, "rest": "30s"}
              ]
            },
            "diet": {
              "meals": {
                "breakfast": "string",
                "lunch": "string", 
                "dinner": "string",
                "snacks": "string"
              }
            },
            "tips": ["string", "string", "string"]
          }`
        }],
        temperature: 0.7,
        max_tokens: 500 // Reduced tokens to avoid limits
      })
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.log('Rate limit hit, using mock data');
        return getMockPlan(userData);
      }
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0]) {
      throw new Error('Invalid API response format');
    }
    
    const aiResponse = data.choices[0].message.content;
    
    console.log('AI Response received');
    
    // Extract JSON from the response
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.log('JSON parse error, using mock data');
      return getMockPlan(userData);
    }
  } catch (error) {
    console.error('AI API Error:', error);
    return getMockPlan(userData);
  }
}

function getMockPlan(userData: any) {
  // Enhanced mock data based on user profile
  let workout = [];
  let diet = {};
  
  // Different workouts based on fitness goal
  if (userData.fitnessGoal === 'weight_loss') {
    workout = [
      { exercise: "Jumping Jacks", sets: 4, reps: 30, rest: "30s" },
      { exercise: "Bodyweight Squats", sets: 3, reps: 15, rest: "45s" },
      { exercise: "Push-ups", sets: 3, reps: 12, rest: "45s" },
      { exercise: "High Knees", sets: 3, reps: 30, rest: "30s" }
    ];
    diet = {
      breakfast: "Oatmeal with mixed berries and a scoop of protein powder",
      lunch: "Large salad with grilled chicken, olive oil dressing",
      dinner: "Baked salmon with steamed vegetables and quinoa",
      snacks: "Apple slices with almond butter, Greek yogurt"
    };
  } else if (userData.fitnessGoal === 'muscle_gain') {
    workout = [
      { exercise: "Push-ups", sets: 4, reps: 12, rest: "60s" },
      { exercise: "Bodyweight Squats", sets: 4, reps: 15, rest: "60s" },
      { exercise: "Plank", sets: 3, reps: 1, rest: "45s" },
      { exercise: "Lunges", sets: 3, reps: 10, rest: "45s" },
      { exercise: "Tricep Dips", sets: 3, reps: 12, rest: "45s" }
    ];
    diet = {
      breakfast: "3 scrambled eggs with whole wheat toast and avocado",
      lunch: "Grilled chicken breast with brown rice and mixed vegetables",
      dinner: "Salmon fillet with sweet potato and broccoli",
      snacks: "Protein shake, Greek yogurt with nuts and honey"
    };
  } else {
    // Maintenance/default - balanced approach
    workout = [
      { exercise: "Push-ups", sets: 3, reps: 15, rest: "60s" },
      { exercise: "Bodyweight Squats", sets: 3, reps: 20, rest: "45s" },
      { exercise: "Plank", sets: 3, reps: 1, rest: "30s" },
      { exercise: "Jumping Jacks", sets: 3, reps: 30, rest: "45s" },
      { exercise: "Glute Bridges", sets: 3, reps: 15, rest: "30s" }
    ];
    diet = {
      breakfast: "Oatmeal with banana, nuts, and a drizzle of honey",
      lunch: "Quinoa bowl with roasted vegetables and chickpeas",
      dinner: "Grilled fish with roasted sweet potatoes and green beans",
      snacks: "Mixed nuts, apple with peanut butter"
    };
  }

  // Different tips based on fitness level
  const baseTips = [
    "Stay hydrated - aim for 8-10 glasses of water daily",
    "Get 7-9 hours of quality sleep for optimal recovery",
    "Consistency is key - even short workouts add up over time"
  ];

  const levelTips = {
    beginner: [
      "Focus on proper form rather than speed or heavy weights",
      "Start slow and gradually increase intensity",
      "Don't compare your progress to others - everyone starts somewhere"
    ],
    intermediate: [
      "Incorporate progressive overload to continue seeing results",
      "Consider tracking your workouts to monitor progress",
      "Mix up your routine every 4-6 weeks to avoid plateaus"
    ],
    advanced: [
      "Pay attention to recovery as much as training intensity",
      "Consider periodization in your training plan",
      "Focus on mobility and injury prevention"
    ]
  };

  const levelSpecificTips = levelTips[userData.fitnessLevel?.toLowerCase()] || levelTips.beginner;

  return {
    workout: {
      dailyRoutine: workout
    },
    diet: {
      meals: diet
    },
    tips: [...baseTips, ...levelSpecificTips, `Remember your goal: ${userData.fitnessGoal.replace('_', ' ')}`]
  };
}