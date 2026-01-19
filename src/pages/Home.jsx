import PageLayout from '../layouts/PageLayout';
import Hero from '../sections/Hero';
import ProgramsSection from '../sections/ProgramsSection';
import TrainersPreview from '../sections/TrainersPreview';
import CTASection from '../sections/CTASection';

export default function Home() {
  return (
    <PageLayout>
      <Hero />
      <ProgramsSection />
      <TrainersPreview />
      <CTASection />
    </PageLayout>
  );
}
