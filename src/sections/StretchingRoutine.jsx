import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Clock,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Sun,
  Moon,
  Briefcase,
  Dumbbell
} from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

// Stretch database
const STRETCHES = {
  neck: [
    { id: 'neck-tilt', name: 'Neck Tilt', duration: 30, sides: true, instruction: 'Slowly tilt your head to one side, bringing your ear toward your shoulder. Hold and breathe deeply.' },
    { id: 'neck-rotation', name: 'Neck Rotation', duration: 30, sides: false, instruction: 'Gently rotate your head in a circular motion, keeping movements slow and controlled.' },
    { id: 'chin-tuck', name: 'Chin Tuck', duration: 20, sides: false, instruction: 'Pull your chin straight back, creating a double chin. Hold while keeping your eyes level.' },
  ],
  shoulders: [
    { id: 'cross-body', name: 'Cross-Body Stretch', duration: 30, sides: true, instruction: 'Bring one arm across your body and use the other hand to gently press it closer to your chest.' },
    { id: 'shoulder-roll', name: 'Shoulder Rolls', duration: 30, sides: false, instruction: 'Roll your shoulders forward in large circles, then reverse direction.' },
    { id: 'doorway-stretch', name: 'Doorway Stretch', duration: 30, sides: false, instruction: 'Place forearms on a doorframe and lean forward to stretch your chest and shoulders.' },
  ],
  back: [
    { id: 'cat-cow', name: 'Cat-Cow Stretch', duration: 45, sides: false, instruction: 'On hands and knees, alternate between arching your back up (cat) and dropping it down (cow).' },
    { id: 'child-pose', name: "Child's Pose", duration: 45, sides: false, instruction: 'Kneel and sit back on your heels, reaching your arms forward on the floor.' },
    { id: 'seated-twist', name: 'Seated Spinal Twist', duration: 30, sides: true, instruction: 'Sit with legs extended, cross one leg over and twist your torso toward the bent knee.' },
  ],
  hips: [
    { id: 'hip-flexor', name: 'Hip Flexor Stretch', duration: 30, sides: true, instruction: 'Kneel on one knee with the other foot forward. Push your hips forward gently.' },
    { id: 'pigeon-pose', name: 'Pigeon Pose', duration: 45, sides: true, instruction: 'From downward dog, bring one knee forward and lower your hips toward the floor.' },
    { id: 'butterfly', name: 'Butterfly Stretch', duration: 30, sides: false, instruction: 'Sit with soles of feet together, knees out. Gently press knees toward the floor.' },
  ],
  legs: [
    { id: 'quad-stretch', name: 'Standing Quad Stretch', duration: 30, sides: true, instruction: 'Stand on one leg, pull the other foot toward your glutes, keeping knees together.' },
    { id: 'hamstring', name: 'Standing Hamstring Stretch', duration: 30, sides: true, instruction: 'Place one heel on an elevated surface and lean forward with a flat back.' },
    { id: 'calf-stretch', name: 'Calf Stretch', duration: 30, sides: true, instruction: 'Step one foot back, keep heel down, and lean into the wall or support.' },
  ],
};

// Pre-built routines
const ROUTINES = [
  {
    id: 'morning',
    name: 'Morning Wake-Up',
    icon: Sun,
    color: '#f97316',
    duration: '5 min',
    description: 'Gentle stretches to start your day',
    stretches: ['neck-tilt', 'shoulder-roll', 'cat-cow', 'hip-flexor', 'hamstring'],
  },
  {
    id: 'post-workout',
    name: 'Post-Workout',
    icon: Dumbbell,
    color: '#ef4444',
    duration: '8 min',
    description: 'Cool down and prevent soreness',
    stretches: ['cross-body', 'child-pose', 'pigeon-pose', 'quad-stretch', 'calf-stretch', 'seated-twist'],
  },
  {
    id: 'desk',
    name: 'Desk Break',
    icon: Briefcase,
    color: '#3b82f6',
    duration: '3 min',
    description: 'Quick relief from sitting',
    stretches: ['neck-rotation', 'shoulder-roll', 'chin-tuck', 'seated-twist'],
  },
  {
    id: 'evening',
    name: 'Evening Relaxation',
    icon: Moon,
    color: '#8b5cf6',
    duration: '10 min',
    description: 'Wind down before bed',
    stretches: ['neck-tilt', 'cat-cow', 'child-pose', 'butterfly', 'pigeon-pose', 'hamstring'],
  },
];

