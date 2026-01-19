import PageLayout from '../layouts/PageLayout';
import Hero from '../sections/Hero';
import ProgramsSection from '../sections/ProgramsSection';
import FeaturesSection from '../sections/FeaturesSection';
import StatsSection from '../sections/StatsSection';
import TrainersPreview from '../sections/TrainersPreview';
import TestimonialsSection from '../sections/TestimonialsSection';
import TransformationGallery from '../sections/TransformationGallery';
import MembershipBenefits from '../sections/MembershipBenefits';
import FAQSection from '../sections/FAQSection';
import CTASection from '../sections/CTASection';

export default function Home() {
  return (
    <PageLayout>
      <Hero />
      <ProgramsSection />
      <FeaturesSection />
      <StatsSection />
      <TrainersPreview />
      <TestimonialsSection />
      <TransformationGallery />
      <MembershipBenefits />
      <FAQSection />
      <CTASection />
    </PageLayout>
  );
}
