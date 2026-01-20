import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Gauge, TrendingUp, Info, Target, Zap, AlertTriangle } from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

const RPE_SCALE = [
  { rpe: 10, rir: 0, percent: 100, label: 'Maximum Effort', description: 'Could not do another rep', color: 'bg-red-600', textColor: 'text-red-400' },
  { rpe: 9.5, rir: 0.5, percent: 98, label: 'Near Maximum', description: 'Maybe could do 1 more, uncertain', color: 'bg-red-500', textColor: 'text-red-400' },
  { rpe: 9, rir: 1, percent: 96, label: 'Very Hard', description: 'Definitely 1 rep left', color: 'bg-orange-500', textColor: 'text-orange-400' },
  { rpe: 8.5, rir: 1.5, percent: 94, label: 'Hard', description: '1-2 reps left', color: 'bg-orange-400', textColor: 'text-orange-400' },
  { rpe: 8, rir: 2, percent: 92, label: 'Challenging', description: '2 reps left', color: 'bg-yellow-500', textColor: 'text-yellow-400' },
  { rpe: 7.5, rir: 2.5, percent: 89, label: 'Moderate-Hard', description: '2-3 reps left', color: 'bg-yellow-400', textColor: 'text-yellow-400' },
  { rpe: 7, rir: 3, percent: 86, label: 'Moderate', description: '3 reps left', color: 'bg-green-500', textColor: 'text-green-400' },
  { rpe: 6.5, rir: 3.5, percent: 83, label: 'Moderate-Light', description: '3-4 reps left', color: 'bg-green-400', textColor: 'text-green-400' },
  { rpe: 6, rir: 4, percent: 80, label: 'Light', description: '4+ reps left, speed work', color: 'bg-blue-500', textColor: 'text-blue-400' },
  { rpe: 5, rir: 5, percent: 75, label: 'Very Light', description: 'Warm-up weight', color: 'bg-blue-400', textColor: 'text-blue-400' },
];

const TRAINING_GOALS = [
  { id: 'strength', name: 'Strength', rpeRange: [8, 9.5], description: 'Heavy singles to triples', reps: '1-5 reps' },
  { id: 'hypertrophy', name: 'Hypertrophy', rpeRange: [7, 9], description: 'Moderate to high effort', reps: '6-12 reps' },
  { id: 'endurance', name: 'Endurance', rpeRange: [6, 8], description: 'Sustainable effort', reps: '12-20 reps' },
  { id: 'technique', name: 'Technique', rpeRange: [5, 7], description: 'Focus on form', reps: '5-10 reps' },
  { id: 'deload', name: 'Deload', rpeRange: [5, 6], description: 'Recovery week', reps: 'Varies' },
];

