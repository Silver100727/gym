import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Moon,
  Sun,
  Coffee,
  Smartphone,
  Dumbbell,
  Clock,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  BedDouble
} from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

// Sleep quality factors
const FACTORS = [
  {
    id: 'caffeine',
    question: 'When did you last have caffeine?',
    icon: Coffee,
    options: [
      { label: '6+ hours before bed', score: 0, emoji: '✅' },
      { label: '4-6 hours before', score: -5, emoji: '⚠️' },
      { label: '2-4 hours before', score: -15, emoji: '❌' },
      { label: 'Within 2 hours', score: -25, emoji: '🚫' },
    ],
  },
  {
    id: 'screens',
    question: 'Screen time before bed?',
    icon: Smartphone,
    options: [
      { label: 'None (1hr+ before)', score: 0, emoji: '✅' },
      { label: 'Limited (30min before)', score: -5, emoji: '⚠️' },
      { label: 'Until bedtime', score: -15, emoji: '❌' },
      { label: 'In bed on phone', score: -20, emoji: '🚫' },
    ],
  },
  {
    id: 'exercise',
    question: 'When did you exercise?',
    icon: Dumbbell,
    options: [
      { label: 'Morning/Afternoon', score: 10, emoji: '✅' },
      { label: 'Early evening', score: 5, emoji: '👍' },
      { label: 'Late evening', score: -10, emoji: '⚠️' },
      { label: 'No exercise today', score: -5, emoji: '😴' },
    ],
  },
  {
    id: 'consistency',
    question: 'Sleep schedule consistency?',
    icon: Clock,
    options: [
      { label: 'Same time daily', score: 15, emoji: '✅' },
      { label: '±30 min variation', score: 5, emoji: '👍' },
      { label: '±1-2 hour variation', score: -5, emoji: '⚠️' },
      { label: 'Irregular schedule', score: -15, emoji: '❌' },
    ],
  },
];

// Calculate sleep duration from times
function calculateSleepDuration(bedtime, wakeTime) {
  const [bedHour, bedMin] = bedtime.split(':').map(Number);
  const [wakeHour, wakeMin] = wakeTime.split(':').map(Number);

  let bedMinutes = bedHour * 60 + bedMin;
  let wakeMinutes = wakeHour * 60 + wakeMin;

  // Handle crossing midnight
  if (wakeMinutes < bedMinutes) {
    wakeMinutes += 24 * 60;
  }

  const durationMinutes = wakeMinutes - bedMinutes;
  return durationMinutes / 60;
}

// Get sleep duration score
function getDurationScore(hours) {
  if (hours >= 7 && hours <= 9) return 50; // Optimal
  if (hours >= 6 && hours < 7) return 30;
  if (hours > 9 && hours <= 10) return 35;
  if (hours >= 5 && hours < 6) return 15;
  if (hours > 10) return 20;
  return 0; // Less than 5 hours
}

// Get recovery impact
function getRecoveryImpact(score) {
  if (score >= 85) return { level: 'Optimal', color: '#22c55e', percent: 100, description: 'Maximum muscle recovery and hormone optimization' };
  if (score >= 70) return { level: 'Good', color: '#84cc16', percent: 85, description: 'Solid recovery, minor improvements possible' };
  if (score >= 55) return { level: 'Moderate', color: '#eab308', percent: 70, description: 'Adequate recovery, consider improvements' };
  if (score >= 40) return { level: 'Poor', color: '#f97316', percent: 50, description: 'Compromised recovery affecting gains' };
  return { level: 'Critical', color: '#ef4444', percent: 30, description: 'Severely impacted recovery and performance' };
}

// Sleep cycles visualization
function SleepCycles({ hours }) {
  const cycles = Math.floor(hours / 1.5);
  const remainder = hours % 1.5;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-white/50 text-sm">Sleep Cycles</span>
        <span className="font-mono text-primary font-bold">{cycles} complete</span>
      </div>
      <div className="flex gap-1">
        {[...Array(6)].map((_, idx) => (
          <motion.div
            key={idx}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={`flex-1 h-8 rounded-sm ${
              idx < cycles
                ? 'bg-gradient-to-t from-blue-600 to-purple-500'
                : idx === cycles && remainder > 0
                ? 'bg-gradient-to-t from-blue-600/50 to-purple-500/50'
                : 'bg-white/10'
            }`}
          />
        ))}
      </div>
      <p className="text-white/30 text-xs">
        Each cycle ≈ 90 minutes. Aim for 5-6 complete cycles.
      </p>
    </div>
  );
}

