import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Dumbbell, RotateCcw, Check, ChevronRight, Flame, Moon, Target, Users } from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

const SPLITS = [
  {
    id: 'ppl',
    name: 'Push Pull Legs',
    shortName: 'PPL',
    frequency: '6 days/week',
    level: 'Intermediate',
    description: 'Classic bodybuilding split targeting push muscles, pull muscles, and legs separately.',
    icon: '💪',
    schedule: [
      { day: 'Monday', type: 'Push', muscles: ['Chest', 'Shoulders', 'Triceps'], color: 'from-red-500 to-orange-500' },
      { day: 'Tuesday', type: 'Pull', muscles: ['Back', 'Biceps', 'Rear Delts'], color: 'from-blue-500 to-cyan-500' },
      { day: 'Wednesday', type: 'Legs', muscles: ['Quads', 'Hamstrings', 'Glutes', 'Calves'], color: 'from-green-500 to-emerald-500' },
      { day: 'Thursday', type: 'Push', muscles: ['Chest', 'Shoulders', 'Triceps'], color: 'from-red-500 to-orange-500' },
      { day: 'Friday', type: 'Pull', muscles: ['Back', 'Biceps', 'Rear Delts'], color: 'from-blue-500 to-cyan-500' },
      { day: 'Saturday', type: 'Legs', muscles: ['Quads', 'Hamstrings', 'Glutes', 'Calves'], color: 'from-green-500 to-emerald-500' },
      { day: 'Sunday', type: 'Rest', muscles: [], color: 'from-zinc-600 to-zinc-700' },
    ],
    pros: ['High volume per muscle', 'Good recovery', 'Flexible scheduling'],
    cons: ['Time commitment', '6 days required', 'Not for beginners'],
  },
  {
    id: 'upper-lower',
    name: 'Upper Lower',
    shortName: 'U/L',
    frequency: '4 days/week',
    level: 'Beginner-Intermediate',
    description: 'Simple split dividing workouts into upper and lower body days.',
    icon: '⬆️',
    schedule: [
      { day: 'Monday', type: 'Upper', muscles: ['Chest', 'Back', 'Shoulders', 'Arms'], color: 'from-purple-500 to-pink-500' },
      { day: 'Tuesday', type: 'Lower', muscles: ['Quads', 'Hamstrings', 'Glutes', 'Calves'], color: 'from-amber-500 to-yellow-500' },
      { day: 'Wednesday', type: 'Rest', muscles: [], color: 'from-zinc-600 to-zinc-700' },
      { day: 'Thursday', type: 'Upper', muscles: ['Chest', 'Back', 'Shoulders', 'Arms'], color: 'from-purple-500 to-pink-500' },
      { day: 'Friday', type: 'Lower', muscles: ['Quads', 'Hamstrings', 'Glutes', 'Calves'], color: 'from-amber-500 to-yellow-500' },
      { day: 'Saturday', type: 'Rest', muscles: [], color: 'from-zinc-600 to-zinc-700' },
      { day: 'Sunday', type: 'Rest', muscles: [], color: 'from-zinc-600 to-zinc-700' },
    ],
    pros: ['Balanced frequency', 'Good for busy schedules', 'Adequate recovery'],
    cons: ['Less volume per muscle', 'Longer workouts', 'Less specialization'],
  },
  {
    id: 'bro-split',
    name: 'Bro Split',
    shortName: 'Bro',
    frequency: '5 days/week',
    level: 'Intermediate-Advanced',
    description: 'Traditional bodybuilding split with one muscle group per day.',
    icon: '🏆',
    schedule: [
      { day: 'Monday', type: 'Chest', muscles: ['Chest'], color: 'from-red-500 to-rose-500' },
      { day: 'Tuesday', type: 'Back', muscles: ['Back', 'Rear Delts'], color: 'from-blue-500 to-indigo-500' },
      { day: 'Wednesday', type: 'Shoulders', muscles: ['Shoulders', 'Traps'], color: 'from-orange-500 to-amber-500' },
      { day: 'Thursday', type: 'Legs', muscles: ['Quads', 'Hamstrings', 'Glutes', 'Calves'], color: 'from-green-500 to-teal-500' },
      { day: 'Friday', type: 'Arms', muscles: ['Biceps', 'Triceps', 'Forearms'], color: 'from-purple-500 to-violet-500' },
      { day: 'Saturday', type: 'Rest', muscles: [], color: 'from-zinc-600 to-zinc-700' },
      { day: 'Sunday', type: 'Rest', muscles: [], color: 'from-zinc-600 to-zinc-700' },
    ],
    pros: ['Maximum volume per muscle', 'Focus & mind-muscle connection', 'Popular & proven'],
    cons: ['Low frequency (1x/week)', 'Long recovery periods', 'Suboptimal for naturals'],
  },
  {
    id: 'full-body',
    name: 'Full Body',
    shortName: 'FB',
    frequency: '3 days/week',
    level: 'Beginner',
    description: 'Hit every muscle group each workout. Perfect for beginners.',
    icon: '🔄',
    schedule: [
      { day: 'Monday', type: 'Full Body', muscles: ['All Muscles'], color: 'from-primary to-orange-500' },
      { day: 'Tuesday', type: 'Rest', muscles: [], color: 'from-zinc-600 to-zinc-700' },
      { day: 'Wednesday', type: 'Full Body', muscles: ['All Muscles'], color: 'from-primary to-orange-500' },
      { day: 'Thursday', type: 'Rest', muscles: [], color: 'from-zinc-600 to-zinc-700' },
      { day: 'Friday', type: 'Full Body', muscles: ['All Muscles'], color: 'from-primary to-orange-500' },
      { day: 'Saturday', type: 'Rest', muscles: [], color: 'from-zinc-600 to-zinc-700' },
      { day: 'Sunday', type: 'Rest', muscles: [], color: 'from-zinc-600 to-zinc-700' },
    ],
    pros: ['High frequency (3x/week)', 'Great for beginners', 'Time efficient'],
    cons: ['Limited volume per muscle', 'Can be fatiguing', 'Less focus per muscle'],
  },
  {
    id: 'arnold',
    name: 'Arnold Split',
    shortName: 'Arnold',
    frequency: '6 days/week',
    level: 'Advanced',
    description: 'The legendary Arnold Schwarzenegger\'s preferred training split.',
    icon: '🏅',
    schedule: [
      { day: 'Monday', type: 'Chest & Back', muscles: ['Chest', 'Back'], color: 'from-red-500 to-blue-500' },
      { day: 'Tuesday', type: 'Shoulders & Arms', muscles: ['Shoulders', 'Biceps', 'Triceps'], color: 'from-purple-500 to-pink-500' },
      { day: 'Wednesday', type: 'Legs', muscles: ['Quads', 'Hamstrings', 'Glutes', 'Calves'], color: 'from-green-500 to-emerald-500' },
      { day: 'Thursday', type: 'Chest & Back', muscles: ['Chest', 'Back'], color: 'from-red-500 to-blue-500' },
      { day: 'Friday', type: 'Shoulders & Arms', muscles: ['Shoulders', 'Biceps', 'Triceps'], color: 'from-purple-500 to-pink-500' },
      { day: 'Saturday', type: 'Legs', muscles: ['Quads', 'Hamstrings', 'Glutes', 'Calves'], color: 'from-green-500 to-emerald-500' },
      { day: 'Sunday', type: 'Rest', muscles: [], color: 'from-zinc-600 to-zinc-700' },
    ],
    pros: ['Antagonist supersets', 'High volume', '2x frequency'],
    cons: ['Very demanding', 'Long workouts', 'Advanced only'],
  },
  {
    id: 'phat',
    name: 'PHAT',
    shortName: 'PHAT',
    frequency: '5 days/week',
    level: 'Advanced',
    description: 'Power Hypertrophy Adaptive Training - combines strength and size.',
    icon: '⚡',
    schedule: [
      { day: 'Monday', type: 'Upper Power', muscles: ['Chest', 'Back', 'Shoulders'], color: 'from-red-600 to-red-400' },
      { day: 'Tuesday', type: 'Lower Power', muscles: ['Quads', 'Hamstrings', 'Glutes'], color: 'from-blue-600 to-blue-400' },
      { day: 'Wednesday', type: 'Rest', muscles: [], color: 'from-zinc-600 to-zinc-700' },
      { day: 'Thursday', type: 'Back & Shoulders', muscles: ['Back', 'Shoulders', 'Traps'], color: 'from-green-600 to-green-400' },
      { day: 'Friday', type: 'Chest & Arms', muscles: ['Chest', 'Biceps', 'Triceps'], color: 'from-purple-600 to-purple-400' },
      { day: 'Saturday', type: 'Legs Hyper', muscles: ['Quads', 'Hamstrings', 'Glutes', 'Calves'], color: 'from-amber-600 to-amber-400' },
      { day: 'Sunday', type: 'Rest', muscles: [], color: 'from-zinc-600 to-zinc-700' },
    ],
    pros: ['Strength + hypertrophy', 'Scientific approach', 'Variety in training'],
    cons: ['Complex programming', 'High volume', 'Requires experience'],
  },
];

