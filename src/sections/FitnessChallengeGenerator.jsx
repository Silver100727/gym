import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Flame, Calendar, CheckCircle, Circle, RotateCcw, Share2, Star, Target, TrendingUp, Zap } from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

const CHALLENGES = [
  {
    id: 'pushup',
    name: '30-Day Push-Up Challenge',
    icon: '💪',
    category: 'Strength',
    muscle: 'Chest & Arms',
    color: 'from-red-500 to-orange-500',
    description: 'Build upper body strength with progressive push-ups',
    startReps: 10,
    endReps: 100,
    unit: 'push-ups',
    tips: ['Keep core tight', 'Full range of motion', 'Rest 1-2 min between sets'],
  },
  {
    id: 'squat',
    name: '30-Day Squat Challenge',
    icon: '🦵',
    category: 'Strength',
    muscle: 'Legs & Glutes',
    color: 'from-blue-500 to-cyan-500',
    description: 'Sculpt your lower body with daily squats',
    startReps: 20,
    endReps: 200,
    unit: 'squats',
    tips: ['Knees track over toes', 'Go below parallel', 'Drive through heels'],
  },
  {
    id: 'plank',
    name: '30-Day Plank Challenge',
    icon: '🧘',
    category: 'Core',
    muscle: 'Abs & Core',
    color: 'from-purple-500 to-pink-500',
    description: 'Build core stability with increasing hold times',
    startReps: 20,
    endReps: 300,
    unit: 'seconds',
    tips: ['Keep body straight', 'Engage glutes', 'Breathe steadily'],
  },
  {
    id: 'burpee',
    name: '30-Day Burpee Challenge',
    icon: '🔥',
    category: 'Cardio',
    muscle: 'Full Body',
    color: 'from-orange-500 to-yellow-500',
    description: 'Ultimate full-body cardio challenge',
    startReps: 5,
    endReps: 50,
    unit: 'burpees',
    tips: ['Explosive jump', 'Chest to floor', 'Pace yourself'],
  },
  {
    id: 'lunge',
    name: '30-Day Lunge Challenge',
    icon: '🏃',
    category: 'Strength',
    muscle: 'Legs & Balance',
    color: 'from-green-500 to-emerald-500',
    description: 'Improve leg strength and balance',
    startReps: 20,
    endReps: 100,
    unit: 'lunges (total)',
    tips: ['Alternate legs', 'Keep torso upright', '90° knee angle'],
  },
  {
    id: 'situp',
    name: '30-Day Sit-Up Challenge',
    icon: '🎯',
    category: 'Core',
    muscle: 'Abs',
    color: 'from-indigo-500 to-violet-500',
    description: 'Define your abs with progressive sit-ups',
    startReps: 15,
    endReps: 125,
    unit: 'sit-ups',
    tips: ['Don\'t pull neck', 'Controlled descent', 'Exhale on the way up'],
  },
  {
    id: 'jumping-jack',
    name: '30-Day Jumping Jack Challenge',
    icon: '⭐',
    category: 'Cardio',
    muscle: 'Full Body',
    color: 'from-amber-500 to-orange-500',
    description: 'Boost cardio endurance with jumping jacks',
    startReps: 50,
    endReps: 500,
    unit: 'jumping jacks',
    tips: ['Land softly', 'Full arm extension', 'Maintain rhythm'],
  },
  {
    id: 'wall-sit',
    name: '30-Day Wall Sit Challenge',
    icon: '🧱',
    category: 'Endurance',
    muscle: 'Quads & Glutes',
    color: 'from-teal-500 to-cyan-500',
    description: 'Build leg endurance with wall sits',
    startReps: 30,
    endReps: 300,
    unit: 'seconds',
    tips: ['90° knee angle', 'Back flat on wall', 'Don\'t rest hands on thighs'],
  },
];

const DIFFICULTY_LEVELS = [
  { id: 'beginner', name: 'Beginner', multiplier: 0.6, description: '60% of standard' },
  { id: 'standard', name: 'Standard', multiplier: 1, description: 'Recommended' },
  { id: 'advanced', name: 'Advanced', multiplier: 1.4, description: '140% of standard' },
  { id: 'beast', name: 'Beast Mode', multiplier: 2, description: '200% - extreme!' },
];

const generateDailyTargets = (challenge, difficulty) => {
  const multiplier = DIFFICULTY_LEVELS.find(d => d.id === difficulty)?.multiplier || 1;
  const start = Math.round(challenge.startReps * multiplier);
  const end = Math.round(challenge.endReps * multiplier);
  const increment = (end - start) / 29;

  // Generate targets with rest days on day 7, 14, 21
  return Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const isRestDay = day === 7 || day === 14 || day === 21;

    if (isRestDay) {
      return { day, target: 0, isRestDay: true };
    }

    // Calculate target with slight variations for interest
    let target = Math.round(start + (increment * i));

    // Add small bumps on milestone days
    if (day === 10 || day === 20) target = Math.round(target * 1.1);
    if (day === 30) target = end;

    return { day, target, isRestDay: false };
  });
};

