import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '../animations/variants';

const features = [
  {
    number: '01',
    title: '24/7 ACCESS',
    description: 'Train on your schedule. No restrictions. No excuses.',
    highlight: 'ALWAYS OPEN',
    size: 'large'
  },
  {
    number: '02',
    title: 'EXPERT COACHES',
    description: 'Certified trainers who push you beyond limits.',
    highlight: '50+ TRAINERS',
    size: 'small'
  },
  {
    number: '03',
    title: 'PREMIUM GEAR',
    description: 'Top-tier equipment. Zero wait times.',
    highlight: 'WORLD CLASS',
    size: 'small'
  },
  {
    number: '04',
    title: 'COMMUNITY',
    description: 'Train alongside thousands who share your drive.',
    highlight: '10K+ MEMBERS',
    size: 'large'
  },
  {
    number: '05',
    title: 'CLEAN SPACE',
    description: 'Spotless facilities. Sanitized hourly.',
    highlight: 'PRISTINE',
    size: 'small'
  },
  {
    number: '06',
    title: 'TRACK RESULTS',
    description: 'Monitor every rep, every gain, every win.',
    highlight: 'DATA DRIVEN',
    size: 'small'
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-20 lg:py-32 bg-dark-light relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header - Asymmetric */}
        <motion.div
          className="mb-16 lg:mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="lg:max-w-xl">
              <span className="text-primary font-mono text-sm tracking-widest">[ WHY POWERFIT ]</span>
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-black text-white mt-4 leading-[0.9]">
                BUILT FOR<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">RESULTS</span>
              </h2>
            </div>
            <div className="lg:max-w-sm lg:pt-12">
              <p className="text-white/50 text-lg leading-relaxed">
                Six reasons why serious athletes choose us. No gimmicks. Just gains.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-12 h-px bg-primary" />
                <span className="text-primary font-mono text-xs tracking-widest">SCROLL DOWN</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.number}
              className={`group relative overflow-hidden ${
                feature.size === 'large' ? 'lg:col-span-2' : ''
              }`}
              variants={fadeUp}
            >
              <div className={`relative bg-dark border border-white/5 p-8 lg:p-10 h-full min-h-[280px] flex flex-col justify-between transition-all duration-500 group-hover:border-primary/30 ${
                feature.size === 'large' ? 'lg:min-h-[320px]' : ''
              }`}>
                {/* Number watermark */}
                <span className="absolute -top-4 -right-2 text-[120px] lg:text-[160px] font-heading font-black text-white/[0.02] leading-none select-none group-hover:text-primary/5 transition-colors duration-500">
                  {feature.number}
                </span>

                {/* Content */}
                <div className="relative z-10">
                  <span className="font-mono text-primary/60 text-xs tracking-widest group-hover:text-primary transition-colors">
                    {feature.number}
                  </span>
                  <h3 className="text-2xl lg:text-3xl font-heading font-black text-white mt-4 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                </div>

                <div className="relative z-10">
                  <p className="text-white/40 text-sm lg:text-base mb-4">
                    {feature.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono tracking-widest text-white/20 group-hover:text-primary/50 transition-colors">
                      {feature.highlight}
                    </span>
                    <div className="w-8 h-px bg-white/10 group-hover:w-16 group-hover:bg-primary transition-all duration-300" />
                  </div>
                </div>

                {/* Hover accent line */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-primary group-hover:w-full transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
