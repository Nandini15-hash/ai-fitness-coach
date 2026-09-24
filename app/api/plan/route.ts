import { NextResponse } from 'next/server';
import { getMockPlan, validatePlan } from '../../lib/mockPlan';
import type { UserData } from '../../types';

// Runs on the server only. The API key (no NEXT_PUBLIC_ prefix) is never
// sent to the browser.
//
// Works with any OpenAI-compatible provider:
//   Gemini (free): AI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai
//   Groq (free):   AI_BASE_URL=https://api.groq.com/openai/v1
//   OpenAI (paid): leave AI_BASE_URL empty
export async function POST(req: Request) {
  let userData: UserData;
  try {
    userData = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const invalid =
    !userData?.name ||
    !(userData.age > 0) ||
    !(userData.height > 0) ||
    !(userData.weight > 0) ||
    !userData.fitnessGoal ||
    !userData.fitnessLevel;
  if (invalid) {
    return NextResponse.json({ error: 'Missing or invalid profile fields' }, { status: 400 });
  }

  const apiKey = process.env.AI_API_KEY || process.env.OPENAI_API_KEY;
  const baseUrl = (process.env.AI_BASE_URL || 'https://api.openai.com/v1').replace(/\/+$/, '');
  const model = process.env.AI_MODEL || process.env.OPENAI_MODEL || 'gpt-4o-mini';
  if (!apiKey) {
    return NextResponse.json({ plan: getMockPlan(userData), source: 'mock' });
  }

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        max_tokens: 2000,
        messages: [
          {
            role: 'system',
            content: 'You are a fitness coach. Reply with a single JSON object only.',
          },
          {
            role: 'user',
            content: `Create a personalized fitness plan for a ${userData.age} year old ${userData.gender} named ${userData.name}.
Height: ${userData.height}cm, Weight: ${userData.weight}kg
Fitness Goal: ${userData.fitnessGoal.replace(/_/g, ' ')}
Fitness Level: ${userData.fitnessLevel}

Use exactly this JSON shape (sets and reps are numbers):
{
  "workout": { "dailyRoutine": [ {"exercise": "string", "sets": 3, "reps": 10, "rest": "30s"} ] },
  "diet": { "meals": { "breakfast": "string", "lunch": "string", "dinner": "string", "snacks": "string" } },
  "tips": ["string", "string", "string"]
}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => null);
      console.error(
        `AI provider error ${response.status}: ${errBody?.error?.code ?? errBody?.error?.type ?? 'unknown'} - ${errBody?.error?.message ?? response.statusText}`
      );
      return NextResponse.json({ plan: getMockPlan(userData), source: 'mock' });
    }

    const data = await response.json();
    const content: string = data?.choices?.[0]?.message?.content ?? '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const plan = jsonMatch ? validatePlan(JSON.parse(jsonMatch[0])) : null;

    if (!plan) {
      console.error('AI response missing required fields, using mock plan');
      return NextResponse.json({ plan: getMockPlan(userData), source: 'mock' });
    }

    return NextResponse.json({ plan, source: 'ai' });
  } catch (error) {
    console.error('AI API Error:', error);
    return NextResponse.json({ plan: getMockPlan(userData), source: 'mock' });
  }
}
