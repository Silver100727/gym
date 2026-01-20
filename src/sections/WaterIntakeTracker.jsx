import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Droplets,
  Scale,
  Sun,
  Thermometer,
  Activity,
  Plus,
  Minus,
  RotateCcw,
  Check,
  Sparkles,
} from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sedentary', icon: '🪑', multiplier: 1.0, description: 'Desk job, minimal exercise' },
  { id: 'light', label: 'Light', icon: '🚶', multiplier: 1.15, description: 'Light exercise 1-3x/week' },
  { id: 'moderate', label: 'Moderate', icon: '🏃', multiplier: 1.3, description: 'Moderate exercise 3-5x/week' },
  { id: 'intense', label: 'Intense', icon: '💪', multiplier: 1.5, description: 'Hard exercise 6-7x/week' },
];

const CLIMATE_OPTIONS = [
  { id: 'cool', label: 'Cool', icon: '❄️', multiplier: 1.0 },
  { id: 'mild', label: 'Mild', icon: '🌤️', multiplier: 1.1 },
  { id: 'hot', label: 'Hot', icon: '☀️', multiplier: 1.25 },
  { id: 'humid', label: 'Hot & Humid', icon: '🥵', multiplier: 1.4 },
];

const HYDRATION_TIPS = [
  "Drink a glass of water first thing in the morning",
  "Keep a water bottle at your desk",
  "Set hourly reminders to drink",
  "Drink water before each meal",
  "Add lemon or cucumber for flavor",
  "Match each coffee with a glass of water",
  "Drink extra water during workouts",
  "Track your intake with marks on your bottle",
];

