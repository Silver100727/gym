import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { navLinkUnderline } from '../animations/variants';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Programs', path: '/programs' },
  { name: 'Trainers', path: '/trainers' },
  { name: 'Tools', path: '/tools' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'Testimonials', path: '/testimonials' },
  { name: 'Contact', path: '/contact' },
];

function NavLink({ name, path, onClick }) {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <motion.div className="relative" initial="rest" whileHover="hover" animate="rest">
      <Link
        to={path}
        onClick={onClick}
        className={`text-sm uppercase tracking-wider font-medium transition-colors duration-300 ${
          isActive ? 'text-primary' : 'text-white hover:text-primary'
        }`}
      >
        {name}
      </Link>
      <motion.div
        className="absolute -bottom-1 left-0 h-0.5 bg-primary"
        variants={navLinkUnderline}
      />
    </motion.div>
  );
}

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Dumbbell className="w-8 h-8 text-primary" />
            <span className="text-2xl font-heading font-bold text-white">
              POWER<span className="text-primary">FIT</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink key={link.path} {...link} />
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button asChild>
              <Link to="/contact">Join Now</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-6 h-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Dumbbell className="w-6 h-6 text-primary" />
                  <span>POWER<span className="text-primary">FIT</span></span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="text-white hover:text-primary text-lg font-medium transition-colors duration-300 py-2"
                  >
                    {link.name}
                  </Link>
                ))}
                <Button asChild className="mt-4">
                  <Link to="/contact">Join Now</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
