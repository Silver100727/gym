import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Plus, Trash2, TrendingUp, BarChart3, Dumbbell, Copy, RotateCcw } from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

const MUSCLE_GROUPS = [
  { id: 'chest', name: 'Chest', color: 'bg-red-500' },
  { id: 'back', name: 'Back', color: 'bg-blue-500' },
  { id: 'shoulders', name: 'Shoulders', color: 'bg-purple-500' },
  { id: 'biceps', name: 'Biceps', color: 'bg-orange-500' },
  { id: 'triceps', name: 'Triceps', color: 'bg-pink-500' },
  { id: 'legs', name: 'Legs', color: 'bg-green-500' },
  { id: 'core', name: 'Core', color: 'bg-yellow-500' },
];

const SAMPLE_EXERCISES = {
  chest: ['Bench Press', 'Incline Press', 'Dumbbell Fly', 'Push-Ups', 'Cable Crossover'],
  back: ['Deadlift', 'Barbell Row', 'Lat Pulldown', 'Pull-Ups', 'Seated Row'],
  shoulders: ['Overhead Press', 'Lateral Raise', 'Front Raise', 'Face Pull', 'Shrugs'],
  biceps: ['Barbell Curl', 'Dumbbell Curl', 'Hammer Curl', 'Preacher Curl', 'Cable Curl'],
  triceps: ['Tricep Dip', 'Skull Crusher', 'Rope Pushdown', 'Close Grip Bench', 'Overhead Extension'],
  legs: ['Squat', 'Leg Press', 'Romanian Deadlift', 'Leg Curl', 'Leg Extension', 'Calf Raise'],
  core: ['Plank', 'Crunches', 'Leg Raise', 'Cable Crunch', 'Ab Rollout'],
};

const VOLUME_LANDMARKS = [
  { min: 0, max: 5000, label: 'Low Volume', description: 'Good for deload or beginners', color: 'text-blue-400' },
  { min: 5000, max: 15000, label: 'Moderate Volume', description: 'Maintenance or moderate growth', color: 'text-green-400' },
  { min: 15000, max: 30000, label: 'High Volume', description: 'Optimal for muscle growth', color: 'text-yellow-400' },
  { min: 30000, max: 50000, label: 'Very High Volume', description: 'Advanced/intense training', color: 'text-orange-400' },
  { min: 50000, max: Infinity, label: 'Extreme Volume', description: 'Elite level training', color: 'text-red-400' },
];

