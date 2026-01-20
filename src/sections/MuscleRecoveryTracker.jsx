import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Clock, CheckCircle, AlertTriangle, Flame, RotateCcw, Plus, Trash2, Calendar } from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

const MUSCLE_GROUPS = [
  { id: 'chest', name: 'Chest', recoveryHours: 48, icon: '🫁' },
  { id: 'back', name: 'Back', recoveryHours: 48, icon: '🔙' },
  { id: 'shoulders', name: 'Shoulders', recoveryHours: 48, icon: '💪' },
  { id: 'biceps', name: 'Biceps', recoveryHours: 36, icon: '💪' },
  { id: 'triceps', name: 'Triceps', recoveryHours: 36, icon: '💪' },
  { id: 'quadriceps', name: 'Quadriceps', recoveryHours: 72, icon: '🦵' },
  { id: 'hamstrings', name: 'Hamstrings', recoveryHours: 72, icon: '🦵' },
  { id: 'glutes', name: 'Glutes', recoveryHours: 72, icon: '🍑' },
  { id: 'calves', name: 'Calves', recoveryHours: 36, icon: '🦶' },
  { id: 'abs', name: 'Abs / Core', recoveryHours: 24, icon: '🎯' },
  { id: 'forearms', name: 'Forearms', recoveryHours: 24, icon: '✊' },
  { id: 'traps', name: 'Traps', recoveryHours: 48, icon: '🔺' },
];

const INTENSITY_LEVELS = [
  { id: 'light', name: 'Light', multiplier: 0.5, color: 'bg-green-500' },
  { id: 'moderate', name: 'Moderate', multiplier: 0.75, color: 'bg-yellow-500' },
  { id: 'intense', name: 'Intense', multiplier: 1, color: 'bg-orange-500' },
  { id: 'extreme', name: 'Extreme', multiplier: 1.25, color: 'bg-red-500' },
];

const getRecoveryStatus = (hoursRemaining, totalHours) => {
  const percentage = ((totalHours - hoursRemaining) / totalHours) * 100;

  if (percentage >= 100) return { status: 'recovered', color: 'text-green-400', bg: 'bg-green-500', label: 'Ready' };
  if (percentage >= 75) return { status: 'almost', color: 'text-yellow-400', bg: 'bg-yellow-500', label: 'Almost Ready' };
  if (percentage >= 50) return { status: 'recovering', color: 'text-orange-400', bg: 'bg-orange-500', label: 'Recovering' };
  return { status: 'sore', color: 'text-red-400', bg: 'bg-red-500', label: 'Needs Rest' };
};

const formatTimeRemaining = (hours) => {
  if (hours <= 0) return 'Ready!';
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  if (hours < 24) return `${Math.round(hours)}h`;
  const days = Math.floor(hours / 24);
  const remainingHours = Math.round(hours % 24);
  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
};

