import { motion } from 'framer-motion';
import { Clock, Users, Dumbbell, Heart, Sparkles, Trophy } from 'lucide-react';
import { fadeUp, staggerContainer, cardHover } from '../animations/variants';

const features = [
  {
    icon: Clock,
    title: '24/7 Access',
    description: 'Train on your schedule with round-the-clock gym access.',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Users,
    title: 'Expert Coaching',
    description: 'Certified trainers provide personalized guidance and support.',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: Dumbbell,
    title: 'Premium Equipment',
    description: 'State-of-the-art machines and free weights for all fitness levels.',
    gradient: 'from-orange-500 to-red-500'
  },
  {
    icon: Heart,
    title: 'Community Support',
    description: 'Join a motivating community of like-minded fitness enthusiasts.',
    gradient: 'from-red-500 to-pink-500'
  },
  {
    icon: Sparkles,
    title: 'Clean Facilities',
    description: 'Spotless equipment and locker rooms maintained daily.',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    icon: Trophy,
    title: 'Results Tracking',
    description: 'Monitor your progress with our advanced fitness tracking system.',
    gradient: 'from-yellow-500 to-orange-500'
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-dark-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
            Why Choose PowerFit
          </motion.span>
          <motion.h2
            className="text-4xl sm:text-5xl font-heading font-bold text-white mt-2"
            variants={fadeUp}
          >
            Everything You Need to Succeed
          </motion.h2>
          <motion.p
            className="text-gray-light mt-4 max-w-2xl mx-auto"
            variants={fadeUp}
          >
            We provide world-class facilities, expert guidance, and a supportive community to help you achieve your fitness goals.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              className="bg-dark-lighter border border-white/5 rounded-xl p-6 hover:border-primary/30 transition-all duration-300"
              variants={fadeUp}
              whileHover={cardHover.hover}
            >
              <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${feature.gradient} p-3 mb-4`}>
                <feature.icon className="w-full h-full text-white" />
              </div>
              <h3 className="text-xl font-heading font-bold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-light text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
