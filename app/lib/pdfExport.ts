import jsPDF from 'jspdf';

export function exportToPDF(userData: any, plan: any) {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.text('AI Fitness Coach - Personalized Plan', 20, 20);
  
  // User Info
  doc.setFontSize(12);
  doc.text(`Name: ${userData.name}`, 20, 40);
  doc.text(`Age: ${userData.age}`, 20, 50);
  doc.text(`Gender: ${userData.gender}`, 20, 60);
  doc.text(`Height: ${userData.height}cm`, 20, 70);
  doc.text(`Weight: ${userData.weight}kg`, 20, 80);
  doc.text(`Goal: ${userData.fitnessGoal}`, 20, 90);
  doc.text(`Level: ${userData.fitnessLevel}`, 20, 100);
  
  // Workout Plan
  doc.text('Workout Plan:', 20, 120);
  let yPos = 130;
  plan.workout.dailyRoutine.forEach((exercise: any, index: number) => {
    doc.text(`${index + 1}. ${exercise.exercise}`, 25, yPos);
    doc.text(`   ${exercise.sets} sets × ${exercise.reps} reps | Rest: ${exercise.rest}`, 25, yPos + 7);
    yPos += 15;
  });
  
  // Diet Plan
  yPos += 10;
  doc.text('Diet Plan:', 20, yPos);
  yPos += 10;
  doc.text(`Breakfast: ${plan.diet.meals.breakfast}`, 25, yPos);
  yPos += 7;
  doc.text(`Lunch: ${plan.diet.meals.lunch}`, 25, yPos);
  yPos += 7;
  doc.text(`Dinner: ${plan.diet.meals.dinner}`, 25, yPos);
  yPos += 7;
  doc.text(`Snacks: ${plan.diet.meals.snacks}`, 25, yPos);
  
  // Tips
  yPos += 15;
  doc.text('AI Tips:', 20, yPos);
  yPos += 10;
  plan.tips.forEach((tip: string, index: number) => {
    doc.text(`${index + 1}. ${tip}`, 25, yPos);
    yPos += 7;
  });
  
  doc.save(`fitness-plan-${userData.name}.pdf`);
}