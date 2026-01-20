import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  RotateCcw,
  Crown,
  Star,
  Zap,
  Check,
  Clock,
  Users,
  Dumbbell,
  Heart,
  Trophy,
} from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

const QUESTIONS = [
  {
    id: 'goal',
    question: "What's your primary fitness goal?",
    icon: Target,
    options: [
      { id: 'weight_loss', label: 'Lose Weight', emoji: '🔥', points: { basic: 1, pro: 2, elite: 1 } },
      { id: 'muscle', label: 'Build Muscle', emoji: '💪', points: { basic: 0, pro: 2, elite: 3 } },
      { id: 'health', label: 'Stay Healthy', emoji: '❤️', points: { basic: 2, pro: 1, elite: 0 } },
      { id: 'performance', label: 'Athletic Performance', emoji: '🏆', points: { basic: 0, pro: 1, elite: 3 } },
    ],
  },
  {
    id: 'experience',
    question: 'How would you describe your fitness experience?',
    icon: Star,
    options: [
      { id: 'beginner', label: 'Complete Beginner', emoji: '🌱', points: { basic: 3, pro: 1, elite: 0 } },
      { id: 'some', label: 'Some Experience', emoji: '📈', points: { basic: 1, pro: 3, elite: 1 } },
      { id: 'experienced', label: 'Very Experienced', emoji: '💎', points: { basic: 0, pro: 1, elite: 3 } },
      { id: 'athlete', label: 'Former/Current Athlete', emoji: '🥇', points: { basic: 0, pro: 0, elite: 3 } },
    ],
  },
  {
    id: 'frequency',
    question: 'How often do you plan to workout?',
    icon: Clock,
    options: [
      { id: '1-2', label: '1-2 times/week', emoji: '🌤️', points: { basic: 3, pro: 1, elite: 0 } },
      { id: '3-4', label: '3-4 times/week', emoji: '⚡', points: { basic: 1, pro: 3, elite: 1 } },
      { id: '5-6', label: '5-6 times/week', emoji: '🔥', points: { basic: 0, pro: 2, elite: 3 } },
      { id: 'daily', label: 'Every day', emoji: '💯', points: { basic: 0, pro: 0, elite: 3 } },
    ],
  },
  {
    id: 'style',
    question: 'What type of workouts interest you most?',
    icon: Dumbbell,
    options: [
      { id: 'cardio', label: 'Cardio & Classes', emoji: '🏃', points: { basic: 2, pro: 2, elite: 1 } },
      { id: 'weights', label: 'Weight Training', emoji: '🏋️', points: { basic: 1, pro: 2, elite: 2 } },
      { id: 'mix', label: 'Mix of Everything', emoji: '🎯', points: { basic: 1, pro: 3, elite: 2 } },
      { id: 'personal', label: 'Personal Training', emoji: '👨‍🏫', points: { basic: 0, pro: 1, elite: 3 } },
    ],
  },
  {
    id: 'social',
    question: 'Do you prefer working out alone or with others?',
    icon: Users,
    options: [
      { id: 'solo', label: 'Solo Workouts', emoji: '🎧', points: { basic: 2, pro: 1, elite: 1 } },
      { id: 'sometimes', label: 'Sometimes with Others', emoji: '🤝', points: { basic: 1, pro: 3, elite: 1 } },
      { id: 'group', label: 'Love Group Classes', emoji: '👥', points: { basic: 1, pro: 3, elite: 2 } },
      { id: 'trainer', label: 'Need a Trainer', emoji: '🎓', points: { basic: 0, pro: 1, elite: 3 } },
    ],
  },
  {
    id: 'commitment',
    question: "What's your commitment level?",
    icon: Heart,
    options: [
      { id: 'casual', label: 'Casual - Just Starting', emoji: '🌊', points: { basic: 3, pro: 1, elite: 0 } },
      { id: 'moderate', label: 'Moderate - Building Habit', emoji: '📊', points: { basic: 1, pro: 3, elite: 1 } },
      { id: 'serious', label: 'Serious - Ready to Commit', emoji: '🎯', points: { basic: 0, pro: 2, elite: 2 } },
      { id: 'all_in', label: 'All In - Transform My Life', emoji: '🚀', points: { basic: 0, pro: 0, elite: 3 } },
    ],
  },
];

