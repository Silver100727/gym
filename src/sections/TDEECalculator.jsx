import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Flame, Activity, Target, Scale, TrendingUp, TrendingDown, Minus, Info, Zap } from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

const FORMULAS = [
  { id: 'mifflin', name: 'Mifflin-St Jeor', description: 'Most accurate for most people', recommended: true },
  { id: 'harris', name: 'Harris-Benedict', description: 'Classic formula, slightly higher estimates' },
  { id: 'katch', name: 'Katch-McArdle', description: 'Uses body fat %, best for lean individuals' },
];

const ACTIVITY_LEVELS = [
  { id: 'sedentary', name: 'Sedentary', multiplier: 1.2, description: 'Little to no exercise, desk job', icon: '🪑' },
  { id: 'light', name: 'Lightly Active', multiplier: 1.375, description: 'Light exercise 1-3 days/week', icon: '🚶' },
  { id: 'moderate', name: 'Moderately Active', multiplier: 1.55, description: 'Moderate exercise 3-5 days/week', icon: '🏃' },
  { id: 'active', name: 'Very Active', multiplier: 1.725, description: 'Hard exercise 6-7 days/week', icon: '💪' },
  { id: 'athlete', name: 'Extremely Active', multiplier: 1.9, description: 'Athlete, physical job + training', icon: '🏋️' },
];

const GOALS = [
  { id: 'cut-aggressive', name: 'Aggressive Cut', modifier: -750, description: '-750 cal/day (~0.7kg/week loss)', icon: TrendingDown, color: 'text-red-400' },
  { id: 'cut-moderate', name: 'Moderate Cut', modifier: -500, description: '-500 cal/day (~0.5kg/week loss)', icon: TrendingDown, color: 'text-orange-400' },
  { id: 'cut-slow', name: 'Slow Cut', modifier: -250, description: '-250 cal/day (~0.25kg/week loss)', icon: TrendingDown, color: 'text-yellow-400' },
  { id: 'maintain', name: 'Maintain', modifier: 0, description: 'Maintain current weight', icon: Minus, color: 'text-green-400' },
  { id: 'bulk-lean', name: 'Lean Bulk', modifier: 250, description: '+250 cal/day (~0.25kg/week gain)', icon: TrendingUp, color: 'text-cyan-400' },
  { id: 'bulk-moderate', name: 'Moderate Bulk', modifier: 500, description: '+500 cal/day (~0.5kg/week gain)', icon: TrendingUp, color: 'text-blue-400' },
];

