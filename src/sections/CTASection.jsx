import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';
import { Button } from '@/components/ui/button';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function CTASection() {
  const sectionRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Background parallax - moves slower
  const backgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ['0%', '0%'] : ['0%', '40%']
  );

  // Content parallax - moves opposite for depth
  const contentYValue = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [50, -30]
  );
  const contentY = useSpring(contentYValue, { stiffness: 100, damping: 30 });

  // Trust badges float at different speed
  const badgesY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [30, -50]
  );

  return (
    <section
      ref={sectionRef}
      className="py-16 sm:py-20 lg:py-24 relative overflow-hidden"
    >
      {/* Background with Parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: backgroundY, willChange: prefersReducedMotion ? 'auto' : 'transform' }}
      >
        <img
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1920&q=80"
          alt="Gym workout"
          className="w-full h-[130%] object-cover"
        />
        <div className="absolute inset-0 bg-dark/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
      </motion.div>

      {/* Content with Parallax */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ y: contentY, willChange: prefersReducedMotion ? 'auto' : 'transform' }}
      >
        <motion.div
          className="max-w-3xl mx-auto text-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.span
            className="text-primary text-sm font-semibold uppercase tracking-wider"
            variants={fadeUp}
          >
            Ready to Start?
          </motion.span>
          <motion.h2
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white mt-4"
            variants={fadeUp}
          >
            Start Your Fitness Journey{' '}
            <span className="text-primary">Today</span>
          </motion.h2>
          <motion.p
            className="text-gray-light text-lg mt-6 mb-10"
            variants={fadeUp}
          >
            Join our community of fitness enthusiasts and transform your life.
            Get access to world-class trainers, state-of-the-art equipment, and
            a supportive environment.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            variants={fadeUp}
          >
            <Link to="/pricing">
              <Button size="lg" className="gap-2">
                Get Started Now
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="secondary" size="lg">
                Contact Us
              </Button>
            </Link>
          </motion.div>

          {/* Trust Badges with separate parallax */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10"
            variants={fadeUp}
            style={{ y: badgesY }}
          >
            <div className="text-center">
              <div className="text-2xl font-heading font-bold text-white">24/7</div>
              <div className="text-gray-light text-sm">Access</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-heading font-bold text-white">Free</div>
              <div className="text-gray-light text-sm">Trial Week</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-heading font-bold text-white">No</div>
              <div className="text-gray-light text-sm">Long-term Contract</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-heading font-bold text-white">100%</div>
              <div className="text-gray-light text-sm">Satisfaction</div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
