import { motion } from 'framer-motion';
import {
  Sparkles,
  TrendingDown,
  Dumbbell,
  Flame,
  Zap,
  Users,
  Heart,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { fadeUp } from '@/animations/variants';

const iconMap = {
  Sparkles,
  TrendingDown,
  Dumbbell,
  Flame,
  Zap,
  Users,
  Heart
};

export default function GoalCard({ goal, onSelect, isSelected }) {
  const Icon = iconMap[goal.icon] || Sparkles;

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(goal.id)}
      className={cn(
        "group relative p-6 rounded-xl border cursor-pointer transition-all duration-300",
        "bg-dark-lighter hover:bg-dark-light",
        isSelected
          ? "border-primary bg-primary/10"
          : "border-white/10 hover:border-primary/50"
      )}
    >
      {/* Icon */}
      <div className={cn(
        "w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300",
        isSelected ? "bg-primary/30" : "bg-primary/20 group-hover:bg-primary/30"
      )}>
        <Icon className={cn(
          "w-7 h-7 transition-colors duration-300",
          isSelected ? "text-primary" : "text-primary/80 group-hover:text-primary"
        )} />
      </div>

      {/* Content */}
      <h3 className="text-xl font-heading font-bold text-white mb-2 group-hover:text-primary transition-colors">
        {goal.title}
      </h3>
      <p className="text-gray-light text-sm mb-4 line-clamp-2">
        {goal.description}
      </p>

      {/* Expected outcome */}
      <div className="pt-4 border-t border-white/10">
        <p className="text-xs text-primary/80">
          <span className="text-white/50">Expected: </span>
          {goal.expectedOutcome}
        </p>
      </div>

      {/* Hover indicator */}
      <div className={cn(
        "absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
        isSelected && "opacity-100"
      )}>
        <ChevronRight className="w-5 h-5 text-primary" />
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-primary pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.div>
  );
}
