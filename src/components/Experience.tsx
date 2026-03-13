import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Sparkles } from 'lucide-react';

type Experience = {
  company: string;
  role: string;
  period: string;
  description: string;
  technologies: string[];
  color: string;
};

const experiences: Experience[] = [
  {
    company: 'EY (Ernst & Young)',
    role: 'Data Science Intern',
    period: 'Feb 2026 – Present',
    description:
      'XGBoost + AHP pipeline for EV site selection across 3,000+ stations in 9 Indian states. Built GeoPandas spatial queries, Azure Databricks pipelines, and QGIS dashboards for infrastructure decisions.',
    technologies: ['GeoPandas', 'XGBoost', 'Azure Databricks', 'PostGIS', 'FastAPI', 'QGIS'],
    color: '#00a4ef',
  },
  {
    company: 'Hired Easy',
    role: 'Full Stack Developer Intern',
    period: 'Aug – Nov 2025',
    description:
      'ML resume-job matching engine (92% accuracy), Redis-cached job pipeline cutting API latency 55%, and React Native swipe-based job app with AI resume parsing.',
    technologies: ['React Native', 'FastAPI', 'Gemini AI', 'MongoDB', 'Redis', 'Cloudinary'],
    color: '#10b981',
  },
];

const Experience: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="experience" ref={ref} className="relative overflow-hidden bg-transparent py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-15%,rgba(52,60,130,0.34),transparent_72%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:42px_42px] opacity-35" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="cert-kicker mx-auto mb-6 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
            <Sparkles size={14} />
            Professional Journey
          </div>
          <h2 className="cert-title mb-4 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
            Experience
          </h2>
          <div className="mx-auto mb-8 h-px w-24 bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
          <p className="mx-auto max-w-2xl text-lg text-zinc-400">
            Still a student. Already in production.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative mx-auto max-w-2xl">

          {/* Animated vertical line — draws downward on scroll */}
          <motion.div
            className="absolute left-[15px] top-2 bottom-2 w-px bg-white/10 origin-top"
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.2 }}
          />

          {experiences.map((exp, index) => (
            <div key={index} className="flex gap-5 mb-7 last:mb-0">

              {/* Dot */}
              <div className="relative flex flex-col items-center flex-shrink-0 w-8 pt-1">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={inView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.2 }}
                  className="relative z-10"
                >
                  {/* Pulse ring only on active (first) role */}
                  {index === 0 && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: exp.color, opacity: 0.3 }}
                      animate={{ scale: [1, 2.5, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}
                  <div
                    className="w-3 h-3 rounded-full border-2 border-[#0d1117]"
                    style={{ backgroundColor: exp.color }}
                  />
                </motion.div>
              </div>

              {/* Card — slides in from left */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.2 }}
                className="flex-1 cert-card rounded-xl p-5 transition-all hover:border-white/20 hover:-translate-y-0.5"
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                  <div>
                    <p className="text-lg font-semibold text-zinc-100 mb-0.5">{exp.role}</p>
                    <p className="text-base font-medium" style={{ color: exp.color }}>{exp.company}</p>
                  </div>
                  <span className="text-xs text-zinc-400 border border-white/10 rounded-full px-3 py-1 whitespace-nowrap">
                    {exp.period}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-zinc-400 leading-relaxed mb-4">{exp.description}</p>

                {/* Tech tags — stagger in */}
                <motion.div
                  className="flex flex-wrap gap-1.5"
                  initial="hidden"
                  animate={inView ? 'visible' : 'hidden'}
                  variants={{
                    visible: {
                      transition: { staggerChildren: 0.05, delayChildren: 0.7 + index * 0.2 },
                    },
                    hidden: {},
                  }}
                >
                  {exp.technologies.map((tech, i) => (
                    <motion.span
                      key={i}
                      variants={{
                        hidden: { opacity: 0, y: 4 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      className="text-xs text-zinc-300 border border-white/10 bg-white/[0.05] rounded-full px-2.5 py-1"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;