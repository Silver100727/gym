import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Minus,
  Volume2,
  VolumeX,
  Zap,
  TrendingUp,
  Clock,
  Target
} from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

// Preset rest durations in seconds
const PRESETS = [
  { label: '30s', seconds: 30, description: 'Endurance / Light' },
  { label: '60s', seconds: 60, description: 'Hypertrophy' },
  { label: '90s', seconds: 90, description: 'Strength' },
  { label: '2min', seconds: 120, description: 'Heavy Compound' },
  { label: '3min', seconds: 180, description: 'Max Strength' },
];

// Circular progress component
function CircularProgress({ progress, timeLeft, isRunning, totalTime }) {
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Color based on time remaining
  const getColor = () => {
    if (timeLeft <= 5) return '#ef4444'; // Red - almost done
    if (timeLeft <= 10) return '#f97316'; // Orange - getting close
    return '#ff5722'; // Primary
  };

  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Background circle */}
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="128"
          cy="128"
          r="90"
          fill="none"
          stroke="#ffffff10"
          strokeWidth="12"
        />
        <motion.circle
          cx="128"
          cy="128"
          r="90"
          fill="none"
          stroke={getColor()}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.3, ease: 'linear' }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          key={timeLeft}
          initial={{ scale: timeLeft <= 5 ? 1.3 : 1 }}
          animate={{ scale: 1 }}
          className={`font-mono text-6xl font-black ${
            timeLeft <= 5 ? 'text-red-500' : 'text-white'
          }`}
        >
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </motion.span>
        <span className="text-white/50 text-sm font-mono mt-2">
          {isRunning ? 'RESTING' : 'READY'}
        </span>

        {/* Pulsing indicator when running */}
        {isRunning && (
          <motion.div
            className="mt-3 w-3 h-3 rounded-full bg-primary"
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </div>

      {/* Time labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center">
        <span className="text-white/30 text-xs font-mono">
          {Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')} total
        </span>
      </div>
    </div>
  );
}

// Preset button component
function PresetButton({ preset, isSelected, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className={`p-3 border text-center transition-all ${
        isSelected
          ? 'bg-primary border-primary'
          : 'bg-white/5 border-white/10 hover:border-white/20'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className={`font-mono text-lg font-bold ${isSelected ? 'text-white' : 'text-white/70'}`}>
        {preset.label}
      </span>
      <p className={`text-xs mt-1 ${isSelected ? 'text-white/80' : 'text-white/40'}`}>
        {preset.description}
      </p>
    </motion.button>
  );
}

// Set counter component
function SetCounter({ sets, onIncrement, onDecrement, onReset }) {
  return (
    <div className="flex items-center justify-center gap-4">
      <motion.button
        onClick={onDecrement}
        disabled={sets === 0}
        className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
        whileHover={{ scale: sets > 0 ? 1.05 : 1 }}
        whileTap={{ scale: sets > 0 ? 0.95 : 1 }}
      >
        <Minus className="w-5 h-5 text-white" />
      </motion.button>

      <div className="text-center min-w-[100px]">
        <motion.span
          key={sets}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          className="font-mono text-5xl font-black text-primary"
        >
          {sets}
        </motion.span>
        <p className="text-white/50 text-xs font-mono mt-1">SETS COMPLETED</p>
      </div>

      <motion.button
        onClick={onIncrement}
        className="w-12 h-12 flex items-center justify-center bg-primary hover:bg-primary-dark transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Plus className="w-5 h-5 text-white" />
      </motion.button>
    </div>
  );
}

// Session stats component
function SessionStats({ sets, totalRestTime }) {
  const avgRestTime = sets > 0 ? Math.round(totalRestTime / sets) : 0;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white/5 p-4 text-center">
        <p className="font-mono text-2xl font-bold text-white">{sets}</p>
        <p className="text-white/50 text-xs">Total Sets</p>
      </div>
      <div className="bg-white/5 p-4 text-center">
        <p className="font-mono text-2xl font-bold text-primary">
          {Math.floor(totalRestTime / 60)}:{(totalRestTime % 60).toString().padStart(2, '0')}
        </p>
        <p className="text-white/50 text-xs">Rest Time</p>
      </div>
      <div className="bg-white/5 p-4 text-center">
        <p className="font-mono text-2xl font-bold text-white">
          {avgRestTime}s
        </p>
        <p className="text-white/50 text-xs">Avg Rest</p>
      </div>
    </div>
  );
}

export default function RestTimer() {
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[1]); // Default 60s
  const [customTime, setCustomTime] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [sets, setSets] = useState(0);
  const [totalRestTime, setTotalRestTime] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showCustom, setShowCustom] = useState(false);
  const intervalRef = useRef(null);
  const audioContextRef = useRef(null);

  // Calculate progress
  const totalTime = showCustom ? customTime : selectedPreset.seconds;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  // Play beep sound
  const playBeep = useCallback((frequency = 800, duration = 200) => {
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
      gainNode.gain.value = 0.3;

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration / 1000);
    } catch (e) {
      // Audio not supported
    }
  }, [soundEnabled]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          // Play countdown beeps
          if (prev <= 4 && prev > 1) {
            playBeep(600, 100);
          }
          // Final beep
          if (prev === 1) {
            playBeep(1000, 500);
            // Vibrate if supported
            if (navigator.vibrate) {
              navigator.vibrate([200, 100, 200]);
            }
          }
          return prev - 1;
        });
        setTotalRestTime((prev) => prev + 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setSets((prev) => prev + 1);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, playBeep]);

  const handleStart = () => {
    if (timeLeft === 0) {
      setTimeLeft(totalTime);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(totalTime);
  };

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset);
    setTimeLeft(preset.seconds);
    setIsRunning(false);
    setShowCustom(false);
  };

  const handleCustomTimeChange = (delta) => {
    const newTime = Math.max(10, Math.min(300, customTime + delta));
    setCustomTime(newTime);
    setTimeLeft(newTime);
  };

  const handleResetSession = () => {
    setSets(0);
    setTotalRestTime(0);
    handleReset();
  };

  return (
    <section className="relative py-24 bg-darker overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
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
              <Timer className="w-4 h-4" />
              WORKOUT COMPANION
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-black text-white mb-4">
              REST{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">
                TIMER
              </span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Time your rest periods between sets for optimal muscle recovery and workout efficiency.
            </p>
          </motion.div>

          {/* Main content */}
          <div className="max-w-2xl mx-auto">
            <div className="relative bg-dark/50 border border-white/10 p-6 md:p-8">
              <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-primary/30" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-primary/30" />

              {/* Timer display */}
              <CircularProgress
                progress={progress}
                timeLeft={timeLeft}
                isRunning={isRunning}
                totalTime={totalTime}
              />

              {/* Control buttons */}
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
                  onClick={isRunning ? handlePause : handleStart}
                  className="w-16 h-16 flex items-center justify-center bg-primary hover:bg-primary-dark transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isRunning ? (
                    <Pause className="w-8 h-8 text-white" />
                  ) : (
                    <Play className="w-8 h-8 text-white ml-1" />
                  )}
                </motion.button>

                <motion.button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`p-3 border transition-colors ${
                    soundEnabled
                      ? 'bg-white/5 border-white/10 hover:bg-white/10'
                      : 'bg-red-500/20 border-red-500/30'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {soundEnabled ? (
                    <Volume2 className="w-5 h-5 text-white/50" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-red-400" />
                  )}
                </motion.button>
              </div>

              {/* Preset buttons */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/50 text-sm font-mono">REST DURATION</span>
                  <button
                    onClick={() => {
                      setShowCustom(!showCustom);
                      if (!showCustom) {
                        setTimeLeft(customTime);
                      }
                    }}
                    className={`text-sm font-mono transition-colors ${
                      showCustom ? 'text-primary' : 'text-white/50 hover:text-white'
                    }`}
                  >
                    {showCustom ? 'USE PRESET' : 'CUSTOM'}
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {showCustom ? (
                    <motion.div
                      key="custom"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center justify-center gap-4 p-4 bg-white/5 border border-white/10"
                    >
                      <motion.button
                        onClick={() => handleCustomTimeChange(-10)}
                        className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
                        whileTap={{ scale: 0.9 }}
                      >
                        <Minus className="w-4 h-4 text-white" />
                      </motion.button>
                      <div className="text-center min-w-[80px]">
                        <span className="font-mono text-3xl font-bold text-white">
                          {customTime}
                        </span>
                        <p className="text-white/50 text-xs">seconds</p>
                      </div>
                      <motion.button
                        onClick={() => handleCustomTimeChange(10)}
                        className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
                        whileTap={{ scale: 0.9 }}
                      >
                        <Plus className="w-4 h-4 text-white" />
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="presets"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="grid grid-cols-5 gap-2"
                    >
                      {PRESETS.map((preset) => (
                        <PresetButton
                          key={preset.seconds}
                          preset={preset}
                          isSelected={selectedPreset.seconds === preset.seconds && !showCustom}
                          onClick={() => handlePresetSelect(preset)}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Set counter */}
              <div className="mt-8 pt-8 border-t border-white/10">
                <h3 className="text-white/50 text-sm font-mono mb-4 text-center">SET TRACKER</h3>
                <SetCounter
                  sets={sets}
                  onIncrement={() => setSets((prev) => prev + 1)}
                  onDecrement={() => setSets((prev) => Math.max(0, prev - 1))}
                  onReset={() => setSets(0)}
                />
              </div>

              {/* Session stats */}
              <div className="mt-8 pt-8 border-t border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white/50 text-sm font-mono flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    SESSION STATS
                  </h3>
                  <button
                    onClick={handleResetSession}
                    className="text-white/30 hover:text-white/50 text-xs font-mono transition-colors"
                  >
                    RESET SESSION
                  </button>
                </div>
                <SessionStats sets={sets} totalRestTime={totalRestTime} />
              </div>
            </div>

            {/* Tips */}
            <motion.div
              variants={fadeUp}
              className="mt-6 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 p-6"
            >
              <h4 className="font-heading font-bold text-white mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                OPTIMAL REST TIMES
              </h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-white font-bold">Strength (1-5 reps)</p>
                    <p className="text-white/50">2-5 minutes between sets</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-white font-bold">Hypertrophy (6-12 reps)</p>
                    <p className="text-white/50">60-90 seconds between sets</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-white font-bold">Endurance (15+ reps)</p>
                    <p className="text-white/50">30-60 seconds between sets</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-white font-bold">Supersets</p>
                    <p className="text-white/50">No rest between exercises</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
