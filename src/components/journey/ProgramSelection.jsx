import { motion } from 'framer-motion';
import { Dumbbell, ArrowLeft } from 'lucide-react';
import { GOALS, getGoalById } from '@/data/goals';
import { getProgramsByIds } from '@/data/programs';
import { Button } from '@/components/ui/button';
import ProgramCard from './ProgramCard';
import { staggerContainer, fadeUp } from '@/animations/variants';

export default function ProgramSelection({ goalId, onSelect, onBack, selectedProgram }) {
  const goal = getGoalById(goalId);
  const programs = goal ? getProgramsByIds(goal.programs) : [];

  if (!goal) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-light">Please select a goal first.</p>
        <Button onClick={onBack} variant="outline" className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      key="program-selection"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-6 text-gray-light hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Change Goal
        </Button>
      </motion.div>

      {/* Header */}
      <motion.div
        className="text-center mb-12"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeUp} className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-primary" />
          </div>
        </motion.div>
        <motion.h2
          variants={fadeUp}
          className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4"
        >
          Recommended Programs
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="text-gray-light max-w-xl mx-auto"
        >
          Based on your goal of <span className="text-primary font-semibold">{goal.title}</span>,
          we recommend these programs to help you achieve results.
        </motion.p>
      </motion.div>

      {/* Programs Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {programs.map((program) => (
          <ProgramCard
            key={program.id}
            program={program}
            onSelect={onSelect}
            isSelected={selectedProgram === program.id}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
