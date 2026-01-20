import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dumbbell,
  Target,
  Flame,
  Zap,
  Heart,
  Home,
  Building2,
  User,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Calendar,
  Clock,
  Sparkles,
} from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

const GOALS = [
  { id: 'muscle', label: 'BUILD MUSCLE', icon: Dumbbell, description: 'Gain strength and size', color: '#ef4444' },
  { id: 'fat_loss', label: 'BURN FAT', icon: Flame, description: 'Lose weight and get lean', color: '#f97316' },
  { id: 'endurance', label: 'ENDURANCE', icon: Heart, description: 'Improve stamina and cardio', color: '#22c55e' },
  { id: 'strength', label: 'GET STRONG', icon: Zap, description: 'Maximize power output', color: '#8b5cf6' },
];

const LEVELS = [
  { id: 'beginner', label: 'BEGINNER', description: '0-6 months training', multiplier: 0.7 },
  { id: 'intermediate', label: 'INTERMEDIATE', description: '6 months - 2 years', multiplier: 1 },
  { id: 'advanced', label: 'ADVANCED', description: '2+ years consistent training', multiplier: 1.3 },
];

const EQUIPMENT = [
  { id: 'gym', label: 'FULL GYM', icon: Building2, description: 'Access to all equipment' },
  { id: 'home', label: 'HOME GYM', icon: Home, description: 'Dumbbells, bench, basics' },
  { id: 'bodyweight', label: 'BODYWEIGHT', icon: User, description: 'No equipment needed' },
];

const DAYS_OPTIONS = [3, 4, 5, 6];

// Exercise database
const EXERCISES = {
  // Chest
  chest_compound: [
    { name: 'Bench Press', equipment: ['gym', 'home'], type: 'compound' },
    { name: 'Incline Dumbbell Press', equipment: ['gym', 'home'], type: 'compound' },
    { name: 'Push-Ups', equipment: ['bodyweight', 'home', 'gym'], type: 'compound' },
    { name: 'Dips', equipment: ['gym', 'home', 'bodyweight'], type: 'compound' },
  ],
  chest_isolation: [
    { name: 'Cable Flyes', equipment: ['gym'], type: 'isolation' },
    { name: 'Dumbbell Flyes', equipment: ['gym', 'home'], type: 'isolation' },
    { name: 'Diamond Push-Ups', equipment: ['bodyweight', 'home', 'gym'], type: 'isolation' },
  ],
  // Back
  back_compound: [
    { name: 'Pull-Ups', equipment: ['gym', 'home', 'bodyweight'], type: 'compound' },
    { name: 'Barbell Rows', equipment: ['gym'], type: 'compound' },
    { name: 'Dumbbell Rows', equipment: ['gym', 'home'], type: 'compound' },
    { name: 'Lat Pulldowns', equipment: ['gym'], type: 'compound' },
  ],
  back_isolation: [
    { name: 'Face Pulls', equipment: ['gym'], type: 'isolation' },
    { name: 'Reverse Flyes', equipment: ['gym', 'home'], type: 'isolation' },
    { name: 'Superman Hold', equipment: ['bodyweight', 'home', 'gym'], type: 'isolation' },
  ],
  // Shoulders
  shoulders: [
    { name: 'Overhead Press', equipment: ['gym', 'home'], type: 'compound' },
    { name: 'Lateral Raises', equipment: ['gym', 'home'], type: 'isolation' },
    { name: 'Pike Push-Ups', equipment: ['bodyweight', 'home', 'gym'], type: 'compound' },
    { name: 'Arnold Press', equipment: ['gym', 'home'], type: 'compound' },
  ],
  // Legs
  legs_compound: [
    { name: 'Barbell Squats', equipment: ['gym'], type: 'compound' },
    { name: 'Goblet Squats', equipment: ['gym', 'home'], type: 'compound' },
    { name: 'Bulgarian Split Squats', equipment: ['gym', 'home', 'bodyweight'], type: 'compound' },
    { name: 'Lunges', equipment: ['gym', 'home', 'bodyweight'], type: 'compound' },
    { name: 'Romanian Deadlifts', equipment: ['gym', 'home'], type: 'compound' },
    { name: 'Hip Thrusts', equipment: ['gym', 'home'], type: 'compound' },
  ],
  legs_isolation: [
    { name: 'Leg Extensions', equipment: ['gym'], type: 'isolation' },
    { name: 'Leg Curls', equipment: ['gym'], type: 'isolation' },
    { name: 'Calf Raises', equipment: ['gym', 'home', 'bodyweight'], type: 'isolation' },
    { name: 'Wall Sit', equipment: ['bodyweight', 'home', 'gym'], type: 'isolation' },
  ],
  // Arms
  biceps: [
    { name: 'Barbell Curls', equipment: ['gym'], type: 'isolation' },
    { name: 'Dumbbell Curls', equipment: ['gym', 'home'], type: 'isolation' },
    { name: 'Chin-Ups', equipment: ['gym', 'home', 'bodyweight'], type: 'compound' },
    { name: 'Hammer Curls', equipment: ['gym', 'home'], type: 'isolation' },
  ],
  triceps: [
    { name: 'Tricep Pushdowns', equipment: ['gym'], type: 'isolation' },
    { name: 'Skull Crushers', equipment: ['gym', 'home'], type: 'isolation' },
    { name: 'Diamond Push-Ups', equipment: ['bodyweight', 'home', 'gym'], type: 'isolation' },
    { name: 'Overhead Extensions', equipment: ['gym', 'home'], type: 'isolation' },
  ],
  // Core
  core: [
    { name: 'Planks', equipment: ['bodyweight', 'home', 'gym'], type: 'isolation' },
    { name: 'Hanging Leg Raises', equipment: ['gym', 'home'], type: 'compound' },
    { name: 'Cable Crunches', equipment: ['gym'], type: 'isolation' },
    { name: 'Mountain Climbers', equipment: ['bodyweight', 'home', 'gym'], type: 'compound' },
    { name: 'Dead Bug', equipment: ['bodyweight', 'home', 'gym'], type: 'isolation' },
  ],
  // Cardio
  cardio: [
    { name: 'Treadmill Intervals', equipment: ['gym'], type: 'cardio' },
    { name: 'Jump Rope', equipment: ['home', 'gym'], type: 'cardio' },
    { name: 'Burpees', equipment: ['bodyweight', 'home', 'gym'], type: 'cardio' },
    { name: 'High Knees', equipment: ['bodyweight', 'home', 'gym'], type: 'cardio' },
    { name: 'Rowing Machine', equipment: ['gym'], type: 'cardio' },
  ],
};

