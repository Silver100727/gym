import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  Scale,
  Ruler,
  Calendar,
  Activity,
  Target,
  Flame,
  Beef,
  Wheat,
  Droplet,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Minus,
  Utensils,
} from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sedentary', description: 'Little or no exercise', multiplier: 1.2 },
  { id: 'light', label: 'Light', description: 'Exercise 1-3 days/week', multiplier: 1.375 },
  { id: 'moderate', label: 'Moderate', description: 'Exercise 3-5 days/week', multiplier: 1.55 },
  { id: 'active', label: 'Very Active', description: 'Exercise 6-7 days/week', multiplier: 1.725 },
  { id: 'extreme', label: 'Athlete', description: 'Intense training daily', multiplier: 1.9 },
];

const GOALS = [
  { id: 'cut', label: 'LOSE FAT', icon: TrendingDown, color: '#ef4444', calorieAdjust: -500, proteinMult: 1.0, description: 'Caloric deficit for fat loss' },
  { id: 'maintain', label: 'MAINTAIN', icon: Minus, color: '#22c55e', calorieAdjust: 0, proteinMult: 0.85, description: 'Maintain current weight' },
  { id: 'bulk', label: 'BUILD MUSCLE', icon: TrendingUp, color: '#3b82f6', calorieAdjust: 300, proteinMult: 1.0, description: 'Caloric surplus for muscle gain' },
];

const MACRO_COLORS = {
  protein: '#ef4444',
  carbs: '#f97316',
  fat: '#22c55e',
};

const FOOD_EXAMPLES = {
  protein: ['Chicken breast', 'Greek yogurt', 'Eggs', 'Salmon', 'Whey protein', 'Lean beef'],
  carbs: ['Brown rice', 'Oats', 'Sweet potato', 'Quinoa', 'Fruits', 'Whole grain bread'],
  fat: ['Avocado', 'Olive oil', 'Nuts', 'Nut butter', 'Fatty fish', 'Dark chocolate'],
};

function MacroPieChart({ protein, carbs, fat, calories }) {
  const total = protein + carbs + fat;
  const proteinPct = (protein / total) * 100;
  const carbsPct = (carbs / total) * 100;
  const fatPct = (fat / total) * 100;

  // SVG arc calculations
  const radius = 80;
  const circumference = 2 * Math.PI * radius;

  const proteinDash = (proteinPct / 100) * circumference;
  const carbsDash = (carbsPct / 100) * circumference;
  const fatDash = (fatPct / 100) * circumference;

  const proteinOffset = 0;
  const carbsOffset = -proteinDash;
  const fatOffset = -(proteinDash + carbsDash);

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
        {/* Protein */}
        <motion.circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={MACRO_COLORS.protein}
          strokeWidth="24"
          strokeDasharray={`${proteinDash} ${circumference}`}
          strokeDashoffset={proteinOffset}
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray: `${proteinDash} ${circumference}` }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        {/* Carbs */}
        <motion.circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={MACRO_COLORS.carbs}
          strokeWidth="24"
          strokeDasharray={`${carbsDash} ${circumference}`}
          strokeDashoffset={carbsOffset}
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray: `${carbsDash} ${circumference}` }}
          transition={{ duration: 1, delay: 0.4 }}
        />
        {/* Fat */}
        <motion.circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={MACRO_COLORS.fat}
          strokeWidth="24"
          strokeDasharray={`${fatDash} ${circumference}`}
          strokeDashoffset={fatOffset}
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray: `${fatDash} ${circumference}` }}
          transition={{ duration: 1, delay: 0.6 }}
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <div className="text-3xl font-heading font-black text-white">{calories}</div>
          <div className="text-xs font-mono text-white/40">KCAL/DAY</div>
        </motion.div>
      </div>
    </div>
  );
}

