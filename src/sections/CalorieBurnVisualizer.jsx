import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  Timer,
  Scale,
  Pizza,
  Cookie,
  Footprints,
  TrendingUp,
  Bike,
  Dumbbell,
  Heart,
  Waves,
  Mountain,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

const ACTIVITIES = [
  { id: 'running', label: 'Running', icon: Footprints, metValue: 9.8, color: '#ef4444' },
  { id: 'cycling', label: 'Cycling', icon: Bike, metValue: 7.5, color: '#f97316' },
  { id: 'swimming', label: 'Swimming', icon: Waves, metValue: 8.0, color: '#3b82f6' },
  { id: 'weightlifting', label: 'Weights', icon: Dumbbell, metValue: 6.0, color: '#8b5cf6' },
  { id: 'hiit', label: 'HIIT', icon: Zap, metValue: 12.0, color: '#22c55e' },
  { id: 'yoga', label: 'Yoga', icon: Heart, metValue: 3.0, color: '#ec4899' },
  { id: 'hiking', label: 'Hiking', icon: Mountain, metValue: 6.5, color: '#14b8a6' },
  { id: 'walking', label: 'Walking', icon: Footprints, metValue: 3.8, color: '#6366f1' },
];

const EQUIVALENTS = [
  {
    id: 'pizza',
    label: 'Pizza Slices',
    icon: Pizza,
    calories: 285,
    color: '#f97316',
    emoji: '🍕'
  },
  {
    id: 'chocolate',
    label: 'Chocolate Bars',
    icon: Cookie,
    calories: 230,
    color: '#8b4513',
    emoji: '🍫'
  },
  {
    id: 'burger',
    label: 'Burgers',
    icon: Cookie,
    calories: 350,
    color: '#ef4444',
    emoji: '🍔'
  },
  {
    id: 'stairs',
    label: 'Floors Climbed',
    icon: TrendingUp,
    calories: 5, // per floor (about 10 stairs)
    color: '#22c55e',
    emoji: '🏃'
  },
  {
    id: 'miles',
    label: 'Miles Walked',
    icon: Footprints,
    calories: 100,
    color: '#3b82f6',
    emoji: '🚶'
  },
  {
    id: 'cookies',
    label: 'Cookies',
    icon: Cookie,
    calories: 150,
    color: '#d97706',
    emoji: '🍪'
  },
];

function AnimatedNumber({ value, duration = 1000 }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;
    const startValue = displayValue;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (value - startValue) * easeOut);

      setDisplayValue(current);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value]);

  return <span>{displayValue.toLocaleString()}</span>;
}

