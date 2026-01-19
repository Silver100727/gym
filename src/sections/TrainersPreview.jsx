import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, ArrowRight } from 'lucide-react';
import { fadeUp, staggerContainer, imageHover } from '../animations/variants';
import { Badge } from '@/components/ui/badge';

const trainers = [
  {
    name: 'Mike Johnson',
    specialty: 'Strength & Conditioning',
    image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&h=500&fit=crop',
    instagram: '#',
    twitter: '#',
    rating: 5.0,
    clients: '200+',
    experience: '10 Years'
  },
  {
    name: 'Sarah Williams',
    specialty: 'HIIT & CrossFit',
    image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=500&fit=crop',
    instagram: '#',
    twitter: '#',
    rating: 4.9,
    clients: '150+',
    experience: '8 Years'
  },
  {
    name: 'David Chen',
    specialty: 'Yoga & Flexibility',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=500&fit=crop',
    instagram: '#',
    twitter: '#',
    rating: 5.0,
    clients: '180+',
    experience: '12 Years'
  },
];

export default function TrainersPreview() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div>
            <motion.span
              className="text-primary text-sm font-semibold uppercase tracking-wider"
              variants={fadeUp}
            >
              Expert Team
            </motion.span>
            <motion.h2
              className="text-4xl sm:text-5xl font-heading font-bold text-white mt-2"
              variants={fadeUp}
            >
              Meet Our Trainers
            </motion.h2>
            <motion.p
              className="text-gray-light mt-4 max-w-xl"
              variants={fadeUp}
            >
              Our certified trainers bring years of experience and passion to help
              you achieve your fitness goals.
            </motion.p>
          </div>
          <motion.div variants={fadeUp} className="mt-6 lg:mt-0">
            <Link
              to="/trainers"
              className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all duration-300"
            >
              View All Trainers
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {trainers.map((trainer) => (
            <motion.div
              key={trainer.name}
              className="group relative overflow-hidden rounded-lg"
              variants={fadeUp}
            >
              {/* Image */}
              <motion.div
                className="aspect-[4/5] overflow-hidden"
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
              </motion.div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent opacity-80 group-hover:opacity-70 transition-opacity" />

              {/* Expertise Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <Badge className="bg-dark/80 backdrop-blur-sm border-primary/30">
                  ⭐ {trainer.rating}
                </Badge>
                <Badge variant="secondary" className="bg-dark/80 backdrop-blur-sm">
                  {trainer.experience}
                </Badge>
              </div>

              {/* Content at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-heading font-bold text-white mb-1">
                  {trainer.name}
                </h3>
                <p className="text-primary mb-2">{trainer.specialty}</p>
                <p className="text-sm text-gray-light mb-4">{trainer.clients} Clients</p>

                {/* Social Links */}
                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <a
                    href={trainer.instagram}
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary transition-colors duration-300"
                    aria-label={`${trainer.name} Instagram`}
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href={trainer.twitter}
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary transition-colors duration-300"
                    aria-label={`${trainer.name} Twitter`}
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