const LEVEL_COLORS = {
  'Beginner': 'text-green-400 bg-green-400/10',
  'Beginner-Intermediate': 'text-cyan-400 bg-cyan-400/10',
  'Intermediate': 'text-yellow-400 bg-yellow-400/10',
  'Intermediate-Advanced': 'text-orange-400 bg-orange-400/10',
  'Advanced': 'text-red-400 bg-red-400/10',
};

export default function WorkoutSplitPlanner() {
  const [selectedSplit, setSelectedSplit] = useState(null);
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'details'

  const getWorkoutDays = (split) => {
    return split.schedule.filter(d => d.type !== 'Rest').length;
  };

  const getRestDays = (split) => {
    return split.schedule.filter(d => d.type === 'Rest').length;
  };

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
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
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium">Training Schedule</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Workout <span className="text-primary">Split</span> Planner
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Choose the perfect training split for your goals and schedule
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {!selectedSplit ? (
              <motion.div
                key="splits"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {SPLITS.map((split, index) => (
                  <motion.button
                    key={split.id}
                    onClick={() => setSelectedSplit(split)}
                    className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-zinc-800 hover:border-primary/30 rounded-2xl p-6 text-left transition-all group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-4xl">{split.icon}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${LEVEL_COLORS[split.level]}`}>
                        {split.level}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
                      {split.name}
                    </h3>
                    <p className="text-primary text-sm mb-3">{split.frequency}</p>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{split.description}</p>

                    {/* Mini Week Preview */}
                    <div className="flex gap-1">
                      {split.schedule.map((day, i) => (
                        <div
                          key={i}
                          className={`flex-1 h-2 rounded-full bg-gradient-to-r ${day.color}`}
                          title={`${day.day}: ${day.type}`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-800">
                      <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1 text-green-400">
                          <Flame className="w-3 h-3" />
                          {getWorkoutDays(split)} days
                        </span>
                        <span className="flex items-center gap-1 text-gray-500">
                          <Moon className="w-3 h-3" />
                          {getRestDays(split)} rest
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-primary transition-colors" />
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Split Header */}
                <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl border border-zinc-800 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <span className="text-5xl">{selectedSplit.icon}</span>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{selectedSplit.name}</h3>
                        <p className="text-primary">{selectedSplit.frequency}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedSplit(null)}
                      className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                    >
                      <RotateCcw className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  <p className="text-gray-400 mb-4">{selectedSplit.description}</p>

                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${LEVEL_COLORS[selectedSplit.level]}`}>
                      {selectedSplit.level}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm bg-green-400/10 text-green-400 flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      {getWorkoutDays(selectedSplit)} training days
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm bg-zinc-800 text-gray-400 flex items-center gap-1">
                      <Moon className="w-3 h-3" />
                      {getRestDays(selectedSplit)} rest days
                    </span>
                  </div>
                </div>

                {/* View Toggle */}
                <div className="flex justify-center">
                  <div className="bg-zinc-900 rounded-xl p-1 inline-flex">
                    <button
                      onClick={() => setViewMode('week')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        viewMode === 'week' ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Week View
                    </button>
                    <button
                      onClick={() => setViewMode('details')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        viewMode === 'details' ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Day Details
                    </button>
                  </div>
                </div>

                {/* Week Calendar View */}
                {viewMode === 'week' && (
                  <div className="grid grid-cols-7 gap-2">
                    {selectedSplit.schedule.map((day, index) => (
                      <motion.div
                        key={day.day}
                        className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-xl border border-zinc-800 overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className={`h-2 bg-gradient-to-r ${day.color}`} />
                        <div className="p-3">
                          <p className="text-gray-500 text-xs mb-1">{day.day.slice(0, 3)}</p>
                          <p className={`font-bold text-sm ${day.type === 'Rest' ? 'text-gray-600' : 'text-white'}`}>
                            {day.type}
                          </p>
                          {day.muscles.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {day.muscles.slice(0, 3).map((muscle, i) => (
                                <p key={i} className="text-gray-500 text-xs truncate">
                                  {muscle}
                                </p>
                              ))}
                              {day.muscles.length > 3 && (
                                <p className="text-primary text-xs">+{day.muscles.length - 3} more</p>
                              )}
                            </div>
                          )}
                          {day.type === 'Rest' && (
                            <div className="mt-2">
                              <Moon className="w-4 h-4 text-gray-700" />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Day Details View */}
                {viewMode === 'details' && (
                  <div className="space-y-3">
                    {selectedSplit.schedule.map((day, index) => (
                      <motion.div
                        key={day.day}
                        className={`bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-xl border border-zinc-800 p-4 ${
                          day.type === 'Rest' ? 'opacity-60' : ''
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${day.color} flex items-center justify-center`}>
                            {day.type === 'Rest' ? (
                              <Moon className="w-6 h-6 text-white" />
                            ) : (
                              <Dumbbell className="w-6 h-6 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <p className="text-gray-400 text-sm">{day.day}</p>
                              <p className="font-bold text-white">{day.type}</p>
                            </div>
                            {day.muscles.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {day.muscles.map((muscle, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 bg-white/5 text-gray-400 text-xs rounded"
                                  >
                                    {muscle}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Pros & Cons */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-green-500/10 to-zinc-900/50 rounded-xl border border-green-500/20 p-5">
                    <h4 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Advantages
                    </h4>
                    <ul className="space-y-2">
                      {selectedSplit.pros.map((pro, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-red-500/10 to-zinc-900/50 rounded-xl border border-red-500/20 p-5">
                    <h4 className="font-bold text-red-400 mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Considerations
                    </h4>
                    <ul className="space-y-2">
                      {selectedSplit.cons.map((con, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                          <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Choose Another */}
                <motion.button
                  onClick={() => setSelectedSplit(null)}
                  className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RotateCcw className="w-5 h-5" />
                  Choose Different Split
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  );
}
