import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, Ruler, Target, TrendingDown, Info, ChevronRight, RotateCcw } from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

// Body fat categories
const CATEGORIES = {
  male: [
    { id: 'essential', name: 'Essential Fat', range: [2, 5], color: '#ef4444', description: 'Minimum for survival' },
    { id: 'athletes', name: 'Athletes', range: [6, 13], color: '#f97316', description: 'Elite athletic physique' },
    { id: 'fitness', name: 'Fitness', range: [14, 17], color: '#22c55e', description: 'Fit and healthy' },
    { id: 'acceptable', name: 'Acceptable', range: [18, 24], color: '#3b82f6', description: 'Average healthy' },
    { id: 'obese', name: 'Obese', range: [25, 50], color: '#dc2626', description: 'Health risk' },
  ],
  female: [
    { id: 'essential', name: 'Essential Fat', range: [10, 13], color: '#ef4444', description: 'Minimum for survival' },
    { id: 'athletes', name: 'Athletes', range: [14, 20], color: '#f97316', description: 'Elite athletic physique' },
    { id: 'fitness', name: 'Fitness', range: [21, 24], color: '#22c55e', description: 'Fit and healthy' },
    { id: 'acceptable', name: 'Acceptable', range: [25, 31], color: '#3b82f6', description: 'Average healthy' },
    { id: 'obese', name: 'Obese', range: [32, 50], color: '#dc2626', description: 'Health risk' },
  ],
};

// Visual body fat reference data
const BODY_FAT_VISUALS = {
  male: [
    { percent: 8, label: '6-9%', description: 'Competition ready, visible abs and veins' },
    { percent: 12, label: '10-14%', description: 'Athletic, defined muscles' },
    { percent: 18, label: '15-19%', description: 'Fit, some definition' },
    { percent: 25, label: '20-24%', description: 'Average, soft appearance' },
    { percent: 32, label: '25-30%', description: 'Overweight, minimal definition' },
    { percent: 40, label: '35%+', description: 'Obese, no muscle definition' },
  ],
  female: [
    { percent: 15, label: '14-17%', description: 'Competition ready, very lean' },
    { percent: 20, label: '18-22%', description: 'Athletic, toned appearance' },
    { percent: 25, label: '23-27%', description: 'Fit, healthy curves' },
    { percent: 32, label: '28-33%', description: 'Average, soft appearance' },
    { percent: 38, label: '34-40%', description: 'Overweight' },
    { percent: 45, label: '40%+', description: 'Obese' },
  ],
};

// Navy method body fat calculation
function calculateBodyFat(gender, height, neck, waist, hip) {
  // Height, neck, waist, hip in cm
  if (gender === 'male') {
    // Male formula: 86.010 × log10(waist - neck) - 70.041 × log10(height) + 36.76
    const bf = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76;
    return Math.max(2, Math.min(50, bf));
  } else {
    // Female formula: 163.205 × log10(waist + hip - neck) - 97.684 × log10(height) - 78.387
    const bf = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(height) - 78.387;
    return Math.max(10, Math.min(50, bf));
  }
}

// Get category based on body fat percentage
function getCategory(gender, bodyFat) {
  const categories = CATEGORIES[gender];
  for (const cat of categories) {
    if (bodyFat >= cat.range[0] && bodyFat <= cat.range[1]) {
      return cat;
    }
  }
  return categories[categories.length - 1];
}

