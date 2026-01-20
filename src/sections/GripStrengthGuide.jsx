import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hand, Dumbbell, Target, Zap, ArrowRight, Check } from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

const GRIP_TYPES = [
  {
    id: 'overhand',
    name: 'Overhand (Pronated)',
    description: 'Palms facing away from you, knuckles facing up',
    icon: '🤚',
    color: 'from-blue-500 to-cyan-500',
    muscles: ['Forearm extensors', 'Brachioradialis', 'Lats'],
    benefits: ['Standard pulling grip', 'Targets back width', 'Strengthens grip'],
    exercises: ['Pull-Ups', 'Barbell Rows', 'Deadlifts', 'Lat Pulldowns', 'Barbell Curls'],
    tips: 'Most common grip for back exercises. May limit weight on heavy pulls.',
    difficulty: 'Beginner',
    visual: {
      rotation: 180,
      label: 'Palms Down',
    },
  },
  {
    id: 'underhand',
    name: 'Underhand (Supinated)',
    description: 'Palms facing toward you, knuckles facing down',
    icon: '✋',
    color: 'from-purple-500 to-pink-500',
    muscles: ['Biceps', 'Forearm flexors', 'Lower lats'],
    benefits: ['Greater bicep activation', 'Stronger grip', 'More lower lat focus'],
    exercises: ['Chin-Ups', 'Supinated Rows', 'Bicep Curls', 'Reverse Lat Pulldown'],
    tips: 'Excellent for bicep development. Can stress wrists on barbell movements.',
    difficulty: 'Beginner',
    visual: {
      rotation: 0,
      label: 'Palms Up',
    },
  },
  {
    id: 'neutral',
    name: 'Neutral (Hammer)',
    description: 'Palms facing each other, thumbs pointing up',
    icon: '🤝',
    color: 'from-green-500 to-emerald-500',
    muscles: ['Brachialis', 'Brachioradialis', 'Forearms'],
    benefits: ['Joint-friendly', 'Balanced muscle activation', 'Natural wrist position'],
    exercises: ['Hammer Curls', 'Neutral Grip Pull-Ups', 'Dumbbell Rows', 'Rope Pushdowns'],
    tips: 'Best for those with wrist issues. Great for overall arm development.',
    difficulty: 'Beginner',
    visual: {
      rotation: 90,
      label: 'Palms Facing',
    },
  },
  {
    id: 'mixed',
    name: 'Mixed (Alternating)',
    description: 'One palm facing you, one facing away',
    icon: '🔄',
    color: 'from-orange-500 to-red-500',
    muscles: ['Full grip strength', 'Core anti-rotation', 'Back'],
    benefits: ['Maximum grip strength', 'Heavier lifting', 'Prevents bar rolling'],
    exercises: ['Heavy Deadlifts', 'Barbell Shrugs', 'Farmer Walks'],
    tips: 'Alternate which hand is supinated to prevent imbalances. Use sparingly.',
    difficulty: 'Intermediate',
    visual: {
      rotation: 'mixed',
      label: 'Alternating',
    },
  },
  {
    id: 'hook',
    name: 'Hook Grip',
    description: 'Thumb wrapped under fingers around the bar',
    icon: '🪝',
    color: 'from-red-500 to-rose-500',
    muscles: ['Thumb strength', 'Grip endurance', 'Forearms'],
    benefits: ['Secure grip', 'Olympic lifting standard', 'No bicep tear risk'],
    exercises: ['Snatch', 'Clean & Jerk', 'Deadlifts', 'Heavy Pulls'],
    tips: 'Uncomfortable at first but very secure. Used by Olympic weightlifters.',
    difficulty: 'Advanced',
    visual: {
      rotation: 180,
      label: 'Thumb Under',
      special: 'hook',
    },
  },
  {
    id: 'false',
    name: 'False (Suicide) Grip',
    description: 'Thumb on same side as fingers, not wrapped around',
    icon: '⚠️',
    color: 'from-yellow-500 to-amber-500',
    muscles: ['Chest activation', 'Triceps'],
    benefits: ['Better chest engagement', 'Wrist alignment', 'Some prefer for pressing'],
    exercises: ['Bench Press', 'Overhead Press', 'Skull Crushers'],
    tips: 'CAUTION: Risk of bar slipping. Only for experienced lifters.',
    difficulty: 'Advanced',
    visual: {
      rotation: 180,
      label: 'No Thumb Wrap',
      special: 'false',
    },
  },
  {
    id: 'wide',
    name: 'Wide Grip',
    description: 'Hands placed wider than shoulder width',
    icon: '↔️',
    color: 'from-indigo-500 to-blue-500',
    muscles: ['Outer lats', 'Upper chest', 'Rear delts'],
    benefits: ['Greater stretch', 'Width development', 'Isolation focus'],
    exercises: ['Wide Grip Pull-Ups', 'Wide Bench Press', 'Snatch Grip Deadlift'],
    tips: 'Reduces range of motion but increases muscle stretch at bottom.',
    difficulty: 'Intermediate',
    visual: {
      rotation: 180,
      label: 'Wide',
      width: 'wide',
    },
  },
  {
    id: 'close',
    name: 'Close Grip',
    description: 'Hands placed closer than shoulder width',
    icon: '↕️',
    color: 'from-teal-500 to-cyan-500',
    muscles: ['Triceps', 'Inner chest', 'Lower lats'],
    benefits: ['Tricep focus', 'Longer range of motion', 'Inner muscle targeting'],
    exercises: ['Close Grip Bench', 'Close Grip Rows', 'Diamond Push-Ups', 'V-Bar Pulldowns'],
    tips: 'Great for tricep development. Keep elbows tucked on pressing movements.',
    difficulty: 'Beginner',
    visual: {
      rotation: 180,
      label: 'Close',
      width: 'close',
    },
  },
];

