import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Clock, Users, Flame, Dumbbell, Heart, Zap, Wind } from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const CLASS_TYPES = {
  strength: { icon: Dumbbell, color: '#f97316', label: 'STRENGTH' },
  cardio: { icon: Flame, color: '#ef4444', label: 'CARDIO' },
  yoga: { icon: Wind, color: '#8b5cf6', label: 'YOGA' },
  hiit: { icon: Zap, color: '#22c55e', label: 'HIIT' },
  boxing: { icon: Heart, color: '#ec4899', label: 'BOXING' }
};

const SCHEDULE = [
  { day: 0, time: '06:00', name: 'DAWN LIFT', type: 'strength', trainer: 'MARCUS', spots: 4, duration: 60 },
  { day: 0, time: '09:00', name: 'POWER YOGA', type: 'yoga', trainer: 'ELENA', spots: 8, duration: 75 },
  { day: 0, time: '12:00', name: 'LUNCH BURN', type: 'hiit', trainer: 'JAKE', spots: 2, duration: 45 },
  { day: 0, time: '18:00', name: 'BEAST MODE', type: 'strength', trainer: 'MARCUS', spots: 0, duration: 60 },
  { day: 0, time: '19:30', name: 'CARDIO BLAST', type: 'cardio', trainer: 'SARAH', spots: 6, duration: 45 },
  { day: 1, time: '06:30', name: 'MORNING FLOW', type: 'yoga', trainer: 'ELENA', spots: 12, duration: 60 },
  { day: 1, time: '10:00', name: 'BOX & BURN', type: 'boxing', trainer: 'MIKE', spots: 3, duration: 60 },
  { day: 1, time: '17:00', name: 'AFTER WORK HIIT', type: 'hiit', trainer: 'JAKE', spots: 5, duration: 30 },
  { day: 1, time: '19:00', name: 'HEAVY METAL', type: 'strength', trainer: 'MARCUS', spots: 1, duration: 75 },
  { day: 2, time: '07:00', name: 'CARDIO SUNRISE', type: 'cardio', trainer: 'SARAH', spots: 10, duration: 45 },
  { day: 2, time: '11:00', name: 'POWER HOUR', type: 'strength', trainer: 'MARCUS', spots: 7, duration: 60 },
  { day: 2, time: '18:30', name: 'EVENING YOGA', type: 'yoga', trainer: 'ELENA', spots: 15, duration: 90 },
  { day: 3, time: '06:00', name: 'COMBAT TRAINING', type: 'boxing', trainer: 'MIKE', spots: 4, duration: 60 },
  { day: 3, time: '12:30', name: 'EXPRESS HIIT', type: 'hiit', trainer: 'JAKE', spots: 0, duration: 30 },
  { day: 3, time: '18:00', name: 'STRENGTH CIRCUIT', type: 'strength', trainer: 'MARCUS', spots: 6, duration: 60 },
  { day: 4, time: '07:00', name: 'FLEX FRIDAY', type: 'yoga', trainer: 'ELENA', spots: 9, duration: 60 },
  { day: 4, time: '17:30', name: 'FRIDAY BURN', type: 'cardio', trainer: 'SARAH', spots: 3, duration: 45 },
  { day: 4, time: '19:00', name: 'KNOCKOUT', type: 'boxing', trainer: 'MIKE', spots: 2, duration: 60 },
  { day: 5, time: '08:00', name: 'SATURDAY SWEAT', type: 'hiit', trainer: 'JAKE', spots: 8, duration: 60 },
  { day: 5, time: '10:00', name: 'POWER LIFT', type: 'strength', trainer: 'MARCUS', spots: 5, duration: 90 },
  { day: 5, time: '14:00', name: 'WEEKEND WARRIOR', type: 'boxing', trainer: 'MIKE', spots: 4, duration: 60 },
  { day: 6, time: '09:00', name: 'SUNDAY RESTORE', type: 'yoga', trainer: 'ELENA', spots: 20, duration: 90 },
  { day: 6, time: '11:00', name: 'LIGHT CARDIO', type: 'cardio', trainer: 'SARAH', spots: 12, duration: 45 },
];

