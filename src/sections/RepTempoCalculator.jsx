import { useState, useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Clock, Play, Pause, RotateCcw, Info, TrendingUp, Zap, Timer } from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

const PRESET_TEMPOS = [
  { name: 'Standard', tempo: [2, 0, 2, 0], description: 'Normal lifting speed', goal: 'General' },
  { name: 'Controlled', tempo: [3, 1, 2, 0], description: 'Slight pause at bottom', goal: 'Hypertrophy' },
  { name: 'Slow Eccentric', tempo: [4, 0, 1, 0], description: 'Emphasize the negative', goal: 'Strength' },
  { name: 'Time Under Tension', tempo: [4, 1, 4, 1], description: 'Maximum muscle tension', goal: 'Hypertrophy' },
  { name: 'Explosive', tempo: [2, 0, 1, 0], description: 'Fast concentric phase', goal: 'Power' },
  { name: 'Pause Reps', tempo: [2, 2, 2, 0], description: '2 second pause at bottom', goal: 'Strength' },
  { name: 'Super Slow', tempo: [5, 0, 5, 0], description: 'Extreme time under tension', goal: 'Hypertrophy' },
  { name: 'Speed Work', tempo: [1, 0, 1, 0], description: 'Fast but controlled', goal: 'Power' },
];

const TEMPO_PHASES = [
  { key: 'eccentric', label: 'Eccentric', description: 'Lowering phase (negative)', color: 'from-blue-500 to-cyan-500' },
  { key: 'pause1', label: 'Pause (Bottom)', description: 'Hold at stretched position', color: 'from-purple-500 to-pink-500' },
  { key: 'concentric', label: 'Concentric', description: 'Lifting phase (positive)', color: 'from-orange-500 to-red-500' },
  { key: 'pause2', label: 'Pause (Top)', description: 'Hold at contracted position', color: 'from-green-500 to-emerald-500' },
];

const TUT_RECOMMENDATIONS = [
  { range: [0, 20], label: 'Power', description: 'Best for explosive strength', color: 'text-purple-400' },
  { range: [20, 40], label: 'Strength', description: 'Optimal for building strength', color: 'text-blue-400' },
  { range: [40, 70], label: 'Hypertrophy', description: 'Ideal for muscle growth', color: 'text-green-400' },
  { range: [70, 120], label: 'Endurance', description: 'Builds muscular endurance', color: 'text-orange-400' },
];