export default function MuscleRecoveryTracker() {
  const [workoutLog, setWorkoutLog] = useState([]);
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [selectedIntensity, setSelectedIntensity] = useState('moderate');

  const muscleRecoveryStatus = useMemo(() => {
    const now = Date.now();

    return MUSCLE_GROUPS.map(muscle => {
      // Find the most recent workout for this muscle
      const recentWorkout = workoutLog
        .filter(log => log.muscles.includes(muscle.id))
        .sort((a, b) => b.timestamp - a.timestamp)[0];

      if (!recentWorkout) {
        return {
          ...muscle,
          lastWorked: null,
          hoursRemaining: 0,
          totalRecoveryHours: muscle.recoveryHours,
          recoveryPercentage: 100,
          status: getRecoveryStatus(0, muscle.recoveryHours),
        };
      }

      const intensity = INTENSITY_LEVELS.find(i => i.id === recentWorkout.intensity);
      const adjustedRecoveryHours = muscle.recoveryHours * (intensity?.multiplier || 1);
      const hoursSinceWorkout = (now - recentWorkout.timestamp) / (1000 * 60 * 60);
      const hoursRemaining = Math.max(0, adjustedRecoveryHours - hoursSinceWorkout);
      const recoveryPercentage = Math.min(100, (hoursSinceWorkout / adjustedRecoveryHours) * 100);

      return {
        ...muscle,
        lastWorked: recentWorkout.timestamp,
        hoursRemaining,
        totalRecoveryHours: adjustedRecoveryHours,
        recoveryPercentage,
        status: getRecoveryStatus(hoursRemaining, adjustedRecoveryHours),
        intensity: recentWorkout.intensity,
      };
    });
  }, [workoutLog]);

  const readyMuscles = muscleRecoveryStatus.filter(m => m.status.status === 'recovered').length;
  const recoveringMuscles = muscleRecoveryStatus.filter(m => m.status.status !== 'recovered').length;

  const toggleMuscle = (muscleId) => {
    setSelectedMuscles(prev =>
      prev.includes(muscleId)
        ? prev.filter(id => id !== muscleId)
        : [...prev, muscleId]
    );
  };

  const logWorkout = () => {
    if (selectedMuscles.length === 0) return;

    const newLog = {
      id: Date.now(),
      timestamp: Date.now(),
      muscles: selectedMuscles,
      intensity: selectedIntensity,
    };

    setWorkoutLog(prev => [...prev, newLog]);
    setSelectedMuscles([]);
    setShowLogModal(false);
  };

  const clearLog = (logId) => {
    setWorkoutLog(prev => prev.filter(log => log.id !== logId));
  };

  const clearAllLogs = () => {
    setWorkoutLog([]);
  };

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
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
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium">Recovery Tracking</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Muscle <span className="text-primary">Recovery</span> Tracker
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Track your muscle recovery to optimize training frequency and prevent overtraining
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="max-w-5xl mx-auto">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-green-500/10 to-zinc-900/50 rounded-xl p-4 border border-green-500/20">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{readyMuscles}</p>
                  <p className="text-green-400 text-sm">Ready to Train</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-500/10 to-zinc-900/50 rounded-xl p-4 border border-orange-500/20">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-orange-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{recoveringMuscles}</p>
                  <p className="text-orange-400 text-sm">Recovering</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-zinc-900/50 rounded-xl p-4 border border-primary/20">
              <div className="flex items-center gap-3">
                <Flame className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-white">{workoutLog.length}</p>
                  <p className="text-primary text-sm">Workouts Logged</p>
                </div>
              </div>
            </div>
            <motion.button
              onClick={() => setShowLogModal(true)}
              className="bg-gradient-to-br from-primary to-orange-500 rounded-xl p-4 text-black font-bold flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-6 h-6" />
              Log Workout
            </motion.button>
          </div>

          {/* Muscle Grid */}
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl border border-zinc-800 p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Recovery Status</h3>
              {workoutLog.length > 0 && (
                <button
                  onClick={clearAllLogs}
                  className="text-gray-500 hover:text-red-400 text-sm flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset All
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {muscleRecoveryStatus.map((muscle, index) => (
                <motion.div
                  key={muscle.id}
                  className="bg-black/30 rounded-xl p-4 border border-zinc-800 hover:border-zinc-700 transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{muscle.icon}</span>
                      <div>
                        <p className="text-white font-medium text-sm">{muscle.name}</p>
                        <p className={`text-xs ${muscle.status.color}`}>{muscle.status.label}</p>
                      </div>
                    </div>
                  </div>

                  {/* Recovery Bar */}
                  <div className="mb-2">
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${muscle.status.bg}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${muscle.recoveryPercentage}%` }}
                        transition={{ duration: 0.8, delay: index * 0.05 }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      {muscle.lastWorked
                        ? formatTimeRemaining(muscle.hoursRemaining)
                        : 'Not logged'}
                    </span>
                    <span className="text-gray-600">
                      {Math.round(muscle.recoveryPercentage)}%
                    </span>
                  </div>

                  {muscle.intensity && (
                    <div className="mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        INTENSITY_LEVELS.find(i => i.id === muscle.intensity)?.color
                      } text-black`}>
                        {INTENSITY_LEVELS.find(i => i.id === muscle.intensity)?.name}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Recent Workouts */}
            {workoutLog.length > 0 && (
              <div className="mt-8 pt-6 border-t border-zinc-800">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Recent Workouts
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {workoutLog
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .slice(0, 5)
                    .map(log => {
                      const muscleNames = log.muscles.map(id =>
                        MUSCLE_GROUPS.find(m => m.id === id)?.name
                      ).filter(Boolean);
                      const intensity = INTENSITY_LEVELS.find(i => i.id === log.intensity);
                      const timeAgo = (Date.now() - log.timestamp) / (1000 * 60 * 60);

                      return (
                        <div
                          key={log.id}
                          className="flex items-center justify-between bg-black/20 rounded-lg p-3"
                        >
                          <div className="flex-1">
                            <p className="text-white text-sm">
                              {muscleNames.join(', ')}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs px-2 py-0.5 rounded ${intensity?.color} text-black`}>
                                {intensity?.name}
                              </span>
                              <span className="text-gray-500 text-xs">
                                {timeAgo < 1 ? 'Just now' : formatTimeRemaining(timeAgo) + ' ago'}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => clearLog(log.id)}
                            className="p-2 text-gray-600 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Recovery Tips */}
            <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-xl">
              <p className="text-sm text-gray-400">
                <span className="text-primary font-medium">Recovery Tip: </span>
                {readyMuscles === MUSCLE_GROUPS.length
                  ? 'All muscles are fully recovered! Great time for a full-body workout.'
                  : recoveringMuscles > MUSCLE_GROUPS.length / 2
                    ? 'Many muscles are still recovering. Consider an active recovery day or target ready muscle groups.'
                    : 'Good recovery balance. Focus on the green muscle groups for optimal training.'}
              </p>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-primary/30 rounded-tl-2xl" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-primary/30 rounded-br-2xl" />
          </div>
        </motion.div>
      </motion.div>

      {/* Log Workout Modal */}
      <AnimatePresence>
        {showLogModal && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLogModal(false)}
          >
            <motion.div
              className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-6">Log Workout</h3>

              {/* Intensity Selection */}
              <div className="mb-6">
                <p className="text-gray-400 text-sm mb-3">Workout Intensity</p>
                <div className="grid grid-cols-4 gap-2">
                  {INTENSITY_LEVELS.map(level => (
                    <button
                      key={level.id}
                      onClick={() => setSelectedIntensity(level.id)}
                      className={`p-3 rounded-xl border transition-all ${
                        selectedIntensity === level.id
                          ? `${level.color} text-black border-transparent`
                          : 'bg-black/30 text-gray-400 border-zinc-700 hover:border-zinc-600'
                      }`}
                    >
                      <p className="font-medium text-sm">{level.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Muscle Selection */}
              <div className="mb-6">
                <p className="text-gray-400 text-sm mb-3">
                  Muscles Worked ({selectedMuscles.length} selected)
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {MUSCLE_GROUPS.map(muscle => (
                    <button
                      key={muscle.id}
                      onClick={() => toggleMuscle(muscle.id)}
                      className={`p-3 rounded-xl border transition-all flex items-center gap-2 ${
                        selectedMuscles.includes(muscle.id)
                          ? 'bg-primary/20 border-primary/50 text-primary'
                          : 'bg-black/30 border-zinc-700 text-gray-400 hover:border-zinc-600'
                      }`}
                    >
                      <span>{muscle.icon}</span>
                      <span className="text-sm">{muscle.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Select */}
              <div className="mb-6">
                <p className="text-gray-400 text-sm mb-3">Quick Select</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Push', muscles: ['chest', 'shoulders', 'triceps'] },
                    { label: 'Pull', muscles: ['back', 'biceps', 'forearms'] },
                    { label: 'Legs', muscles: ['quadriceps', 'hamstrings', 'glutes', 'calves'] },
                    { label: 'Upper', muscles: ['chest', 'back', 'shoulders', 'biceps', 'triceps'] },
                    { label: 'Core', muscles: ['abs'] },
                  ].map(preset => (
                    <button
                      key={preset.label}
                      onClick={() => setSelectedMuscles(preset.muscles)}
                      className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-gray-400 text-sm rounded-lg transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogModal(false)}
                  className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={logWorkout}
                  disabled={selectedMuscles.length === 0}
                  className={`flex-1 py-3 font-medium rounded-xl transition-all ${
                    selectedMuscles.length > 0
                      ? 'bg-primary hover:bg-primary/90 text-black'
                      : 'bg-zinc-800 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  Log Workout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
