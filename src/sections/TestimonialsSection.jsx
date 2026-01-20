import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { Star } from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const testimonials = [
  {
    name: 'Jessica Martinez',
    role: 'Weight Loss Success',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    quote: 'PowerFit changed my life. I lost 40 pounds in 6 months and gained confidence I never knew I had. The trainers are incredibly supportive!',
    rating: 5,
    achievement: '-40 lbs'
  },
  {
    name: 'Marcus Thompson',
    role: 'Strength Builder',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    quote: 'Best investment I\'ve ever made. The equipment is top-notch and the community keeps me motivated every single day.',
    rating: 5,
    achievement: '+25 lbs muscle'
  },
  {
    name: 'Emily Chen',
    role: 'Marathon Runner',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    quote: 'From couch to marathon in one year! The trainers created a perfect program that fit my goals and pushed me to succeed.',
    rating: 5,
    achievement: '1st Marathon'
  },
  {
    name: 'David Rodriguez',
    role: 'Fitness Transformation',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    quote: 'The 24/7 access means I can workout on my schedule. No more excuses. The results speak for themselves!',
    rating: 5,
    achievement: '15% body fat'
  }
];

function TestimonialCard({ testimonial, index }) {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Left column floats up, right column floats down
  const isLeftColumn = index % 2 === 0;
  const speed = isLeftColumn ? 25 : -25;

  const yValue = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [speed, -speed]
  );
  const y = useSpring(yValue, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      style={{ y }}
    >
      <Card className="h-full hover:border-primary/30 transition-all duration-300">
        <CardContent className="p-6">
          {/* Rating */}
          <div className="flex gap-1 mb-4">
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-primary text-primary" />
            ))}
          </div>

          {/* Quote */}
          <p className="text-gray-light mb-6 text-lg leading-relaxed">
            "{testimonial.quote}"
          </p>

          {/* Profile */}
          <div className="flex items-center gap-4">
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-primary/30"
            />
            <div className="flex-1">
              <h4 className="text-white font-semibold">{testimonial.name}</h4>
              <p className="text-sm text-gray-light">{testimonial.role}</p>
            </div>
            <Badge className="bg-primary/20 text-primary border-primary/30">
              {testimonial.achievement}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function TestimonialsSection() {
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
    <section ref={sectionRef} className="py-16 sm:py-20 lg:py-24 bg-dark-lighter">
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
            Success Stories
          </motion.span>
          <motion.h2
            className="text-4xl sm:text-5xl font-heading font-bold text-white mt-2"
            variants={fadeUp}
          >
            Real Results, Real People
          </motion.h2>
          <motion.p
            className="text-gray-light mt-4 max-w-2xl mx-auto"
            variants={fadeUp}
          >
            Hear from our members who have transformed their lives at PowerFit.
          </motion.p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
