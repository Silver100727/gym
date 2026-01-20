import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, DollarSign, Star, Check, ChevronDown, ChevronUp, ShoppingCart, Ruler } from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

const EQUIPMENT_TIERS = [
  {
    id: 'essential',
    name: 'Essential Starter',
    budget: '$100-300',
    space: '6x6 ft',
    icon: '🌱',
    description: 'Perfect for beginners with limited space and budget',
    equipment: [
      { name: 'Resistance Bands Set', price: '$20-40', priority: 'must-have', uses: 'Full body workouts, warm-ups, mobility' },
      { name: 'Adjustable Dumbbells (5-25 lbs)', price: '$50-150', priority: 'must-have', uses: 'Upper body, lower body, core' },
      { name: 'Yoga Mat', price: '$15-30', priority: 'must-have', uses: 'Floor exercises, stretching, comfort' },
      { name: 'Pull-up Bar (doorway)', price: '$20-40', priority: 'recommended', uses: 'Back, biceps, core' },
      { name: 'Ab Wheel', price: '$10-20', priority: 'nice-to-have', uses: 'Core strength' },
    ],
  },
  {
    id: 'intermediate',
    name: 'Intermediate Setup',
    budget: '$500-1500',
    space: '10x10 ft',
    icon: '💪',
    description: 'For dedicated lifters wanting variety',
    equipment: [
      { name: 'Adjustable Dumbbells (5-50 lbs)', price: '$200-400', priority: 'must-have', uses: 'Progressive overload on all exercises' },
      { name: 'Adjustable Bench', price: '$100-250', priority: 'must-have', uses: 'Bench press, rows, step-ups' },
      { name: 'Kettlebell Set', price: '$100-200', priority: 'recommended', uses: 'Swings, goblet squats, Turkish get-ups' },
      { name: 'Barbell + Plates (100-150 lbs)', price: '$150-300', priority: 'recommended', uses: 'Compound lifts' },
      { name: 'Resistance Bands (Heavy)', price: '$30-50', priority: 'recommended', uses: 'Assisted exercises, added resistance' },
      { name: 'Jump Rope', price: '$10-30', priority: 'nice-to-have', uses: 'Cardio, warm-up, coordination' },
      { name: 'Foam Roller', price: '$20-40', priority: 'nice-to-have', uses: 'Recovery, myofascial release' },
    ],
  },
  {
    id: 'advanced',
    name: 'Complete Home Gym',
    budget: '$2000-5000+',
    space: '12x12 ft minimum',
    icon: '🏆',
    description: 'Commercial-quality equipment for serious training',
    equipment: [
      { name: 'Power Rack/Squat Rack', price: '$300-1000', priority: 'must-have', uses: 'Squats, bench press, pull-ups, safety' },
      { name: 'Olympic Barbell (45 lbs)', price: '$150-350', priority: 'must-have', uses: 'All barbell movements' },
      { name: 'Bumper Plates (300+ lbs)', price: '$400-800', priority: 'must-have', uses: 'Progressive loading, Olympic lifts' },
      { name: 'Adjustable Bench (FID)', price: '$200-500', priority: 'must-have', uses: 'Flat, incline, decline positions' },
      { name: 'Cable Machine / Pulley System', price: '$200-1000', priority: 'recommended', uses: 'Isolation exercises, constant tension' },
      { name: 'Dumbbell Set (5-75 lbs)', price: '$500-1500', priority: 'recommended', uses: 'Full range of dumbbell exercises' },
      { name: 'Cardio Equipment', price: '$200-2000', priority: 'recommended', uses: 'Rower, bike, or treadmill' },
      { name: 'Gym Flooring', price: '$100-400', priority: 'recommended', uses: 'Protection, noise reduction, safety' },
      { name: 'Mirror', price: '$50-200', priority: 'nice-to-have', uses: 'Form check, motivation' },
      { name: 'Timer/Clock', price: '$20-50', priority: 'nice-to-have', uses: 'Rest periods, interval training' },
    ],
  },
];

const SPACE_TIPS = [
  { title: 'Garage Gym', space: '1-2 car garage', tip: 'Most popular option. Consider climate control and flooring protection.' },
  { title: 'Spare Room', space: '10x10 ft', tip: 'Perfect for adjustable equipment. Watch out for floor weight limits.' },
  { title: 'Basement', space: 'Varies', tip: 'Check ceiling height (8ft+ ideal). Address moisture concerns.' },
  { title: 'Outdoor Space', space: 'Deck/Patio', tip: 'Weather protection needed. Great for fresh air training.' },
];

