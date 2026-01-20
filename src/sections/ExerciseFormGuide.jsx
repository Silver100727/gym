import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Search, CheckCircle, XCircle, AlertTriangle, ChevronDown, ChevronUp, Dumbbell } from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

const EXERCISES = [
  {
    id: 'squat',
    name: 'Barbell Squat',
    category: 'legs',
    difficulty: 'Intermediate',
    muscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
    setup: [
      'Position bar on upper traps (high bar) or rear delts (low bar)',
      'Grip bar slightly wider than shoulder width',
      'Feet shoulder-width apart, toes slightly pointed out',
      'Brace core and unrack the weight',
    ],
    execution: [
      'Initiate by pushing hips back and bending knees',
      'Keep chest up and back straight throughout',
      'Descend until thighs are at least parallel to floor',
      'Drive through heels to stand back up',
      'Keep knees tracking over toes',
    ],
    commonMistakes: [
      { mistake: 'Knees caving inward', fix: 'Push knees out over toes, strengthen glutes' },
      { mistake: 'Leaning too far forward', fix: 'Keep chest up, work on ankle mobility' },
      { mistake: 'Not hitting depth', fix: 'Work on hip and ankle flexibility' },
      { mistake: 'Heels lifting off ground', fix: 'Improve ankle mobility or use heel wedges' },
    ],
    tips: [
      'Take a deep breath and brace before each rep',
      'Look slightly down to keep neutral spine',
      'Control the descent, explode on the way up',
    ],
  },
  {
    id: 'bench',
    name: 'Bench Press',
    category: 'chest',
    difficulty: 'Intermediate',
    muscles: ['Chest', 'Triceps', 'Front Delts'],
    setup: [
      'Lie on bench with eyes under the bar',
      'Grip bar slightly wider than shoulder width',
      'Plant feet firmly on the floor',
      'Retract shoulder blades and arch upper back',
      'Maintain 5 points of contact: head, shoulders, glutes, both feet',
    ],
    execution: [
      'Unrack and position bar over chest',
      'Lower bar to mid-chest with control',
      'Touch chest lightly, don\'t bounce',
      'Press bar up and slightly back',
      'Lock out arms at the top',
    ],
    commonMistakes: [
      { mistake: 'Flaring elbows 90°', fix: 'Keep elbows at 45-75° angle' },
      { mistake: 'Bouncing bar off chest', fix: 'Pause briefly at the bottom' },
      { mistake: 'Lifting hips off bench', fix: 'Drive through legs, keep glutes down' },
      { mistake: 'Not retracting shoulder blades', fix: 'Squeeze shoulder blades together and down' },
    ],
    tips: [
      'Use leg drive by pushing feet into floor',
      'Grip the bar tightly to activate more muscles',
      'Control the negative for better muscle activation',
    ],
  },
  {
    id: 'deadlift',
    name: 'Conventional Deadlift',
    category: 'back',
    difficulty: 'Advanced',
    muscles: ['Hamstrings', 'Glutes', 'Lower Back', 'Traps', 'Forearms'],
    setup: [
      'Stand with feet hip-width apart',
      'Bar over mid-foot, shins close to bar',
      'Grip bar just outside legs (overhand or mixed)',
      'Push hips back, keeping back straight',
      'Shoulders slightly in front of bar',
    ],
    execution: [
      'Take slack out of bar before lifting',
      'Push through floor while extending hips',
      'Keep bar close to body throughout',
      'Stand tall at top, squeeze glutes',
      'Lower with control, hinging at hips',
    ],
    commonMistakes: [
      { mistake: 'Rounding lower back', fix: 'Brace core harder, reduce weight' },
      { mistake: 'Bar drifting forward', fix: 'Keep bar against legs, engage lats' },
      { mistake: 'Jerking the bar', fix: 'Take slack out gradually, build tension' },
      { mistake: 'Hyperextending at top', fix: 'Finish standing tall, don\'t lean back' },
    ],
    tips: [
      'Think "push the floor away" rather than pulling',
      'Engage lats by thinking "protect your armpits"',
      'Use chalk for better grip',
    ],
  },
  {
    id: 'ohp',
    name: 'Overhead Press',
    category: 'shoulders',
    difficulty: 'Intermediate',
    muscles: ['Front Delts', 'Side Delts', 'Triceps', 'Upper Chest'],
    setup: [
      'Grip bar slightly wider than shoulder width',
      'Rest bar on front delts and clavicle',
      'Feet shoulder-width apart',
      'Brace core and squeeze glutes',
    ],
    execution: [
      'Press bar straight up, moving head back slightly',
      'Once bar passes face, push head through',
      'Lock out arms overhead',
      'Lower with control back to starting position',
    ],
    commonMistakes: [
      { mistake: 'Excessive back arch', fix: 'Squeeze glutes, tighten core' },
      { mistake: 'Pressing bar forward', fix: 'Keep bar path vertical, move head back' },
      { mistake: 'Not locking out', fix: 'Fully extend arms at the top' },
      { mistake: 'Flared elbows at start', fix: 'Keep elbows slightly in front of bar' },
    ],
    tips: [
      'Take a breath and brace before each rep',
      'Squeeze glutes to protect lower back',
      'Look straight ahead, not up',
    ],
  },
  {
    id: 'row',
    name: 'Barbell Row',
    category: 'back',
    difficulty: 'Intermediate',
    muscles: ['Lats', 'Rhomboids', 'Rear Delts', 'Biceps'],
    setup: [
      'Stand with feet hip-width apart',
      'Hinge at hips until torso is 45-60° to floor',
      'Grip bar slightly wider than shoulder width',
      'Keep back straight and core braced',
    ],
    execution: [
      'Pull bar to lower chest/upper stomach',
      'Lead with elbows, squeeze shoulder blades',
      'Control the negative, full extension',
      'Maintain hip angle throughout',
    ],
    commonMistakes: [
      { mistake: 'Using momentum/swinging', fix: 'Reduce weight, strict form' },
      { mistake: 'Torso rising too much', fix: 'Maintain hip hinge angle' },
      { mistake: 'Not squeezing at top', fix: 'Pause and squeeze shoulder blades' },
      { mistake: 'Pulling to wrong spot', fix: 'Aim for lower chest/upper abs' },
    ],
    tips: [
      'Think about pulling elbows to ceiling',
      'Keep neck neutral, don\'t crane up',
      'Start lighter to learn the movement',
    ],
  },
  {
    id: 'pullup',
    name: 'Pull-ups',
    category: 'back',
    difficulty: 'Intermediate',
    muscles: ['Lats', 'Biceps', 'Rear Delts', 'Core'],
    setup: [
      'Grip bar slightly wider than shoulder width',
      'Hang with arms fully extended',
      'Cross ankles or keep legs straight',
      'Engage lats before pulling',
    ],
    execution: [
      'Pull elbows down and back',
      'Bring chin over the bar',
      'Squeeze at the top briefly',
      'Lower with control to full extension',
    ],
    commonMistakes: [
      { mistake: 'Kipping/swinging', fix: 'Control movement, reduce momentum' },
      { mistake: 'Not full range of motion', fix: 'Full extension at bottom, chin over bar' },
      { mistake: 'Shrugging shoulders up', fix: 'Depress shoulders, engage lats first' },
      { mistake: 'Only using arms', fix: 'Focus on pulling elbows down' },
    ],
    tips: [
      'Start each rep by engaging lats',
      'Use assisted variations to build strength',
      'Dead hang between sets for grip strength',
    ],
  },
];

const CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'chest', name: 'Chest' },
  { id: 'back', name: 'Back' },
  { id: 'shoulders', name: 'Shoulders' },
  { id: 'legs', name: 'Legs' },
];

export default function ExerciseFormGuide() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedExercise, setExpandedExercise] = useState(null);

  const filteredExercises = EXERCISES.filter(ex => {
    const matchesCategory = selectedCategory === 'all' || ex.category === selectedCategory;
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.muscles.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

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
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium">Proper Technique</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Exercise <span className="text-primary">Form Guide</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Learn proper form for key exercises to maximize gains and prevent injury
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Search & Filter */}
          <motion.div variants={fadeUp} className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search exercises or muscles..."
                className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-primary text-black'
                      : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Exercise Cards */}
          <motion.div variants={fadeUp} className="space-y-4">
            {filteredExercises.length === 0 ? (
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl p-12 border border-zinc-800 text-center">
                <Dumbbell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No exercises found.</p>
              </div>
            ) : (
              filteredExercises.map((exercise, idx) => (
                <motion.div
                  key={exercise.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl border border-zinc-800 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedExercise(expandedExercise === exercise.id ? null : exercise.id)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                        <Dumbbell className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg">{exercise.name}</h3>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-gray-500">{exercise.difficulty}</span>
                          <span className="text-primary">{exercise.muscles.slice(0, 2).join(', ')}</span>
                        </div>
                      </div>
                    </div>
                    {expandedExercise === exercise.id ? (
                      <ChevronUp className="w-6 h-6 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-400" />
                    )}
                  </button>

                  <AnimatePresence>
                    {expandedExercise === exercise.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-zinc-800"
                      >
                        <div className="p-6 space-y-6">
                          {/* Muscles */}
                          <div>
                            <h4 className="text-white font-medium mb-2">Target Muscles</h4>
                            <div className="flex flex-wrap gap-2">
                              {exercise.muscles.map((muscle, i) => (
                                <span key={i} className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                                  {muscle}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Setup */}
                          <div>
                            <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 text-blue-400" />
                              Setup
                            </h4>
                            <ul className="space-y-2">
                              {exercise.setup.map((step, i) => (
                                <li key={i} className="flex items-start gap-3 text-gray-400 text-sm">
                                  <span className="w-5 h-5 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">
                                    {i + 1}
                                  </span>
                                  {step}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Execution */}
                          <div>
                            <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 text-green-400" />
                              Execution
                            </h4>
                            <ul className="space-y-2">
                              {exercise.execution.map((step, i) => (
                                <li key={i} className="flex items-start gap-3 text-gray-400 text-sm">
                                  <span className="w-5 h-5 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">
                                    {i + 1}
                                  </span>
                                  {step}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Common Mistakes */}
                          <div>
                            <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                              <XCircle className="w-5 h-5 text-red-400" />
                              Common Mistakes
                            </h4>
                            <div className="space-y-3">
                              {exercise.commonMistakes.map((item, i) => (
                                <div key={i} className="bg-zinc-800/50 rounded-xl p-4">
                                  <p className="text-red-400 text-sm font-medium mb-1">
                                    ❌ {item.mistake}
                                  </p>
                                  <p className="text-green-400 text-sm">
                                    ✓ Fix: {item.fix}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Pro Tips */}
                          <div>
                            <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                              <AlertTriangle className="w-5 h-5 text-yellow-400" />
                              Pro Tips
                            </h4>
                            <ul className="space-y-2">
                              {exercise.tips.map((tip, i) => (
                                <li key={i} className="flex items-start gap-3 text-gray-400 text-sm">
                                  <span className="text-yellow-400">💡</span>
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </motion.div>

          {/* Tip */}
          <motion.div
            variants={fadeUp}
            className="mt-8 bg-primary/5 border border-primary/20 rounded-xl p-4"
          >
            <p className="text-sm text-gray-400">
              <span className="text-primary font-medium">Form First: </span>
              Always prioritize proper form over weight. Start with lighter weights to master the
              movement pattern before progressively overloading.
            </p>
          </motion.div>
        </div>

        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-primary/20 rounded-tl-3xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-primary/20 rounded-br-3xl" />
      </motion.div>
    </section>
  );
}
