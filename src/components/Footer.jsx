import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell, MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { fadeUp, staggerContainer } from '../animations/variants';

const footerLinks = {
  company: [
    { name: 'About Us', path: '/about' },
    { name: 'Our Team', path: '/trainers' },
    { name: 'Careers', path: '/careers' },
    { name: 'Blog', path: '/blog' },
  ],
  programs: [
    { name: 'Strength Training', path: '/programs' },
    { name: 'Cardio', path: '/programs' },
    { name: 'CrossFit', path: '/programs' },
    { name: 'Yoga', path: '/programs' },
  ],
  support: [
    { name: 'FAQs', path: '/faq' },
    { name: 'Contact', path: '/contact' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
  ],
};

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Youtube, href: '#', label: 'Youtube' },
];

export default function Footer() {
  return (
    <footer className="bg-dark-light border-t border-white/10">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <motion.div className="lg:col-span-2" variants={fadeUp}>
            <Link to="/" className="flex items-center gap-2 mb-6">
              <Dumbbell className="w-8 h-8 text-primary" />
              <span className="text-2xl font-heading font-bold text-white">
                POWER<span className="text-primary">FIT</span>
              </span>
            </Link>
            <p className="text-gray-light mb-6 max-w-sm">
              Transform your body and mind with our state-of-the-art facilities,
              expert trainers, and supportive community.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-light">
                <MapPin className="w-5 h-5 text-primary" />
                <span>123 Fitness Street, Gym City, GC 12345</span>
              </div>
              <div className="flex items-center gap-3 text-gray-light">
                <Phone className="w-5 h-5 text-primary" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-light">
                <Mail className="w-5 h-5 text-primary" />
                <span>info@powerfit.com</span>
              </div>
            </div>
          </motion.div>

          {/* Links */}
          <motion.div variants={fadeUp}>
            <h3 className="text-white font-heading font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-light hover:text-primary transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h3 className="text-white font-heading font-semibold text-lg mb-4">Programs</h3>
            <ul className="space-y-3">
              {footerLinks.programs.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-light hover:text-primary transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h3 className="text-white font-heading font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-light hover:text-primary transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <Separator className="my-8" />

        {/* Bottom */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-4"
          variants={fadeUp}
        >
          <p className="text-gray-light text-sm">
            &copy; {new Date().getFullYear()} PowerFit. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            {socialLinks.map((social) => (
              <Button
                key={social.label}
                variant="ghost"
                size="icon"
                asChild
                className="hover:bg-primary hover:text-white"
              >
                <a href={social.href} aria-label={social.label}>
                  <social.icon className="w-5 h-5" />
                </a>
              </Button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
