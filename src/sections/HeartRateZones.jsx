import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Activity, Flame, Zap, Target, TrendingUp, Info } from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

// Heart rate zones data
const ZONES = [
  {
    id: 1,
    name: 'WARM UP',
    range: [50, 60],
    color: '#3b82f6',
    gradient: 'from-blue-500 to-blue-600',
    icon: Activity,
    description: 'Light activity, recovery. Improves overall health and helps with recovery.',
    benefits: ['Active recovery', 'Warm up/cool down', 'Improves blood flow'],
    feel: 'Very light effort, can hold a conversation easily',
    duration: '20-40 min',
    pulseSpeed: 1.2,
  },
  {
    id: 2,
    name: 'FAT BURN',
    range: [60, 70],
    color: '#22c55e',
    gradient: 'from-green-500 to-green-600',
    icon: Flame,
    description: 'Moderate activity. Best zone for burning fat as fuel.',
    benefits: ['Maximum fat burning', 'Builds aerobic base', 'Improves endurance'],
    feel: 'Comfortable pace, can talk in short sentences',
    duration: '30-60 min',
    pulseSpeed: 0.9,
  },
  {
    id: 3,
    name: 'CARDIO',
    range: [70, 80],
    color: '#f97316',
    gradient: 'from-orange-500 to-orange-600',
    icon: Heart,
    description: 'Harder effort. Improves cardiovascular fitness.',
    benefits: ['Improves heart strength', 'Increases VO2 max', 'Burns more calories'],
    feel: 'Challenging, can speak only a few words',
    duration: '20-40 min',
    pulseSpeed: 0.7,
  },
  {
    id: 4,
    name: 'PEAK',
    range: [80, 90],
    color: '#ef4444',
    gradient: 'from-red-500 to-red-600',
    icon: Zap,
    description: 'High intensity. Increases speed and power.',
    benefits: ['Increases speed', 'Builds power', 'Improves performance'],
    feel: 'Very hard, can barely speak',
    duration: '10-20 min',
    pulseSpeed: 0.5,
  },
  {
    id: 5,
    name: 'MAX',
    range: [90, 100],
    color: '#dc2626',
    gradient: 'from-red-600 to-red-700',
    icon: Target,
    description: 'Maximum effort. Only for short bursts.',
    benefits: ['Maximum performance', 'Sprint training', 'HIIT intervals'],
    feel: 'All-out effort, cannot speak',
    duration: '< 5 min',
    pulseSpeed: 0.35,
  },
];

// Animated heart SVG component
function PulsingHeart({ zone, bpm }) {
  const pulseSpeed = zone ? zone.pulseSpeed : 1;
  const heartColor = zone ? zone.color : '#ef4444';

  return (
    <div className="relative w-48 h-48 mx-auto">
      {/* Pulse rings */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: heartColor }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0, 0.3],
        }}
        transition={{
          duration: pulseSpeed,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute inset-4 rounded-full"
        style={{ backgroundColor: heartColor }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0, 0.2],
        }}
        transition={{
          duration: pulseSpeed,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: pulseSpeed * 0.2,
        }}
      />

      {/* Heart SVG */}
      <motion.svg
        viewBox="0 0 24 24"
        className="absolute inset-8 w-32 h-32"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: pulseSpeed,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <motion.path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill={heartColor}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
        />
      </motion.svg>

      {/* BPM Display */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: pulseSpeed,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="text-center">
          <motion.span
            key={bpm}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-heading font-black text-white"
          >
            {bpm}
          </motion.span>
          <p className="text-[10px] font-mono text-white/70 uppercase tracking-wider">BPM</p>
        </div>
      </motion.div>
    </div>
  );
}

// Zone bar component
function ZoneBar({ zone, maxHR, isSelected, onClick }) {
  const Icon = zone.icon;
  const minBPM = Math.round(maxHR * (zone.range[0] / 100));
  const maxBPM = Math.round(maxHR * (zone.range[1] / 100));
  const widthPercent = zone.range[1] - zone.range[0];

  return (
    <motion.button
      onClick={onClick}
      className={`relative w-full text-left transition-all ${
        isSelected ? 'scale-105' : 'hover:scale-102'
      }`}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className={`flex items-center gap-3 p-3 border transition-all ${
          isSelected
            ? 'bg-white/10 border-white/20'
            : 'bg-dark/50 border-white/5 hover:border-white/10'
        }`}
      >
        {/* Zone indicator */}
        <div
          className={`w-10 h-10 flex items-center justify-center bg-gradient-to-br ${zone.gradient}`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>

        {/* Zone info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="font-heading font-bold text-sm text-white">
              ZONE {zone.id}: {zone.name}
            </span>
            <span className="font-mono text-xs text-white/50">
              {minBPM}-{maxBPM} BPM
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-white/5 overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${zone.gradient}`}
              initial={{ width: 0 }}
              animate={{ width: `${widthPercent * 5}%` }}
              transition={{ duration: 0.5, delay: zone.id * 0.1 }}
            />
          </div>
        </div>

        {/* Selection indicator */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-2 h-2 rounded-full bg-primary"
          />
        )}
      </div>
    </motion.button>
  );
}

