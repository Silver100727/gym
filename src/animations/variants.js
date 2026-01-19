// Fade up animation - used for sections appearing on scroll
export const fadeUp = {
  hidden: {
    opacity: 0,
    y: 40
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Fade in animation
export const fadeIn = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

// Fade from left
export const fadeLeft = {
  hidden: {
    opacity: 0,
    x: -40
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Fade from right
export const fadeRight = {
  hidden: {
    opacity: 0,
    x: 40
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Stagger container for children animations
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

// Scale up animation
export const scaleUp = {
  hidden: {
    opacity: 0,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// Card hover animation
export const cardHover = {
  rest: {
    scale: 1,
    y: 0
  },
  hover: {
    scale: 1.02,
    y: -8,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

// Button hover animation
export const buttonHover = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  },
  tap: {
    scale: 0.95
  }
};

// Page transition variants
export const pageTransition = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

// Mobile menu animation
export const mobileMenuVariants = {
  closed: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  },
  open: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

// Nav link underline animation
export const navLinkUnderline = {
  rest: {
    width: "0%"
  },
  hover: {
    width: "100%",
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

// Image scale on hover
export const imageHover = {
  rest: { scale: 1 },
  hover: {
    scale: 1.1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

// Glow effect for featured items
export const glowEffect = {
  rest: {
    boxShadow: "0 0 0 rgba(249, 115, 22, 0)"
  },
  hover: {
    boxShadow: "0 0 30px rgba(249, 115, 22, 0.4)",
    transition: {
      duration: 0.3
    }
  }
};
