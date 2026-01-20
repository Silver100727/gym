import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Backpack,
  Check,
  Dumbbell,
  Heart,
  Waves,
  Sparkles,
  Zap,
  RotateCcw,
  Share2,
  ChevronDown,
  Star
} from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

// Workout type configurations
const WORKOUT_TYPES = [
  {
    id: 'strength',
    name: 'Strength Training',
    icon: Dumbbell,
    color: '#ef4444',
    description: 'Weightlifting & resistance',
  },
  {
    id: 'cardio',
    name: 'Cardio',
    icon: Heart,
    color: '#22c55e',
    description: 'Running, cycling, elliptical',
  },
  {
    id: 'swimming',
    name: 'Swimming',
    icon: Waves,
    color: '#3b82f6',
    description: 'Pool or open water',
  },
  {
    id: 'yoga',
    name: 'Yoga & Pilates',
    icon: Sparkles,
    color: '#8b5cf6',
    description: 'Flexibility & mindfulness',
  },
  {
    id: 'hiit',
    name: 'HIIT',
    icon: Zap,
    color: '#f97316',
    description: 'High intensity intervals',
  },
];

// Items database with categories
const ITEMS = {
  essentials: {
    name: 'Essentials',
    items: [
      { id: 'water-bottle', name: 'Water Bottle', emoji: '💧', workouts: ['all'] },
      { id: 'towel', name: 'Gym Towel', emoji: '🧺', workouts: ['all'] },
      { id: 'gym-shoes', name: 'Training Shoes', emoji: '👟', workouts: ['strength', 'cardio', 'hiit'] },
      { id: 'gym-clothes', name: 'Workout Clothes', emoji: '👕', workouts: ['all'] },
      { id: 'headphones', name: 'Headphones', emoji: '🎧', workouts: ['all'] },
      { id: 'gym-card', name: 'Gym Membership Card', emoji: '💳', workouts: ['all'] },
    ],
  },
  hygiene: {
    name: 'Hygiene',
    items: [
      { id: 'deodorant', name: 'Deodorant', emoji: '🧴', workouts: ['all'] },
      { id: 'shower-gel', name: 'Shower Gel/Soap', emoji: '🧼', workouts: ['all'] },
      { id: 'shampoo', name: 'Shampoo', emoji: '🧴', workouts: ['all'] },
      { id: 'flip-flops', name: 'Shower Flip Flops', emoji: '🩴', workouts: ['all'] },
      { id: 'hair-ties', name: 'Hair Ties', emoji: '💇', workouts: ['all'] },
    ],
  },
  strength: {
    name: 'Strength Training',
    items: [
      { id: 'lifting-gloves', name: 'Lifting Gloves', emoji: '🧤', workouts: ['strength'] },
      { id: 'wrist-wraps', name: 'Wrist Wraps', emoji: '🎗️', workouts: ['strength'] },
      { id: 'lifting-belt', name: 'Lifting Belt', emoji: '🥋', workouts: ['strength'] },
      { id: 'resistance-bands', name: 'Resistance Bands', emoji: '🔗', workouts: ['strength', 'hiit'] },
      { id: 'chalk', name: 'Lifting Chalk', emoji: '⚪', workouts: ['strength'] },
    ],
  },
  cardio: {
    name: 'Cardio Gear',
    items: [
      { id: 'running-shoes', name: 'Running Shoes', emoji: '👟', workouts: ['cardio'] },
      { id: 'heart-monitor', name: 'Heart Rate Monitor', emoji: '⌚', workouts: ['cardio', 'hiit'] },
      { id: 'armband', name: 'Phone Armband', emoji: '📱', workouts: ['cardio'] },
      { id: 'sweat-band', name: 'Sweat Band', emoji: '🎽', workouts: ['cardio', 'hiit'] },
    ],
  },
  swimming: {
    name: 'Swimming Gear',
    items: [
      { id: 'swimsuit', name: 'Swimsuit', emoji: '🩱', workouts: ['swimming'] },
      { id: 'goggles', name: 'Swim Goggles', emoji: '🥽', workouts: ['swimming'] },
      { id: 'swim-cap', name: 'Swim Cap', emoji: '🧢', workouts: ['swimming'] },
      { id: 'ear-plugs', name: 'Ear Plugs', emoji: '👂', workouts: ['swimming'] },
      { id: 'kickboard', name: 'Kickboard', emoji: '🏊', workouts: ['swimming'] },
    ],
  },
  yoga: {
    name: 'Yoga & Pilates',
    items: [
      { id: 'yoga-mat', name: 'Yoga Mat', emoji: '🧘', workouts: ['yoga'] },
      { id: 'yoga-blocks', name: 'Yoga Blocks', emoji: '🧱', workouts: ['yoga'] },
      { id: 'yoga-strap', name: 'Yoga Strap', emoji: '🪢', workouts: ['yoga'] },
      { id: 'grip-socks', name: 'Grip Socks', emoji: '🧦', workouts: ['yoga'] },
    ],
  },
  nutrition: {
    name: 'Nutrition',
    items: [
      { id: 'protein-shake', name: 'Protein Shake', emoji: '🥤', workouts: ['strength', 'hiit'] },
      { id: 'pre-workout', name: 'Pre-Workout', emoji: '⚡', workouts: ['strength', 'hiit'] },
      { id: 'energy-bar', name: 'Energy Bar/Snack', emoji: '🍫', workouts: ['all'] },
      { id: 'bcaa', name: 'BCAAs', emoji: '💊', workouts: ['strength'] },
    ],
  },
};

