import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Zap, ArrowRight, Clock, Percent } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fadeUp, staggerContainer } from '../animations/variants';
import { Button } from '@/components/ui/button';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// Set target date - 7 days from now (you can adjust this)
const getTargetDate = () => {
  const target = new Date();
  target.setDate(target.getDate() + 7);
  target.setHours(23, 59, 59, 999);
  return target;
};

const TARGET_DATE = getTargetDate();

function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = targetDate - new Date();
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      expired: false
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

function TimeBlock({ value, label, index }) {
  const [prevValue, setPrevValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== prevValue) {
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setPrevValue(value);
        setIsFlipping(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [value, prevValue]);

  const displayValue = String(value).padStart(2, '0');

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-2 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Main display */}
        <div className="relative bg-dark border-2 border-white/10 group-hover:border-primary/50 transition-colors duration-300">
          {/* Top half */}
          <div className="relative overflow-hidden">
            <div className="px-4 sm:px-8 py-4 sm:py-6 flex justify-center">
              <span
                className={`font-heading text-5xl sm:text-7xl lg:text-8xl font-black tabular-nums transition-all duration-150 ${
                  isFlipping ? 'text-primary scale-110' : 'text-white'
                }`}
              >
                {displayValue}
              </span>
            </div>
            {/* Scan line effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
          </div>

          {/* Divider line */}
          <div className="absolute left-0 right-0 top-1/2 h-px bg-white/10" />

          {/* Tick marks on sides */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-4 bg-white/10" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-4 bg-white/10" />
        </div>

        {/* Label */}
        <div className="mt-3 text-center">
          <span className="font-mono text-xs tracking-[0.2em] text-white/30">{label}</span>
        </div>
      </div>
    </motion.div>
  );
}

function Separator() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-2 sm:px-4 pb-8">
      <motion.div
        className="w-2 h-2 bg-primary rounded-full"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      <motion.div
        className="w-2 h-2 bg-primary rounded-full"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
      />
    </div>
  );
}

export default function CountdownTimer() {
  const timeLeft = useCountdown(TARGET_DATE);
  const sectionRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    prefersReducedMotion ? [1, 1, 1] : [0.95, 1, 0.95]
  );

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    prefersReducedMotion ? [1, 1, 1, 1] : [0.5, 1, 1, 0.5]
  );

  if (timeLeft.expired) {
    return null;
  }

  return (
    <section ref={sectionRef} className="py-20 lg:py-32 bg-dark relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0">
        {/* Radial gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `
            linear-gradient(rgba(249, 115, 22, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(249, 115, 22, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px'
        }} />

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-primary/20" />
        <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-primary/20" />
        <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-primary/20" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-primary/20" />
      </div>

      <motion.div
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative"
        style={{ scale, opacity }}
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Urgency badge */}
          <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="font-mono text-xs tracking-widest text-red-500">LIMITED TIME OFFER</span>
          </motion.div>

          {/* Main headline */}
          <motion.div variants={fadeUp}>
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-heading font-black text-white leading-tight">
              NEW YEAR
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-red-500">
                50% OFF
              </span>
            </h2>
            <p className="text-white/40 mt-4 text-lg max-w-md mx-auto">
              First 100 members get lifetime discount. Don't miss out.
            </p>
          </motion.div>

          {/* Countdown display */}
          <motion.div
            variants={fadeUp}
            className="mt-12 flex items-center justify-center"
          >
            <div className="flex items-stretch">
              <TimeBlock value={timeLeft.days} label="DAYS" index={0} />
              <Separator />
              <TimeBlock value={timeLeft.hours} label="HOURS" index={1} />
              <Separator />
              <TimeBlock value={timeLeft.minutes} label="MINS" index={2} />
              <Separator />
              <TimeBlock value={timeLeft.seconds} label="SECS" index={3} />
            </div>
          </motion.div>

          {/* Offer details */}
          <motion.div variants={fadeUp} className="mt-12 flex flex-wrap items-center justify-center gap-6">
            {[
              { icon: Percent, text: 'No signup fees' },
              { icon: Zap, text: 'Instant access' },
              { icon: Clock, text: 'Cancel anytime' }
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-white/50">
                <Icon className="w-4 h-4 text-primary" />
                <span className="font-mono text-sm">{text}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeUp} className="mt-10">
            <Button size="xl" asChild className="group">
              <Link to="/pricing" className="gap-3">
                <span>CLAIM YOUR SPOT</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <p className="mt-4 text-white/20 font-mono text-xs">
              <span className="text-primary">73</span> / 100 spots remaining
            </p>
          </motion.div>

          {/* Bottom marquee */}
          <motion.div
            variants={fadeUp}
            className="mt-16 py-4 border-y border-white/5 overflow-hidden"
          >
            <motion.div
              className="flex whitespace-nowrap"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              {[...Array(10)].map((_, i) => (
                <span key={i} className="mx-8 font-heading text-4xl font-black text-white/[0.03]">
                  TRANSFORM NOW • GET FIT • JOIN TODAY • TRANSFORM NOW • GET FIT • JOIN TODAY •
                </span>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
