import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Dumbbell, Heart, Flame, Leaf, ArrowRight } from 'lucide-react';
import { fadeUp, staggerContainer, cardHover } from '../animations/variants';

const programs = [
  {
    icon: Dumbbell,
    title: 'Strength Training',
    description: 'Build muscle and increase strength with our comprehensive weight training programs.',
    color: 'from-red-500 to-orange-500',
  },
  {
    icon: Heart,
    title: 'Cardio',
    description: 'Improve cardiovascular health and burn calories with high-energy cardio sessions.',
    color: 'from-pink-500 to-red-500',
  },
  {
    icon: Flame,
    title: 'CrossFit',
    description: 'Challenge yourself with intense, varied workouts that test your limits.',
    color: 'from-orange-500 to-yellow-500',
  },
  {
    icon: Leaf,
    title: 'Yoga',
    description: 'Find balance and flexibility while improving mental clarity and reducing stress.',
    color: 'from-green-500 to-teal-500',
  },
];

export default function ProgramsSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-dark-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.span
            className="text-primary text-sm font-semibold uppercase tracking-wider"
            variants={fadeUp}
          >
            Our Programs
          </motion.span>
          <motion.h2
            className="text-4xl sm:text-5xl font-heading font-bold text-white mt-2"
            variants={fadeUp}
          >
            Train Your Way
          </motion.h2>
          <motion.p
            className="text-gray-light mt-4 max-w-2xl mx-auto"
            variants={fadeUp}
          >
            Choose from our diverse range of programs designed to help you achieve
            your specific fitness goals.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {programs.map((program) => (
            <motion.div
              key={program.title}
              className="group relative bg-dark-lighter rounded-lg p-6 border border-white/5 overflow-hidden"
              variants={fadeUp}
              initial="rest"
              whileHover="hover"
              animate="rest"
            >
              <motion.div variants={cardHover}>
                {/* Gradient Background on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${program.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />

                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-lg bg-gradient-to-br ${program.color} flex items-center justify-center mb-6`}
                >
                  <program.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-heading font-semibold text-white mb-3">
                  {program.title}
                </h3>
                <p className="text-gray-light text-sm mb-4">
                  {program.description}
                </p>

                {/* Link */}
                <Link
                  to="/programs"
                  className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:gap-3 transition-all duration-300"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link
            to="/programs"
            className="inline-flex items-center gap-2 text-white border-2 border-white/20 px-8 py-3 rounded-sm hover:border-primary hover:text-primary transition-all duration-300"
          >
            View All Programs
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
