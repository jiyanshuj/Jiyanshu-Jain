import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Briefcase, Calendar, CheckCircle2, ChevronRight, Layers } from 'lucide-react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

type Role = {
  id: string;
  period: string;
  badge: string;
  company: string;
  role: string;
  location: string;
  summary: string;
  details: string[];
  technologies: string[];
  featuredAchievement?: string;
};

const roles: Role[] = [
  {
    id: 'ey',
    period: 'Feb 2026 — May 2026',
    badge: 'Completed Internship',
    company: 'EY (Ernst & Young)',
    role: 'AI / ML Engineer Intern',
    location: 'Indore, India',
    summary: 'Engineered an end-to-end geospatial EV site-suitability pipeline integrating spatial feature engineering, multi-criteria Analytic Hierarchy Process (AHP) weighting, and XGBoost ranking models into infrastructure planning.',
    details: [
      'Developed candidate-site scoring engines combining PostGIS spatial proximity metrics, grid infrastructure constraints, and traffic density signals.',
      'Constructed defensible ranking pipeline with SHAP interpretability values and QGIS-ready layers for infrastructure planning teams.',
      'Containerized scoring endpoints into async FastAPI microservices supporting map-led decision interfaces.',
    ],
    technologies: ['GeoPandas', 'XGBoost', 'AHP', 'PostGIS', 'Azure Databricks', 'FastAPI', 'QGIS', 'SHAP'],
    featuredAchievement: 'Shortlisted and ranked EV charging candidate sites across 9 states using XGBoost and AHP multi-criteria scoring',
  },
  {
    id: 'hired-easy',
    period: 'Aug 2025 — Nov 2025',
    badge: 'Completed Internship',
    company: 'Hired Easy',
    role: 'Android & Web Developer Intern',
    location: 'Remote, India',
    summary: 'Contributed to high-throughput job-matching workflows, Gemini-assisted résumé parsing pipelines, cached backend services, and a fluid React Native browsing experience for job seekers.',
    details: [
      'Engineered cross-platform mobile and backend application surfaces to bridge candidates and recruiters in real-time.',
      'Integrated Redis in-memory caching and async FastAPI endpoints to accelerate candidate profile search queries.',
      'Implemented Gemini API generative parsing to automatically extract skills, experience, and education from candidate résumés.',
    ],
    technologies: ['React Native', 'FastAPI', 'Gemini API', 'MongoDB', 'Redis', 'Cloudinary', 'TypeScript'],
    featuredAchievement: 'Automated candidate profile extraction with Google Gemini API and typed Pydantic models',
  },
];

/* ─────────────────────────────────────────────────────────────
   Product Timeline Component
   Inspired by @hyperiux/components/timeline on 21st.dev
   Smooth scroll line, glowing milestone nodes, and glass cards
───────────────────────────────────────────────────────────── */
export default function Experience() {
  const reduced = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 80%', 'end 50%'],
  });

  const lineProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
  });

  return (
    <section id="experience" className="section relative overflow-hidden" aria-labelledby="experience-heading">
      <div className="page-width">
        {/* Section Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between border-b border-[var(--line)] pb-8">
          <div>
            <span className="section-label">
              Experience
            </span>
            <h2 id="experience-heading" className="mt-1 text-3xl font-extrabold tracking-tight text-[var(--text)] sm:text-4xl">
              Professional Experience
            </h2>
            <p className="mt-1.5 mono text-xs sm:text-sm font-semibold text-[var(--accent-text)]">
              Still a student. Already in production.
            </p>
          </div>
          <p className="max-w-md text-xs leading-relaxed text-[var(--muted)]">
            Track record delivering production machine learning workflows, geospatial data pipelines, and responsive software systems.
          </p>
        </div>

        {/* 21st.dev Interactive Milestone Timeline */}
        <div ref={containerRef} className="relative mt-12 pl-7 sm:pl-10">
          {/* Background Static Line */}
          <div
            className="absolute left-[11px] sm:left-[19px] top-4 bottom-4 w-[2px] bg-[var(--line-strong)]"
            aria-hidden="true"
          />

          {/* Animated Glowing Progress Line (@hyperiux style) */}
          <motion.div
            className="absolute left-[11px] sm:left-[19px] top-4 bottom-4 w-[2px] origin-top bg-gradient-to-b from-[var(--accent)] via-[var(--accent)] to-transparent shadow-[0_0_12px_var(--accent)]"
            style={{ scaleY: reduced ? 1 : lineProgress }}
            aria-hidden="true"
          />

          {/* Milestones Stack */}
          <div className="space-y-12">
            {roles.map((role, idx) => (
              <motion.div
                key={role.id}
                initial={reduced ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="relative group"
              >
                {/* Glowing Node Marker */}
                <div
                  className="absolute -left-[29px] sm:-left-[35px] top-6 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full border-2 border-[var(--accent)] bg-[var(--panel)] shadow-[0_0_14px_var(--accent-glow)] transition-transform duration-300 group-hover:scale-125"
                  aria-hidden="true"
                >
                  <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" />
                </div>

                {/* Milestone Card (Frosted Glass Card) */}
                <div className="rounded-2xl border border-[var(--line-strong)] bg-[var(--panel)]/80 backdrop-blur-xl p-6 sm:p-8 shadow-xl transition-all duration-300 hover:border-[var(--accent)] hover:shadow-[0_12px_36px_var(--accent-soft)]">
                  {/* Top Bar: Company & Date Meta */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-4">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <div className="flex items-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--bg)] px-2.5 py-1 text-xs font-bold text-[var(--text)]">
                        <Briefcase size={13} className="text-[var(--accent-text)]" />
                        <span>{role.company}</span>
                      </div>
                      <span className="mono rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 text-xs font-bold text-[var(--accent-text)]">
                        {role.badge}
                      </span>
                    </div>

                    <div className="mono flex items-center gap-1.5 text-xs text-[var(--muted)]">
                      <Calendar size={13} className="text-[var(--accent-text)]" />
                      <span>{role.period}</span>
                    </div>
                  </div>

                  {/* Main Role Title & Summary */}
                  <div className="mt-5">
                    <h3 className="text-xl font-bold tracking-tight text-[var(--text)] sm:text-2xl flex items-center gap-2">
                      <span>{role.role}</span>
                      <ChevronRight size={18} className="text-[var(--accent)] opacity-60 group-hover:translate-x-1 transition-transform" />
                    </h3>
                    <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-[var(--muted-strong)]">
                      {role.summary}
                    </p>
                  </div>

                  {/* Highlighted Deliverable Box */}
                  {role.featuredAchievement && (
                    <div className="mt-4 rounded-xl border border-[var(--line)] bg-[var(--bg)]/80 p-3 flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-[var(--accent)] shrink-0 mt-0.5" />
                      <span className="text-xs font-semibold text-[var(--text)]">
                        {role.featuredAchievement}
                      </span>
                    </div>
                  )}

                  {/* Deliverables Checklist */}
                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-2.5 flex items-center gap-1.5">
                      <Layers size={12} className="text-[var(--accent-text)]" /> Core Responsibilities
                    </p>
                    <ul className="space-y-2 text-xs leading-relaxed text-[var(--muted-strong)]">
                      {role.details.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[var(--accent)] font-bold">›</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technology Pills */}
                  <div className="mt-6 flex flex-wrap gap-1.5 border-t border-[var(--line)] pt-4">
                    {role.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="mono rounded-md border border-[var(--line)] bg-[var(--bg)] px-2.5 py-1 text-xs font-semibold text-[var(--muted-strong)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent-text)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}