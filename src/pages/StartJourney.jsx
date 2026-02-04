import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import PageLayout from '../layouts/PageLayout';
import ProgressIndicator from '@/components/journey/ProgressIndicator';
import GoalSelection from '@/components/journey/GoalSelection';
import ProgramSelection from '@/components/journey/ProgramSelection';
import LeadCaptureForm from '@/components/journey/LeadCaptureForm';
import Confirmation from '@/components/journey/Confirmation';
import { useLeads } from '@/hooks/useLeads';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { fadeUp, staggerContainer } from '@/animations/variants';

export default function StartJourney() {
  useSmoothScroll({ duration: 1.4 });
  const [searchParams] = useSearchParams();
  const { addLead } = useLeads();

  const [currentStep, setCurrentStep] = useState(1);
  const [funnelData, setFunnelData] = useState({
    selectedGoal: null,
    selectedProgram: null
  });

  // Handle pre-selected program from URL query param
  useEffect(() => {
    const programParam = searchParams.get('program');
    if (programParam) {
      setFunnelData(prev => ({ ...prev, selectedProgram: programParam }));
      // If program is pre-selected, we still need to select a goal first
      // or we could auto-detect the goal based on the program
    }
  }, [searchParams]);

  const handleGoalSelect = (goalId) => {
    setFunnelData(prev => ({ ...prev, selectedGoal: goalId }));
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProgramSelect = (programId) => {
    setFunnelData(prev => ({ ...prev, selectedProgram: programId }));
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSubmit = (formData) => {
    addLead(formData);
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = (step) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80"
            alt="Gym"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-dark/90" />
          <div className="absolute inset-0 bg-gradient-to-b from-dark via-transparent to-dark" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white mb-4"
            >
              Start Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                Journey
              </span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-gray-light text-lg max-w-2xl mx-auto"
            >
              Let us help you find the perfect fitness program. Just a few quick steps
              and you'll be on your way to transforming your life.
            </motion.p>
          </motion.div>

          {/* Progress Indicator */}
          <ProgressIndicator currentStep={currentStep} />

          {/* Step Content */}
          <div className="mt-8">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <GoalSelection
                  onSelect={handleGoalSelect}
                  selectedGoal={funnelData.selectedGoal}
                />
              )}
              {currentStep === 2 && (
                <ProgramSelection
                  goalId={funnelData.selectedGoal}
                  onSelect={handleProgramSelect}
                  onBack={() => handleBack(1)}
                  selectedProgram={funnelData.selectedProgram}
                />
              )}
              {currentStep === 3 && (
                <LeadCaptureForm
                  goalId={funnelData.selectedGoal}
                  programId={funnelData.selectedProgram}
                  onSubmit={handleFormSubmit}
                  onBack={() => handleBack(2)}
                />
              )}
              {currentStep === 4 && (
                <Confirmation />
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
