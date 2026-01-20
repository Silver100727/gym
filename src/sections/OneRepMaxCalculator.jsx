import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Calculator, TrendingUp, Trophy, ChevronDown, Info, Target, Zap } from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

// Exercise data with strength standards (multipliers based on body weight)
const EXERCISES = {
  bench: {
    name: 'Bench Press',
    icon: '🏋️',
    standards: {
      male: { beginner: 0.5, novice: 0.75, intermediate: 1.0, advanced: 1.5, elite: 2.0 },
      female: { beginner: 0.25, novice: 0.5, intermediate: 0.75, advanced: 1.0, elite: 1.25 },
    },
  },
  squat: {
    name: 'Squat',
    icon: '🦵',
    standards: {
      male: { beginner: 0.75, novice: 1.0, intermediate: 1.5, advanced: 2.0, elite: 2.5 },
      female: { beginner: 0.5, novice: 0.75, intermediate: 1.0, advanced: 1.5, elite: 1.75 },
    },
  },
  deadlift: {
    name: 'Deadlift',
    icon: '💪',
    standards: {
      male: { beginner: 1.0, novice: 1.25, intermediate: 1.75, advanced: 2.25, elite: 3.0 },
      female: { beginner: 0.5, novice: 0.75, intermediate: 1.25, advanced: 1.75, elite: 2.0 },
    },
  },
  ohp: {
    name: 'Overhead Press',
    icon: '🙆',
    standards: {
      male: { beginner: 0.35, novice: 0.55, intermediate: 0.8, advanced: 1.1, elite: 1.4 },
      female: { beginner: 0.2, novice: 0.35, intermediate: 0.5, advanced: 0.75, elite: 0.9 },
    },
  },
};

const STRENGTH_LEVELS = [
  { id: 'beginner', name: 'Beginner', color: '#3b82f6', description: 'New to lifting (< 3 months)' },
  { id: 'novice', name: 'Novice', color: '#22c55e', description: 'Some experience (3-12 months)' },
  { id: 'intermediate', name: 'Intermediate', color: '#f97316', description: 'Consistent training (1-3 years)' },
  { id: 'advanced', name: 'Advanced', color: '#ef4444', description: 'Serious lifter (3-5 years)' },
  { id: 'elite', name: 'Elite', color: '#a855f7', description: 'Competitive level (5+ years)' },
];

// 1RM Formulas
const FORMULAS = {
  epley: (weight, reps) => weight * (1 + reps / 30),
  brzycki: (weight, reps) => weight * (36 / (37 - reps)),
  lander: (weight, reps) => (100 * weight) / (101.3 - 2.67123 * reps),
  oconner: (weight, reps) => weight * (1 + reps / 40),
};

// Calculate 1RM using average of formulas
function calculate1RM(weight, reps) {
  if (reps === 1) return weight;
  if (reps > 12) return null; // Less accurate above 12 reps

  const results = Object.values(FORMULAS).map((formula) => formula(weight, reps));
  const average = results.reduce((a, b) => a + b, 0) / results.length;
  return Math.round(average * 10) / 10;
}

// Get strength level based on 1RM and body weight
function getStrengthLevel(oneRM, bodyWeight, exercise, gender) {
  const standards = EXERCISES[exercise].standards[gender];
  const ratio = oneRM / bodyWeight;

  if (ratio >= standards.elite) return 'elite';
  if (ratio >= standards.advanced) return 'advanced';
  if (ratio >= standards.intermediate) return 'intermediate';
  if (ratio >= standards.novice) return 'novice';
  return 'beginner';
}

// Rep percentage chart
const REP_PERCENTAGES = [
  { reps: 1, percent: 100 },
  { reps: 2, percent: 97 },
  { reps: 3, percent: 94 },
  { reps: 4, percent: 92 },
  { reps: 5, percent: 89 },
  { reps: 6, percent: 86 },
  { reps: 8, percent: 81 },
  { reps: 10, percent: 75 },
  { reps: 12, percent: 70 },
];