// Workout templates based on days
const SPLIT_TEMPLATES = {
  3: ['full_body', 'full_body', 'full_body'],
  4: ['upper', 'lower', 'upper', 'lower'],
  5: ['push', 'pull', 'legs', 'upper', 'lower'],
  6: ['push', 'pull', 'legs', 'push', 'pull', 'legs'],
};

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function getExercise(category, equipment) {
  const available = EXERCISES[category]?.filter(ex => ex.equipment.includes(equipment)) || [];
  return available[Math.floor(Math.random() * available.length)];
}

function generateWorkout(goal, level, equipment, days) {
  const template = SPLIT_TEMPLATES[days];
  const levelData = LEVELS.find(l => l.id === level);
  const workout = [];

  const dayIndices = days === 3 ? [0, 2, 4] :
                     days === 4 ? [0, 1, 3, 4] :
                     days === 5 ? [0, 1, 2, 4, 5] :
                     [0, 1, 2, 3, 4, 5];

  template.forEach((split, idx) => {
    const dayExercises = [];
    const baseSets = goal === 'strength' ? 5 : goal === 'muscle' ? 4 : 3;
    const baseReps = goal === 'strength' ? '3-5' : goal === 'muscle' ? '8-12' : goal === 'endurance' ? '15-20' : '10-15';

    switch (split) {
      case 'full_body':
        dayExercises.push(
          { ...getExercise('chest_compound', equipment), sets: baseSets, reps: baseReps },
          { ...getExercise('back_compound', equipment), sets: baseSets, reps: baseReps },
          { ...getExercise('legs_compound', equipment), sets: baseSets, reps: baseReps },
          { ...getExercise('shoulders', equipment), sets: baseSets - 1, reps: baseReps },
          { ...getExercise('core', equipment), sets: 3, reps: '12-15' },
        );
        if (goal === 'fat_loss' || goal === 'endurance') {
          dayExercises.push({ ...getExercise('cardio', equipment), sets: 1, reps: '15-20 min' });
        }
        break;
      case 'upper':
        dayExercises.push(
          { ...getExercise('chest_compound', equipment), sets: baseSets, reps: baseReps },
          { ...getExercise('back_compound', equipment), sets: baseSets, reps: baseReps },
          { ...getExercise('shoulders', equipment), sets: baseSets, reps: baseReps },
          { ...getExercise('chest_isolation', equipment), sets: 3, reps: '10-15' },
          { ...getExercise('biceps', equipment), sets: 3, reps: '10-12' },
          { ...getExercise('triceps', equipment), sets: 3, reps: '10-12' },
        );
        break;
      case 'lower':
        dayExercises.push(
          { ...getExercise('legs_compound', equipment), sets: baseSets, reps: baseReps },
          { ...getExercise('legs_compound', equipment), sets: baseSets, reps: baseReps },
          { ...getExercise('legs_compound', equipment), sets: baseSets - 1, reps: baseReps },
          { ...getExercise('legs_isolation', equipment), sets: 3, reps: '12-15' },
          { ...getExercise('core', equipment), sets: 3, reps: '12-15' },
        );
        if (goal === 'fat_loss') {
          dayExercises.push({ ...getExercise('cardio', equipment), sets: 1, reps: '10-15 min' });
        }
        break;
      case 'push':
        dayExercises.push(
          { ...getExercise('chest_compound', equipment), sets: baseSets, reps: baseReps },
          { ...getExercise('shoulders', equipment), sets: baseSets, reps: baseReps },
          { ...getExercise('chest_isolation', equipment), sets: 3, reps: '10-15' },
          { ...getExercise('shoulders', equipment), sets: 3, reps: '12-15' },
          { ...getExercise('triceps', equipment), sets: 3, reps: '10-12' },
          { ...getExercise('triceps', equipment), sets: 3, reps: '10-12' },
        );
        break;
      case 'pull':
        dayExercises.push(
          { ...getExercise('back_compound', equipment), sets: baseSets, reps: baseReps },
          { ...getExercise('back_compound', equipment), sets: baseSets, reps: baseReps },
          { ...getExercise('back_isolation', equipment), sets: 3, reps: '12-15' },
          { ...getExercise('biceps', equipment), sets: 3, reps: '10-12' },
          { ...getExercise('biceps', equipment), sets: 3, reps: '10-12' },
          { ...getExercise('core', equipment), sets: 3, reps: '12-15' },
        );
        break;
      case 'legs':
        dayExercises.push(
          { ...getExercise('legs_compound', equipment), sets: baseSets, reps: baseReps },
          { ...getExercise('legs_compound', equipment), sets: baseSets, reps: baseReps },
          { ...getExercise('legs_compound', equipment), sets: baseSets - 1, reps: baseReps },
          { ...getExercise('legs_isolation', equipment), sets: 3, reps: '12-15' },
          { ...getExercise('legs_isolation', equipment), sets: 3, reps: '15-20' },
          { ...getExercise('core', equipment), sets: 3, reps: '12-15' },
        );
        break;
    }

    workout.push({
      day: DAY_NAMES[dayIndices[idx]],
      focus: split.replace('_', ' ').toUpperCase(),
      exercises: dayExercises.filter(ex => ex && ex.name),
      duration: dayExercises.length * 8 + 10, // Rough estimate
    });
  });

  return workout;
}

