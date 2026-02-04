import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, Phone, Calendar, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { staggerContainer, fadeUp } from '@/animations/variants';

export default function Confirmation() {
  const nextSteps = [
    {
      icon: Phone,
      title: "We'll Call You",
      description: "Our team will reach out within 24 hours to discuss your goals"
    },
    {
      icon: Calendar,
      title: "Schedule a Visit",
      description: "Book your free trial session and tour of our facilities"
    }
  ];

  return (
    <motion.div
      key="confirmation"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-xl mx-auto text-center"
    >
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        className="mb-8"
      >
        <div className="w-24 h-24 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
      </motion.div>

      {/* Header */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <motion.h2
          variants={fadeUp}
          className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4"
        >
          You're All Set!
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="text-gray-light text-lg"
        >
          Thank you for starting your fitness journey with PowerFit.
          We're excited to help you achieve your goals!
        </motion.p>
      </motion.div>

      {/* Next Steps */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <motion.h3
          variants={fadeUp}
          className="text-sm font-semibold text-primary uppercase tracking-wider mb-4"
        >
          What's Next
        </motion.h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {nextSteps.map((step, idx) => (
            <motion.div key={idx} variants={fadeUp}>
              <Card className="h-full">
                <CardContent className="p-6 text-left">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mb-3">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="text-white font-semibold mb-1">{step.title}</h4>
                  <p className="text-gray-light text-sm">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Button size="lg" asChild>
          <Link to="/programs">
            Explore Programs
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link to="/">
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </Button>
      </motion.div>

      {/* Contact Info */}
      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mt-8 text-sm text-white/40"
      >
        Questions? Call us at <span className="text-primary">(555) 123-4567</span>
      </motion.p>
    </motion.div>
  );
}