// Strength meter component
function StrengthMeter({ level, oneRM, bodyWeight, exercise, gender }) {
  const standards = EXERCISES[exercise].standards[gender];
  const ratio = oneRM / bodyWeight;

  // Calculate position on the meter (0-100)
  const maxRatio = standards.elite * 1.2;
  const position = Math.min((ratio / maxRatio) * 100, 100);

  return (
    <div className="relative">
      {/* Level markers */}
      <div className="flex justify-between mb-2">
        {STRENGTH_LEVELS.map((lvl) => (
          <div
            key={lvl.id}
            className="text-center"
            style={{ width: '20%' }}
          >
            <span
              className={`text-[10px] font-mono uppercase ${
                level === lvl.id ? 'text-white font-bold' : 'text-white/30'
              }`}
            >
              {lvl.name}
            </span>
          </div>
        ))}
      </div>

      {/* Meter track */}
      <div className="relative h-4 bg-white/5 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 flex">
          {STRENGTH_LEVELS.map((lvl) => (
            <div
              key={lvl.id}
              className="h-full"
              style={{ width: '20%', backgroundColor: lvl.color, opacity: 0.3 }}
            />
          ))}
        </div>

        {/* Progress fill */}
        <motion.div
          className="absolute left-0 top-0 h-full"
          style={{
            background: `linear-gradient(to right, ${STRENGTH_LEVELS.map((l) => l.color).join(', ')})`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${position}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />

        {/* Position indicator */}
        <motion.div
          className="absolute top-0 h-full w-1 bg-white shadow-lg"
          initial={{ left: 0 }}
          animate={{ left: `${position}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>

      {/* Level thresholds */}
      <div className="flex justify-between mt-1">
        {STRENGTH_LEVELS.map((lvl) => (
          <div
            key={lvl.id}
            className="text-center"
            style={{ width: '20%' }}
          >
            <span className="text-[10px] font-mono text-white/30">
              {Math.round(standards[lvl.id] * bodyWeight)}kg
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Rep chart component
function RepChart({ oneRM }) {
  return (
    <div className="space-y-2">
      {REP_PERCENTAGES.map(({ reps, percent }) => {
        const weight = Math.round(oneRM * (percent / 100));
        return (
          <div key={reps} className="flex items-center gap-3">
            <span className="w-12 text-right font-mono text-sm text-white/50">
              {reps} rep{reps > 1 ? 's' : ''}
            </span>
            <div className="flex-1 h-6 bg-white/5 relative overflow-hidden">
              <motion.div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-primary-dark"
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.5, delay: reps * 0.05 }}
              />
              <div className="absolute inset-0 flex items-center justify-between px-2">
                <span className="text-[10px] font-mono text-white/70">{percent}%</span>
                <span className="text-xs font-bold text-white">{weight} kg</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function OneRepMaxCalculator() {
  const [exercise, setExercise] = useState('bench');
  const [weight, setWeight] = useState(60);
  const [reps, setReps] = useState(5);
  const [bodyWeight, setBodyWeight] = useState(75);
  const [gender, setGender] = useState('male');
  const [isCalculated, setIsCalculated] = useState(false);
  const [showExerciseMenu, setShowExerciseMenu] = useState(false);

  const oneRM = calculate1RM(weight, reps);
  const strengthLevel = oneRM ? getStrengthLevel(oneRM, bodyWeight, exercise, gender) : null;
  const levelData = STRENGTH_LEVELS.find((l) => l.id === strengthLevel);

  const handleCalculate = () => {
    if (weight > 0 && reps > 0 && reps <= 12) {
      setIsCalculated(true);
    }
  };

  return (
    <section className="relative py-24 bg-dark overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

        {/* Weight plate pattern */}
        <div className="absolute inset-0 opacity-5">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-32 h-32 border-4 border-white rounded-full"
              style={{
                left: `${15 + i * 15}%`,
                top: `${10 + (i % 3) * 30}%`,
                transform: `rotate(${i * 30}deg)`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary font-mono text-sm mb-6">
              <Dumbbell className="w-4 h-4" />
              STRENGTH CALCULATOR
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-black text-white mb-4">
              CALCULATE YOUR{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
                ONE REP MAX
              </span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Find your estimated 1RM and see how you compare to strength standards worldwide.
            </p>
          </motion.div>

          {/* Main content */}
          <div className="max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              {!isCalculated ? (
                <motion.div
                  key="input"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="max-w-lg mx-auto"
                >
                  <div className="relative bg-dark/50 border border-white/10 p-8">
                    <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-primary/30" />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-primary/30" />

                    {/* Exercise selector */}
                    <div className="mb-6">
                      <label className="block text-white/50 text-sm mb-2">Exercise</label>
                      <div className="relative">
                        <button
                          onClick={() => setShowExerciseMenu(!showExerciseMenu)}
                          className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 text-left hover:border-white/20 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{EXERCISES[exercise].icon}</span>
                            <span className="font-heading font-bold text-white">
                              {EXERCISES[exercise].name}
                            </span>
                          </div>
                          <ChevronDown
                            className={`w-5 h-5 text-white/50 transition-transform ${
                              showExerciseMenu ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        <AnimatePresence>
                          {showExerciseMenu && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute top-full left-0 right-0 mt-2 bg-darker border border-white/10 z-20"
                            >
                              {Object.entries(EXERCISES).map(([key, data]) => (
                                <button
                                  key={key}
                                  onClick={() => {
                                    setExercise(key);
                                    setShowExerciseMenu(false);
                                  }}
                                  className={`w-full flex items-center gap-3 p-4 text-left transition-colors ${
                                    exercise === key
                                      ? 'bg-primary/20 text-white'
                                      : 'hover:bg-white/5 text-white/70'
                                  }`}
                                >
                                  <span className="text-2xl">{data.icon}</span>
                                  <span className="font-heading font-bold">{data.name}</span>
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Gender selector */}
                    <div className="mb-6">
                      <label className="block text-white/50 text-sm mb-2">Gender</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['male', 'female'].map((g) => (
                          <button
                            key={g}
                            onClick={() => setGender(g)}
                            className={`p-3 border font-heading font-bold transition-all ${
                              gender === g
                                ? 'bg-primary text-white border-primary'
                                : 'bg-white/5 text-white/50 border-white/10 hover:border-white/20'
                            }`}
                          >
                            {g.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Body weight input */}
                    <div className="mb-6">
                      <label className="block text-white/50 text-sm mb-2">Body Weight (kg)</label>
                      <input
                        type="number"
                        value={bodyWeight}
                        onChange={(e) => setBodyWeight(Number(e.target.value))}
                        className="w-full p-4 bg-white/5 border border-white/10 text-white font-mono text-xl text-center focus:border-primary focus:outline-none"
                        min="30"
                        max="200"
                      />
                    </div>

                    {/* Weight lifted input */}
                    <div className="mb-6">
                      <label className="block text-white/50 text-sm mb-2">Weight Lifted (kg)</label>
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(Number(e.target.value))}
                        className="w-full p-4 bg-white/5 border border-white/10 text-white font-mono text-xl text-center focus:border-primary focus:outline-none"
                        min="1"
                        max="500"
                      />
                    </div>

                    {/* Reps input */}
                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-white/50 text-sm">Reps Completed</label>
                        <span className="font-mono text-primary text-xl font-bold">{reps}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="12"
                        value={reps}
                        onChange={(e) => setReps(Number(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-white/30 text-xs">1</span>
                        <span className="text-white/30 text-xs">12</span>
                      </div>
                      <p className="text-white/30 text-xs mt-2 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        Most accurate for 1-10 reps
                      </p>
                    </div>

                    {/* Preview */}
                    <div className="bg-white/5 p-4 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-white/50 text-sm">Estimated 1RM</span>
                        <span className="font-mono text-2xl font-bold text-primary">
                          {oneRM ? `${oneRM} kg` : '--'}
                        </span>
                      </div>
                    </div>

                    {/* Calculate button */}
                    <motion.button
                      onClick={handleCalculate}
                      disabled={!oneRM}
                      className="w-full py-4 bg-gradient-to-r from-primary to-purple-500 text-white font-heading font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: oneRM ? 1.02 : 1 }}
                      whileTap={{ scale: oneRM ? 0.98 : 1 }}
                    >
                      <Calculator className="w-5 h-5 inline mr-2" />
                      CALCULATE & COMPARE
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {/* Results header */}
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 10 }}
                      className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-purple-500 rounded-full mb-4"
                    >
                      <Trophy className="w-10 h-10 text-white" />
                    </motion.div>
                    <h3 className="font-heading font-bold text-2xl text-white mb-2">
                      YOUR ESTIMATED ONE REP MAX
                    </h3>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-mono text-6xl font-black text-primary"
                    >
                      {oneRM} KG
                    </motion.p>
                    <p className="text-white/50 mt-2">
                      {EXERCISES[exercise].name} • Based on {weight}kg × {reps} reps
                    </p>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left column - Strength level */}
                    <div className="space-y-6">
                      {/* Strength level card */}
                      <div className="relative bg-dark/50 border border-white/10 p-6">
                        <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-primary/30" />
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-primary/30" />

                        <h4 className="font-heading font-bold text-lg text-white mb-4 flex items-center gap-2">
                          <Target className="w-5 h-5 text-primary" />
                          STRENGTH LEVEL
                        </h4>

                        {/* Level badge */}
                        <div className="flex items-center gap-4 mb-6">
                          <div
                            className="w-16 h-16 flex items-center justify-center text-3xl"
                            style={{ backgroundColor: levelData?.color }}
                          >
                            {EXERCISES[exercise].icon}
                          </div>
                          <div>
                            <p
                              className="font-heading font-black text-2xl"
                              style={{ color: levelData?.color }}
                            >
                              {levelData?.name.toUpperCase()}
                            </p>
                            <p className="text-white/50 text-sm">{levelData?.description}</p>
                          </div>
                        </div>

                        {/* Strength meter */}
                        <StrengthMeter
                          level={strengthLevel}
                          oneRM={oneRM}
                          bodyWeight={bodyWeight}
                          exercise={exercise}
                          gender={gender}
                        />

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 mt-6">
                          <div className="bg-white/5 p-3 text-center">
                            <p className="font-mono text-2xl font-bold text-white">
                              {(oneRM / bodyWeight).toFixed(2)}x
                            </p>
                            <p className="text-[10px] text-white/50 uppercase tracking-wider">
                              Body Weight Ratio
                            </p>
                          </div>
                          <div className="bg-white/5 p-3 text-center">
                            <p className="font-mono text-2xl font-bold text-white">
                              {Math.round(oneRM * 2.205)} lbs
                            </p>
                            <p className="text-[10px] text-white/50 uppercase tracking-wider">
                              In Pounds
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Next goal */}
                      <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 p-6">
                        <h4 className="font-heading font-bold text-white mb-3 flex items-center gap-2">
                          <Zap className="w-5 h-5 text-primary" />
                          NEXT GOAL
                        </h4>
                        {strengthLevel !== 'elite' ? (
                          <>
                            <p className="text-white/70 text-sm mb-2">
                              To reach{' '}
                              <span className="text-white font-bold">
                                {STRENGTH_LEVELS[STRENGTH_LEVELS.findIndex((l) => l.id === strengthLevel) + 1]?.name}
                              </span>{' '}
                              level, aim for:
                            </p>
                            <p className="font-mono text-3xl font-bold text-primary">
                              {Math.round(
                                bodyWeight *
                                  EXERCISES[exercise].standards[gender][
                                    STRENGTH_LEVELS[STRENGTH_LEVELS.findIndex((l) => l.id === strengthLevel) + 1]?.id
                                  ]
                              )}{' '}
                              kg
                            </p>
                            <p className="text-white/50 text-xs mt-1">
                              +{Math.round(
                                bodyWeight *
                                  EXERCISES[exercise].standards[gender][
                                    STRENGTH_LEVELS[STRENGTH_LEVELS.findIndex((l) => l.id === strengthLevel) + 1]?.id
                                  ] - oneRM
                              )}{' '}
                              kg from current
                            </p>
                          </>
                        ) : (
                          <p className="text-primary font-bold">You've reached Elite level! 🏆</p>
                        )}
                      </div>
                    </div>

                    {/* Right column - Rep chart */}
                    <div className="relative bg-dark/50 border border-white/10 p-6">
                      <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-primary/30" />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-primary/30" />

                      <h4 className="font-heading font-bold text-lg text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        TRAINING WEIGHTS
                      </h4>
                      <p className="text-white/50 text-sm mb-6">
                        Use these weights for different rep ranges based on your 1RM
                      </p>

                      <RepChart oneRM={oneRM} />

                      <div className="mt-6 p-4 bg-white/5 border-l-2 border-primary">
                        <p className="text-white/70 text-sm">
                          <strong className="text-white">Pro tip:</strong> For strength gains, train at
                          80-90% (3-5 reps). For hypertrophy, use 70-80% (8-12 reps).
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recalculate button */}
                  <motion.button
                    onClick={() => setIsCalculated(false)}
                    className="mt-8 mx-auto block px-8 py-3 border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-colors font-mono text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    ← CALCULATE AGAIN
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