function MacroCard({ label, grams, percentage, color, icon: Icon, calories, foods }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark border border-white/10 p-4"
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-sm flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div>
          <h4 className="font-heading font-bold text-white">{label}</h4>
          <p className="text-xs text-white/40">{calories} kcal</p>
        </div>
      </div>

      <div className="flex items-end justify-between mb-3">
        <div>
          <span className="text-3xl font-heading font-black text-white">{grams}</span>
          <span className="text-white/40 ml-1">g</span>
        </div>
        <span className="text-sm font-mono" style={{ color }}>{percentage}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>

      {/* Food examples */}
      <div className="flex flex-wrap gap-1">
        {foods.slice(0, 3).map((food) => (
          <span key={food} className="text-xs px-2 py-1 bg-white/5 text-white/50">
            {food}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function MacroCalculator() {
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState(25);
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [activity, setActivity] = useState('moderate');
  const [goal, setGoal] = useState('maintain');
  const [showResults, setShowResults] = useState(false);

  // Calculate BMR using Mifflin-St Jeor Equation
  const calculateBMR = () => {
    if (gender === 'male') {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  };

  // Calculate TDEE
  const activityData = ACTIVITY_LEVELS.find(a => a.id === activity);
  const goalData = GOALS.find(g => g.id === goal);
  const bmr = calculateBMR();
  const tdee = Math.round(bmr * activityData.multiplier);
  const targetCalories = Math.round(tdee + goalData.calorieAdjust);

  // Calculate macros
  const proteinGrams = Math.round(weight * 2 * goalData.proteinMult); // 2g per kg for gym-goers
  const proteinCalories = proteinGrams * 4;

  const fatCalories = Math.round(targetCalories * 0.25); // 25% from fat
  const fatGrams = Math.round(fatCalories / 9);

  const carbCalories = targetCalories - proteinCalories - fatCalories;
  const carbGrams = Math.round(carbCalories / 4);

  const totalMacroCalories = proteinCalories + carbCalories + fatCalories;
  const proteinPct = Math.round((proteinCalories / totalMacroCalories) * 100);
  const carbPct = Math.round((carbCalories / totalMacroCalories) * 100);
  const fatPct = Math.round((fatCalories / totalMacroCalories) * 100);

  const handleCalculate = () => setShowResults(true);
  const handleReset = () => setShowResults(false);

  return (
    <section className="py-20 lg:py-32 bg-dark relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)`,
            backgroundSize: '20px 20px',
          }}
        />
      </div>

      {/* Orbs */}
      <div className="absolute top-1/4 -right-32 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -left-32 w-64 h-64 bg-red-500/10 rounded-full blur-3xl" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center mb-12">
            <span className="font-mono text-primary text-xs tracking-widest">
              [ NUTRITION PLANNER ]
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-white mt-4">
              MACRO
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                {' '}CALCULATOR
              </span>
            </h2>
            <p className="text-white/40 mt-4 max-w-xl mx-auto">
              Calculate your daily macros based on your goals and get a personalized nutrition plan
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <div className="bg-dark-lighter border border-white/10 p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {!showResults ? (
                  <motion.div
                    key="inputs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Gender */}
                    <div>
                      <label className="block font-mono text-xs text-white/40 tracking-widest mb-3">
                        GENDER
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {['male', 'female'].map((g) => (
                          <button
                            key={g}
                            onClick={() => setGender(g)}
                            className={`p-4 border text-center transition-all ${
                              gender === g
                                ? 'border-primary bg-primary/10'
                                : 'border-white/10 hover:border-white/30'
                            }`}
                          >
                            <span className="text-2xl block mb-1">{g === 'male' ? '👨' : '👩'}</span>
                            <span className={`text-sm font-bold ${gender === g ? 'text-primary' : 'text-white'}`}>
                              {g.toUpperCase()}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Age, Weight, Height */}
                    <div className="grid sm:grid-cols-3 gap-4">
                      {/* Age */}
                      <div>
                        <label className="flex items-center gap-2 font-mono text-xs text-white/40 tracking-widest mb-3">
                          <Calendar className="w-4 h-4" /> AGE
                        </label>
                        <div className="bg-dark border border-white/10 p-3">
                          <input
                            type="range"
                            min="16"
                            max="80"
                            value={age}
                            onChange={(e) => setAge(Number(e.target.value))}
                            className="w-full accent-primary"
                          />
                          <div className="text-center mt-2">
                            <span className="text-xl font-heading font-black text-white">{age}</span>
                            <span className="text-white/40 text-sm ml-1">years</span>
                          </div>
                        </div>
                      </div>

                      {/* Weight */}
                      <div>
                        <label className="flex items-center gap-2 font-mono text-xs text-white/40 tracking-widest mb-3">
                          <Scale className="w-4 h-4" /> WEIGHT
                        </label>
                        <div className="bg-dark border border-white/10 p-3">
                          <input
                            type="range"
                            min="40"
                            max="150"
                            value={weight}
                            onChange={(e) => setWeight(Number(e.target.value))}
                            className="w-full accent-primary"
                          />
                          <div className="text-center mt-2">
                            <span className="text-xl font-heading font-black text-white">{weight}</span>
                            <span className="text-white/40 text-sm ml-1">kg</span>
                          </div>
                        </div>
                      </div>

                      {/* Height */}
                      <div>
                        <label className="flex items-center gap-2 font-mono text-xs text-white/40 tracking-widest mb-3">
                          <Ruler className="w-4 h-4" /> HEIGHT
                        </label>
                        <div className="bg-dark border border-white/10 p-3">
                          <input
                            type="range"
                            min="140"
                            max="220"
                            value={height}
                            onChange={(e) => setHeight(Number(e.target.value))}
                            className="w-full accent-primary"
                          />
                          <div className="text-center mt-2">
                            <span className="text-xl font-heading font-black text-white">{height}</span>
                            <span className="text-white/40 text-sm ml-1">cm</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Activity Level */}
                    <div>
                      <label className="flex items-center gap-2 font-mono text-xs text-white/40 tracking-widest mb-3">
                        <Activity className="w-4 h-4" /> ACTIVITY LEVEL
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {ACTIVITY_LEVELS.map((level) => (
                          <button
                            key={level.id}
                            onClick={() => setActivity(level.id)}
                            className={`p-3 border text-center transition-all ${
                              activity === level.id
                                ? 'border-primary bg-primary/10'
                                : 'border-white/10 hover:border-white/30'
                            }`}
                          >
                            <span className={`text-xs font-bold block ${activity === level.id ? 'text-primary' : 'text-white'}`}>
                              {level.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Goal */}
                    <div>
                      <label className="flex items-center gap-2 font-mono text-xs text-white/40 tracking-widest mb-3">
                        <Target className="w-4 h-4" /> YOUR GOAL
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {GOALS.map((g) => (
                          <button
                            key={g.id}
                            onClick={() => setGoal(g.id)}
                            className={`p-4 border text-center transition-all ${
                              goal === g.id
                                ? 'border-primary bg-primary/10'
                                : 'border-white/10 hover:border-white/30'
                            }`}
                          >
                            <g.icon
                              className="w-6 h-6 mx-auto mb-2"
                              style={{ color: goal === g.id ? g.color : '#6b7280' }}
                            />
                            <span className={`text-sm font-bold block ${goal === g.id ? 'text-white' : 'text-white/60'}`}>
                              {g.label}
                            </span>
                            <span className="text-xs text-white/30 block mt-1">
                              {g.calorieAdjust > 0 ? '+' : ''}{g.calorieAdjust} kcal
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Preview */}
                    <div className="p-4 bg-white/5 border border-white/10 text-center">
                      <span className="text-white/40 text-sm">Your maintenance: </span>
                      <span className="text-xl font-heading font-bold text-white">{tdee}</span>
                      <span className="text-white/40 text-sm"> kcal/day</span>
                    </div>

                    {/* Calculate Button */}
                    <motion.button
                      onClick={handleCalculate}
                      className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-heading font-bold text-lg flex items-center justify-center gap-2 hover:from-red-600 hover:to-orange-600 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Calculator className="w-5 h-5" />
                      CALCULATE MACROS
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                  >
                    {/* Header */}
                    <div className="text-center">
                      <div
                        className="inline-flex items-center gap-2 px-4 py-2 mb-4"
                        style={{ backgroundColor: `${goalData.color}20`, color: goalData.color }}
                      >
                        <goalData.icon className="w-4 h-4" />
                        <span className="font-mono text-sm">{goalData.label} MODE</span>
                      </div>
                      <p className="text-white/40 text-sm">{goalData.description}</p>
                    </div>

                    {/* Pie Chart */}
                    <MacroPieChart
                      protein={proteinPct}
                      carbs={carbPct}
                      fat={fatPct}
                      calories={targetCalories}
                    />

                    {/* Macro Cards */}
                    <div className="grid sm:grid-cols-3 gap-4">
                      <MacroCard
                        label="PROTEIN"
                        grams={proteinGrams}
                        percentage={proteinPct}
                        color={MACRO_COLORS.protein}
                        icon={Beef}
                        calories={proteinCalories}
                        foods={FOOD_EXAMPLES.protein}
                      />
                      <MacroCard
                        label="CARBS"
                        grams={carbGrams}
                        percentage={carbPct}
                        color={MACRO_COLORS.carbs}
                        icon={Wheat}
                        calories={carbCalories}
                        foods={FOOD_EXAMPLES.carbs}
                      />
                      <MacroCard
                        label="FAT"
                        grams={fatGrams}
                        percentage={fatPct}
                        color={MACRO_COLORS.fat}
                        icon={Droplet}
                        calories={fatCalories}
                        foods={FOOD_EXAMPLES.fat}
                      />
                    </div>

                    {/* Meal timing tip */}
                    <div className="p-4 bg-primary/5 border border-primary/20">
                      <div className="flex items-start gap-3">
                        <Utensils className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-heading font-bold text-white text-sm mb-1">Meal Timing Tip</h4>
                          <p className="text-white/50 text-sm">
                            Spread your protein intake across 4-5 meals for optimal muscle protein synthesis.
                            Aim for {Math.round(proteinGrams / 4)}-{Math.round(proteinGrams / 5)}g protein per meal.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-white/5 border border-white/10">
                        <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                        <div className="text-lg font-heading font-bold text-white">{tdee}</div>
                        <div className="text-xs text-white/40">TDEE</div>
                      </div>
                      <div className="p-3 bg-white/5 border border-white/10">
                        <Target className="w-5 h-5 text-primary mx-auto mb-1" />
                        <div className="text-lg font-heading font-bold text-white">{targetCalories}</div>
                        <div className="text-xs text-white/40">TARGET</div>
                      </div>
                      <div className="p-3 bg-white/5 border border-white/10">
                        <Activity className="w-5 h-5 text-green-400 mx-auto mb-1" />
                        <div className="text-lg font-heading font-bold text-white">{goalData.calorieAdjust > 0 ? '+' : ''}{goalData.calorieAdjust}</div>
                        <div className="text-xs text-white/40">ADJUST</div>
                      </div>
                    </div>

                    {/* Reset */}
                    <button
                      onClick={handleReset}
                      className="w-full py-3 border border-white/10 text-white/50 hover:text-white hover:border-white/30 font-mono text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      RECALCULATE
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Note */}
          <motion.p variants={fadeUp} className="text-center text-white/30 text-xs mt-6">
            * Based on Mifflin-St Jeor equation. Consult a nutritionist for personalized advice.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
