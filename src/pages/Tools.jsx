import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageLayout from '../layouts/PageLayout';
import { Button } from '@/components/ui/button';
import {
  Calculator,
  Activity,
  Calendar,
  Timer,
  BookOpen,
  Dumbbell,
  ArrowLeft,
  ArrowUpRight,
} from 'lucide-react';
import BMICalculator from '../sections/BMICalculator';
import MuscleExplorer from '../sections/MuscleExplorer';
import WorkoutGenerator from '../sections/WorkoutGenerator';
import CalorieBurnVisualizer from '../sections/CalorieBurnVisualizer';
import WaterIntakeTracker from '../sections/WaterIntakeTracker';
import FitnessQuiz from '../sections/FitnessQuiz';
import MacroCalculator from '../sections/MacroCalculator';
import HeartRateZones from '../sections/HeartRateZones';
import OneRepMaxCalculator from '../sections/OneRepMaxCalculator';
import BodyFatEstimator from '../sections/BodyFatEstimator';
import StretchingRoutine from '../sections/StretchingRoutine';
import ProgressComparison from '../sections/ProgressComparison';
import GymBagChecklist from '../sections/GymBagChecklist';
import RestTimer from '../sections/RestTimer';
import PlateCalculator from '../sections/PlateCalculator';
import SleepCalculator from '../sections/SleepCalculator';
import WorkoutBPM from '../sections/WorkoutBPM';
import ExerciseSubstitutions from '../sections/ExerciseSubstitutions';
import BreathingExercises from '../sections/BreathingExercises';
import WorkoutSplitPlanner from '../sections/WorkoutSplitPlanner';
import RunningPaceCalculator from '../sections/RunningPaceCalculator';
import MuscleRecoveryTracker from '../sections/MuscleRecoveryTracker';
import FitnessChallengeGenerator from '../sections/FitnessChallengeGenerator';
import RepTempoCalculator from '../sections/RepTempoCalculator';
import WorkoutVolumeCalculator from '../sections/WorkoutVolumeCalculator';
import SupplementTimingGuide from '../sections/SupplementTimingGuide';
import GripStrengthGuide from '../sections/GripStrengthGuide';
import RPECalculator from '../sections/RPECalculator';
import FitnessUnitConverter from '../sections/FitnessUnitConverter';
import MotivationGenerator from '../sections/MotivationGenerator';
import TDEECalculator from '../sections/TDEECalculator';
import IdealWeightCalculator from '../sections/IdealWeightCalculator';
import FitnessAgeCalculator from '../sections/FitnessAgeCalculator';
import BodyMeasurementsTracker from '../sections/BodyMeasurementsTracker';
import PersonalRecordsTracker from '../sections/PersonalRecordsTracker';
import TabataTimer from '../sections/TabataTimer';
import WarmupGenerator from '../sections/WarmupGenerator';
import CooldownRoutine from '../sections/CooldownRoutine';
import MealPrepPlanner from '../sections/MealPrepPlanner';
import WorkoutLog from '../sections/WorkoutLog';
import FitnessGoalSetter from '../sections/FitnessGoalSetter';
import ExerciseFormGuide from '../sections/ExerciseFormGuide';
import GymEtiquetteTips from '../sections/GymEtiquetteTips';
import HomeGymGuide from '../sections/HomeGymGuide';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const toolCategories = [
  {
    id: 'calculators',
    title: 'Calculators',
    description: 'BMI, TDEE, macros, and more fitness calculations',
    icon: Calculator,
    accent: '#3b82f6',
    tools: [
      { id: 'bmi', name: 'BMI Calculator', description: 'Calculate your Body Mass Index', Component: BMICalculator },
      { id: 'tdee', name: 'TDEE Calculator', description: 'Total Daily Energy Expenditure', Component: TDEECalculator },
      { id: 'macro', name: 'Macro Calculator', description: 'Calculate your macronutrient needs', Component: MacroCalculator },
      { id: '1rm', name: 'One Rep Max', description: 'Estimate your maximum lift', Component: OneRepMaxCalculator },
      { id: 'bodyfat', name: 'Body Fat Estimator', description: 'Estimate your body fat percentage', Component: BodyFatEstimator },
      { id: 'idealweight', name: 'Ideal Weight', description: 'Calculate your ideal body weight', Component: IdealWeightCalculator },
      { id: 'fitnessage', name: 'Fitness Age', description: 'Discover your fitness age', Component: FitnessAgeCalculator },
      { id: 'pace', name: 'Running Pace', description: 'Calculate your running pace', Component: RunningPaceCalculator },
      { id: 'tempo', name: 'Rep Tempo', description: 'Time under tension calculator', Component: RepTempoCalculator },
      { id: 'volume', name: 'Workout Volume', description: 'Track your training volume', Component: WorkoutVolumeCalculator },
      { id: 'rpe', name: 'RPE Calculator', description: 'Rate of Perceived Exertion', Component: RPECalculator },
      { id: 'converter', name: 'Unit Converter', description: 'Convert fitness units', Component: FitnessUnitConverter },
    ],
  },
  {
    id: 'trackers',
    title: 'Trackers',
    description: 'Track your progress, measurements, and records',
    icon: Activity,
    accent: '#10b981',
    tools: [
      { id: 'water', name: 'Water Intake', description: 'Track daily hydration', Component: WaterIntakeTracker },
      { id: 'progress', name: 'Progress Comparison', description: 'Compare your progress over time', Component: ProgressComparison },
      { id: 'measurements', name: 'Body Measurements', description: 'Track body measurements', Component: BodyMeasurementsTracker },
      { id: 'prs', name: 'Personal Records', description: 'Track your PRs', Component: PersonalRecordsTracker },
      { id: 'recovery', name: 'Muscle Recovery', description: 'Track muscle recovery status', Component: MuscleRecoveryTracker },
      { id: 'log', name: 'Workout Log', description: 'Log your workouts', Component: WorkoutLog },
    ],
  },
  {
    id: 'planners',
    title: 'Planners',
    description: 'Workout plans, meal prep, and fitness goals',
    icon: Calendar,
    accent: '#a855f7',
    tools: [
      { id: 'workout-gen', name: 'Workout Generator', description: 'Generate custom workouts', Component: WorkoutGenerator },
      { id: 'split', name: 'Split Planner', description: 'Plan your workout split', Component: WorkoutSplitPlanner },
      { id: 'challenge', name: 'Challenge Generator', description: 'Create fitness challenges', Component: FitnessChallengeGenerator },
      { id: 'warmup', name: 'Warmup Generator', description: 'Generate warmup routines', Component: WarmupGenerator },
      { id: 'meal', name: 'Meal Prep Planner', description: 'Plan your meals', Component: MealPrepPlanner },
      { id: 'goals', name: 'Goal Setter', description: 'Set and track fitness goals', Component: FitnessGoalSetter },
    ],
  },
  {
    id: 'timers',
    title: 'Timers',
    description: 'Rest timers, tabata, and interval training',
    icon: Timer,
    accent: '#f97316',
    tools: [
      { id: 'rest', name: 'Rest Timer', description: 'Time your rest periods', Component: RestTimer },
      { id: 'tabata', name: 'Tabata Timer', description: 'HIIT interval timer', Component: TabataTimer },
    ],
  },
  {
    id: 'guides',
    title: 'Guides',
    description: 'Exercise guides, routines, and fitness tips',
    icon: BookOpen,
    accent: '#6366f1',
    tools: [
      { id: 'muscle', name: 'Muscle Explorer', description: 'Learn about muscle groups', Component: MuscleExplorer },
      { id: 'stretch', name: 'Stretching Routine', description: 'Guided stretching routines', Component: StretchingRoutine },
      { id: 'substitutions', name: 'Exercise Substitutions', description: 'Find exercise alternatives', Component: ExerciseSubstitutions },
      { id: 'breathing', name: 'Breathing Exercises', description: 'Guided breathing techniques', Component: BreathingExercises },
      { id: 'supplements', name: 'Supplement Timing', description: 'Optimize supplement intake', Component: SupplementTimingGuide },
      { id: 'grip', name: 'Grip Strength Guide', description: 'Improve your grip', Component: GripStrengthGuide },
      { id: 'form', name: 'Exercise Form Guide', description: 'Perfect your form', Component: ExerciseFormGuide },
      { id: 'etiquette', name: 'Gym Etiquette', description: 'Gym rules and tips', Component: GymEtiquetteTips },
      { id: 'homegym', name: 'Home Gym Guide', description: 'Build your home gym', Component: HomeGymGuide },
      { id: 'cooldown', name: 'Cooldown Routine', description: 'Post-workout cooldown', Component: CooldownRoutine },
    ],
  },
  {
    id: 'tools',
    title: 'Utilities',
    description: 'Plate calculator, BPM matcher, and more',
    icon: Dumbbell,
    accent: '#eab308',
    tools: [
      { id: 'calorie-burn', name: 'Calorie Burn Visualizer', description: 'Visualize calories burned', Component: CalorieBurnVisualizer },
      { id: 'quiz', name: 'Fitness Quiz', description: 'Test your fitness knowledge', Component: FitnessQuiz },
      { id: 'hr-zones', name: 'Heart Rate Zones', description: 'Calculate training zones', Component: HeartRateZones },
      { id: 'gymbag', name: 'Gym Bag Checklist', description: 'Never forget your gear', Component: GymBagChecklist },
      { id: 'plates', name: 'Plate Calculator', description: 'Calculate barbell plates', Component: PlateCalculator },
      { id: 'sleep', name: 'Sleep Calculator', description: 'Optimize your sleep', Component: SleepCalculator },
      { id: 'bpm', name: 'Workout BPM', description: 'Match music to workout', Component: WorkoutBPM },
      { id: 'motivation', name: 'Motivation Generator', description: 'Get motivated', Component: MotivationGenerator },
    ],
  },
];

