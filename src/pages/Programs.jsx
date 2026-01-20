import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageLayout from '../layouts/PageLayout';
import { fadeUp, staggerContainer } from '../animations/variants';
import { Button } from '@/components/ui/button';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

const programs = [
  {
    title: 'STRENGTH',
    subtitle: 'TRAINING',
    description: 'Build raw power. Forge unbreakable discipline.',
    duration: '60 MIN',
    level: 'ALL LEVELS',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&h=600&fit=crop',
  },
  {
    title: 'CARDIO',
    subtitle: 'ENDURANCE',
    description: 'Burn limits. Build unstoppable stamina.',
    duration: '45 MIN',
    level: 'BEGINNER+',
    image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&h=600&fit=crop',
  },
  {
    title: 'CROSSFIT',
    subtitle: 'FUNCTIONAL',
    description: 'Challenge everything. Master the unknown.',
    duration: '60 MIN',
    level: 'INTERMEDIATE',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&h=600&fit=crop',
  },
  {
    title: 'YOGA',
    subtitle: 'RECOVERY',
    description: 'Find stillness. Unlock flexibility.',
    duration: '75 MIN',
    level: 'ALL LEVELS',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
  },
  {
    title: 'HIIT',
    subtitle: 'INTENSITY',
    description: 'Maximum burn. Minimum time.',
    duration: '30 MIN',
    level: 'INTERMEDIATE',
    image: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=800&h=600&fit=crop',
  },
  {
    title: 'PERSONAL',
    subtitle: 'TRAINING',
    description: 'Your goals. Your coach. Your transformation.',
    duration: 'CUSTOM',
    level: 'ALL LEVELS',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop',
  },
];

export default function Programs() {
  useSmoothScroll({ duration: 1.4 });

  return (
    <PageLayout>
      {/* Hero Section - Minimal */}
      <section className="relative pt-32 pb-20 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary font-mono text-sm tracking-widest">[ ALL PROGRAMS ]</span>
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-heading font-black text-white mt-4 leading-[0.9]">
              CHOOSE YOUR<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">DISCIPLINE</span>
            </h1>
            <p className="text-white/50 text-xl mt-8 max-w-xl">
              Six paths to transformation. Pick one. Master it. Evolve.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Programs - Full Width Cards */}
      <section className="bg-dark">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
        >
          {programs.map((program, idx) => (
            <motion.div
              key={program.title}
              variants={fadeUp}
              className="group relative"
            >
              <div className={`flex flex-col ${idx % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
                {/* Image Side */}
                <div className="lg:w-1/2 h-[50vh] lg:h-[70vh] relative overflow-hidden">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent lg:hidden" />
                  <div className={`absolute inset-0 hidden lg:block ${
                    idx % 2 === 1
                      ? 'bg-gradient-to-l from-dark via-dark/50 to-transparent'
                      : 'bg-gradient-to-r from-dark via-dark/50 to-transparent'
                  }`} />

                  {/* Number watermark */}
                  <span className="absolute top-8 left-8 font-mono text-white/10 text-9xl font-black select-none">
                    0{idx + 1}
                  </span>
                </div>

                {/* Content Side */}
                <div className="lg:w-1/2 flex items-center relative">
                  <div className={`w-full px-6 lg:px-16 py-12 lg:py-0 ${
                    idx % 2 === 1 ? 'lg:pr-24' : 'lg:pl-24'
                  }`}>
                    {/* Mobile number */}
                    <span className="lg:hidden font-mono text-primary/30 text-sm tracking-widest mb-4 block">
                      0{idx + 1}
                    </span>

                    {/* Title */}
                    <div className="mb-6">
                      <h2 className="text-5xl lg:text-7xl font-heading font-black text-white leading-none group-hover:text-primary transition-colors duration-300">
                        {program.title}
                      </h2>
                      <span className="text-white/30 text-sm lg:text-base font-medium tracking-[0.3em] mt-2 block">
                        {program.subtitle}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-white/50 text-lg lg:text-xl mb-8 max-w-md">
                      {program.description}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-8 mb-8">
                      <div>
                        <span className="text-white/30 text-xs font-mono tracking-widest block mb-1">DURATION</span>
                        <span className="text-white font-heading font-bold text-lg">{program.duration}</span>
                      </div>
                      <div className="w-px h-10 bg-white/10" />
                      <div>
                        <span className="text-white/30 text-xs font-mono tracking-widest block mb-1">LEVEL</span>
                        <span className="text-white font-heading font-bold text-lg">{program.level}</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <Button size="lg" className="group/btn">
                      <span>JOIN THIS PROGRAM</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-px bg-white/5" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 bg-dark-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-mono text-sm tracking-widest">[ NOT SURE? ]</span>
            <h2 className="text-4xl lg:text-5xl font-heading font-black text-white mt-4">
              GET A FREE CONSULTATION
            </h2>
            <p className="text-white/50 text-lg mt-4 mb-8">
              Our experts will help you find the perfect program for your goals.
            </p>
            <Button size="xl" asChild>
              <Link to="/contact">
                BOOK FREE SESSION
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
