import { useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';

/**
 * Basic parallax hook for elements
 * @param {number} offset - Pixels of parallax movement (default: 50)
 */
export function useParallax(offset = 50) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return { ref, y: smoothY, scrollYProgress };
}

/**
 * Background parallax with slower movement
 * @param {number} speed - Parallax speed multiplier (default: 0.5)
 */
export function useBackgroundParallax(speed = 0.5) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`]);

  return { ref, y, scrollYProgress };
}

/**
 * Section reveal/overlay effect for stacking sections
 */
export function useSectionReveal() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.95, 1, 1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);

  return { ref, scale, opacity, scrollYProgress };
}

/**
 * Hero-specific parallax with fade out effect
 */
export function useHeroParallax() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  // Background moves slower than scroll
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  // Content fades and scales as you scroll past
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  // Text layers at different speeds
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const subtitleY = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return {
    ref,
    backgroundY,
    contentOpacity,
    contentScale,
    headlineY,
    subtitleY,
    scrollYProgress
  };
}

/**
 * CTA section parallax with background and content offset
 */
export function useCTAParallax() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const contentY = useTransform(scrollYProgress, [0, 1], [50, -30]);
  const smoothContentY = useSpring(contentY, { stiffness: 100, damping: 30 });

  return { ref, backgroundY, contentY: smoothContentY, scrollYProgress };
}

/**
 * Multi-speed parallax for grid items
 * @param {number} index - Item index for alternating speeds
 */
export function useGridParallax(index) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Alternating speeds for visual interest
  const speeds = [30, -20, 40, -30, 25, -35];
  const speed = speeds[index % speeds.length];

  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return { ref, y: smoothY, scrollYProgress };
}
