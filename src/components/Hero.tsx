import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Download, Award, Code2, Brain } from 'lucide-react';
import useTypingEffect from '../hooks/useTypingEffect';
import ParticleBackground from './ParticleBackground';

const stats = [
  { icon: <Code2 size={14} />, label: "Open Source Repos", value: "20+" },
  { icon: <Award size={14} />, label: "Live Products", value: "8+" },
  { icon: <Brain size={14} />, label: "AI/ML Solutions", value: "10+" },
];

const Hero: React.FC = () => {
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const typingText = useTypingEffect([
    'AI Product Engineer',
    'Full-Stack Developer (React + FastAPI/Flask)',
    'ML Builder (Computer Vision + NLP)',
    'Cloud-Ready App Developer',
    'Data Science Intern @ EY',
  ]);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-transparent pb-24 pt-16">
      <ParticleBackground />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_78%_58%_at_50%_-12%,rgba(44,53,120,0.35),transparent_72%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:42px_42px] opacity-30" />
      </div>

      {/* Animated ambient blobs */}
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

        {/* ── Left: Text ── */}
        <motion.div
          className="lg:w-1/2 text-center lg:text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Kicker badge */}
          <div className="cert-kicker mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00a4ef] animate-pulse" />
            Available For Projects
          </div>

          {/* Name */}
          <h1 className="cert-title mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              Jiyanshu Jain
            </span>
          </h1>

          {/* Typing role */}
          <p className="mb-6 text-xl text-zinc-400 md:text-2xl">
            A passionate{' '}
            <span className="font-semibold text-[#00a4ef]">
              {typingText}<span className="animate-blink">|</span>
            </span>
          </p>

          {/* Portfolio-aligned summary */}
          <p className="mb-8 text-sm text-zinc-500 leading-relaxed max-w-md mx-auto lg:mx-0">
            AI products across{' '}
            <span className="text-zinc-300">EdTech</span>,{' '}
            <span className="text-zinc-300">HealthTech</span>, and{' '}
            <span className="text-zinc-300">Geospatial ML</span>{' '}
            — built end to end, deployed for real.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
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
              className="cert-card flex items-center justify-center gap-2 rounded-xl px-8 py-3 font-medium text-zinc-200 transition-colors hover:border-white/30 hover:bg-white/[0.08]"
            >
              <Download size={16} />
              Download Resume
            </motion.a>
          </div>

          {/* Stats row */}
          <motion.div
            className="flex gap-5 justify-center lg:justify-start flex-wrap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {stats.map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.04] px-4 py-2.5"
              >
                <span className="text-[#00a4ef]">{s.icon}</span>
                <div>
                  <p className="text-xs text-zinc-500 leading-none mb-0.5">{s.label}</p>
                  <p className="text-sm font-semibold text-white leading-none">{s.value}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Right: Photo ── */}
        <motion.div
          className="lg:w-1/2 flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative">
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-full bg-[#00a4ef]/20 blur-2xl scale-110 pointer-events-none" />
            {/* Rotating dashed border */}
            <motion.div
              className="absolute inset-[-6px] rounded-full border border-dashed border-[#00a4ef]/30 pointer-events-none"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />
            {/* Photo circle */}
            <div className="relative h-64 w-64 overflow-hidden rounded-full border-2 border-white/20 md:h-80 md:w-80">
              <img
                src="/Pic.png"
                alt="Jiyanshu Jain"
                className="w-full h-full object-cover"
                style={{
                  objectPosition: "50% 28%",
                  transform: "scale(1.5)",
                  transformOrigin: "50% 28%",
                }}
              />
            </div>
            {/* Floating badge — Oracle cert */}
            <motion.div
              className="absolute -bottom-2 -right-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.07] px-3 py-2 backdrop-blur-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <span className="text-base">🏅</span>
              <div>
                <p className="text-[10px] text-zinc-400 leading-none mb-0.5">Oracle Certified</p>
                <p className="text-xs font-semibold text-white leading-none">OCI Data Science</p>
              </div>
            </motion.div>
            {/* Floating badge — EY intern */}
            <motion.div
              className="absolute -top-2 -left-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.07] px-3 py-2 backdrop-blur-md"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <span className="text-base">💼</span>
              <div>
                <p className="text-[10px] text-zinc-400 leading-none mb-0.5">Currently</p>
                <p className="text-xs font-semibold text-white leading-none">Data Science @ EY</p>
              </div>
            </motion.div>
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