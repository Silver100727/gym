import { motion } from 'framer-motion';
import { Dumbbell, Heart, Flame, Leaf, Clock, Users, Target, Zap } from 'lucide-react';
import PageLayout from '../layouts/PageLayout';
import { fadeUp, staggerContainer, cardHover } from '../animations/variants';

const programs = [
  {
    icon: Dumbbell,
    title: 'Strength Training',
    description: 'Build muscle mass, increase strength, and improve your overall physique with our comprehensive strength training programs.',
    features: ['Personal coaching', 'Custom workout plans', 'Progress tracking', 'Nutrition guidance'],
    schedule: 'Mon, Wed, Fri',
    duration: '60 min',
    level: 'All Levels',
    color: 'from-red-500 to-orange-500',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=400&fit=crop',
  },
  {
    icon: Heart,
    title: 'Cardio',
    description: 'Boost your cardiovascular health, burn calories, and increase endurance with our high-energy cardio sessions.',
    features: ['Heart rate monitoring', 'Interval training', 'Group sessions', 'Endurance building'],
    schedule: 'Tue, Thu, Sat',
    duration: '45 min',
    level: 'Beginner-Friendly',
    color: 'from-pink-500 to-red-500',
    image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&h=400&fit=crop',
  },
  {
    icon: Flame,
    title: 'CrossFit',
    description: 'Push your limits with high-intensity functional movements that challenge your strength, speed, and agility.',
    features: ['WOD challenges', 'Olympic lifting', 'Gymnastics skills', 'Community events'],
    schedule: 'Daily',
    duration: '60 min',
    level: 'Intermediate+',
    color: 'from-orange-500 to-yellow-500',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&h=400&fit=crop',
  },
  {
    icon: Leaf,
    title: 'Yoga',
    description: 'Find balance, improve flexibility, and enhance mental clarity through our relaxing and rejuvenating yoga sessions.',
    features: ['Multiple styles', 'Meditation classes', 'Breathing exercises', 'Stress relief'],
    schedule: 'Mon-Sat',
    duration: '75 min',
    level: 'All Levels',
    color: 'from-green-500 to-teal-500',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop',
  },
  {
    icon: Zap,
    title: 'HIIT',
    description: 'Maximize calorie burn and boost metabolism with our high-intensity interval training sessions.',
    features: ['Fat burning', 'Quick sessions', 'Full body workout', 'Afterburn effect'],
    schedule: 'Mon, Wed, Fri',
    duration: '30 min',
    level: 'Intermediate',
    color: 'from-purple-500 to-pink-500',
    image: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=600&h=400&fit=crop',
  },
  {
    icon: Target,
    title: 'Personal Training',
    description: 'Get one-on-one attention and customized workout plans tailored to your specific goals and needs.',
    features: ['1-on-1 sessions', 'Goal setting', 'Form correction', 'Accountability'],
    schedule: 'Flexible',
    duration: 'Custom',
    level: 'All Levels',
    color: 'from-blue-500 to-cyan-500',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop',
  },
];

export default function Programs() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80"
            alt="Gym"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-dark/80" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            className="text-primary text-sm font-semibold uppercase tracking-wider"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Our Programs
          </motion.span>
          <motion.h1
            className="text-5xl sm:text-6xl font-heading font-bold text-white mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Find Your Perfect Workout
          </motion.h1>
          <motion.p
            className="text-gray-light text-lg mt-6 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            From strength training to yoga, we offer a variety of programs to help
            you achieve your fitness goals.
          </motion.p>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-24 bg-dark-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {programs.map((program) => (
              <motion.div
                key={program.title}
                className="group bg-dark-lighter rounded-lg overflow-hidden border border-white/5"
                variants={fadeUp}
                initial="rest"
                whileHover="hover"
                animate="rest"
              >
                <motion.div variants={cardHover}>
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="md:w-2/5 h-48 md:h-auto overflow-hidden">
                      <img
                        src={program.image}
                        alt={program.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    {/* Content */}
                    <div className="md:w-3/5 p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className={`w-12 h-12 rounded-lg bg-gradient-to-br ${program.color} flex items-center justify-center`}
                        >
                          <program.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-heading font-semibold text-white">
                            {program.title}
                          </h3>
                          <p className="text-primary text-sm">{program.level}</p>
                        </div>
                      </div>

                      <p className="text-gray-light text-sm mb-4">
                        {program.description}
                      </p>

                      {/* Features */}
                      <ul className="grid grid-cols-2 gap-2 mb-4">
                        {program.features.map((feature) => (
                          <li
                            key={feature}
                            className="text-gray-light text-xs flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      {/* Meta */}
                      <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-1.5 text-gray-light text-xs">
                          <Clock className="w-4 h-4 text-primary" />
                          {program.duration}
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-light text-xs">
                          <Users className="w-4 h-4 text-primary" />
                          {program.schedule}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
