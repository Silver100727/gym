import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ruler, Plus, Trash2, TrendingUp, TrendingDown, Minus, Calendar, BarChart3 } from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

const MEASUREMENTS = [
  { id: 'neck', name: 'Neck', icon: '🔵' },
  { id: 'shoulders', name: 'Shoulders', icon: '💪' },
  { id: 'chest', name: 'Chest', icon: '🫁' },
  { id: 'bicepL', name: 'Left Bicep', icon: '💪' },
  { id: 'bicepR', name: 'Right Bicep', icon: '💪' },
  { id: 'forearmL', name: 'Left Forearm', icon: '✊' },
  { id: 'forearmR', name: 'Right Forearm', icon: '✊' },
  { id: 'waist', name: 'Waist', icon: '⭕' },
  { id: 'hips', name: 'Hips', icon: '🔴' },
  { id: 'thighL', name: 'Left Thigh', icon: '🦵' },
  { id: 'thighR', name: 'Right Thigh', icon: '🦵' },
  { id: 'calfL', name: 'Left Calf', icon: '🦶' },
  { id: 'calfR', name: 'Right Calf', icon: '🦶' },
];

const SAMPLE_HISTORY = [
  { date: '2024-01-01', measurements: { chest: 100, waist: 85, bicepL: 35, bicepR: 35.5, thighL: 58, thighR: 58.5 } },
  { date: '2024-01-15', measurements: { chest: 101, waist: 84, bicepL: 35.5, bicepR: 36, thighL: 58.5, thighR: 59 } },
  { date: '2024-02-01', measurements: { chest: 102, waist: 83, bicepL: 36, bicepR: 36.5, thighL: 59, thighR: 59.5 } },
];

export default function BodyMeasurementsTracker() {
  const [measurements, setMeasurements] = useState({});
  const [history, setHistory] = useState(SAMPLE_HISTORY);
  const [unit, setUnit] = useState('cm');
  const [showHistory, setShowHistory] = useState(false);

  const handleMeasurementChange = (id, value) => {
    setMeasurements(prev => ({
      ...prev,
      [id]: value === '' ? '' : Number(value),
    }));
  };

  const saveMeasurements = () => {
    const filledMeasurements = Object.entries(measurements)
      .filter(([_, value]) => value !== '' && value !== undefined)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    if (Object.keys(filledMeasurements).length === 0) return;

    const newEntry = {
      date: new Date().toISOString().split('T')[0],
      measurements: filledMeasurements,
    };

    setHistory(prev => [...prev, newEntry]);
    setMeasurements({});
  };

  const getLatestMeasurement = (id) => {
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].measurements[id] !== undefined) {
        return history[i].measurements[id];
      }
    }
    return null;
  };

  const getTrend = (id) => {
    const values = history
      .filter(h => h.measurements[id] !== undefined)
      .map(h => h.measurements[id]);

    if (values.length < 2) return null;

    const diff = values[values.length - 1] - values[values.length - 2];
    if (diff > 0) return { direction: 'up', value: diff };
    if (diff < 0) return { direction: 'down', value: Math.abs(diff) };
    return { direction: 'same', value: 0 };
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
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
            <Ruler className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium">Body Tracking</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Body <span className="text-primary">Measurements</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Track your body measurements over time to see your progress
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Controls */}
          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex bg-zinc-800 rounded-lg p-1">
              <button
                onClick={() => setUnit('cm')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  unit === 'cm' ? 'bg-primary text-black' : 'text-gray-400'
                }`}
              >
                Centimeters
              </button>
              <button
                onClick={() => setUnit('in')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  unit === 'in' ? 'bg-primary text-black' : 'text-gray-400'
                }`}
              >
                Inches
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  showHistory ? 'bg-primary text-black' : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                History
              </button>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {showHistory ? (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {/* History Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Measurement History
                  </h3>
                  {history.length > 0 && (
                    <button
                      onClick={clearHistory}
                      className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear All
                    </button>
                  )}
                </div>

                {history.length === 0 ? (
                  <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl p-8 border border-zinc-800 text-center">
                    <p className="text-gray-400">No measurement history yet. Start tracking today!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {history.slice().reverse().map((entry, idx) => (
                      <motion.div
                        key={entry.date + idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl p-4 border border-zinc-800"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="text-white font-medium">{entry.date}</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {Object.entries(entry.measurements).map(([key, value]) => {
                            const measurement = MEASUREMENTS.find(m => m.id === key);
                            return (
                              <div key={key} className="bg-zinc-800/50 rounded-lg p-2">
                                <p className="text-gray-500 text-xs">{measurement?.name || key}</p>
                                <p className="text-white font-semibold">{value} {unit}</p>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Measurement Input Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {MEASUREMENTS.map((m, idx) => {
                    const trend = getTrend(m.id);
                    const latest = getLatestMeasurement(m.id);

                    return (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-xl p-4 border border-zinc-800"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{m.icon}</span>
                            <span className="text-white font-medium text-sm">{m.name}</span>
                          </div>
                          {trend && (
                            <div className={`flex items-center gap-1 text-xs ${
                              trend.direction === 'up' ? 'text-green-400' :
                              trend.direction === 'down' ? 'text-red-400' : 'text-gray-400'
                            }`}>
                              {trend.direction === 'up' && <TrendingUp className="w-3 h-3" />}
                              {trend.direction === 'down' && <TrendingDown className="w-3 h-3" />}
                              {trend.direction === 'same' && <Minus className="w-3 h-3" />}
                              {trend.value > 0 && `${trend.value.toFixed(1)}`}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            step="0.1"
                            placeholder={latest ? `Last: ${latest}` : '0'}
                            value={measurements[m.id] || ''}
                            onChange={(e) => handleMeasurementChange(m.id, e.target.value)}
                            className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-center focus:outline-none focus:border-primary"
                          />
                          <span className="text-gray-500 text-sm w-8">{unit}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Save Button */}
                <motion.button
                  onClick={saveMeasurements}
                  disabled={Object.values(measurements).every(v => v === '' || v === undefined)}
                  className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-lg transition-all ${
                    Object.values(measurements).some(v => v !== '' && v !== undefined)
                      ? 'bg-primary text-black hover:bg-primary/90'
                      : 'bg-zinc-800 text-gray-500 cursor-not-allowed'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="w-5 h-5" />
                  Save Today's Measurements
                </motion.button>

                {/* Quick Stats */}
                {history.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['chest', 'waist', 'bicepR', 'thighR'].map(key => {
                      const measurement = MEASUREMENTS.find(m => m.id === key);
                      const latest = getLatestMeasurement(key);
                      const trend = getTrend(key);

                      if (!latest) return null;

                      return (
                        <div key={key} className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-xl p-4 border border-zinc-800 text-center">
                          <p className="text-gray-400 text-sm">{measurement?.name}</p>
                          <p className="text-2xl font-bold text-white">{latest} {unit}</p>
                          {trend && trend.value > 0 && (
                            <p className={`text-xs ${trend.direction === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                              {trend.direction === 'up' ? '+' : '-'}{trend.value.toFixed(1)} {unit}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tips */}
          <motion.div
            variants={fadeUp}
            className="mt-8 bg-primary/5 border border-primary/20 rounded-xl p-4"
          >
            <p className="text-sm text-gray-400">
              <span className="text-primary font-medium">Tip: </span>
              Take measurements at the same time of day (preferably morning) for consistency.
              Measure each body part at its widest point.
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
