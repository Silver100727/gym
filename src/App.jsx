import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Programs from './pages/Programs';
import Trainers from './pages/Trainers';
import Pricing from './pages/Pricing';
import Testimonials from './pages/Testimonials';
import Contact from './pages/Contact';

function ScrollToTop() {
  const { pathname } = useLocation();

  if (typeof window !== 'undefined') {
    window.scrollTo(0, 0);
  }

  return null;
}

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/trainers" element={<Trainers />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  );
}
