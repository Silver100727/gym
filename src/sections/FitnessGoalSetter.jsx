import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Trash2, Check, Calendar, TrendingUp, Award, Sparkles, Edit2 } from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

const GOAL_CATEGORIES = [
  { id: 'strength', name: 'Strength', icon: '💪', color: 'bg-red-500/20 text-red-400' },
  { id: 'cardio', name: 'Cardio', icon: '🏃', color: 'bg-blue-500/20 text-blue-400' },
  { id: 'weight', name: 'Weight', icon: '⚖️', color: 'bg-green-500/20 text-green-400' },
  { id: 'nutrition', name: 'Nutrition', icon: '🥗', color: 'bg-yellow-500/20 text-yellow-400' },
  { id: 'habit', name: 'Habit', icon: '✨', color: 'bg-purple-500/20 text-purple-400' },
];

const GOAL_TEMPLATES = [
  { category: 'strength', title: 'Bench Press 100kg', description: 'Increase bench press to 100kg for 1 rep' },
  { category: 'strength', title: 'Do 10 Pull-ups', description: 'Complete 10 strict pull-ups in a row' },
  { category: 'cardio', title: 'Run 5K under 25 min', description: 'Complete a 5K run in under 25 minutes' },
  { category: 'cardio', title: 'Complete a Half Marathon', description: 'Finish a 21.1km half marathon' },
  { category: 'weight', title: 'Lose 5kg', description: 'Reduce body weight by 5kg healthily' },
  { category: 'weight', title: 'Gain 3kg Muscle', description: 'Add 3kg of lean muscle mass' },
  { category: 'nutrition', title: 'Track Meals for 30 Days', description: 'Log all meals for 30 consecutive days' },
  { category: 'habit', title: 'Workout 4x/week for 3 Months', description: 'Maintain consistent training schedule' },
];

const SAMPLE_GOALS = [
  { id: 1, category: 'strength', title: 'Squat 140kg', description: 'Increase squat to 140kg for 1 rep max', target: '140kg', current: '120kg', progress: 70, deadline: '2024-06-01', completed: false },
  { id: 2, category: 'cardio', title: '5K Run Goal', description: 'Run 5K in under 22 minutes', target: '22:00', current: '24:30', progress: 60, deadline: '2024-04-15', completed: false },
  { id: 3, category: 'habit', title: 'Morning Workout Routine', description: 'Complete 30 morning workouts', target: '30 workouts', current: '18 workouts', progress: 60, deadline: '2024-03-31', completed: false },
];

