import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Dumbbell, Target, ChevronRight } from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

const MUSCLE_DATA = {
  // Front muscles
  chest: {
    name: 'CHEST',
    fullName: 'Pectoralis Major',
    side: 'front',
    exercises: [
      { name: 'Bench Press', sets: '4x8-12', intensity: 'high' },
      { name: 'Incline Dumbbell Press', sets: '3x10-12', intensity: 'high' },
      { name: 'Cable Flyes', sets: '3x12-15', intensity: 'medium' },
      { name: 'Push-Ups', sets: '3x15-20', intensity: 'medium' },
    ],
    description: 'The chest muscles are essential for pushing movements and upper body aesthetics.',
    color: '#ef4444',
  },
  shoulders: {
    name: 'SHOULDERS',
    fullName: 'Deltoids',
    side: 'both',
    exercises: [
      { name: 'Overhead Press', sets: '4x8-10', intensity: 'high' },
      { name: 'Lateral Raises', sets: '4x12-15', intensity: 'medium' },
      { name: 'Front Raises', sets: '3x12-15', intensity: 'medium' },
      { name: 'Face Pulls', sets: '3x15-20', intensity: 'low' },
    ],
    description: 'Well-developed shoulders create the V-taper look and improve pressing strength.',
    color: '#f97316',
  },
  biceps: {
    name: 'BICEPS',
    fullName: 'Biceps Brachii',
    side: 'front',
    exercises: [
      { name: 'Barbell Curls', sets: '4x8-12', intensity: 'high' },
      { name: 'Hammer Curls', sets: '3x10-12', intensity: 'medium' },
      { name: 'Preacher Curls', sets: '3x10-12', intensity: 'medium' },
      { name: 'Concentration Curls', sets: '3x12-15', intensity: 'low' },
    ],
    description: 'The biceps are crucial for pulling movements and arm flexion.',
    color: '#22c55e',
  },
  abs: {
    name: 'ABS',
    fullName: 'Rectus Abdominis',
    side: 'front',
    exercises: [
      { name: 'Hanging Leg Raises', sets: '4x12-15', intensity: 'high' },
      { name: 'Cable Crunches', sets: '3x15-20', intensity: 'medium' },
      { name: 'Planks', sets: '3x45-60s', intensity: 'medium' },
      { name: 'Ab Wheel Rollouts', sets: '3x10-12', intensity: 'high' },
    ],
    description: 'Core strength is the foundation of all athletic movements.',
    color: '#8b5cf6',
  },
  quads: {
    name: 'QUADS',
    fullName: 'Quadriceps',
    side: 'front',
    exercises: [
      { name: 'Barbell Squats', sets: '4x6-10', intensity: 'high' },
      { name: 'Leg Press', sets: '4x10-12', intensity: 'high' },
      { name: 'Leg Extensions', sets: '3x12-15', intensity: 'medium' },
      { name: 'Bulgarian Split Squats', sets: '3x10-12', intensity: 'high' },
    ],
    description: 'The largest muscle group, essential for lower body power and stability.',
    color: '#3b82f6',
  },
  forearms: {
    name: 'FOREARMS',
    fullName: 'Forearm Flexors',
    side: 'both',
    exercises: [
      { name: 'Wrist Curls', sets: '3x15-20', intensity: 'low' },
      { name: 'Reverse Curls', sets: '3x12-15', intensity: 'medium' },
      { name: 'Farmers Walk', sets: '3x40m', intensity: 'high' },
      { name: 'Dead Hangs', sets: '3x30-60s', intensity: 'medium' },
    ],
    description: 'Strong forearms improve grip strength for all lifts.',
    color: '#14b8a6',
  },
  // Back muscles
  traps: {
    name: 'TRAPS',
    fullName: 'Trapezius',
    side: 'back',
    exercises: [
      { name: 'Barbell Shrugs', sets: '4x12-15', intensity: 'medium' },
      { name: 'Dumbbell Shrugs', sets: '3x12-15', intensity: 'medium' },
      { name: 'Face Pulls', sets: '3x15-20', intensity: 'low' },
      { name: 'Rack Pulls', sets: '3x6-8', intensity: 'high' },
    ],
    description: 'The traps support neck and shoulder movement and posture.',
    color: '#f97316',
  },
  lats: {
    name: 'LATS',
    fullName: 'Latissimus Dorsi',
    side: 'back',
    exercises: [
      { name: 'Pull-Ups', sets: '4x8-12', intensity: 'high' },
      { name: 'Lat Pulldowns', sets: '4x10-12', intensity: 'medium' },
      { name: 'Barbell Rows', sets: '4x8-10', intensity: 'high' },
      { name: 'Single Arm Dumbbell Rows', sets: '3x10-12', intensity: 'medium' },
    ],
    description: 'The lats create the V-taper and are essential for pulling strength.',
    color: '#ef4444',
  },
  triceps: {
    name: 'TRICEPS',
    fullName: 'Triceps Brachii',
    side: 'back',
    exercises: [
      { name: 'Close Grip Bench Press', sets: '4x8-10', intensity: 'high' },
      { name: 'Tricep Pushdowns', sets: '3x12-15', intensity: 'medium' },
      { name: 'Overhead Extensions', sets: '3x10-12', intensity: 'medium' },
      { name: 'Skull Crushers', sets: '3x10-12', intensity: 'high' },
    ],
    description: 'Triceps make up 2/3 of arm size and are key for pushing strength.',
    color: '#22c55e',
  },
  glutes: {
    name: 'GLUTES',
    fullName: 'Gluteus Maximus',
    side: 'back',
    exercises: [
      { name: 'Hip Thrusts', sets: '4x10-12', intensity: 'high' },
      { name: 'Romanian Deadlifts', sets: '4x8-10', intensity: 'high' },
      { name: 'Glute Bridges', sets: '3x15-20', intensity: 'medium' },
      { name: 'Cable Kickbacks', sets: '3x12-15', intensity: 'low' },
    ],
    description: 'The strongest muscle in the body, crucial for hip extension and power.',
    color: '#8b5cf6',
  },
  hamstrings: {
    name: 'HAMSTRINGS',
    fullName: 'Biceps Femoris',
    side: 'back',
    exercises: [
      { name: 'Romanian Deadlifts', sets: '4x8-10', intensity: 'high' },
      { name: 'Lying Leg Curls', sets: '4x10-12', intensity: 'medium' },
      { name: 'Good Mornings', sets: '3x10-12', intensity: 'medium' },
      { name: 'Nordic Curls', sets: '3x6-8', intensity: 'high' },
    ],
    description: 'Essential for knee flexion and hip extension movements.',
    color: '#3b82f6',
  },
  calves: {
    name: 'CALVES',
    fullName: 'Gastrocnemius',
    side: 'back',
    exercises: [
      { name: 'Standing Calf Raises', sets: '4x15-20', intensity: 'medium' },
      { name: 'Seated Calf Raises', sets: '4x15-20', intensity: 'medium' },
      { name: 'Donkey Calf Raises', sets: '3x15-20', intensity: 'medium' },
      { name: 'Jump Rope', sets: '3x2min', intensity: 'high' },
    ],
    description: 'Often neglected, strong calves improve athletic performance.',
    color: '#14b8a6',
  },
};

