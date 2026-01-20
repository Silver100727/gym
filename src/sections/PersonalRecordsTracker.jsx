import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Plus, Trash2, Calendar, TrendingUp, Medal, Crown, Star, Dumbbell } from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

const EXERCISE_CATEGORIES = [
  { id: 'compound', name: 'Compound Lifts', icon: '🏋️' },
  { id: 'upper', name: 'Upper Body', icon: '💪' },
  { id: 'lower', name: 'Lower Body', icon: '🦵' },
  { id: 'cardio', name: 'Cardio', icon: '🏃' },
  { id: 'bodyweight', name: 'Bodyweight', icon: '🤸' },
];

const PRESET_EXERCISES = {
  compound: ['Bench Press', 'Squat', 'Deadlift', 'Overhead Press', 'Barbell Row'],
  upper: ['Bicep Curl', 'Tricep Extension', 'Lat Pulldown', 'Dumbbell Press', 'Pull-ups'],
  lower: ['Leg Press', 'Leg Curl', 'Leg Extension', 'Calf Raise', 'Hip Thrust'],
  cardio: ['5K Run', '10K Run', 'Mile Run', 'Rowing 2000m', 'Cycling 40km'],
  bodyweight: ['Push-ups (max)', 'Pull-ups (max)', 'Dips (max)', 'Plank (time)', 'Wall Sit (time)'],
};

const SAMPLE_RECORDS = [
  { id: 1, exercise: 'Bench Press', category: 'compound', value: 100, unit: 'kg', date: '2024-01-15', notes: 'New PR!' },
  { id: 2, exercise: 'Squat', category: 'compound', value: 140, unit: 'kg', date: '2024-01-20', notes: 'Felt strong' },
  { id: 3, exercise: 'Deadlift', category: 'compound', value: 180, unit: 'kg', date: '2024-01-25', notes: '' },
  { id: 4, exercise: '5K Run', category: 'cardio', value: 22.5, unit: 'min', date: '2024-02-01', notes: 'Best time' },
  { id: 5, exercise: 'Pull-ups (max)', category: 'bodyweight', value: 15, unit: 'reps', date: '2024-02-05', notes: '' },
];

