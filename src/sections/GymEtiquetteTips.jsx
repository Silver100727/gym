import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Check, X, AlertTriangle, ThumbsUp, ThumbsDown, ChevronRight } from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

const ETIQUETTE_RULES = [
  {
    category: 'Equipment Usage',
    icon: '🏋️',
    rules: [
      { do: 'Wipe down equipment after use', dont: 'Leave sweat on machines', priority: 'high' },
      { do: 'Re-rack weights when finished', dont: 'Leave plates scattered around', priority: 'high' },
      { do: 'Allow others to work in between sets', dont: 'Hog equipment during rest periods', priority: 'medium' },
      { do: 'Use clips on barbells', dont: 'Lift without clips for safety', priority: 'high' },
      { do: 'Return dumbbells to correct spot', dont: 'Mix up dumbbell placements', priority: 'medium' },
    ],
  },
  {
    category: 'Personal Space',
    icon: '👥',
    rules: [
      { do: 'Give people space when exercising', dont: 'Stand too close to someone lifting', priority: 'medium' },
      { do: 'Ask before taking equipment someone might be using', dont: 'Grab weights mid-set', priority: 'high' },
      { do: 'Wait for a clear path to move around', dont: 'Walk through someone\'s workout space', priority: 'medium' },
      { do: 'Respect the mirror space during exercises', dont: 'Block someone\'s view while they\'re lifting', priority: 'medium' },
    ],
  },
  {
    category: 'Hygiene',
    icon: '🧼',
    rules: [
      { do: 'Bring a towel for sweat', dont: 'Drip sweat everywhere', priority: 'high' },
      { do: 'Wear clean workout clothes', dont: 'Wear heavily used unwashed gym clothes', priority: 'medium' },
      { do: 'Use deodorant before working out', dont: 'Have strong body odor', priority: 'medium' },
      { do: 'Wear appropriate footwear', dont: 'Go barefoot or wear sandals', priority: 'high' },
      { do: 'Cover open wounds', dont: 'Workout with exposed cuts', priority: 'high' },
    ],
  },
  {
    category: 'Noise & Behavior',
    icon: '🔊',
    rules: [
      { do: 'Use headphones for music', dont: 'Play music out loud from your phone', priority: 'high' },
      { do: 'Keep grunting to a reasonable level', dont: 'Scream excessively on every rep', priority: 'medium' },
      { do: 'Lower weights with control', dont: 'Drop weights unnecessarily', priority: 'medium' },
      { do: 'Take phone calls in designated areas', dont: 'Have loud conversations on the gym floor', priority: 'medium' },
    ],
  },
  {
    category: 'Time Management',
    icon: '⏱️',
    rules: [
      { do: 'Be mindful of time on cardio machines during peak hours', dont: 'Exceed time limits when others are waiting', priority: 'medium' },
      { do: 'Keep rest periods reasonable when gym is busy', dont: 'Sit on equipment scrolling phone for 10 minutes', priority: 'medium' },
      { do: 'Let others work in if you have many sets left', dont: 'Refuse to share equipment', priority: 'medium' },
    ],
  },
  {
    category: 'Locker Room',
    icon: '🚿',
    rules: [
      { do: 'Keep belongings in designated areas', dont: 'Spread your stuff across multiple benches', priority: 'medium' },
      { do: 'Be quick if others are waiting', dont: 'Spend excessive time getting ready', priority: 'low' },
      { do: 'Dispose of trash properly', dont: 'Leave garbage around', priority: 'medium' },
      { do: 'Respect others\' privacy', dont: 'Stare or make others uncomfortable', priority: 'high' },
    ],
  },
];

const QUICK_TIPS = [
  'Smile and be approachable - the gym community is generally friendly!',
  'When in doubt, ask staff for guidance on equipment or rules',
  'A simple head nod acknowledges fellow gym-goers',
  'If you break equipment accidentally, report it immediately',
  'Compliment others\' form or progress - positivity is contagious',
  'Be patient with beginners - everyone starts somewhere',
];

