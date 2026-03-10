import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Download } from 'lucide-react';
import useTypingEffect from '../hooks/useTypingEffect';
import ParticleBackground from './ParticleBackground';

const Hero: React.FC = () => {
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const typingText = useTypingEffect([
    'Web Developer',
    'AI-ML Enthusiast',
    'Problem Solver',
    'Full-Stack Developer'
  ]);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-transparent pb-24 pt-16">
      <ParticleBackground />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_78%_58%_at_50%_-12%,rgba(44,53,120,0.35),transparent_72%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:42px_42px] opacity-30" />
      </div>

      {/* Animated circles */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-2xl"
          animate={{ x: [0, 30, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.div
          className="absolute -right-20 top-40 h-96 w-96 rounded-full bg-indigo-400/20 blur-2xl"
          animate={{ x: [0, -50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.div
          className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-rose-400/20 blur-2xl"
          animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 18, repeat: Infinity, repeatType: "reverse" }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col lg:flex-row items-center justify-center gap-12">
        <motion.div
          className="lg:w-1/2 text-center lg:text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="cert-kicker mb-6 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em]">
            Available For Projects
          </div>
          <h1 className="cert-title mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              Jiyanshu Jain
            </span>
          </h1>
          <p className="mb-8 text-xl text-zinc-400 md:text-2xl">
            A passionate <span className="font-semibold text-[#00a4ef]">{typingText}<span className="animate-blink">|</span></span> crafting practical digital experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-xl border border-[#00a4ef]/40 bg-[#00a4ef]/20 px-8 py-3 font-medium text-white shadow-[0_18px_40px_-25px_rgba(0,164,239,0.65)] transition-colors hover:bg-[#00a4ef]/30"
            >
              Contact Me
            </motion.a>
            <motion.a
              href="https://drive.google.com/file/d/1OUIlZIIZFvnhvsNnl2FxfpIFOzOWQ_u1/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cert-card flex items-center gap-2 rounded-xl px-8 py-3 font-medium text-zinc-200 transition-colors hover:border-white/30 hover:bg-white/[0.08]"
            >
              <Download size={20} />
              Download Resume
            </motion.a>
          </div>

        </motion.div>

        <motion.div
          className="lg:w-1/2 flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative h-64 w-64 overflow-hidden rounded-full border-2 border-white/25 md:h-80 md:w-80">
            <img
              src="/pic.png"
              alt="Jiyanshu Jain"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </motion.div>
      </div>

      <motion.button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-500 transition-colors hover:text-[#00a4ef]"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        aria-label="Scroll down"
      >
        <ChevronDown size={32} />
      </motion.button>
    </section>
  );
};

export default Hero;