const PLANS = {
  basic: {
    id: 'basic',
    name: 'STARTER',
    tagline: 'Perfect for getting started',
    price: 29,
    icon: Star,
    color: '#22c55e',
    features: [
      'Full gym access',
      'Locker room access',
      'Basic equipment',
      'Mobile app access',
    ],
    description: 'Great for beginners who want to explore fitness at their own pace.',
  },
  pro: {
    id: 'pro',
    name: 'PRO',
    tagline: 'Most popular choice',
    price: 59,
    icon: Zap,
    color: '#f97316',
    features: [
      'Everything in Starter',
      'All group classes',
      'Sauna & spa access',
      'Guest passes (2/month)',
      'Nutrition guidance',
    ],
    description: 'Ideal for regular gym-goers who want variety and community.',
  },
  elite: {
    id: 'elite',
    name: 'ELITE',
    tagline: 'Ultimate fitness experience',
    price: 99,
    icon: Crown,
    color: '#8b5cf6',
    features: [
      'Everything in Pro',
      '4 PT sessions/month',
      'Custom meal plans',
      'Recovery zone access',
      'Priority booking',
      'VIP events access',
    ],
    description: 'For dedicated athletes seeking maximum results with expert guidance.',
  },
};

function ProgressBar({ current, total }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <span className="font-mono text-xs text-white/40">
        {current + 1}/{total}
      </span>
      <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-orange-400"
          initial={{ width: 0 }}
          animate={{ width: `${((current + 1) / total) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}

function QuestionCard({ question, selectedAnswer, onSelect }) {
  const Icon = question.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Question */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/20 mb-4">
          <Icon className="w-7 h-7 text-primary" />
        </div>
        <h3 className="text-xl sm:text-2xl font-heading font-bold text-white">
          {question.question}
        </h3>
      </div>

      {/* Options */}
      <div className="grid sm:grid-cols-2 gap-3">
        {question.options.map((option) => (
          <motion.button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={`relative p-5 border text-left transition-all duration-300 ${
              selectedAnswer === option.id
                ? 'border-primary bg-primary/10'
                : 'border-white/10 bg-dark hover:border-white/30'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">{option.emoji}</span>
              <span className={`font-heading font-bold ${
                selectedAnswer === option.id ? 'text-primary' : 'text-white'
              }`}>
                {option.label}
              </span>
            </div>

            {selectedAnswer === option.id && (
              <motion.div
                className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <Check className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

function ResultCard({ plan, isRecommended, onGetStarted }) {
  const Icon = plan.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative border p-6 ${
        isRecommended
          ? 'border-primary bg-primary/5'
          : 'border-white/10 bg-dark'
      }`}
    >
      {isRecommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-xs font-mono tracking-wider">
          RECOMMENDED
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <div
          className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3"
          style={{ backgroundColor: `${plan.color}20` }}
        >
          <Icon className="w-6 h-6" style={{ color: plan.color }} />
        </div>
        <h4 className="text-2xl font-heading font-black text-white">{plan.name}</h4>
        <p className="text-white/40 text-sm">{plan.tagline}</p>
      </div>

      {/* Price */}
      <div className="text-center mb-6">
        <span className="text-4xl font-heading font-black text-white">${plan.price}</span>
        <span className="text-white/40">/month</span>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-6">
        {plan.features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-3 text-white/70 text-sm">
            <Check className="w-4 h-4 text-primary flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <motion.button
        onClick={onGetStarted}
        className={`w-full py-3 font-heading font-bold transition-all ${
          isRecommended
            ? 'bg-primary text-white hover:bg-primary-dark'
            : 'border border-white/20 text-white hover:bg-white/5'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isRecommended ? 'GET STARTED' : 'LEARN MORE'}
      </motion.button>
    </motion.div>
  );
}

function Results({ answers, onReset }) {
  const navigate = useNavigate();

  // Calculate scores
  const scores = { basic: 0, pro: 0, elite: 0 };

  QUESTIONS.forEach((question) => {
    const answer = answers[question.id];
    if (answer) {
      const option = question.options.find(o => o.id === answer);
      if (option) {
        scores.basic += option.points.basic;
        scores.pro += option.points.pro;
        scores.elite += option.points.elite;
      }
    }
  });

  // Find recommended plan
  const recommended = Object.entries(scores).reduce((a, b) =>
    scores[a] > scores[b[0]] ? a : b[0]
  );

  // Sort plans by score
  const sortedPlans = Object.values(PLANS).sort((a, b) => {
    if (a.id === recommended) return -1;
    if (b.id === recommended) return 1;
    return scores[b.id] - scores[a.id];
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary mb-4"
        >
          <Sparkles className="w-4 h-4" />
          <span className="font-mono text-sm">QUIZ COMPLETE!</span>
        </motion.div>
        <h3 className="text-2xl sm:text-3xl font-heading font-black text-white">
          Your Perfect Plan
        </h3>
        <p className="text-white/40 mt-2 max-w-md mx-auto">
          Based on your answers, we recommend the <span className="text-primary font-bold">{PLANS[recommended].name}</span> membership
        </p>
      </div>

      {/* Recommendation explanation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-4 bg-white/5 border border-white/10 text-center"
      >
        <Trophy className="w-6 h-6 text-primary mx-auto mb-2" />
        <p className="text-white/60 text-sm">
          {PLANS[recommended].description}
        </p>
      </motion.div>

      {/* Plan cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {sortedPlans.map((plan, idx) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + idx * 0.1 }}
          >
            <ResultCard
              plan={plan}
              isRecommended={plan.id === recommended}
              onGetStarted={() => navigate('/contact')}
            />
          </motion.div>
        ))}
      </div>

      {/* Reset */}
      <motion.button
        onClick={onReset}
        className="w-full py-3 border border-white/10 text-white/50 hover:text-white hover:border-white/30 font-mono text-sm flex items-center justify-center gap-2 transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <RotateCcw className="w-4 h-4" />
        RETAKE QUIZ
      </motion.button>
    </motion.div>
  );
}

export default function FitnessQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (answerId) => {
    setAnswers({
      ...answers,
      [QUESTIONS[currentQuestion].id]: answerId,
    });
  };

  const handleNext = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  const currentAnswer = answers[QUESTIONS[currentQuestion]?.id];

  return (
    <section className="py-20 lg:py-32 bg-dark-light relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(135deg, white 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Orbs */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center mb-12">
            <span className="font-mono text-primary text-xs tracking-widest">
              [ FIND YOUR FIT ]
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-white mt-4">
              FITNESS
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
                {' '}QUIZ
              </span>
            </h2>
            <p className="text-white/40 mt-4 max-w-xl mx-auto">
              Answer a few questions and we&apos;ll recommend the perfect membership plan for you
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <div className="bg-dark border border-white/10 p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {showResults ? (
                  <Results key="results" answers={answers} onReset={handleReset} />
                ) : (
                  <motion.div key="quiz">
                    <ProgressBar current={currentQuestion} total={QUESTIONS.length} />

                    <AnimatePresence mode="wait">
                      <QuestionCard
                        key={currentQuestion}
                        question={QUESTIONS[currentQuestion]}
                        selectedAnswer={currentAnswer}
                        onSelect={handleAnswer}
                      />
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                      <button
                        onClick={handleBack}
                        disabled={currentQuestion === 0}
                        className={`flex items-center gap-2 px-4 py-2 font-mono text-sm transition-all ${
                          currentQuestion === 0
                            ? 'text-white/20 cursor-not-allowed'
                            : 'text-white/50 hover:text-white'
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        BACK
                      </button>

                      <button
                        onClick={handleNext}
                        disabled={!currentAnswer}
                        className={`flex items-center gap-2 px-6 py-3 font-heading font-bold text-sm transition-all ${
                          currentAnswer
                            ? 'bg-primary text-white hover:bg-primary-dark'
                            : 'bg-white/10 text-white/30 cursor-not-allowed'
                        }`}
                      >
                        {currentQuestion === QUESTIONS.length - 1 ? 'SEE RESULTS' : 'NEXT'}
                        {currentQuestion === QUESTIONS.length - 1 ? (
                          <Sparkles className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
