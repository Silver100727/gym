import { motion } from 'framer-motion';
import { Check, Clock, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { fadeUp } from '@/animations/variants';

export default function ProgramCard({ program, onSelect, isSelected }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -8 }}
      className={cn(
        "group relative rounded-xl overflow-hidden border transition-all duration-300",
        isSelected
          ? "border-primary bg-primary/5"
          : "border-white/10 hover:border-primary/50 bg-dark-lighter"
      )}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <motion.img
          src={program.image}
          alt={program.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-lighter via-transparent to-transparent" />

        {/* Level badge */}
        <Badge className="absolute top-4 right-4 bg-dark/80 text-white border-white/20">
          {program.level}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-heading font-bold text-white mb-2 group-hover:text-primary transition-colors">
          {program.name}
        </h3>

        {/* Meta info */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-light">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-primary/70" />
            {program.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-primary/70" />
            {program.supportType.split(' ')[0]}
          </span>
        </div>

        {/* Benefits */}
        <ul className="space-y-2 mb-6">
          {program.benefits.map((benefit, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-gray-light">
              <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              {benefit}
            </li>
          ))}
        </ul>

        {/* Support type */}
        <p className="text-xs text-white/50 mb-4">
          {program.supportType}
        </p>

        {/* CTA */}
        <Button
          onClick={() => onSelect(program.id)}
          className="w-full group/btn"
          variant={isSelected ? "default" : "outline"}
        >
          {isSelected ? "Selected" : "Choose This Program"}
          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          className="absolute top-4 left-4 w-8 h-8 rounded-full bg-primary flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          <Check className="w-5 h-5 text-white" />
        </motion.div>
      )}
    </motion.div>
  );
}
