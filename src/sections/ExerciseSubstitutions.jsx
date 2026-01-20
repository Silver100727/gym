import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftRight, Dumbbell, Search, AlertTriangle, Wrench, Heart, ChevronRight, Check, X, Target, Zap } from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

const EXERCISES = [
  {
    id: 'barbell-squat',
    name: 'Barbell Back Squat',
    category: 'Legs',
    muscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
    equipment: ['Barbell', 'Squat Rack'],
    substitutes: [
      { id: 'goblet-squat', reason: ['equipment', 'preference'], match: 90 },
      { id: 'leg-press', reason: ['injury', 'preference'], match: 85 },
      { id: 'bulgarian-split', reason: ['equipment', 'injury'], match: 80 },
      { id: 'bodyweight-squat', reason: ['equipment'], match: 70 },
    ]
  },
  {
    id: 'barbell-bench',
    name: 'Barbell Bench Press',
    category: 'Chest',
    muscles: ['Chest', 'Triceps', 'Front Delts'],
    equipment: ['Barbell', 'Bench'],
    substitutes: [
      { id: 'dumbbell-bench', reason: ['equipment', 'preference', 'injury'], match: 95 },
      { id: 'push-ups', reason: ['equipment'], match: 80 },
      { id: 'chest-press-machine', reason: ['injury', 'preference'], match: 85 },
      { id: 'floor-press', reason: ['equipment', 'injury'], match: 75 },
    ]
  },
  {
    id: 'conventional-deadlift',
    name: 'Conventional Deadlift',
    category: 'Back',
    muscles: ['Lower Back', 'Glutes', 'Hamstrings', 'Traps'],
    equipment: ['Barbell'],
    substitutes: [
      { id: 'romanian-deadlift', reason: ['preference', 'injury'], match: 85 },
      { id: 'trap-bar-deadlift', reason: ['injury', 'preference'], match: 90 },
      { id: 'hip-hinge-dumbbell', reason: ['equipment'], match: 75 },
      { id: 'cable-pull-through', reason: ['equipment', 'injury'], match: 70 },
    ]
  },
  {
    id: 'pull-ups',
    name: 'Pull-Ups',
    category: 'Back',
    muscles: ['Lats', 'Biceps', 'Rear Delts', 'Core'],
    equipment: ['Pull-up Bar'],
    substitutes: [
      { id: 'lat-pulldown', reason: ['equipment', 'injury', 'preference'], match: 90 },
      { id: 'assisted-pull-ups', reason: ['preference'], match: 95 },
      { id: 'inverted-rows', reason: ['equipment', 'injury'], match: 80 },
      { id: 'resistance-band-pulldown', reason: ['equipment'], match: 70 },
    ]
  },
  {
    id: 'barbell-row',
    name: 'Barbell Bent-Over Row',
    category: 'Back',
    muscles: ['Lats', 'Rhomboids', 'Biceps', 'Lower Back'],
    equipment: ['Barbell'],
    substitutes: [
      { id: 'dumbbell-row', reason: ['equipment', 'preference', 'injury'], match: 90 },
      { id: 'cable-row', reason: ['injury', 'preference'], match: 85 },
      { id: 't-bar-row', reason: ['preference'], match: 95 },
      { id: 'chest-supported-row', reason: ['injury'], match: 85 },
    ]
  },
  {
    id: 'overhead-press',
    name: 'Overhead Barbell Press',
    category: 'Shoulders',
    muscles: ['Front Delts', 'Side Delts', 'Triceps', 'Core'],
    equipment: ['Barbell'],
    substitutes: [
      { id: 'dumbbell-shoulder-press', reason: ['equipment', 'preference', 'injury'], match: 95 },
      { id: 'arnold-press', reason: ['preference'], match: 85 },
      { id: 'machine-shoulder-press', reason: ['injury'], match: 80 },
      { id: 'landmine-press', reason: ['injury', 'preference'], match: 75 },
    ]
  },
  {
    id: 'barbell-curl',
    name: 'Barbell Bicep Curl',
    category: 'Arms',
    muscles: ['Biceps', 'Forearms'],
    equipment: ['Barbell'],
    substitutes: [
      { id: 'dumbbell-curl', reason: ['equipment', 'preference'], match: 95 },
      { id: 'hammer-curl', reason: ['injury', 'preference'], match: 85 },
      { id: 'cable-curl', reason: ['preference'], match: 90 },
      { id: 'resistance-band-curl', reason: ['equipment'], match: 70 },
    ]
  },
  {
    id: 'running',
    name: 'Running / Jogging',
    category: 'Cardio',
    muscles: ['Quadriceps', 'Hamstrings', 'Calves', 'Core'],
    equipment: ['None'],
    substitutes: [
      { id: 'cycling', reason: ['injury', 'preference'], match: 85 },
      { id: 'elliptical', reason: ['injury'], match: 90 },
      { id: 'rowing', reason: ['preference'], match: 80 },
      { id: 'swimming', reason: ['injury', 'preference'], match: 85 },
    ]
  },
];

