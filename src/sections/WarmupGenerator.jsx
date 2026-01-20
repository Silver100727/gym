import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, RotateCcw, ChevronRight, Clock, Target, Zap, Heart } from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

const WORKOUT_TYPES = [
  { id: 'upper', name: 'Upper Body', icon: '💪', description: 'Chest, back, shoulders, arms' },
  { id: 'lower', name: 'Lower Body', icon: '🦵', description: 'Quads, hamstrings, glutes, calves' },
  { id: 'full', name: 'Full Body', icon: '🏋️', description: 'Complete body workout' },
  { id: 'cardio', name: 'Cardio', icon: '🏃', description: 'Running, cycling, HIIT' },
  { id: 'push', name: 'Push Day', icon: '🫸', description: 'Chest, shoulders, triceps' },
  { id: 'pull', name: 'Pull Day', icon: '🫷', description: 'Back, biceps, rear delts' },
];

const WARMUP_EXERCISES = {
  upper: [
    { name: 'Arm Circles', duration: '30 sec each direction', description: 'Start small, gradually increase size' },
    { name: 'Shoulder Rolls', duration: '30 sec', description: 'Roll forward then backward' },
    { name: 'Chest Opener Stretch', duration: '30 sec', description: 'Interlace fingers behind back, lift chest' },
    { name: 'Band Pull-Aparts', duration: '15 reps', description: 'Light resistance, squeeze shoulder blades' },
    { name: 'Wall Slides', duration: '10 reps', description: 'Back against wall, slide arms up and down' },
    { name: 'Cat-Cow Stretch', duration: '10 reps', description: 'Mobilize the thoracic spine' },
    { name: 'Push-up Plus', duration: '10 reps', description: 'Push-up position, protract shoulder blades' },
    { name: 'Light Dumbbell Press', duration: '15 reps', description: 'Very light weight, full range of motion' },
  ],
  lower: [
    { name: 'Leg Swings', duration: '15 each leg', description: 'Forward/back and side to side' },
    { name: 'Hip Circles', duration: '10 each direction', description: 'Large circles to open hips' },
    { name: 'Bodyweight Squats', duration: '15 reps', description: 'Full depth, controlled tempo' },
    { name: 'Walking Lunges', duration: '10 each leg', description: 'Step forward into lunge, alternate' },
    { name: 'Glute Bridges', duration: '15 reps', description: 'Squeeze glutes at top, hold 2 sec' },
    { name: 'Calf Raises', duration: '20 reps', description: 'Full range of motion, slow and controlled' },
    { name: 'Ankle Circles', duration: '10 each direction', description: 'Mobilize ankle joints' },
    { name: 'Light Leg Press', duration: '15 reps', description: 'Light weight, full range of motion' },
  ],
  full: [
    { name: 'Jumping Jacks', duration: '30 sec', description: 'Light cardio to elevate heart rate' },
    { name: 'Arm Circles', duration: '20 sec each direction', description: 'Loosen shoulder joints' },
    { name: 'Bodyweight Squats', duration: '15 reps', description: 'Full range of motion' },
    { name: 'Hip Circles', duration: '10 each direction', description: 'Open up the hips' },
    { name: 'Inchworms', duration: '8 reps', description: 'Walk hands out to plank, walk back' },
    { name: 'World\'s Greatest Stretch', duration: '5 each side', description: 'Lunge with rotation and reach' },
    { name: 'High Knees', duration: '20 sec', description: 'Increase heart rate and warm legs' },
    { name: 'Mountain Climbers', duration: '20 sec', description: 'Controlled pace, engage core' },
  ],
  cardio: [
    { name: 'Light Jog in Place', duration: '60 sec', description: 'Easy pace to start blood flowing' },
    { name: 'Butt Kicks', duration: '30 sec', description: 'Heel to glutes, quick pace' },
    { name: 'High Knees', duration: '30 sec', description: 'Drive knees up, pump arms' },
    { name: 'Leg Swings', duration: '15 each leg', description: 'Loosen hip flexors' },
    { name: 'Ankle Bounces', duration: '20 reps', description: 'Light hops on balls of feet' },
    { name: 'A-Skips', duration: '30 sec', description: 'Exaggerated skipping motion' },
    { name: 'Side Shuffles', duration: '30 sec', description: '10 steps each direction' },
    { name: 'Dynamic Calf Stretch', duration: '15 each leg', description: 'Step forward into calf stretch' },
  ],
  push: [
    { name: 'Arm Circles', duration: '30 sec each direction', description: 'Warm up shoulder joints' },
    { name: 'Band Pull-Aparts', duration: '20 reps', description: 'Activate upper back' },
    { name: 'Wall Push-ups', duration: '15 reps', description: 'Light chest activation' },
    { name: 'Shoulder Dislocates', duration: '10 reps', description: 'Band or stick overhead rotation' },
    { name: 'Scapular Push-ups', duration: '10 reps', description: 'Plank position, protract/retract' },
    { name: 'Pike Push-up', duration: '8 reps', description: 'Shoulder activation' },
    { name: 'Tricep Stretches', duration: '30 sec each', description: 'Overhead tricep stretch' },
    { name: 'Light Dumbbell Press', duration: '15 reps', description: 'Prime the pressing pattern' },
  ],
  pull: [
    { name: 'Cat-Cow Stretch', duration: '10 reps', description: 'Mobilize thoracic spine' },
    { name: 'Thread the Needle', duration: '8 each side', description: 'Thoracic rotation stretch' },
    { name: 'Band Pull-Aparts', duration: '20 reps', description: 'Activate rhomboids and rear delts' },
    { name: 'Scapular Retractions', duration: '15 reps', description: 'Squeeze shoulder blades together' },
    { name: 'Dead Hangs', duration: '30 sec', description: 'Decompress spine, stretch lats' },
    { name: 'Light Band Rows', duration: '15 reps', description: 'Prime the pulling pattern' },
    { name: 'Bicep Curls', duration: '15 reps light', description: 'Light weight to warm biceps' },
    { name: 'Face Pulls', duration: '15 reps', description: 'External rotation and rear delts' },
  ],
};

