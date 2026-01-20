import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { fadeUp, staggerContainer, imageHover } from '../animations/variants';
import { useReducedMotion } from '@/hooks/useReducedMotion';

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

function GalleryImage({ image, index }) {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Staggered parallax speeds for masonry-like effect
  const speeds = [35, -25, 30, -35];
  const speed = speeds[index % speeds.length];

  const yValue = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [speed, -speed]
  );
  const y = useSpring(yValue, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      ref={ref}
      className="group relative aspect-square overflow-hidden rounded-xl"
      variants={fadeUp}
      initial="rest"
      whileHover="hover"
      style={{ y }}
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
  );
}

export default function TransformationGallery() {
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
    prefersReducedMotion ? [0, 0] : [20, -20]
  );

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 lg:py-24 bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          style={{ y: headerY }}
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
            <GalleryImage key={idx} image={image} index={idx} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
