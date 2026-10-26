import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Download, Eye, Code2, Award, Brain } from 'lucide-react';
import useTypingEffect from '../hooks/useTypingEffect';
import { contact } from '../data/portfolio';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const stats = [
  { icon: <Code2 size={15} />, label: 'Open Source Repos', value: '20+' },
  { icon: <Award size={15} />, label: 'Live Products', value: '7' },
  { icon: <Brain size={15} />, label: 'AI/ML Solutions', value: '10+' },
];

export default function Hero() {
  const reduced = usePrefersReducedMotion();
  const [showResumeMenu, setShowResumeMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // One fixed headline role (AI/ML Engineer). The typing line only varies WHAT I build.
  const typingText = useTypingEffect([
    'geospatial ML systems',
    'full-stack AI products',
    'data pipelines on Azure',
    'explainable ML models',
  ], 120, 70, 1600);

  // Close resume menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowResumeMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Both resume actions now read from data/portfolio.ts, so there is one source of truth.
  const handleDownloadResume = () => {
    const a = document.createElement('a');
    a.href = contact.resumeDownload;
    a.download = 'Jiyanshu-Jain-Resume.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setShowResumeMenu(false);
  };

  const handlePreviewResume = () => {
    window.open(contact.resume, '_blank', 'noopener,noreferrer');
    setShowResumeMenu(false);
  };

  const scrollToExperience = () => {
    const el = document.getElementById('experience');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="top" className="relative flex min-h-[calc(100svh-3.5rem)] items-center justify-center overflow-hidden" aria-label="Hero Introduction">
      <div className="hero-glass-panel page-width relative z-10 w-full flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">

        {/* ── Left Column: Identity, Role, CTAs, Stats ── */}
        <motion.div
          className="hero-copy w-full lg:w-7/12 text-center lg:text-left flex flex-col items-center lg:items-start"
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Name */}
          <h1 className="mb-2 text-4xl font-medium tracking-[-0.045em] text-[var(--text)] sm:text-5xl lg:text-7xl">
            Jiyanshu Jain
          </h1>

          {/* Fixed headline role */}
          <p className="mb-2 text-xl font-semibold text-[var(--text)] sm:text-2xl md:text-3xl">
            AI/ML Engineer
          </p>

          {/* Typing line: what I build */}
          <p className="mb-5 max-w-full text-lg font-medium text-[var(--muted-strong)] sm:text-xl md:text-2xl">
            I build{' '}
            <span className="font-accent italic font-normal text-xl sm:text-2xl md:text-3xl text-[var(--text)]">
              {typingText}
              <span className="inline-block w-0.5 h-6 ml-1 bg-[var(--text)] align-middle animate-pulse" />
            </span>
          </p>

          {/* Summary */}
          <p className="mb-4 max-w-lg text-sm leading-relaxed text-[var(--muted)]">
            Former AI/ML Engineer Intern at <span className="font-semibold text-[var(--text)]">EY</span>. AI products across{' '}
            <span className="font-semibold text-[var(--text)]">EdTech</span>,{' '}
            <span className="font-semibold text-[var(--text)]">HealthTech</span> and{' '}
            <span className="font-semibold text-[var(--text)]">Geospatial ML</span>, built end to end.
          </p>

          {/* Core Product Philosophy Tagline */}
          <div className="mb-7 inline-flex items-center border-l-2 border-[var(--accent)] pl-3 text-xs sm:text-sm font-medium text-[var(--text)] max-w-lg text-left">
            <span>Frontend, backend, ML — I build all three because real products need all three.</span>
          </div>

          {/* CTA Buttons */}
          <div className="mb-8 flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <a
              href="#contact"
              className="focus-ring inline-flex items-center justify-center min-h-[2.85rem] px-7 rounded-full bg-[var(--accent)] text-[var(--accent-ink)] font-bold text-sm shadow-[0_4px_16px_var(--accent-soft)] transition-transform hover:-translate-y-0.5 no-underline"
            >
              Contact Me
            </a>

            {/* Resume Dropdown Menu */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setShowResumeMenu((v) => !v)}
                aria-expanded={showResumeMenu}
                aria-haspopup="true"
                className="focus-ring inline-flex items-center gap-2 min-h-[2.85rem] px-6 rounded-full border border-[var(--line-strong)] bg-[var(--panel)] text-[var(--text)] font-semibold text-sm transition-colors hover:border-[var(--text)] hover:bg-[var(--bg-elevated)]"
              >
                <span>Resume</span>
                <ChevronDown size={15} className={`transition-transform duration-200 ${showResumeMenu ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showResumeMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 mt-2 w-48 rounded-xl border border-[var(--line-strong)] bg-[var(--panel)] p-1 shadow-xl z-50 backdrop-blur-lg"
                  >
                    <button
                      type="button"
                      onClick={handleDownloadResume}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-[var(--text)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent-text)] transition-colors text-left"
                    >
                      <Download size={14} className="text-[var(--accent)]" />
                      <span>Download PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={handlePreviewResume}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-[var(--text)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent-text)] transition-colors text-left"
                    >
                      <Eye size={14} className="text-[var(--accent)]" />
                      <span>Preview in Drive</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Stats Row */}
          <div className="hero-stats flex flex-wrap items-center justify-center lg:justify-start gap-3.5">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-2.5 rounded-xl border border-[var(--line)] bg-[var(--panel)] px-3.5 py-2 transition-transform hover:-translate-y-0.5 shadow-sm"
              >
                <span className="text-[var(--accent)]">{s.icon}</span>
                <div className="text-left">
                  <p className="mono text-xs font-medium text-[var(--muted)] leading-tight">{s.label}</p>
                  <p className="text-sm font-extrabold text-[var(--text)] leading-tight mt-0.5">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Right Column: Portrait with orbital ring & badges ── */}
        <motion.div
          className="hero-portrait w-full lg:w-5/12 flex justify-center items-center"
          initial={reduced ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-[var(--accent)]/20 blur-3xl scale-125 pointer-events-none" />

            <motion.div
              className="absolute inset-[-8px] rounded-full border border-dashed border-[var(--accent)]/40 pointer-events-none"
              animate={reduced ? undefined : { rotate: 360 }}
              transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
            />

            <div className="relative h-56 w-56 sm:h-64 sm:w-64 md:h-80 md:w-80 overflow-hidden rounded-full border-2 border-[var(--line-strong)] bg-black/40 shadow-2xl">
              <img
                src="/pic.jpg"
                alt="Portrait of Jiyanshu Jain"
                className="h-full w-full object-cover object-[center_32%] transition-transform duration-500 hover:scale-105"
              />
            </div>

            <motion.div
              className="hero-badge absolute -top-3 -left-3 sm:-left-6 flex items-center gap-2.5 rounded-2xl border border-[var(--line-strong)] bg-[var(--panel)]/95 px-3.5 py-2.5 backdrop-blur-md shadow-xl cursor-pointer"
              initial={reduced ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              whileHover={{ scale: 1.08, y: -4, borderColor: 'var(--accent)', boxShadow: '0 8px 24px var(--accent-soft)' }}
            >
              <span className="text-lg">💼</span>
              <div className="text-left">
                <p className="mono text-xs font-semibold text-[var(--accent-text)] leading-tight">EY · Completed May 2026</p>
                <p className="text-xs font-bold text-[var(--text)] leading-tight mt-0.5">AI/ML Engineer Intern</p>
              </div>
            </motion.div>

            <motion.div
              className="hero-badge absolute -bottom-3 -right-3 sm:-right-6 flex items-center gap-2.5 rounded-2xl border border-[var(--line-strong)] bg-[var(--panel)]/95 px-3.5 py-2.5 backdrop-blur-md shadow-xl cursor-pointer"
              initial={reduced ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              whileHover={{ scale: 1.08, y: -4, borderColor: 'var(--accent)', boxShadow: '0 8px 24px var(--accent-soft)' }}
            >
              <span className="text-lg">🏅</span>
              <div className="text-left">
                <p className="mono text-xs font-semibold text-[var(--muted)] leading-tight">Oracle Certified</p>
                <p className="text-xs font-bold text-[var(--text)] leading-tight mt-0.5">OCI Data Science</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.button
        type="button"
        onClick={scrollToExperience}
        className="focus-ring absolute bottom-3 left-1/2 -translate-x-1/2 p-2 text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
        animate={reduced ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        aria-label="Scroll down to Experience section"
      >
        <ChevronDown size={26} />
      </motion.button>
    </section>
  );
}