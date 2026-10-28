import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Github, Search, X, ExternalLink, LayoutGrid, Folder } from 'lucide-react';
import { projectCategories, projects, type Project, type ProjectCategory } from '../data/portfolio';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { FolderCard } from './BorderGlow';

type ProjectsProps = { skillFilter: string | null; onClearSkillFilter: () => void };

// Folder grouping is a curated layout choice, but everything shown in a folder
// (title, image, links, confidential flag, count) comes from data/portfolio.ts.
const folderGroups = [
  { categoryTitle: 'AI Products & ML', artPreset: 'ember' as const, ids: ['autoslidex', 'healthguard-ai', 'smart-career-guidance', 'papervista'] },
  { categoryTitle: 'Data, Cloud & Geo', artPreset: 'aurora' as const, ids: ['campus-cloud-network', 'ev-site-suitability', 'visnex-global', 'travel-planner'] },
  { categoryTitle: 'Product Systems & APIs', artPreset: 'verdant' as const, ids: ['resume-parser-api', 'snapattend', 'nextstep-cv', 'skills-bridge'] },
];

const projectFolderVaults = folderGroups.map((group) => {
  const items = group.ids
    .map((id) => projects.find((p) => p.id === id))
    .filter((p): p is Project => Boolean(p))
    .map((p) => ({
      id: p.id,
      title: p.title,
      image: p.image,
      confidential: p.confidential,
      liveUrl: p.liveUrl,
      githubUrl: p.githubUrl,
    }));
  return { categoryTitle: group.categoryTitle, countLabel: `${items.length} projects`, artPreset: group.artPreset, items };
});

if (import.meta.env.DEV) {
  const grouped = new Set(folderGroups.flatMap((g) => g.ids));
  const missing = projects.filter((p) => !grouped.has(p.id)).map((p) => p.id);
  if (missing.length) console.warn('Projects not placed in any folder:', missing);
}

// Category color tags
const categoryColors: Record<string, string> = {
  'AI / ML': 'border-[var(--accent)] text-[var(--accent-text)] bg-[var(--accent-soft)]',
  'Data / Cloud': 'border-blue-400/40 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30',
  'Full stack': 'border-purple-400/40 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30',
  'API / Backend': 'border-orange-400/40 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30',
  'Computer vision': 'border-teal-400/40 text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/30',
};