export default function WorkoutVolumeCalculator() {
  const [exercises, setExercises] = useState([
    { id: 1, name: 'Bench Press', muscleGroup: 'chest', sets: 4, reps: 10, weight: 135 },
    { id: 2, name: 'Incline Press', muscleGroup: 'chest', sets: 3, reps: 12, weight: 95 },
  ]);
  const [unit, setUnit] = useState('lbs'); // 'lbs' or 'kg'
  const [compareMode, setCompareMode] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(null);

  const addExercise = () => {
    const newId = Math.max(...exercises.map(e => e.id), 0) + 1;
    setExercises([...exercises, {
      id: newId,
      name: '',
      muscleGroup: 'chest',
      sets: 3,
      reps: 10,
      weight: 0,
    }]);
  };

  const updateExercise = (id, field, value) => {
    setExercises(exercises.map(ex =>
      ex.id === id ? { ...ex, [field]: value } : ex
    ));
  };

  const removeExercise = (id) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  const duplicateExercise = (exercise) => {
    const newId = Math.max(...exercises.map(e => e.id), 0) + 1;
    setExercises([...exercises, { ...exercise, id: newId }]);
  };

  const clearAll = () => {
    setExercises([]);
    setPreviousVolume(null);
  };

  const calculations = useMemo(() => {
    const exerciseVolumes = exercises.map(ex => ({
      ...ex,
      volume: ex.sets * ex.reps * ex.weight,
    }));

    const totalVolume = exerciseVolumes.reduce((sum, ex) => sum + ex.volume, 0);
    const totalSets = exercises.reduce((sum, ex) => sum + ex.sets, 0);
    const totalReps = exercises.reduce((sum, ex) => sum + (ex.sets * ex.reps), 0);

    // Volume by muscle group
    const volumeByMuscle = MUSCLE_GROUPS.map(muscle => {
      const muscleExercises = exerciseVolumes.filter(ex => ex.muscleGroup === muscle.id);
      const volume = muscleExercises.reduce((sum, ex) => sum + ex.volume, 0);
      const sets = muscleExercises.reduce((sum, ex) => sum + ex.sets, 0);
      return { ...muscle, volume, sets, exerciseCount: muscleExercises.length };
    }).filter(m => m.volume > 0);

    const volumeLandmark = VOLUME_LANDMARKS.find(
      v => totalVolume >= v.min && totalVolume < v.max
    ) || VOLUME_LANDMARKS[0];

    // Convert if needed
    const displayVolume = unit === 'kg' ? totalVolume * 0.453592 : totalVolume;
    const volumeChange = previousVolume ? ((totalVolume - previousVolume) / previousVolume) * 100 : null;

    return {
      exerciseVolumes,
      totalVolume,
      displayVolume,
      totalSets,
      totalReps,
      volumeByMuscle,
      volumeLandmark,
      volumeChange,
      avgVolumePerSet: totalSets > 0 ? Math.round(totalVolume / totalSets) : 0,
    };
  }, [exercises, unit, previousVolume]);

  const savePreviousVolume = () => {
    setPreviousVolume(calculations.totalVolume);
    setCompareMode(true);
  };

  const maxMuscleVolume = Math.max(...calculations.volumeByMuscle.map(m => m.volume), 1);

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
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
            <Calculator className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium">Progressive Overload</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Workout <span className="text-primary">Volume</span> Calculator
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Track your total training volume to ensure progressive overload
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Exercise List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold">Exercises</h3>
                <div className="flex items-center gap-2">
                  <div className="bg-zinc-900 rounded-lg p-1 flex">
                    <button
                      onClick={() => setUnit('lbs')}
                      className={`px-3 py-1 rounded text-sm transition-all ${
                        unit === 'lbs' ? 'bg-primary text-black' : 'text-gray-400'
                      }`}
                    >
                      lbs
                    </button>
                    <button
                      onClick={() => setUnit('kg')}
                      className={`px-3 py-1 rounded text-sm transition-all ${
                        unit === 'kg' ? 'bg-primary text-black' : 'text-gray-400'
                      }`}
                    >
                      kg
                    </button>
                  </div>
                  <button
                    onClick={clearAll}
                    className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                    title="Clear all"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                <AnimatePresence>
                  {exercises.map((exercise, index) => (
                    <motion.div
                      key={exercise.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-xl border border-zinc-800 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                          {/* Exercise Name */}
                          <div className="col-span-2 md:col-span-1">
                            <label className="text-gray-500 text-xs mb-1 block">Exercise</label>
                            <input
                              type="text"
                              value={exercise.name}
                              onChange={(e) => updateExercise(exercise.id, 'name', e.target.value)}
                              placeholder="Exercise name"
                              list={`exercises-${exercise.id}`}
                              className="w-full bg-black/50 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary/50"
                            />
                            <datalist id={`exercises-${exercise.id}`}>
                              {SAMPLE_EXERCISES[exercise.muscleGroup]?.map(ex => (
                                <option key={ex} value={ex} />
                              ))}
                            </datalist>
                          </div>

                          {/* Muscle Group */}
                          <div>
                            <label className="text-gray-500 text-xs mb-1 block">Muscle</label>
                            <select
                              value={exercise.muscleGroup}
                              onChange={(e) => updateExercise(exercise.id, 'muscleGroup', e.target.value)}
                              className="w-full bg-black/50 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary/50"
                            >
                              {MUSCLE_GROUPS.map(muscle => (
                                <option key={muscle.id} value={muscle.id}>{muscle.name}</option>
                              ))}
                            </select>
                          </div>

                          {/* Sets, Reps, Weight in a row */}
                          <div className="col-span-2 grid grid-cols-3 gap-2">
                            <div>
                              <label className="text-gray-500 text-xs mb-1 block">Sets</label>
                              <input
                                type="number"
                                min="1"
                                max="20"
                                value={exercise.sets}
                                onChange={(e) => updateExercise(exercise.id, 'sets', parseInt(e.target.value) || 0)}
                                className="w-full bg-black/50 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm text-center focus:outline-none focus:border-primary/50"
                              />
                            </div>
                            <div>
                              <label className="text-gray-500 text-xs mb-1 block">Reps</label>
                              <input
                                type="number"
                                min="1"
                                max="100"
                                value={exercise.reps}
                                onChange={(e) => updateExercise(exercise.id, 'reps', parseInt(e.target.value) || 0)}
                                className="w-full bg-black/50 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm text-center focus:outline-none focus:border-primary/50"
                              />
                            </div>
                            <div>
                              <label className="text-gray-500 text-xs mb-1 block">{unit}</label>
                              <input
                                type="number"
                                min="0"
                                step="5"
                                value={exercise.weight}
                                onChange={(e) => updateExercise(exercise.id, 'weight', parseFloat(e.target.value) || 0)}
                                className="w-full bg-black/50 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm text-center focus:outline-none focus:border-primary/50"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Actions & Volume */}
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex gap-1">
                            <button
                              onClick={() => duplicateExercise(exercise)}
                              className="p-1.5 text-gray-600 hover:text-primary transition-colors"
                              title="Duplicate"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeExercise(exercise.id)}
                              className="p-1.5 text-gray-600 hover:text-red-400 transition-colors"
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-500 text-xs">Volume</p>
                            <p className="text-primary font-bold">
                              {(exercise.sets * exercise.reps * exercise.weight).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Add Exercise Button */}
              <motion.button
                onClick={addExercise}
                className="w-full py-3 border-2 border-dashed border-zinc-700 hover:border-primary/50 rounded-xl text-gray-500 hover:text-primary transition-all flex items-center justify-center gap-2"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Plus className="w-5 h-5" />
                Add Exercise
              </motion.button>
            </div>

            {/* Results Panel */}
            <div className="space-y-4">
              {/* Total Volume */}
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl border border-primary/30 p-6">
                <p className="text-primary text-sm mb-1">Total Volume</p>
                <p className="text-4xl font-bold text-white mb-1">
                  {Math.round(calculations.displayVolume).toLocaleString()}
                </p>
                <p className="text-gray-400 text-sm">{unit}</p>

                {calculations.volumeChange !== null && (
                  <div className={`mt-3 flex items-center gap-2 ${
                    calculations.volumeChange >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    <TrendingUp className={`w-4 h-4 ${calculations.volumeChange < 0 ? 'rotate-180' : ''}`} />
                    <span className="font-medium">
                      {calculations.volumeChange >= 0 ? '+' : ''}{calculations.volumeChange.toFixed(1)}%
                    </span>
                    <span className="text-gray-500 text-sm">vs previous</span>
                  </div>
                )}
              </div>

              {/* Volume Landmark */}
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-xl border border-zinc-800 p-4">
                <p className={`font-bold ${calculations.volumeLandmark.color}`}>
                  {calculations.volumeLandmark.label}
                </p>
                <p className="text-gray-500 text-sm">{calculations.volumeLandmark.description}</p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-zinc-900 rounded-xl p-3 text-center border border-zinc-800">
                  <p className="text-xl font-bold text-white">{calculations.totalSets}</p>
                  <p className="text-gray-500 text-xs">Sets</p>
                </div>
                <div className="bg-zinc-900 rounded-xl p-3 text-center border border-zinc-800">
                  <p className="text-xl font-bold text-white">{calculations.totalReps}</p>
                  <p className="text-gray-500 text-xs">Reps</p>
                </div>
                <div className="bg-zinc-900 rounded-xl p-3 text-center border border-zinc-800">
                  <p className="text-xl font-bold text-white">{exercises.length}</p>
                  <p className="text-gray-500 text-xs">Exercises</p>
                </div>
              </div>

              {/* Volume by Muscle */}
              {calculations.volumeByMuscle.length > 0 && (
                <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-xl border border-zinc-800 p-4">
                  <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    Volume by Muscle
                  </h4>
                  <div className="space-y-3">
                    {calculations.volumeByMuscle.map(muscle => (
                      <div key={muscle.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">{muscle.name}</span>
                          <span className="text-white font-medium">
                            {muscle.volume.toLocaleString()} ({muscle.sets} sets)
                          </span>
                        </div>
                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${muscle.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${(muscle.volume / maxMuscleVolume) * 100}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Compare Button */}
              <button
                onClick={savePreviousVolume}
                className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Save for Comparison
              </button>

              {/* Formula */}
              <div className="bg-black/30 rounded-xl p-4 border border-zinc-800">
                <p className="text-gray-400 text-xs text-center">
                  <span className="text-primary">Volume</span> = Sets × Reps × Weight
                </p>
                <p className="text-gray-600 text-xs text-center mt-1">
                  Avg {calculations.avgVolumePerSet.toLocaleString()} {unit}/set
                </p>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-xl">
            <p className="text-sm text-gray-400">
              <span className="text-primary font-medium">Progressive Overload Tip: </span>
              Aim to increase total volume by 2-5% each week through more weight, reps, or sets.
              Track your volume consistently to ensure continuous progress.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