// Find stretch by ID
function getStretchById(id) {
  for (const category of Object.values(STRETCHES)) {
    const stretch = category.find(s => s.id === id);
    if (stretch) return stretch;
  }
  return null;
}

// Circular timer component
function CircularTimer({ duration, elapsed, isRunning }) {
  const progress = (elapsed / duration) * 100;
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const remaining = Math.max(0, duration - elapsed);

  return (
    <div className="relative w-56 h-56 mx-auto">
      {/* Background circle */}
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="112"
          cy="112"
          r="90"
          fill="none"
          stroke="#ffffff10"
          strokeWidth="8"
        />
        <motion.circle
          cx="112"
          cy="112"
          r="90"
          fill="none"
          stroke="url(#timerGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff5722" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          key={remaining}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="font-mono text-5xl font-black text-white"
        >
          {remaining}
        </motion.span>
        <span className="text-white/50 text-sm font-mono">SECONDS</span>
        {isRunning && (
          <motion.div
            className="mt-2 w-2 h-2 rounded-full bg-primary"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </div>
    </div>
  );
}

// Stretch card for selection
function StretchCard({ stretch, isActive, isCompleted, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className={`w-full p-4 text-left border transition-all ${
        isActive
          ? 'bg-primary/20 border-primary'
          : isCompleted
          ? 'bg-green-500/10 border-green-500/30'
          : 'bg-white/5 border-white/10 hover:border-white/20'
      }`}
      whileHover={{ x: 4 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          ) : isActive ? (
            <motion.div
              className="w-5 h-5 rounded-full bg-primary"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          ) : (
            <div className="w-5 h-5 rounded-full border border-white/30" />
          )}
          <span className={`font-heading font-bold ${isActive ? 'text-white' : 'text-white/70'}`}>
            {stretch.name}
          </span>
        </div>
        <span className="font-mono text-xs text-white/50">
          {stretch.duration}s {stretch.sides && '×2'}
        </span>
      </div>
    </motion.button>
  );
}

// Routine selector card
function RoutineCard({ routine, isSelected, onClick }) {
  const Icon = routine.icon;

  return (
    <motion.button
      onClick={onClick}
      className={`relative p-6 border text-left transition-all ${
        isSelected
          ? 'bg-white/10 border-white/30'
          : 'bg-white/5 border-white/10 hover:border-white/20'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className="w-12 h-12 flex items-center justify-center mb-4"
        style={{ backgroundColor: routine.color }}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h4 className="font-heading font-bold text-white mb-1">{routine.name}</h4>
      <p className="text-white/50 text-sm mb-2">{routine.description}</p>
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-white/30" />
        <span className="font-mono text-xs text-white/50">{routine.duration}</span>
        <span className="text-white/30">•</span>
        <span className="font-mono text-xs text-white/50">{routine.stretches.length} stretches</span>
      </div>
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-3 h-3 rounded-full bg-primary"
        />
      )}
    </motion.button>
  );
}

export default function StretchingRoutine() {
  const [step, setStep] = useState('select'); // 'select', 'active', 'complete'
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [currentStretchIndex, setCurrentStretchIndex] = useState(0);
  const [currentSide, setCurrentSide] = useState(1); // 1 or 2 for bilateral stretches
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [completedStretches, setCompletedStretches] = useState([]);
  const intervalRef = useRef(null);

  const currentStretches = selectedRoutine
    ? selectedRoutine.stretches.map(id => getStretchById(id)).filter(Boolean)
    : [];
  const currentStretch = currentStretches[currentStretchIndex];
  const totalStretches = currentStretches.reduce(
    (acc, s) => acc + (s.sides ? 2 : 1),
    0
  );
  const completedCount = completedStretches.length;

  // Timer logic
  useEffect(() => {
    if (isRunning && currentStretch) {
      intervalRef.current = setInterval(() => {
        setElapsed(prev => {
          if (prev >= currentStretch.duration) {
            handleStretchComplete();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, currentStretch, currentSide]);

  const handleStretchComplete = () => {
    const stretchKey = `${currentStretch.id}-${currentSide}`;
    setCompletedStretches(prev => [...prev, stretchKey]);

    // Check if we need to do the other side
    if (currentStretch.sides && currentSide === 1) {
      setCurrentSide(2);
      setElapsed(0);
    } else {
      // Move to next stretch
      if (currentStretchIndex < currentStretches.length - 1) {
        setCurrentStretchIndex(prev => prev + 1);
        setCurrentSide(1);
        setElapsed(0);
      } else {
        // Routine complete
        setIsRunning(false);
        setStep('complete');
      }
    }
  };

  const handleStart = () => {
    if (selectedRoutine) {
      setStep('active');
      setCurrentStretchIndex(0);
      setCurrentSide(1);
      setElapsed(0);
      setCompletedStretches([]);
      setIsRunning(true);
    }
  };

  const handlePauseResume = () => {
    setIsRunning(!isRunning);
  };

  const handleSkip = () => {
    setIsRunning(false);
    handleStretchComplete();
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setStep('select');
    setSelectedRoutine(null);
    setCurrentStretchIndex(0);
    setCurrentSide(1);
    setElapsed(0);
    setCompletedStretches([]);
  };

  return (
    <section className="relative py-24 bg-dark overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
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
              <Sparkles className="w-4 h-4" />
              FLEXIBILITY
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-black text-white mb-4">
              STRETCHING{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-purple-500">
                ROUTINE
              </span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Follow guided stretching routines with built-in timers to improve flexibility and prevent injury.
            </p>
          </motion.div>

          {/* Main content */}
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {step === 'select' && (
                <motion.div
                  key="select"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="grid md:grid-cols-2 gap-4 mb-8">
                    {ROUTINES.map(routine => (
                      <RoutineCard
                        key={routine.id}
                        routine={routine}
                        isSelected={selectedRoutine?.id === routine.id}
                        onClick={() => setSelectedRoutine(routine)}
                      />
                    ))}
                  </div>

                  {selectedRoutine && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {/* Stretch preview */}
                      <div className="bg-dark/50 border border-white/10 p-6 mb-6">
                        <h3 className="font-heading font-bold text-white mb-4">
                          ROUTINE PREVIEW
                        </h3>
                        <div className="space-y-2">
                          {selectedRoutine.stretches.map((id, idx) => {
                            const stretch = getStretchById(id);
                            return stretch ? (
                              <div
                                key={id}
                                className="flex items-center justify-between p-3 bg-white/5"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="w-6 h-6 flex items-center justify-center bg-white/10 font-mono text-xs text-white/50">
                                    {idx + 1}
                                  </span>
                                  <span className="text-white/70">{stretch.name}</span>
                                </div>
                                <span className="font-mono text-xs text-white/50">
                                  {stretch.duration}s {stretch.sides && '(each side)'}
                                </span>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>

                      <motion.button
                        onClick={handleStart}
                        className="w-full py-4 bg-gradient-to-r from-orange-500 to-primary text-white font-heading font-bold text-lg flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Play className="w-5 h-5" />
                        START ROUTINE
                      </motion.button>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {step === 'active' && currentStretch && (
                <motion.div
                  key="active"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid lg:grid-cols-2 gap-8"
                >
                  {/* Left - Timer and controls */}
                  <div className="relative bg-dark/50 border border-white/10 p-6">
                    <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-primary/30" />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-primary/30" />

                    {/* Progress */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-mono text-sm text-white/50">
                        {completedCount + 1} / {totalStretches}
                      </span>
                      <div className="flex-1 mx-4 h-1 bg-white/10 overflow-hidden">
                        <motion.div
                          className="h-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${((completedCount + 1) / totalStretches) * 100}%` }}
                        />
                      </div>
                      <span className="font-mono text-sm text-white/50">
                        {selectedRoutine.name}
                      </span>
                    </div>

                    {/* Current stretch name */}
                    <div className="text-center mb-6">
                      <h3 className="font-heading font-bold text-2xl text-white mb-1">
                        {currentStretch.name}
                      </h3>
                      {currentStretch.sides && (
                        <p className="text-primary font-mono text-sm">
                          {currentSide === 1 ? 'LEFT SIDE' : 'RIGHT SIDE'}
                        </p>
                      )}
                    </div>

                    {/* Timer */}
                    <CircularTimer
                      duration={currentStretch.duration}
                      elapsed={elapsed}
                      isRunning={isRunning}
                    />

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-4 mt-6">
                      <motion.button
                        onClick={handleReset}
                        className="p-3 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <RotateCcw className="w-5 h-5 text-white/50" />
                      </motion.button>
                      <motion.button
                        onClick={handlePauseResume}
                        className="p-4 bg-primary hover:bg-primary-dark transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isRunning ? (
                          <Pause className="w-6 h-6 text-white" />
                        ) : (
                          <Play className="w-6 h-6 text-white" />
                        )}
                      </motion.button>
                      <motion.button
                        onClick={handleSkip}
                        className="p-3 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <SkipForward className="w-5 h-5 text-white/50" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Right - Instructions and stretch list */}
                  <div className="space-y-6">
                    {/* Instructions */}
                    <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 p-6">
                      <h4 className="font-heading font-bold text-white mb-3">INSTRUCTIONS</h4>
                      <p className="text-white/70">{currentStretch.instruction}</p>
                    </div>

                    {/* Stretch list */}
                    <div className="bg-dark/50 border border-white/10 p-4 max-h-80 overflow-y-auto">
                      <h4 className="font-heading font-bold text-white mb-3 text-sm">
                        ROUTINE PROGRESS
                      </h4>
                      <div className="space-y-2">
                        {currentStretches.map((stretch, idx) => {
                          const isActive = idx === currentStretchIndex;
                          const isCompleted = idx < currentStretchIndex;
                          return (
                            <StretchCard
                              key={stretch.id}
                              stretch={stretch}
                              isActive={isActive}
                              isCompleted={isCompleted}
                              onClick={() => {}}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 'complete' && (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <div className="relative bg-dark/50 border border-white/10 p-12 max-w-lg mx-auto">
                    <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-green-500/30" />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-green-500/30" />

                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 10 }}
                      className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <CheckCircle2 className="w-12 h-12 text-white" />
                    </motion.div>

                    <h3 className="font-heading font-bold text-3xl text-white mb-2">
                      ROUTINE COMPLETE!
                    </h3>
                    <p className="text-white/50 mb-6">
                      Great job! You completed the {selectedRoutine?.name} routine.
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-white/5 p-4">
                        <p className="font-mono text-2xl font-bold text-green-400">
                          {completedCount}
                        </p>
                        <p className="text-white/50 text-xs">Stretches Done</p>
                      </div>
                      <div className="bg-white/5 p-4">
                        <p className="font-mono text-2xl font-bold text-primary">
                          {selectedRoutine?.duration}
                        </p>
                        <p className="text-white/50 text-xs">Total Time</p>
                      </div>
                    </div>

                    <motion.button
                      onClick={handleReset}
                      className="w-full py-4 bg-gradient-to-r from-green-500 to-primary text-white font-heading font-bold flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <RotateCcw className="w-5 h-5" />
                      START NEW ROUTINE
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
