import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Play, Pause, RotateCcw, Volume2, VolumeX, Clock, Zap, Moon, Sun, Heart } from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

const TECHNIQUES = [
  {
    id: 'box',
    name: 'Box Breathing',
    icon: '◻️',
    description: 'Equal inhale, hold, exhale, hold. Used by Navy SEALs for stress control.',
    purpose: 'Focus & Calm',
    phases: [
      { name: 'Inhale', duration: 4, color: 'from-blue-500 to-cyan-400' },
      { name: 'Hold', duration: 4, color: 'from-cyan-400 to-teal-400' },
      { name: 'Exhale', duration: 4, color: 'from-teal-400 to-green-400' },
      { name: 'Hold', duration: 4, color: 'from-green-400 to-blue-500' },
    ],
    benefits: ['Reduces stress', 'Improves focus', 'Lowers heart rate'],
  },
  {
    id: '478',
    name: '4-7-8 Relaxation',
    icon: '😌',
    description: 'Dr. Andrew Weil\'s natural tranquilizer for the nervous system.',
    purpose: 'Sleep & Relaxation',
    phases: [
      { name: 'Inhale', duration: 4, color: 'from-purple-500 to-indigo-400' },
      { name: 'Hold', duration: 7, color: 'from-indigo-400 to-blue-400' },
      { name: 'Exhale', duration: 8, color: 'from-blue-400 to-purple-500' },
    ],
    benefits: ['Promotes sleep', 'Reduces anxiety', 'Calms nervous system'],
  },
  {
    id: 'energizing',
    name: 'Energizing Breath',
    icon: '⚡',
    description: 'Quick, powerful breaths to increase energy and alertness.',
    purpose: 'Pre-Workout',
    phases: [
      { name: 'Quick Inhale', duration: 1, color: 'from-orange-500 to-yellow-400' },
      { name: 'Quick Exhale', duration: 1, color: 'from-yellow-400 to-orange-500' },
    ],
    benefits: ['Boosts energy', 'Increases alertness', 'Warms up body'],
    cycles: 10,
  },
  {
    id: 'recovery',
    name: 'Recovery Breath',
    icon: '🧘',
    description: 'Extended exhale to activate parasympathetic nervous system.',
    purpose: 'Post-Workout',
    phases: [
      { name: 'Inhale', duration: 4, color: 'from-emerald-500 to-teal-400' },
      { name: 'Exhale', duration: 8, color: 'from-teal-400 to-emerald-500' },
    ],
    benefits: ['Speeds recovery', 'Lowers cortisol', 'Reduces muscle tension'],
  },
  {
    id: 'diaphragmatic',
    name: 'Belly Breathing',
    icon: '🫁',
    description: 'Deep diaphragmatic breathing for core engagement and oxygen flow.',
    purpose: 'Core & Oxygen',
    phases: [
      { name: 'Deep Inhale', duration: 5, color: 'from-rose-500 to-pink-400' },
      { name: 'Slow Exhale', duration: 5, color: 'from-pink-400 to-rose-500' },
    ],
    benefits: ['Improves oxygen intake', 'Strengthens diaphragm', 'Reduces blood pressure'],
  },
];

const PURPOSE_ICONS = {
  'Focus & Calm': Zap,
  'Sleep & Relaxation': Moon,
  'Pre-Workout': Sun,
  'Post-Workout': Heart,
  'Core & Oxygen': Wind,
};