function WaterGlass({ percentage, goal }) {
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className="relative w-48 h-72 mx-auto">
      {/* Glass container */}
      <svg viewBox="0 0 120 180" className="w-full h-full">
        {/* Glass outline */}
        <path
          d="M 20 10 L 15 160 Q 15 175 30 175 L 90 175 Q 105 175 105 160 L 100 10 Z"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="3"
        />

        {/* Water fill with wave animation */}
        <defs>
          <clipPath id="glassClip">
            <path d="M 20 10 L 15 160 Q 15 175 30 175 L 90 175 Q 105 175 105 160 L 100 10 Z" />
          </clipPath>
          <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>

        {/* Water */}
        <g clipPath="url(#glassClip)">
          <motion.rect
            x="0"
            y={180 - (clampedPercentage * 1.65)}
            width="120"
            height="180"
            fill="url(#waterGradient)"
            initial={{ y: 180 }}
            animate={{ y: 180 - (clampedPercentage * 1.65) }}
            transition={{ duration: 1, ease: "easeOut" }}
          />

          {/* Wave effect */}
          <motion.path
            d={`M 0 ${180 - (clampedPercentage * 1.65)}
                Q 30 ${180 - (clampedPercentage * 1.65) - 8} 60 ${180 - (clampedPercentage * 1.65)}
                T 120 ${180 - (clampedPercentage * 1.65)}
                V 180 H 0 Z`}
            fill="url(#waterGradient)"
            opacity="0.7"
            animate={{
              d: [
                `M 0 ${180 - (clampedPercentage * 1.65)} Q 30 ${180 - (clampedPercentage * 1.65) - 8} 60 ${180 - (clampedPercentage * 1.65)} T 120 ${180 - (clampedPercentage * 1.65)} V 180 H 0 Z`,
                `M 0 ${180 - (clampedPercentage * 1.65)} Q 30 ${180 - (clampedPercentage * 1.65) + 8} 60 ${180 - (clampedPercentage * 1.65)} T 120 ${180 - (clampedPercentage * 1.65)} V 180 H 0 Z`,
                `M 0 ${180 - (clampedPercentage * 1.65)} Q 30 ${180 - (clampedPercentage * 1.65) - 8} 60 ${180 - (clampedPercentage * 1.65)} T 120 ${180 - (clampedPercentage * 1.65)} V 180 H 0 Z`,
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Bubbles */}
          {clampedPercentage > 10 && [...Array(5)].map((_, i) => (
            <motion.circle
              key={i}
              cx={30 + i * 15}
              r={2 + Math.random() * 2}
              fill="rgba(255,255,255,0.4)"
              initial={{ cy: 180, opacity: 0 }}
              animate={{
                cy: [180, 180 - (clampedPercentage * 1.5)],
                opacity: [0, 0.6, 0]
              }}
              transition={{
                duration: 2 + Math.random(),
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeOut"
              }}
            />
          ))}
        </g>

        {/* Glass shine */}
        <path
          d="M 25 20 L 23 140 Q 23 145 28 145 L 32 145 Q 37 145 35 140 L 30 20 Z"
          fill="rgba(255,255,255,0.1)"
        />
      </svg>

      {/* Percentage display */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-4xl font-heading font-black text-white drop-shadow-lg">
            {Math.round(clampedPercentage)}%
          </div>
          <div className="text-xs font-mono text-white/70">
            of {goal}L goal
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function GlassCounter({ glasses, onAdd, onRemove, maxGlasses }) {
  return (
    <div className="flex items-center justify-center gap-4">
      <motion.button
        onClick={onRemove}
        disabled={glasses === 0}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
          glasses === 0
            ? 'bg-white/5 text-white/20 cursor-not-allowed'
            : 'bg-white/10 text-white hover:bg-red-500/20 hover:text-red-400'
        }`}
        whileHover={glasses > 0 ? { scale: 1.1 } : {}}
        whileTap={glasses > 0 ? { scale: 0.9 } : {}}
      >
        <Minus className="w-5 h-5" />
      </motion.button>

      <div className="flex gap-1 flex-wrap justify-center max-w-[200px]">
        {[...Array(maxGlasses)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`w-6 h-8 rounded-sm border-2 transition-all duration-300 ${
              i < glasses
                ? 'bg-sky-500/50 border-sky-400'
                : 'bg-white/5 border-white/10'
            }`}
          >
            {i < glasses && (
              <motion.div
                className="w-full h-full bg-sky-400/30 rounded-sm"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                style={{ originY: 1 }}
              />
            )}
          </motion.div>
        ))}
      </div>

      <motion.button
        onClick={onAdd}
        disabled={glasses >= maxGlasses}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
          glasses >= maxGlasses
            ? 'bg-white/5 text-white/20 cursor-not-allowed'
            : 'bg-sky-500/20 text-sky-400 hover:bg-sky-500/30'
        }`}
        whileHover={glasses < maxGlasses ? { scale: 1.1 } : {}}
        whileTap={glasses < maxGlasses ? { scale: 0.9 } : {}}
      >
        <Plus className="w-5 h-5" />
      </motion.button>
    </div>
  );
}

export default function WaterIntakeTracker() {
  const [weight, setWeight] = useState(70);
  const [activity, setActivity] = useState('moderate');
  const [climate, setClimate] = useState('mild');
  const [glassesConsumed, setGlassesConsumed] = useState(0);
  const [showTracker, setShowTracker] = useState(false);
  const [tip] = useState(() => HYDRATION_TIPS[Math.floor(Math.random() * HYDRATION_TIPS.length)]);

  // Calculate daily water need: Base (30ml per kg) × activity × climate
  const activityData = ACTIVITY_LEVELS.find(a => a.id === activity);
  const climateData = CLIMATE_OPTIONS.find(c => c.id === climate);

  const baseWater = weight * 30; // ml
  const dailyWaterMl = baseWater * activityData.multiplier * climateData.multiplier;
  const dailyWaterL = (dailyWaterMl / 1000).toFixed(1);
  const glassSize = 250; // ml per glass
  const totalGlasses = Math.ceil(dailyWaterMl / glassSize);
  const percentage = (glassesConsumed / totalGlasses) * 100;

  const handleCalculate = () => {
    setShowTracker(true);
    setGlassesConsumed(0);
  };

  const handleReset = () => {
    setShowTracker(false);
    setGlassesConsumed(0);
  };

  return (
    <section className="py-20 lg:py-32 bg-dark relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #38bdf8 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Gradient orb */}
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -left-32 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center mb-12">
            <span className="font-mono text-sky-400 text-xs tracking-widest">
              [ HYDRATION CALCULATOR ]
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-white mt-4">
              WATER
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                {' '}TRACKER
              </span>
            </h2>
            <p className="text-white/40 mt-4 max-w-xl mx-auto">
              Calculate your daily water needs and track your hydration throughout the day
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <div className="bg-dark-lighter border border-white/10 p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {!showTracker ? (
                  <motion.div
                    key="calculator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    {/* Weight Input */}
                    <div>
                      <label className="flex items-center gap-2 font-mono text-xs text-white/40 tracking-widest mb-4">
                        <Scale className="w-4 h-4" />
                        YOUR WEIGHT
                      </label>
                      <div className="bg-dark border border-white/10 p-4">
                        <input
                          type="range"
                          min="40"
                          max="150"
                          value={weight}
                          onChange={(e) => setWeight(Number(e.target.value))}
                          className="w-full accent-sky-400"
                        />
                        <div className="flex justify-between mt-2">
                          <span className="text-white/30 text-xs font-mono">40 kg</span>
                          <span className="text-2xl font-heading font-black text-white">
                            {weight} <span className="text-sm text-white/40">KG</span>
                          </span>
                          <span className="text-white/30 text-xs font-mono">150 kg</span>
                        </div>
                      </div>
                    </div>

                    {/* Activity Level */}
                    <div>
                      <label className="flex items-center gap-2 font-mono text-xs text-white/40 tracking-widest mb-4">
                        <Activity className="w-4 h-4" />
                        ACTIVITY LEVEL
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {ACTIVITY_LEVELS.map((level) => (
                          <motion.button
                            key={level.id}
                            onClick={() => setActivity(level.id)}
                            className={`p-4 border text-center transition-all ${
                              activity === level.id
                                ? 'border-sky-400 bg-sky-500/10'
                                : 'border-white/10 bg-dark hover:border-white/30'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span className="text-2xl block mb-1">{level.icon}</span>
                            <span className={`text-sm font-bold ${
                              activity === level.id ? 'text-sky-400' : 'text-white'
                            }`}>
                              {level.label}
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Climate */}
                    <div>
                      <label className="flex items-center gap-2 font-mono text-xs text-white/40 tracking-widest mb-4">
                        <Thermometer className="w-4 h-4" />
                        CLIMATE / WEATHER
                      </label>
                      <div className="grid grid-cols-4 gap-3">
                        {CLIMATE_OPTIONS.map((option) => (
                          <motion.button
                            key={option.id}
                            onClick={() => setClimate(option.id)}
                            className={`p-3 border text-center transition-all ${
                              climate === option.id
                                ? 'border-sky-400 bg-sky-500/10'
                                : 'border-white/10 bg-dark hover:border-white/30'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span className="text-xl block">{option.icon}</span>
                            <span className={`text-xs font-mono ${
                              climate === option.id ? 'text-sky-400' : 'text-white/50'
                            }`}>
                              {option.label}
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Preview */}
                    <div className="text-center py-6 bg-sky-500/5 border border-sky-500/20">
                      <Droplets className="w-8 h-8 text-sky-400 mx-auto mb-2" />
                      <div className="text-3xl font-heading font-black text-white">
                        {dailyWaterL}L
                      </div>
                      <div className="text-white/40 text-sm">
                        = {totalGlasses} glasses per day
                      </div>
                    </div>

                    {/* Calculate Button */}
                    <motion.button
                      onClick={handleCalculate}
                      className="w-full py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-heading font-bold text-lg flex items-center justify-center gap-2 hover:from-sky-600 hover:to-blue-700 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Droplets className="w-5 h-5" />
                      START TRACKING
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="tracker"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-8"
                  >
                    {/* Water Glass Visualization */}
                    <WaterGlass percentage={percentage} goal={dailyWaterL} />

                    {/* Status */}
                    <div className="text-center">
                      {percentage >= 100 ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400"
                        >
                          <Check className="w-5 h-5" />
                          <span className="font-mono text-sm">GOAL REACHED!</span>
                          <Sparkles className="w-5 h-5" />
                        </motion.div>
                      ) : (
                        <div className="text-white/40 text-sm">
                          <span className="text-sky-400 font-bold">{totalGlasses - glassesConsumed}</span> glasses to go
                        </div>
                      )}
                    </div>

                    {/* Glass Counter */}
                    <div className="py-4">
                      <div className="text-center mb-4">
                        <span className="text-3xl font-heading font-black text-white">
                          {glassesConsumed}
                        </span>
                        <span className="text-white/40"> / {totalGlasses} glasses</span>
                      </div>
                      <GlassCounter
                        glasses={glassesConsumed}
                        onAdd={() => setGlassesConsumed(g => Math.min(g + 1, totalGlasses))}
                        onRemove={() => setGlassesConsumed(g => Math.max(g - 1, 0))}
                        maxGlasses={totalGlasses}
                      />
                    </div>

                    {/* Quick Add Buttons */}
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3].map((num) => (
                        <motion.button
                          key={num}
                          onClick={() => setGlassesConsumed(g => Math.min(g + num, totalGlasses))}
                          className="px-4 py-2 bg-white/5 border border-white/10 hover:border-sky-400/50 hover:bg-sky-500/10 text-white/60 hover:text-sky-400 font-mono text-sm transition-all"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          +{num} 💧
                        </motion.button>
                      ))}
                    </div>

                    {/* Tip */}
                    <div className="p-4 bg-sky-500/5 border border-sky-500/20 text-center">
                      <Sun className="w-5 h-5 text-sky-400 mx-auto mb-2" />
                      <p className="text-white/60 text-sm">
                        <span className="text-sky-400">Tip:</span> {tip}
                      </p>
                    </div>

                    {/* Reset Button */}
                    <button
                      onClick={handleReset}
                      className="w-full py-3 border border-white/10 text-white/50 hover:text-white hover:border-white/30 font-mono text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      RECALCULATE
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Info */}
          <motion.p variants={fadeUp} className="text-center text-white/30 text-xs mt-6">
            * Base calculation: 30ml per kg body weight, adjusted for activity and climate
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
