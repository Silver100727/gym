import { motion } from 'framer-motion';
import { Users, Award, Calendar, TrendingUp, Zap, Clock } from 'lucide-react';
import { scaleUp, staggerContainer } from '../animations/variants';

const stats = [
  { number: '10,000+', label: 'Active Members', icon: Users, suffix: 'Happy Clients' },
  { number: '50+', label: 'Expert Trainers', icon: Award, suffix: 'Certified Professionals' },
  { number: '15', label: 'Years Experience', icon: Calendar, suffix: 'Industry Leading' },
  { number: '95%', label: 'Success Rate', icon: TrendingUp, suffix: 'Goals Achieved' },
  { number: '100+', label: 'Classes Weekly', icon: Zap, suffix: 'Diverse Options' },
  { number: '24/7', label: 'Gym Access', icon: Clock, suffix: 'Always Available' }
];

export default function StatsSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={scaleUp}>
              <stat.icon className="w-10 h-10 text-primary mx-auto mb-3" />
              <div className="text-4xl font-heading font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-1">
                {stat.number}
              </div>
              <div className="text-white font-semibold text-sm mb-1">{stat.label}</div>
              <div className="text-gray-light text-xs">{stat.suffix}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
