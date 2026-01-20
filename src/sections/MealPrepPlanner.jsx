import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UtensilsCrossed, Plus, Trash2, ShoppingCart, Calendar, Clock, Flame, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

const MEAL_TEMPLATES = {
  bulking: {
    name: 'Bulking Plan',
    calories: 3000,
    meals: [
      { name: 'Breakfast', time: '7:00 AM', foods: ['4 eggs scrambled', 'Oatmeal with banana', 'Orange juice'], calories: 650 },
      { name: 'Snack 1', time: '10:00 AM', foods: ['Protein shake', 'Handful of almonds'], calories: 350 },
      { name: 'Lunch', time: '12:30 PM', foods: ['Grilled chicken breast', 'Brown rice', 'Mixed vegetables'], calories: 700 },
      { name: 'Snack 2', time: '3:30 PM', foods: ['Greek yogurt', 'Berries', 'Granola'], calories: 400 },
      { name: 'Dinner', time: '7:00 PM', foods: ['Salmon fillet', 'Sweet potato', 'Broccoli'], calories: 650 },
      { name: 'Night Snack', time: '9:30 PM', foods: ['Cottage cheese', 'Casein shake'], calories: 250 },
    ],
  },
  cutting: {
    name: 'Cutting Plan',
    calories: 1800,
    meals: [
      { name: 'Breakfast', time: '7:00 AM', foods: ['Egg whites (6)', 'Spinach', 'Whole wheat toast'], calories: 300 },
      { name: 'Snack 1', time: '10:00 AM', foods: ['Apple', 'Almonds (10)'], calories: 200 },
      { name: 'Lunch', time: '12:30 PM', foods: ['Grilled chicken salad', 'Light dressing', 'Quinoa'], calories: 450 },
      { name: 'Snack 2', time: '3:30 PM', foods: ['Protein shake (water)', 'Celery sticks'], calories: 150 },
      { name: 'Dinner', time: '7:00 PM', foods: ['White fish', 'Asparagus', 'Small portion rice'], calories: 500 },
      { name: 'Night Snack', time: '9:00 PM', foods: ['Casein protein'], calories: 200 },
    ],
  },
  maintenance: {
    name: 'Maintenance Plan',
    calories: 2200,
    meals: [
      { name: 'Breakfast', time: '7:00 AM', foods: ['3 eggs', 'Avocado toast', 'Fruit'], calories: 500 },
      { name: 'Snack 1', time: '10:00 AM', foods: ['Protein bar'], calories: 250 },
      { name: 'Lunch', time: '12:30 PM', foods: ['Turkey sandwich', 'Side salad', 'Apple'], calories: 550 },
      { name: 'Snack 2', time: '3:30 PM', foods: ['Greek yogurt', 'Honey', 'Walnuts'], calories: 300 },
      { name: 'Dinner', time: '7:00 PM', foods: ['Lean steak', 'Baked potato', 'Green beans'], calories: 600 },
    ],
  },
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function MealPrepPlanner() {
  const [selectedPlan, setSelectedPlan] = useState('maintenance');
  const [weekPlan, setWeekPlan] = useState(() => {
    const initial = {};
    DAYS.forEach(day => {
      initial[day] = { ...MEAL_TEMPLATES[selectedPlan] };
    });
    return initial;
  });
  const [expandedDay, setExpandedDay] = useState('Monday');
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [copied, setCopied] = useState(false);

  const applyTemplate = (templateKey) => {
    setSelectedPlan(templateKey);
    const newPlan = {};
    DAYS.forEach(day => {
      newPlan[day] = { ...MEAL_TEMPLATES[templateKey] };
    });
    setWeekPlan(newPlan);
  };

  const generateShoppingList = () => {
    const items = {};
    DAYS.forEach(day => {
      weekPlan[day].meals.forEach(meal => {
        meal.foods.forEach(food => {
          if (items[food]) {
            items[food] += 1;
          } else {
            items[food] = 1;
          }
        });
      });
    });
    return Object.entries(items).map(([item, count]) => ({ item, count }));
  };

  const shoppingList = generateShoppingList();

  const copyShoppingList = () => {
    const text = shoppingList.map(({ item, count }) => `${item} (×${count})`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const weeklyCalories = DAYS.reduce((sum, day) => sum + weekPlan[day].calories, 0);
  const avgDailyCalories = Math.round(weeklyCalories / 7);

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
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
            <UtensilsCrossed className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium">Nutrition Planning</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Meal Prep <span className="text-primary">Planner</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Plan your weekly meals and generate shopping lists automatically
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Plan Templates */}
          <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4 mb-8">
            {Object.entries(MEAL_TEMPLATES).map(([key, template]) => (
              <button
                key={key}
                onClick={() => applyTemplate(key)}
                className={`p-4 rounded-xl text-center transition-all ${
                  selectedPlan === key
                    ? 'bg-primary text-black'
                    : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                }`}
              >
                <p className="font-semibold">{template.name}</p>
                <p className="text-sm opacity-80">{template.calories} cal/day</p>
              </button>
            ))}
          </motion.div>

          {/* Stats Overview */}
          <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl p-4 border border-zinc-800 text-center">
              <Flame className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{avgDailyCalories}</p>
              <p className="text-gray-500 text-sm">Avg Daily Cal</p>
            </div>
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl p-4 border border-zinc-800 text-center">
              <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">7</p>
              <p className="text-gray-500 text-sm">Days Planned</p>
            </div>
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl p-4 border border-zinc-800 text-center">
              <ShoppingCart className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{shoppingList.length}</p>
              <p className="text-gray-500 text-sm">Items to Buy</p>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Weekly Plan */}
            <motion.div variants={fadeUp} className="lg:col-span-2 space-y-3">
              {DAYS.map((day, idx) => (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl border border-zinc-800 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedDay(expandedDay === day ? null : day)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        expandedDay === day ? 'bg-primary text-black' : 'bg-zinc-800 text-gray-400'
                      }`}>
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">{day}</p>
                        <p className="text-gray-500 text-sm">{weekPlan[day].meals.length} meals</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-primary font-semibold">{weekPlan[day].calories}</p>
                        <p className="text-gray-500 text-xs">calories</p>
                      </div>
                      {expandedDay === day ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedDay === day && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-zinc-800"
                      >
                        <div className="p-4 space-y-3">
                          {weekPlan[day].meals.map((meal, mealIdx) => (
                            <div key={mealIdx} className="bg-zinc-800/50 rounded-xl p-3">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-gray-500" />
                                  <span className="text-gray-400 text-sm">{meal.time}</span>
                                </div>
                                <span className="text-primary text-sm font-medium">{meal.calories} cal</span>
                              </div>
                              <p className="text-white font-medium mb-1">{meal.name}</p>
                              <ul className="text-gray-400 text-sm space-y-1">
                                {meal.foods.map((food, foodIdx) => (
                                  <li key={foodIdx} className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                                    {food}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>

            {/* Shopping List */}
            <motion.div variants={fadeUp}>
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl p-6 border border-zinc-800 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-primary" />
                    Shopping List
                  </h3>
                  <button
                    onClick={copyShoppingList}
                    className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                  {shoppingList.map(({ item, count }, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className="flex items-center justify-between bg-zinc-800/50 rounded-lg p-3"
                    >
                      <span className="text-gray-300 text-sm">{item}</span>
                      <span className="text-primary text-sm font-medium">×{count}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <p className="text-gray-400 text-sm text-center">
                    {shoppingList.length} unique items for the week
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tip */}
          <motion.div
            variants={fadeUp}
            className="mt-8 bg-primary/5 border border-primary/20 rounded-xl p-4"
          >
            <p className="text-sm text-gray-400">
              <span className="text-primary font-medium">Meal Prep Tip: </span>
              Cook proteins and grains in bulk on Sunday. Store in portions for easy grab-and-go meals throughout the week.
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