function BodySVG({ side, selectedMuscle, hoveredMuscle, onHover, onSelect }) {
  const getMuscleStyle = (muscleId) => {
    const isSelected = selectedMuscle === muscleId;
    const isHovered = hoveredMuscle === muscleId;
    const muscle = MUSCLE_DATA[muscleId];

    return {
      fill: isSelected || isHovered ? muscle.color : '#374151',
      stroke: isSelected ? muscle.color : isHovered ? muscle.color : '#1f2937',
      strokeWidth: isSelected || isHovered ? 2 : 1,
      filter: isSelected || isHovered ? `drop-shadow(0 0 8px ${muscle.color}80)` : 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    };
  };

  if (side === 'front') {
    return (
      <svg viewBox="0 0 200 400" className="w-full h-full">
        {/* Head */}
        <ellipse cx="100" cy="30" rx="25" ry="28" fill="#1f2937" stroke="#374151" />

        {/* Neck */}
        <rect x="90" y="55" width="20" height="20" fill="#1f2937" stroke="#374151" />

        {/* Shoulders */}
        <ellipse
          cx="55" cy="85"
          rx="20" ry="15"
          style={getMuscleStyle('shoulders')}
          onMouseEnter={() => onHover('shoulders')}
          onMouseLeave={() => onHover(null)}
          onClick={() => onSelect('shoulders')}
        />
        <ellipse
          cx="145" cy="85"
          rx="20" ry="15"
          style={getMuscleStyle('shoulders')}
          onMouseEnter={() => onHover('shoulders')}
          onMouseLeave={() => onHover(null)}
          onClick={() => onSelect('shoulders')}
        />

        {/* Chest */}
        <path
          d="M 60 90 Q 100 85 140 90 Q 145 115 100 125 Q 55 115 60 90"
          style={getMuscleStyle('chest')}
          onMouseEnter={() => onHover('chest')}
          onMouseLeave={() => onHover(null)}
          onClick={() => onSelect('chest')}
        />

        {/* Biceps */}
        <ellipse
          cx="40" cy="130"
          rx="12" ry="30"
          style={getMuscleStyle('biceps')}
          onMouseEnter={() => onHover('biceps')}
          onMouseLeave={() => onHover(null)}
          onClick={() => onSelect('biceps')}
        />
        <ellipse
          cx="160" cy="130"
          rx="12" ry="30"
          style={getMuscleStyle('biceps')}
          onMouseEnter={() => onHover('biceps')}
          onMouseLeave={() => onHover(null)}
          onClick={() => onSelect('biceps')}
        />

        {/* Forearms */}
        <ellipse
          cx="35" cy="185"
          rx="10" ry="28"
          style={getMuscleStyle('forearms')}
          onMouseEnter={() => onHover('forearms')}
          onMouseLeave={() => onHover(null)}
          onClick={() => onSelect('forearms')}
        />
        <ellipse
          cx="165" cy="185"
          rx="10" ry="28"
          style={getMuscleStyle('forearms')}
          onMouseEnter={() => onHover('forearms')}
          onMouseLeave={() => onHover(null)}
          onClick={() => onSelect('forearms')}
        />

        {/* Abs */}
        <path
          d="M 75 125 L 125 125 L 120 200 Q 100 210 80 200 Z"
          style={getMuscleStyle('abs')}
          onMouseEnter={() => onHover('abs')}
          onMouseLeave={() => onHover(null)}
          onClick={() => onSelect('abs')}
        />

        {/* Quads */}
        <path
          d="M 70 210 L 90 210 L 85 310 L 65 310 Q 60 260 70 210"
          style={getMuscleStyle('quads')}
          onMouseEnter={() => onHover('quads')}
          onMouseLeave={() => onHover(null)}
          onClick={() => onSelect('quads')}
        />
        <path
          d="M 110 210 L 130 210 Q 140 260 135 310 L 115 310 Z"
          style={getMuscleStyle('quads')}
          onMouseEnter={() => onHover('quads')}
          onMouseLeave={() => onHover(null)}
          onClick={() => onSelect('quads')}
        />

        {/* Lower legs (non-interactive) */}
        <rect x="65" y="315" width="20" height="70" rx="5" fill="#1f2937" stroke="#374151" />
        <rect x="115" y="315" width="20" height="70" rx="5" fill="#1f2937" stroke="#374151" />

        {/* Hands */}
        <ellipse cx="30" cy="225" rx="8" ry="12" fill="#1f2937" stroke="#374151" />
        <ellipse cx="170" cy="225" rx="8" ry="12" fill="#1f2937" stroke="#374151" />
      </svg>
    );
  }

  // Back view
  return (
    <svg viewBox="0 0 200 400" className="w-full h-full">
      {/* Head */}
      <ellipse cx="100" cy="30" rx="25" ry="28" fill="#1f2937" stroke="#374151" />

      {/* Neck */}
      <rect x="90" y="55" width="20" height="20" fill="#1f2937" stroke="#374151" />

      {/* Traps */}
      <path
        d="M 70 70 Q 100 60 130 70 L 125 100 Q 100 95 75 100 Z"
        style={getMuscleStyle('traps')}
        onMouseEnter={() => onHover('traps')}
        onMouseLeave={() => onHover(null)}
        onClick={() => onSelect('traps')}
      />

      {/* Rear Delts (part of shoulders) */}
      <ellipse
        cx="50" cy="90"
        rx="18" ry="14"
        style={getMuscleStyle('shoulders')}
        onMouseEnter={() => onHover('shoulders')}
        onMouseLeave={() => onHover(null)}
        onClick={() => onSelect('shoulders')}
      />
      <ellipse
        cx="150" cy="90"
        rx="18" ry="14"
        style={getMuscleStyle('shoulders')}
        onMouseEnter={() => onHover('shoulders')}
        onMouseLeave={() => onHover(null)}
        onClick={() => onSelect('shoulders')}
      />

      {/* Lats */}
      <path
        d="M 60 100 Q 50 140 55 180 L 75 170 L 80 110 Z"
        style={getMuscleStyle('lats')}
        onMouseEnter={() => onHover('lats')}
        onMouseLeave={() => onHover(null)}
        onClick={() => onSelect('lats')}
      />
      <path
        d="M 140 100 Q 150 140 145 180 L 125 170 L 120 110 Z"
        style={getMuscleStyle('lats')}
        onMouseEnter={() => onHover('lats')}
        onMouseLeave={() => onHover(null)}
        onClick={() => onSelect('lats')}
      />

      {/* Triceps */}
      <ellipse
        cx="38" cy="130"
        rx="10" ry="28"
        style={getMuscleStyle('triceps')}
        onMouseEnter={() => onHover('triceps')}
        onMouseLeave={() => onHover(null)}
        onClick={() => onSelect('triceps')}
      />
      <ellipse
        cx="162" cy="130"
        rx="10" ry="28"
        style={getMuscleStyle('triceps')}
        onMouseEnter={() => onHover('triceps')}
        onMouseLeave={() => onHover(null)}
        onClick={() => onSelect('triceps')}
      />

      {/* Forearms */}
      <ellipse
        cx="35" cy="185"
        rx="10" ry="28"
        style={getMuscleStyle('forearms')}
        onMouseEnter={() => onHover('forearms')}
        onMouseLeave={() => onHover(null)}
        onClick={() => onSelect('forearms')}
      />
      <ellipse
        cx="165" cy="185"
        rx="10" ry="28"
        style={getMuscleStyle('forearms')}
        onMouseEnter={() => onHover('forearms')}
        onMouseLeave={() => onHover(null)}
        onClick={() => onSelect('forearms')}
      />

      {/* Lower back / Spine area */}
      <rect x="80" y="100" width="40" height="100" rx="5" fill="#1f2937" stroke="#374151" />

      {/* Glutes */}
      <ellipse
        cx="80" cy="220"
        rx="22" ry="25"
        style={getMuscleStyle('glutes')}
        onMouseEnter={() => onHover('glutes')}
        onMouseLeave={() => onHover(null)}
        onClick={() => onSelect('glutes')}
      />
      <ellipse
        cx="120" cy="220"
        rx="22" ry="25"
        style={getMuscleStyle('glutes')}
        onMouseEnter={() => onHover('glutes')}
        onMouseLeave={() => onHover(null)}
        onClick={() => onSelect('glutes')}
      />

      {/* Hamstrings */}
      <path
        d="M 60 250 L 90 250 L 85 330 L 65 330 Q 55 290 60 250"
        style={getMuscleStyle('hamstrings')}
        onMouseEnter={() => onHover('hamstrings')}
        onMouseLeave={() => onHover(null)}
        onClick={() => onSelect('hamstrings')}
      />
      <path
        d="M 110 250 L 140 250 Q 145 290 135 330 L 115 330 Z"
        style={getMuscleStyle('hamstrings')}
        onMouseEnter={() => onHover('hamstrings')}
        onMouseLeave={() => onHover(null)}
        onClick={() => onSelect('hamstrings')}
      />

      {/* Calves */}
      <ellipse
        cx="75" cy="360"
        rx="12" ry="25"
        style={getMuscleStyle('calves')}
        onMouseEnter={() => onHover('calves')}
        onMouseLeave={() => onHover(null)}
        onClick={() => onSelect('calves')}
      />
      <ellipse
        cx="125" cy="360"
        rx="12" ry="25"
        style={getMuscleStyle('calves')}
        onMouseEnter={() => onHover('calves')}
        onMouseLeave={() => onHover(null)}
        onClick={() => onSelect('calves')}
      />

      {/* Hands */}
      <ellipse cx="30" cy="225" rx="8" ry="12" fill="#1f2937" stroke="#374151" />
      <ellipse cx="170" cy="225" rx="8" ry="12" fill="#1f2937" stroke="#374151" />
    </svg>
  );
}

