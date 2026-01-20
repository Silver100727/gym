import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart, Activity, Dumbbell, Moon, Brain, Cigarette, Wine, Apple, Clock, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

const QUESTIONS = [
  {
    id: 'cardio',
    question: 'How often do you do cardio exercise?',
    icon: Heart,
    options: [
      { label: 'Never', value: 5 },
      { label: '1-2 times/week', value: 2 },
      { label: '3-4 times/week', value: -2 },
      { label: '5+ times/week', value: -5 },
    ],
  },
  {
    id: 'strength',
    question: 'How often do you strength train?',
    icon: Dumbbell,
    options: [
      { label: 'Never', value: 4 },
      { label: '1-2 times/week', value: 1 },
      { label: '3-4 times/week', value: -3 },
      { label: '5+ times/week', value: -4 },
    ],
  },
  {
    id: 'flexibility',
    question: 'Do you stretch or do yoga regularly?',
    icon: Activity,
    options: [
      { label: 'Never', value: 3 },
      { label: 'Occasionally', value: 1 },
      { label: 'Weekly', value: -1 },
      { label: 'Daily', value: -3 },
    ],
  },
  {
    id: 'sleep',
    question: 'How many hours do you sleep per night?',
    icon: Moon,
    options: [
      { label: 'Less than 5', value: 5 },
      { label: '5-6 hours', value: 3 },
      { label: '7-8 hours', value: -2 },
      { label: 'More than 8', value: 0 },
    ],
  },
  {
    id: 'stress',
    question: 'How would you rate your stress levels?',
    icon: Brain,
    options: [
      { label: 'Very high', value: 5 },
      { label: 'High', value: 3 },
      { label: 'Moderate', value: 0 },
      { label: 'Low', value: -2 },
    ],
  },
  {
    id: 'smoking',
    question: 'Do you smoke?',
    icon: Cigarette,
    options: [
      { label: 'Yes, heavily', value: 8 },
      { label: 'Yes, occasionally', value: 4 },
      { label: 'I quit', value: 1 },
      { label: 'Never', value: -2 },
    ],
  },
  {
    id: 'alcohol',
    question: 'How much alcohol do you consume?',
    icon: Wine,
    options: [
      { label: 'Heavy drinking', value: 5 },
      { label: 'Moderate', value: 2 },
      { label: 'Occasionally', value: 0 },
      { label: 'Never', value: -1 },
    ],
  },
  {
    id: 'diet',
    question: 'How would you describe your diet?',
    icon: Apple,
    options: [
      { label: 'Poor - mostly processed', value: 5 },
      { label: 'Average', value: 2 },
      { label: 'Good - balanced', value: -2 },
      { label: 'Excellent - whole foods', value: -4 },
    ],
  },
];

