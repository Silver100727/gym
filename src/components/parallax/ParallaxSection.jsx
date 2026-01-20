import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function ParallaxSection({
  children,
  className,
  backgroundImage,
  backgroundSpeed = 0.3,
  overlay = true,
  overlayClassName = 'bg-gradient-to-r from-dark via-dark/80 to-transparent',
  sticky = false,
  stacking = false,
  zIndex = 1,
}) {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Background parallax transform
  const backgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ['0%', '0%'] : ['0%', `${backgroundSpeed * 50}%`]
  );

  // Stacking/reveal effect transforms
  const scale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    stacking && !prefersReducedMotion ? [0.95, 1, 1, 0.95] : [1, 1, 1, 1]
  );

  return (
    <motion.section
      ref={ref}
      className={cn(
        'relative overflow-hidden',
        sticky && 'sticky top-20',
        className
      )}
      style={{
        scale,
        zIndex,
        willChange: prefersReducedMotion ? 'auto' : 'transform',
      }}
    >
      {/* Parallax Background */}
      {backgroundImage && (
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: backgroundY }}
        >
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-[120%] object-cover"
            loading="lazy"
          />
          {overlay && (
            <div className={cn('absolute inset-0', overlayClassName)} />
          )}
        </motion.div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.section>
  );
}