// Checklist item component
function ChecklistItem({ item, isChecked, onToggle, delay }) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      onClick={onToggle}
      className={`w-full flex items-center gap-3 p-3 border transition-all ${
        isChecked
          ? 'bg-green-500/10 border-green-500/30'
          : 'bg-white/5 border-white/10 hover:border-white/20'
      }`}
    >
      {/* Checkbox */}
      <div
        className={`w-6 h-6 flex items-center justify-center border-2 transition-all ${
          isChecked
            ? 'bg-green-500 border-green-500'
            : 'border-white/30'
        }`}
      >
        <AnimatePresence>
          {isChecked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Check className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Emoji */}
      <span className="text-xl">{item.emoji}</span>

      {/* Name */}
      <span
        className={`flex-1 text-left transition-all ${
          isChecked ? 'text-white/50 line-through' : 'text-white'
        }`}
      >
        {item.name}
      </span>

      {/* Essential badge */}
      {item.workouts.includes('all') && (
        <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] font-mono">
          ESSENTIAL
        </span>
      )}
    </motion.button>
  );
}

// Progress bar component
function ProgressBar({ checked, total }) {
  const percentage = total > 0 ? (checked / total) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-white/50 text-sm">Packing Progress</span>
        <span className="font-mono text-primary">
          {checked}/{total} items
        </span>
      </div>
      <div className="h-3 bg-white/10 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-green-500"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      {percentage === 100 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-green-400 text-sm font-bold flex items-center gap-2"
        >
          <Star className="w-4 h-4" />
          All packed! You're ready to go!
        </motion.p>
      )}
    </div>
  );
}

