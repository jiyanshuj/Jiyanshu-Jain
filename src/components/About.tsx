import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Briefcase, Award, Rocket, Sparkles } from 'lucide-react';

const stats = [
  {
    icon: <Briefcase size={22} />,
    label: 'Currently',
    value: 'Data Science Intern',
    sub: '@ EY (Ernst & Young)',
    color: '#00a4ef',
  },
  {
    icon: <Award size={22} />,
    label: 'Certifications',
    value: '21 Certs',
    sub: 'Oracle · Microsoft · IBM · NPTEL',
    color: '#a78bfa',
  },
  {
    icon: <Rocket size={22} />,
    label: 'Live Projects',
    value: '11 Deployed',
    sub: 'Running in production',
    color: '#10b981',
  },
];

const About: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="about" ref={ref} className="relative overflow-hidden bg-transparent py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_72%_55%_at_50%_-15%,rgba(50,59,130,0.32),transparent_72%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:42px_42px] opacity-35" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">

        {/* Header */}
        <motion.div
          variants={variants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="cert-kicker mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
            <Sparkles size={14} />
            Quick Intro
          </div>
          <h2 className="cert-title mb-4 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
            About Me
          </h2>
          <div className="mx-auto mb-8 h-px w-24 bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
          <p className="mx-auto max-w-2xl text-lg text-zinc-400">
            Most people pick a lane — frontend, backend, or ML. I build all three because real products need all three.
          </p>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {stats.map((s, index) => (
            <motion.div
              key={index}
              variants={variants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              className="cert-card rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
            >
              {/* Icon */}
              <div
                className="mb-5 inline-flex rounded-xl border border-white/10 bg-white/[0.06] p-3"
                style={{ color: s.color }}
              >
                {s.icon}
              </div>

              {/* Label */}
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500 mb-1">
                {s.label}
              </p>

              {/* Value */}
              <p className="text-xl font-bold text-zinc-100 mb-1" style={{ color: s.color }}>
                {s.value}
              </p>

              {/* Sub */}
              <p className="text-sm text-zinc-400">{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;