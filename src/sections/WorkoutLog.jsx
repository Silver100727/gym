import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, Plus, Trash2, Calendar, Clock, Dumbbell, Flame, ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

const EXERCISE_OPTIONS = [
  'Bench Press', 'Squat', 'Deadlift', 'Overhead Press', 'Barbell Row',
  'Pull-ups', 'Dips', 'Leg Press', 'Lat Pulldown', 'Bicep Curl',
  'Tricep Extension', 'Leg Curl', 'Leg Extension', 'Calf Raise',
  'Face Pull', 'Lateral Raise', 'Romanian Deadlift', 'Hip Thrust',
];

const SAMPLE_LOGS = [
  {
    id: 1,
    date: '2024-02-10',
    name: 'Push Day',
    duration: 65,
    exercises: [
      { name: 'Bench Press', sets: [{ weight: 80, reps: 8 }, { weight: 85, reps: 6 }, { weight: 85, reps: 6 }, { weight: 80, reps: 8 }] },
      { name: 'Overhead Press', sets: [{ weight: 50, reps: 8 }, { weight: 52.5, reps: 7 }, { weight: 52.5, reps: 6 }] },
      { name: 'Dips', sets: [{ weight: 0, reps: 12 }, { weight: 0, reps: 10 }, { weight: 0, reps: 10 }] },
    ],
  },
  {
    id: 2,
    date: '2024-02-08',
    name: 'Pull Day',
    duration: 70,
    exercises: [
      { name: 'Deadlift', sets: [{ weight: 120, reps: 5 }, { weight: 130, reps: 5 }, { weight: 140, reps: 3 }] },
      { name: 'Barbell Row', sets: [{ weight: 70, reps: 8 }, { weight: 75, reps: 7 }, { weight: 75, reps: 6 }] },
      { name: 'Pull-ups', sets: [{ weight: 0, reps: 10 }, { weight: 0, reps: 8 }, { weight: 0, reps: 7 }] },
    ],
  },
];

