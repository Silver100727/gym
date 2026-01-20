import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Scale, Ruler, Gauge, Timer, Thermometer, RefreshCw } from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

const CONVERSION_CATEGORIES = [
  {
    id: 'weight',
    name: 'Weight',
    icon: Scale,
    color: 'from-blue-500 to-cyan-500',
    units: [
      { id: 'lbs', name: 'Pounds', symbol: 'lbs' },
      { id: 'kg', name: 'Kilograms', symbol: 'kg' },
      { id: 'oz', name: 'Ounces', symbol: 'oz' },
      { id: 'stone', name: 'Stone', symbol: 'st' },
    ],
    conversions: {
      lbs: { kg: 0.453592, oz: 16, stone: 0.0714286 },
      kg: { lbs: 2.20462, oz: 35.274, stone: 0.157473 },
      oz: { lbs: 0.0625, kg: 0.0283495, stone: 0.00446429 },
      stone: { lbs: 14, kg: 6.35029, oz: 224 },
    },
    quickRef: [
      { from: 45, unit: 'lbs', equals: '20.4 kg' },
      { from: 135, unit: 'lbs', equals: '61.2 kg' },
      { from: 225, unit: 'lbs', equals: '102.1 kg' },
      { from: 315, unit: 'lbs', equals: '142.9 kg' },
    ],
  },
  {
    id: 'distance',
    name: 'Distance',
    icon: Ruler,
    color: 'from-green-500 to-emerald-500',
    units: [
      { id: 'miles', name: 'Miles', symbol: 'mi' },
      { id: 'km', name: 'Kilometers', symbol: 'km' },
      { id: 'meters', name: 'Meters', symbol: 'm' },
      { id: 'yards', name: 'Yards', symbol: 'yd' },
      { id: 'feet', name: 'Feet', symbol: 'ft' },
    ],
    conversions: {
      miles: { km: 1.60934, meters: 1609.34, yards: 1760, feet: 5280 },
      km: { miles: 0.621371, meters: 1000, yards: 1093.61, feet: 3280.84 },
      meters: { miles: 0.000621371, km: 0.001, yards: 1.09361, feet: 3.28084 },
      yards: { miles: 0.000568182, km: 0.0009144, meters: 0.9144, feet: 3 },
      feet: { miles: 0.000189394, km: 0.0003048, meters: 0.3048, yards: 0.333333 },
    },
    quickRef: [
      { from: 1, unit: 'miles', equals: '1.61 km' },
      { from: 5, unit: 'km', equals: '3.11 mi' },
      { from: 10, unit: 'km', equals: '6.21 mi' },
      { from: 26.2, unit: 'miles', equals: '42.2 km' },
    ],
  },
  {
    id: 'height',
    name: 'Height',
    icon: Ruler,
    color: 'from-purple-500 to-pink-500',
    units: [
      { id: 'cm', name: 'Centimeters', symbol: 'cm' },
      { id: 'inches', name: 'Inches', symbol: 'in' },
      { id: 'feet', name: 'Feet', symbol: 'ft' },
      { id: 'meters', name: 'Meters', symbol: 'm' },
    ],
    conversions: {
      cm: { inches: 0.393701, feet: 0.0328084, meters: 0.01 },
      inches: { cm: 2.54, feet: 0.0833333, meters: 0.0254 },
      feet: { cm: 30.48, inches: 12, meters: 0.3048 },
      meters: { cm: 100, inches: 39.3701, feet: 3.28084 },
    },
    quickRef: [
      { from: '5\'6"', unit: 'ft/in', equals: '167.6 cm' },
      { from: '5\'10"', unit: 'ft/in', equals: '177.8 cm' },
      { from: '6\'0"', unit: 'ft/in', equals: '182.9 cm' },
      { from: '6\'2"', unit: 'ft/in', equals: '188.0 cm' },
    ],
  },
  {
    id: 'pace',
    name: 'Running Pace',
    icon: Timer,
    color: 'from-orange-500 to-red-500',
    units: [
      { id: 'minMile', name: 'Min/Mile', symbol: 'min/mi' },
      { id: 'minKm', name: 'Min/Km', symbol: 'min/km' },
      { id: 'mph', name: 'Miles/Hour', symbol: 'mph' },
      { id: 'kmh', name: 'Km/Hour', symbol: 'km/h' },
    ],
    conversions: {
      minMile: { minKm: 0.621371, mph: 'pace', kmh: 'pace' },
      minKm: { minMile: 1.60934, mph: 'pace', kmh: 'pace' },
      mph: { minMile: 'speed', minKm: 'speed', kmh: 1.60934 },
      kmh: { minMile: 'speed', minKm: 'speed', mph: 0.621371 },
    },
    quickRef: [
      { from: '8:00', unit: 'min/mi', equals: '4:58 min/km' },
      { from: '5:00', unit: 'min/km', equals: '8:03 min/mi' },
      { from: '6', unit: 'mph', equals: '9.66 km/h' },
      { from: '10', unit: 'km/h', equals: '6.21 mph' },
    ],
  },
  {
    id: 'temperature',
    name: 'Temperature',
    icon: Thermometer,
    color: 'from-red-500 to-yellow-500',
    units: [
      { id: 'fahrenheit', name: 'Fahrenheit', symbol: '°F' },
      { id: 'celsius', name: 'Celsius', symbol: '°C' },
    ],
    conversions: {
      fahrenheit: { celsius: 'temp' },
      celsius: { fahrenheit: 'temp' },
    },
    quickRef: [
      { from: 32, unit: '°F', equals: '0°C' },
      { from: 68, unit: '°F', equals: '20°C' },
      { from: 98.6, unit: '°F', equals: '37°C' },
      { from: 100, unit: '°F', equals: '37.8°C' },
    ],
  },
  {
    id: 'volume',
    name: 'Volume',
    icon: Gauge,
    color: 'from-cyan-500 to-blue-500',
    units: [
      { id: 'ml', name: 'Milliliters', symbol: 'ml' },
      { id: 'oz', name: 'Fluid Ounces', symbol: 'fl oz' },
      { id: 'cups', name: 'Cups', symbol: 'cups' },
      { id: 'liters', name: 'Liters', symbol: 'L' },
      { id: 'gallons', name: 'Gallons', symbol: 'gal' },
    ],
    conversions: {
      ml: { oz: 0.033814, cups: 0.00422675, liters: 0.001, gallons: 0.000264172 },
      oz: { ml: 29.5735, cups: 0.125, liters: 0.0295735, gallons: 0.0078125 },
      cups: { ml: 236.588, oz: 8, liters: 0.236588, gallons: 0.0625 },
      liters: { ml: 1000, oz: 33.814, cups: 4.22675, gallons: 0.264172 },
      gallons: { ml: 3785.41, oz: 128, cups: 16, liters: 3.78541 },
    },
    quickRef: [
      { from: 8, unit: 'fl oz', equals: '237 ml' },
      { from: 500, unit: 'ml', equals: '16.9 fl oz' },
      { from: 1, unit: 'L', equals: '33.8 fl oz' },
      { from: 1, unit: 'gal', equals: '3.79 L' },
    ],
  },
];

