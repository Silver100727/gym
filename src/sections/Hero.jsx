import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Play, Users, Award, TrendingUp } from 'lucide-react';
import { fadeUp, staggerContainer, floatingParticle, orbPulse, iconBounce } from '../animations/variants';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-5rem)] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80"
          alt="Gym interior"
          className="w-full h-full object-cover"
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
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
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

          {/* Headline */}
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-7xl font-heading font-bold text-white leading-tight mb-6"
            variants={fadeUp}
          >
            Transform Your Body,{' '}
            <span className="text-primary">Transform Your Life</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg sm:text-xl text-gray-light mb-8 max-w-2xl"
            variants={fadeUp}
          >
            Join thousands of members who have achieved their fitness goals with our
            world-class trainers, cutting-edge equipment, and supportive community.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
            variants={fadeUp}
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

          {/* Enhanced Stats */}
          <motion.div variants={fadeUp} className="mt-16">
            <Separator className="mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: Users, number: '10,000+', label: 'Active Members', color: 'from-blue-500 to-cyan-500' },
                { icon: Award, number: '50+', label: 'Expert Trainers', color: 'from-purple-500 to-pink-500' },
                { icon: TrendingUp, number: '15+', label: 'Years Experience', color: 'from-orange-500 to-red-500' }
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-primary/30 transition-all duration-300 group"
                  whileHover={{ y: -4 }}
                >
                  <motion.div
                    variants={iconBounce}
                    initial="rest"
                    whileHover="hover"
                  >
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} p-2.5 mb-4`}>
                      <stat.icon className="w-full h-full text-white" />
                    </div>
                  </motion.div>
                  <div className="text-4xl font-heading font-bold text-primary mb-1">
                    {stat.number}
                  </div>
                  <div className="text-gray-light text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
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
