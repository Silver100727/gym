import { motion } from 'framer-motion';
import PageLayout from '../layouts/PageLayout';
import Hero from '../sections/Hero';
import CountdownTimer from '../sections/CountdownTimer';
import ProgramsSection from '../sections/ProgramsSection';
import ClassSchedule from '../sections/ClassSchedule';
import FeaturesSection from '../sections/FeaturesSection';
import StatsSection from '../sections/StatsSection';
import BMICalculator from '../sections/BMICalculator';
import MuscleExplorer from '../sections/MuscleExplorer';
import WorkoutGenerator from '../sections/WorkoutGenerator';
import CalorieBurnVisualizer from '../sections/CalorieBurnVisualizer';
import WaterIntakeTracker from '../sections/WaterIntakeTracker';
import FitnessQuiz from '../sections/FitnessQuiz';
import MacroCalculator from '../sections/MacroCalculator';
import HeartRateZones from '../sections/HeartRateZones';
import OneRepMaxCalculator from '../sections/OneRepMaxCalculator';
import BodyFatEstimator from '../sections/BodyFatEstimator';
import StretchingRoutine from '../sections/StretchingRoutine';
import ProgressComparison from '../sections/ProgressComparison';
import TrainersPreview from '../sections/TrainersPreview';
import TestimonialsSection from '../sections/TestimonialsSection';
import TransformationGallery from '../sections/TransformationGallery';
import MembershipBenefits from '../sections/MembershipBenefits';
import FAQSection from '../sections/FAQSection';
import CTASection from '../sections/CTASection';
import { sectionReveal } from '../animations/variants';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// Section stacking configuration for parallax overlay effect
const sections = [
  { Component: Hero, zIndex: 10, sticky: false },
  { Component: CountdownTimer, zIndex: 15, sticky: false },
  { Component: ProgramsSection, zIndex: 20, sticky: false },
  { Component: ClassSchedule, zIndex: 25, sticky: false },
  { Component: FeaturesSection, zIndex: 30, sticky: false },
  { Component: StatsSection, zIndex: 40, sticky: false },
  { Component: BMICalculator, zIndex: 45, sticky: false },
  { Component: MuscleExplorer, zIndex: 47, sticky: false },
  { Component: WorkoutGenerator, zIndex: 48, sticky: false },
  { Component: CalorieBurnVisualizer, zIndex: 49, sticky: false },
  { Component: WaterIntakeTracker, zIndex: 49, sticky: false },
  { Component: FitnessQuiz, zIndex: 49, sticky: false },
  { Component: MacroCalculator, zIndex: 49, sticky: false },
  { Component: HeartRateZones, zIndex: 49, sticky: false },
  { Component: OneRepMaxCalculator, zIndex: 49, sticky: false },
  { Component: BodyFatEstimator, zIndex: 49, sticky: false },
  { Component: StretchingRoutine, zIndex: 49, sticky: false },
  { Component: ProgressComparison, zIndex: 49, sticky: false },
  { Component: TrainersPreview, zIndex: 50, sticky: false },
  { Component: TestimonialsSection, zIndex: 60, sticky: false },
  { Component: TransformationGallery, zIndex: 70, sticky: false },
  { Component: MembershipBenefits, zIndex: 80, sticky: false },
  { Component: FAQSection, zIndex: 90, sticky: false },
  { Component: CTASection, zIndex: 100, sticky: false },
];

export default function Home() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <PageLayout>
      <div className="relative">
        {sections.map(({ Component, zIndex, sticky }, idx) => (
          <motion.div
            key={idx}
            className={sticky ? 'sticky top-20' : 'relative'}
            style={{ zIndex }}
            variants={prefersReducedMotion ? undefined : sectionReveal}
            initial={prefersReducedMotion ? undefined : "hidden"}
            whileInView={prefersReducedMotion ? undefined : "visible"}
            viewport={{ once: false, amount: 0.1 }}
          >
            <Component />
          </motion.div>
        ))}
      </div>
    </PageLayout>
  );
}