// Zone details panel
function ZoneDetails({ zone, maxHR }) {
  const Icon = zone.icon;
  const minBPM = Math.round(maxHR * (zone.range[0] / 100));
  const maxBPM = Math.round(maxHR * (zone.range[1] / 100));
  const midBPM = Math.round((minBPM + maxBPM) / 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-dark/80 border border-white/10 p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div
          className={`w-14 h-14 flex items-center justify-center bg-gradient-to-br ${zone.gradient}`}
        >
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div>
          <h4 className="font-heading font-bold text-xl text-white">
            ZONE {zone.id}: {zone.name}
          </h4>
          <p className="font-mono text-sm" style={{ color: zone.color }}>
            {zone.range[0]}% - {zone.range[1]}% MAX HR
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-white/70 text-sm mb-6">{zone.description}</p>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white/5 p-3 text-center">
          <p className="font-mono text-2xl font-bold" style={{ color: zone.color }}>
            {minBPM}-{maxBPM}
          </p>
          <p className="text-[10px] text-white/50 uppercase tracking-wider">BPM Range</p>
        </div>
        <div className="bg-white/5 p-3 text-center">
          <p className="font-mono text-2xl font-bold text-white">{midBPM}</p>
          <p className="text-[10px] text-white/50 uppercase tracking-wider">Target BPM</p>
        </div>
        <div className="bg-white/5 p-3 text-center">
          <p className="font-mono text-2xl font-bold text-white">{zone.duration}</p>
          <p className="text-[10px] text-white/50 uppercase tracking-wider">Duration</p>
        </div>
      </div>

      {/* Benefits */}
      <div className="mb-4">
        <h5 className="font-heading font-bold text-sm text-white mb-2 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          BENEFITS
        </h5>
        <ul className="space-y-1">
          {zone.benefits.map((benefit, idx) => (
            <li key={idx} className="flex items-center gap-2 text-sm text-white/70">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: zone.color }} />
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      {/* How it feels */}
      <div className="bg-white/5 p-3 border-l-2" style={{ borderColor: zone.color }}>
        <p className="text-xs text-white/50 uppercase tracking-wider mb-1">How it feels</p>
        <p className="text-sm text-white/80">{zone.feel}</p>
      </div>
    </motion.div>
  );
}

export default function HeartRateZones() {
  const [age, setAge] = useState(30);
  const [selectedZone, setSelectedZone] = useState(ZONES[1]); // Default to Fat Burn
  const [isCalculated, setIsCalculated] = useState(false);

  // Calculate max heart rate (220 - age formula)
  const maxHR = 220 - age;

  // Get current zone BPM range
  const currentMinBPM = Math.round(maxHR * (selectedZone.range[0] / 100));
  const currentMaxBPM = Math.round(maxHR * (selectedZone.range[1] / 100));
  const targetBPM = Math.round((currentMinBPM + currentMaxBPM) / 2);

  const handleCalculate = () => {
    setIsCalculated(true);
  };

  return (
    <section className="relative py-24 bg-darker overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />

        {/* ECG line pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-5">
          <pattern id="ecg-pattern" x="0" y="0" width="200" height="100" patternUnits="userSpaceOnUse">
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              points="0,50 40,50 50,50 60,20 70,80 80,50 90,50 130,50 140,50 150,20 160,80 170,50 180,50 200,50"
            />
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#ecg-pattern)" />
        </svg>
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
              <Heart className="w-4 h-4" />
              HEART RATE ZONES
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-black text-white mb-4">
              TRAIN IN THE{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                RIGHT ZONE
              </span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Discover your optimal heart rate zones for maximum results. Train smarter, not just harder.
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
                  className="max-w-md mx-auto"
                >
                  {/* Age input card */}
                  <div className="relative bg-dark/50 border border-white/10 p-8">
                    <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-primary/30" />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-primary/30" />

                    <div className="text-center mb-8">
                      <Heart className="w-16 h-16 text-red-500 mx-auto mb-4" />
                      <h3 className="font-heading font-bold text-xl text-white mb-2">
                        ENTER YOUR AGE
                      </h3>
                      <p className="text-white/50 text-sm">
                        We'll calculate your personalized heart rate zones
                      </p>
                    </div>

                    {/* Age slider */}
                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-white/50 text-sm">Age</span>
                        <span className="font-mono text-2xl font-bold text-primary">{age}</span>
                      </div>
                      <input
                        type="range"
                        min="15"
                        max="80"
                        value={age}
                        onChange={(e) => setAge(Number(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between mt-2">
                        <span className="text-white/30 text-xs">15</span>
                        <span className="text-white/30 text-xs">80</span>
                      </div>
                    </div>

                    {/* Max HR preview */}
                    <div className="bg-white/5 p-4 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-white/50 text-sm">Estimated Max Heart Rate</span>
                        <span className="font-mono text-xl font-bold text-white">{maxHR} BPM</span>
                      </div>
                      <p className="text-white/30 text-xs mt-2 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        Based on 220 - age formula
                      </p>
                    </div>

                    {/* Calculate button */}
                    <motion.button
                      onClick={handleCalculate}
                      className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-heading font-bold text-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      CALCULATE MY ZONES
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid lg:grid-cols-2 gap-8"
                >
                  {/* Left column - Heart visualization & zones */}
                  <div className="space-y-6">
                    {/* Heart display */}
                    <div className="relative bg-dark/50 border border-white/10 p-6">
                      <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-primary/30" />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-primary/30" />

                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-mono text-xs text-white/50">MAX HEART RATE</p>
                          <p className="font-heading font-bold text-2xl text-white">{maxHR} BPM</p>
                        </div>
                        <button
                          onClick={() => setIsCalculated(false)}
                          className="text-white/50 hover:text-primary text-sm font-mono transition-colors"
                        >
                          Change Age
                        </button>
                      </div>

                      {/* Pulsing heart */}
                      <PulsingHeart zone={selectedZone} bpm={targetBPM} />

                      {/* Current zone indicator */}
                      <div className="mt-4 text-center">
                        <p className="text-white/50 text-sm">Currently viewing</p>
                        <p
                          className="font-heading font-bold text-lg"
                          style={{ color: selectedZone.color }}
                        >
                          ZONE {selectedZone.id}: {selectedZone.name}
                        </p>
                      </div>
                    </div>

                    {/* Zone list */}
                    <div className="space-y-2">
                      {ZONES.map((zone) => (
                        <ZoneBar
                          key={zone.id}
                          zone={zone}
                          maxHR={maxHR}
                          isSelected={selectedZone.id === zone.id}
                          onClick={() => setSelectedZone(zone)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Right column - Zone details */}
                  <div>
                    <AnimatePresence mode="wait">
                      <ZoneDetails key={selectedZone.id} zone={selectedZone} maxHR={maxHR} />
                    </AnimatePresence>

                    {/* Tips card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-6 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 p-6"
                    >
                      <h4 className="font-heading font-bold text-white mb-3 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-primary" />
                        PRO TIP
                      </h4>
                      <p className="text-white/70 text-sm">
                        For optimal fat loss, spend 70-80% of your cardio time in Zone 2 (Fat Burn).
                        For improving cardiovascular fitness, alternate between Zone 3 and Zone 4
                        with interval training.
                      </p>
                    </motion.div>

                    {/* Weekly training suggestion */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mt-4 bg-dark/50 border border-white/10 p-6"
                    >
                      <h4 className="font-heading font-bold text-white mb-4">
                        SUGGESTED WEEKLY MIX
                      </h4>
                      <div className="space-y-3">
                        {[
                          { zone: 'Zone 1-2', percent: 60, label: 'Easy/Recovery' },
                          { zone: 'Zone 3', percent: 25, label: 'Moderate' },
                          { zone: 'Zone 4-5', percent: 15, label: 'High Intensity' },
                        ].map((item) => (
                          <div key={item.zone}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-white/70">{item.zone}</span>
                              <span className="text-white/50">{item.label}</span>
                              <span className="font-mono text-primary">{item.percent}%</span>
                            </div>
                            <div className="h-2 bg-white/5 overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-primary to-primary-dark"
                                initial={{ width: 0 }}
                                animate={{ width: `${item.percent}%` }}
                                transition={{ duration: 0.5 }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
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
