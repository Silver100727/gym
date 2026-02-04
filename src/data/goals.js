export const GOALS = [
  {
    id: 'beginner',
    title: 'Beginner Friendly',
    description: 'Start your fitness journey with guided support and gradual progression',
    expectedOutcome: 'Build foundational strength and establish healthy habits within 8-12 weeks',
    icon: 'Sparkles',
    programs: ['basic-strength', 'cardio-endurance', 'yoga-recovery']
  },
  {
    id: 'weight-loss',
    title: 'Weight Loss',
    description: 'Burn calories effectively with high-energy workouts and metabolic training',
    expectedOutcome: 'Lose 10-20 lbs in 12 weeks with proper nutrition guidance',
    icon: 'TrendingDown',
    programs: ['cardio-endurance', 'hiit-intensity', 'crossfit']
  },
  {
    id: 'muscle-building',
    title: 'Weight Gain / Muscle Building',
    description: 'Build lean muscle mass with progressive overload training',
    expectedOutcome: 'Gain 5-10 lbs of muscle in 12-16 weeks',
    icon: 'Dumbbell',
    programs: ['strength-training', 'personal-training', 'basic-strength']
  },
  {
    id: 'fat-loss-toning',
    title: 'Fat Loss and Toning',
    description: 'Sculpt and define your physique while reducing body fat percentage',
    expectedOutcome: 'Reduce body fat by 5-8% and achieve visible muscle definition',
    icon: 'Flame',
    programs: ['hiit-intensity', 'crossfit', 'strength-training']
  },
  {
    id: 'hiit-strength',
    title: 'HIIT and Strength Training',
    description: 'Combine high-intensity intervals with strength work for maximum results',
    expectedOutcome: 'Improve cardiovascular fitness and build functional strength',
    icon: 'Zap',
    programs: ['hiit-intensity', 'crossfit', 'strength-training']
  },
  {
    id: 'personal-training',
    title: 'Personal Training',
    description: 'Get customized 1-on-1 coaching tailored to your specific goals',
    expectedOutcome: 'Achieve personalized goals with dedicated expert guidance',
    icon: 'Users',
    programs: ['personal-training']
  },
  {
    id: 'general-fitness',
    title: 'General Fitness',
    description: 'Improve overall health, energy levels, and quality of life',
    expectedOutcome: 'Enhanced stamina, flexibility, and overall wellbeing',
    icon: 'Heart',
    programs: ['cardio-endurance', 'yoga-recovery', 'basic-strength', 'crossfit']
  }
];

export const getGoalById = (id) => GOALS.find(goal => goal.id === id);