const SUBSTITUTE_DETAILS = {
  'goblet-squat': { name: 'Goblet Squat', equipment: ['Dumbbell/Kettlebell'], tip: 'Hold weight at chest level, keep elbows inside knees' },
  'leg-press': { name: 'Leg Press Machine', equipment: ['Leg Press Machine'], tip: 'Don\'t lock knees at top, control the descent' },
  'bulgarian-split': { name: 'Bulgarian Split Squat', equipment: ['Bench', 'Dumbbells (optional)'], tip: 'Rear foot elevated, lean slightly forward' },
  'bodyweight-squat': { name: 'Bodyweight Squat', equipment: ['None'], tip: 'Add tempo or pause at bottom for difficulty' },
  'dumbbell-bench': { name: 'Dumbbell Bench Press', equipment: ['Dumbbells', 'Bench'], tip: 'Greater range of motion, better for shoulder health' },
  'push-ups': { name: 'Push-Ups', equipment: ['None'], tip: 'Elevate feet or add weight vest for progression' },
  'chest-press-machine': { name: 'Chest Press Machine', equipment: ['Machine'], tip: 'Great for isolating chest, safer for solo training' },
  'floor-press': { name: 'Floor Press', equipment: ['Dumbbells/Barbell'], tip: 'Limited ROM protects shoulders, great for lockout strength' },
  'romanian-deadlift': { name: 'Romanian Deadlift', equipment: ['Barbell/Dumbbells'], tip: 'Focus on hip hinge, slight knee bend, feel hamstring stretch' },
  'trap-bar-deadlift': { name: 'Trap Bar Deadlift', equipment: ['Trap Bar'], tip: 'More quad dominant, easier on lower back' },
  'hip-hinge-dumbbell': { name: 'Dumbbell Hip Hinge', equipment: ['Dumbbells'], tip: 'Single-leg variation adds balance challenge' },
  'cable-pull-through': { name: 'Cable Pull-Through', equipment: ['Cable Machine'], tip: 'Great for learning hip hinge pattern' },
  'lat-pulldown': { name: 'Lat Pulldown', equipment: ['Cable Machine'], tip: 'Vary grip width to target different areas' },
  'assisted-pull-ups': { name: 'Assisted Pull-Ups', equipment: ['Assisted Machine/Band'], tip: 'Gradually reduce assistance over time' },
  'inverted-rows': { name: 'Inverted Rows', equipment: ['Bar/Smith Machine'], tip: 'Adjust body angle to modify difficulty' },
  'resistance-band-pulldown': { name: 'Resistance Band Pulldown', equipment: ['Resistance Band'], tip: 'Anchor band high, focus on lat squeeze' },
  'dumbbell-row': { name: 'Dumbbell Row', equipment: ['Dumbbell', 'Bench'], tip: 'Keep core tight, pull to hip level' },
  'cable-row': { name: 'Seated Cable Row', equipment: ['Cable Machine'], tip: 'Don\'t lean too far forward/back, squeeze shoulder blades' },
  't-bar-row': { name: 'T-Bar Row', equipment: ['T-Bar', 'Landmine'], tip: 'Great for building thickness, use various grip attachments' },
  'chest-supported-row': { name: 'Chest-Supported Row', equipment: ['Incline Bench', 'Dumbbells'], tip: 'Eliminates lower back stress, pure lat/rhomboid work' },
  'dumbbell-shoulder-press': { name: 'Dumbbell Shoulder Press', equipment: ['Dumbbells'], tip: 'Allows natural arm path, better for shoulder health' },
  'arnold-press': { name: 'Arnold Press', equipment: ['Dumbbells'], tip: 'Rotation hits all three delt heads' },
  'machine-shoulder-press': { name: 'Machine Shoulder Press', equipment: ['Machine'], tip: 'Stable movement path, great for going heavy safely' },
  'landmine-press': { name: 'Landmine Press', equipment: ['Barbell', 'Landmine'], tip: 'Easier on shoulders, great pressing angle' },
  'dumbbell-curl': { name: 'Dumbbell Curl', equipment: ['Dumbbells'], tip: 'Alternate arms or curl together, full supination at top' },
  'hammer-curl': { name: 'Hammer Curl', equipment: ['Dumbbells'], tip: 'Neutral grip targets brachialis and forearms' },
  'cable-curl': { name: 'Cable Curl', equipment: ['Cable Machine'], tip: 'Constant tension throughout movement' },
  'resistance-band-curl': { name: 'Resistance Band Curl', equipment: ['Resistance Band'], tip: 'Increasing resistance through range of motion' },
  'cycling': { name: 'Cycling / Stationary Bike', equipment: ['Bike'], tip: 'Low impact, adjust resistance for intensity' },
  'elliptical': { name: 'Elliptical Trainer', equipment: ['Elliptical'], tip: 'Zero impact, full body movement' },
  'rowing': { name: 'Rowing Machine', equipment: ['Rower'], tip: 'Full body cardio, focus on leg drive' },
  'swimming': { name: 'Swimming', equipment: ['Pool'], tip: 'Zero impact, excellent for joint issues' },
};

