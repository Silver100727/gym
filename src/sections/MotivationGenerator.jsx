import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, Share2, Heart, Copy, Check, Quote, Flame, Trophy, Target, Zap } from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';

const QUOTES = [
  { text: "The only bad workout is the one that didn't happen.", author: "Unknown", category: "motivation" },
  { text: "Your body can stand almost anything. It's your mind that you have to convince.", author: "Unknown", category: "mindset" },
  { text: "The pain you feel today will be the strength you feel tomorrow.", author: "Arnold Schwarzenegger", category: "strength" },
  { text: "Success isn't always about greatness. It's about consistency.", author: "Dwayne Johnson", category: "consistency" },
  { text: "The only way to define your limits is by going beyond them.", author: "Arthur C. Clarke", category: "limits" },
  { text: "Don't count the days, make the days count.", author: "Muhammad Ali", category: "motivation" },
  { text: "The resistance that you fight physically in the gym and the resistance that you fight in life can only build a strong character.", author: "Arnold Schwarzenegger", category: "mindset" },
  { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn", category: "health" },
  { text: "The clock is ticking. Are you becoming the person you want to be?", author: "Greg Plitt", category: "motivation" },
  { text: "What hurts today makes you stronger tomorrow.", author: "Jay Cutler", category: "strength" },
  { text: "If it doesn't challenge you, it won't change you.", author: "Fred DeVito", category: "challenge" },
  { text: "The difference between try and triumph is a little umph.", author: "Marvin Phillips", category: "motivation" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar", category: "beginning" },
  { text: "The body achieves what the mind believes.", author: "Napoleon Hill", category: "mindset" },
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn", category: "discipline" },
  { text: "The last three or four reps is what makes the muscle grow.", author: "Arnold Schwarzenegger", category: "training" },
  { text: "No pain, no gain. Shut up and train.", author: "Unknown", category: "training" },
  { text: "Wake up. Work out. Look hot. Kick ass.", author: "Unknown", category: "motivation" },
  { text: "Sore today, strong tomorrow.", author: "Unknown", category: "recovery" },
  { text: "Be stronger than your excuses.", author: "Unknown", category: "mindset" },
  { text: "Sweat is just fat crying.", author: "Unknown", category: "cardio" },
  { text: "Champions train, losers complain.", author: "Unknown", category: "mindset" },
  { text: "You are one workout away from a good mood.", author: "Unknown", category: "motivation" },
  { text: "The gym is my therapy.", author: "Unknown", category: "mental" },
  { text: "Train insane or remain the same.", author: "Unknown", category: "training" },
  { text: "Your only limit is you.", author: "Unknown", category: "limits" },
  { text: "Make yourself proud.", author: "Unknown", category: "motivation" },
  { text: "Fall in love with taking care of yourself.", author: "Unknown", category: "health" },
  { text: "Strong is the new beautiful.", author: "Unknown", category: "strength" },
  { text: "The best project you'll ever work on is you.", author: "Unknown", category: "self" },
  { text: "Hustle for that muscle.", author: "Unknown", category: "training" },
  { text: "Strive for progress, not perfection.", author: "Unknown", category: "progress" },
  { text: "A one hour workout is 4% of your day. No excuses.", author: "Unknown", category: "motivation" },
  { text: "Suffer the pain of discipline or suffer the pain of regret.", author: "Unknown", category: "discipline" },
  { text: "Today's actions are tomorrow's results.", author: "Unknown", category: "consistency" },
];

const CATEGORIES = [
  { id: 'all', name: 'All', icon: Sparkles },
  { id: 'motivation', name: 'Motivation', icon: Flame },
  { id: 'mindset', name: 'Mindset', icon: Target },
  { id: 'strength', name: 'Strength', icon: Trophy },
  { id: 'training', name: 'Training', icon: Zap },
];

const BACKGROUNDS = [
  'from-primary via-orange-600 to-red-600',
  'from-blue-600 via-purple-600 to-pink-600',
  'from-green-600 via-teal-600 to-cyan-600',
  'from-yellow-500 via-orange-500 to-red-500',
  'from-indigo-600 via-purple-600 to-pink-500',
  'from-rose-500 via-red-500 to-orange-500',
];

export default function MotivationGenerator() {
  const [currentQuote, setCurrentQuote] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const filteredQuotes = selectedCategory === 'all'
    ? QUOTES
    : QUOTES.filter(q => q.category === selectedCategory);

  const generateQuote = () => {
    setIsAnimating(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
      setCurrentQuote(filteredQuotes[randomIndex]);
      setBackgroundIndex((prev) => (prev + 1) % BACKGROUNDS.length);
      setIsAnimating(false);
    }, 300);
  };

  useEffect(() => {
    generateQuote();
  }, [selectedCategory]);

  const toggleFavorite = () => {
    if (!currentQuote) return;

    setFavorites(prev => {
      const exists = prev.find(q => q.text === currentQuote.text);
      if (exists) {
        return prev.filter(q => q.text !== currentQuote.text);
      }
      return [...prev, currentQuote];
    });
  };

  const isFavorite = currentQuote && favorites.some(q => q.text === currentQuote.text);

  const copyQuote = async () => {
    if (!currentQuote) return;

    const text = `"${currentQuote.text}" - ${currentQuote.author}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareQuote = async () => {
    if (!currentQuote) return;

    const text = `"${currentQuote.text}" - ${currentQuote.author} 💪`;

    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (e) {
        // User cancelled
      }
    } else {
      copyQuote();
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
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium">Daily Inspiration</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Motivation <span className="text-primary">Generator</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Get inspired with powerful fitness quotes and mantras
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="max-w-3xl mx-auto">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-primary text-black'
                      : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Quote Card */}
          <AnimatePresence mode="wait">
            {currentQuote && (
              <motion.div
                key={currentQuote.text}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`relative bg-gradient-to-br ${BACKGROUNDS[backgroundIndex]} rounded-3xl p-8 md:p-12 shadow-2xl`}
              >
                {/* Quote Icon */}
                <Quote className="absolute top-6 left-6 w-12 h-12 text-white/20" />
                <Quote className="absolute bottom-6 right-6 w-12 h-12 text-white/20 rotate-180" />

                {/* Quote Text */}
                <div className="relative z-10 text-center py-8">
                  <motion.p
                    className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-relaxed mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    "{currentQuote.text}"
                  </motion.p>
                  <motion.p
                    className="text-white/80 text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    — {currentQuote.author}
                  </motion.p>
                </div>

                {/* Actions */}
                <div className="flex justify-center gap-3 mt-4">
                  <motion.button
                    onClick={toggleFavorite}
                    className={`p-3 rounded-xl transition-all ${
                      isFavorite
                        ? 'bg-white text-red-500'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </motion.button>
                  <motion.button
                    onClick={copyQuote}
                    className="p-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </motion.button>
                  <motion.button
                    onClick={shareQuote}
                    className="p-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Share2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generate Button */}
          <div className="flex justify-center mt-8">
            <motion.button
              onClick={generateQuote}
              disabled={isAnimating}
              className="flex items-center gap-3 px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`w-5 h-5 ${isAnimating ? 'animate-spin' : ''}`} />
              New Quote
            </motion.button>
          </div>

          {/* Favorites */}
          {favorites.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12"
            >
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-400 fill-current" />
                Your Favorites ({favorites.length})
              </h3>
              <div className="grid gap-3">
                {favorites.slice(0, 3).map((quote, index) => (
                  <motion.div
                    key={index}
                    className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-xl p-4 border border-zinc-800"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <p className="text-gray-300 text-sm">"{quote.text}"</p>
                    <p className="text-gray-500 text-xs mt-2">— {quote.author}</p>
                  </motion.div>
                ))}
                {favorites.length > 3 && (
                  <p className="text-gray-500 text-sm text-center">
                    +{favorites.length - 3} more saved
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Daily Tip */}
          <motion.div
            variants={fadeUp}
            className="mt-8 bg-primary/5 border border-primary/20 rounded-xl p-4 text-center"
          >
            <p className="text-sm text-gray-400">
              <span className="text-primary font-medium">Daily Ritual: </span>
              Start each workout by reading a motivational quote. Mental preparation is just as important as physical warm-up.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
