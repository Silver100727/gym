import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Check, X } from 'lucide-react';
import { fadeUp, staggerContainer } from '../animations/variants';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const benefits = [
  { feature: '24/7 Gym Access', member: true, nonMember: false },
  { feature: 'Personal Training Sessions', member: true, nonMember: false },
  { feature: 'Group Classes', member: 'Unlimited', nonMember: 'Pay per class' },
  { feature: 'Nutrition Consultation', member: true, nonMember: false },
  { feature: 'Progress Tracking App', member: true, nonMember: false },
  { feature: 'Locker & Shower Facilities', member: true, nonMember: false },
  { feature: 'Guest Passes', member: '5 per month', nonMember: false },
  { feature: 'Towel Service', member: true, nonMember: false }
];

export default function MembershipBenefits() {
  const sectionRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Card scales up as it enters view
  const scale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    prefersReducedMotion ? [1, 1, 1, 1] : [0.95, 1, 1, 0.95]
  );

  // Header parallax
  const headerY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [20, -20]
  );

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 lg:py-24 bg-dark-light">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          style={{ y: headerY }}
        >
          <motion.span
            className="text-primary text-sm font-semibold uppercase tracking-wider"
            variants={fadeUp}
          >
            Membership Value
          </motion.span>
          <motion.h2
            className="text-4xl sm:text-5xl font-heading font-bold text-white mt-2"
            variants={fadeUp}
          >
            Member Benefits
          </motion.h2>
        </motion.div>

        {/* Comparison Table with Scale Effect */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          style={{
            scale,
            willChange: prefersReducedMotion ? 'auto' : 'transform'
          }}
        >
          <Card>
            <CardContent className="p-6">
              {/* Header Row */}
              <div className="grid grid-cols-3 gap-4 mb-6 pb-4 border-b border-white/10">
                <div className="text-gray-light font-semibold">Feature</div>
                <div className="text-center text-primary font-bold">Member</div>
                <div className="text-center text-gray-light font-semibold">Day Pass</div>
              </div>

              {/* Benefit Rows */}
              {benefits.map((benefit) => (
                <motion.div
                  key={benefit.feature}
                  className="grid grid-cols-3 gap-4 py-3 border-b border-white/5 last:border-0"
                  variants={fadeUp}
                >
                  <div className="text-white">{benefit.feature}</div>
                  <div className="flex justify-center">
                    {typeof benefit.member === 'boolean' ? (
                      benefit.member ? (
                        <Check className="w-5 h-5 text-primary" />
                      ) : (
                        <X className="w-5 h-5 text-gray-600" />
                      )
                    ) : (
                      <span className="text-primary text-sm font-semibold">{benefit.member}</span>
                    )}
                  </div>
                  <div className="flex justify-center">
                    {typeof benefit.nonMember === 'boolean' ? (
                      benefit.nonMember ? (
                        <Check className="w-5 h-5 text-primary" />
                      ) : (
                        <X className="w-5 h-5 text-gray-600" />
                      )
                    ) : (
                      <span className="text-gray-light text-sm">{benefit.nonMember}</span>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* CTA */}
              <motion.div className="mt-8 text-center" variants={fadeUp}>
                <Button size="lg" asChild>
                  <Link to="/pricing">Become a Member</Link>
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