// Body silhouette SVG component
function BodySilhouette({ gender, fatPercent, isSelected, onClick }) {
  // Generate body shape based on fat percentage
  const getBodyPath = () => {
    if (gender === 'male') {
      const waistWidth = 25 + (fatPercent / 100) * 30;
      const chestWidth = 35 + (fatPercent / 100) * 15;
      const shoulderWidth = 45 - (fatPercent / 100) * 5;

      return `
        M 50 15
        Q 50 5, 50 5
        Q 55 5, 55 15
        L 55 20
        Q ${50 + shoulderWidth/2} 25, ${50 + shoulderWidth/2} 35
        L ${50 + chestWidth/2} 50
        Q ${50 + waistWidth/2} 70, ${50 + waistWidth/2} 80
        L ${50 + waistWidth/2 - 5} 95
        L 55 95
        L 55 130
        L 60 130
        L 60 95
        L 50 95
        L 40 95
        L 40 130
        L 45 130
        L 45 95
        L ${50 - waistWidth/2 + 5} 95
        L ${50 - waistWidth/2} 80
        Q ${50 - waistWidth/2} 70, ${50 - chestWidth/2} 50
        L ${50 - shoulderWidth/2} 35
        Q ${50 - shoulderWidth/2} 25, 45 20
        L 45 15
        Q 45 5, 50 5
        Z
      `;
    } else {
      const hipWidth = 35 + (fatPercent / 100) * 25;
      const waistWidth = 22 + (fatPercent / 100) * 25;
      const bustWidth = 30 + (fatPercent / 100) * 15;

      return `
        M 50 15
        Q 50 5, 50 5
        Q 55 5, 55 15
        L 55 20
        Q 60 25, 60 30
        L ${50 + bustWidth/2} 45
        Q ${50 + waistWidth/2} 55, ${50 + waistWidth/2} 60
        Q ${50 + hipWidth/2} 75, ${50 + hipWidth/2} 85
        L 55 95
        L 55 130
        L 60 130
        L 58 95
        L 50 90
        L 42 95
        L 40 130
        L 45 130
        L 45 95
        L ${50 - hipWidth/2} 85
        Q ${50 - hipWidth/2} 75, ${50 - waistWidth/2} 60
        Q ${50 - waistWidth/2} 55, ${50 - bustWidth/2} 45
        L 40 30
        Q 40 25, 45 20
        L 45 15
        Q 45 5, 50 5
        Z
      `;
    }
  };

  return (
    <motion.button
      onClick={onClick}
      className={`relative p-2 border transition-all ${
        isSelected
          ? 'border-primary bg-primary/10'
          : 'border-white/10 hover:border-white/20 bg-white/5'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg viewBox="0 0 100 140" className="w-full h-24">
        <path
          d={getBodyPath()}
          fill={isSelected ? '#ff5722' : '#ffffff20'}
          stroke={isSelected ? '#ff5722' : '#ffffff40'}
          strokeWidth="1"
        />
      </svg>
      <p className={`text-center text-xs font-mono mt-1 ${isSelected ? 'text-primary' : 'text-white/50'}`}>
        {BODY_FAT_VISUALS[gender].find(v => v.percent === fatPercent)?.label}
      </p>
    </motion.button>
  );
}

// Body composition pie chart
function CompositionChart({ bodyFat, weight }) {
  const fatMass = (weight * bodyFat / 100).toFixed(1);
  const leanMass = (weight * (100 - bodyFat) / 100).toFixed(1);

  // Calculate pie chart angles
  const fatAngle = (bodyFat / 100) * 360;

  // Convert angle to SVG arc path
  const getArcPath = (startAngle, endAngle, radius) => {
    const start = polarToCartesian(50, 50, radius, endAngle);
    const end = polarToCartesian(50, 50, radius, startAngle);
    const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`;
  };

  const polarToCartesian = (cx, cy, r, angle) => {
    const rad = (angle - 90) * Math.PI / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad)
    };
  };

  return (
    <div className="relative">
      <svg viewBox="0 0 100 100" className="w-48 h-48 mx-auto">
        {/* Background circle */}
        <circle cx="50" cy="50" r="40" fill="none" stroke="#ffffff10" strokeWidth="20" />

        {/* Lean mass arc */}
        <motion.circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#22c55e"
          strokeWidth="20"
          strokeDasharray={`${(100 - bodyFat) * 2.51} 251`}
          strokeDashoffset="0"
          initial={{ strokeDasharray: "0 251" }}
          animate={{ strokeDasharray: `${(100 - bodyFat) * 2.51} 251` }}
          transition={{ duration: 1, ease: "easeOut" }}
          transform="rotate(-90 50 50)"
        />

        {/* Fat mass arc */}
        <motion.circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#ef4444"
          strokeWidth="20"
          strokeDasharray={`${bodyFat * 2.51} 251`}
          strokeDashoffset={`-${(100 - bodyFat) * 2.51}`}
          initial={{ strokeDasharray: "0 251" }}
          animate={{ strokeDasharray: `${bodyFat * 2.51} 251` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          transform="rotate(-90 50 50)"
        />

        {/* Center text */}
        <text x="50" y="45" textAnchor="middle" className="fill-white text-lg font-bold">
          {bodyFat.toFixed(1)}%
        </text>
        <text x="50" y="60" textAnchor="middle" className="fill-white/50 text-[8px]">
          BODY FAT
        </text>
      </svg>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500" />
          <div>
            <p className="text-white text-sm font-bold">{fatMass} kg</p>
            <p className="text-white/50 text-xs">Fat Mass</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500" />
          <div>
            <p className="text-white text-sm font-bold">{leanMass} kg</p>
            <p className="text-white/50 text-xs">Lean Mass</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Category meter
function CategoryMeter({ gender, bodyFat }) {
  const categories = CATEGORIES[gender];
  const totalRange = categories[categories.length - 1].range[1] - categories[0].range[0];
  const position = ((bodyFat - categories[0].range[0]) / totalRange) * 100;

  return (
    <div className="relative">
      {/* Track */}
      <div className="h-6 flex overflow-hidden">
        {categories.map((cat, idx) => {
          const width = ((cat.range[1] - cat.range[0]) / totalRange) * 100;
          return (
            <div
              key={cat.id}
              className="h-full flex items-center justify-center"
              style={{ width: `${width}%`, backgroundColor: cat.color }}
            >
              <span className="text-[8px] font-mono text-white/80 hidden sm:block">
                {cat.range[0]}-{cat.range[1]}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Marker */}
      <motion.div
        className="absolute top-0 h-6 w-1 bg-white shadow-lg"
        initial={{ left: 0 }}
        animate={{ left: `${Math.min(Math.max(position, 0), 100)}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      {/* Labels */}
      <div className="flex mt-2">
        {categories.map((cat) => {
          const width = ((cat.range[1] - cat.range[0]) / totalRange) * 100;
          return (
            <div
              key={cat.id}
              className="text-center"
              style={{ width: `${width}%` }}
            >
              <span className="text-[10px] text-white/50">{cat.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function BodyFatEstimator() {
  const [step, setStep] = useState(1);
  const [gender, setGender] = useState('male');
  const [method, setMethod] = useState('visual'); // 'visual' or 'measurement'
  const [visualEstimate, setVisualEstimate] = useState(null);
  const [measurements, setMeasurements] = useState({
    height: 175,
    weight: 75,
    neck: 38,
    waist: 85,
    hip: 95,
  });
  const [result, setResult] = useState(null);

  const handleVisualSelect = (percent) => {
    setVisualEstimate(percent);
  };

  const handleCalculate = () => {
    let bodyFat;
    if (method === 'visual') {
      bodyFat = visualEstimate;
    } else {
      bodyFat = calculateBodyFat(
        gender,
        measurements.height,
        measurements.neck,
        measurements.waist,
        measurements.hip
      );
    }

    const category = getCategory(gender, bodyFat);
    setResult({ bodyFat, category });
    setStep(3);
  };

  const handleReset = () => {
    setStep(1);
    setVisualEstimate(null);
    setResult(null);
  };

  return (
    <section className="relative py-24 bg-darker overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
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
              <Scale className="w-4 h-4" />
              BODY COMPOSITION
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-black text-white mb-4">
              ESTIMATE YOUR{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-red-500">
                BODY FAT
              </span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Get an estimate of your body fat percentage using visual comparison or the Navy method.
            </p>
          </motion.div>

          {/* Main content */}
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  {/* Gender selection */}
                  <div className="relative bg-dark/50 border border-white/10 p-6">
                    <h3 className="font-heading font-bold text-lg text-white mb-4">SELECT GENDER</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {['male', 'female'].map((g) => (
                        <button
                          key={g}
                          onClick={() => setGender(g)}
                          className={`p-4 border font-heading font-bold text-lg transition-all ${
                            gender === g
                              ? 'bg-primary text-white border-primary'
                              : 'bg-white/5 text-white/50 border-white/10 hover:border-white/20'
                          }`}
                        >
                          {g === 'male' ? '♂' : '♀'} {g.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Method selection */}
                  <div className="relative bg-dark/50 border border-white/10 p-6">
                    <h3 className="font-heading font-bold text-lg text-white mb-4">ESTIMATION METHOD</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <button
                        onClick={() => setMethod('visual')}
                        className={`p-6 border text-left transition-all ${
                          method === 'visual'
                            ? 'bg-primary/10 border-primary'
                            : 'bg-white/5 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <Target className={`w-8 h-8 mb-3 ${method === 'visual' ? 'text-primary' : 'text-white/50'}`} />
                        <h4 className="font-heading font-bold text-white mb-1">Visual Comparison</h4>
                        <p className="text-white/50 text-sm">Compare your physique to reference images</p>
                      </button>
                      <button
                        onClick={() => setMethod('measurement')}
                        className={`p-6 border text-left transition-all ${
                          method === 'measurement'
                            ? 'bg-primary/10 border-primary'
                            : 'bg-white/5 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <Ruler className={`w-8 h-8 mb-3 ${method === 'measurement' ? 'text-primary' : 'text-white/50'}`} />
                        <h4 className="font-heading font-bold text-white mb-1">Navy Method</h4>
                        <p className="text-white/50 text-sm">Calculate using body measurements</p>
                      </button>
                    </div>
                  </div>

                  {/* Continue button */}
                  <motion.button
                    onClick={() => setStep(2)}
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-primary text-white font-heading font-bold text-lg flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    CONTINUE
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {method === 'visual' ? (
                    <div className="relative bg-dark/50 border border-white/10 p-6">
                      <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-primary/30" />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-primary/30" />

                      <h3 className="font-heading font-bold text-lg text-white mb-2">
                        SELECT YOUR BODY TYPE
                      </h3>
                      <p className="text-white/50 text-sm mb-6">
                        Choose the silhouette that most closely matches your current physique
                      </p>

                      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
                        {BODY_FAT_VISUALS[gender].map((visual) => (
                          <BodySilhouette
                            key={visual.percent}
                            gender={gender}
                            fatPercent={visual.percent}
                            isSelected={visualEstimate === visual.percent}
                            onClick={() => handleVisualSelect(visual.percent)}
                          />
                        ))}
                      </div>

                      {visualEstimate && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white/5 p-4 mb-6"
                        >
                          <p className="text-white/70 text-sm">
                            <strong className="text-white">
                              {BODY_FAT_VISUALS[gender].find(v => v.percent === visualEstimate)?.label}:
                            </strong>{' '}
                            {BODY_FAT_VISUALS[gender].find(v => v.percent === visualEstimate)?.description}
                          </p>
                        </motion.div>
                      )}

                      {/* Weight input for composition calculation */}
                      <div className="mb-6">
                        <label className="block text-white/50 text-sm mb-2">Your Weight (kg)</label>
                        <input
                          type="number"
                          value={measurements.weight}
                          onChange={(e) => setMeasurements({ ...measurements, weight: Number(e.target.value) })}
                          className="w-full p-4 bg-white/5 border border-white/10 text-white font-mono text-xl text-center focus:border-primary focus:outline-none"
                        />
                      </div>

                      <motion.button
                        onClick={handleCalculate}
                        disabled={!visualEstimate}
                        className="w-full py-4 bg-gradient-to-r from-green-500 to-primary text-white font-heading font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: visualEstimate ? 1.02 : 1 }}
                        whileTap={{ scale: visualEstimate ? 0.98 : 1 }}
                      >
                        GET RESULTS
                      </motion.button>
                    </div>
                  ) : (
                    <div className="relative bg-dark/50 border border-white/10 p-6">
                      <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-primary/30" />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-primary/30" />

                      <h3 className="font-heading font-bold text-lg text-white mb-2">
                        ENTER YOUR MEASUREMENTS
                      </h3>
                      <p className="text-white/50 text-sm mb-6">
                        Use a tape measure for accurate results. Measure in centimeters.
                      </p>

                      <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <label className="block text-white/50 text-sm mb-2">Height (cm)</label>
                          <input
                            type="number"
                            value={measurements.height}
                            onChange={(e) => setMeasurements({ ...measurements, height: Number(e.target.value) })}
                            className="w-full p-3 bg-white/5 border border-white/10 text-white font-mono text-center focus:border-primary focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-white/50 text-sm mb-2">Weight (kg)</label>
                          <input
                            type="number"
                            value={measurements.weight}
                            onChange={(e) => setMeasurements({ ...measurements, weight: Number(e.target.value) })}
                            className="w-full p-3 bg-white/5 border border-white/10 text-white font-mono text-center focus:border-primary focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-white/50 text-sm mb-2">
                            Neck Circumference (cm)
                            <Info className="w-3 h-3 inline ml-1 text-white/30" />
                          </label>
                          <input
                            type="number"
                            value={measurements.neck}
                            onChange={(e) => setMeasurements({ ...measurements, neck: Number(e.target.value) })}
                            className="w-full p-3 bg-white/5 border border-white/10 text-white font-mono text-center focus:border-primary focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-white/50 text-sm mb-2">
                            Waist Circumference (cm)
                            <Info className="w-3 h-3 inline ml-1 text-white/30" />
                          </label>
                          <input
                            type="number"
                            value={measurements.waist}
                            onChange={(e) => setMeasurements({ ...measurements, waist: Number(e.target.value) })}
                            className="w-full p-3 bg-white/5 border border-white/10 text-white font-mono text-center focus:border-primary focus:outline-none"
                          />
                        </div>
                        {gender === 'female' && (
                          <div className="md:col-span-2">
                            <label className="block text-white/50 text-sm mb-2">
                              Hip Circumference (cm)
                              <Info className="w-3 h-3 inline ml-1 text-white/30" />
                            </label>
                            <input
                              type="number"
                              value={measurements.hip}
                              onChange={(e) => setMeasurements({ ...measurements, hip: Number(e.target.value) })}
                              className="w-full p-3 bg-white/5 border border-white/10 text-white font-mono text-center focus:border-primary focus:outline-none"
                            />
                          </div>
                        )}
                      </div>

                      <div className="bg-white/5 p-4 mb-6 border-l-2 border-primary">
                        <p className="text-white/70 text-sm">
                          <strong className="text-white">Measurement tips:</strong> Measure neck at narrowest point,
                          waist at navel level, and hips at widest point. Keep tape snug but not tight.
                        </p>
                      </div>

                      <motion.button
                        onClick={handleCalculate}
                        className="w-full py-4 bg-gradient-to-r from-green-500 to-primary text-white font-heading font-bold text-lg"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        CALCULATE BODY FAT
                      </motion.button>
                    </div>
                  )}

                  <button
                    onClick={() => setStep(1)}
                    className="mt-4 text-white/50 hover:text-white text-sm font-mono transition-colors"
                  >
                    ← Back
                  </button>
                </motion.div>
              )}

              {step === 3 && result && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Left - Composition chart */}
                    <div className="relative bg-dark/50 border border-white/10 p-6">
                      <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-primary/30" />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-primary/30" />

                      <h3 className="font-heading font-bold text-lg text-white mb-6 text-center">
                        YOUR BODY COMPOSITION
                      </h3>

                      <CompositionChart bodyFat={result.bodyFat} weight={measurements.weight} />
                    </div>

                    {/* Right - Category and details */}
                    <div className="space-y-6">
                      {/* Category card */}
                      <div className="relative bg-dark/50 border border-white/10 p-6">
                        <h3 className="font-heading font-bold text-lg text-white mb-4">CATEGORY</h3>

                        <div className="flex items-center gap-4 mb-6">
                          <div
                            className="w-16 h-16 flex items-center justify-center text-2xl font-black text-white"
                            style={{ backgroundColor: result.category.color }}
                          >
                            {result.bodyFat.toFixed(0)}%
                          </div>
                          <div>
                            <p
                              className="font-heading font-black text-xl"
                              style={{ color: result.category.color }}
                            >
                              {result.category.name.toUpperCase()}
                            </p>
                            <p className="text-white/50 text-sm">{result.category.description}</p>
                          </div>
                        </div>

                        <CategoryMeter gender={gender} bodyFat={result.bodyFat} />
                      </div>

                      {/* Ideal range */}
                      <div className="bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 p-6">
                        <h4 className="font-heading font-bold text-white mb-3 flex items-center gap-2">
                          <TrendingDown className="w-5 h-5 text-green-500" />
                          IDEAL RANGE
                        </h4>
                        <p className="text-white/70 text-sm mb-2">
                          For optimal health and fitness, aim for the{' '}
                          <strong className="text-green-400">Fitness</strong> category:
                        </p>
                        <p className="font-mono text-2xl font-bold text-green-400">
                          {CATEGORIES[gender].find(c => c.id === 'fitness')?.range[0]}-
                          {CATEGORIES[gender].find(c => c.id === 'fitness')?.range[1]}%
                        </p>
                        {result.bodyFat > CATEGORIES[gender].find(c => c.id === 'fitness')?.range[1] && (
                          <p className="text-white/50 text-xs mt-2">
                            Target: Lose approximately{' '}
                            {((result.bodyFat - CATEGORIES[gender].find(c => c.id === 'fitness')?.range[1]) * measurements.weight / 100).toFixed(1)} kg
                            of fat
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Reset button */}
                  <motion.button
                    onClick={handleReset}
                    className="mt-8 mx-auto flex items-center gap-2 px-6 py-3 border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-colors font-mono text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RotateCcw className="w-4 h-4" />
                    CALCULATE AGAIN
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