const DIFFICULTY_COLORS = {
  'Beginner': 'bg-green-500/20 text-green-400',
  'Intermediate': 'bg-yellow-500/20 text-yellow-400',
  'Advanced': 'bg-red-500/20 text-red-400',
};

export default function GripStrengthGuide() {
  const [selectedGrip, setSelectedGrip] = useState(null);
  const [filterDifficulty, setFilterDifficulty] = useState('all');

  const filteredGrips = GRIP_TYPES.filter(grip =>
    filterDifficulty === 'all' || grip.difficulty === filterDifficulty
  );

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
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
            <Hand className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium">Grip Mastery</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Grip <span className="text-primary">Strength</span> Guide
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Master different grip types to maximize muscle activation and lifting performance
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="max-w-5xl mx-auto">
          {/* Filter */}
          <div className="flex justify-center gap-2 mb-8">
            {['all', 'Beginner', 'Intermediate', 'Advanced'].map(level => (
              <button
                key={level}
                onClick={() => setFilterDifficulty(level)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterDifficulty === level
                    ? 'bg-primary text-black'
                    : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                }`}
              >
                {level === 'all' ? 'All Grips' : level}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {!selectedGrip ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {filteredGrips.map((grip, index) => (
                  <motion.button
                    key={grip.id}
                    onClick={() => setSelectedGrip(grip)}
                    className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-zinc-800 hover:border-primary/30 rounded-2xl p-5 text-left transition-all group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                  >
                    {/* Grip Visual */}
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${grip.color} flex items-center justify-center mb-4 mx-auto`}>
                      <span className="text-3xl">{grip.icon}</span>
                    </div>

                    <h3 className="text-white font-bold text-center mb-1 group-hover:text-primary transition-colors">
                      {grip.name.split(' ')[0]}
                    </h3>
                    <p className="text-gray-500 text-xs text-center mb-3">
                      {grip.name.includes('(') ? grip.name.split('(')[1].replace(')', '') : ''}
                    </p>

                    <div className="flex justify-center">
                      <span className={`px-2 py-1 rounded text-xs ${DIFFICULTY_COLORS[grip.difficulty]}`}>
                        {grip.difficulty}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="detail"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl border border-zinc-800 overflow-hidden"
              >
                {/* Header */}
                <div className={`bg-gradient-to-r ${selectedGrip.color} p-6`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-5xl">{selectedGrip.icon}</span>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{selectedGrip.name}</h3>
                        <p className="text-white/80">{selectedGrip.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedGrip(null)}
                      className="px-4 py-2 bg-black/20 hover:bg-black/30 text-white rounded-lg transition-colors"
                    >
                      Back
                    </button>
                  </div>
                </div>

                <div className="p-6 grid md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Visual Diagram */}
                    <div className="bg-black/30 rounded-xl p-6 border border-zinc-800">
                      <h4 className="text-white font-semibold mb-4">Hand Position</h4>
                      <div className="flex justify-center items-center gap-8">
                        {selectedGrip.visual.rotation === 'mixed' ? (
                          <>
                            <div className="text-center">
                              <div className="w-20 h-24 bg-zinc-800 rounded-lg flex items-center justify-center mb-2 relative">
                                <span className="text-4xl" style={{ transform: 'rotate(180deg)' }}>🤚</span>
                              </div>
                              <p className="text-gray-500 text-xs">Left Hand</p>
                            </div>
                            <div className="text-center">
                              <div className="w-20 h-24 bg-zinc-800 rounded-lg flex items-center justify-center mb-2">
                                <span className="text-4xl">🤚</span>
                              </div>
                              <p className="text-gray-500 text-xs">Right Hand</p>
                            </div>
                          </>
                        ) : (
                          <div className="text-center">
                            <div className={`bg-zinc-800 rounded-lg flex items-center justify-center mb-2 ${
                              selectedGrip.visual.width === 'wide' ? 'w-40 h-24 gap-8' :
                              selectedGrip.visual.width === 'close' ? 'w-24 h-24' : 'w-32 h-24'
                            }`}>
                              <span
                                className="text-4xl"
                                style={{ transform: `rotate(${selectedGrip.visual.rotation}deg)` }}
                              >
                                🤚
                              </span>
                              {selectedGrip.visual.width && (
                                <span
                                  className="text-4xl"
                                  style={{ transform: `rotate(${selectedGrip.visual.rotation}deg) scaleX(-1)` }}
                                >
                                  🤚
                                </span>
                              )}
                            </div>
                            <p className="text-primary text-sm font-medium">{selectedGrip.visual.label}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Muscles Targeted */}
                    <div className="bg-black/30 rounded-xl p-5 border border-zinc-800">
                      <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary" />
                        Muscles Targeted
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedGrip.muscles.map((muscle, i) => (
                          <span
                            key={i}
                            className={`px-3 py-1 rounded-full text-sm bg-gradient-to-r ${selectedGrip.color} text-white`}
                          >
                            {muscle}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Benefits */}
                    <div className="bg-black/30 rounded-xl p-5 border border-zinc-800">
                      <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary" />
                        Benefits
                      </h4>
                      <ul className="space-y-2">
                        {selectedGrip.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                            <Check className="w-4 h-4 text-green-400" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Exercises */}
                    <div className="bg-black/30 rounded-xl p-5 border border-zinc-800">
                      <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <Dumbbell className="w-4 h-4 text-primary" />
                        Best Exercises
                      </h4>
                      <div className="space-y-2">
                        {selectedGrip.exercises.map((exercise, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg"
                          >
                            <ArrowRight className="w-4 h-4 text-primary" />
                            <span className="text-white text-sm">{exercise}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pro Tip */}
                    <div className={`rounded-xl p-5 border ${
                      selectedGrip.id === 'false'
                        ? 'bg-red-500/10 border-red-500/30'
                        : 'bg-primary/10 border-primary/30'
                    }`}>
                      <h4 className={`font-semibold mb-2 ${
                        selectedGrip.id === 'false' ? 'text-red-400' : 'text-primary'
                      }`}>
                        {selectedGrip.id === 'false' ? '⚠️ Safety Warning' : '💡 Pro Tip'}
                      </h4>
                      <p className="text-gray-300 text-sm">{selectedGrip.tips}</p>
                    </div>

                    {/* Difficulty Badge */}
                    <div className="bg-black/30 rounded-xl p-5 border border-zinc-800 text-center">
                      <p className="text-gray-500 text-sm mb-2">Skill Level</p>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${DIFFICULTY_COLORS[selectedGrip.difficulty]}`}>
                        {selectedGrip.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-primary/30 rounded-tl-2xl" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-primary/30 rounded-br-2xl" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Reference */}
          {!selectedGrip && (
            <motion.div
              variants={fadeUp}
              className="mt-8 bg-primary/5 border border-primary/20 rounded-xl p-4"
            >
              <p className="text-sm text-gray-400 text-center">
                <span className="text-primary font-medium">Grip Tip: </span>
                Varying your grip is essential for balanced muscle development.
                Rotate between different grips to target muscles from multiple angles.
              </p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
