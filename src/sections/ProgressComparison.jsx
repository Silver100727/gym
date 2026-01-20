import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftRight,
  TrendingUp,
  Calendar,
  Scale,
  Dumbbell,
  Target,
  ChevronLeft,
  ChevronRight,
  Flame
} from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

// Sample transformation data
const TRANSFORMATIONS = [
  {
    id: 1,
    name: 'MICHAEL R.',
    duration: '12 weeks',
    program: 'Body Recomposition',
    beforeImage: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=500&fit=crop&crop=center',
    afterImage: 'https://images.unsplash.com/photo-1583454155184-870a1f63be09?w=400&h=500&fit=crop&crop=center',
    stats: {
      weightBefore: 95,
      weightAfter: 82,
      bodyFatBefore: 28,
      bodyFatAfter: 15,
      muscleBefore: 68,
      muscleAfter: 70,
    },
    milestones: [
      { week: 1, event: 'Started program' },
      { week: 4, event: 'Lost first 5kg' },
      { week: 8, event: 'Visible abs' },
      { week: 12, event: 'Goal achieved!' },
    ],
    quote: "The trainers at JEFIT transformed not just my body, but my entire mindset about fitness."
  },
  {
    id: 2,
    name: 'SARAH K.',
    duration: '16 weeks',
    program: 'Strength & Tone',
    beforeImage: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=500&fit=crop&crop=center',
    afterImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=500&fit=crop&crop=center',
    stats: {
      weightBefore: 72,
      weightAfter: 65,
      bodyFatBefore: 32,
      bodyFatAfter: 22,
      muscleBefore: 49,
      muscleAfter: 51,
    },
    milestones: [
      { week: 1, event: 'First training session' },
      { week: 6, event: 'Completed first 5K' },
      { week: 10, event: 'Dress size down' },
      { week: 16, event: 'Strongest ever!' },
    ],
    quote: "I never thought I could feel this confident and strong. Best decision I ever made!"
  },
  {
    id: 3,
    name: 'JAMES T.',
    duration: '20 weeks',
    program: 'Muscle Building',
    beforeImage: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=500&fit=crop&crop=center',
    afterImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=500&fit=crop&crop=center',
    stats: {
      weightBefore: 68,
      weightAfter: 78,
      bodyFatBefore: 18,
      bodyFatAfter: 12,
      muscleBefore: 56,
      muscleAfter: 68,
    },
    milestones: [
      { week: 1, event: 'Baseline assessment' },
      { week: 5, event: 'First strength PR' },
      { week: 12, event: 'Gained 5kg muscle' },
      { week: 20, event: 'Competition ready' },
    ],
    quote: "From skinny to strong - the coaches knew exactly how to help me gain quality mass."
  },
];

// Before/After Slider Component
function ComparisonSlider({ beforeImage, afterImage }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e) => {
    if (isDragging.current) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e) => {
    handleMove(e.touches[0].clientX);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/5] overflow-hidden cursor-ew-resize select-none"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    >
      {/* After image (background) */}
      <div className="absolute inset-0">
        <img
          src={afterImage}
          alt="After"
          className="w-full h-full object-cover"
          draggable="false"
        />
        <div className="absolute bottom-4 right-4 px-3 py-1 bg-green-500 text-white text-xs font-mono font-bold">
          AFTER
        </div>
      </div>

      {/* Before image (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImage}
          alt="Before"
          className="w-full h-full object-cover"
          style={{ width: `${containerRef.current?.offsetWidth || 400}px` }}
          draggable="false"
        />
        <div className="absolute bottom-4 left-4 px-3 py-1 bg-white/20 backdrop-blur text-white text-xs font-mono font-bold">
          BEFORE
        </div>
      </div>

      {/* Slider line */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        {/* Slider handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center">
          <ArrowLeftRight className="w-6 h-6 text-dark" />
        </div>
      </div>

      {/* Instructions overlay */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: sliderPosition === 50 ? 1 : 0 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="bg-black/50 backdrop-blur-sm px-4 py-2 text-white text-sm font-mono">
          DRAG TO COMPARE
        </div>
      </motion.div>
    </div>
  );
}

