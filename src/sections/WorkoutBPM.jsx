import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Music,
  Play,
  Zap,
  Heart,
  Dumbbell,
  Timer,
  Waves,
  Volume2,
  Hand
} from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

// Workout types with BPM ranges
const WORKOUT_TYPES = [
  {
    id: 'warmup',
    name: 'Warm-Up',
    icon: Heart,
    color: '#22c55e',
    bpmRange: [100, 120],
    description: 'Light stretching & mobility',
    genres: ['Chill Pop', 'Lo-fi', 'Acoustic'],
  },
  {
    id: 'strength',
    name: 'Strength Training',
    icon: Dumbbell,
    color: '#ef4444',
    bpmRange: [130, 150],
    description: 'Heavy lifts & compound moves',
    genres: ['Hip-Hop', 'Rock', 'Metal'],
  },
  {
    id: 'hiit',
    name: 'HIIT / Cardio',
    icon: Zap,
    color: '#f97316',
    bpmRange: [150, 180],
    description: 'High intensity intervals',
    genres: ['EDM', 'Drum & Bass', 'Techno'],
  },
  {
    id: 'running',
    name: 'Running',
    icon: Timer,
    color: '#3b82f6',
    bpmRange: [150, 170],
    description: 'Steady state cardio',
    genres: ['Pop', 'Dance', 'House'],
  },
  {
    id: 'cooldown',
    name: 'Cool-Down',
    icon: Waves,
    color: '#8b5cf6',
    bpmRange: [80, 100],
    description: 'Recovery & stretching',
    genres: ['Ambient', 'Classical', 'Jazz'],
  },
];

// Intensity modifiers
const INTENSITIES = [
  { id: 'low', name: 'Low', modifier: -10, emoji: '😌' },
  { id: 'medium', name: 'Medium', modifier: 0, emoji: '💪' },
  { id: 'high', name: 'High', modifier: 10, emoji: '🔥' },
  { id: 'max', name: 'Maximum', modifier: 20, emoji: '⚡' },
];