function ClassCard({ classItem, index }) {
  const typeInfo = CLASS_TYPES[classItem.type];
  const Icon = typeInfo.icon;
  const isFull = classItem.spots === 0;

  return (
    <motion.div
      className={`group relative bg-dark border transition-all duration-300 overflow-hidden ${
        isFull
          ? 'border-white/5 opacity-50'
          : 'border-white/10 hover:border-primary/50'
      }`}
      variants={fadeUp}
      custom={index}
      whileHover={isFull ? {} : { y: -4, scale: 1.01 }}
    >
      {/* Time strip */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300"
        style={{ backgroundColor: isFull ? '#333' : typeInfo.color }}
      />

      <div className="p-5 pl-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Time and duration */}
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-2xl font-bold text-white tabular-nums">
                {classItem.time}
              </span>
              <span className="font-mono text-xs text-white/30">
                {classItem.duration}MIN
              </span>
            </div>

            {/* Class name */}
            <h4 className="text-lg font-heading font-bold text-white group-hover:text-primary transition-colors truncate">
              {classItem.name}
            </h4>

            {/* Trainer */}
            <p className="text-white/40 text-sm mt-1">
              with <span className="text-white/60">{classItem.trainer}</span>
            </p>
          </div>

          {/* Type badge and spots */}
          <div className="flex flex-col items-end gap-2">
            <div
              className="p-2 rounded-sm"
              style={{ backgroundColor: `${typeInfo.color}20` }}
            >
              <Icon className="w-5 h-5" style={{ color: typeInfo.color }} />
            </div>

            {isFull ? (
              <span className="font-mono text-xs text-red-500 tracking-wider">FULL</span>
            ) : (
              <div className="flex items-center gap-1 text-white/40">
                <Users className="w-3 h-3" />
                <span className="font-mono text-xs">{classItem.spots}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hover glow */}
      {!isFull && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
          style={{ backgroundColor: typeInfo.color }}
        />
      )}
    </motion.div>
  );
}

export default function ClassSchedule() {
  const [activeDay, setActiveDay] = useState(0);
  const [activeFilter, setActiveFilter] = useState(null);
  const sectionRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  const bgX = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ['0%', '0%'] : ['-5%', '5%']
  );

  const filteredClasses = SCHEDULE
    .filter(c => c.day === activeDay)
    .filter(c => !activeFilter || c.type === activeFilter)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <section ref={sectionRef} className="py-20 lg:py-32 bg-dark-light relative overflow-hidden">
      {/* Diagonal lines background */}
      <motion.div
        className="absolute inset-0 opacity-[0.02]"
        style={{ x: bgX }}
      >
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute h-[200%] w-px bg-white -rotate-45"
            style={{ left: `${i * 8}%`, top: '-50%' }}
          />
        ))}
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <div>
              <span className="font-mono text-primary text-xs tracking-widest">[ WEEKLY SCHEDULE ]</span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-white mt-4">
                CLASS<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                  TIMETABLE
                </span>
              </h2>
            </div>

            {/* Live indicator */}
            <div className="flex items-center gap-3 bg-dark px-4 py-3 border border-white/10">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
              </span>
              <span className="font-mono text-xs text-white/60">
                {SCHEDULE.filter(c => c.spots > 0).length} CLASSES AVAILABLE
              </span>
            </div>
          </motion.div>

          {/* Day selector - horizontal scroll on mobile */}
          <motion.div variants={fadeUp} className="mb-8">
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-none">
              {DAYS.map((day, idx) => {
                const classCount = SCHEDULE.filter(c => c.day === idx).length;
                const isActive = activeDay === idx;

                return (
                  <button
                    key={day}
                    onClick={() => setActiveDay(idx)}
                    className={`relative flex-shrink-0 px-6 py-4 border transition-all duration-300 ${
                      isActive
                        ? 'bg-primary border-primary text-white'
                        : 'bg-transparent border-white/10 text-white/50 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    <span className="font-heading font-bold text-lg">{day}</span>
                    <span className={`block font-mono text-xs mt-1 ${
                      isActive ? 'text-white/70' : 'text-white/30'
                    }`}>
                      {classCount} CLASSES
                    </span>

                    {isActive && (
                      <motion.div
                        className="absolute -bottom-px left-0 right-0 h-0.5 bg-white"
                        layoutId="dayIndicator"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Type filters */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveFilter(null)}
              className={`px-4 py-2 font-mono text-xs tracking-wider transition-all ${
                !activeFilter
                  ? 'bg-white text-dark'
                  : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              ALL
            </button>
            {Object.entries(CLASS_TYPES).map(([key, { label, color }]) => (
              <button
                key={key}
                onClick={() => setActiveFilter(activeFilter === key ? null : key)}
                className={`px-4 py-2 font-mono text-xs tracking-wider transition-all flex items-center gap-2 ${
                  activeFilter === key
                    ? 'text-white'
                    : 'bg-white/5 text-white/50 hover:bg-white/10'
                }`}
                style={activeFilter === key ? { backgroundColor: color } : {}}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
                {label}
              </button>
            ))}
          </motion.div>

          {/* Classes grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeDay}-${activeFilter}`}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05,
                    when: "beforeChildren"
                  }
                }
              }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filteredClasses.length > 0 ? (
                filteredClasses.map((classItem, idx) => (
                  <ClassCard key={`${classItem.day}-${classItem.time}-${classItem.name}`} classItem={classItem} index={idx} />
                ))
              ) : (
                <motion.div
                  className="col-span-full py-16 text-center"
                  variants={fadeUp}
                >
                  <Clock className="w-12 h-12 text-white/10 mx-auto mb-4" />
                  <p className="text-white/30 font-mono text-sm">
                    No classes match your filter
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Bottom info */}
          <motion.div variants={fadeUp} className="mt-12 pt-8 border-t border-white/5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-white/30 text-sm">
                Book your spot through the <span className="text-primary">mobile app</span> or at reception
              </p>
              <div className="flex items-center gap-6">
                {Object.entries(CLASS_TYPES).map(([key, { color, label }]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
                    <span className="font-mono text-xs text-white/40">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
