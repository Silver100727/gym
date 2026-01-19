import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, X, Star, Zap } from 'lucide-react';
import PageLayout from '../layouts/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { fadeUp, staggerContainer } from '../animations/variants';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Basic',
    price: 29,
    period: 'month',
    description: 'Perfect for beginners starting their fitness journey.',
    features: [
      { name: 'Gym access (6am - 10pm)', included: true },
      { name: 'Basic equipment access', included: true },
      { name: 'Locker room access', included: true },
      { name: 'Fitness assessment', included: true },
      { name: 'Group classes', included: false },
      { name: 'Personal training', included: false },
      { name: 'Nutrition guidance', included: false },
      { name: '24/7 access', included: false },
    ],
    featured: false,
  },
  {
    name: 'Pro',
    price: 59,
    period: 'month',
    description: 'Our most popular plan for serious fitness enthusiasts.',
    features: [
      { name: '24/7 gym access', included: true },
      { name: 'Full equipment access', included: true },
      { name: 'Locker room + sauna', included: true },
      { name: 'Monthly fitness assessment', included: true },
      { name: 'Unlimited group classes', included: true },
      { name: '2 PT sessions/month', included: true },
      { name: 'Basic nutrition guidance', included: true },
      { name: 'Guest passes (2/month)', included: false },
    ],
    featured: true,
  },
  {
    name: 'Elite',
    price: 99,
    period: 'month',
    description: 'The ultimate fitness experience with premium perks.',
    features: [
      { name: '24/7 gym access', included: true },
      { name: 'Full equipment + premium', included: true },
      { name: 'Premium locker + amenities', included: true },
      { name: 'Weekly fitness assessment', included: true },
      { name: 'Unlimited group classes', included: true },
      { name: '4 PT sessions/month', included: true },
      { name: 'Full nutrition coaching', included: true },
      { name: 'Unlimited guest passes', included: true },
    ],
    featured: false,
  },
];

export default function Pricing() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1920&q=80"
            alt="Gym"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-dark/80" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            className="text-primary text-sm font-semibold uppercase tracking-wider"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Membership Plans
          </motion.span>
          <motion.h1
            className="text-5xl sm:text-6xl font-heading font-bold text-white mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Simple, Transparent Pricing
          </motion.h1>
          <motion.p
            className="text-gray-light text-lg mt-6 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Choose the plan that fits your goals. No hidden fees, no long-term
            contracts, cancel anytime.
          </motion.p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-24 bg-dark-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {plans.map((plan) => (
              <motion.div key={plan.name} variants={fadeUp}>
                <Card
                  className={cn(
                    "relative h-full transition-all duration-300 hover:scale-105",
                    plan.featured
                      ? 'border-2 border-primary bg-gradient-to-b from-primary/20 to-dark-lighter shadow-lg shadow-primary/20'
                      : 'hover:border-white/20'
                  )}
                >
                  {/* Featured Badge */}
                  {plan.featured && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="gap-1">
                        <Star className="w-3 h-3 fill-white" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="pt-8">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Price */}
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-heading font-bold text-white">
                        ${plan.price}
                      </span>
                      <span className="text-gray-light">/{plan.period}</span>
                    </div>

                    <Separator />

                    {/* Features */}
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature.name} className="flex items-center gap-3">
                          {feature.included ? (
                            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 text-primary" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-gray/20 flex items-center justify-center shrink-0">
                              <X className="w-3 h-3 text-gray-light" />
                            </div>
                          )}
                          <span
                            className={cn(
                              "text-sm",
                              feature.included ? 'text-white' : 'text-gray-light'
                            )}
                          >
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter>
                    <Button
                      variant={plan.featured ? 'default' : 'outline'}
                      size="lg"
                      className="w-full"
                      asChild
                    >
                      <Link to="/contact">
                        {plan.featured && <Zap className="w-4 h-4" />}
                        Get Started
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* FAQ Note */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-gray-light">
              Have questions?{' '}
              <Link to="/contact" className="text-primary hover:underline">
                Contact us
              </Link>{' '}
              or check out our{' '}
              <Link to="/faq" className="text-primary hover:underline">
                FAQ
              </Link>
            </p>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
