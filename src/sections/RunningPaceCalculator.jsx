import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Timer, Play, MapPin, Zap, TrendingUp, Clock, Route } from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

const RACE_DISTANCES = [
  { id: '1k', name: '1K', km: 1, miles: 0.621 },
  { id: '5k', name: '5K', km: 5, miles: 3.107 },
  { id: '10k', name: '10K', km: 10, miles: 6.214 },
  { id: 'half', name: 'Half Marathon', km: 21.0975, miles: 13.109 },
  { id: 'full', name: 'Marathon', km: 42.195, miles: 26.219 },
  { id: '50k', name: '50K Ultra', km: 50, miles: 31.069 },
];

const PACE_ZONES = [
  { name: 'Easy/Recovery', minPace: 6.5, maxPace: 8, color: 'from-green-500 to-emerald-500', description: 'Conversational pace' },
  { name: 'Aerobic', minPace: 5.5, maxPace: 6.5, color: 'from-blue-500 to-cyan-500', description: 'Moderate effort' },
  { name: 'Tempo', minPace: 4.5, maxPace: 5.5, color: 'from-yellow-500 to-amber-500', description: 'Comfortably hard' },
  { name: 'Threshold', minPace: 4, maxPace: 4.5, color: 'from-orange-500 to-red-500', description: 'Hard but sustainable' },
  { name: 'Interval', minPace: 3, maxPace: 4, color: 'from-red-500 to-rose-500', description: 'Very hard' },
  { name: 'Sprint', minPace: 0, maxPace: 3, color: 'from-purple-500 to-pink-500', description: 'Maximum effort' },
];

