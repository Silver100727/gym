import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { fadeUp, staggerContainer, accordion } from '../animations/variants';

const faqs = [
  {
    question: 'What are your membership options?',
    answer: 'We offer flexible monthly, quarterly, and annual memberships. All plans include 24/7 access, unlimited group classes, and progress tracking. Check our Pricing page for detailed options.'
  },
  {
    question: 'Do I need experience to join?',
    answer: 'Not at all! Our trainers work with all fitness levels, from complete beginners to advanced athletes. We\'ll create a personalized plan that matches your current abilities and goals.'
  },
  {
    question: 'Can I try before committing?',
    answer: 'Yes! We offer a free 7-day trial pass. Experience our facilities, meet our trainers, and join classes to see if PowerFit is right for you.'
  },
  {
    question: 'What equipment do you have?',
    answer: 'We feature state-of-the-art cardio machines, free weights, resistance equipment, functional training areas, and dedicated spaces for yoga and group classes.'
  },
  {
    question: 'Are personal trainers included?',
    answer: 'Basic consultations are included with membership. Personal training sessions can be added to any plan at competitive rates.'
  },
  {
    question: 'Can I cancel my membership?',
    answer: 'We don\'t require long-term contracts. Monthly memberships can be canceled anytime with 30 days notice. We\'re confident you\'ll love PowerFit!'
  }
];

function FAQItem({ faq }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="bg-dark-lighter border border-white/5 rounded-xl overflow-hidden"
      variants={fadeUp}
    >
      <button
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-white font-semibold pr-4">{faq.question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 text-primary flex-shrink-0" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            variants={accordion}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
          >
            <div className="px-6 pb-4 text-gray-light">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-dark-lighter">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.span
            className="text-primary text-sm font-semibold uppercase tracking-wider"
            variants={fadeUp}
          >
            Have Questions?
          </motion.span>
          <motion.h2
            className="text-4xl sm:text-5xl font-heading font-bold text-white mt-2"
            variants={fadeUp}
          >
            Frequently Asked Questions
          </motion.h2>
        </motion.div>

        {/* FAQ List */}
        <motion.div
          className="space-y-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {faqs.map((faq, idx) => (
            <FAQItem key={idx} faq={faq} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