function CategoryCard({ category, onClick, index }) {
  const Icon = category.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onClick}
      className="group relative cursor-pointer"
    >
      {/* Main card */}
      <div className="relative overflow-hidden bg-zinc-900/80 border border-zinc-800 p-6 h-full transition-all duration-500 group-hover:border-zinc-700 group-hover:bg-zinc-900">
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500"
          style={{ backgroundColor: category.accent }}
        />

        {/* Number */}
        <span
          className="absolute top-4 right-4 text-[80px] font-bold leading-none opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 select-none"
          style={{ color: category.accent }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Icon */}
        <div className="relative mb-6">
          <div
            className="w-11 h-11 flex items-center justify-center border transition-all duration-500 group-hover:border-transparent"
            style={{
              borderColor: `${category.accent}40`,
              backgroundColor: 'transparent'
            }}
          >
            <Icon
              className="w-5 h-5 transition-colors duration-500"
              style={{ color: category.accent }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="relative">
          <h3 className="text-lg font-semibold text-white mb-2 tracking-tight">
            {category.title}
          </h3>
          <p className="text-sm text-zinc-500 leading-relaxed mb-4">
            {category.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
            <span className="text-xs text-zinc-600 uppercase tracking-wider">
              {category.tools.length} tools
            </span>
            <ArrowUpRight
              className="w-4 h-4 text-zinc-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
              style={{ color: category.accent }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ToolCard({ tool, accent, onClick, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={onClick}
      className="group relative cursor-pointer"
    >
      <div className="relative bg-zinc-900/60 border border-zinc-800/80 p-5 transition-all duration-300 group-hover:bg-zinc-900 group-hover:border-zinc-700">
        {/* Left accent */}
        <div
          className="absolute left-0 top-0 w-[2px] h-0 group-hover:h-full transition-all duration-300"
          style={{ backgroundColor: accent }}
        />

        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-white mb-1 truncate group-hover:text-white/90">
              {tool.name}
            </h4>
            <p className="text-xs text-zinc-500 line-clamp-2">
              {tool.description}
            </p>
          </div>
          <ArrowUpRight
            className="w-4 h-4 flex-shrink-0 text-zinc-700 group-hover:text-zinc-500 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function Tools() {
  const prefersReducedMotion = useReducedMotion();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);
  const toolRef = useRef(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedTool(null);
  };

  const handleToolClick = (tool) => {
    setSelectedTool(tool);
    setTimeout(() => {
      toolRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleBack = () => {
    if (selectedTool) {
      setSelectedTool(null);
    } else {
      setSelectedCategory(null);
    }
  };

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-2">
            <motion.p
              className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-4"
              initial={prefersReducedMotion ? undefined : { opacity: 0 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              Resources
            </motion.p>
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4"
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Fitness Tools
            </motion.h1>
            <motion.div
              className="w-16 h-[2px] bg-primary"
              initial={prefersReducedMotion ? undefined : { width: 0 }}
              animate={prefersReducedMotion ? undefined : { width: 64 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
          </div>

          {/* Back Button */}
          <AnimatePresence mode="wait">
            {(selectedCategory || selectedTool) && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="mb-10"
              >
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="text-zinc-400 hover:text-white hover:bg-zinc-800/50 px-0 gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm">
                    {selectedTool ? selectedCategory.title : 'All categories'}
                  </span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content */}
          <AnimatePresence mode="wait">
            {!selectedCategory && (
              <motion.div
                key="categories"
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {toolCategories.map((category, index) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    index={index}
                    onClick={() => handleCategoryClick(category)}
                  />
                ))}
              </motion.div>
            )}

            {selectedCategory && !selectedTool && (
              <motion.div
                key="tools"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-10 pb-6 border-b border-zinc-800">
                  <div
                    className="w-10 h-10 flex items-center justify-center border"
                    style={{ borderColor: `${selectedCategory.accent}40` }}
                  >
                    <selectedCategory.icon
                      className="w-5 h-5"
                      style={{ color: selectedCategory.accent }}
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                      {selectedCategory.title}
                    </h2>
                    <p className="text-sm text-zinc-500">
                      {selectedCategory.tools.length} tools available
                    </p>
                  </div>
                </div>

                {/* Tools Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {selectedCategory.tools.map((tool, index) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      accent={selectedCategory.accent}
                      index={index}
                      onClick={() => handleToolClick(tool)}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Selected Tool Component */}
      <AnimatePresence>
        {selectedTool && (
          <motion.div
            ref={toolRef}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.4 }}
          >
            <selectedTool.Component />
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}