export default function FitnessUnitConverter() {
  const [selectedCategory, setSelectedCategory] = useState(CONVERSION_CATEGORIES[0]);
  const [fromUnit, setFromUnit] = useState(selectedCategory.units[0].id);
  const [toUnit, setToUnit] = useState(selectedCategory.units[1].id);
  const [inputValue, setInputValue] = useState('100');

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setFromUnit(category.units[0].id);
    setToUnit(category.units[1].id);
    setInputValue('100');
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const convertedValue = useMemo(() => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return '';

    // Handle temperature separately
    if (selectedCategory.id === 'temperature') {
      if (fromUnit === 'fahrenheit' && toUnit === 'celsius') {
        return ((value - 32) * 5 / 9).toFixed(2);
      } else if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
        return (value * 9 / 5 + 32).toFixed(2);
      }
      return value.toFixed(2);
    }

    // Handle pace conversions separately
    if (selectedCategory.id === 'pace') {
      // Simple conversions for mph/kmh
      if ((fromUnit === 'mph' && toUnit === 'kmh') || (fromUnit === 'kmh' && toUnit === 'mph')) {
        const factor = selectedCategory.conversions[fromUnit][toUnit];
        return (value * factor).toFixed(2);
      }
      // For pace conversions (min/mile, min/km), use direct factor
      if (fromUnit === 'minMile' && toUnit === 'minKm') {
        return (value * 0.621371).toFixed(2);
      }
      if (fromUnit === 'minKm' && toUnit === 'minMile') {
        return (value * 1.60934).toFixed(2);
      }
      // Speed to pace or pace to speed - simplified
      if (fromUnit === 'mph' && toUnit === 'minMile') {
        return (60 / value).toFixed(2);
      }
      if (fromUnit === 'kmh' && toUnit === 'minKm') {
        return (60 / value).toFixed(2);
      }
      return value.toFixed(2);
    }

    // Same unit
    if (fromUnit === toUnit) return value.toFixed(2);

    // Get conversion factor
    const factor = selectedCategory.conversions[fromUnit]?.[toUnit];
    if (!factor) return value.toFixed(2);

    return (value * factor).toFixed(2);
  }, [inputValue, fromUnit, toUnit, selectedCategory]);

  const fromUnitData = selectedCategory.units.find(u => u.id === fromUnit);
  const toUnitData = selectedCategory.units.find(u => u.id === toUnit);
  const CategoryIcon = selectedCategory.icon;

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
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
            <ArrowLeftRight className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium">Unit Converter</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Fitness <span className="text-primary">Unit</span> Converter
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Quickly convert between common fitness measurements
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="max-w-4xl mx-auto">
          {/* Category Selector */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {CONVERSION_CATEGORIES.map(category => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    selectedCategory.id === category.id
                      ? `bg-gradient-to-r ${category.color} text-white`
                      : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Converter */}
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl border border-zinc-800 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedCategory.color} flex items-center justify-center`}>
                  <CategoryIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-semibold">{selectedCategory.name} Converter</h3>
              </div>

              {/* From */}
              <div className="mb-4">
                <label className="text-gray-400 text-sm mb-2 block">From</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1 bg-black/50 border border-zinc-700 rounded-xl px-4 py-3 text-white text-xl font-mono focus:outline-none focus:border-primary/50"
                    placeholder="Enter value"
                  />
                  <select
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                    className="bg-black/50 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50"
                  >
                    {selectedCategory.units.map(unit => (
                      <option key={unit.id} value={unit.id}>{unit.symbol}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center my-4">
                <motion.button
                  onClick={swapUnits}
                  className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-full transition-colors"
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <RefreshCw className="w-5 h-5 text-primary" />
                </motion.button>
              </div>

              {/* To */}
              <div className="mb-6">
                <label className="text-gray-400 text-sm mb-2 block">To</label>
                <div className="flex gap-3">
                  <div className="flex-1 bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl px-4 py-3">
                    <p className="text-primary text-xl font-mono font-bold">
                      {convertedValue || '—'}
                    </p>
                  </div>
                  <select
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value)}
                    className="bg-black/50 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50"
                  >
                    {selectedCategory.units.map(unit => (
                      <option key={unit.id} value={unit.id}>{unit.symbol}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Conversion Summary */}
              <div className="bg-black/30 rounded-xl p-4 border border-zinc-800 text-center">
                <p className="text-gray-400">
                  <span className="text-white font-bold">{inputValue || '0'}</span>
                  <span className="text-gray-500"> {fromUnitData?.name}</span>
                  <span className="text-primary mx-2">=</span>
                  <span className="text-primary font-bold">{convertedValue || '0'}</span>
                  <span className="text-gray-500"> {toUnitData?.name}</span>
                </p>
              </div>
            </div>

            {/* Quick Reference */}
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl border border-zinc-800 p-6">
              <h3 className="text-white font-semibold mb-4">Quick Reference</h3>

              <div className="space-y-3 mb-6">
                {selectedCategory.quickRef.map((ref, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between p-3 bg-black/30 rounded-xl border border-zinc-800"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="text-white font-mono">{ref.from} {ref.unit}</span>
                    <ArrowLeftRight className="w-4 h-4 text-gray-600" />
                    <span className="text-primary font-mono">{ref.equals}</span>
                  </motion.div>
                ))}
              </div>

              {/* Common Gym Weights */}
              {selectedCategory.id === 'weight' && (
                <div className="border-t border-zinc-800 pt-4">
                  <h4 className="text-gray-400 text-sm mb-3">Common Plate Weights</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { lbs: 2.5, kg: 1.1 },
                      { lbs: 5, kg: 2.3 },
                      { lbs: 10, kg: 4.5 },
                      { lbs: 25, kg: 11.3 },
                      { lbs: 35, kg: 15.9 },
                      { lbs: 45, kg: 20.4 },
                    ].map((plate, i) => (
                      <div key={i} className="flex justify-between p-2 bg-black/20 rounded-lg text-sm">
                        <span className="text-white">{plate.lbs} lbs</span>
                        <span className="text-gray-500">{plate.kg} kg</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Race Distances */}
              {selectedCategory.id === 'distance' && (
                <div className="border-t border-zinc-800 pt-4">
                  <h4 className="text-gray-400 text-sm mb-3">Race Distances</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: '5K', km: 5, mi: '3.1 mi' },
                      { name: '10K', km: 10, mi: '6.2 mi' },
                      { name: 'Half', km: 21.1, mi: '13.1 mi' },
                      { name: 'Full', km: 42.2, mi: '26.2 mi' },
                    ].map((race, i) => (
                      <div key={i} className="flex justify-between p-2 bg-black/20 rounded-lg text-sm">
                        <span className="text-white">{race.name}</span>
                        <span className="text-gray-500">{race.mi}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Water Intake Reference */}
              {selectedCategory.id === 'volume' && (
                <div className="border-t border-zinc-800 pt-4">
                  <h4 className="text-gray-400 text-sm mb-3">Water Bottle Sizes</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { oz: 16, ml: 473 },
                      { oz: 20, ml: 591 },
                      { oz: 24, ml: 710 },
                      { oz: 32, ml: 946 },
                    ].map((bottle, i) => (
                      <div key={i} className="flex justify-between p-2 bg-black/20 rounded-lg text-sm">
                        <span className="text-white">{bottle.oz} oz</span>
                        <span className="text-gray-500">{bottle.ml} ml</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pro Tip */}
          <motion.div
            variants={fadeUp}
            className="mt-6 bg-primary/5 border border-primary/20 rounded-xl p-4"
          >
            <p className="text-sm text-gray-400 text-center">
              <span className="text-primary font-medium">Pro Tip: </span>
              {selectedCategory.id === 'weight' && 'Standard Olympic barbells weigh 45 lbs (20.4 kg). Women\'s bars weigh 35 lbs (15.9 kg).'}
              {selectedCategory.id === 'distance' && 'A standard track lap is 400 meters. Four laps equal approximately 1 mile.'}
              {selectedCategory.id === 'height' && 'To convert feet/inches to cm: multiply feet by 30.48 and inches by 2.54, then add together.'}
              {selectedCategory.id === 'pace' && 'To convert min/mile to min/km, multiply by 0.621. For the reverse, multiply by 1.609.'}
              {selectedCategory.id === 'temperature' && 'For a quick estimate: (°F - 30) ÷ 2 ≈ °C. Example: (70-30)÷2 = 20°C'}
              {selectedCategory.id === 'volume' && 'Aim for 0.5-1 oz of water per pound of body weight daily, more during intense exercise.'}
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