export default function PersonalRecordsTracker() {
  const [records, setRecords] = useState(SAMPLE_RECORDS);
  const [selectedCategory, setSelectedCategory] = useState('compound');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRecord, setNewRecord] = useState({
    exercise: '',
    value: '',
    unit: 'kg',
    notes: '',
  });

  const filteredRecords = records.filter(r => r.category === selectedCategory);

  const addRecord = () => {
    if (!newRecord.exercise || !newRecord.value) return;

    const record = {
      id: Date.now(),
      ...newRecord,
      value: Number(newRecord.value),
      category: selectedCategory,
      date: new Date().toISOString().split('T')[0],
    };

    setRecords(prev => [...prev, record]);
    setNewRecord({ exercise: '', value: '', unit: 'kg', notes: '' });
    setShowAddModal(false);
  };

  const deleteRecord = (id) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const getBestRecord = (exercise) => {
    const exerciseRecords = records.filter(r => r.exercise === exercise);
    if (exerciseRecords.length === 0) return null;
    return exerciseRecords.reduce((best, r) => r.value > best.value ? r : best);
  };

  const totalPRs = records.length;
  const recentPRs = records.filter(r => {
    const recordDate = new Date(r.date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return recordDate > thirtyDaysAgo;
  }).length;

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
            <Trophy className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium">Personal Bests</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Personal <span className="text-primary">Records</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Track and celebrate your personal bests across all exercises
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Stats Overview */}
          <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-yellow-500/20 to-zinc-900/50 rounded-2xl p-6 border border-yellow-500/30 text-center">
              <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">{totalPRs}</p>
              <p className="text-gray-400 text-sm">Total PRs</p>
            </div>
            <div className="bg-gradient-to-br from-primary/20 to-zinc-900/50 rounded-2xl p-6 border border-primary/30 text-center">
              <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">{recentPRs}</p>
              <p className="text-gray-400 text-sm">This Month</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 to-zinc-900/50 rounded-2xl p-6 border border-purple-500/30 text-center">
              <Medal className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">{EXERCISE_CATEGORIES.length}</p>
              <p className="text-gray-400 text-sm">Categories</p>
            </div>
          </motion.div>

          {/* Category Tabs */}
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-2 mb-8">
            {EXERCISE_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-black'
                    : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                }`}
              >
                <span>{cat.icon}</span>
                <span className="text-sm font-medium">{cat.name}</span>
              </button>
            ))}
          </motion.div>

          {/* Add PR Button */}
          <motion.div variants={fadeUp} className="flex justify-end mb-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-xl font-medium hover:bg-primary/90 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add New PR
            </button>
          </motion.div>

          {/* Records Grid */}
          <motion.div variants={fadeUp} className="space-y-4">
            {filteredRecords.length === 0 ? (
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl p-12 border border-zinc-800 text-center">
                <Dumbbell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No records in this category yet.</p>
                <p className="text-gray-500 text-sm mt-2">Click "Add New PR" to get started!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredRecords.map((record, idx) => {
                  const isBest = getBestRecord(record.exercise)?.id === record.id;
                  return (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`bg-gradient-to-br rounded-2xl p-6 border ${
                        isBest
                          ? 'from-yellow-500/10 to-zinc-900/50 border-yellow-500/30'
                          : 'from-zinc-900 to-zinc-900/50 border-zinc-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            isBest ? 'bg-yellow-500/20' : 'bg-primary/20'
                          }`}>
                            {isBest ? (
                              <Crown className="w-6 h-6 text-yellow-400" />
                            ) : (
                              <Star className="w-6 h-6 text-primary" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-white font-semibold text-lg">{record.exercise}</h3>
                            <div className="flex items-center gap-3 text-gray-400 text-sm">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {record.date}
                              </span>
                              {record.notes && (
                                <span className="text-gray-500">• {record.notes}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className={`text-3xl font-bold ${isBest ? 'text-yellow-400' : 'text-white'}`}>
                              {record.value}
                            </p>
                            <p className="text-gray-500 text-sm">{record.unit}</p>
                          </div>
                          <button
                            onClick={() => deleteRecord(record.id)}
                            className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Add PR Modal */}
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
                  className="bg-zinc-900 rounded-2xl p-6 w-full max-w-md border border-zinc-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-primary" />
                    Add New Personal Record
                  </h3>

                  <div className="space-y-4">
                    {/* Exercise Selection */}
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Exercise</label>
                      <select
                        value={newRecord.exercise}
                        onChange={(e) => setNewRecord(prev => ({ ...prev, exercise: e.target.value }))}
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-primary"
                      >
                        <option value="">Select exercise...</option>
                        {PRESET_EXERCISES[selectedCategory]?.map(ex => (
                          <option key={ex} value={ex}>{ex}</option>
                        ))}
                      </select>
                    </div>

                    {/* Value and Unit */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-gray-400 text-sm mb-2 block">Value</label>
                        <input
                          type="number"
                          value={newRecord.value}
                          onChange={(e) => setNewRecord(prev => ({ ...prev, value: e.target.value }))}
                          placeholder="0"
                          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm mb-2 block">Unit</label>
                        <select
                          value={newRecord.unit}
                          onChange={(e) => setNewRecord(prev => ({ ...prev, unit: e.target.value }))}
                          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-primary"
                        >
                          <option value="kg">kg</option>
                          <option value="lbs">lbs</option>
                          <option value="reps">reps</option>
                          <option value="min">minutes</option>
                          <option value="sec">seconds</option>
                        </select>
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Notes (optional)</label>
                      <input
                        type="text"
                        value={newRecord.notes}
                        onChange={(e) => setNewRecord(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="How did it feel?"
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
                        onClick={addRecord}
                        disabled={!newRecord.exercise || !newRecord.value}
                        className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                          newRecord.exercise && newRecord.value
                            ? 'bg-primary text-black hover:bg-primary/90'
                            : 'bg-zinc-700 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Save PR
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-primary/20 rounded-tl-3xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-primary/20 rounded-br-3xl" />
      </motion.div>
    </section>
  );
}
