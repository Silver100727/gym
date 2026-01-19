import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import PageLayout from '../layouts/PageLayout';
import { fadeUp, staggerContainer } from '../animations/variants';

const testimonials = [
  {
    id: 1,
    name: 'Jennifer Martinez',
    role: 'Lost 45 lbs in 6 months',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    rating: 5,
    text: "PowerFit completely changed my life. The trainers are incredibly supportive, and the community keeps me motivated. I've never felt stronger or more confident!",
  },
  {
    id: 2,
    name: 'Robert Kim',
    role: 'Gained 20 lbs of muscle',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    rating: 5,
    text: "The strength training program here is top-notch. Mike's coaching helped me break through plateaus I'd been stuck at for years. Highly recommend!",
  },
  {
    id: 3,
    name: 'Amanda Foster',
    role: 'Marathon runner',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    rating: 5,
    text: "I joined for the cardio classes and stayed for everything else. The variety of programs keeps my training fresh and the results speak for themselves.",
  },
  {
    id: 4,
    name: 'David Thompson',
    role: 'Business executive',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    rating: 5,
    text: "As a busy professional, I appreciate the 24/7 access and flexible scheduling. The staff always remembers my name - it feels like a second home.",
  },
  {
    id: 5,
    name: 'Sarah Chen',
    role: 'Yoga enthusiast',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop',
    rating: 5,
    text: "David's yoga classes are transformative. I came for stress relief and found so much more - improved flexibility, better sleep, and a peaceful mind.",
  },
  {
    id: 6,
    name: 'Marcus Johnson',
    role: 'CrossFit competitor',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    rating: 5,
    text: "The CrossFit community here is unmatched. Everyone pushes each other to be better. I've competed in 3 competitions since joining and placed in all of them!",
  },
];

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${
            i < rating ? 'text-primary fill-primary' : 'text-gray-light'
          }`}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      let next = prev + newDirection;
      if (next < 0) next = testimonials.length - 1;
      if (next >= testimonials.length) next = 0;
      return next;
    });
  };

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=1920&q=80"
            alt="Happy members"
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
            Success Stories
          </motion.span>
          <motion.h1
            className="text-5xl sm:text-6xl font-heading font-bold text-white mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            What Our Members Say
          </motion.h1>
          <motion.p
            className="text-gray-light text-lg mt-6 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Real stories from real members who have transformed their lives at
            PowerFit.
          </motion.p>
        </div>
      </section>

      {/* Featured Testimonial Slider */}
      <section className="py-24 bg-dark-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Quote Icon */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <Quote className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Slider */}
            <div className="bg-dark-lighter rounded-lg p-8 md:p-12 pt-16 relative overflow-hidden">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="text-center"
                >
                  <p className="text-xl md:text-2xl text-white leading-relaxed mb-8">
                    "{currentTestimonial.text}"
                  </p>
                  <div className="flex flex-col items-center">
                    <img
                      src={currentTestimonial.image}
                      alt={currentTestimonial.name}
                      className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-primary"
                    />
                    <StarRating rating={currentTestimonial.rating} />
                    <h4 className="text-lg font-heading font-semibold text-white mt-3">
                      {currentTestimonial.name}
                    </h4>
                    <p className="text-primary text-sm">{currentTestimonial.role}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="absolute top-1/2 left-4 right-4 transform -translate-y-1/2 flex justify-between pointer-events-none">
                <button
                  onClick={() => paginate(-1)}
                  className="w-12 h-12 rounded-full bg-dark flex items-center justify-center text-white hover:bg-primary transition-colors duration-300 pointer-events-auto"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => paginate(1)}
                  className="w-12 h-12 rounded-full bg-dark flex items-center justify-center text-white hover:bg-primary transition-colors duration-300 pointer-events-auto"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Dots */}
              <div className="flex items-center justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setDirection(index > currentIndex ? 1 : -1);
                      setCurrentIndex(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'w-8 bg-primary'
                        : 'bg-gray-light hover:bg-white'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Testimonials Grid */}
      <section className="py-24 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.h2
              className="text-4xl font-heading font-bold text-white"
              variants={fadeUp}
            >
              More Success Stories
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                className="bg-dark-lighter rounded-lg p-6 border border-white/5"
                variants={fadeUp}
              >
                <StarRating rating={testimonial.rating} />
                <p className="text-gray-light mt-4 mb-6">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-primary text-sm">{testimonial.role}</p>
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
