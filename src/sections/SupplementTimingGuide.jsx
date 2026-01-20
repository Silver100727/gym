import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Pill, Clock, Sun, Moon, Dumbbell, Coffee, Droplets, Zap, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

const SUPPLEMENTS = [
  {
    id: 'protein',
    name: 'Whey Protein',
    icon: '🥛',
    color: 'from-amber-500 to-yellow-500',
    timing: [
      { when: 'post', offset: 30, label: '30 min after workout', priority: 'optimal' },
      { when: 'morning', offset: 0, label: 'With breakfast', priority: 'good' },
    ],
    dosage: '20-40g',
    benefits: ['Muscle recovery', 'Protein synthesis', 'Convenient protein source'],
    tips: 'Fast-absorbing, ideal post-workout. Can also be used as a meal supplement.',
  },
  {
    id: 'creatine',
    name: 'Creatine Monohydrate',
    icon: '💪',
    color: 'from-blue-500 to-cyan-500',
    timing: [
      { when: 'post', offset: 0, label: 'Post-workout', priority: 'optimal' },
      { when: 'any', offset: 0, label: 'Any time (consistent)', priority: 'good' },
    ],
    dosage: '3-5g daily',
    benefits: ['Strength gains', 'Power output', 'Muscle volume'],
    tips: 'Timing is less important than consistency. Take daily, even on rest days.',
  },
  {
    id: 'preworkout',
    name: 'Pre-Workout',
    icon: '⚡',
    color: 'from-red-500 to-orange-500',
    timing: [
      { when: 'pre', offset: -30, label: '30 min before workout', priority: 'optimal' },
    ],
    dosage: '1 scoop (follow label)',
    benefits: ['Energy boost', 'Focus', 'Performance enhancement'],
    tips: 'Avoid taking within 4-6 hours of bedtime due to caffeine content.',
  },
  {
    id: 'bcaa',
    name: 'BCAAs',
    icon: '🧬',
    color: 'from-purple-500 to-pink-500',
    timing: [
      { when: 'during', offset: 0, label: 'During workout', priority: 'optimal' },
      { when: 'pre', offset: -15, label: '15 min before', priority: 'good' },
    ],
    dosage: '5-10g',
    benefits: ['Reduce muscle breakdown', 'Endurance', 'Recovery'],
    tips: 'Most beneficial during fasted training or long workouts.',
  },
  {
    id: 'caffeine',
    name: 'Caffeine',
    icon: '☕',
    color: 'from-amber-700 to-amber-500',
    timing: [
      { when: 'pre', offset: -45, label: '45 min before workout', priority: 'optimal' },
    ],
    dosage: '100-200mg',
    benefits: ['Alertness', 'Fat oxidation', 'Performance'],
    tips: 'Peak blood levels occur 45-60 minutes after consumption.',
  },
  {
    id: 'fish-oil',
    name: 'Fish Oil / Omega-3',
    icon: '🐟',
    color: 'from-sky-500 to-blue-500',
    timing: [
      { when: 'morning', offset: 0, label: 'With breakfast', priority: 'optimal' },
      { when: 'meal', offset: 0, label: 'With any meal', priority: 'good' },
    ],
    dosage: '1-3g EPA/DHA',
    benefits: ['Joint health', 'Heart health', 'Inflammation reduction'],
    tips: 'Take with food to improve absorption and reduce fishy aftertaste.',
  },
  {
    id: 'vitamin-d',
    name: 'Vitamin D3',
    icon: '☀️',
    color: 'from-yellow-400 to-orange-400',
    timing: [
      { when: 'morning', offset: 0, label: 'Morning with food', priority: 'optimal' },
    ],
    dosage: '1000-5000 IU',
    benefits: ['Bone health', 'Immune function', 'Mood support'],
    tips: 'Fat-soluble vitamin - take with a meal containing fats for best absorption.',
  },
  {
    id: 'magnesium',
    name: 'Magnesium',
    icon: '🌙',
    color: 'from-indigo-500 to-purple-500',
    timing: [
      { when: 'evening', offset: 0, label: 'Before bed', priority: 'optimal' },
    ],
    dosage: '200-400mg',
    benefits: ['Sleep quality', 'Muscle relaxation', 'Recovery'],
    tips: 'Glycinate form is best for sleep. Can cause drowsiness.',
  },
  {
    id: 'glutamine',
    name: 'L-Glutamine',
    icon: '🔬',
    color: 'from-teal-500 to-emerald-500',
    timing: [
      { when: 'post', offset: 15, label: 'Post-workout', priority: 'optimal' },
      { when: 'evening', offset: 0, label: 'Before bed', priority: 'good' },
    ],
    dosage: '5-10g',
    benefits: ['Gut health', 'Immune support', 'Recovery'],
    tips: 'Especially beneficial during intense training periods or dieting.',
  },
  {
    id: 'beta-alanine',
    name: 'Beta-Alanine',
    icon: '🔥',
    color: 'from-rose-500 to-red-500',
    timing: [
      { when: 'pre', offset: -30, label: '30 min before workout', priority: 'optimal' },
      { when: 'any', offset: 0, label: 'Split doses daily', priority: 'good' },
    ],
    dosage: '2-5g daily',
    benefits: ['Endurance', 'Reduces fatigue', 'Buffer lactic acid'],
    tips: 'May cause harmless tingling sensation. Splits doses to reduce this.',
  },
];

