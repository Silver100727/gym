import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Heart, Flame, Leaf, ArrowRight } from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const programs = [
  {
    icon: Dumbbell,
    title: 'STRENGTH',
    subtitle: 'TRAINING',
    description: 'Build raw power and muscle mass with progressive overload techniques.',
  },
  {
    icon: Heart,
    title: 'CARDIO',
    subtitle: 'ENDURANCE',
    description: 'Push your limits with high-intensity intervals and steady-state sessions.',
  },
  {
    icon: Flame,
    title: 'CROSSFIT',
    subtitle: 'FUNCTIONAL',
    description: 'Varied workouts that build real-world strength and conditioning.',
  },
  {
    icon: Leaf,
    title: 'YOGA',
    subtitle: 'RECOVERY',
    description: 'Restore balance, improve flexibility, and sharpen mental focus.',
  },
];

function ProgramCard({ program, index }) {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Subtle alternating float
  const speed = index % 2 === 0 ? 15 : -15;

  const yValue = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [speed, -speed]
  );
  const y = useSpring(yValue, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      style={{ y }}
    >
      <Link
        to="/programs"
        className="group block relative"
      >
        <div className="flex items-center border-b border-white/10 py-8 lg:py-10 transition-all duration-500 group-hover:border-primary/50 group-hover:pl-6">
          {/* Number */}
          <div className="hidden sm:block w-24 lg:w-32 shrink-0">
            <span className="font-mono text-white/20 text-sm group-hover:text-primary/50 transition-colors">
              0{index + 1}
            </span>
          </div>

          {/* Icon */}
          <div className="w-12 h-12 lg:w-16 lg:h-16 shrink-0 mr-6 lg:mr-10 flex items-center justify-center border border-white/10 group-hover:border-primary group-hover:bg-primary transition-all duration-300">
            <program.icon className="w-6 h-6 lg:w-8 lg:h-8 text-white/40 group-hover:text-white transition-colors" />
          </div>

          {/* Title */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col lg:flex-row lg:items-baseline lg:gap-4">
              <h3 className="text-2xl sm:text-3xl lg:text-5xl font-heading font-black text-white group-hover:text-primary transition-colors duration-300 tracking-tight">
                {program.title}
              </h3>
              <span className="text-white/30 text-sm lg:text-base font-medium tracking-widest">
                {program.subtitle}
              </span>
            </div>
            <p className="text-white/40 text-sm lg:text-base mt-2 max-w-xl hidden lg:block">
              {program.description}
            </p>
          </div>

          {/* Arrow */}
          <div className="shrink-0 ml-4 lg:ml-8">
            <div className="w-12 h-12 flex items-center justify-center">
              <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6 text-white/20 group-hover:text-primary group-hover:translate-x-2 transition-all duration-300" />
            </div>
          </div>
        </div>

        {/* Hover background fill */}
        <div className="absolute inset-0 bg-primary/5 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 -z-10" />
      </Link>
    </motion.div>
  );
}

export default function ProgramsSection() {
  const sectionRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Header parallax
  const headerY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [30, -30]
  );

  return (
    <section ref={sectionRef} className="py-20 lg:py-32 bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Left aligned, editorial style */}
        <motion.div
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 lg:mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ y: headerY }}
        >
          <div>
            <span className="text-primary font-mono text-sm tracking-widest">[ PROGRAMS ]</span>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-black text-white mt-4 leading-none">
              TRAIN YOUR<br />
              <span className="text-primary">WAY</span>
            </h2>
          </div>
          <p className="text-white/50 max-w-md mt-6 lg:mt-0 text-lg">
            Four disciplines. One goal. Choose your path to transformation.
          </p>
        </motion.div>

        {/* Programs - Stacked horizontal cards */}
        <motion.div
          className="space-y-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {programs.map((program, idx) => (
            <ProgramCard key={program.title} program={program} index={idx} />
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 lg:mt-24 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-white/30 text-sm">
            Not sure where to start? <span className="text-white">Get a free consultation.</span>
          </p>
          <Link
            to="/programs"
            className="group inline-flex items-center gap-4 text-white font-heading font-bold text-lg tracking-wide"
          >
            <span className="group-hover:text-primary transition-colors">VIEW ALL PROGRAMS</span>
            <span className="w-12 h-px bg-white/30 group-hover:w-20 group-hover:bg-primary transition-all duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
