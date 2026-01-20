import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  Dumbbell,
  RotateCcw,
  Check,
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

// Barbell types
const BARBELLS = [
  { id: 'olympic', name: 'Olympic Barbell', weight: 20, color: '#71717a' },
  { id: 'womens', name: "Women's Olympic", weight: 15, color: '#ec4899' },
  { id: 'ez', name: 'EZ Curl Bar', weight: 10, color: '#8b5cf6' },
  { id: 'trap', name: 'Trap/Hex Bar', weight: 25, color: '#f97316' },
];

// Available plate weights in kg
const PLATES_KG = [
  { weight: 25, color: '#ef4444', width: 28 },
  { weight: 20, color: '#3b82f6', width: 26 },
  { weight: 15, color: '#eab308', width: 24 },
  { weight: 10, color: '#22c55e', width: 22 },
  { weight: 5, color: '#ffffff', width: 18 },
  { weight: 2.5, color: '#ef4444', width: 14 },
  { weight: 1.25, color: '#71717a', width: 10 },
];

// Calculate plates needed per side
function calculatePlates(targetWeight, barWeight, availablePlates) {
  const weightPerSide = (targetWeight - barWeight) / 2;

  if (weightPerSide < 0) {
    return { plates: [], valid: false, message: 'Target weight must be greater than bar weight' };
  }

  if (weightPerSide === 0) {
    return { plates: [], valid: true, message: 'Just the bar!' };
  }

  const plates = [];
  let remaining = weightPerSide;

  // Sort available plates by weight descending
  const sortedPlates = [...availablePlates].sort((a, b) => b - a);

  for (const plateWeight of sortedPlates) {
    while (remaining >= plateWeight) {
      plates.push(plateWeight);
      remaining = Math.round((remaining - plateWeight) * 100) / 100; // Handle floating point
    }
  }

  if (remaining > 0.01) { // Small tolerance for floating point
    return { plates: [], valid: false, message: `Cannot make exact weight. ${remaining.toFixed(2)}kg remaining per side.` };
  }

  return { plates, valid: true, message: null };
}

// Visual plate component
function PlateVisual({ weight, index, side }) {
  const plateData = PLATES_KG.find(p => p.weight === weight);
  const height = plateData?.width || 20;

  return (
    <motion.div
      initial={{
        x: side === 'left' ? -50 : 50,
        opacity: 0
      }}
      animate={{
        x: 0,
        opacity: 1
      }}
      transition={{ delay: index * 0.1 }}
      className="flex flex-col items-center"
      style={{ marginLeft: side === 'left' ? -2 : 0, marginRight: side === 'right' ? -2 : 0 }}
    >
      <div
        className="rounded-sm flex items-center justify-center border-2 border-white/20"
        style={{
          backgroundColor: plateData?.color || '#666',
          width: '12px',
          height: `${height * 2}px`,
        }}
      >
        <span
          className="text-[8px] font-bold writing-mode-vertical"
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            color: weight === 5 ? '#000' : '#fff'
          }}
        >
          {weight}
        </span>
      </div>
    </motion.div>
  );
}

// Barbell visualization
function BarbellVisualization({ barbell, plates }) {
  const leftPlates = [...plates].reverse();
  const rightPlates = plates;

  return (
    <div className="relative py-8">
      <div className="flex items-center justify-center">
        {/* Left collar */}
        <div className="w-4 h-8 bg-zinc-600 rounded-l-sm" />

        {/* Left plates */}
        <div className="flex items-center">
          {leftPlates.map((weight, idx) => (
            <PlateVisual key={`left-${idx}`} weight={weight} index={idx} side="left" />
          ))}
        </div>

        {/* Left sleeve */}
        <div className="w-16 h-6 bg-zinc-500" />

        {/* Bar center */}
        <div
          className="w-32 h-8 flex items-center justify-center relative"
          style={{ backgroundColor: barbell.color }}
        >
          <span className="text-white text-xs font-mono font-bold">{barbell.weight}kg</span>
          {/* Knurling pattern */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0 w-px bg-white"
                style={{ left: `${12.5 * (i + 1)}%` }}
              />
            ))}
          </div>
        </div>

        {/* Right sleeve */}
        <div className="w-16 h-6 bg-zinc-500" />

        {/* Right plates */}
        <div className="flex items-center">
          {rightPlates.map((weight, idx) => (
            <PlateVisual key={`right-${idx}`} weight={weight} index={idx} side="right" />
          ))}
        </div>

        {/* Right collar */}
        <div className="w-4 h-8 bg-zinc-600 rounded-r-sm" />
      </div>
    </div>
  );
}

