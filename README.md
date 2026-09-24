# AI Fitness Coach

AI-powered fitness app that generates personalized workout and diet plans.

Live Demo: https://ai-fitness-coach-r49v5h0cu-nandini-m-cs-projects.vercel.app

## Features

- Personalized workout and diet plan from your profile (age, height, weight, goal, level)
- BMI summary
- Read the plan aloud (browser text-to-speech)
- Export the plan as a multi-page PDF

## Run locally

```bash
npm install
cp .env.example .env.local   # then add your OpenAI key
npm run dev
```

Open http://localhost:3000.

## Environment variables

The app works with any OpenAI-compatible provider. Without a key it uses built-in sample plans.

| Name | Notes |
|---|---|
| `AI_API_KEY` | Server-only API key (`OPENAI_API_KEY` also works) |
| `AI_BASE_URL` | Provider URL. Empty = OpenAI |
| `AI_MODEL` | Model ID for that provider |

Free options (no credit card): **Google Gemini** (key from aistudio.google.com) or **Groq** (key from console.groq.com). See `.env.example` for the exact values.

The AI call runs in `app/api/plan/route.ts` on the server, so the key is never sent to the browser.
On Vercel, add the same variables under Project → Settings → Environment Variables.

## Tech stack

Next.js (App Router), React, TypeScript, Tailwind CSS, jsPDF.