const REASONS = [
  { id: 'equipment', label: 'Limited Equipment', icon: Wrench, color: 'text-blue-400', description: 'Don\'t have the required equipment' },
  { id: 'injury', label: 'Injury / Pain', icon: AlertTriangle, color: 'text-red-400', description: 'Avoiding due to injury or discomfort' },
  { id: 'preference', label: 'Personal Preference', icon: Heart, color: 'text-pink-400', description: 'Simply prefer a different exercise' },
];

const CATEGORIES = ['All', 'Legs', 'Chest', 'Back', 'Shoulders', 'Arms', 'Cardio'];

export default function ExerciseSubstitutions() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [selectedReason, setSelectedReason] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExercises = EXERCISES.filter(ex => {
    const matchesCategory = selectedCategory === 'All' || ex.category === selectedCategory;
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getSubstitutes = () => {
    if (!selectedExercise) return [];

    return selectedExercise.substitutes
      .filter(sub => !selectedReason || sub.reason.includes(selectedReason))
      .map(sub => ({
        ...sub,
        details: SUBSTITUTE_DETAILS[sub.id]
      }))
      .sort((a, b) => b.match - a.match);
  };

  const substitutes = getSubstitutes();

  const resetSelection = () => {
    setSelectedExercise(null);
    setSelectedReason(null);
  };

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
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
            <ArrowLeftRight className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium">Exercise Alternatives</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Exercise <span className="text-primary">Substitution</span> Finder
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Can't do an exercise? Find the perfect alternative that targets the same muscles
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {!selectedExercise ? (
              <motion.div
                key="selection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl border border-zinc-800 p-6 md:p-8"
              >
                {/* Search Bar */}
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search exercises..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/50 border border-zinc-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedCategory === cat
                          ? 'bg-primary text-black'
                          : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Exercise List */}
                <div className="space-y-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {filteredExercises.map(exercise => (
                    <motion.button
                      key={exercise.id}
                      onClick={() => setSelectedExercise(exercise)}
                      className="w-full flex items-center justify-between p-4 bg-black/30 hover:bg-black/50 border border-zinc-800 hover:border-primary/30 rounded-xl transition-all group"
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Dumbbell className="w-5 h-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <p className="text-white font-medium">{exercise.name}</p>
                          <p className="text-gray-500 text-sm">{exercise.category} • {exercise.muscles.slice(0, 2).join(', ')}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors" />
                    </motion.button>
                  ))}
                </div>

                {filteredExercises.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No exercises found. Try a different search or category.
                  </div>
                )}

                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-primary/30 rounded-tl-2xl" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-primary/30 rounded-br-2xl" />
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Selected Exercise Header */}
                <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl border border-zinc-800 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Finding alternatives for:</p>
                      <h3 className="text-2xl font-bold text-white">{selectedExercise.name}</h3>
                    </div>
                    <button
                      onClick={resetSelection}
                      className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  {/* Muscle Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedExercise.muscles.map(muscle => (
                      <span
                        key={muscle}
                        className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                      >
                        {muscle}
                      </span>
                    ))}
                  </div>

                  {/* Reason Filter */}
                  <div>
                    <p className="text-gray-400 text-sm mb-3">Why do you need a substitute?</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {REASONS.map(reason => {
                        const Icon = reason.icon;
                        const isSelected = selectedReason === reason.id;
                        return (
                          <button
                            key={reason.id}
                            onClick={() => setSelectedReason(isSelected ? null : reason.id)}
                            className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                              isSelected
                                ? 'bg-primary/10 border-primary/50'
                                : 'bg-black/30 border-zinc-800 hover:border-zinc-600'
                            }`}
                          >
                            <Icon className={`w-5 h-5 ${reason.color}`} />
                            <div className="text-left">
                              <p className={`font-medium ${isSelected ? 'text-primary' : 'text-white'}`}>
                                {reason.label}
                              </p>
                            </div>
                            {isSelected && (
                              <Check className="w-4 h-4 text-primary ml-auto" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Substitutes List */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    {substitutes.length} Alternative{substitutes.length !== 1 ? 's' : ''} Found
                  </h4>

                  {substitutes.map((sub, index) => (
                    <motion.div
                      key={sub.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-xl border border-zinc-800 p-5 hover:border-primary/30 transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <Dumbbell className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h5 className="text-lg font-semibold text-white">{sub.details.name}</h5>
                            <p className="text-gray-500 text-sm">
                              Equipment: {sub.details.equipment.join(', ')}
                            </p>
                          </div>
                        </div>

                        {/* Match Score */}
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <Zap className={`w-4 h-4 ${
                              sub.match >= 90 ? 'text-green-400' :
                              sub.match >= 80 ? 'text-yellow-400' : 'text-orange-400'
                            }`} />
                            <span className={`text-lg font-bold ${
                              sub.match >= 90 ? 'text-green-400' :
                              sub.match >= 80 ? 'text-yellow-400' : 'text-orange-400'
                            }`}>
                              {sub.match}%
                            </span>
                          </div>
                          <p className="text-gray-500 text-xs">Match</p>
                        </div>
                      </div>

                      {/* Match Bar */}
                      <div className="mb-4">
                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${
                              sub.match >= 90 ? 'bg-gradient-to-r from-green-500 to-green-400' :
                              sub.match >= 80 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                              'bg-gradient-to-r from-orange-500 to-orange-400'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${sub.match}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                          />
                        </div>
                      </div>

                      {/* Pro Tip */}
                      <div className="bg-black/30 rounded-lg p-3">
                        <p className="text-sm">
                          <span className="text-primary font-medium">Pro Tip: </span>
                          <span className="text-gray-400">{sub.details.tip}</span>
                        </p>
                      </div>

                      {/* Reason Tags */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {sub.reason.map(r => {
                          const reason = REASONS.find(re => re.id === r);
                          return (
                            <span
                              key={r}
                              className={`px-2 py-1 rounded text-xs ${
                                r === selectedReason
                                  ? 'bg-primary/20 text-primary'
                                  : 'bg-zinc-800 text-gray-400'
                              }`}
                            >
                              {reason?.label}
                            </span>
                          );
                        })}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Back Button */}
                <motion.button
                  onClick={resetSelection}
                  className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowLeftRight className="w-5 h-5" />
                  Find Another Substitute
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </section>
  );
}
