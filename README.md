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

| Name | Required | Notes |
|---|---|---|
| `OPENAI_API_KEY` | No | Server-only. Without it the app uses built-in sample plans. |
| `OPENAI_MODEL` | No | Defaults to `gpt-4o-mini`. |

The OpenAI call runs in `app/api/plan/route.ts` on the server, so the key is never sent to the browser.
On Vercel, add `OPENAI_API_KEY` under Project → Settings → Environment Variables (and remove any old `NEXT_PUBLIC_OPENAI_API_KEY`).

## Tech stack

Next.js (App Router), React, TypeScript, Tailwind CSS, jsPDF.
