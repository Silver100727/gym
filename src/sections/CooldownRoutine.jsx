import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, ChevronRight, Clock, RotateCcw, Check, Sparkles } from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

const COOLDOWN_EXERCISES = [
  {
    name: 'Deep Breathing',
    duration: '60 sec',
    description: 'Slow, deep breaths. Inhale 4 sec, hold 4 sec, exhale 6 sec.',
    category: 'breathing',
    targetArea: 'Recovery',
  },
  {
    name: 'Standing Forward Fold',
    duration: '45 sec',
    description: 'Feet hip-width apart, hinge at hips, let arms hang. Relax neck.',
    category: 'stretch',
    targetArea: 'Hamstrings, Lower Back',
  },
  {
    name: 'Quad Stretch',
    duration: '30 sec each',
    description: 'Stand on one leg, grab ankle behind you. Keep knees together.',
    category: 'stretch',
    targetArea: 'Quadriceps',
  },
  {
    name: 'Hip Flexor Stretch',
    duration: '45 sec each',
    description: 'Kneeling lunge position, push hips forward gently.',
    category: 'stretch',
    targetArea: 'Hip Flexors',
  },
  {
    name: 'Pigeon Pose',
    duration: '60 sec each',
    description: 'Front leg bent, back leg extended. Fold forward for deeper stretch.',
    category: 'stretch',
    targetArea: 'Glutes, Hips',
  },
  {
    name: 'Seated Spinal Twist',
    duration: '30 sec each',
    description: 'Sit tall, twist to each side. Use opposite hand on knee.',
    category: 'stretch',
    targetArea: 'Spine, Obliques',
  },
  {
    name: 'Child\'s Pose',
    duration: '60 sec',
    description: 'Knees wide, sit back on heels, arms extended. Breathe deeply.',
    category: 'stretch',
    targetArea: 'Back, Shoulders',
  },
  {
    name: 'Cat-Cow Stretch',
    duration: '10 reps',
    description: 'Alternate between arching and rounding spine. Move with breath.',
    category: 'mobility',
    targetArea: 'Spine',
  },
  {
    name: 'Shoulder Stretch',
    duration: '30 sec each',
    description: 'Cross arm across body, use opposite hand to deepen stretch.',
    category: 'stretch',
    targetArea: 'Shoulders, Upper Back',
  },
  {
    name: 'Chest Doorway Stretch',
    duration: '30 sec each',
    description: 'Arm on door frame at 90°, lean through doorway.',
    category: 'stretch',
    targetArea: 'Chest, Front Delt',
  },
  {
    name: 'Neck Rolls',
    duration: '30 sec',
    description: 'Gentle circles, don\'t force range of motion. Both directions.',
    category: 'mobility',
    targetArea: 'Neck',
  },
  {
    name: 'Lying Spinal Twist',
    duration: '45 sec each',
    description: 'On back, drop knees to one side. Look opposite direction.',
    category: 'stretch',
    targetArea: 'Lower Back, Spine',
  },
  {
    name: 'Figure Four Stretch',
    duration: '45 sec each',
    description: 'On back, ankle on opposite knee. Pull thigh toward chest.',
    category: 'stretch',
    targetArea: 'Glutes, Piriformis',
  },
  {
    name: 'Calf Stretch',
    duration: '30 sec each',
    description: 'Against wall, one foot back, heel down. Lean forward.',
    category: 'stretch',
    targetArea: 'Calves',
  },
  {
    name: 'Corpse Pose (Savasana)',
    duration: '2 min',
    description: 'Lie flat, arms at sides, palms up. Complete relaxation.',
    category: 'relaxation',
    targetArea: 'Full Body',
  },
];