function ExercisePanel({ muscle, onClose }) {
  if (!muscle) return null;

  const data = MUSCLE_DATA[muscle];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="bg-dark border border-white/10 p-6 h-full overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div
            className="inline-block px-3 py-1 text-xs font-mono tracking-wider mb-2"
            style={{ backgroundColor: `${data.color}20`, color: data.color }}
          >
            {data.side.toUpperCase()} BODY
          </div>
          <h3 className="text-2xl font-heading font-black text-white">{data.name}</h3>
          <p className="text-white/40 text-sm">{data.fullName}</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/5 transition-colors text-white/40 hover:text-white"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Description */}
      <p className="text-white/60 text-sm mb-6 leading-relaxed">{data.description}</p>

      {/* Exercises */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-white/40 mb-4">
          <Dumbbell className="w-4 h-4" />
          <span className="font-mono text-xs tracking-wider">RECOMMENDED EXERCISES</span>
        </div>

        {data.exercises.map((exercise, idx) => (
          <motion.div
            key={exercise.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group bg-dark-lighter border border-white/5 p-4 hover:border-white/20 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-heading font-bold text-white group-hover:text-primary transition-colors">
                {exercise.name}
              </h4>
              <span
                className={`text-xs font-mono px-2 py-0.5 ${
                  exercise.intensity === 'high'
                    ? 'bg-red-500/20 text-red-400'
                    : exercise.intensity === 'medium'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-green-500/20 text-green-400'
                }`}
              >
                {exercise.intensity.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-white/40 text-sm">
              <Target className="w-3 h-3" />
              <span className="font-mono">{exercise.sets}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default function MuscleExplorer() {
  const [side, setSide] = useState('front');
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [hoveredMuscle, setHoveredMuscle] = useState(null);

  const handleFlip = () => {
    setSide(s => s === 'front' ? 'back' : 'front');
    setSelectedMuscle(null);
  };

  const displayMuscle = hoveredMuscle || selectedMuscle;

  return (
    <section className="py-20 lg:py-32 bg-dark-light relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center mb-12 lg:mb-16">
            <span className="font-mono text-primary text-xs tracking-widest">
              [ INTERACTIVE ANATOMY ]
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-white mt-4">
              MUSCLE
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                {' '}EXPLORER
              </span>
            </h2>
            <p className="text-white/40 mt-4 max-w-xl mx-auto">
              Click on any muscle group to discover targeted exercises.
              Rotate the model to explore front and back muscle groups.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Body visualization */}
            <div className="relative">
              <div className="bg-dark border border-white/10 p-8 relative">
                {/* View indicator */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="font-mono text-xs text-white/40">VIEWING:</span>
                  <span className="font-mono text-xs text-primary tracking-wider">
                    {side.toUpperCase()} VIEW
                  </span>
                </div>

                {/* Rotate button */}
                <button
                  onClick={handleFlip}
                  className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/50 transition-all group"
                >
                  <RotateCcw className="w-4 h-4 text-white/50 group-hover:text-primary transition-colors" />
                  <span className="font-mono text-xs text-white/50 group-hover:text-primary transition-colors">
                    ROTATE
                  </span>
                </button>

                {/* Body with flip animation */}
                <div className="flex justify-center py-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={side}
                      initial={{ opacity: 0, scale: 0.9, rotateY: -90 }}
                      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                      exit={{ opacity: 0, scale: 0.9, rotateY: 90 }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                      className="w-48 sm:w-56 lg:w-64"
                    >
                      <BodySVG
                        side={side}
                        selectedMuscle={selectedMuscle}
                        hoveredMuscle={hoveredMuscle}
                        onHover={setHoveredMuscle}
                        onSelect={setSelectedMuscle}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Hover indicator */}
                <AnimatePresence>
                  {displayMuscle && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-dark-lighter border border-white/10"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: MUSCLE_DATA[displayMuscle].color }}
                      />
                      <span className="font-mono text-sm text-white">
                        {MUSCLE_DATA[displayMuscle].name}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Corner accents */}
                <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-primary/30" />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-primary/30" />
              </div>

              {/* Muscle legend */}
              <div className="mt-6 grid grid-cols-3 sm:grid-cols-4 gap-2">
                {Object.entries(MUSCLE_DATA)
                  .filter(([_, data]) => data.side === side || data.side === 'both')
                  .map(([key, data]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedMuscle(key)}
                      className={`flex items-center gap-2 px-3 py-2 text-left transition-all ${
                        selectedMuscle === key
                          ? 'bg-white/10 border-white/20'
                          : 'bg-dark border-white/5 hover:bg-white/5'
                      } border`}
                    >
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: data.color }}
                      />
                      <span className="font-mono text-xs text-white/60 truncate">
                        {data.name}
                      </span>
                    </button>
                  ))}
              </div>
            </div>

            {/* Exercise panel */}
            <div className="lg:sticky lg:top-8">
              <AnimatePresence mode="wait">
                {selectedMuscle ? (
                  <ExercisePanel
                    key={selectedMuscle}
                    muscle={selectedMuscle}
                    onClose={() => setSelectedMuscle(null)}
                  />
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-dark border border-white/10 p-8 flex flex-col items-center justify-center min-h-[400px]"
                  >
                    <div className="w-20 h-20 border-2 border-dashed border-white/10 rounded-full flex items-center justify-center mb-4">
                      <Target className="w-8 h-8 text-white/20" />
                    </div>
                    <h3 className="font-heading font-bold text-white/40 text-lg mb-2">
                      SELECT A MUSCLE
                    </h3>
                    <p className="text-white/20 text-sm text-center max-w-xs">
                      Click on any highlighted muscle group to view recommended exercises and training tips
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