export default function TDEECalculator() {
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState(30);
  const [weight, setWeight] = useState(75);
  const [height, setHeight] = useState(175);
  const [bodyFat, setBodyFat] = useState(20);
  const [formula, setFormula] = useState('mifflin');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [selectedGoal, setSelectedGoal] = useState('maintain');
  const [unit, setUnit] = useState('metric');

  // Convert imperial to metric for calculations
  const weightKg = unit === 'imperial' ? weight * 0.453592 : weight;
  const heightCm = unit === 'imperial' ? height * 2.54 : height;

  const calculations = useMemo(() => {
    let bmr = 0;

    // Calculate BMR based on selected formula
    switch (formula) {
      case 'mifflin':
        // Mifflin-St Jeor
        if (gender === 'male') {
          bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
        } else {
          bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
        }
        break;
      case 'harris':
        // Harris-Benedict (Revised)
        if (gender === 'male') {
          bmr = 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * age;
        } else {
          bmr = 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.330 * age;
        }
        break;
      case 'katch':
        // Katch-McArdle (requires body fat)
        const leanMass = weightKg * (1 - bodyFat / 100);
        bmr = 370 + 21.6 * leanMass;
        break;
      default:
        bmr = 0;
    }

    // Get activity multiplier
    const activity = ACTIVITY_LEVELS.find(a => a.id === activityLevel);
    const tdee = bmr * (activity?.multiplier || 1.2);

    // Get goal modifier
    const goal = GOALS.find(g => g.id === selectedGoal);
    const targetCalories = tdee + (goal?.modifier || 0);

    // Calculate macros (rough estimates)
    const protein = weightKg * 2; // 2g per kg bodyweight
    const fat = (targetCalories * 0.25) / 9; // 25% of calories from fat
    const carbs = (targetCalories - protein * 4 - fat * 9) / 4; // Remaining from carbs

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: Math.round(targetCalories),
      macros: {
        protein: Math.round(protein),
        carbs: Math.round(Math.max(0, carbs)),
        fat: Math.round(fat),
      },
    };
  }, [gender, age, weightKg, heightCm, bodyFat, formula, activityLevel, selectedGoal]);

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
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
            <Flame className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium">Calorie Calculator</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            TDEE <span className="text-primary">Calculator</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Calculate your Total Daily Energy Expenditure and get personalized calorie targets for your fitness goals
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <motion.div variants={fadeUp} className="space-y-6">
              {/* Unit Toggle */}
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Units</h3>
                  <div className="flex bg-zinc-800 rounded-lg p-1">
                    <button
                      onClick={() => setUnit('metric')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        unit === 'metric' ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Metric
                    </button>
                    <button
                      onClick={() => setUnit('imperial')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        unit === 'imperial' ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'
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
                        gender === 'male' ? 'bg-blue-500 text-white' : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                      }`}
                    >
                      Male
                    </button>
                    <button
                      onClick={() => setGender('female')}
                      className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                        gender === 'female' ? 'bg-pink-500 text-white' : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                      }`}
                    >
                      Female
                    </button>
                  </div>
                </div>

                {/* Age, Weight, Height */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Age</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-center focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">
                      Weight ({unit === 'metric' ? 'kg' : 'lbs'})
                    </label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-center focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">
                      Height ({unit === 'metric' ? 'cm' : 'in'})
                    </label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-center focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Formula Selection */}
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-primary" />
                  BMR Formula
                </h3>
                <div className="space-y-2">
                  {FORMULAS.map(f => (
                    <button
                      key={f.id}
                      onClick={() => setFormula(f.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        formula === f.id
                          ? 'bg-primary/20 border-2 border-primary'
                          : 'bg-zinc-800 border-2 border-transparent hover:bg-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">{f.name}</span>
                        {f.recommended && (
                          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mt-1">{f.description}</p>
                    </button>
                  ))}
                </div>

                {/* Body Fat Input (for Katch-McArdle) */}
                {formula === 'katch' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4"
                  >
                    <label className="text-gray-400 text-sm mb-2 block">Body Fat %</label>
                    <input
                      type="number"
                      value={bodyFat}
                      onChange={(e) => setBodyFat(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-center focus:outline-none focus:border-primary"
                    />
                  </motion.div>
                )}
              </div>

              {/* Activity Level */}
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Activity Level
                </h3>
                <div className="space-y-2">
                  {ACTIVITY_LEVELS.map(level => (
                    <button
                      key={level.id}
                      onClick={() => setActivityLevel(level.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        activityLevel === level.id
                          ? 'bg-primary/20 border-2 border-primary'
                          : 'bg-zinc-800 border-2 border-transparent hover:bg-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{level.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">{level.name}</span>
                            <span className="text-gray-500 text-sm">×{level.multiplier}</span>
                          </div>
                          <p className="text-gray-400 text-sm">{level.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Results Section */}
            <motion.div variants={fadeUp} className="space-y-6">
              {/* Main Results */}
              <div className="bg-gradient-to-br from-primary/20 via-orange-500/10 to-red-500/10 rounded-2xl p-6 border border-primary/30">
                <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Your Results
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-black/30 rounded-xl p-4 text-center">
                    <p className="text-gray-400 text-sm mb-1">BMR</p>
                    <p className="text-3xl font-bold text-white">{calculations.bmr}</p>
                    <p className="text-gray-500 text-xs">cal/day at rest</p>
                  </div>
                  <div className="bg-black/30 rounded-xl p-4 text-center">
                    <p className="text-gray-400 text-sm mb-1">TDEE</p>
                    <p className="text-3xl font-bold text-primary">{calculations.tdee}</p>
                    <p className="text-gray-500 text-xs">cal/day total</p>
                  </div>
                </div>

                <div className="bg-black/30 rounded-xl p-6 text-center">
                  <p className="text-gray-400 text-sm mb-2">Target Calories</p>
                  <p className="text-5xl font-bold text-white mb-2">{calculations.targetCalories}</p>
                  <p className="text-gray-400 text-sm">calories per day</p>
                </div>
              </div>

              {/* Goal Selection */}
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Your Goal
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {GOALS.map(goal => {
                    const Icon = goal.icon;
                    return (
                      <button
                        key={goal.id}
                        onClick={() => setSelectedGoal(goal.id)}
                        className={`p-3 rounded-xl text-left transition-all ${
                          selectedGoal === goal.id
                            ? 'bg-primary/20 border-2 border-primary'
                            : 'bg-zinc-800 border-2 border-transparent hover:bg-zinc-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className={`w-4 h-4 ${goal.color}`} />
                          <span className="text-white text-sm font-medium">{goal.name}</span>
                        </div>
                        <p className="text-gray-500 text-xs">{goal.modifier > 0 ? '+' : ''}{goal.modifier} cal</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Macro Breakdown */}
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-primary" />
                  Suggested Macros
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center mb-2">
                      <span className="text-2xl font-bold text-blue-400">{calculations.macros.protein}g</span>
                    </div>
                    <p className="text-gray-400 text-sm">Protein</p>
                    <p className="text-gray-500 text-xs">{calculations.macros.protein * 4} cal</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-yellow-500/20 rounded-full flex items-center justify-center mb-2">
                      <span className="text-2xl font-bold text-yellow-400">{calculations.macros.carbs}g</span>
                    </div>
                    <p className="text-gray-400 text-sm">Carbs</p>
                    <p className="text-gray-500 text-xs">{calculations.macros.carbs * 4} cal</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-pink-500/20 rounded-full flex items-center justify-center mb-2">
                      <span className="text-2xl font-bold text-pink-400">{calculations.macros.fat}g</span>
                    </div>
                    <p className="text-gray-400 text-sm">Fat</p>
                    <p className="text-gray-500 text-xs">{calculations.macros.fat * 9} cal</p>
                  </div>
                </div>
              </div>

              {/* Info Note */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-blue-400 font-medium text-sm mb-1">Important Note</p>
                    <p className="text-gray-400 text-xs">
                      These are estimates based on formulas. Individual metabolism varies.
                      Track your weight for 2-3 weeks and adjust calories based on actual results.
                    </p>
                  </div>
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