export default function FitnessChallengeGenerator() {
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [difficulty, setDifficulty] = useState('standard');
  const [completedDays, setCompletedDays] = useState([]);
  const [isActive, setIsActive] = useState(false);

  const dailyTargets = useMemo(() => {
    if (!selectedChallenge) return [];
    return generateDailyTargets(selectedChallenge, difficulty);
  }, [selectedChallenge, difficulty]);

  const toggleDayComplete = (day) => {
    setCompletedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const startChallenge = () => {
    setIsActive(true);
    setCompletedDays([]);
  };

  const resetChallenge = () => {
    setSelectedChallenge(null);
    setIsActive(false);
    setCompletedDays([]);
  };

  const progress = (completedDays.length / 30) * 100;
  const totalReps = dailyTargets
    .filter(d => completedDays.includes(d.day))
    .reduce((sum, d) => sum + d.target, 0);

  const currentStreak = useMemo(() => {
    let streak = 0;
    for (let i = completedDays.length; i > 0; i--) {
      if (completedDays.includes(i)) streak++;
      else break;
    }
    return streak;
  }, [completedDays]);

  const shareChallenge = async () => {
    const text = `I'm doing the ${selectedChallenge?.name}! 💪 Day ${completedDays.length}/30 complete. Total: ${totalReps} ${selectedChallenge?.unit}!`;

    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (e) {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
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
            <Trophy className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium">30-Day Challenges</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Fitness <span className="text-primary">Challenge</span> Generator
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Pick a challenge, commit for 30 days, and transform your fitness
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {!selectedChallenge ? (
              <motion.div
                key="selection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {CHALLENGES.map((challenge, index) => (
                  <motion.button
                    key={challenge.id}
                    onClick={() => setSelectedChallenge(challenge)}
                    className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-zinc-800 hover:border-primary/30 rounded-2xl p-5 text-left transition-all group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${challenge.color} flex items-center justify-center text-2xl mb-4`}>
                      {challenge.icon}
                    </div>
                    <h3 className="font-bold text-white mb-1 group-hover:text-primary transition-colors">
                      {challenge.name.replace('30-Day ', '')}
                    </h3>
                    <p className="text-gray-500 text-sm mb-3">{challenge.muscle}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-2 py-1 bg-zinc-800 text-gray-400 rounded">
                        {challenge.category}
                      </span>
                      <span className="text-xs text-primary">
                        {challenge.startReps} → {challenge.endReps}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            ) : !isActive ? (
              <motion.div
                key="setup"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl border border-zinc-800 p-6 md:p-8"
              >
                {/* Challenge Preview */}
                <div className="flex items-start gap-4 mb-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedChallenge.color} flex items-center justify-center text-3xl`}>
                    {selectedChallenge.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-1">{selectedChallenge.name}</h3>
                    <p className="text-gray-400">{selectedChallenge.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedChallenge(null)}
                    className="text-gray-500 hover:text-white transition-colors"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>

                {/* Difficulty Selection */}
                <div className="mb-8">
                  <p className="text-gray-400 text-sm mb-3">Select Difficulty</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {DIFFICULTY_LEVELS.map(level => (
                      <button
                        key={level.id}
                        onClick={() => setDifficulty(level.id)}
                        className={`p-4 rounded-xl border transition-all ${
                          difficulty === level.id
                            ? 'bg-primary/10 border-primary/50 text-primary'
                            : 'bg-black/30 border-zinc-800 text-gray-400 hover:border-zinc-600'
                        }`}
                      >
                        <p className="font-bold">{level.name}</p>
                        <p className="text-xs opacity-70">{level.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-black/30 rounded-xl p-4 border border-zinc-800 text-center">
                    <p className="text-gray-500 text-sm">Day 1</p>
                    <p className="text-2xl font-bold text-white">{dailyTargets[0]?.target}</p>
                    <p className="text-gray-600 text-xs">{selectedChallenge.unit}</p>
                  </div>
                  <div className="bg-black/30 rounded-xl p-4 border border-zinc-800 text-center">
                    <p className="text-gray-500 text-sm">Day 15</p>
                    <p className="text-2xl font-bold text-primary">{dailyTargets[14]?.target}</p>
                    <p className="text-gray-600 text-xs">{selectedChallenge.unit}</p>
                  </div>
                  <div className="bg-black/30 rounded-xl p-4 border border-zinc-800 text-center">
                    <p className="text-gray-500 text-sm">Day 30</p>
                    <p className="text-2xl font-bold text-white">{dailyTargets[29]?.target}</p>
                    <p className="text-gray-600 text-xs">{selectedChallenge.unit}</p>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-black/30 rounded-xl p-4 border border-zinc-800 mb-8">
                  <p className="text-primary font-medium mb-2">Pro Tips:</p>
                  <ul className="space-y-1">
                    {selectedChallenge.tips.map((tip, i) => (
                      <li key={i} className="text-gray-400 text-sm flex items-center gap-2">
                        <Star className="w-3 h-3 text-yellow-500" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Start Button */}
                <motion.button
                  onClick={startChallenge}
                  className="w-full py-4 bg-gradient-to-r from-primary to-orange-500 text-black font-bold rounded-xl flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Flame className="w-5 h-5" />
                  Start 30-Day Challenge
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="active"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Progress Header */}
                <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl border border-zinc-800 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${selectedChallenge.color} flex items-center justify-center text-2xl`}>
                        {selectedChallenge.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{selectedChallenge.name}</h3>
                        <p className="text-gray-500 text-sm">
                          {DIFFICULTY_LEVELS.find(d => d.id === difficulty)?.name} Mode
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={shareChallenge}
                        className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                      >
                        <Share2 className="w-5 h-5 text-gray-400" />
                      </button>
                      <button
                        onClick={resetChallenge}
                        className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                      >
                        <RotateCcw className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-primary font-medium">{completedDays.length}/30 days</span>
                    </div>
                    <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${selectedChallenge.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{totalReps.toLocaleString()}</p>
                      <p className="text-gray-500 text-xs">Total {selectedChallenge.unit}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{currentStreak}</p>
                      <p className="text-gray-500 text-xs">Day Streak</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{30 - completedDays.length}</p>
                      <p className="text-gray-500 text-xs">Days Left</p>
                    </div>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl border border-zinc-800 p-6">
                  <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    30-Day Calendar
                  </h4>
                  <div className="grid grid-cols-6 md:grid-cols-10 gap-2">
                    {dailyTargets.map(({ day, target, isRestDay }) => {
                      const isCompleted = completedDays.includes(day);
                      return (
                        <motion.button
                          key={day}
                          onClick={() => !isRestDay && toggleDayComplete(day)}
                          disabled={isRestDay}
                          className={`aspect-square rounded-xl border flex flex-col items-center justify-center transition-all ${
                            isRestDay
                              ? 'bg-zinc-900 border-zinc-800 cursor-not-allowed'
                              : isCompleted
                                ? `bg-gradient-to-br ${selectedChallenge.color} border-transparent`
                                : 'bg-black/30 border-zinc-800 hover:border-primary/50'
                          }`}
                          whileHover={!isRestDay ? { scale: 1.05 } : {}}
                          whileTap={!isRestDay ? { scale: 0.95 } : {}}
                        >
                          <span className={`text-xs ${
                            isRestDay ? 'text-gray-700' : isCompleted ? 'text-white/70' : 'text-gray-600'
                          }`}>
                            Day {day}
                          </span>
                          {isRestDay ? (
                            <span className="text-gray-700 text-xs">REST</span>
                          ) : isCompleted ? (
                            <CheckCircle className="w-4 h-4 text-white" />
                          ) : (
                            <span className="text-white font-bold text-sm">{target}</span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Today's Target */}
                {completedDays.length < 30 && (
                  <div className={`bg-gradient-to-br ${selectedChallenge.color} rounded-2xl p-6 text-center`}>
                    <p className="text-white/70 text-sm mb-1">Today's Target</p>
                    <p className="text-5xl font-bold text-white mb-2">
                      {dailyTargets[completedDays.length]?.isRestDay
                        ? 'REST DAY'
                        : dailyTargets[completedDays.length]?.target}
                    </p>
                    {!dailyTargets[completedDays.length]?.isRestDay && (
                      <p className="text-white/70">{selectedChallenge.unit}</p>
                    )}
                  </div>
                )}

                {/* Completion */}
                {completedDays.length === 30 && (
                  <motion.div
                    className="bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 rounded-2xl border border-yellow-500/30 p-8 text-center"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">Challenge Complete!</h3>
                    <p className="text-gray-400 mb-4">
                      You crushed {totalReps.toLocaleString()} {selectedChallenge.unit} in 30 days!
                    </p>
                    <button
                      onClick={resetChallenge}
                      className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-xl"
                    >
                      Start New Challenge
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  );
}
