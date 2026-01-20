import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Scale, User, Ruler, Info, Target, TrendingUp, TrendingDown } from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

const FORMULAS = [
  { id: 'devine', name: 'Devine Formula', description: 'Most commonly used in clinical settings' },
  { id: 'robinson', name: 'Robinson Formula', description: 'Modified version, slightly higher' },
  { id: 'miller', name: 'Miller Formula', description: 'Lower estimates for taller people' },
  { id: 'hamwi', name: 'Hamwi Formula', description: 'Traditional medical formula' },
];

const FRAME_SIZES = [
  { id: 'small', name: 'Small Frame', modifier: 0.9, description: 'Wrist < 6.5" (men) or < 6" (women)' },
  { id: 'medium', name: 'Medium Frame', modifier: 1.0, description: 'Wrist 6.5-7.5" (men) or 6-6.5" (women)' },
  { id: 'large', name: 'Large Frame', modifier: 1.1, description: 'Wrist > 7.5" (men) or > 6.5" (women)' },
];

export default function IdealWeightCalculator() {
  const [gender, setGender] = useState('male');
  const [height, setHeight] = useState(175);
  const [currentWeight, setCurrentWeight] = useState(80);
  const [frameSize, setFrameSize] = useState('medium');
  const [unit, setUnit] = useState('metric');

  const heightInches = unit === 'metric' ? height / 2.54 : height;
  const heightOver5Feet = Math.max(0, heightInches - 60);

  const calculations = useMemo(() => {
    const frame = FRAME_SIZES.find(f => f.id === frameSize);
    const modifier = frame?.modifier || 1.0;

    let results = {};

    if (gender === 'male') {
      results = {
        devine: (50 + 2.3 * heightOver5Feet) * modifier,
        robinson: (52 + 1.9 * heightOver5Feet) * modifier,
        miller: (56.2 + 1.41 * heightOver5Feet) * modifier,
        hamwi: (48 + 2.7 * heightOver5Feet) * modifier,
      };
    } else {
      results = {
        devine: (45.5 + 2.3 * heightOver5Feet) * modifier,
        robinson: (49 + 1.7 * heightOver5Feet) * modifier,
        miller: (53.1 + 1.36 * heightOver5Feet) * modifier,
        hamwi: (45.5 + 2.2 * heightOver5Feet) * modifier,
      };
    }

    const average = (results.devine + results.robinson + results.miller + results.hamwi) / 4;
    const currentWeightKg = unit === 'metric' ? currentWeight : currentWeight * 0.453592;
    const difference = currentWeightKg - average;

    return {
      ...results,
      average: Math.round(average * 10) / 10,
      range: {
        low: Math.round(average * 0.9 * 10) / 10,
        high: Math.round(average * 1.1 * 10) / 10,
      },
      difference: Math.round(difference * 10) / 10,
      currentWeightKg: Math.round(currentWeightKg * 10) / 10,
    };
  }, [gender, heightOver5Feet, frameSize, currentWeight, unit]);

  const getWeightStatus = () => {
    const diff = calculations.difference;
    if (diff < -5) return { text: 'Below ideal range', color: 'text-yellow-400', icon: TrendingDown };
    if (diff > 5) return { text: 'Above ideal range', color: 'text-orange-400', icon: TrendingUp };
    return { text: 'Within ideal range', color: 'text-green-400', icon: Target };
  };

  const status = getWeightStatus();
  const StatusIcon = status.icon;

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
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
            <Scale className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium">Weight Goals</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ideal Body <span className="text-primary">Weight</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Calculate your ideal body weight using multiple scientific formulas
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Section */}
            <motion.div variants={fadeUp} className="space-y-6">
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
                {/* Unit Toggle */}
                <div className="flex justify-end mb-4">
                  <div className="flex bg-zinc-800 rounded-lg p-1">
                    <button
                      onClick={() => setUnit('metric')}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        unit === 'metric' ? 'bg-primary text-black' : 'text-gray-400'
                      }`}
                    >
                      Metric
                    </button>
                    <button
                      onClick={() => setUnit('imperial')}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        unit === 'imperial' ? 'bg-primary text-black' : 'text-gray-400'
                      }`}
                    >
                      Imperial
                    </button>
                  </div>
                </div>

                {/* Gender */}
                <div className="mb-4">
                  <label className="text-gray-400 text-sm mb-2 block">Gender</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setGender('male')}
                      className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                        gender === 'male' ? 'bg-blue-500 text-white' : 'bg-zinc-800 text-gray-400'
                      }`}
                    >
                      <User className="w-4 h-4 inline mr-2" />
                      Male
                    </button>
                    <button
                      onClick={() => setGender('female')}
                      className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                        gender === 'female' ? 'bg-pink-500 text-white' : 'bg-zinc-800 text-gray-400'
                      }`}
                    >
                      <User className="w-4 h-4 inline mr-2" />
                      Female
                    </button>
                  </div>
                </div>

                {/* Height */}
                <div className="mb-4">
                  <label className="text-gray-400 text-sm mb-2 block flex items-center gap-2">
                    <Ruler className="w-4 h-4" />
                    Height ({unit === 'metric' ? 'cm' : 'inches'})
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-center text-xl font-semibold focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Current Weight */}
                <div className="mb-4">
                  <label className="text-gray-400 text-sm mb-2 block flex items-center gap-2">
                    <Scale className="w-4 h-4" />
                    Current Weight ({unit === 'metric' ? 'kg' : 'lbs'})
                  </label>
                  <input
                    type="number"
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-center text-xl font-semibold focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Frame Size */}
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Body Frame Size</label>
                  <div className="space-y-2">
                    {FRAME_SIZES.map(frame => (
                      <button
                        key={frame.id}
                        onClick={() => setFrameSize(frame.id)}
                        className={`w-full p-3 rounded-xl text-left transition-all ${
                          frameSize === frame.id
                            ? 'bg-primary/20 border-2 border-primary'
                            : 'bg-zinc-800 border-2 border-transparent'
                        }`}
                      >
                        <span className="text-white font-medium">{frame.name}</span>
                        <p className="text-gray-400 text-xs mt-1">{frame.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Results Section */}
            <motion.div variants={fadeUp} className="space-y-6">
              {/* Main Result */}
              <div className="bg-gradient-to-br from-primary/20 via-green-500/10 to-teal-500/10 rounded-2xl p-6 border border-primary/30">
                <h3 className="text-white font-semibold mb-4 text-center">Your Ideal Weight</h3>
                <div className="text-center mb-4">
                  <p className="text-5xl font-bold text-white">{calculations.average}</p>
                  <p className="text-gray-400">kg</p>
                </div>
                <div className="bg-black/30 rounded-xl p-4 text-center">
                  <p className="text-gray-400 text-sm">Healthy Range</p>
                  <p className="text-2xl font-semibold text-primary">
                    {calculations.range.low} - {calculations.range.high} kg
                  </p>
                </div>

                {/* Status */}
                <div className={`mt-4 flex items-center justify-center gap-2 ${status.color}`}>
                  <StatusIcon className="w-5 h-5" />
                  <span className="font-medium">{status.text}</span>
                </div>

                {calculations.difference !== 0 && (
                  <p className="text-center text-gray-400 text-sm mt-2">
                    {calculations.difference > 0 ? '+' : ''}{calculations.difference} kg from ideal
                  </p>
                )}
              </div>

              {/* Formula Breakdown */}
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
                <h3 className="text-white font-semibold mb-4">Formula Results</h3>
                <div className="space-y-3">
                  {FORMULAS.map(formula => (
                    <div
                      key={formula.id}
                      className="flex items-center justify-between bg-zinc-800/50 rounded-xl p-3"
                    >
                      <div>
                        <p className="text-white text-sm font-medium">{formula.name}</p>
                        <p className="text-gray-500 text-xs">{formula.description}</p>
                      </div>
                      <p className="text-primary font-bold">
                        {Math.round(calculations[formula.id] * 10) / 10} kg
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-blue-400 shrink-0" />
                  <p className="text-gray-400 text-sm">
                    These are estimates based on height. Muscle mass, bone density, and body composition
                    aren't factored in. Athletes may weigh more due to muscle.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-primary/20 rounded-tl-3xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-primary/20 rounded-br-3xl" />
      </motion.div>
    </section>
  );
}