export default function WorkoutLog() {
  const [logs, setLogs] = useState(SAMPLE_LOGS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedLog, setExpandedLog] = useState(null);
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    duration: 60,
    exercises: [],
  });
  const [currentExercise, setCurrentExercise] = useState({
    name: '',
    sets: [{ weight: '', reps: '' }],
  });

  const addSet = () => {
    setCurrentExercise(prev => ({
      ...prev,
      sets: [...prev.sets, { weight: '', reps: '' }],
    }));
  };

  const updateSet = (setIdx, field, value) => {
    setCurrentExercise(prev => ({
      ...prev,
      sets: prev.sets.map((set, idx) =>
        idx === setIdx ? { ...set, [field]: value } : set
      ),
    }));
  };

  const addExerciseToWorkout = () => {
    if (!currentExercise.name) return;
    const validSets = currentExercise.sets.filter(s => s.weight !== '' && s.reps !== '');
    if (validSets.length === 0) return;

    setNewWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, { ...currentExercise, sets: validSets.map(s => ({ weight: Number(s.weight), reps: Number(s.reps) })) }],
    }));
    setCurrentExercise({ name: '', sets: [{ weight: '', reps: '' }] });
  };

  const saveWorkout = () => {
    if (!newWorkout.name || newWorkout.exercises.length === 0) return;

    const workout = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      ...newWorkout,
    };

    setLogs(prev => [workout, ...prev]);
    setNewWorkout({ name: '', duration: 60, exercises: [] });
    setShowAddModal(false);
  };

  const deleteLog = (id) => {
    setLogs(prev => prev.filter(log => log.id !== id));
  };

  const getTotalVolume = (exercises) => {
    return exercises.reduce((total, ex) => {
      return total + ex.sets.reduce((setTotal, set) => setTotal + set.weight * set.reps, 0);
    }, 0);
  };

  const getTotalSets = (exercises) => {
    return exercises.reduce((total, ex) => total + ex.sets.length, 0);
  };

  const thisWeekLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    const today = new Date();
    const weekAgo = new Date(today.setDate(today.getDate() - 7));
    return logDate >= weekAgo;
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
            <ClipboardList className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium">Training Journal</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Workout <span className="text-primary">Log</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Track your workouts and monitor your training progress over time
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Stats */}
          <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl p-4 border border-zinc-800 text-center">
              <Dumbbell className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{logs.length}</p>
              <p className="text-gray-500 text-sm">Total Workouts</p>
            </div>
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl p-4 border border-zinc-800 text-center">
              <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{thisWeekLogs.length}</p>
              <p className="text-gray-500 text-sm">This Week</p>
            </div>
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl p-4 border border-zinc-800 text-center">
              <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {logs.length > 0 ? Math.round(logs.reduce((sum, log) => sum + getTotalVolume(log.exercises), 0) / logs.length).toLocaleString() : 0}
              </p>
              <p className="text-gray-500 text-sm">Avg Volume (kg)</p>
            </div>
          </motion.div>

          {/* Add Workout Button */}
          <motion.div variants={fadeUp} className="flex justify-end mb-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-xl font-medium hover:bg-primary/90 transition-all"
            >
              <Plus className="w-5 h-5" />
              Log Workout
            </button>
          </motion.div>

          {/* Workout Logs */}
          <motion.div variants={fadeUp} className="space-y-4">
            {logs.length === 0 ? (
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl p-12 border border-zinc-800 text-center">
                <ClipboardList className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No workouts logged yet.</p>
                <p className="text-gray-500 text-sm mt-2">Click "Log Workout" to get started!</p>
              </div>
            ) : (
              logs.map((log, idx) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl border border-zinc-800 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                        <Dumbbell className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">{log.name}</p>
                        <div className="flex items-center gap-3 text-gray-500 text-sm">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {log.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {log.duration} min
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-primary font-semibold">{getTotalVolume(log.exercises).toLocaleString()} kg</p>
                        <p className="text-gray-500 text-xs">{getTotalSets(log.exercises)} sets</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteLog(log.id); }}
                        className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      {expandedLog === log.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedLog === log.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-zinc-800"
                      >
                        <div className="p-4 space-y-4">
                          {log.exercises.map((exercise, exIdx) => (
                            <div key={exIdx} className="bg-zinc-800/50 rounded-xl p-4">
                              <p className="text-white font-medium mb-3">{exercise.name}</p>
                              <div className="grid grid-cols-4 gap-2 text-center text-sm">
                                <p className="text-gray-500">Set</p>
                                <p className="text-gray-500">Weight</p>
                                <p className="text-gray-500">Reps</p>
                                <p className="text-gray-500">Volume</p>
                                {exercise.sets.map((set, setIdx) => (
                                  <>
                                    <p key={`set-${setIdx}`} className="text-gray-400">{setIdx + 1}</p>
                                    <p key={`weight-${setIdx}`} className="text-white">{set.weight} kg</p>
                                    <p key={`reps-${setIdx}`} className="text-white">{set.reps}</p>
                                    <p key={`vol-${setIdx}`} className="text-primary">{set.weight * set.reps}</p>
                                  </>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </motion.div>

          {/* Add Workout Modal */}
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
                    <ClipboardList className="w-6 h-6 text-primary" />
                    Log New Workout
                  </h3>

                  <div className="space-y-4">
                    {/* Workout Name */}
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Workout Name</label>
                      <input
                        type="text"
                        value={newWorkout.name}
                        onChange={(e) => setNewWorkout(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Push Day, Leg Day"
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-primary"
                      />
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Duration (minutes)</label>
                      <input
                        type="number"
                        value={newWorkout.duration}
                        onChange={(e) => setNewWorkout(prev => ({ ...prev, duration: Number(e.target.value) }))}
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-primary"
                      />
                    </div>

                    {/* Added Exercises */}
                    {newWorkout.exercises.length > 0 && (
                      <div className="bg-zinc-800/50 rounded-xl p-4">
                        <p className="text-gray-400 text-sm mb-2">Added Exercises:</p>
                        {newWorkout.exercises.map((ex, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm py-1">
                            <span className="text-white">{ex.name}</span>
                            <span className="text-gray-400">{ex.sets.length} sets</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Exercise */}
                    <div className="border border-zinc-700 rounded-xl p-4">
                      <p className="text-white font-medium mb-3">Add Exercise</p>
                      <select
                        value={currentExercise.name}
                        onChange={(e) => setCurrentExercise(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-primary mb-3"
                      >
                        <option value="">Select exercise...</option>
                        {EXERCISE_OPTIONS.map(ex => (
                          <option key={ex} value={ex}>{ex}</option>
                        ))}
                      </select>

                      {currentExercise.sets.map((set, setIdx) => (
                        <div key={setIdx} className="grid grid-cols-3 gap-2 mb-2">
                          <div className="text-center text-gray-500 text-sm pt-3">Set {setIdx + 1}</div>
                          <input
                            type="number"
                            value={set.weight}
                            onChange={(e) => updateSet(setIdx, 'weight', e.target.value)}
                            placeholder="kg"
                            className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-center focus:outline-none focus:border-primary"
                          />
                          <input
                            type="number"
                            value={set.reps}
                            onChange={(e) => updateSet(setIdx, 'reps', e.target.value)}
                            placeholder="reps"
                            className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-center focus:outline-none focus:border-primary"
                          />
                        </div>
                      ))}

                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={addSet}
                          className="flex-1 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-sm transition-all"
                        >
                          + Add Set
                        </button>
                        <button
                          onClick={addExerciseToWorkout}
                          className="flex-1 py-2 bg-primary hover:bg-primary/90 text-black rounded-lg text-sm font-medium transition-all"
                        >
                          Add Exercise
                        </button>
                      </div>
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
                        onClick={saveWorkout}
                        disabled={!newWorkout.name || newWorkout.exercises.length === 0}
                        className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                          newWorkout.name && newWorkout.exercises.length > 0
                            ? 'bg-primary text-black hover:bg-primary/90'
                            : 'bg-zinc-700 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Save Workout
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