// Stats comparison component
function StatsComparison({ stats }) {
  const statItems = [
    {
      label: 'Weight',
      before: stats.weightBefore,
      after: stats.weightAfter,
      unit: 'kg',
      icon: Scale,
      color: stats.weightAfter < stats.weightBefore ? '#22c55e' : '#f97316'
    },
    {
      label: 'Body Fat',
      before: stats.bodyFatBefore,
      after: stats.bodyFatAfter,
      unit: '%',
      icon: Flame,
      color: '#ef4444'
    },
    {
      label: 'Muscle Mass',
      before: stats.muscleBefore,
      after: stats.muscleAfter,
      unit: 'kg',
      icon: Dumbbell,
      color: '#3b82f6'
    },
  ];

  return (
    <div className="space-y-4">
      {statItems.map((stat, idx) => {
        const change = stat.after - stat.before;
        const changePercent = ((change / stat.before) * 100).toFixed(1);
        const Icon = stat.icon;

        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white/5 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" style={{ color: stat.color }} />
                <span className="text-white/70 text-sm">{stat.label}</span>
              </div>
              <span
                className="font-mono text-sm font-bold"
                style={{ color: stat.color }}
              >
                {change > 0 ? '+' : ''}{change} {stat.unit} ({change > 0 ? '+' : ''}{changePercent}%)
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="font-mono text-lg text-white/50">{stat.before}</p>
                <p className="text-[10px] text-white/30 uppercase">Before</p>
              </div>
              <div className="flex-1 h-2 bg-white/10 relative overflow-hidden">
                <motion.div
                  className="absolute left-0 top-0 h-full"
                  style={{ backgroundColor: stat.color }}
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1, delay: 0.5 + idx * 0.2 }}
                />
              </div>
              <div className="text-center">
                <p className="font-mono text-lg text-white font-bold">{stat.after}</p>
                <p className="text-[10px] text-white/30 uppercase">After</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// Timeline component
function Timeline({ milestones, duration }) {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/10" />

      <div className="space-y-4">
        {milestones.map((milestone, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.15 }}
            className="flex items-start gap-4 pl-0"
          >
            <div className="relative z-10 w-8 h-8 bg-primary flex items-center justify-center flex-shrink-0">
              <span className="font-mono text-xs text-white font-bold">
                {milestone.week}
              </span>
            </div>
            <div className="pt-1">
              <p className="text-white text-sm font-bold">{milestone.event}</p>
              <p className="text-white/50 text-xs font-mono">Week {milestone.week}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function ProgressComparison() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentTransformation = TRANSFORMATIONS[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? TRANSFORMATIONS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === TRANSFORMATIONS.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="relative py-24 bg-darker overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary font-mono text-sm mb-6">
              <TrendingUp className="w-4 h-4" />
              REAL RESULTS
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-black text-white mb-4">
              TRANSFORMATION{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-primary">
                STORIES
              </span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Drag the slider to see incredible before and after transformations from our members.
            </p>
          </motion.div>

          {/* Main content */}
          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTransformation.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid lg:grid-cols-2 gap-8"
              >
                {/* Left - Comparison slider */}
                <div className="relative">
                  <div className="relative bg-dark/50 border border-white/10 p-4">
                    <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-primary/30" />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-primary/30" />

                    <ComparisonSlider
                      beforeImage={currentTransformation.beforeImage}
                      afterImage={currentTransformation.afterImage}
                    />

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-4">
                      <motion.button
                        onClick={handlePrev}
                        className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ChevronLeft className="w-5 h-5 text-white" />
                      </motion.button>

                      <div className="flex items-center gap-2">
                        {TRANSFORMATIONS.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              idx === currentIndex ? 'bg-primary w-6' : 'bg-white/30'
                            }`}
                          />
                        ))}
                      </div>

                      <motion.button
                        onClick={handleNext}
                        className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ChevronRight className="w-5 h-5 text-white" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Right - Stats and info */}
                <div className="space-y-6">
                  {/* Member info */}
                  <div className="bg-dark/50 border border-white/10 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-heading font-bold text-2xl text-white">
                          {currentTransformation.name}
                        </h3>
                        <p className="text-primary font-mono text-sm">
                          {currentTransformation.program}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="font-mono text-sm text-primary">
                          {currentTransformation.duration}
                        </span>
                      </div>
                    </div>

                    {/* Quote */}
                    <blockquote className="text-white/70 italic border-l-2 border-primary pl-4">
                      "{currentTransformation.quote}"
                    </blockquote>
                  </div>

                  {/* Stats comparison */}
                  <div className="bg-dark/50 border border-white/10 p-6">
                    <h4 className="font-heading font-bold text-white mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      RESULTS BREAKDOWN
                    </h4>
                    <StatsComparison stats={currentTransformation.stats} />
                  </div>

                  {/* Timeline */}
                  <div className="bg-dark/50 border border-white/10 p-6">
                    <h4 className="font-heading font-bold text-white mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      JOURNEY MILESTONES
                    </h4>
                    <Timeline
                      milestones={currentTransformation.milestones}
                      duration={currentTransformation.duration}
                    />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-12"
            >
              <p className="text-white/50 mb-4">Ready to start your transformation?</p>
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-primary text-white font-heading font-bold"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                START YOUR JOURNEY
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
