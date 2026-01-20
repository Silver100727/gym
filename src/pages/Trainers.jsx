import { motion } from 'framer-motion';
import { Instagram, Twitter, Linkedin, Award } from 'lucide-react';
import PageLayout from '../layouts/PageLayout';
import { fadeUp, staggerContainer, imageHover } from '../animations/variants';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

const trainers = [
  {
    name: 'Mike Johnson',
    specialty: 'Strength & Conditioning',
    bio: 'With over 10 years of experience, Mike specializes in building functional strength and helping clients achieve their body composition goals.',
    certifications: ['NSCA-CSCS', 'USA Weightlifting', 'Precision Nutrition'],
    image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&h=500&fit=crop',
    socials: { instagram: '#', twitter: '#', linkedin: '#' },
  },
  {
    name: 'Sarah Williams',
    specialty: 'HIIT & CrossFit',
    bio: 'Sarah brings energy and expertise to every session. Her high-intensity workouts are designed to push limits while maintaining proper form.',
    certifications: ['CrossFit L3', 'NASM-CPT', 'TRX Certified'],
    image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=500&fit=crop',
    socials: { instagram: '#', twitter: '#', linkedin: '#' },
  },
  {
    name: 'David Chen',
    specialty: 'Yoga & Flexibility',
    bio: 'David combines traditional yoga practices with modern flexibility training to help clients improve mobility and reduce stress.',
    certifications: ['RYT-500', 'FRC Mobility Specialist', 'Meditation Teacher'],
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=500&fit=crop',
    socials: { instagram: '#', twitter: '#', linkedin: '#' },
  },
  {
    name: 'Emily Rodriguez',
    specialty: 'Nutrition & Weight Loss',
    bio: 'Emily takes a holistic approach to fitness, combining exercise science with nutrition coaching to deliver sustainable results.',
    certifications: ['Precision Nutrition L2', 'ACE-CPT', 'Behavior Change Specialist'],
    image: 'https://images.unsplash.com/photo-1609899464926-209b4f1f6f14?w=400&h=500&fit=crop',
    socials: { instagram: '#', twitter: '#', linkedin: '#' },
  },
  {
    name: 'James Thompson',
    specialty: 'Boxing & MMA',
    bio: 'Former competitive fighter turned trainer, James brings discipline and technique to help clients build confidence and combat skills.',
    certifications: ['USA Boxing Coach', 'MMA Conditioning', 'First Aid/CPR'],
    image: 'https://images.unsplash.com/photo-1583468982228-19f19164aee2?w=400&h=500&fit=crop',
    socials: { instagram: '#', twitter: '#', linkedin: '#' },
  },
  {
    name: 'Lisa Park',
    specialty: 'Senior Fitness',
    bio: 'Lisa specializes in helping older adults maintain strength, balance, and independence through safe, effective exercise programs.',
    certifications: ['ACE Senior Fitness', 'Silver Sneakers', 'Fall Prevention'],
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=500&fit=crop',
    socials: { instagram: '#', twitter: '#', linkedin: '#' },
  },
];

export default function Trainers() {
  useSmoothScroll({ duration: 1.4 });

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1571388208497-71bedc66e932?w=1920&q=80"
            alt="Trainers"
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
            Our Team
          </motion.span>
          <motion.h1
            className="text-5xl sm:text-6xl font-heading font-bold text-white mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Expert Trainers
          </motion.h1>
          <motion.p
            className="text-gray-light text-lg mt-6 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Meet our team of certified fitness professionals dedicated to helping
            you achieve your goals.
          </motion.p>
        </div>
      </section>

      {/* Trainers Grid */}
      <section className="py-24 bg-dark-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {trainers.map((trainer) => (
              <motion.div
                key={trainer.name}
                className="group bg-dark-lighter rounded-lg overflow-hidden border border-white/5"
                variants={fadeUp}
              >
                {/* Image */}
                <motion.div
                  className="aspect-[4/5] overflow-hidden relative"
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                >
                  <motion.img
                    src={trainer.image}
                    alt={trainer.name}
                    className="w-full h-full object-cover"
                    variants={imageHover}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-lighter via-transparent to-transparent" />

                  {/* Social Links Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <a
                      href={trainer.socials.instagram}
                      className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-primary transition-colors duration-300"
                      aria-label={`${trainer.name} Instagram`}
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a
                      href={trainer.socials.twitter}
                      className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-primary transition-colors duration-300"
                      aria-label={`${trainer.name} Twitter`}
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a
                      href={trainer.socials.linkedin}
                      className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-primary transition-colors duration-300"
                      aria-label={`${trainer.name} LinkedIn`}
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </motion.div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-heading font-semibold text-white">
                    {trainer.name}
                  </h3>
                  <p className="text-primary text-sm mt-1">{trainer.specialty}</p>
                  <p className="text-gray-light text-sm mt-4">{trainer.bio}</p>

                  {/* Certifications */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-gray-light text-xs mb-2">
                      <Award className="w-4 h-4 text-primary" />
                      <span>Certifications</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trainer.certifications.map((cert) => (
                        <span
                          key={cert}
                          className="px-2 py-1 bg-dark rounded text-xs text-gray-light"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
