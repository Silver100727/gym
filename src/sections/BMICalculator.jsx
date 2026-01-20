import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Scale, Ruler, ArrowRight, RotateCcw } from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const BMI_ZONES = [
  { max: 18.5, label: 'UNDERWEIGHT', color: '#3b82f6', message: 'Time to bulk up' },
  { max: 24.9, label: 'OPTIMAL', color: '#22c55e', message: 'Peak performance zone' },
  { max: 29.9, label: 'OVERWEIGHT', color: '#f97316', message: 'Let\'s cut some fat' },
  { max: 100, label: 'OBESE', color: '#ef4444', message: 'Transformation starts now' }
];

function getZone(bmi) {
  return BMI_ZONES.find(z => bmi <= z.max) || BMI_ZONES[3];
}

function BMIGauge({ value, isVisible }) {
  const clampedValue = Math.min(Math.max(value, 10), 40);
  const rotation = ((clampedValue - 10) / 30) * 180 - 90;
  const zone = getZone(value);

  return (
    <div className="relative w-64 h-32 mx-auto">
      {/* Gauge background arc */}
      <svg viewBox="0 0 200 100" className="w-full h-full">
        {/* Track segments */}
        <path
          d="M 20 100 A 80 80 0 0 1 50 31"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M 55 26 A 80 80 0 0 1 100 20"
          fill="none"
          stroke="#22c55e"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M 105 20 A 80 80 0 0 1 145 26"
          fill="none"
          stroke="#f97316"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M 150 31 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#ef4444"
          strokeWidth="12"
          strokeLinecap="round"
        />
      </svg>

      {/* Needle */}
      <motion.div
        className="absolute bottom-0 left-1/2 origin-bottom"
        initial={{ rotate: -90 }}
        animate={{ rotate: isVisible ? rotation : -90 }}
        transition={{ type: 'spring', stiffness: 60, damping: 15, delay: 0.3 }}
      >
        <div className="relative -ml-0.5">
          <div className="w-1 h-20 bg-white rounded-full" />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full" />
        </div>
      </motion.div>

      {/* Center value */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center">
        <motion.div
          className="text-4xl font-heading font-black"
          style={{ color: zone.color }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.5 }}
          transition={{ delay: 0.5 }}
        >
          {value.toFixed(1)}
        </motion.div>
      </div>
    </div>
  );
}