export default function FitnessAgeCalculator() {
  const [actualAge, setActualAge] = useState(30);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const allAnswered = Object.keys(answers).length === QUESTIONS.length;

  const fitnessAge = useMemo(() => {
    if (!allAnswered) return null;
    const totalModifier = Object.values(answers).reduce((sum, val) => sum + val, 0);
    return Math.max(18, Math.round(actualAge + totalModifier));
  }, [actualAge, answers, allAnswered]);

  const ageDifference = fitnessAge ? fitnessAge - actualAge : 0;

  const getAgeStatus = () => {
    if (!fitnessAge) return null;
    if (ageDifference <= -5) return { text: 'Excellent! You\'re biologically younger', color: 'text-green-400', bg: 'from-green-500/20', icon: TrendingDown };
    if (ageDifference <= 0) return { text: 'Good! Your fitness matches your age', color: 'text-blue-400', bg: 'from-blue-500/20', icon: Minus };
    if (ageDifference <= 5) return { text: 'Room for improvement', color: 'text-yellow-400', bg: 'from-yellow-500/20', icon: TrendingUp };
    return { text: 'Time to make changes', color: 'text-red-400', bg: 'from-red-500/20', icon: TrendingUp };
  };

  const status = getAgeStatus();

  const calculateProgress = () => {
    return (Object.keys(answers).length / QUESTIONS.length) * 100;
  };

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
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
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium">Biological Age</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Fitness <span className="text-primary">Age</span> Calculator
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover your biological age based on lifestyle and fitness habits
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {!showResults ? (
            <motion.div variants={fadeUp}>
              {/* Actual Age Input */}
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl p-6 border border-zinc-800 mb-6">
                <label className="text-gray-400 text-sm mb-2 block">Your Actual Age</label>
                <input
                  type="number"
                  value={actualAge}
                  onChange={(e) => setActualAge(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-center text-2xl font-semibold focus:outline-none focus:border-primary"
                />
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Progress</span>
                  <span>{Object.keys(answers).length}/{QUESTIONS.length} questions</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${calculateProgress()}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-4">
                {QUESTIONS.map((q, idx) => {
                  const Icon = q.icon;
                  return (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl p-6 border border-zinc-800"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <p className="text-white font-medium">{q.question}</p>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {q.options.map(opt => (
                          <button
                            key={opt.label}
                            onClick={() => handleAnswer(q.id, opt.value)}
                            className={`p-3 rounded-xl text-sm font-medium transition-all ${
                              answers[q.id] === opt.value
                                ? 'bg-primary text-black'
                                : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Calculate Button */}
              <motion.button
                onClick={() => setShowResults(true)}
                disabled={!allAnswered}
                className={`w-full mt-6 py-4 rounded-xl font-semibold text-lg transition-all ${
                  allAnswered
                    ? 'bg-primary text-black hover:bg-primary/90'
                    : 'bg-zinc-800 text-gray-500 cursor-not-allowed'
                }`}
                whileHover={allAnswered ? { scale: 1.02 } : {}}
                whileTap={allAnswered ? { scale: 0.98 } : {}}
              >
                Calculate My Fitness Age
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Results Card */}
              <div className={`bg-gradient-to-br ${status?.bg} to-zinc-900/50 rounded-2xl p-8 border border-zinc-800 text-center`}>
                <p className="text-gray-400 mb-2">Your Fitness Age</p>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-6xl font-bold text-white">{fitnessAge}</p>
                    <p className="text-gray-500 text-sm">years old</p>
                  </div>
                </div>

                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${status?.color} bg-black/30`}>
                  {status && <status.icon className="w-5 h-5" />}
                  <span className="font-medium">{status?.text}</span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-black/30 rounded-xl p-4">
                    <p className="text-gray-400 text-sm">Actual Age</p>
                    <p className="text-2xl font-bold text-white">{actualAge}</p>
                  </div>
                  <div className="bg-black/30 rounded-xl p-4">
                    <p className="text-gray-400 text-sm">Difference</p>
                    <p className={`text-2xl font-bold ${ageDifference <= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {ageDifference > 0 ? '+' : ''}{ageDifference} years
                    </p>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
                <h3 className="text-white font-semibold mb-4">Tips to Lower Your Fitness Age</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-gray-400 text-sm">
                    <Heart className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <span>Aim for 150+ minutes of moderate cardio per week</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-400 text-sm">
                    <Dumbbell className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <span>Include strength training 2-3 times per week</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-400 text-sm">
                    <Moon className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <span>Prioritize 7-8 hours of quality sleep</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-400 text-sm">
                    <Apple className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                    <span>Focus on whole foods and reduce processed foods</span>
                  </li>
                </ul>
              </div>

              {/* Retake Button */}
              <button
                onClick={() => {
                  setShowResults(false);
                  setAnswers({});
                }}
                className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-all"
              >
                Retake Assessment
              </button>
            </motion.div>
          )}
        </div>

        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-primary/20 rounded-tl-3xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-primary/20 rounded-br-3xl" />
      </motion.div>
    </section>
  );
}