function ActivityButton({ activity, selected, onClick }) {
  const Icon = activity.icon;

  return (
    <motion.button
      onClick={onClick}
      className={`relative p-4 border transition-all duration-300 ${
        selected
          ? 'border-primary bg-primary/10'
          : 'border-white/10 bg-dark hover:border-white/30'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {selected && (
        <motion.div
          className="absolute inset-0"
          style={{ backgroundColor: activity.color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
        />
      )}
      <Icon
        className="w-6 h-6 mx-auto mb-2"
        style={{ color: selected ? activity.color : '#6b7280' }}
      />
      <span className={`text-xs font-mono ${selected ? 'text-white' : 'text-white/50'}`}>
        {activity.label.toUpperCase()}
      </span>
      {selected && (
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
          style={{ backgroundColor: activity.color }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        />
      )}
    </motion.button>
  );
}

function EquivalentCard({ equivalent, count, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 100 }}
      className="bg-dark border border-white/10 p-4 text-center relative overflow-hidden group hover:border-white/20 transition-colors"
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
        style={{ backgroundColor: equivalent.color }}
      />

      {/* Emoji display */}
      <div className="text-4xl mb-2">{equivalent.emoji}</div>

      {/* Count */}
      <div className="text-2xl font-heading font-black text-white">
        {count < 1 ? count.toFixed(1) : Math.round(count)}
      </div>

      {/* Label */}
      <div className="text-xs font-mono text-white/40 mt-1">
        {equivalent.label.toUpperCase()}
      </div>
    </motion.div>
  );
}

function CalorieDisplay({ calories, activity }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8"
    >
      {/* Flame animation */}
      <motion.div
        className="relative inline-block mb-4"
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Flame
          className="w-16 h-16"
          style={{ color: activity?.color || '#ef4444' }}
        />
        <motion.div
          className="absolute inset-0 blur-xl"
          style={{ backgroundColor: activity?.color || '#ef4444' }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>

      {/* Calorie count */}
      <div className="text-6xl sm:text-7xl font-heading font-black text-white mb-2">
        <AnimatedNumber value={calories} />
      </div>
      <div className="font-mono text-sm text-white/40 tracking-widest">
        CALORIES BURNED
      </div>
    </motion.div>
  );
}

export default function CalorieBurnVisualizer() {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [duration, setDuration] = useState(30);
  const [weight, setWeight] = useState(70);
  const [showResults, setShowResults] = useState(false);

  // Calculate calories: MET × weight(kg) × duration(hours)
  const calculateCalories = () => {
    if (!selectedActivity) return 0;
    const activity = ACTIVITIES.find(a => a.id === selectedActivity);
    const hours = duration / 60;
    return Math.round(activity.metValue * weight * hours);
  };

  const calories = calculateCalories();
  const activity = ACTIVITIES.find(a => a.id === selectedActivity);

  const handleCalculate = () => {
    if (selectedActivity && duration > 0) {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setShowResults(false);
    setSelectedActivity(null);
    setDuration(30);
  };

  return (
    <section className="py-20 lg:py-32 bg-dark-light relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-[0.02]">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            🔥
          </motion.div>
        ))}
      </div>

      {/* Gradient orb */}
      <div className="absolute bottom-1/4 -left-32 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center mb-12">
            <span className="font-mono text-primary text-xs tracking-widest">
              [ BURN CALCULATOR ]
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-white mt-4">
              CALORIE
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                {' '}BURNER
              </span>
            </h2>
            <p className="text-white/40 mt-4 max-w-xl mx-auto">
              See how many calories you burn and what that equals in everyday terms
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <div className="bg-dark border border-white/10 p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {!showResults ? (
                  <motion.div
                    key="input"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    {/* Activity Selection */}
                    <div className="mb-8">
                      <label className="block font-mono text-xs text-white/40 tracking-widest mb-4">
                        SELECT ACTIVITY
                      </label>
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                        {ACTIVITIES.map((activity) => (
                          <ActivityButton
                            key={activity.id}
                            activity={activity}
                            selected={selectedActivity === activity.id}
                            onClick={() => setSelectedActivity(activity.id)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Duration and Weight */}
                    <div className="grid sm:grid-cols-2 gap-6 mb-8">
                      {/* Duration */}
                      <div>
                        <label className="block font-mono text-xs text-white/40 tracking-widest mb-4">
                          <Timer className="w-4 h-4 inline mr-2" />
                          DURATION
                        </label>
                        <div className="bg-dark-lighter border border-white/10 p-4">
                          <input
                            type="range"
                            min="5"
                            max="120"
                            step="5"
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            className="w-full accent-primary"
                          />
                          <div className="flex justify-between mt-2">
                            <span className="text-white/30 text-xs font-mono">5 min</span>
                            <span className="text-2xl font-heading font-black text-white">
                              {duration} <span className="text-sm text-white/40">MIN</span>
                            </span>
                            <span className="text-white/30 text-xs font-mono">120 min</span>
                          </div>
                        </div>
                      </div>

                      {/* Weight */}
                      <div>
                        <label className="block font-mono text-xs text-white/40 tracking-widest mb-4">
                          <Scale className="w-4 h-4 inline mr-2" />
                          YOUR WEIGHT
                        </label>
                        <div className="bg-dark-lighter border border-white/10 p-4">
                          <input
                            type="range"
                            min="40"
                            max="150"
                            step="1"
                            value={weight}
                            onChange={(e) => setWeight(Number(e.target.value))}
                            className="w-full accent-primary"
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
                    </div>

                    {/* Preview */}
                    {selectedActivity && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-4 mb-6 bg-white/5 border border-white/10"
                      >
                        <span className="text-white/40 text-sm">Estimated burn: </span>
                        <span className="text-2xl font-heading font-bold text-primary">
                          {calories}
                        </span>
                        <span className="text-white/40 text-sm"> calories</span>
                      </motion.div>
                    )}

                    {/* Calculate Button */}
                    <motion.button
                      onClick={handleCalculate}
                      disabled={!selectedActivity}
                      className={`w-full py-4 font-heading font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                        selectedActivity
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
                          : 'bg-white/10 text-white/30 cursor-not-allowed'
                      }`}
                      whileHover={selectedActivity ? { scale: 1.02 } : {}}
                      whileTap={selectedActivity ? { scale: 0.98 } : {}}
                    >
                      <Flame className="w-5 h-5" />
                      CALCULATE BURN
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Calorie Display */}
                    <CalorieDisplay calories={calories} activity={activity} />

                    {/* Activity info */}
                    <div className="text-center mb-8">
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10">
                        {activity && <activity.icon className="w-4 h-4" style={{ color: activity.color }} />}
                        <span className="font-mono text-sm text-white/60">
                          {duration} MIN {activity?.label.toUpperCase()}
                        </span>
                      </span>
                    </div>

                    {/* Equivalents */}
                    <div className="mb-8">
                      <h3 className="font-mono text-xs text-white/40 tracking-widest mb-4 text-center">
                        THAT&apos;S EQUIVALENT TO BURNING OFF
                      </h3>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                        {EQUIVALENTS.map((eq, idx) => (
                          <EquivalentCard
                            key={eq.id}
                            equivalent={eq}
                            count={calories / eq.calories}
                            delay={idx * 0.1}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Fun fact */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="text-center p-4 bg-primary/10 border border-primary/20 mb-6"
                    >
                      <p className="text-white/60 text-sm">
                        💪 Keep it up! That&apos;s{' '}
                        <span className="text-primary font-bold">
                          {Math.round((calories / 2000) * 100)}%
                        </span>{' '}
                        of your daily calorie needs burned!
                      </p>
                    </motion.div>

                    {/* Reset Button */}
                    <button
                      onClick={handleReset}
                      className="w-full py-3 border border-white/10 text-white/50 hover:text-white hover:border-white/30 font-mono text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      CALCULATE AGAIN
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Bottom note */}
          <motion.p variants={fadeUp} className="text-center text-white/30 text-xs mt-6">
            * Calculations based on MET values. Actual calories may vary based on intensity and individual metabolism.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