const formatTime = (totalSeconds) => {
  if (!totalSeconds || totalSeconds < 0 || !isFinite(totalSeconds)) return '--:--:--';

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.round(totalSeconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const formatPace = (secondsPerKm) => {
  if (!secondsPerKm || secondsPerKm < 0 || !isFinite(secondsPerKm)) return '--:--';

  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = Math.round(secondsPerKm % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export default function RunningPaceCalculator() {
  const [calcMode, setCalcMode] = useState('pace'); // 'pace', 'time', 'distance'
  const [unit, setUnit] = useState('km'); // 'km' or 'miles'

  // Time inputs
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);
  const [seconds, setSeconds] = useState(0);

  // Distance input
  const [distance, setDistance] = useState(5);
  const [selectedRace, setSelectedRace] = useState('5k');

  // Pace input (for time/distance calc)
  const [paceMin, setPaceMin] = useState(5);
  const [paceSec, setPaceSec] = useState(30);

  const calculations = useMemo(() => {
    const totalTimeSeconds = (hours * 3600) + (minutes * 60) + seconds;
    const paceInSeconds = (paceMin * 60) + paceSec;
    const distanceInKm = unit === 'km' ? distance : distance * 1.60934;

    let pace, time, speed;

    if (calcMode === 'pace') {
      // Calculate pace from time and distance
      if (distanceInKm > 0 && totalTimeSeconds > 0) {
        pace = totalTimeSeconds / distanceInKm; // seconds per km
        time = totalTimeSeconds;
        speed = (distanceInKm / totalTimeSeconds) * 3600; // km/h
      }
    } else if (calcMode === 'time') {
      // Calculate time from pace and distance
      if (paceInSeconds > 0 && distanceInKm > 0) {
        pace = paceInSeconds;
        time = paceInSeconds * distanceInKm;
        speed = (60 / paceMin) + (paceSec > 0 ? (60 / (paceMin + paceSec/60)) - (60 / paceMin) : 0);
        speed = 60 / (paceInSeconds / 60); // km/h
      }
    } else if (calcMode === 'distance') {
      // Calculate distance from pace and time
      if (paceInSeconds > 0 && totalTimeSeconds > 0) {
        pace = paceInSeconds;
        const calculatedDistance = totalTimeSeconds / paceInSeconds;
        time = totalTimeSeconds;
        speed = 60 / (paceInSeconds / 60);
        return {
          pace,
          pacePerMile: pace * 1.60934,
          time,
          distance: calculatedDistance,
          distanceMiles: calculatedDistance / 1.60934,
          speed,
          speedMph: speed / 1.60934,
        };
      }
    }

    return {
      pace: pace || 0,
      pacePerMile: (pace || 0) * 1.60934,
      time: time || 0,
      distance: distanceInKm,
      distanceMiles: distanceInKm / 1.60934,
      speed: speed || 0,
      speedMph: (speed || 0) / 1.60934,
    };
  }, [calcMode, hours, minutes, seconds, distance, unit, paceMin, paceSec]);

  const getPaceZone = (paceMinPerKm) => {
    return PACE_ZONES.find(zone => paceMinPerKm >= zone.minPace && paceMinPerKm < zone.maxPace) || PACE_ZONES[0];
  };

  const paceMinPerKm = calculations.pace / 60;
  const currentZone = getPaceZone(paceMinPerKm);

  const splits = useMemo(() => {
    if (!calculations.pace || calculations.pace <= 0) return [];

    const splitDistance = unit === 'km' ? 1 : 1.60934; // 1km or 1 mile in km
    const totalDist = calculations.distance;
    const splitCount = Math.ceil(totalDist / splitDistance);

    return Array.from({ length: Math.min(splitCount, 50) }, (_, i) => {
      const splitNum = i + 1;
      const distanceCovered = Math.min(splitNum * splitDistance, totalDist);
      const timeAtSplit = distanceCovered * calculations.pace;
      const isPartial = splitNum * splitDistance > totalDist;

      return {
        split: splitNum,
        distance: unit === 'km' ? distanceCovered : distanceCovered / 1.60934,
        time: timeAtSplit,
        isPartial,
      };
    });
  }, [calculations, unit]);

  const handleRaceSelect = (raceId) => {
    setSelectedRace(raceId);
    const race = RACE_DISTANCES.find(r => r.id === raceId);
    if (race) {
      setDistance(unit === 'km' ? race.km : race.miles);
    }
  };

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
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
            <Timer className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium">Running Calculator</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Running <span className="text-primary">Pace</span> Calculator
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Calculate your pace, finish time, or distance for any run
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl border border-zinc-800 p-6 md:p-8">
            {/* Calculation Mode */}
            <div className="mb-6">
              <p className="text-gray-400 text-sm mb-3">I want to calculate:</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'pace', label: 'Pace', icon: Zap, desc: 'from time & distance' },
                  { id: 'time', label: 'Time', icon: Clock, desc: 'from pace & distance' },
                  { id: 'distance', label: 'Distance', icon: Route, desc: 'from pace & time' },
                ].map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setCalcMode(mode.id)}
                    className={`p-4 rounded-xl border transition-all ${
                      calcMode === mode.id
                        ? 'bg-primary/10 border-primary/50 text-primary'
                        : 'bg-black/30 border-zinc-800 text-gray-400 hover:border-zinc-600'
                    }`}
                  >
                    <mode.icon className="w-5 h-5 mx-auto mb-2" />
                    <p className="font-medium">{mode.label}</p>
                    <p className="text-xs opacity-60">{mode.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Unit Toggle */}
            <div className="flex justify-center mb-6">
              <div className="bg-black/50 rounded-xl p-1 inline-flex">
                <button
                  onClick={() => {
                    setUnit('km');
                    const race = RACE_DISTANCES.find(r => r.id === selectedRace);
                    if (race) setDistance(race.km);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    unit === 'km' ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Kilometers
                </button>
                <button
                  onClick={() => {
                    setUnit('miles');
                    const race = RACE_DISTANCES.find(r => r.id === selectedRace);
                    if (race) setDistance(race.miles);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    unit === 'miles' ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Miles
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Input Section */}
              <div className="space-y-6">
                {/* Time Input (for pace and distance calc) */}
                {(calcMode === 'pace' || calcMode === 'distance') && (
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Time</label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <input
                          type="number"
                          min="0"
                          max="23"
                          value={hours}
                          onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full bg-black/50 border border-zinc-700 rounded-xl px-4 py-3 text-white text-center text-xl font-mono focus:outline-none focus:border-primary/50"
                        />
                        <p className="text-gray-600 text-xs text-center mt-1">Hours</p>
                      </div>
                      <span className="text-gray-600 text-2xl self-start mt-3">:</span>
                      <div className="flex-1">
                        <input
                          type="number"
                          min="0"
                          max="59"
                          value={minutes}
                          onChange={(e) => setMinutes(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                          className="w-full bg-black/50 border border-zinc-700 rounded-xl px-4 py-3 text-white text-center text-xl font-mono focus:outline-none focus:border-primary/50"
                        />
                        <p className="text-gray-600 text-xs text-center mt-1">Minutes</p>
                      </div>
                      <span className="text-gray-600 text-2xl self-start mt-3">:</span>
                      <div className="flex-1">
                        <input
                          type="number"
                          min="0"
                          max="59"
                          value={seconds}
                          onChange={(e) => setSeconds(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                          className="w-full bg-black/50 border border-zinc-700 rounded-xl px-4 py-3 text-white text-center text-xl font-mono focus:outline-none focus:border-primary/50"
                        />
                        <p className="text-gray-600 text-xs text-center mt-1">Seconds</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pace Input (for time and distance calc) */}
                {(calcMode === 'time' || calcMode === 'distance') && (
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Pace (per {unit === 'km' ? 'km' : 'mile'})</label>
                    <div className="flex gap-2 items-center">
                      <div className="flex-1">
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={paceMin}
                          onChange={(e) => setPaceMin(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full bg-black/50 border border-zinc-700 rounded-xl px-4 py-3 text-white text-center text-xl font-mono focus:outline-none focus:border-primary/50"
                        />
                        <p className="text-gray-600 text-xs text-center mt-1">Minutes</p>
                      </div>
                      <span className="text-gray-600 text-2xl">:</span>
                      <div className="flex-1">
                        <input
                          type="number"
                          min="0"
                          max="59"
                          value={paceSec}
                          onChange={(e) => setPaceSec(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                          className="w-full bg-black/50 border border-zinc-700 rounded-xl px-4 py-3 text-white text-center text-xl font-mono focus:outline-none focus:border-primary/50"
                        />
                        <p className="text-gray-600 text-xs text-center mt-1">Seconds</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Distance Input (for pace and time calc) */}
                {(calcMode === 'pace' || calcMode === 'time') && (
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Distance ({unit})</label>
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={distance}
                      onChange={(e) => {
                        setDistance(parseFloat(e.target.value) || 0);
                        setSelectedRace('');
                      }}
                      className="w-full bg-black/50 border border-zinc-700 rounded-xl px-4 py-3 text-white text-xl font-mono focus:outline-none focus:border-primary/50"
                    />

                    {/* Quick Race Distances */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {RACE_DISTANCES.map(race => (
                        <button
                          key={race.id}
                          onClick={() => handleRaceSelect(race.id)}
                          className={`px-3 py-1 rounded-lg text-sm transition-all ${
                            selectedRace === race.id
                              ? 'bg-primary text-black'
                              : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                          }`}
                        >
                          {race.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Results Section */}
              <div className="space-y-4">
                {/* Main Result */}
                <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl p-6 border border-primary/30">
                  <p className="text-primary text-sm mb-1">
                    {calcMode === 'pace' ? 'Your Pace' : calcMode === 'time' ? 'Finish Time' : 'Distance'}
                  </p>
                  <p className="text-4xl font-bold text-white font-mono">
                    {calcMode === 'pace' && `${formatPace(calculations.pace)} /${unit === 'km' ? 'km' : 'mi'}`}
                    {calcMode === 'time' && formatTime(calculations.time)}
                    {calcMode === 'distance' && `${calculations.distance.toFixed(2)} km`}
                  </p>
                  {calcMode === 'pace' && calculations.pace > 0 && (
                    <p className="text-gray-400 text-sm mt-1">
                      {formatPace(calculations.pacePerMile)} /mile
                    </p>
                  )}
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-black/30 rounded-xl p-4 border border-zinc-800">
                    <p className="text-gray-500 text-xs mb-1">Speed</p>
                    <p className="text-white font-bold font-mono">
                      {calculations.speed > 0 ? `${calculations.speed.toFixed(1)} km/h` : '--'}
                    </p>
                    <p className="text-gray-600 text-xs">
                      {calculations.speedMph > 0 ? `${calculations.speedMph.toFixed(1)} mph` : ''}
                    </p>
                  </div>
                  <div className="bg-black/30 rounded-xl p-4 border border-zinc-800">
                    <p className="text-gray-500 text-xs mb-1">Pace Zone</p>
                    <p className={`font-bold bg-gradient-to-r ${currentZone.color} bg-clip-text text-transparent`}>
                      {paceMinPerKm > 0 && paceMinPerKm < 15 ? currentZone.name : '--'}
                    </p>
                    <p className="text-gray-600 text-xs">{currentZone.description}</p>
                  </div>
                </div>

                {/* Race Predictions */}
                {calcMode === 'pace' && calculations.pace > 0 && (
                  <div className="bg-black/30 rounded-xl p-4 border border-zinc-800">
                    <p className="text-gray-400 text-sm mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Race Predictions
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      {RACE_DISTANCES.slice(1, 4).map(race => (
                        <div key={race.id}>
                          <p className="text-gray-500 text-xs">{race.name}</p>
                          <p className="text-white font-mono text-sm">
                            {formatTime(calculations.pace * race.km)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Splits Table */}
            {splits.length > 0 && splits.length <= 20 && (
              <div className="mt-8">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Split Times
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {splits.map((split) => (
                    <div
                      key={split.split}
                      className={`bg-black/30 rounded-lg p-3 border border-zinc-800 ${
                        split.isPartial ? 'opacity-70' : ''
                      }`}
                    >
                      <p className="text-gray-500 text-xs">
                        {unit === 'km' ? 'KM' : 'Mile'} {split.split}
                        {split.isPartial && ' (partial)'}
                      </p>
                      <p className="text-white font-mono">{formatTime(split.time)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pace Zones Reference */}
            <div className="mt-8 pt-6 border-t border-zinc-800">
              <h4 className="text-white font-semibold mb-4">Pace Zone Reference</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {PACE_ZONES.map(zone => (
                  <div
                    key={zone.name}
                    className={`rounded-lg p-3 bg-gradient-to-br ${zone.color} bg-opacity-10`}
                    style={{ background: `linear-gradient(135deg, ${zone.color.includes('green') ? 'rgba(34,197,94,0.1)' : zone.color.includes('blue') ? 'rgba(59,130,246,0.1)' : zone.color.includes('yellow') ? 'rgba(234,179,8,0.1)' : zone.color.includes('orange') ? 'rgba(249,115,22,0.1)' : zone.color.includes('red') ? 'rgba(239,68,68,0.1)' : 'rgba(168,85,247,0.1)'}, transparent)` }}
                  >
                    <p className="text-white text-sm font-medium">{zone.name}</p>
                    <p className="text-gray-400 text-xs">
                      {zone.maxPace > 0 ? `${zone.minPace}-${zone.maxPace}` : `<${zone.minPace}`} min/km
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-primary/30 rounded-tl-2xl" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-primary/30 rounded-br-2xl" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