export default function RepTempoCalculator() {
  const [tempo, setTempo] = useState([3, 1, 2, 0]); // [eccentric, pause1, concentric, pause2]
  const [reps, setReps] = useState(10);
  const [sets, setSets] = useState(3);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [currentRep, setCurrentRep] = useState(0);
  const animationRef = useRef(null);

  const calculations = useMemo(() => {
    const repDuration = tempo.reduce((sum, t) => sum + t, 0);
    const setTUT = repDuration * reps;
    const totalTUT = setTUT * sets;

    const recommendation = TUT_RECOMMENDATIONS.find(
      r => setTUT >= r.range[0] && setTUT < r.range[1]
    ) || TUT_RECOMMENDATIONS[TUT_RECOMMENDATIONS.length - 1];

    return {
      repDuration,
      setTUT,
      totalTUT,
      recommendation,
      eccentricTime: tempo[0] * reps,
      concentricTime: tempo[2] * reps,
      pauseTime: (tempo[1] + tempo[3]) * reps,
    };
  }, [tempo, reps, sets]);

  const updateTempo = (index, value) => {
    const newTempo = [...tempo];
    newTempo[index] = Math.max(0, Math.min(10, value));
    setTempo(newTempo);
  };

  const applyPreset = (preset) => {
    setTempo([...preset.tempo]);
  };

  const startAnimation = () => {
    setIsAnimating(true);
    setCurrentPhase(0);
    setPhaseProgress(0);
    setCurrentRep(1);
  };

  const stopAnimation = () => {
    setIsAnimating(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const resetAnimation = () => {
    stopAnimation();
    setCurrentPhase(0);
    setPhaseProgress(0);
    setCurrentRep(0);
  };

  useEffect(() => {
    if (!isAnimating) return;

    let startTime = null;
    let phaseIndex = 0;
    let repCount = 1;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;

      const phaseDuration = tempo[phaseIndex] * 1000;
      if (phaseDuration === 0) {
        // Skip phases with 0 duration
        phaseIndex = (phaseIndex + 1) % 4;
        if (phaseIndex === 0) {
          repCount++;
          if (repCount > reps) {
            setIsAnimating(false);
            setCurrentRep(reps);
            return;
          }
        }
        setCurrentPhase(phaseIndex);
        setCurrentRep(repCount);
        startTime = timestamp;
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const elapsed = timestamp - startTime;
      const progress = Math.min((elapsed / phaseDuration) * 100, 100);

      setPhaseProgress(progress);
      setCurrentPhase(phaseIndex);
      setCurrentRep(repCount);

      if (elapsed >= phaseDuration) {
        phaseIndex = (phaseIndex + 1) % 4;
        if (phaseIndex === 0) {
          repCount++;
          if (repCount > reps) {
            setIsAnimating(false);
            return;
          }
        }
        startTime = timestamp;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, tempo, reps]);

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Weight position for visualization (0 = top, 100 = bottom)
  const getWeightPosition = () => {
    if (!isAnimating && currentRep === 0) return 0;

    const phase = currentPhase;
    const progress = phaseProgress / 100;

    if (phase === 0) return progress * 100; // Eccentric: 0 -> 100
    if (phase === 1) return 100; // Pause at bottom
    if (phase === 2) return 100 - (progress * 100); // Concentric: 100 -> 0
    return 0; // Pause at top
  };

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="container mx-auto px-4 relative z-10"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-4">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium">Time Under Tension</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Rep <span className="text-primary">Tempo</span> Calculator
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Master your lifting tempo to maximize muscle growth and strength gains
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl border border-zinc-800 p-6">
              {/* Tempo Notation */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold">Tempo Notation</h3>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <Info className="w-4 h-4" />
                    <span>E-P-C-P format</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 mb-4">
                  {tempo.map((value, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${TEMPO_PHASES[index].color} flex items-center justify-center`}>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={value}
                          onChange={(e) => updateTempo(index, parseInt(e.target.value) || 0)}
                          className="w-12 h-12 bg-black/30 rounded-lg text-white text-2xl font-bold text-center focus:outline-none"
                        />
                      </div>
                      <p className="text-gray-500 text-xs mt-2">{TEMPO_PHASES[index].label}</p>
                      {index < 3 && <span className="text-gray-600 text-2xl absolute ml-20">-</span>}
                    </div>
                  ))}
                </div>

                {/* Phase Descriptions */}
                <div className="grid grid-cols-2 gap-2">
                  {TEMPO_PHASES.map((phase, index) => (
                    <div
                      key={phase.key}
                      className={`p-2 rounded-lg bg-black/20 border border-zinc-800 ${
                        currentPhase === index && isAnimating ? 'border-primary/50' : ''
                      }`}
                    >
                      <p className={`text-xs font-medium bg-gradient-to-r ${phase.color} bg-clip-text text-transparent`}>
                        {phase.label}: {tempo[index]}s
                      </p>
                      <p className="text-gray-600 text-xs">{phase.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reps & Sets */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Reps per Set</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={reps}
                    onChange={(e) => setReps(Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))}
                    className="w-full bg-black/50 border border-zinc-700 rounded-xl px-4 py-3 text-white text-xl font-mono text-center focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Number of Sets</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={sets}
                    onChange={(e) => setSets(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                    className="w-full bg-black/50 border border-zinc-700 rounded-xl px-4 py-3 text-white text-xl font-mono text-center focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>

              {/* Preset Tempos */}
              <div>
                <p className="text-gray-400 text-sm mb-3">Preset Tempos</p>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_TEMPOS.map(preset => (
                    <button
                      key={preset.name}
                      onClick={() => applyPreset(preset)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        tempo.join('-') === preset.tempo.join('-')
                          ? 'bg-primary/10 border-primary/50'
                          : 'bg-black/30 border-zinc-800 hover:border-zinc-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-white text-sm font-medium">{preset.name}</p>
                        <span className="text-primary text-xs">{preset.tempo.join('-')}</span>
                      </div>
                      <p className="text-gray-500 text-xs">{preset.goal}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Visualization & Results */}
            <div className="space-y-6">
              {/* Animation Visualization */}
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl border border-zinc-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Rep Visualization</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={resetAnimation}
                      className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                    >
                      <RotateCcw className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={isAnimating ? stopAnimation : startAnimation}
                      className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
                        isAnimating
                          ? 'bg-red-500 text-white'
                          : 'bg-primary text-black'
                      }`}
                    >
                      {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      {isAnimating ? 'Stop' : 'Demo'}
                    </button>
                  </div>
                </div>

                {/* Weight Animation */}
                <div className="relative h-48 bg-black/30 rounded-xl overflow-hidden mb-4">
                  {/* Track */}
                  <div className="absolute left-1/2 top-4 bottom-4 w-1 bg-zinc-700 -translate-x-1/2" />

                  {/* Weight */}
                  <motion.div
                    className="absolute left-1/2 -translate-x-1/2 w-24 h-12 bg-gradient-to-r from-primary to-orange-500 rounded-lg flex items-center justify-center"
                    animate={{ top: `${(getWeightPosition() / 100) * 144 + 16}px` }}
                    transition={{ duration: 0.05 }}
                  >
                    <span className="text-black font-bold text-sm">
                      {isAnimating ? TEMPO_PHASES[currentPhase].label : 'Ready'}
                    </span>
                  </motion.div>

                  {/* Labels */}
                  <div className="absolute top-2 left-4 text-gray-600 text-xs">TOP</div>
                  <div className="absolute bottom-2 left-4 text-gray-600 text-xs">BOTTOM</div>

                  {/* Rep Counter */}
                  <div className="absolute top-4 right-4 text-right">
                    <p className="text-gray-500 text-xs">Rep</p>
                    <p className="text-white font-bold text-2xl">{currentRep}/{reps}</p>
                  </div>

                  {/* Phase Progress */}
                  {isAnimating && tempo[currentPhase] > 0 && (
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="h-1 bg-zinc-700 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${TEMPO_PHASES[currentPhase].color}`}
                          style={{ width: `${phaseProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Current Phase Display */}
                <div className="grid grid-cols-4 gap-1">
                  {TEMPO_PHASES.map((phase, index) => (
                    <div
                      key={phase.key}
                      className={`p-2 rounded-lg text-center transition-all ${
                        currentPhase === index && isAnimating
                          ? `bg-gradient-to-r ${phase.color}`
                          : 'bg-black/20'
                      }`}
                    >
                      <p className={`text-xs font-medium ${
                        currentPhase === index && isAnimating ? 'text-white' : 'text-gray-500'
                      }`}>
                        {phase.label.split(' ')[0]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Results */}
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl border border-zinc-800 p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Timer className="w-5 h-5 text-primary" />
                  Time Under Tension
                </h3>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-black/30 rounded-xl p-4 text-center border border-zinc-800">
                    <p className="text-gray-500 text-xs mb-1">Per Rep</p>
                    <p className="text-2xl font-bold text-white">{calculations.repDuration}s</p>
                  </div>
                  <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl p-4 text-center border border-primary/30">
                    <p className="text-primary text-xs mb-1">Per Set</p>
                    <p className="text-2xl font-bold text-white">{formatTime(calculations.setTUT)}</p>
                  </div>
                  <div className="bg-black/30 rounded-xl p-4 text-center border border-zinc-800">
                    <p className="text-gray-500 text-xs mb-1">Total ({sets} sets)</p>
                    <p className="text-2xl font-bold text-white">{formatTime(calculations.totalTUT)}</p>
                  </div>
                </div>

                {/* Training Goal */}
                <div className={`p-4 rounded-xl bg-black/30 border border-zinc-800 mb-4`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-bold ${calculations.recommendation.color}`}>
                        {calculations.recommendation.label} Zone
                      </p>
                      <p className="text-gray-500 text-sm">{calculations.recommendation.description}</p>
                    </div>
                    <TrendingUp className={`w-6 h-6 ${calculations.recommendation.color}`} />
                  </div>
                </div>

                {/* Phase Breakdown */}
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">Phase Breakdown (per set)</p>
                  <div className="flex gap-1 h-4 rounded-full overflow-hidden">
                    {calculations.eccentricTime > 0 && (
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full"
                        style={{ width: `${(calculations.eccentricTime / calculations.setTUT) * 100}%` }}
                        title={`Eccentric: ${calculations.eccentricTime}s`}
                      />
                    )}
                    {calculations.pauseTime > 0 && (
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-full"
                        style={{ width: `${(calculations.pauseTime / calculations.setTUT) * 100}%` }}
                        title={`Pause: ${calculations.pauseTime}s`}
                      />
                    )}
                    {calculations.concentricTime > 0 && (
                      <div
                        className="bg-gradient-to-r from-orange-500 to-red-500 h-full"
                        style={{ width: `${(calculations.concentricTime / calculations.setTUT) * 100}%` }}
                        title={`Concentric: ${calculations.concentricTime}s`}
                      />
                    )}
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Eccentric: {calculations.eccentricTime}s</span>
                    <span>Pause: {calculations.pauseTime}s</span>
                    <span>Concentric: {calculations.concentricTime}s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TUT Zone Reference */}
          <div className="mt-6 bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl border border-zinc-800 p-6">
            <h4 className="text-white font-semibold mb-4">TUT Zone Reference (per set)</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {TUT_RECOMMENDATIONS.map(rec => (
                <div
                  key={rec.label}
                  className={`p-4 rounded-xl bg-black/30 border border-zinc-800 ${
                    calculations.recommendation.label === rec.label ? 'ring-2 ring-primary/50' : ''
                  }`}
                >
                  <p className={`font-bold ${rec.color}`}>{rec.label}</p>
                  <p className="text-gray-600 text-sm">{rec.range[0]}-{rec.range[1]}s TUT</p>
                  <p className="text-gray-500 text-xs mt-1">{rec.description}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
