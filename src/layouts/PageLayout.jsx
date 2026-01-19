import { motion } from 'framer-motion';
import { pageTransition } from '../animations/variants';

export default function PageLayout({ children, className = '' }) {
  return (
    <motion.main
      className={`pt-20 min-h-screen ${className}`}
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.main>
  );
}