export default function FitnessGoalSetter() {
  const [goals, setGoals] = useState(SAMPLE_GOALS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newGoal, setNewGoal] = useState({
    category: 'strength',
    title: '',
    description: '',
    target: '',
    current: '',
    deadline: '',
  });

  const filteredGoals = selectedCategory === 'all'
    ? goals
    : goals.filter(g => g.category === selectedCategory);

  const addGoal = () => {
    if (!newGoal.title || !newGoal.target || !newGoal.deadline) return;

    const goal = {
      id: Date.now(),
      ...newGoal,
      progress: 0,
      completed: false,
    };

    setGoals(prev => [...prev, goal]);
    setNewGoal({ category: 'strength', title: '', description: '', target: '', current: '', deadline: '' });
    setShowAddModal(false);
  };

  const toggleComplete = (id) => {
    setGoals(prev => prev.map(g =>
      g.id === id ? { ...g, completed: !g.completed, progress: g.completed ? g.progress : 100 } : g
    ));
  };

  const updateProgress = (id, progress) => {
    setGoals(prev => prev.map(g =>
      g.id === id ? { ...g, progress: Math.min(100, Math.max(0, progress)) } : g
    ));
  };

  const deleteGoal = (id) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const applyTemplate = (template) => {
    setNewGoal(prev => ({
      ...prev,
      category: template.category,
      title: template.title,
      description: template.description,
    }));
  };

  const completedGoals = goals.filter(g => g.completed).length;
  const activeGoals = goals.filter(g => !g.completed).length;
  const avgProgress = goals.length > 0
    ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)
    : 0;

  const getCategoryInfo = (categoryId) => GOAL_CATEGORIES.find(c => c.id === categoryId);

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
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
            <Target className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium">Goal Setting</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Fitness <span className="text-primary">Goals</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Set SMART goals and track your progress towards achieving them
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Stats */}
          <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl p-4 border border-zinc-800 text-center">
              <Target className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{activeGoals}</p>
              <p className="text-gray-500 text-sm">Active Goals</p>
            </div>
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl p-4 border border-zinc-800 text-center">
              <Award className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{completedGoals}</p>
              <p className="text-gray-500 text-sm">Completed</p>
            </div>
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl p-4 border border-zinc-800 text-center">
              <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{avgProgress}%</p>
              <p className="text-gray-500 text-sm">Avg Progress</p>
            </div>
          </motion.div>

          {/* Category Filter */}
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-2 mb-6">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-primary text-black'
                  : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
              }`}
            >
              All Goals
            </button>
            {GOAL_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-black'
                    : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </motion.div>

          {/* Add Goal Button */}
          <motion.div variants={fadeUp} className="flex justify-end mb-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-xl font-medium hover:bg-primary/90 transition-all"
            >
              <Plus className="w-5 h-5" />
              New Goal
            </button>
          </motion.div>

          {/* Goals List */}
          <motion.div variants={fadeUp} className="space-y-4">
            {filteredGoals.length === 0 ? (
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl p-12 border border-zinc-800 text-center">
                <Target className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No goals yet.</p>
                <p className="text-gray-500 text-sm mt-2">Click "New Goal" to start setting goals!</p>
              </div>
            ) : (
              filteredGoals.map((goal, idx) => {
                const category = getCategoryInfo(goal.category);
                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`bg-gradient-to-br rounded-2xl p-6 border ${
                      goal.completed
                        ? 'from-green-500/10 to-zinc-900/50 border-green-500/30'
                        : 'from-zinc-900 to-zinc-900/50 border-zinc-800'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => toggleComplete(goal.id)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                            goal.completed
                              ? 'bg-green-500 text-white'
                              : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                          }`}
                        >
                          {goal.completed && <Check className="w-5 h-5" />}
                        </button>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-sm px-2 py-0.5 rounded-full ${category?.color}`}>
                              {category?.icon} {category?.name}
                            </span>
                          </div>
                          <h3 className={`text-lg font-semibold ${goal.completed ? 'text-green-400 line-through' : 'text-white'}`}>
                            {goal.title}
                          </h3>
                          <p className="text-gray-500 text-sm">{goal.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-primary font-medium">{goal.progress}%</span>
                      </div>
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${goal.completed ? 'bg-green-500' : 'bg-primary'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${goal.progress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      {!goal.completed && (
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={goal.progress}
                          onChange={(e) => updateProgress(goal.id, Number(e.target.value))}
                          className="w-full mt-2 accent-primary"
                        />
                      )}
                    </div>

                    {/* Goal Details */}
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="bg-zinc-800/50 rounded-lg p-3">
                        <p className="text-gray-500 text-xs">Target</p>
                        <p className="text-white font-medium">{goal.target}</p>
                      </div>
                      <div className="bg-zinc-800/50 rounded-lg p-3">
                        <p className="text-gray-500 text-xs">Current</p>
                        <p className="text-primary font-medium">{goal.current || 'Not set'}</p>
                      </div>
                      <div className="bg-zinc-800/50 rounded-lg p-3">
                        <p className="text-gray-500 text-xs">Deadline</p>
                        <p className="text-white font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {goal.deadline}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>

          {/* Add Goal Modal */}
          <AnimatePresence>
            {showAddModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                onClick={() => setShowAddModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-zinc-900 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-zinc-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Target className="w-6 h-6 text-primary" />
                    Set New Goal
                  </h3>

                  {/* Templates */}
                  <div className="mb-6">
                    <p className="text-gray-400 text-sm mb-2">Quick Templates:</p>
                    <div className="flex flex-wrap gap-2">
                      {GOAL_TEMPLATES.slice(0, 4).map((template, idx) => (
                        <button
                          key={idx}
                          onClick={() => applyTemplate(template)}
                          className="text-xs px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-gray-400 rounded-lg transition-all"
                        >
                          {template.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Category */}
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Category</label>
                      <div className="grid grid-cols-5 gap-2">
                        {GOAL_CATEGORIES.map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => setNewGoal(prev => ({ ...prev, category: cat.id }))}
                            className={`p-3 rounded-xl text-center transition-all ${
                              newGoal.category === cat.id
                                ? 'bg-primary text-black'
                                : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                            }`}
                          >
                            <span className="text-xl block">{cat.icon}</span>
                            <span className="text-xs">{cat.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Goal Title</label>
                      <input
                        type="text"
                        value={newGoal.title}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Bench Press 100kg"
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-primary"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Description</label>
                      <textarea
                        value={newGoal.description}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe your goal..."
                        rows={2}
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-primary resize-none"
                      />
                    </div>

                    {/* Target & Current */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-gray-400 text-sm mb-2 block">Target</label>
                        <input
                          type="text"
                          value={newGoal.target}
                          onChange={(e) => setNewGoal(prev => ({ ...prev, target: e.target.value }))}
                          placeholder="e.g., 100kg"
                          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm mb-2 block">Current (optional)</label>
                        <input
                          type="text"
                          value={newGoal.current}
                          onChange={(e) => setNewGoal(prev => ({ ...prev, current: e.target.value }))}
                          placeholder="e.g., 80kg"
                          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Deadline */}
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Deadline</label>
                      <input
                        type="date"
                        value={newGoal.deadline}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-primary"
                      />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => setShowAddModal(false)}
                        className="flex-1 py-3 bg-zinc-800 text-white rounded-xl font-medium hover:bg-zinc-700 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={addGoal}
                        disabled={!newGoal.title || !newGoal.target || !newGoal.deadline}
                        className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                          newGoal.title && newGoal.target && newGoal.deadline
                            ? 'bg-primary text-black hover:bg-primary/90'
                            : 'bg-zinc-700 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Create Goal
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SMART Goals Tip */}
          <motion.div
            variants={fadeUp}
            className="mt-8 bg-primary/5 border border-primary/20 rounded-xl p-4"
          >
            <p className="text-sm text-gray-400">
              <span className="text-primary font-medium">SMART Goals: </span>
              Make goals Specific, Measurable, Achievable, Relevant, and Time-bound.
              Break big goals into smaller milestones for better tracking.
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