export default function RPECalculator() {
  const [knownWeight, setKnownWeight] = useState(200);
  const [knownRPE, setKnownRPE] = useState(8);
  const [targetRPE, setTargetRPE] = useState(9);
  const [unit, setUnit] = useState('lbs');
  const [selectedGoal, setSelectedGoal] = useState('hypertrophy');

  const calculations = useMemo(() => {
    const knownRPEData = RPE_SCALE.find(r => r.rpe === knownRPE);
    const targetRPEData = RPE_SCALE.find(r => r.rpe === targetRPE);

    if (!knownRPEData || !targetRPEData) return null;

    // Calculate estimated 1RM from known weight and RPE
    const estimated1RM = knownWeight / (knownRPEData.percent / 100);

    // Calculate target weight for target RPE
    const targetWeight = estimated1RM * (targetRPEData.percent / 100);

    // Calculate weights for all RPE levels
    const allWeights = RPE_SCALE.map(rpe => ({
      ...rpe,
      weight: Math.round(estimated1RM * (rpe.percent / 100)),
    }));

    return {
      estimated1RM: Math.round(estimated1RM),
      targetWeight: Math.round(targetWeight),
      weightChange: Math.round(targetWeight - knownWeight),
      percentChange: ((targetWeight - knownWeight) / knownWeight * 100).toFixed(1),
      allWeights,
      knownRPEData,
      targetRPEData,
    };
  }, [knownWeight, knownRPE, targetRPE]);

  const currentGoal = TRAINING_GOALS.find(g => g.id === selectedGoal);

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
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
            <Gauge className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium">Auto-Regulation</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-primary">RPE</span> Calculator
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Rate of Perceived Exertion - auto-regulate your training intensity
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Calculator */}
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl border border-zinc-800 p-6">
              <h3 className="text-white font-semibold mb-6">Weight Calculator</h3>

              {/* Unit Toggle */}
              <div className="flex justify-end mb-4">
                <div className="bg-black/50 rounded-lg p-1 flex">
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
              </div>

              {/* Known Weight & RPE */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Weight Lifted ({unit})</label>
                  <input
                    type="number"
                    value={knownWeight}
                    onChange={(e) => setKnownWeight(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-black/50 border border-zinc-700 rounded-xl px-4 py-3 text-white text-xl font-mono focus:outline-none focus:border-primary/50"
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    At RPE: <span className="text-primary font-bold">{knownRPE}</span>
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="10"
                    step="0.5"
                    value={knownRPE}
                    onChange={(e) => setKnownRPE(parseFloat(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>RPE 5</span>
                    <span>RPE 10</span>
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    Target RPE: <span className="text-primary font-bold">{targetRPE}</span>
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="10"
                    step="0.5"
                    value={targetRPE}
                    onChange={(e) => setTargetRPE(parseFloat(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>RPE 5</span>
                    <span>RPE 10</span>
                  </div>
                </div>
              </div>

              {/* Results */}
              {calculations && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl p-5 border border-primary/30">
                    <p className="text-primary text-sm mb-1">Target Weight @ RPE {targetRPE}</p>
                    <p className="text-4xl font-bold text-white">
                      {calculations.targetWeight} <span className="text-lg text-gray-400">{unit}</span>
                    </p>
                    <p className={`text-sm mt-2 ${
                      calculations.weightChange >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {calculations.weightChange >= 0 ? '+' : ''}{calculations.weightChange} {unit}
                      ({calculations.weightChange >= 0 ? '+' : ''}{calculations.percentChange}%)
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-black/30 rounded-xl p-4 border border-zinc-800">
                      <p className="text-gray-500 text-xs mb-1">Estimated 1RM</p>
                      <p className="text-xl font-bold text-white">{calculations.estimated1RM} {unit}</p>
                    </div>
                    <div className="bg-black/30 rounded-xl p-4 border border-zinc-800">
                      <p className="text-gray-500 text-xs mb-1">RIR at Target</p>
                      <p className="text-xl font-bold text-white">{calculations.targetRPEData.rir} reps</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RPE Scale Reference */}
            <div className="space-y-4">
              {/* Training Goals */}
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-xl border border-zinc-800 p-5">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Training Goal
                </h4>
                <div className="grid grid-cols-5 gap-2">
                  {TRAINING_GOALS.map(goal => (
                    <button
                      key={goal.id}
                      onClick={() => setSelectedGoal(goal.id)}
                      className={`p-2 rounded-lg text-center transition-all ${
                        selectedGoal === goal.id
                          ? 'bg-primary/20 border border-primary/50'
                          : 'bg-black/30 border border-zinc-800 hover:border-zinc-600'
                      }`}
                    >
                      <p className={`text-xs font-medium ${
                        selectedGoal === goal.id ? 'text-primary' : 'text-white'
                      }`}>
                        {goal.name}
                      </p>
                    </button>
                  ))}
                </div>
                {currentGoal && (
                  <div className="mt-3 p-3 bg-black/30 rounded-lg">
                    <p className="text-white text-sm">
                      <span className="text-primary">RPE {currentGoal.rpeRange[0]}-{currentGoal.rpeRange[1]}</span>
                      {' '}• {currentGoal.reps}
                    </p>
                    <p className="text-gray-500 text-xs">{currentGoal.description}</p>
                  </div>
                )}
              </div>

              {/* RPE Scale */}
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-xl border border-zinc-800 p-5">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-primary" />
                  RPE Scale
                </h4>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {RPE_SCALE.map((level) => (
                    <motion.div
                      key={level.rpe}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                        (targetRPE === level.rpe || knownRPE === level.rpe)
                          ? 'bg-primary/10 border border-primary/30'
                          : 'bg-black/20'
                      }`}
                      whileHover={{ x: 4 }}
                    >
                      <div className={`w-10 h-10 ${level.color} rounded-lg flex items-center justify-center font-bold text-white text-sm`}>
                        {level.rpe}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className={`font-medium text-sm ${level.textColor}`}>{level.label}</p>
                          <span className="text-gray-600 text-xs">RIR {level.rir}</span>
                        </div>
                        <p className="text-gray-500 text-xs">{level.description}</p>
                      </div>
                      {calculations && (
                        <div className="text-right">
                          <p className="text-white font-mono text-sm">
                            {calculations.allWeights.find(w => w.rpe === level.rpe)?.weight}
                          </p>
                          <p className="text-gray-600 text-xs">{level.percent}%</p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-primary font-medium text-sm">What is RPE?</p>
                    <p className="text-gray-400 text-xs mt-1">
                      RPE (Rate of Perceived Exertion) measures how hard a set feels on a 1-10 scale.
                      RIR (Reps in Reserve) indicates how many more reps you could have done.
                      Use these to auto-regulate training based on daily readiness.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Intensity Bar */}
          <motion.div
            variants={fadeUp}
            className="mt-6 bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-xl border border-zinc-800 p-5"
          >
            <h4 className="text-white font-semibold mb-4">Intensity Spectrum</h4>
            <div className="relative h-8 rounded-full overflow-hidden bg-zinc-800">
              <div className="absolute inset-0 flex">
                {RPE_SCALE.slice().reverse().map((level, i) => (
                  <div
                    key={level.rpe}
                    className={`flex-1 ${level.color}`}
                    style={{ opacity: 0.8 + (i * 0.02) }}
                  />
                ))}
              </div>
              {/* Target Marker */}
              <motion.div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
                animate={{
                  left: `${((targetRPE - 5) / 5) * 100}%`,
                }}
                transition={{ type: 'spring', stiffness: 300 }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Light (RPE 5)</span>
              <span>Moderate (RPE 7)</span>
              <span>Maximum (RPE 10)</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
