import jsPDF from 'jspdf';
import type { FitnessPlan, UserData } from '../types';

const LEFT = 20;
const TOP = 20;
const LINE = 7;

const pretty = (s: string) => s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export function exportToPDF(userData: UserData, plan: FitnessPlan) {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const bottom = pageHeight - 20;
  let y = TOP;

  // Start a new page if the next `needed` mm won't fit.
  const ensureSpace = (needed: number) => {
    if (y + needed > bottom) {
      doc.addPage();
      y = TOP;
    }
  };

  // Writes text that wraps to the page width and breaks across pages.
  const write = (text: string, indent = 0, size = 12) => {
    doc.setFontSize(size);
    const lines: string[] = doc.splitTextToSize(text, pageWidth - LEFT * 2 - indent);
    const lineHeight = size === 12 ? LINE : size * 0.45;
    lines.forEach((line) => {
      ensureSpace(lineHeight);
      doc.text(line, LEFT + indent, y);
      y += lineHeight;
    });
  };

  const heading = (text: string) => {
    y += 6;
    ensureSpace(LINE * 3); // keep a heading with at least a couple of lines under it
    doc.setFont('helvetica', 'bold');
    write(text, 0, 14);
    doc.setFont('helvetica', 'normal');
    y += 2;
  };

  // Title
  doc.setFont('helvetica', 'bold');
  write('AI Fitness Coach - Personalized Plan', 0, 20);
  doc.setFont('helvetica', 'normal');
  y += 4;

  // User info
  write(`Name: ${userData.name}`);
  write(`Age: ${userData.age}`);
  write(`Gender: ${pretty(userData.gender)}`);
  write(`Height: ${userData.height} cm`);
  write(`Weight: ${userData.weight} kg`);
  write(`Goal: ${pretty(userData.fitnessGoal)}`);
  write(`Level: ${pretty(userData.fitnessLevel)}`);

  heading('Workout Plan');
  plan.workout.dailyRoutine.forEach((ex, i) => {
    ensureSpace(LINE * 2); // keep exercise name and its details together
    write(`${i + 1}. ${ex.exercise}`, 5);
    write(`${ex.sets} sets x ${ex.reps} reps | Rest: ${ex.rest}`, 10);
    y += 1;
  });

  heading('Diet Plan');
  write(`Breakfast: ${plan.diet.meals.breakfast}`, 5);
  write(`Lunch: ${plan.diet.meals.lunch}`, 5);
  write(`Dinner: ${plan.diet.meals.dinner}`, 5);
  write(`Snacks: ${plan.diet.meals.snacks}`, 5);

  heading('AI Tips');
  plan.tips.forEach((tip, i) => write(`${i + 1}. ${tip}`, 5));

  const safeName = userData.name.replace(/[^a-z0-9_-]+/gi, '_') || 'plan';
  doc.save(`fitness-plan-${safeName}.pdf`);
}
