export const PROGRAMS = {
  'strength-training': {
    id: 'strength-training',
    name: 'Strength Training',
    duration: '60 min sessions',
    benefits: ['Build raw power', 'Increase muscle mass', 'Boost metabolism'],
    supportType: 'Group classes + optional PT',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&h=600&fit=crop',
    level: 'All Levels'
  },
  'cardio-endurance': {
    id: 'cardio-endurance',
    name: 'Cardio Endurance',
    duration: '45 min sessions',
    benefits: ['Burn calories fast', 'Improve heart health', 'Build stamina'],
    supportType: 'Group classes',
    image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&h=600&fit=crop',
    level: 'Beginner+'
  },
  'crossfit': {
    id: 'crossfit',
    name: 'CrossFit Functional',
    duration: '60 min sessions',
    benefits: ['Full-body conditioning', 'Functional strength', 'Community driven'],
    supportType: 'Group classes with coaching',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&h=600&fit=crop',
    level: 'Intermediate'
  },
  'yoga-recovery': {
    id: 'yoga-recovery',
    name: 'Yoga & Recovery',
    duration: '75 min sessions',
    benefits: ['Improve flexibility', 'Reduce stress', 'Enhance recovery'],
    supportType: 'Group classes',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
    level: 'All Levels'
  },
  'hiit-intensity': {
    id: 'hiit-intensity',
    name: 'HIIT Intensity',
    duration: '30 min sessions',
    benefits: ['Maximum calorie burn', 'Time efficient', 'Afterburn effect'],
    supportType: 'Group classes',
    image: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=800&h=600&fit=crop',
    level: 'Intermediate'
  },
  'personal-training': {
    id: 'personal-training',
    name: 'Personal Training',
    duration: 'Custom sessions',
    benefits: ['Customized programs', '1-on-1 attention', 'Faster results'],
    supportType: 'Dedicated personal trainer',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop',
    level: 'All Levels'
  },
  'basic-strength': {
    id: 'basic-strength',
    name: 'Basic Strength Foundations',
    duration: '45 min sessions',
    benefits: ['Learn proper form', 'Build base strength', 'Prevent injuries'],
    supportType: 'Group classes with beginner focus',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop',
    level: 'Beginner'
  }
};

export const getProgramById = (id) => PROGRAMS[id];

export const getProgramsByIds = (ids) => ids.map(id => PROGRAMS[id]).filter(Boolean);