function InputDial({ label, value, onChange, min, max, unit, icon: Icon }) {
  const [isDragging, setIsDragging] = useState(false);
  const [holdingBtn, setHoldingBtn] = useState(null);
  const dialRef = useRef(null);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const valueRef = useRef(value);

  // Keep valueRef in sync
  valueRef.current = value;

  const handlePointerDown = (e) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !dialRef.current) return;
    const rect = dialRef.current.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;
    const deltaY = (centerY - e.clientY) / 2;
    const newValue = Math.min(max, Math.max(min, value + deltaY * 0.5));
    onChange(Math.round(newValue * 10) / 10);
  };

  const handlePointerUp = () => setIsDragging(false);

  const stopHold = () => {
    setHoldingBtn(null);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    intervalRef.current = null;
    timeoutRef.current = null;
  };

  const startHold = (direction) => {
    setHoldingBtn(direction);
    const step = direction === 'up' ? 1 : -1;

    // Initial change
    onChange(Math.min(max, Math.max(min, valueRef.current + step)));

    // Start repeating after 400ms delay, then accelerate
    timeoutRef.current = setTimeout(() => {
      let speed = 150;
      const tick = () => {
        onChange(Math.min(max, Math.max(min, valueRef.current + step)));
        speed = Math.max(50, speed - 10); // Accelerate
        intervalRef.current = setTimeout(tick, speed);
      };
      intervalRef.current = setTimeout(tick, speed);
    }, 400);
  };

  return (
    <div className="relative group">
      <div
        ref={dialRef}
        className={`relative bg-dark-lighter border-2 p-6 cursor-ns-resize select-none transition-all duration-300 ${
          isDragging ? 'border-primary scale-105' : 'border-white/10 hover:border-white/20'
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Drag indicator lines */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-30">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-3 h-px bg-white" />
          ))}
        </div>

        <Icon className="w-5 h-5 text-primary mb-2" />
        <span className="font-mono text-xs text-white/40 tracking-widest block">{label}</span>
        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-4xl font-heading font-black text-white tabular-nums">
            {value.toFixed(0)}
          </span>
          <span className="text-sm font-mono text-white/30">{unit}</span>
        </div>

        {/* Quick adjust buttons */}
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onPointerDown={(e) => { e.stopPropagation(); startHold('down'); }}
            onPointerUp={stopHold}
            onPointerLeave={stopHold}
            className={`flex-1 py-2 font-mono text-sm transition-colors ${
              holdingBtn === 'down'
                ? 'bg-primary/30 text-primary'
                : 'bg-white/5 hover:bg-primary/20 hover:text-primary text-white/50'
            }`}
          >
            −
          </button>
          <button
            type="button"
            onPointerDown={(e) => { e.stopPropagation(); startHold('up'); }}
            onPointerUp={stopHold}
            onPointerLeave={stopHold}
            className={`flex-1 py-2 font-mono text-sm transition-colors ${
              holdingBtn === 'up'
                ? 'bg-primary/30 text-primary'
                : 'bg-white/5 hover:bg-primary/20 hover:text-primary text-white/50'
            }`}
          >
            +
          </button>
        </div>
      </div>

      {/* Glow effect on drag */}
      <div className={`absolute inset-0 bg-primary/20 blur-xl transition-opacity duration-300 -z-10 ${
        isDragging ? 'opacity-100' : 'opacity-0'
      }`} />
    </div>
  );
}

export default function BMICalculator() {
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [showResult, setShowResult] = useState(false);
  const sectionRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ['0%', '0%'] : ['-10%', '10%']
  );

  const bmi = weight / Math.pow(height / 100, 2);
  const zone = getZone(bmi);

  const handleCalculate = () => setShowResult(true);
  const handleReset = () => {
    setShowResult(false);
    setWeight(70);
    setHeight(170);
  };

  return (
    <section ref={sectionRef} className="py-20 lg:py-32 bg-dark relative overflow-hidden">
      {/* Grid background */}
      <motion.div
        className="absolute inset-0 opacity-[0.03]"
        style={{ y: bgY }}
      >
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />
      </motion.div>

      {/* Accent orb */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="mb-12 lg:mb-16">
            <span className="font-mono text-primary text-xs tracking-widest">[ BODY ANALYSIS ]</span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-white mt-4">
              KNOW YOUR<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                NUMBERS
              </span>
            </h2>
            <p className="text-white/40 mt-4 max-w-md">
              Drag the dials or tap +/- to input your stats. Your BMI is calculated in real-time.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Input dials */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
              <InputDial
                label="WEIGHT"
                value={weight}
                onChange={setWeight}
                min={30}
                max={200}
                unit="KG"
                icon={Scale}
              />
              <InputDial
                label="HEIGHT"
                value={height}
                onChange={setHeight}
                min={100}
                max={220}
                unit="CM"
                icon={Ruler}
              />

              {/* Action buttons */}
              <motion.button
                onClick={handleCalculate}
                className="col-span-2 group relative bg-primary hover:bg-primary-dark text-white font-heading font-bold text-lg py-4 transition-colors overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  CALCULATE BMI
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </motion.button>
            </motion.div>

            {/* Result display */}
            <motion.div variants={fadeUp} className="relative">
              <AnimatePresence mode="wait">
                {showResult ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-dark-lighter border border-white/5 p-8"
                  >
                    <BMIGauge value={bmi} isVisible={showResult} />

                    <div className="text-center mt-8">
                      <motion.div
                        className="inline-block px-4 py-2 font-mono text-sm tracking-widest"
                        style={{ backgroundColor: `${zone.color}20`, color: zone.color }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        {zone.label}
                      </motion.div>
                      <motion.p
                        className="text-white/50 mt-4 text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                      >
                        {zone.message}
                      </motion.p>
                    </div>

                    <motion.button
                      onClick={handleReset}
                      className="w-full mt-6 py-3 border border-white/10 text-white/50 hover:text-white hover:border-white/30 font-mono text-sm flex items-center justify-center gap-2 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    >
                      <RotateCcw className="w-4 h-4" />
                      RECALCULATE
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-dark-lighter border border-white/5 p-8 min-h-[320px] flex flex-col items-center justify-center"
                  >
                    <div className="w-16 h-16 border-2 border-dashed border-white/10 rounded-full flex items-center justify-center mb-4">
                      <Scale className="w-6 h-6 text-white/20" />
                    </div>
                    <p className="text-white/20 font-mono text-sm text-center">
                      Adjust your weight and height<br />then hit calculate
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Corner accents */}
              <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-primary/30" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-primary/30" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