const CATEGORIES = {
  breathing: { color: 'text-blue-400', bg: 'bg-blue-500/20' },
  stretch: { color: 'text-green-400', bg: 'bg-green-500/20' },
  mobility: { color: 'text-purple-400', bg: 'bg-purple-500/20' },
  relaxation: { color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
};

export default function CooldownRoutine() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);

  const exercise = COOLDOWN_EXERCISES[currentStep];
  const totalTime = 15; // Approximately 15 minutes

  const startRoutine = () => {
    setIsStarted(true);
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  const nextExercise = () => {
    setCompletedSteps(prev => [...prev, currentStep]);
    if (currentStep < COOLDOWN_EXERCISES.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevExercise = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const reset = () => {
    setIsStarted(false);
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  const isComplete = completedSteps.length === COOLDOWN_EXERCISES.length;

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="container mx-auto px-4 relative z-10"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-4">
            <Wind className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium">Post-Workout</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Cool-down <span className="text-primary">Routine</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Essential stretches and relaxation exercises for optimal recovery
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {!isStarted ? (
              // Preview Mode
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl p-6 border border-zinc-800 mb-6">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-white">{COOLDOWN_EXERCISES.length}</p>
                      <p className="text-gray-500 text-sm">Exercises</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-primary">~{totalTime}</p>
                      <p className="text-gray-500 text-sm">Minutes</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-white">Full</p>
                      <p className="text-gray-500 text-sm">Body</p>
                    </div>
                  </div>

                  {/* Exercise List */}
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    {COOLDOWN_EXERCISES.map((ex, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="flex items-center gap-3 bg-zinc-800/50 rounded-xl p-3"
                      >
                        <div className={`w-8 h-8 ${CATEGORIES[ex.category].bg} rounded-lg flex items-center justify-center ${CATEGORIES[ex.category].color} text-sm font-bold`}>
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{ex.name}</p>
                          <p className="text-gray-500 text-xs">{ex.targetArea}</p>
                        </div>
                        <span className="text-gray-400 text-sm">{ex.duration}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <motion.button
                  onClick={startRoutine}
                  className="w-full py-4 bg-primary hover:bg-primary/90 text-black rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Wind className="w-5 h-5" />
                  Start Cool-down
                </motion.button>
              </motion.div>
            ) : isComplete ? (
              // Completion Screen
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="bg-gradient-to-br from-green-500/20 via-teal-500/10 to-cyan-500/10 rounded-3xl p-12 border border-green-500/30 mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.5 }}
                    className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <Sparkles className="w-12 h-12 text-green-400" />
                  </motion.div>
                  <h3 className="text-3xl font-bold text-white mb-2">Cool-down Complete!</h3>
                  <p className="text-gray-400 mb-6">
                    Great job! Your muscles will thank you tomorrow.
                  </p>
                  <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                    <div className="bg-black/30 rounded-xl p-4">
                      <p className="text-2xl font-bold text-white">{COOLDOWN_EXERCISES.length}</p>
                      <p className="text-gray-500 text-sm">Exercises</p>
                    </div>
                    <div className="bg-black/30 rounded-xl p-4">
                      <p className="text-2xl font-bold text-primary">~{totalTime} min</p>
                      <p className="text-gray-500 text-sm">Total Time</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={reset}
                  className="py-4 px-8 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-all"
                >
                  Start Over
                </button>
              </motion.div>
            ) : (
              // Active Routine
              <motion.div
                key="active"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Exercise {currentStep + 1} of {COOLDOWN_EXERCISES.length}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {exercise.duration}
                    </span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      animate={{ width: `${((currentStep + 1) / COOLDOWN_EXERCISES.length) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* Step Indicators */}
                <div className="flex justify-center gap-1 mb-6 flex-wrap">
                  {COOLDOWN_EXERCISES.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-3 h-3 rounded-full transition-all ${
                        completedSteps.includes(idx)
                          ? 'bg-green-500'
                          : idx === currentStep
                          ? 'bg-primary'
                          : 'bg-zinc-700'
                      }`}
                    />
                  ))}
                </div>

                {/* Current Exercise */}
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-teal-500/20 via-cyan-500/10 to-blue-500/10 rounded-3xl p-8 border border-teal-500/30 text-center mb-6"
                >
                  <div className={`inline-flex items-center gap-2 ${CATEGORIES[exercise.category].bg} ${CATEGORIES[exercise.category].color} rounded-full px-3 py-1 text-sm font-medium mb-4`}>
                    {exercise.category.charAt(0).toUpperCase() + exercise.category.slice(1)}
                  </div>

                  <h3 className="text-3xl font-bold text-white mb-2">
                    {exercise.name}
                  </h3>
                  <p className="text-primary text-xl font-semibold mb-4">
                    {exercise.duration}
                  </p>
                  <p className="text-gray-400 mb-4">
                    {exercise.description}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Target: {exercise.targetArea}
                  </p>
                </motion.div>

                {/* Navigation */}
                <div className="flex gap-4">
                  <button
                    onClick={prevExercise}
                    disabled={currentStep === 0}
                    className={`flex-1 py-4 rounded-xl font-medium transition-all ${
                      currentStep === 0
                        ? 'bg-zinc-800 text-gray-600 cursor-not-allowed'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                    }`}
                  >
                    Previous
                  </button>
                  <motion.button
                    onClick={nextExercise}
                    className="flex-1 py-4 bg-primary hover:bg-primary/90 text-black rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {currentStep === COOLDOWN_EXERCISES.length - 1 ? (
                      <>
                        <Check className="w-5 h-5" />
                        Complete
                      </>
                    ) : (
                      <>
                        Next
                        <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Reset */}
                <button
                  onClick={reset}
                  className="w-full mt-4 py-3 text-gray-500 hover:text-gray-400 transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Start Over
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tip */}
          <motion.div
            variants={fadeUp}
            className="mt-8 bg-primary/5 border border-primary/20 rounded-xl p-4"
          >
            <p className="text-sm text-gray-400">
              <span className="text-primary font-medium">Recovery Tip: </span>
              Hold each stretch until you feel the muscle relax, typically 30-60 seconds.
              Never bounce or force a stretch - gentle, sustained pressure is most effective.
            </p>
          </motion.div>
        </div>

        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-primary/20 rounded-tl-3xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-primary/20 rounded-br-3xl" />
      </motion.div>
    </section>
  );
}