function ProjectLinks({ project }: { project: Project }) {
  if (project.confidential) {
    return (
      <span className="mono inline-flex items-center gap-1 rounded border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
        Confidential
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      {project.liveUrl && (
        <a
          className="focus-ring mono inline-flex items-center gap-1 border border-[var(--line-strong)] bg-[var(--bg)] px-2.5 py-1 text-xs font-semibold text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent-text)]"
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink size={12} />
          Demo
        </a>
      )}
      {project.githubUrl && (
        <a
          className="focus-ring mono inline-flex items-center gap-1 border border-[var(--line-strong)] bg-[var(--bg)] px-2.5 py-1 text-xs font-semibold text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent-text)]"
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github size={12} />
          Code
        </a>
      )}
      {!project.liveUrl && !project.githubUrl && (
        <span className="mono inline-flex items-center gap-1 rounded border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
          Confidential
        </span>
      )}
    </div>
  );
}

// Snappy mechanical timing (TasteSkill / GSAP inspired - no floaty lag)
const snapTransition = { duration: 0.2, ease: [0.16, 1, 0.3, 1] } as const;

export default function Projects({ skillFilter, onClearSkillFilter }: ProjectsProps) {
  const [viewMode, setViewMode] = useState<'dossier' | 'matrix'>('dossier');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'All' | ProjectCategory>('All');
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const reduced = usePrefersReducedMotion();
  const closeProject = useCallback(() => setOpenProject(null), []);

  // A skill picked in the Skills section filters the project list, which only exists in the
  // "All Projects" view. Switch to it so the filter is visible instead of silently ignored.
  useEffect(() => {
    if (skillFilter) setViewMode('matrix');
  }, [skillFilter]);

  // Spotlight mouse tracking state for Matrix view
  const [spotlightPos, setSpotlightPos] = useState({ x: -500, y: -500 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMatrixMouseMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setSpotlightPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Filtered lists
  const visibleProjects = useMemo(() => {
    const search = query.trim().toLowerCase();
    const base = projects.filter((project) => {
      const haystack = [project.title, project.category, project.summary, project.problem, project.solution, ...project.technologies].join(' ').toLowerCase();
      return (category === 'All' || project.category === category) && (!skillFilter || project.technologies.includes(skillFilter)) && (!search || haystack.includes(search));
    });
    return [...base.filter((p) => p.featured), ...base.filter((p) => !p.featured)];
  }, [category, query, skillFilter]);

  const filtersActive = Boolean(query || category !== 'All' || skillFilter);
  const reset = () => { setQuery(''); setCategory('All'); onClearSkillFilter(); };

  return (
    <section id="projects" className="section" aria-labelledby="projects-heading">
      <div className="page-width">
        {/* Folder-first project library */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="section-label">Projects</span>
            <h2 id="projects-heading" className="h2">Selected projects</h2>
            <p className="mt-1.5 mono text-xs sm:text-sm font-semibold text-[var(--accent-text)]">
              Projects that started as problems and ended as products
            </p>
          </div>

          {/* The detailed catalog is available on request; folders stay the primary view. */}
          <div className="flex items-center gap-2 border border-[var(--line-strong)] bg-[var(--panel)] p-1">
            <button
              type="button"
              onClick={() => setViewMode('dossier')}
              aria-pressed={viewMode === 'dossier'}
              className={`focus-ring mono flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-all duration-150 ${
                viewMode === 'dossier'
                  ? 'bg-[var(--accent)] text-[var(--accent-ink)] shadow-[0_0_12px_var(--accent-glow)]'
                  : 'text-[var(--muted-strong)] hover:text-[var(--text)]'
              }`}
            >
              <Folder size={13} />
              Folders
            </button>
            <button
              type="button"
              onClick={() => setViewMode('matrix')}
              aria-pressed={viewMode === 'matrix'}
              className={`focus-ring mono flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-all duration-150 ${
                viewMode === 'matrix'
                  ? 'bg-[var(--accent)] text-[var(--accent-ink)] shadow-[0_0_12px_var(--accent-glow)]'
                  : 'text-[var(--muted-strong)] hover:text-[var(--text)]'
              }`}
            >
              <LayoutGrid size={13} />
              All Projects ({projects.length})
            </button>
          </div>
        </div>

        {/* MODE 1: GLASS DOSSIER VAULTS (@kedhareswer glass-folder-cards) */}
        {viewMode === 'dossier' && (
          <div className="mt-8 space-y-6">
            <div className="border-b border-[var(--line)] pb-4">
              <p className="mono text-xs text-[var(--muted)]">
                Click a folder to preview screens and explore projects
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 justify-items-center py-6">
              {projectFolderVaults.map((vault) => (
                <FolderCard
                  key={vault.categoryTitle}
                  categoryTitle={vault.categoryTitle}
                  countLabel={vault.countLabel}
                  items={vault.items}
                  artPreset={vault.artPreset}
                />
              ))}
            </div>
          </div>
        )}

        {/* MODE 3: SYSTEM MATRIX (Spotlight Bento Grid) */}
        {viewMode === 'matrix' && (
          <div className="mt-8 space-y-6">
            {/* Filter & Search Bar */}
            <div className="flex flex-col gap-3 border-y border-[var(--line-strong)] py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <label className="relative block sm:w-80">
                  <span className="sr-only">Search projects</span>
                  <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search index by keyword, tool or domain"
                    className="focus-ring h-10 w-full border border-[var(--line-strong)] bg-[var(--panel)] pl-9 pr-3 text-sm placeholder:text-[var(--muted)]"
                  />
                </label>
                <p className="mono text-xs text-[var(--muted)]" aria-live="polite">
                  {visibleProjects.length} of {projects.length} projects
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Project categories">
                {projectCategories.map((item) => (
                  <button
                    type="button"
                    key={item}
                    aria-pressed={category === item}
                    onClick={() => setCategory(item)}
                    className={`focus-ring mono px-2.5 py-1 text-xs font-semibold uppercase transition-all duration-150 ${
                      category === item
                        ? 'border border-[var(--text)] bg-[var(--text)] text-[var(--bg)]'
                        : 'border border-[var(--line)] text-[var(--muted-strong)] hover:border-[var(--text)] hover:text-[var(--text)]'
                    }`}
                  >
                    {item}
                  </button>
                ))}
                {filtersActive && (
                  <button
                    type="button"
                    onClick={reset}
                    className="focus-ring mono ml-2 px-2 py-1 text-xs font-bold text-[var(--accent-text)] underline underline-offset-4"
                  >
                    Reset filters
                  </button>
                )}
              </div>

              {skillFilter && (
                <p className="mono text-xs text-[var(--muted-strong)]">
                  Filter: <span className="bg-[var(--accent-soft)] px-1.5 py-0.5 text-[var(--accent-text)]">{skillFilter}</span>
                </p>
              )}
            </div>

            {/* Spotlight Grid Container */}
            <div
              className="relative"
              onPointerMove={handleMatrixMouseMove}
              onPointerEnter={() => setIsHovered(true)}
              onPointerLeave={() => setIsHovered(false)}
            >
              {/* Radial Cursor Spotlight Overlay (21st.dev style) */}
              {!reduced && isHovered && (
                <div
                  className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(400px circle at ${spotlightPos.x}px ${spotlightPos.y}px, var(--accent-glow), transparent 75%)`,
                  }}
                  aria-hidden="true"
                />
              )}

              {/* Bento Grid */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {visibleProjects.map((project, i) => {
                  const catStyle = categoryColors[project.category] ?? 'border-[var(--line-strong)] text-[var(--muted-strong)]';
                  return (
                    <motion.div
                      key={project.id}
                      initial={reduced ? false : { opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={snapTransition}
                      className="group flex flex-col justify-between border border-[var(--line-strong)] bg-[var(--panel)] p-4 transition-all duration-150 hover:border-[var(--accent)] hover:shadow-[var(--shadow)]"
                    >
                      <div>
                        {/* Thumbnail */}
                        <div className="relative aspect-[16/9] overflow-hidden border border-[var(--line)] bg-[var(--bg)]">
                          <img
                            src={project.image}
                            alt={`${project.title} preview`}
                            loading="lazy"
                            className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                          />
                        </div>

                        {/* Metadata Header */}
                        <div className="mt-3 flex items-center justify-between">
                          <span className="mono text-xs text-[var(--muted)]">Project {i + 1}</span>
                          <span className={`mono inline-flex border px-2 py-0.5 text-xs font-bold ${catStyle}`}>
                            {project.category}
                          </span>
                        </div>

                        <h4 className="mt-2 text-lg font-bold tracking-tight text-[var(--text)] group-hover:text-[var(--accent-text)]">
                          {project.title}
                        </h4>
                        <p className="mt-1.5 text-xs leading-relaxed text-[var(--muted-strong)] line-clamp-2">
                          {project.summary}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-1">
                          {project.technologies.slice(0, 4).map((t) => (
                            <span key={t} className="tag text-xs">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="mt-5 flex items-center justify-between gap-2 border-t border-[var(--line)] pt-3">
                        <button
                          type="button"
                          onClick={() => setOpenProject(project)}
                          className="focus-ring mono inline-flex items-center gap-1 text-xs font-bold text-[var(--text)] transition-colors hover:text-[var(--accent-text)]"
                        >
                          Details <span className="text-[var(--accent-text)]">→</span>
                        </button>
                        <ProjectLinks project={project} />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Case Study Modal */}
      <AnimatePresence>
        {openProject && <ProjectDialog project={openProject} onClose={closeProject} />}
      </AnimatePresence>
    </section>
  );
}

function ProjectDialog({ project, onClose }: { project: Project; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current();
        return;
      }
      // Keep Tab / Shift+Tab inside the dialog while it is open.
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-dialog-title"
      className="scene-3d fixed inset-0 z-[70] grid place-items-center bg-[#111514]/75 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <motion.article
        ref={dialogRef}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        onMouseDown={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-4xl overflow-y-auto border border-[var(--text)] bg-[var(--panel)] p-5 sm:p-7 shadow-[var(--shadow)]"
      >
        <div className="flex justify-between gap-5">
          <div>
            <p className="mono text-xs text-[var(--accent-text)]">{project.category}</p>
            <h2 id="project-dialog-title" className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl text-[var(--text)]">
              {project.title}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="focus-ring grid h-10 w-10 shrink-0 place-items-center border border-[var(--text)] text-[var(--text)] hover:bg-[var(--accent)] hover:text-[var(--accent-ink)]"
            aria-label="Close project details"
          >
            <X size={18} />
          </button>
        </div>

        <div className="relative mt-5 aspect-[16/8] w-full overflow-hidden border border-[var(--line-strong)]">
          <img src={project.image} alt={`${project.title} screenshot`} className="h-full w-full object-cover object-top" />
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="border border-[var(--line)] bg-[var(--bg)] p-4">
            <h3 className="mono text-xs font-bold uppercase tracking-wider text-[var(--accent-text)]">
              The problem
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted-strong)]">{project.problem}</p>
          </div>
          <div className="border border-[var(--line)] bg-[var(--bg)] p-4">
            <h3 className="mono text-xs font-bold uppercase tracking-wider text-[var(--accent-text)]">
              What it does
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted-strong)]">{project.solution}</p>
          </div>
        </div>

        {/* Who built what, and the honest current state */}
        {(project.role || project.status) && (
          <dl className="mt-4 grid gap-4 border border-[var(--line)] bg-[var(--bg)] p-4 sm:grid-cols-2">
            {project.role && (
              <div>
                <dt className="mono text-xs font-bold uppercase tracking-wider text-[var(--accent-text)]">My role</dt>
                <dd className="mt-2 text-sm leading-relaxed text-[var(--muted-strong)]">{project.role}</dd>
              </div>
            )}
            {project.status && (
              <div>
                <dt className="mono text-xs font-bold uppercase tracking-wider text-[var(--accent-text)]">Status</dt>
                <dd className="mt-2 text-sm leading-relaxed text-[var(--muted-strong)]">{project.status}</dd>
              </div>
            )}
          </dl>
        )}

        {/* Engineering Approach Steps */}
        {project.approach && project.approach.length > 0 && (
          <div className="mt-4 border border-[var(--line)] bg-[var(--bg)] p-4">
            <h3 className="mono text-xs font-bold uppercase tracking-wider text-[var(--accent-text)] mb-2.5">
              How it was built
            </h3>
            <div className="space-y-2">
              {project.approach.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-[var(--muted-strong)]">
                  <span className="mono font-bold text-[var(--accent-text)] shrink-0">0{idx + 1}.</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project Facts Counter Chips & Metadata */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border border-[var(--line)] bg-[var(--bg)] p-3">
          {project.facts && project.facts.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.facts.map((fact) => (
                <span key={fact.label} className="mono text-xs px-2.5 py-1 rounded bg-[var(--panel)] border border-[var(--line)] text-[var(--text)]">
                  <strong className="text-[var(--accent-text)]">{fact.value}</strong> {fact.label}
                </span>
              ))}
            </div>
          )}

          {project.timeline && (
            <span className="mono text-[11px] text-[var(--muted)]">
              {project.timeline}
            </span>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-5">
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.map((t) => (
              <span className="tag" key={t}>
                {t}
              </span>
            ))}
          </div>
          <ProjectLinks project={project} />
        </div>
      </motion.article>
    </motion.div>
  );
}