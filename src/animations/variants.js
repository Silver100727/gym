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

// Floating particle animation for hero background
export const floatingParticle = {
  animate: (custom) => ({
    y: [-20, 20, -20],
    x: [-10, 10, -10],
    opacity: [0.3, 0.6, 0.3],
    transition: {
      duration: custom?.duration || 8,
      delay: custom?.delay || 0,
      repeat: Infinity,
      ease: "easeInOut"
    }
  })
};

// Gradient orb pulse
export const orbPulse = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.3, 0.5, 0.3],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Icon bounce for hover effects
export const iconBounce = {
  rest: { y: 0 },
  hover: {
    y: [-4, 0],
    transition: {
      duration: 0.4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Shimmer effect for loading states
export const shimmer = {
  animate: {
    x: ['-100%', '100%'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Accordion expand/collapse
export const accordion = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  },
  expanded: {
    height: "auto",
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

// Parallax section reveal - for stacking effect
export const sectionReveal = {
  hidden: {
    opacity: 0,
    y: 100,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1],
    }
  }
};

// Floating element variants with different speeds
export const floatSlow = {
  animate: {
    y: [-10, 10],
    transition: {
      y: {
        duration: 4,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut'
      }
    }
  }
};

export const floatMedium = {
  animate: {
    y: [-20, 20],
    transition: {
      y: {
        duration: 3,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut'
      }
    }
  }
};

export const floatFast = {
  animate: {
    y: [-30, 30],
    transition: {
      y: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut'
      }
    }
  }
};