// Plate selector component
function PlateSelector({ availablePlates, onToggle }) {
  return (
    <div className="grid grid-cols-7 gap-2">
      {PLATES_KG.map((plate) => {
        const isSelected = availablePlates.includes(plate.weight);
        return (
          <motion.button
            key={plate.weight}
            onClick={() => onToggle(plate.weight)}
            className={`relative p-3 border transition-all ${
              isSelected
                ? 'border-primary bg-primary/10'
                : 'border-white/10 bg-white/5 hover:border-white/20'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div
              className="w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-1"
              style={{ backgroundColor: plate.color }}
            >
              <span className={`text-[10px] font-bold ${plate.weight === 5 ? 'text-black' : 'text-white'}`}>
                {plate.weight}
              </span>
            </div>
            <p className="text-xs text-white/50 text-center">{plate.weight}kg</p>
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center"
              >
                <Check className="w-3 h-3 text-white" />
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

// Plate breakdown component
function PlateBreakdown({ plates, side = 'per side' }) {
  // Count plates
  const plateCounts = plates.reduce((acc, weight) => {
    acc[weight] = (acc[weight] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-2">
      {Object.entries(plateCounts)
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([weight, count]) => {
          const plateData = PLATES_KG.find(p => p.weight === Number(weight));
          return (
            <motion.div
              key={weight}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: plateData?.color }}
              >
                <span className={`text-[8px] font-bold ${Number(weight) === 5 ? 'text-black' : 'text-white'}`}>
                  {weight}
                </span>
              </div>
              <span className="text-white/70 text-sm flex-1">{weight}kg plate</span>
              <span className="font-mono text-primary font-bold">×{count}</span>
            </motion.div>
          );
        })}
      {plates.length === 0 && (
        <p className="text-white/50 text-sm text-center py-2">No plates needed</p>
      )}
    </div>
  );
}

export default function PlateCalculator() {
  const [targetWeight, setTargetWeight] = useState(100);
  const [selectedBarbell, setSelectedBarbell] = useState(BARBELLS[0]);
  const [availablePlates, setAvailablePlates] = useState([25, 20, 15, 10, 5, 2.5, 1.25]);
  const [showBarbellMenu, setShowBarbellMenu] = useState(false);
  const [unit, setUnit] = useState('kg');

  // Calculate plates
  const result = useMemo(() => {
    return calculatePlates(targetWeight, selectedBarbell.weight, availablePlates);
  }, [targetWeight, selectedBarbell, availablePlates]);

  // Total weight calculation
  const totalPlateWeight = result.plates.reduce((sum, w) => sum + w, 0) * 2;
  const totalWeight = selectedBarbell.weight + totalPlateWeight;

  const togglePlate = (weight) => {
    setAvailablePlates(prev =>
      prev.includes(weight)
        ? prev.filter(w => w !== weight)
        : [...prev, weight].sort((a, b) => b - a)
    );
  };

  const handleWeightChange = (delta) => {
    setTargetWeight(prev => Math.max(selectedBarbell.weight, prev + delta));
  };

  return (
    <section className="relative py-24 bg-dark overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary font-mono text-sm mb-6">
              <Calculator className="w-4 h-4" />
              LOAD CALCULATOR
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-black text-white mb-4">
              PLATE{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500">
                CALCULATOR
              </span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Enter your target weight and see exactly which plates to load on each side of the bar.
            </p>
          </motion.div>

          {/* Main content */}
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left - Inputs */}
              <div className="space-y-6">
                {/* Target weight input */}
                <motion.div
                  variants={fadeUp}
                  className="relative bg-dark/50 border border-white/10 p-6"
                >
                  <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-primary/30" />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-primary/30" />

                  <h3 className="font-heading font-bold text-white mb-4 flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-primary" />
                    TARGET WEIGHT
                  </h3>

                  <div className="flex items-center justify-center gap-4 mb-4">
                    <motion.button
                      onClick={() => handleWeightChange(-5)}
                      className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 transition-colors font-mono text-xl text-white"
                      whileTap={{ scale: 0.9 }}
                    >
                      -5
                    </motion.button>
                    <motion.button
                      onClick={() => handleWeightChange(-2.5)}
                      className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 transition-colors font-mono text-sm text-white"
                      whileTap={{ scale: 0.9 }}
                    >
                      -2.5
                    </motion.button>

                    <div className="text-center px-4">
                      <motion.span
                        key={targetWeight}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        className="font-mono text-5xl font-black text-primary block"
                      >
                        {targetWeight}
                      </motion.span>
                      <span className="text-white/50 text-sm">kg</span>
                    </div>

                    <motion.button
                      onClick={() => handleWeightChange(2.5)}
                      className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 transition-colors font-mono text-sm text-white"
                      whileTap={{ scale: 0.9 }}
                    >
                      +2.5
                    </motion.button>
                    <motion.button
                      onClick={() => handleWeightChange(5)}
                      className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 transition-colors font-mono text-xl text-white"
                      whileTap={{ scale: 0.9 }}
                    >
                      +5
                    </motion.button>
                  </div>

                  {/* Quick presets */}
                  <div className="flex flex-wrap justify-center gap-2">
                    {[60, 80, 100, 120, 140, 160].map((w) => (
                      <button
                        key={w}
                        onClick={() => setTargetWeight(w)}
                        className={`px-3 py-1 font-mono text-sm transition-colors ${
                          targetWeight === w
                            ? 'bg-primary text-white'
                            : 'bg-white/5 text-white/50 hover:text-white'
                        }`}
                      >
                        {w}kg
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Barbell selector */}
                <motion.div variants={fadeUp} className="bg-dark/50 border border-white/10 p-6">
                  <h3 className="font-heading font-bold text-white mb-4">BARBELL TYPE</h3>
                  <div className="relative">
                    <button
                      onClick={() => setShowBarbellMenu(!showBarbellMenu)}
                      className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-3 rounded-sm"
                          style={{ backgroundColor: selectedBarbell.color }}
                        />
                        <div className="text-left">
                          <p className="font-bold text-white">{selectedBarbell.name}</p>
                          <p className="text-white/50 text-xs">{selectedBarbell.weight}kg</p>
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-white/50 transition-transform ${showBarbellMenu ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {showBarbellMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-darker border border-white/10 z-20"
                        >
                          {BARBELLS.map((bar) => (
                            <button
                              key={bar.id}
                              onClick={() => {
                                setSelectedBarbell(bar);
                                setShowBarbellMenu(false);
                                if (targetWeight < bar.weight) {
                                  setTargetWeight(bar.weight);
                                }
                              }}
                              className={`w-full flex items-center gap-3 p-4 text-left transition-colors ${
                                selectedBarbell.id === bar.id ? 'bg-white/10' : 'hover:bg-white/5'
                              }`}
                            >
                              <div
                                className="w-8 h-3 rounded-sm"
                                style={{ backgroundColor: bar.color }}
                              />
                              <div>
                                <p className="font-bold text-white text-sm">{bar.name}</p>
                                <p className="text-white/50 text-xs">{bar.weight}kg</p>
                              </div>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* Available plates */}
                <motion.div variants={fadeUp} className="bg-dark/50 border border-white/10 p-6">
                  <h3 className="font-heading font-bold text-white mb-4">AVAILABLE PLATES</h3>
                  <p className="text-white/50 text-sm mb-4">Select the plates you have access to</p>
                  <PlateSelector availablePlates={availablePlates} onToggle={togglePlate} />
                </motion.div>
              </div>

              {/* Right - Results */}
              <div className="space-y-6">
                {/* Barbell visualization */}
                <motion.div
                  variants={fadeUp}
                  className="relative bg-dark/50 border border-white/10 p-6"
                >
                  <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-primary/30" />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-primary/30" />

                  <h3 className="font-heading font-bold text-white mb-2 text-center">
                    LOADED BARBELL
                  </h3>

                  {result.valid ? (
                    <>
                      <BarbellVisualization barbell={selectedBarbell} plates={result.plates} />
                      <div className="text-center">
                        <p className="font-mono text-3xl font-black text-primary">
                          {totalWeight}kg
                        </p>
                        <p className="text-white/50 text-sm">Total weight</p>
                      </div>
                    </>
                  ) : (
                    <div className="py-8 text-center">
                      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                      <p className="text-red-400">{result.message}</p>
                    </div>
                  )}
                </motion.div>

                {/* Plate breakdown */}
                {result.valid && result.plates.length > 0 && (
                  <motion.div
                    variants={fadeUp}
                    className="bg-dark/50 border border-white/10 p-6"
                  >
                    <h3 className="font-heading font-bold text-white mb-4">
                      PLATES PER SIDE
                    </h3>
                    <PlateBreakdown plates={result.plates} />

                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/50">Weight per side:</span>
                        <span className="font-mono text-white font-bold">
                          {(totalWeight - selectedBarbell.weight) / 2}kg
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-white/50">Bar weight:</span>
                        <span className="font-mono text-white font-bold">
                          {selectedBarbell.weight}kg
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Quick reference */}
                <motion.div
                  variants={fadeUp}
                  className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 p-6"
                >
                  <h4 className="font-heading font-bold text-white mb-3">PLATE COLORS (STANDARD)</h4>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {PLATES_KG.slice(0, 4).map((plate) => (
                      <div key={plate.weight} className="flex flex-col items-center gap-1">
                        <div
                          className="w-8 h-8 rounded-full"
                          style={{ backgroundColor: plate.color }}
                        />
                        <span className="text-white/50 text-xs">{plate.weight}kg</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
