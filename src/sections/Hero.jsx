import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Play, Users, Award, TrendingUp } from 'lucide-react';
import { fadeUp, staggerContainer, floatingParticle, orbPulse } from '../animations/variants';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function Hero() {
  const heroRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // Background moves slower than scroll
  const backgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ['0%', '0%'] : ['0%', '30%']
  );

  // Content fades and scales as you scroll past
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.8],
    prefersReducedMotion ? [1, 1] : [1, 0]
  );
  const contentScale = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [1, 1] : [1, 0.9]
  );

  // Text layers at different speeds for depth
  const headlineY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [0, 100]
  );
  const subtitleY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [0, 150]
  );
  const statsY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [0, 200]
  );

  return (
    <section
      ref={heroRef}
      className="relative min-h-[calc(100vh-5rem)] flex items-center overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: backgroundY, willChange: prefersReducedMotion ? 'auto' : 'transform' }}
      >
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80"
          alt="Gym interior"
          className="w-full h-[120%] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent" />

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 15 }, (_, i) => ({
            id: i,
            size: Math.random() * 200 + 100,
            top: Math.random() * 100,
            left: Math.random() * 100,
            delay: Math.random() * 5,
            duration: Math.random() * 10 + 10
          })).map(p => (
            <motion.div
              key={p.id}
              className="absolute rounded-full bg-primary/10 blur-2xl"
              style={{
                width: p.size,
                height: p.size,
                top: `${p.top}%`,
                left: `${p.left}%`
              }}
              custom={{ duration: p.duration, delay: p.delay }}
              variants={floatingParticle}
              animate="animate"
            />
          ))}

          {/* Gradient Orbs */}
          <motion.div
            className="absolute top-20 right-20 w-96 h-96 bg-gradient-radial from-primary/20 to-transparent rounded-full blur-3xl"
            variants={orbPulse}
            animate="animate"
          />
          <motion.div
            className="absolute bottom-40 left-40 w-64 h-64 bg-gradient-radial from-orange-400/20 to-transparent rounded-full blur-3xl"
            variants={orbPulse}
            animate="animate"
            style={{ animationDelay: '3s' }}
          />
        </div>
      </motion.div>

      {/* Content with Parallax */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32"
        style={{
          opacity: contentOpacity,
          scale: contentScale,
          willChange: prefersReducedMotion ? 'auto' : 'transform, opacity'
        }}
      >
        <motion.div
          className="max-w-3xl"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} className="mb-6">
            <Badge variant="outline" className="gap-2 px-4 py-2 text-sm border-primary/50 bg-primary/20 text-white">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              #1 Rated Gym in the City
            </Badge>
          </motion.div>

          {/* Headline with Parallax */}
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-7xl font-heading font-bold text-white leading-tight mb-6"
            variants={fadeUp}
            style={{ y: headlineY }}
          >
            Transform Your Body,{' '}
            <span className="text-primary">Transform Your Life</span>
          </motion.h1>

          {/* Subtitle with Parallax */}
          <motion.p
            className="text-lg sm:text-xl text-gray-light mb-8 max-w-2xl"
            variants={fadeUp}
            style={{ y: subtitleY }}
          >
            Join thousands of members who have achieved their fitness goals with our
            world-class trainers, cutting-edge equipment, and supportive community.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
            variants={fadeUp}
            style={{ y: subtitleY }}
          >
            <Button size="xl" asChild>
              <Link to="/pricing" className="gap-2">
                Start Your Journey
                <ChevronRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link to="/programs" className="gap-2">
                <Play className="w-5 h-5" />
                View Programs
              </Link>
            </Button>
          </motion.div>

          {/* Stats with Parallax - Bold Industrial Style */}
          <motion.div variants={fadeUp} className="mt-16" style={{ y: statsY }}>
            <div className="flex flex-col sm:flex-row items-stretch">
              {[
                { icon: Users, number: '10K+', label: 'ACTIVE MEMBERS' },
                { icon: Award, number: '50+', label: 'EXPERT TRAINERS' },
                { icon: TrendingUp, number: '15+', label: 'YEARS STRONG' }
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  className="group relative flex-1 py-8 px-6 cursor-default"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {/* Left accent bar */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-primary transition-all duration-300 group-hover:h-full" />

                  {/* Top border for all except first */}
                  {idx > 0 && <div className="absolute left-6 right-6 top-0 h-px bg-white/10 sm:hidden" />}

                  {/* Left divider for desktop */}
                  {idx > 0 && <div className="hidden sm:block absolute left-0 top-4 bottom-4 w-px bg-white/10" />}

                  <div className="flex items-center gap-4">
                    <stat.icon className="w-6 h-6 text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
                    <div>
                      <div className="text-5xl sm:text-6xl font-heading font-black text-white tracking-tight group-hover:text-primary transition-colors duration-300">
                        {stat.number}
                      </div>
                      <div className="text-xs font-medium tracking-[0.2em] text-white/40 mt-1">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        style={{ opacity: contentOpacity }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <motion.div
            className="w-1.5 h-1.5 bg-primary rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
