import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Users, Award, Calendar, TrendingUp, Zap, Clock } from 'lucide-react';
import { scaleUp, staggerContainer } from '../animations/variants';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const stats = [
  { number: '10,000+', label: 'Active Members', icon: Users, suffix: 'Happy Clients' },
  { number: '50+', label: 'Expert Trainers', icon: Award, suffix: 'Certified Professionals' },
  { number: '15', label: 'Years Experience', icon: Calendar, suffix: 'Industry Leading' },
  { number: '95%', label: 'Success Rate', icon: TrendingUp, suffix: 'Goals Achieved' },
  { number: '100+', label: 'Classes Weekly', icon: Zap, suffix: 'Diverse Options' },
  { number: '24/7', label: 'Gym Access', icon: Clock, suffix: 'Always Available' }
];

export default function StatsSection() {
  const sectionRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Section scales up as it enters view
  const scale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    prefersReducedMotion ? [1, 1, 1, 1] : [0.95, 1, 1, 0.95]
  );

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    prefersReducedMotion ? [1, 1, 1, 1] : [0.7, 1, 1, 0.7]
  );

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 lg:py-24 bg-dark overflow-hidden">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{
          scale,
          opacity,
          willChange: prefersReducedMotion ? 'auto' : 'transform, opacity'
        }}
      >
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={scaleUp}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <stat.icon className="w-10 h-10 text-primary mx-auto mb-3" />
              <div className="text-4xl font-heading font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-1">
                {stat.number}
              </div>
              <div className="text-white font-semibold text-sm mb-1">{stat.label}</div>
              <div className="text-gray-light text-xs">{stat.suffix}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
