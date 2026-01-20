import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Timer, Play, Pause, RotateCcw, Settings, Volume2, VolumeX, Zap, Flame } from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

const PRESETS = [
  { name: 'Classic Tabata', work: 20, rest: 10, rounds: 8, sets: 1 },
  { name: 'HIIT Standard', work: 30, rest: 30, rounds: 10, sets: 1 },
  { name: 'EMOM', work: 40, rest: 20, rounds: 10, sets: 1 },
  { name: 'Sprint Intervals', work: 15, rest: 45, rounds: 8, sets: 2 },
  { name: 'Endurance', work: 45, rest: 15, rounds: 12, sets: 1 },
];

export default function TabataTimer() {
  const [workTime, setWorkTime] = useState(20);
  const [restTime, setRestTime] = useState(10);
  const [rounds, setRounds] = useState(8);
  const [sets, setSets] = useState(1);

  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('ready'); // ready, work, rest, complete
  const [currentRound, setCurrentRound] = useState(1);
  const [currentSet, setCurrentSet] = useState(1);
  const [timeLeft, setTimeLeft] = useState(workTime);
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const intervalRef = useRef(null);
  const audioContextRef = useRef(null);

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

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration / 1000);
    } catch (e) {
      // Audio not supported
    }
  }, [soundEnabled]);

  const reset = () => {
    setIsRunning(false);
    setCurrentPhase('ready');
    setCurrentRound(1);
    setCurrentSet(1);
    setTimeLeft(workTime);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const toggleTimer = () => {
    if (currentPhase === 'ready') {
      setCurrentPhase('work');
      setTimeLeft(workTime);
      playBeep(1000, 500);
    }
    setIsRunning(!isRunning);
  };

  const applyPreset = (preset) => {
    setWorkTime(preset.work);
    setRestTime(preset.rest);
    setRounds(preset.rounds);
    setSets(preset.sets);
    reset();
  };

  useEffect(() => {
    if (isRunning && currentPhase !== 'complete') {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Time's up for current phase
            if (currentPhase === 'work') {
              playBeep(600, 300);
              if (currentRound >= rounds) {
                if (currentSet >= sets) {
                  setCurrentPhase('complete');
                  setIsRunning(false);
                  playBeep(1200, 1000);
                  return 0;
                } else {
                  // Start new set
                  setCurrentSet(s => s + 1);
                  setCurrentRound(1);
                  setCurrentPhase('rest');
                  return restTime;
                }
              } else {
                setCurrentPhase('rest');
                return restTime;
              }
            } else if (currentPhase === 'rest') {
              playBeep(1000, 300);
              setCurrentRound(r => r + 1);
              setCurrentPhase('work');
              return workTime;
            }
          }

          // Warning beeps at 3, 2, 1
          if (prev <= 4 && prev > 1) {
            playBeep(800, 100);
          }

          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, currentPhase, workTime, restTime, rounds, sets, currentRound, currentSet, playBeep]);

  useEffect(() => {
    reset();
  }, [workTime, restTime, rounds, sets]);

  const totalWorkoutTime = (workTime + restTime) * rounds * sets;
  const elapsedTime = currentPhase === 'complete'
    ? totalWorkoutTime
    : ((currentSet - 1) * rounds + (currentRound - 1)) * (workTime + restTime) +
      (currentPhase === 'rest' ? workTime + (restTime - timeLeft) : workTime - timeLeft);

  const progress = (elapsedTime / totalWorkoutTime) * 100;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'work': return 'from-red-500 to-orange-500';
      case 'rest': return 'from-green-500 to-teal-500';
      case 'complete': return 'from-primary to-yellow-500';
      default: return 'from-zinc-700 to-zinc-600';
    }
  };

  const getPhaseText = () => {
    switch (currentPhase) {
      case 'work': return 'WORK!';
      case 'rest': return 'REST';
      case 'complete': return 'COMPLETE!';
      default: return 'READY';
    }
  };

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
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
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium">Interval Training</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Tabata <span className="text-primary">Timer</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            High-intensity interval training timer with customizable work/rest periods
          </p>
        </motion.div>

        <div className="max-w-xl mx-auto">
          {/* Timer Display */}
          <motion.div
            variants={fadeUp}
            className={`relative bg-gradient-to-br ${getPhaseColor()} rounded-3xl p-8 mb-6 overflow-hidden`}
          >
            {/* Animated Background Pulse */}
            {currentPhase === 'work' && isRunning && (
              <motion.div
                className="absolute inset-0 bg-white/10"
                animate={{ opacity: [0, 0.2, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}

            <div className="relative z-10 text-center">
              {/* Phase Label */}
              <motion.p
                key={currentPhase}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-white/80 text-2xl font-bold mb-4"
              >
                {getPhaseText()}
              </motion.p>

              {/* Main Timer */}
              <motion.p
                key={timeLeft}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className="text-8xl font-bold text-white mb-4 font-mono"
              >
                {formatTime(timeLeft)}
              </motion.p>

              {/* Round/Set Info */}
              <div className="flex justify-center gap-8 text-white/80">
                <div>
                  <p className="text-sm">Round</p>
                  <p className="text-2xl font-bold">{currentRound}/{rounds}</p>
                </div>
                {sets > 1 && (
                  <div>
                    <p className="text-sm">Set</p>
                    <p className="text-2xl font-bold">{currentSet}/{sets}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <motion.div variants={fadeUp} className="mb-6">
            <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="flex justify-between text-gray-500 text-sm mt-2">
              <span>{formatTime(Math.round(elapsedTime))}</span>
              <span>{formatTime(totalWorkoutTime)}</span>
            </div>
          </motion.div>

          {/* Controls */}
          <motion.div variants={fadeUp} className="flex justify-center gap-4 mb-8">
            <motion.button
              onClick={reset}
              className="p-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw className="w-6 h-6" />
            </motion.button>
            <motion.button
              onClick={toggleTimer}
              disabled={currentPhase === 'complete'}
              className={`px-12 py-4 rounded-xl font-semibold text-lg transition-all ${
                currentPhase === 'complete'
                  ? 'bg-zinc-700 text-gray-500 cursor-not-allowed'
                  : 'bg-primary text-black hover:bg-primary/90'
              }`}
              whileHover={currentPhase !== 'complete' ? { scale: 1.05 } : {}}
              whileTap={currentPhase !== 'complete' ? { scale: 0.95 } : {}}
            >
              {isRunning ? <Pause className="w-6 h-6 inline" /> : <Play className="w-6 h-6 inline" />}
              <span className="ml-2">{isRunning ? 'Pause' : 'Start'}</span>
            </motion.button>
            <motion.button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-4 rounded-xl transition-all ${
                soundEnabled ? 'bg-primary text-black' : 'bg-zinc-800 text-gray-400'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            </motion.button>
          </motion.div>

          {/* Presets */}
          <motion.div variants={fadeUp} className="mb-6">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Flame className="w-5 h-5 text-primary" />
              Quick Presets
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {PRESETS.map(preset => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-left transition-all"
                >
                  <p className="text-white text-sm font-medium">{preset.name}</p>
                  <p className="text-gray-500 text-xs">
                    {preset.work}s/{preset.rest}s × {preset.rounds}
                  </p>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Custom Settings */}
          <motion.div variants={fadeUp}>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-800 hover:bg-zinc-700 text-gray-400 rounded-xl transition-all"
            >
              <Settings className="w-5 h-5" />
              Custom Settings
            </button>

            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl p-6 border border-zinc-800"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Work (sec)</label>
                    <input
                      type="number"
                      value={workTime}
                      onChange={(e) => setWorkTime(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-center focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Rest (sec)</label>
                    <input
                      type="number"
                      value={restTime}
                      onChange={(e) => setRestTime(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-center focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Rounds</label>
                    <input
                      type="number"
                      value={rounds}
                      onChange={(e) => setRounds(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-center focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Sets</label>
                    <input
                      type="number"
                      value={sets}
                      onChange={(e) => setSets(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-center focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-primary/20 rounded-tl-3xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-primary/20 rounded-br-3xl" />
      </motion.div>
    </section>
  );
}