export default function BreathingExercises() {
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [totalCycles, setTotalCycles] = useState(4);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioContextRef = useRef(null);
  const timerRef = useRef(null);

  const playTone = useCallback((frequency, duration) => {
    if (!soundEnabled) return;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }

      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio not supported
    }
  }, [soundEnabled]);

  const startExercise = () => {
    setIsRunning(true);
    setCurrentPhase(0);
    setPhaseProgress(0);
    setCyclesCompleted(0);
    playTone(440, 0.2);
  };

  const pauseExercise = () => {
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const resetExercise = () => {
    setIsRunning(false);
    setCurrentPhase(0);
    setPhaseProgress(0);
    setCyclesCompleted(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    if (!isRunning || !selectedTechnique) return;

    const phases = selectedTechnique.phases;
    const currentPhaseDuration = phases[currentPhase].duration * 1000;
    const interval = 50; // Update every 50ms for smooth animation
    let elapsed = 0;

    timerRef.current = setInterval(() => {
      elapsed += interval;
      const progress = Math.min((elapsed / currentPhaseDuration) * 100, 100);
      setPhaseProgress(progress);

      if (elapsed >= currentPhaseDuration) {
        // Move to next phase
        const nextPhase = (currentPhase + 1) % phases.length;

        if (nextPhase === 0) {
          // Completed a cycle
          const newCycles = cyclesCompleted + 1;
          setCyclesCompleted(newCycles);

          const targetCycles = selectedTechnique.cycles || totalCycles;
          if (newCycles >= targetCycles) {
            // Exercise complete
            setIsRunning(false);
            playTone(880, 0.3);
            return;
          }
        }

        setCurrentPhase(nextPhase);
        setPhaseProgress(0);
        elapsed = 0;
        playTone(nextPhase === 0 ? 523 : 392, 0.15);
      }
    }, interval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, selectedTechnique, currentPhase, cyclesCompleted, totalCycles, playTone]);

  const getCircleScale = () => {
    if (!selectedTechnique || !isRunning) return 1;

    const phase = selectedTechnique.phases[currentPhase];
    const progress = phaseProgress / 100;

    if (phase.name.includes('Inhale')) {
      return 1 + (progress * 0.5); // Expand from 1 to 1.5
    } else if (phase.name.includes('Exhale')) {
      return 1.5 - (progress * 0.5); // Contract from 1.5 to 1
    }
    return phase.name === 'Hold' && currentPhase === 1 ? 1.5 : 1; // Maintain size during hold
  };

  const currentPhaseData = selectedTechnique?.phases[currentPhase];

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl" />
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
            <span className="text-primary text-sm font-medium">Mindful Breathing</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Breathing <span className="text-primary">Exercise</span> Guide
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Master your breath to enhance performance, reduce stress, and speed recovery
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {!selectedTechnique ? (
              <motion.div
                key="techniques"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid gap-4"
              >
                {TECHNIQUES.map((technique, index) => {
                  const PurposeIcon = PURPOSE_ICONS[technique.purpose] || Wind;
                  return (
                    <motion.button
                      key={technique.id}
                      onClick={() => setSelectedTechnique(technique)}
                      className="w-full bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-zinc-800 hover:border-primary/30 rounded-2xl p-6 text-left transition-all group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{technique.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                              {technique.name}
                            </h3>
                            <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full flex items-center gap-1">
                              <PurposeIcon className="w-3 h-3" />
                              {technique.purpose}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm mb-3">{technique.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {technique.benefits.map((benefit, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-zinc-800 text-gray-400 text-xs rounded"
                              >
                                {benefit}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-500 text-sm">
                            {technique.phases.map(p => p.duration).join('-')}
                          </p>
                          <p className="text-gray-600 text-xs">seconds</p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="exercise"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl border border-zinc-800 p-8"
              >
                {/* Exercise Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{selectedTechnique.icon}</span>
                      <h3 className="text-2xl font-bold text-white">{selectedTechnique.name}</h3>
                    </div>
                    <p className="text-gray-400">{selectedTechnique.description}</p>
                  </div>
                  <button
                    onClick={() => {
                      resetExercise();
                      setSelectedTechnique(null);
                    }}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-gray-400 rounded-lg transition-colors"
                  >
                    Change
                  </button>
                </div>

                {/* Breathing Visualization */}
                <div className="flex flex-col items-center mb-8">
                  <div className="relative w-64 h-64 flex items-center justify-center">
                    {/* Outer Ring */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle
                        cx="128"
                        cy="128"
                        r="120"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-zinc-800"
                      />
                      {isRunning && currentPhaseData && (
                        <circle
                          cx="128"
                          cy="128"
                          r="120"
                          fill="none"
                          stroke="url(#breathGradient)"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeDasharray={2 * Math.PI * 120}
                          strokeDashoffset={2 * Math.PI * 120 * (1 - phaseProgress / 100)}
                          className="transition-all duration-100"
                        />
                      )}
                      <defs>
                        <linearGradient id="breathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#f97316" />
                          <stop offset="100%" stopColor="#eab308" />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Breathing Circle */}
                    <motion.div
                      className={`w-40 h-40 rounded-full bg-gradient-to-br ${
                        currentPhaseData?.color || 'from-primary/30 to-primary/10'
                      } flex items-center justify-center`}
                      animate={{
                        scale: getCircleScale(),
                      }}
                      transition={{
                        duration: 0.1,
                        ease: 'linear',
                      }}
                    >
                      <div className="text-center">
                        {isRunning ? (
                          <>
                            <p className="text-white text-xl font-bold">
                              {currentPhaseData?.name}
                            </p>
                            <p className="text-white/70 text-3xl font-mono">
                              {Math.ceil(currentPhaseData?.duration * (1 - phaseProgress / 100))}
                            </p>
                          </>
                        ) : cyclesCompleted > 0 && cyclesCompleted >= (selectedTechnique.cycles || totalCycles) ? (
                          <>
                            <p className="text-white text-lg font-bold">Complete!</p>
                            <p className="text-white/70 text-sm">{cyclesCompleted} cycles</p>
                          </>
                        ) : (
                          <>
                            <p className="text-white/50 text-lg">Ready</p>
                            <p className="text-white/30 text-sm">Press play</p>
                          </>
                        )}
                      </div>
                    </motion.div>
                  </div>

                  {/* Phase Indicators */}
                  <div className="flex gap-2 mt-6">
                    {selectedTechnique.phases.map((phase, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                          currentPhase === index && isRunning
                            ? 'bg-primary/20 border border-primary/50'
                            : 'bg-zinc-800/50'
                        }`}
                      >
                        <span className={`text-sm ${
                          currentPhase === index && isRunning ? 'text-primary' : 'text-gray-500'
                        }`}>
                          {phase.name}
                        </span>
                        <span className={`text-xs font-mono ${
                          currentPhase === index && isRunning ? 'text-primary' : 'text-gray-600'
                        }`}>
                          {phase.duration}s
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress */}
                <div className="flex items-center justify-center gap-6 mb-8">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-white">{cyclesCompleted}</p>
                    <p className="text-gray-500 text-sm">Completed</p>
                  </div>
                  <div className="w-px h-10 bg-zinc-700" />
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">
                      {selectedTechnique.cycles || totalCycles}
                    </p>
                    <p className="text-gray-500 text-sm">Target Cycles</p>
                  </div>
                </div>

                {/* Cycle Selector (if not preset) */}
                {!selectedTechnique.cycles && (
                  <div className="flex items-center justify-center gap-4 mb-8">
                    <span className="text-gray-400 text-sm">Cycles:</span>
                    {[3, 4, 5, 6, 8, 10].map(num => (
                      <button
                        key={num}
                        onClick={() => setTotalCycles(num)}
                        disabled={isRunning}
                        className={`w-10 h-10 rounded-lg font-medium transition-all ${
                          totalCycles === num
                            ? 'bg-primary text-black'
                            : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                        } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                )}

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`p-3 rounded-xl transition-colors ${
                      soundEnabled ? 'bg-zinc-800 text-white' : 'bg-zinc-800/50 text-gray-600'
                    }`}
                  >
                    {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={resetExercise}
                    className="p-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>

                  <motion.button
                    onClick={isRunning ? pauseExercise : startExercise}
                    className="px-8 py-4 bg-gradient-to-r from-primary to-orange-500 text-black font-bold rounded-xl flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isRunning ? (
                      <>
                        <Pause className="w-5 h-5" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        {cyclesCompleted > 0 ? 'Resume' : 'Start'}
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Tips */}
                <div className="mt-8 p-4 bg-black/30 rounded-xl">
                  <p className="text-gray-400 text-sm text-center">
                    <span className="text-primary font-medium">Tip: </span>
                    {selectedTechnique.id === 'box' && 'Breathe through your nose. Visualize drawing a box with each phase.'}
                    {selectedTechnique.id === '478' && 'Place tongue tip behind upper front teeth. Exhale completely through mouth with whoosh sound.'}
                    {selectedTechnique.id === 'energizing' && 'Short, sharp breaths through nose. Keep shoulders relaxed. Stop if dizzy.'}
                    {selectedTechnique.id === 'recovery' && 'Focus on slow, controlled exhale. Let tension release with each breath out.'}
                    {selectedTechnique.id === 'diaphragmatic' && 'Place hand on belly. Feel it rise on inhale, fall on exhale. Chest stays still.'}
                  </p>
                </div>

                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-primary/30 rounded-tl-2xl" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-primary/30 rounded-br-2xl" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  );
}