// Workout type selector
function WorkoutTypeSelector({ selected, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedType = WORKOUT_TYPES.find(t => t.id === selected);
  const Icon = selectedType?.icon || Dumbbell;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 flex items-center justify-center"
            style={{ backgroundColor: selectedType?.color }}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <p className="font-heading font-bold text-white">{selectedType?.name}</p>
            <p className="text-white/50 text-xs">{selectedType?.description}</p>
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-white/50 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-darker border border-white/10 z-20"
          >
            {WORKOUT_TYPES.map((type) => {
              const TypeIcon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => {
                    onSelect(type.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-4 text-left transition-colors ${
                    selected === type.id
                      ? 'bg-white/10'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div
                    className="w-8 h-8 flex items-center justify-center"
                    style={{ backgroundColor: type.color }}
                  >
                    <TypeIcon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-white text-sm">{type.name}</p>
                    <p className="text-white/50 text-xs">{type.description}</p>
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function GymBagChecklist() {
  const [workoutType, setWorkoutType] = useState('strength');
  const [checkedItems, setCheckedItems] = useState({});

  // Get relevant items for selected workout type
  const getRelevantItems = () => {
    const relevant = [];
    Object.entries(ITEMS).forEach(([categoryId, category]) => {
      const filteredItems = category.items.filter(
        item => item.workouts.includes('all') || item.workouts.includes(workoutType)
      );
      if (filteredItems.length > 0) {
        relevant.push({
          categoryId,
          categoryName: category.name,
          items: filteredItems,
        });
      }
    });
    return relevant;
  };

  const relevantCategories = getRelevantItems();
  const allItems = relevantCategories.flatMap(cat => cat.items);
  const checkedCount = allItems.filter(item => checkedItems[item.id]).length;

  const toggleItem = (itemId) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const resetChecklist = () => {
    setCheckedItems({});
  };

  const handleShare = async () => {
    const checkedList = allItems
      .filter(item => checkedItems[item.id])
      .map(item => `${item.emoji} ${item.name}`)
      .join('\n');

    const text = `My Gym Bag Checklist for ${WORKOUT_TYPES.find(t => t.id === workoutType)?.name}:\n\n${checkedList || 'Nothing packed yet!'}\n\nPacked with JEFIT Gym Bag Checklist`;

    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <section className="relative py-24 bg-dark overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
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
              <Backpack className="w-4 h-4" />
              NEVER FORGET
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-black text-white mb-4">
              GYM BAG{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
                CHECKLIST
              </span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Select your workout type and check off items as you pack. Never forget your essentials again!
            </p>
          </motion.div>

          {/* Main content */}
          <div className="max-w-3xl mx-auto">
            {/* Workout type selector */}
            <motion.div variants={fadeUp} className="mb-6">
              <WorkoutTypeSelector
                selected={workoutType}
                onSelect={setWorkoutType}
              />
            </motion.div>

            {/* Progress bar */}
            <motion.div
              variants={fadeUp}
              className="bg-dark/50 border border-white/10 p-4 mb-6"
            >
              <ProgressBar checked={checkedCount} total={allItems.length} />
            </motion.div>

            {/* Checklist */}
            <div className="space-y-6">
              {relevantCategories.map((category, catIdx) => (
                <motion.div
                  key={category.categoryId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: catIdx * 0.1 }}
                  className="relative bg-dark/50 border border-white/10 p-4"
                >
                  {catIdx === 0 && (
                    <>
                      <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-primary/30" />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-primary/30" />
                    </>
                  )}

                  <h3 className="font-heading font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    {category.categoryName}
                  </h3>

                  <div className="space-y-2">
                    {category.items.map((item, idx) => (
                      <ChecklistItem
                        key={item.id}
                        item={item}
                        isChecked={checkedItems[item.id] || false}
                        onToggle={() => toggleItem(item.id)}
                        delay={idx * 0.05}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Action buttons */}
            <motion.div
              variants={fadeUp}
              className="flex items-center justify-center gap-4 mt-8"
            >
              <motion.button
                onClick={resetChecklist}
                className="flex items-center gap-2 px-6 py-3 border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-colors font-mono text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RotateCcw className="w-4 h-4" />
                RESET
              </motion.button>
              <motion.button
                onClick={handleShare}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-heading font-bold"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Share2 className="w-4 h-4" />
                SHARE LIST
              </motion.button>
            </motion.div>

            {/* Tips */}
            <motion.div
              variants={fadeUp}
              className="mt-8 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 p-6"
            >
              <h4 className="font-heading font-bold text-white mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                PRO TIPS
              </h4>
              <ul className="space-y-2 text-white/70 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Keep a separate bag packed with essentials so you're always ready
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Restock your bag right after each workout while items are fresh in mind
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Store protein bars and snacks that don't expire quickly
                </li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