const TIMELINE_MARKERS = [
  { label: 'Wake Up', time: -180, icon: Sun },
  { label: 'Pre-Workout', time: -45, icon: Coffee },
  { label: 'Workout', time: 0, icon: Dumbbell },
  { label: 'Post-Workout', time: 60, icon: Droplets },
  { label: 'Evening', time: 480, icon: Moon },
];

export default function SupplementTimingGuide() {
  const [workoutTime, setWorkoutTime] = useState('09:00');
  const [selectedSupplements, setSelectedSupplements] = useState(['protein', 'creatine', 'preworkout']);
  const [expandedSupplement, setExpandedSupplement] = useState(null);

  const toggleSupplement = (id) => {
    setSelectedSupplements(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const schedule = useMemo(() => {
    const [hours, minutes] = workoutTime.split(':').map(Number);
    const workoutMinutes = hours * 60 + minutes;

    return selectedSupplements.map(id => {
      const supp = SUPPLEMENTS.find(s => s.id === id);
      if (!supp) return null;

      const optimalTiming = supp.timing[0];
      let takeTime;

      if (optimalTiming.when === 'morning') {
        takeTime = 7 * 60; // 7:00 AM
      } else if (optimalTiming.when === 'evening') {
        takeTime = 21 * 60; // 9:00 PM
      } else if (optimalTiming.when === 'any' || optimalTiming.when === 'meal') {
        takeTime = workoutMinutes; // Same as workout
      } else {
        takeTime = workoutMinutes + optimalTiming.offset;
      }

      const takeHours = Math.floor(takeTime / 60);
      const takeMins = takeTime % 60;
      const timeString = `${takeHours.toString().padStart(2, '0')}:${takeMins.toString().padStart(2, '0')}`;

      return {
        ...supp,
        takeTime,
        timeString,
        timing: optimalTiming,
      };
    }).filter(Boolean).sort((a, b) => a.takeTime - b.takeTime);
  }, [workoutTime, selectedSupplements]);

  const formatTime = (time24) => {
    const [hours, minutes] = time24.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
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
            <Pill className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium">Supplement Optimization</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Supplement <span className="text-primary">Timing</span> Guide
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Optimize your supplement timing for maximum effectiveness
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Supplement Selection */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl border border-zinc-800 p-5">
                <h3 className="text-white font-semibold mb-4">Your Supplements</h3>

                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {SUPPLEMENTS.map(supp => (
                    <button
                      key={supp.id}
                      onClick={() => toggleSupplement(supp.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        selectedSupplements.includes(supp.id)
                          ? 'bg-primary/10 border-primary/50'
                          : 'bg-black/30 border-zinc-800 hover:border-zinc-600'
                      }`}
                    >
                      <span className="text-xl">{supp.icon}</span>
                      <div className="flex-1 text-left">
                        <p className={`font-medium text-sm ${
                          selectedSupplements.includes(supp.id) ? 'text-primary' : 'text-white'
                        }`}>
                          {supp.name}
                        </p>
                        <p className="text-gray-500 text-xs">{supp.dosage}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedSupplements.includes(supp.id)
                          ? 'border-primary bg-primary'
                          : 'border-zinc-600'
                      }`}>
                        {selectedSupplements.includes(supp.id) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 bg-black rounded-full"
                          />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Workout Time */}
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-xl border border-zinc-800 p-5">
                <label className="text-gray-400 text-sm mb-2 block">Workout Time</label>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <input
                    type="time"
                    value={workoutTime}
                    onChange={(e) => setWorkoutTime(e.target.value)}
                    className="flex-1 bg-black/50 border border-zinc-700 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:border-primary/50"
                  />
                </div>
                <p className="text-gray-500 text-xs mt-2">
                  Workout at {formatTime(workoutTime)}
                </p>
              </div>
            </div>

            {/* Schedule & Timeline */}
            <div className="lg:col-span-2 space-y-4">
              {/* Daily Schedule */}
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl border border-zinc-800 p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Your Daily Schedule
                </h3>

                {schedule.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Select supplements to see your schedule
                  </div>
                ) : (
                  <div className="space-y-3">
                    {schedule.map((supp, index) => (
                      <motion.div
                        key={supp.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-black/30 rounded-xl border border-zinc-800 overflow-hidden"
                      >
                        <button
                          onClick={() => setExpandedSupplement(expandedSupplement === supp.id ? null : supp.id)}
                          className="w-full flex items-center gap-4 p-4"
                        >
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${supp.color} flex items-center justify-center text-xl`}>
                            {supp.icon}
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-white font-medium">{supp.name}</p>
                            <p className="text-gray-500 text-sm">{supp.timing.label}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-primary font-bold text-lg">{formatTime(supp.timeString)}</p>
                            <p className="text-gray-600 text-xs">{supp.dosage}</p>
                          </div>
                          {expandedSupplement === supp.id ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                        </button>

                        {expandedSupplement === supp.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-4 pb-4 border-t border-zinc-800"
                          >
                            <div className="pt-4 space-y-3">
                              <div>
                                <p className="text-gray-400 text-xs mb-2">Benefits</p>
                                <div className="flex flex-wrap gap-2">
                                  {supp.benefits.map((benefit, i) => (
                                    <span
                                      key={i}
                                      className="px-2 py-1 bg-zinc-800 text-gray-300 text-xs rounded"
                                    >
                                      {benefit}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="flex items-start gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                                <Info className="w-4 h-4 text-primary mt-0.5" />
                                <p className="text-gray-400 text-sm">{supp.tips}</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Visual Timeline */}
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl border border-zinc-800 p-6">
                <h3 className="text-white font-semibold mb-6">Visual Timeline</h3>

                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute top-4 left-0 right-0 h-1 bg-zinc-800 rounded-full" />

                  {/* Workout Marker */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Dumbbell className="w-4 h-4 text-black" />
                    </div>
                  </div>

                  {/* Time Labels */}
                  <div className="flex justify-between pt-8 text-xs text-gray-500">
                    <span>-2h</span>
                    <span>-1h</span>
                    <span className="text-primary font-medium">Workout</span>
                    <span>+1h</span>
                    <span>+2h</span>
                  </div>

                  {/* Supplement Markers */}
                  <div className="relative h-24 mt-4">
                    {schedule.map((supp, index) => {
                      const offset = supp.timing.offset || 0;
                      // Map -120 to +120 minutes to 0-100%
                      const position = Math.max(0, Math.min(100, ((offset + 120) / 240) * 100));

                      return (
                        <motion.div
                          key={supp.id}
                          className="absolute -translate-x-1/2"
                          style={{ left: `${position}%`, top: `${(index % 3) * 28}px` }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${supp.color} flex items-center justify-center text-sm shadow-lg`}>
                            {supp.icon}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <p className="text-sm text-gray-400">
                  <span className="text-primary font-medium">Pro Tip: </span>
                  Consistency is more important than perfect timing. Pick times that work with your schedule
                  and stick to them daily for best results.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