// Pulsing beat visualizer
function BeatVisualizer({ bpm, isPlaying }) {
  const interval = 60000 / bpm; // ms per beat

  return (
    <div className="relative w-48 h-48 mx-auto">
      {/* Outer rings */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border-2"
          style={{ borderColor: `rgba(255, 87, 34, ${0.3 - i * 0.1})` }}
          animate={isPlaying ? {
            scale: [1, 1.2 + i * 0.1, 1],
            opacity: [0.5, 0, 0.5],
          } : {}}
          transition={{
            duration: interval / 1000,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Center circle */}
      <motion.div
        className="absolute inset-8 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center"
        animate={isPlaying ? {
          scale: [1, 1.1, 1],
        } : {}}
        transition={{
          duration: interval / 1000,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="text-center">
          <motion.span
            key={bpm}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            className="font-mono text-4xl font-black text-white block"
          >
            {bpm}
          </motion.span>
          <span className="text-white/70 text-sm font-mono">BPM</span>
        </div>
      </motion.div>

      {/* Beat indicator dots */}
      {isPlaying && [...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary rounded-full"
          style={{
            left: '50%',
            top: '50%',
            transform: `rotate(${i * 45}deg) translateY(-80px)`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: interval / 1000,
            repeat: Infinity,
            delay: (i * interval) / 8000,
          }}
        />
      ))}
    </div>
  );
}

// Workout type card
function WorkoutTypeCard({ workout, isSelected, onClick }) {
  const Icon = workout.icon;

  return (
    <motion.button
      onClick={onClick}
      className={`relative p-4 border text-left transition-all ${
        isSelected
          ? 'bg-white/10 border-white/30'
          : 'bg-white/5 border-white/10 hover:border-white/20'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: workout.color }}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-heading font-bold text-white text-sm">{workout.name}</h4>
          <p className="text-white/50 text-xs">{workout.description}</p>
          <p className="font-mono text-xs mt-1" style={{ color: workout.color }}>
            {workout.bpmRange[0]}-{workout.bpmRange[1]} BPM
          </p>
        </div>
      </div>
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-3 h-3 rounded-full bg-primary"
        />
      )}
    </motion.button>
  );
}

// Tap tempo component
function TapTempo({ onBPMDetected }) {
  const [taps, setTaps] = useState([]);
  const [detectedBPM, setDetectedBPM] = useState(null);
  const timeoutRef = useRef(null);

  const handleTap = useCallback(() => {
    const now = Date.now();

    // Clear old taps after 2 seconds of inactivity
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setTaps([]);
      setDetectedBPM(null);
    }, 2000);

    setTaps(prev => {
      const newTaps = [...prev, now].slice(-8); // Keep last 8 taps

      if (newTaps.length >= 2) {
        // Calculate average interval
        let totalInterval = 0;
        for (let i = 1; i < newTaps.length; i++) {
          totalInterval += newTaps[i] - newTaps[i - 1];
        }
        const avgInterval = totalInterval / (newTaps.length - 1);
        const bpm = Math.round(60000 / avgInterval);

        if (bpm >= 60 && bpm <= 200) {
          setDetectedBPM(bpm);
          if (newTaps.length >= 4) {
            onBPMDetected(bpm);
          }
        }
      }

      return newTaps;
    });
  }, [onBPMDetected]);

  return (
    <div className="text-center">
      <motion.button
        onClick={handleTap}
        className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center mx-auto mb-3"
        whileTap={{ scale: 0.9 }}
      >
        <Hand className="w-8 h-8 text-white" />
      </motion.button>
      <p className="text-white/50 text-sm">Tap to detect tempo</p>
      {detectedBPM && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-primary text-lg mt-2"
        >
          Detected: {detectedBPM} BPM
        </motion.p>
      )}
    </div>
  );
}

// BPM slider component
function BPMSlider({ value, min, max, onChange, color }) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-3 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${color} 0%, ${color} ${percentage}%, rgba(255,255,255,0.1) ${percentage}%, rgba(255,255,255,0.1) 100%)`,
        }}
      />
      <div className="flex justify-between text-xs font-mono text-white/30">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

export default function WorkoutBPM() {
  const [selectedWorkout, setSelectedWorkout] = useState(WORKOUT_TYPES[1]);
  const [intensity, setIntensity] = useState(INTENSITIES[1]);
  const [customBPM, setCustomBPM] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Calculate recommended BPM
  const baseBPM = Math.round((selectedWorkout.bpmRange[0] + selectedWorkout.bpmRange[1]) / 2);
  const recommendedBPM = customBPM || (baseBPM + intensity.modifier);
  const minBPM = selectedWorkout.bpmRange[0] + intensity.modifier - 10;
  const maxBPM = selectedWorkout.bpmRange[1] + intensity.modifier + 10;

  const handleTapBPM = (bpm) => {
    setCustomBPM(bpm);
  };

  const resetBPM = () => {
    setCustomBPM(null);
  };

  return (
    <section className="relative py-24 bg-dark overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />

        {/* Sound wave pattern */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-white mx-1"
              animate={{
                height: [20, 40 + Math.random() * 60, 20],
              }}
              transition={{
                duration: 0.5 + Math.random() * 0.5,
                repeat: Infinity,
                delay: i * 0.1,
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
              <Music className="w-4 h-4" />
              MUSIC TEMPO
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-black text-white mb-4">
              WORKOUT{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">
                BPM GUIDE
              </span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Match your music tempo to your workout intensity for maximum performance and motivation.
            </p>
          </motion.div>

          {/* Main content */}
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left - Controls */}
              <div className="space-y-6">
                {/* Workout type selection */}
                <motion.div
                  variants={fadeUp}
                  className="relative bg-dark/50 border border-white/10 p-6"
                >
                  <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-primary/30" />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-primary/30" />

                  <h3 className="font-heading font-bold text-white mb-4">WORKOUT TYPE</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {WORKOUT_TYPES.map((workout) => (
                      <WorkoutTypeCard
                        key={workout.id}
                        workout={workout}
                        isSelected={selectedWorkout.id === workout.id}
                        onClick={() => {
                          setSelectedWorkout(workout);
                          setCustomBPM(null);
                        }}
                      />
                    ))}
                  </div>
                </motion.div>

                {/* Intensity selection */}
                <motion.div
                  variants={fadeUp}
                  className="bg-dark/50 border border-white/10 p-6"
                >
                  <h3 className="font-heading font-bold text-white mb-4">INTENSITY LEVEL</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {INTENSITIES.map((int) => (
                      <button
                        key={int.id}
                        onClick={() => {
                          setIntensity(int);
                          setCustomBPM(null);
                        }}
                        className={`p-3 border text-center transition-all ${
                          intensity.id === int.id
                            ? 'bg-primary/20 border-primary'
                            : 'bg-white/5 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <span className="text-2xl block mb-1">{int.emoji}</span>
                        <span className={`text-xs font-bold ${intensity.id === int.id ? 'text-white' : 'text-white/50'}`}>
                          {int.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Fine-tune BPM */}
                <motion.div
                  variants={fadeUp}
                  className="bg-dark/50 border border-white/10 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading font-bold text-white">FINE-TUNE BPM</h3>
                    {customBPM && (
                      <button
                        onClick={resetBPM}
                        className="text-white/50 hover:text-white text-xs font-mono"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <BPMSlider
                    value={recommendedBPM}
                    min={60}
                    max={200}
                    onChange={setCustomBPM}
                    color={selectedWorkout.color}
                  />
                </motion.div>

                {/* Tap tempo */}
                <motion.div
                  variants={fadeUp}
                  className="bg-dark/50 border border-white/10 p-6"
                >
                  <h3 className="font-heading font-bold text-white mb-4 text-center">TAP TEMPO</h3>
                  <TapTempo onBPMDetected={handleTapBPM} />
                </motion.div>
              </div>

              {/* Right - Visualization */}
              <div className="space-y-6">
                {/* BPM visualizer */}
                <motion.div
                  variants={fadeUp}
                  className="relative bg-dark/50 border border-white/10 p-8"
                >
                  <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-primary/30" />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-primary/30" />

                  <h3 className="font-heading font-bold text-white mb-6 text-center">
                    RECOMMENDED TEMPO
                  </h3>

                  <BeatVisualizer bpm={recommendedBPM} isPlaying={isPlaying} />

                  <motion.button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`mt-6 w-full py-3 font-heading font-bold flex items-center justify-center gap-2 transition-all ${
                      isPlaying
                        ? 'bg-white/10 text-white border border-white/20'
                        : 'bg-primary text-white'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isPlaying ? (
                      <>
                        <Volume2 className="w-5 h-5" />
                        STOP VISUALIZATION
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        VISUALIZE BEAT
                      </>
                    )}
                  </motion.button>
                </motion.div>

                {/* Genre suggestions */}
                <motion.div
                  variants={fadeUp}
                  className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 p-6"
                >
                  <h3 className="font-heading font-bold text-white mb-4 flex items-center gap-2">
                    <Music className="w-5 h-5 text-primary" />
                    SUGGESTED GENRES
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedWorkout.genres.map((genre) => (
                      <span
                        key={genre}
                        className="px-4 py-2 bg-white/10 text-white text-sm font-mono"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                  <p className="text-white/50 text-sm mt-4">
                    These genres typically have songs in the {selectedWorkout.bpmRange[0]}-{selectedWorkout.bpmRange[1]} BPM range.
                  </p>
                </motion.div>

                {/* BPM reference chart */}
                <motion.div
                  variants={fadeUp}
                  className="bg-dark/50 border border-white/10 p-6"
                >
                  <h3 className="font-heading font-bold text-white mb-4">BPM QUICK REFERENCE</h3>
                  <div className="space-y-2">
                    {WORKOUT_TYPES.map((workout) => {
                      const Icon = workout.icon;
                      const width = ((workout.bpmRange[1] - workout.bpmRange[0]) / 100) * 100;
                      const left = ((workout.bpmRange[0] - 60) / 140) * 100;

                      return (
                        <div key={workout.id} className="flex items-center gap-3">
                          <Icon className="w-4 h-4 text-white/50 flex-shrink-0" />
                          <div className="flex-1 h-4 bg-white/5 relative rounded-full overflow-hidden">
                            <motion.div
                              className="absolute top-0 bottom-0 rounded-full"
                              style={{
                                backgroundColor: workout.color,
                                left: `${left}%`,
                                width: `${width}%`,
                              }}
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                          <span className="text-white/50 text-xs font-mono w-20 text-right">
                            {workout.bpmRange[0]}-{workout.bpmRange[1]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-white/30 font-mono">
                    <span>60</span>
                    <span>100</span>
                    <span>140</span>
                    <span>180</span>
                    <span>200</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