const BUYING_TIPS = [
  'Buy used equipment from Facebook Marketplace, Craigslist, or gym liquidations',
  'Prioritize adjustable equipment to save space and money',
  'Invest in quality for items that bear load (rack, barbell)',
  'Check weight capacity ratings before purchasing',
  'Consider noise if you have neighbors or family',
  'Look for equipment with good warranties',
];

export default function HomeGymGuide() {
  const [expandedTier, setExpandedTier] = useState('essential');

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'must-have': return 'bg-red-500/20 text-red-400';
      case 'recommended': return 'bg-yellow-500/20 text-yellow-400';
      case 'nice-to-have': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
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
            <Home className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium">Equipment Guide</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Home Gym <span className="text-primary">Setup</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Build your perfect home gym based on your budget and space
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Equipment Tiers */}
          <motion.div variants={fadeUp} className="space-y-4 mb-12">
            {EQUIPMENT_TIERS.map((tier, idx) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-gradient-to-br rounded-2xl border overflow-hidden ${
                  expandedTier === tier.id
                    ? 'from-primary/10 to-zinc-900/50 border-primary/30'
                    : 'from-zinc-900 to-zinc-900/50 border-zinc-800'
                }`}
              >
                <button
                  onClick={() => setExpandedTier(expandedTier === tier.id ? null : tier.id)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{tier.icon}</span>
                    <div>
                      <h3 className="text-white font-semibold text-lg">{tier.name}</h3>
                      <p className="text-gray-500 text-sm">{tier.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden md:block">
                      <div className="flex items-center gap-2 text-primary">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-semibold">{tier.budget}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Ruler className="w-4 h-4" />
                        <span>{tier.space}</span>
                      </div>
                    </div>
                    {expandedTier === tier.id ? (
                      <ChevronUp className="w-6 h-6 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {expandedTier === tier.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-zinc-800"
                    >
                      <div className="p-6">
                        {/* Mobile stats */}
                        <div className="flex gap-4 mb-4 md:hidden">
                          <div className="flex items-center gap-2 text-primary">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-semibold">{tier.budget}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Ruler className="w-4 h-4" />
                            <span>{tier.space}</span>
                          </div>
                        </div>

                        {/* Equipment Grid */}
                        <div className="grid md:grid-cols-2 gap-4">
                          {tier.equipment.map((item, itemIdx) => (
                            <motion.div
                              key={itemIdx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: itemIdx * 0.05 }}
                              className="bg-zinc-800/50 rounded-xl p-4"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="text-white font-medium">{item.name}</h4>
                                <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(item.priority)}`}>
                                  {item.priority.replace('-', ' ')}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-sm mb-2">
                                <span className="text-primary font-medium">{item.price}</span>
                              </div>
                              <p className="text-gray-500 text-sm">{item.uses}</p>
                            </motion.div>
                          ))}
                        </div>

                        {/* Estimated Total */}
                        <div className="mt-4 p-4 bg-primary/10 rounded-xl flex items-center justify-between">
                          <span className="text-gray-400">Estimated Total:</span>
                          <span className="text-primary font-bold text-xl">{tier.budget}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>

          {/* Space Tips */}
          <motion.div variants={fadeUp} className="mb-8">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Ruler className="w-5 h-5 text-primary" />
              Space Recommendations
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {SPACE_TIPS.map((tip, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-xl p-4 border border-zinc-800"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium">{tip.title}</h4>
                    <span className="text-primary text-sm">{tip.space}</span>
                  </div>
                  <p className="text-gray-500 text-sm">{tip.tip}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Buying Tips */}
          <motion.div variants={fadeUp}>
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                Smart Buying Tips
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {BUYING_TIPS.map((tip, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                    <p className="text-gray-400 text-sm">{tip}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Bottom Tip */}
          <motion.div
            variants={fadeUp}
            className="mt-8 bg-primary/5 border border-primary/20 rounded-xl p-4"
          >
            <p className="text-sm text-gray-400">
              <span className="text-primary font-medium">Start Small: </span>
              You don't need everything at once. Start with essentials and gradually
              build your gym as your training evolves and budget allows.
            </p>
          </motion.div>
        </div>

        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-primary/20 rounded-tl-3xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-primary/20 rounded-br-3xl" />
      </motion.div>
    </section>
  );
}