function StepIndicator({ currentStep, totalSteps }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[...Array(totalSteps)].map((_, idx) => (
        <div
          key={idx}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            idx < currentStep
              ? 'w-8 bg-primary'
              : idx === currentStep
              ? 'w-8 bg-primary animate-pulse'
              : 'w-4 bg-white/20'
          }`}
        />
      ))}
    </div>
  );
}

function OptionCard({ selected, onClick, children, color }) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative p-6 border text-left transition-all duration-300 ${
        selected
          ? 'border-primary bg-primary/10'
          : 'border-white/10 bg-dark hover:border-white/30'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {selected && (
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{ backgroundColor: color || '#ef4444' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
        />
      )}
      {children}
      {selected && (
        <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-primary" />
      )}
    </motion.button>
  );
}

function WorkoutPlan({ workout, goal, onReset }) {
  const goalData = GOALS.find(g => g.id === goal);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary mb-4"
        >
          <Sparkles className="w-4 h-4" />
          <span className="font-mono text-sm">YOUR PERSONALIZED PLAN</span>
        </motion.div>
        <h3 className="text-2xl font-heading font-black text-white">
          {goalData?.label} PROGRAM
        </h3>
        <p className="text-white/40 text-sm mt-2">
          {workout.length} days per week • Designed for your goals
        </p>
      </div>

      {/* Weekly schedule */}
      <div className="grid gap-4">
        {workout.map((day, idx) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-dark border border-white/10 overflow-hidden"
          >
            {/* Day header */}
            <div
              className="px-5 py-4 border-b border-white/5 flex items-center justify-between"
              style={{ backgroundColor: `${goalData?.color}10` }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-sm flex items-center justify-center"
                  style={{ backgroundColor: goalData?.color }}
                >
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-white">{day.day}</h4>
                  <p className="text-xs font-mono text-white/40">{day.focus}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-white/40">
                <Clock className="w-4 h-4" />
                <span className="font-mono text-sm">~{day.duration} min</span>
              </div>
            </div>

            {/* Exercises */}
            <div className="p-4">
              <div className="grid gap-2">
                {day.exercises.map((exercise, exIdx) => (
                  <div
                    key={`${exercise.name}-${exIdx}`}
                    className="flex items-center justify-between py-2 px-3 bg-white/5 rounded-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-mono text-white/60">
                        {exIdx + 1}
                      </span>
                      <span className="text-white text-sm">{exercise.name}</span>
                    </div>
                    <span className="font-mono text-xs text-primary">
                      {exercise.sets} × {exercise.reps}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Regenerate button */}
      <motion.button
        onClick={onReset}
        className="w-full py-4 border border-white/10 text-white/50 hover:text-white hover:border-white/30 font-mono text-sm flex items-center justify-center gap-2 transition-colors"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <RotateCcw className="w-4 h-4" />
        GENERATE NEW PLAN
      </motion.button>
    </motion.div>
  );
}

export default function WorkoutGenerator() {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState(null);
  const [level, setLevel] = useState(null);
  const [equipment, setEquipment] = useState(null);
  const [days, setDays] = useState(null);
  const [workout, setWorkout] = useState(null);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Generate workout
      const plan = generateWorkout(goal, level, equipment, days);
      setWorkout(plan);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleReset = () => {
    setStep(0);
    setGoal(null);
    setLevel(null);
    setEquipment(null);
    setDays(null);
    setWorkout(null);
  };

  const canProceed = () => {
    switch (step) {
      case 0: return goal !== null;
      case 1: return level !== null;
      case 2: return equipment !== null;
      case 3: return days !== null;
      default: return false;
    }
  };

  const stepTitles = [
    { title: "WHAT'S YOUR GOAL?", subtitle: 'Select your primary fitness objective' },
    { title: 'EXPERIENCE LEVEL?', subtitle: 'This helps us calibrate intensity' },
    { title: 'AVAILABLE EQUIPMENT?', subtitle: "We'll customize exercises accordingly" },
    { title: 'DAYS PER WEEK?', subtitle: 'How often can you train?' },
  ];

  return (
    <section className="py-20 lg:py-32 bg-dark relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(45deg, white 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Glow orb */}
      <div className="absolute top-1/3 -right-32 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center mb-12">
            <span className="font-mono text-primary text-xs tracking-widest">
              [ AI-POWERED ]
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-white mt-4">
              WORKOUT
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                {' '}GENERATOR
              </span>
            </h2>
            <p className="text-white/40 mt-4 max-w-xl mx-auto">
              Answer a few questions and get a personalized workout plan tailored to your goals, experience, and equipment.
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <div className="bg-dark-lighter border border-white/10 p-6 sm:p-8">
              {workout ? (
                <WorkoutPlan workout={workout} goal={goal} onReset={handleReset} />
              ) : (
                <>
                  <StepIndicator currentStep={step} totalSteps={4} />

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Step title */}
                      <div className="text-center mb-8">
                        <h3 className="text-xl sm:text-2xl font-heading font-bold text-white">
                          {stepTitles[step].title}
                        </h3>
                        <p className="text-white/40 text-sm mt-2">
                          {stepTitles[step].subtitle}
                        </p>
                      </div>

                      {/* Step 0: Goals */}
                      {step === 0 && (
                        <div className="grid sm:grid-cols-2 gap-4">
                          {GOALS.map((g) => (
                            <OptionCard
                              key={g.id}
                              selected={goal === g.id}
                              onClick={() => setGoal(g.id)}
                              color={g.color}
                            >
                              <g.icon className="w-8 h-8 mb-3" style={{ color: g.color }} />
                              <h4 className="font-heading font-bold text-white text-lg">{g.label}</h4>
                              <p className="text-white/40 text-sm mt-1">{g.description}</p>
                            </OptionCard>
                          ))}
                        </div>
                      )}

                      {/* Step 1: Level */}
                      {step === 1 && (
                        <div className="grid gap-4">
                          {LEVELS.map((l) => (
                            <OptionCard
                              key={l.id}
                              selected={level === l.id}
                              onClick={() => setLevel(l.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-heading font-bold text-white text-lg">{l.label}</h4>
                                  <p className="text-white/40 text-sm mt-1">{l.description}</p>
                                </div>
                                <div className="flex gap-1">
                                  {[...Array(3)].map((_, idx) => (
                                    <div
                                      key={idx}
                                      className={`w-3 h-8 rounded-sm ${
                                        idx < (l.id === 'beginner' ? 1 : l.id === 'intermediate' ? 2 : 3)
                                          ? 'bg-primary'
                                          : 'bg-white/10'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </OptionCard>
                          ))}
                        </div>
                      )}

                      {/* Step 2: Equipment */}
                      {step === 2 && (
                        <div className="grid gap-4">
                          {EQUIPMENT.map((e) => (
                            <OptionCard
                              key={e.id}
                              selected={equipment === e.id}
                              onClick={() => setEquipment(e.id)}
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/20 rounded-sm flex items-center justify-center">
                                  <e.icon className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                  <h4 className="font-heading font-bold text-white text-lg">{e.label}</h4>
                                  <p className="text-white/40 text-sm mt-1">{e.description}</p>
                                </div>
                              </div>
                            </OptionCard>
                          ))}
                        </div>
                      )}

                      {/* Step 3: Days */}
                      {step === 3 && (
                        <div className="grid grid-cols-4 gap-4">
                          {DAYS_OPTIONS.map((d) => (
                            <OptionCard
                              key={d}
                              selected={days === d}
                              onClick={() => setDays(d)}
                            >
                              <div className="text-center">
                                <span className="text-4xl font-heading font-black text-white">{d}</span>
                                <p className="text-white/40 text-sm mt-1">DAYS</p>
                              </div>
                            </OptionCard>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                    <button
                      onClick={handleBack}
                      disabled={step === 0}
                      className={`flex items-center gap-2 px-4 py-2 font-mono text-sm transition-all ${
                        step === 0
                          ? 'text-white/20 cursor-not-allowed'
                          : 'text-white/50 hover:text-white'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      BACK
                    </button>

                    <button
                      onClick={handleNext}
                      disabled={!canProceed()}
                      className={`flex items-center gap-2 px-6 py-3 font-heading font-bold text-sm transition-all ${
                        canProceed()
                          ? 'bg-primary text-white hover:bg-primary-dark'
                          : 'bg-white/10 text-white/30 cursor-not-allowed'
                      }`}
                    >
                      {step === 3 ? 'GENERATE PLAN' : 'NEXT'}
                      {step === 3 ? <Sparkles className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Bottom text */}
          <motion.p variants={fadeUp} className="text-center text-white/30 text-sm mt-6">
            Plans are generated based on proven training principles and your selections
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