export default function WarmupGenerator() {
  const [selectedType, setSelectedType] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  const exercises = selectedType ? WARMUP_EXERCISES[selectedType] : [];
  const totalTime = exercises.length * 45; // Approximate seconds per exercise

  const startWarmup = () => {
    setIsStarted(true);
    setCurrentStep(0);
  };

  const nextExercise = () => {
    if (currentStep < exercises.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsStarted(false);
      setCurrentStep(0);
    }
  };

  const prevExercise = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const reset = () => {
    setSelectedType(null);
    setIsStarted(false);
    setCurrentStep(0);
  };

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
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
            <Flame className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium">Pre-Workout</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Warm-up <span className="text-primary">Generator</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Generate a customized warm-up routine based on your workout type
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {!selectedType ? (
              // Workout Type Selection
              <motion.div
                key="selection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h3 className="text-white font-semibold mb-4 text-center">What are you training today?</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {WORKOUT_TYPES.map((type, idx) => (
                    <motion.button
                      key={type.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => setSelectedType(type.id)}
                      className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl p-6 border border-zinc-800 hover:border-primary/50 transition-all text-left group"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-4xl">{type.icon}</span>
                        <div>
                          <h4 className="text-white font-semibold group-hover:text-primary transition-colors">
                            {type.name}
                          </h4>
                          <p className="text-gray-500 text-sm">{type.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : !isStarted ? (
              // Warmup Preview
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl p-6 border border-zinc-800 mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{WORKOUT_TYPES.find(t => t.id === selectedType)?.icon}</span>
                      <div>
                        <h3 className="text-white font-semibold">
                          {WORKOUT_TYPES.find(t => t.id === selectedType)?.name} Warm-up
                        </h3>
                        <p className="text-gray-500 text-sm">{exercises.length} exercises</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-5 h-5" />
                      <span>~{Math.round(totalTime / 60)} min</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {exercises.map((exercise, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-center gap-4 bg-zinc-800/50 rounded-xl p-4"
                      >
                        <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary font-bold">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">{exercise.name}</p>
                          <p className="text-gray-500 text-sm">{exercise.description}</p>
                        </div>
                        <span className="text-primary text-sm font-medium">{exercise.duration}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={reset}
                    className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-all"
                  >
                    Change Workout
                  </button>
                  <motion.button
                    onClick={startWarmup}
                    className="flex-1 py-4 bg-primary hover:bg-primary/90 text-black rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Zap className="w-5 h-5" />
                    Start Warm-up
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              // Active Warmup
              <motion.div
                key="active"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Exercise {currentStep + 1} of {exercises.length}</span>
                    <span>{Math.round((currentStep / exercises.length) * 100)}% complete</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      animate={{ width: `${((currentStep + 1) / exercises.length) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* Current Exercise */}
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-primary/20 via-orange-500/10 to-red-500/10 rounded-3xl p-8 border border-primary/30 text-center mb-6"
                >
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl font-bold text-primary">{currentStep + 1}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {exercises[currentStep].name}
                  </h3>
                  <p className="text-primary text-xl font-semibold mb-4">
                    {exercises[currentStep].duration}
                  </p>
                  <p className="text-gray-400">
                    {exercises[currentStep].description}
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
                    {currentStep === exercises.length - 1 ? (
                      <>
                        <Heart className="w-5 h-5" />
                        Finish
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
              <span className="text-primary font-medium">Pro Tip: </span>
              Never skip your warm-up! A proper warm-up increases blood flow, improves mobility,
              and significantly reduces injury risk during your workout.
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
