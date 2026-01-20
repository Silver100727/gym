import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function ParallaxElement({
  children,
  className,
  speed = 50,
  direction = 'y',
  rotate = 0,
  scale: enableScale = false,
  opacity: enableOpacity = false,
  springConfig = { stiffness: 100, damping: 30 },
}) {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Calculate transforms based on direction
  const yTransform = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [speed, -speed]
  );
  const xTransform = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [speed * 0.5, -speed * 0.5]
  );
  const rotateTransform = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [-rotate, rotate]
  );
  const scaleTransform = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    prefersReducedMotion ? [1, 1, 1] : [0.9, 1, 0.9]
  );
  const opacityTransform = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    prefersReducedMotion ? [1, 1, 1, 1] : [0.5, 1, 1, 0.5]
  );

  // Apply spring for smooth movement
  const smoothY = useSpring(yTransform, springConfig);
  const smoothX = useSpring(xTransform, springConfig);

  const style = {
    willChange: prefersReducedMotion ? 'auto' : 'transform',
    ...(direction === 'y' || direction === 'both' ? { y: smoothY } : {}),
    ...(direction === 'x' || direction === 'both' ? { x: smoothX } : {}),
    ...(rotate ? { rotate: rotateTransform } : {}),
    ...(enableScale ? { scale: scaleTransform } : {}),
    ...(enableOpacity ? { opacity: opacityTransform } : {}),
  };

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      style={style}
    >
      {children}
    </motion.div>
  );
}
