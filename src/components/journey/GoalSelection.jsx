import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { GOALS } from '@/data/goals';
import GoalCard from './GoalCard';
import { staggerContainer, fadeUp } from '@/animations/variants';

export default function GoalSelection({ onSelect, selectedGoal }) {
  return (
    <motion.div
      key="goal-selection"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      {/* Header */}
      <motion.div
        className="text-center mb-12"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeUp} className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Target className="w-5 h-5 text-primary" />
          </div>
        </motion.div>
        <motion.h2
          variants={fadeUp}
          className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4"
        >
          What's Your Fitness Goal?
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="text-gray-light max-w-xl mx-auto"
        >
          Select the goal that best matches what you want to achieve. We'll recommend
          the perfect programs for your journey.
        </motion.p>
      </motion.div>

      {/* Goals Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {GOALS.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onSelect={onSelect}
            isSelected={selectedGoal === goal.id}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