// Score gauge component
function ScoreGauge({ score }) {
  const recovery = getRecoveryImpact(score);
  const rotation = (score / 100) * 180 - 90;

  return (
    <div className="relative w-64 h-32 mx-auto">
      {/* Gauge background */}
      <svg viewBox="0 0 200 110" className="w-full h-full">
        {/* Track */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#ffffff10"
          strokeWidth="16"
          strokeLinecap="round"
        />
        {/* Colored segments */}
        <path
          d="M 20 100 A 80 80 0 0 1 56 36"
          fill="none"
          stroke="#ef4444"
          strokeWidth="16"
          strokeLinecap="round"
        />
        <path
          d="M 56 36 A 80 80 0 0 1 100 20"
          fill="none"
          stroke="#f97316"
          strokeWidth="16"
        />
        <path
          d="M 100 20 A 80 80 0 0 1 144 36"
          fill="none"
          stroke="#eab308"
          strokeWidth="16"
        />
        <path
          d="M 144 36 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#22c55e"
          strokeWidth="16"
          strokeLinecap="round"
        />
      </svg>

      {/* Needle */}
      <motion.div
        className="absolute bottom-0 left-1/2 origin-bottom"
        initial={{ rotate: -90 }}
        animate={{ rotate: rotation }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{ height: '70px', width: '4px', marginLeft: '-2px' }}
      >
        <div className="w-full h-full bg-white rounded-full shadow-lg" />
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full" />
      </motion.div>

      {/* Score display */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
        <motion.span
          key={score}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="font-mono text-4xl font-black"
          style={{ color: recovery.color }}
        >
          {score}
        </motion.span>
        <p className="text-white/50 text-xs">/100</p>
      </div>
    </div>
  );
}

// Factor question component
function FactorQuestion({ factor, selectedOption, onSelect }) {
  const Icon = factor.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 p-4"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-primary/20 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <h4 className="font-heading font-bold text-white text-sm">{factor.question}</h4>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {factor.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(factor.id, idx)}
            className={`p-2 text-left text-sm transition-all ${
              selectedOption === idx
                ? 'bg-primary/20 border-primary'
                : 'bg-white/5 border-white/10 hover:border-white/20'
            } border`}
          >
            <span className="mr-2">{option.emoji}</span>
            <span className={selectedOption === idx ? 'text-white' : 'text-white/70'}>
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// Tips component
function SleepTips({ score, factors, answers }) {
  const tips = [];

  // Generate personalized tips
  if (answers.caffeine >= 2) {
    tips.push({ icon: Coffee, text: 'Cut off caffeine at least 6 hours before bed for better sleep quality' });
  }
  if (answers.screens >= 2) {
    tips.push({ icon: Smartphone, text: 'Use night mode or stop screens 1 hour before bed' });
  }
  if (answers.exercise === 2) {
    tips.push({ icon: Dumbbell, text: 'Try to finish workouts at least 3 hours before bedtime' });
  }
  if (answers.consistency >= 2) {
    tips.push({ icon: Clock, text: 'Set a consistent sleep schedule, even on weekends' });
  }

  if (tips.length === 0) {
    tips.push({ icon: CheckCircle2, text: 'Great sleep habits! Keep it up for optimal recovery.' });
  }

  return (
    <div className="space-y-3">
      {tips.map((tip, idx) => {
        const Icon = tip.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-start gap-3 p-3 bg-white/5 border-l-2 border-primary"
          >
            <Icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-white/70 text-sm">{tip.text}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function SleepCalculator() {
  const [step, setStep] = useState(1);
  const [bedtime, setBedtime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [answers, setAnswers] = useState({});

  const sleepHours = useMemo(() => calculateSleepDuration(bedtime, wakeTime), [bedtime, wakeTime]);

  const score = useMemo(() => {
    let total = getDurationScore(sleepHours);
    FACTORS.forEach((factor) => {
      if (answers[factor.id] !== undefined) {
        total += factor.options[answers[factor.id]].score;
      }
    });
    return Math.max(0, Math.min(100, total));
  }, [sleepHours, answers]);

  const recovery = getRecoveryImpact(score);

  const handleAnswerSelect = (factorId, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [factorId]: optionIndex }));
  };

  const handleCalculate = () => {
    setStep(2);
  };

  const handleReset = () => {
    setStep(1);
    setAnswers({});
    setBedtime('23:00');
    setWakeTime('07:00');
  };

  return (
    <section className="relative py-24 bg-darker overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

        {/* Stars pattern */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
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
              <Moon className="w-4 h-4" />
              RECOVERY OPTIMIZER
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-black text-white mb-4">
              SLEEP{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                CALCULATOR
              </span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Quality sleep is crucial for muscle recovery and performance. Analyze your sleep habits.
            </p>
          </motion.div>

          {/* Main content */}
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="input"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Time inputs */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative bg-dark/50 border border-white/10 p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-blue-500/20 flex items-center justify-center">
                          <Moon className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-white">BEDTIME</h3>
                          <p className="text-white/50 text-xs">When you go to sleep</p>
                        </div>
                      </div>
                      <input
                        type="time"
                        value={bedtime}
                        onChange={(e) => setBedtime(e.target.value)}
                        className="w-full p-4 bg-white/5 border border-white/10 text-white font-mono text-2xl text-center focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div className="relative bg-dark/50 border border-white/10 p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-orange-500/20 flex items-center justify-center">
                          <Sun className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-white">WAKE TIME</h3>
                          <p className="text-white/50 text-xs">When you wake up</p>
                        </div>
                      </div>
                      <input
                        type="time"
                        value={wakeTime}
                        onChange={(e) => setWakeTime(e.target.value)}
                        className="w-full p-4 bg-white/5 border border-white/10 text-white font-mono text-2xl text-center focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Sleep duration preview */}
                  <div className="bg-dark/50 border border-white/10 p-6 text-center">
                    <p className="text-white/50 text-sm mb-2">Sleep Duration</p>
                    <p className="font-mono text-4xl font-black text-primary">
                      {Math.floor(sleepHours)}h {Math.round((sleepHours % 1) * 60)}m
                    </p>
                    <p className={`text-sm mt-2 ${sleepHours >= 7 && sleepHours <= 9 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {sleepHours >= 7 && sleepHours <= 9
                        ? '✓ Optimal range (7-9 hours)'
                        : sleepHours < 7
                        ? '⚠ Below recommended (7-9 hours)'
                        : '⚠ Above typical range'}
                    </p>
                  </div>

                  {/* Quality factors */}
                  <div className="relative bg-dark/50 border border-white/10 p-6">
                    <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-primary/30" />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-primary/30" />

                    <h3 className="font-heading font-bold text-white mb-4">SLEEP QUALITY FACTORS</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {FACTORS.map((factor) => (
                        <FactorQuestion
                          key={factor.id}
                          factor={factor}
                          selectedOption={answers[factor.id]}
                          onSelect={handleAnswerSelect}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Calculate button */}
                  <motion.button
                    onClick={handleCalculate}
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-heading font-bold text-lg flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    ANALYZE MY SLEEP
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left - Score */}
                    <div className="space-y-6">
                      <div className="relative bg-dark/50 border border-white/10 p-6">
                        <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-primary/30" />
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-primary/30" />

                        <h3 className="font-heading font-bold text-white text-center mb-4">
                          SLEEP QUALITY SCORE
                        </h3>
                        <ScoreGauge score={score} />

                        <div className="mt-6 text-center">
                          <p
                            className="font-heading font-bold text-2xl"
                            style={{ color: recovery.color }}
                          >
                            {recovery.level.toUpperCase()}
                          </p>
                          <p className="text-white/50 text-sm mt-1">{recovery.description}</p>
                        </div>
                      </div>

                      {/* Sleep cycles */}
                      <div className="bg-dark/50 border border-white/10 p-6">
                        <h3 className="font-heading font-bold text-white mb-4 flex items-center gap-2">
                          <BedDouble className="w-5 h-5 text-primary" />
                          SLEEP CYCLES
                        </h3>
                        <SleepCycles hours={sleepHours} />
                      </div>
                    </div>

                    {/* Right - Details */}
                    <div className="space-y-6">
                      {/* Recovery impact */}
                      <div className="bg-dark/50 border border-white/10 p-6">
                        <h3 className="font-heading font-bold text-white mb-4 flex items-center gap-2">
                          <Zap className="w-5 h-5 text-primary" />
                          RECOVERY IMPACT
                        </h3>

                        <div className="space-y-4">
                          {[
                            { label: 'Muscle Recovery', value: recovery.percent },
                            { label: 'Hormone Optimization', value: Math.max(20, recovery.percent - 10) },
                            { label: 'Mental Focus', value: Math.max(25, recovery.percent - 5) },
                            { label: 'Energy Levels', value: recovery.percent },
                          ].map((item, idx) => (
                            <div key={item.label}>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-white/70">{item.label}</span>
                                <span className="font-mono text-white">{item.value}%</span>
                              </div>
                              <div className="h-2 bg-white/10 overflow-hidden">
                                <motion.div
                                  className="h-full"
                                  style={{ backgroundColor: recovery.color }}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${item.value}%` }}
                                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Personalized tips */}
                      <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 p-6">
                        <h3 className="font-heading font-bold text-white mb-4 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-primary" />
                          IMPROVEMENT TIPS
                        </h3>
                        <SleepTips score={score} factors={FACTORS} answers={answers} />
                      </div>
                    </div>
                  </div>

                  {/* Reset button */}
                  <motion.button
                    onClick={handleReset}
                    className="mt-8 mx-auto flex items-center gap-2 px-6 py-3 border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-colors font-mono text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RotateCcw className="w-4 h-4" />
                    RECALCULATE
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