export default function GymEtiquetteTips() {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
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
            <Users className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium">Gym Culture</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Gym <span className="text-primary">Etiquette</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Unwritten rules to follow for a positive gym experience for everyone
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Quick Summary */}
          <motion.div variants={fadeUp} className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="bg-gradient-to-br from-green-500/10 to-zinc-900/50 rounded-2xl p-6 border border-green-500/30">
              <div className="flex items-center gap-2 mb-4">
                <ThumbsUp className="w-6 h-6 text-green-400" />
                <h3 className="text-white font-semibold">Do's</h3>
              </div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-400 text-sm">
                  <Check className="w-4 h-4 text-green-400" />
                  Wipe equipment after use
                </li>
                <li className="flex items-center gap-2 text-gray-400 text-sm">
                  <Check className="w-4 h-4 text-green-400" />
                  Re-rack your weights
                </li>
                <li className="flex items-center gap-2 text-gray-400 text-sm">
                  <Check className="w-4 h-4 text-green-400" />
                  Be mindful of others
                </li>
                <li className="flex items-center gap-2 text-gray-400 text-sm">
                  <Check className="w-4 h-4 text-green-400" />
                  Use headphones for music
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-red-500/10 to-zinc-900/50 rounded-2xl p-6 border border-red-500/30">
              <div className="flex items-center gap-2 mb-4">
                <ThumbsDown className="w-6 h-6 text-red-400" />
                <h3 className="text-white font-semibold">Don'ts</h3>
              </div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-400 text-sm">
                  <X className="w-4 h-4 text-red-400" />
                  Hog equipment during rush hour
                </li>
                <li className="flex items-center gap-2 text-gray-400 text-sm">
                  <X className="w-4 h-4 text-red-400" />
                  Give unsolicited advice
                </li>
                <li className="flex items-center gap-2 text-gray-400 text-sm">
                  <X className="w-4 h-4 text-red-400" />
                  Drop weights excessively
                </li>
                <li className="flex items-center gap-2 text-gray-400 text-sm">
                  <X className="w-4 h-4 text-red-400" />
                  Have loud phone conversations
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Detailed Rules */}
          <motion.div variants={fadeUp} className="space-y-4 mb-8">
            {ETIQUETTE_RULES.map((section, idx) => (
              <motion.div
                key={section.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl border border-zinc-800 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedCategory(expandedCategory === section.category ? null : section.category)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{section.icon}</span>
                    <div>
                      <h3 className="text-white font-semibold">{section.category}</h3>
                      <p className="text-gray-500 text-sm">{section.rules.length} rules</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
                    expandedCategory === section.category ? 'rotate-90' : ''
                  }`} />
                </button>

                {expandedCategory === section.category && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="border-t border-zinc-800"
                  >
                    <div className="p-6 space-y-4">
                      {section.rules.map((rule, ruleIdx) => (
                        <div key={ruleIdx} className="bg-zinc-800/50 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className={`w-4 h-4 ${getPriorityColor(rule.priority)}`} />
                            <span className={`text-xs ${getPriorityColor(rule.priority)}`}>
                              {rule.priority.toUpperCase()} PRIORITY
                            </span>
                          </div>
                          <div className="grid md:grid-cols-2 gap-3">
                            <div className="flex items-start gap-2">
                              <Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                              <p className="text-gray-300 text-sm">{rule.do}</p>
                            </div>
                            <div className="flex items-start gap-2">
                              <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                              <p className="text-gray-400 text-sm">{rule.dont}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Tips */}
          <motion.div variants={fadeUp}>
            <div className="bg-gradient-to-br from-primary/10 to-zinc-900/50 rounded-2xl p-6 border border-primary/30">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-primary" />
                Pro Tips for New Gym-Goers
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {QUICK_TIPS.map((tip, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-3 bg-black/30 rounded-xl p-3"
                  >
                    <span className="text-primary">💡</span>
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
              <span className="text-primary font-medium">Remember: </span>
              The golden rule of gym etiquette - treat the gym and other members how you'd
              want to be treated. Most issues come from simply being unaware!
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
