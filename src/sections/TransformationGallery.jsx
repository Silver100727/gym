import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, imageHover } from '../animations/variants';

const images = [
  {
    type: 'gym',
    url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=600&fit=crop',
    caption: 'State-of-the-art Training Area'
  },
  {
    type: 'gym',
    url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop',
    caption: 'Premium Cardio Equipment'
  },
  {
    type: 'gym',
    url: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop',
    caption: 'Group Training Sessions'
  },
  {
    type: 'gym',
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    caption: 'Professional Trainers'
  }
];

export default function TransformationGallery() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-dark">
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
            Our Facility
          </motion.span>
          <motion.h2
            className="text-4xl sm:text-5xl font-heading font-bold text-white mt-2"
            variants={fadeUp}
          >
            Experience PowerFit
          </motion.h2>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {images.map((image, idx) => (
            <motion.div
              key={idx}
              className="group relative aspect-square overflow-hidden rounded-xl"
              variants={fadeUp}
              initial="rest"
              whileHover="hover"
            >
              <motion.img
                src={image.url}
                alt={image.caption}
                className="w-full h-full object-cover"
                variants={imageHover}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white font-semibold">{image.caption}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
