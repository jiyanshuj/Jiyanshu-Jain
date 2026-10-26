import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Github, Search, X, Monitor, GitFork, Cpu, ExternalLink, LayoutGrid, ChevronLeft, ChevronRight, Folder } from 'lucide-react';
import { projectCategories, projects, type Project, type ProjectCategory } from '../data/portfolio';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { FolderCard } from './BorderGlow';

type ProjectsProps = { skillFilter: string | null; onClearSkillFilter: () => void };

const projectFolderVaults = [
  {
    categoryTitle: 'AI Products & ML',
    countLabel: '4 projects',
    artPreset: 'ember' as const,
    items: [
      {
        id: 'autoslidex',
        title: 'AutoSlideX Deck Generator',
        image: '/images/AutoSlideX.png',
        liveUrl: 'https://auto-slide-x.vercel.app/',
        githubUrl: 'https://github.com/jiyanshuj/AutoSlideX',
      },
      {
        id: 'healthguard-ai',
        title: 'HealthGuard AI',
        image: '/images/Health-Guard-AI.png',
        liveUrl: 'https://health-guard-ai.streamlit.app/',
        githubUrl: 'https://github.com/jiyanshuj/Health-Guard-AI',
      },
      {
        id: 'smart-career-guidance',
        title: 'Smart Career Guidance',
        image: '/images/Smart-Career-Guidance-System.png',
        liveUrl: 'https://smart-career-guidance-system.vercel.app',
        githubUrl: 'https://github.com/jiyanshuj/Smart-Career-Guidance-System',
      },
      {
        id: 'papervista',
        title: 'PaperVista',
        image: '/images/PaperVista.png',
        liveUrl: 'https://paper-vista-five.vercel.app',
        githubUrl: 'https://github.com/jiyanshuj/PaperVista',
      },
    ],
  },
  {
    categoryTitle: 'Data, Cloud & Geo',
    countLabel: '4 projects',
    artPreset: 'aurora' as const,
    items: [
      {
        id: 'campus-cloud-network',
        title: 'Campus Cloud Network',
        image: '/images/Student-Campus-Cloud-Network.png',
        liveUrl: 'https://neuro-campus-73w8.vercel.app/',
        githubUrl: 'https://github.com/jiyanshuj/Major-project',
      },
      {
        id: 'ev-site-suitability',
        title: 'EV Site Suitability Analysis',
        image: '/images/EY-EV-Charging.png',
        confidential: true,
        url: '#ev-site-suitability',
      },
      {
        id: 'visnex-global',
        title: 'Visnex Global',
        image: '/images/Visnex-Global.png',
        liveUrl: 'https://visnex-global.vercel.app',
        githubUrl: 'https://github.com/jiyanshuj/Visnex-Global',
      },
      {
        id: 'travel-planner',
        title: 'Error 404 Travel Planner',
        image: '/images/Error-404-Travel-Planner.png',
        liveUrl: 'https://goplan.onrender.com/',
        githubUrl: 'https://github.com/jiyanshuj/GoPlan',
      },
    ],
  },
  {
    categoryTitle: 'Product Systems & APIs',
    countLabel: '4 projects',
    artPreset: 'verdant' as const,
    items: [
      {
        id: 'resume-parser-api',
        title: 'Resume Parser API',
        image: '/images/Resume-Parser-API.png',
        liveUrl: 'https://resume-parse-1.onrender.com',
        githubUrl: 'https://github.com/jiyanshuj/resume-parse',
      },
      {
        id: 'snapattend',
        title: 'SnapAttend',
        image: '/images/SnapAttend.png',
        githubUrl: 'https://github.com/jiyanshuj/SnapAttend',
      },
      {
        id: 'nextstep-cv',
        title: 'NextStep CV',
        image: '/images/NextStep-CV.png',
        liveUrl: 'https://nextstep-resume.netlify.app/',
        githubUrl: 'https://github.com/jiyanshuj/Resume-Gen',
      },
      {
        id: 'skills-bridge',
        title: 'Skills Bridge Platform',
        image: '/images/Skills-Bridge-Platform.png',
        liveUrl: 'https://skillpulse.netlify.app/',
        githubUrl: 'https://github.com/jiyanshuj/Skills-Bridge-Platform',
      },
    ],
  },
];

// Category color tags
const categoryColors: Record<string, string> = {
  'AI / ML': 'border-[var(--accent)] text-[var(--accent-text)] bg-[var(--accent-soft)]',
  'Data / Cloud': 'border-blue-400/40 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30',
  'Full stack': 'border-purple-400/40 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30',
  'API / Backend': 'border-orange-400/40 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30',
  'Computer vision': 'border-teal-400/40 text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/30',
};

// Architecture blueprints for projects
type PipelineNode = { step: string; label: string; desc: string };
function getProjectPipeline(project: Project): PipelineNode[] {
  switch (project.id) {
    case 'ev-site-suitability':
      return [
        { step: '01. Ingestion', label: 'Spatial Extraction', desc: 'PostGIS / GeoPandas roads, power grid, & POIs' },
        { step: '02. Features', label: 'Proximity Metrics', desc: 'Density matrices, accessibility, & demand scoring' },
        { step: '03. Model', label: 'XGBoost & AHP', desc: 'SHAP-weighted multi-criteria prioritisation' },
        { step: '04. Export', label: 'QGIS / Map Layer', desc: 'Defensible geo-json candidate shortlists' },
      ];
    case 'campus-cloud-network':
      return [
        { step: '01. Client', label: 'React Workspace', desc: 'Unified student attendance & academic portal' },
        { step: '02. Gateway', label: 'FastAPI / Flask', desc: 'Asynchronous event routing & model dispatch' },
        { step: '03. CV Engine', label: 'OpenCV Attendance', desc: 'Facial identification & automated verification' },
        { step: '04. Storage', label: 'Supabase Cloud', desc: 'Row-level security, auth & real-time DB' },
      ];
    case 'autoslidex':
      return [
        { step: '01. Input', label: 'Lesson Brief', desc: 'Instructor prompt & curriculum syllabus parsing' },
        { step: '02. LLM Core', label: 'Gemini Structuring', desc: 'Hierarchical slide outline & speaker notes' },
        { step: '03. Asset Engine', label: 'Bounded Image Search', desc: 'Targeted visual query matching & placement' },
        { step: '04. Build', label: 'python-pptx', desc: 'Native PowerPoint binary deck compilation' },
      ];
    case 'healthguard-ai':
      return [
        { step: '01. Diagnostic', label: 'Patient Clinical Intake', desc: 'Validated biomarkers for diabetes & cardiac risk' },
        { step: '02. Preprocess', label: 'Pandas Pipeline', desc: 'Normalization, missing value imputation, scaling' },
        { step: '03. Classifier', label: 'scikit-learn Ensembles', desc: 'Multi-condition probabilistic risk predictions' },
        { step: '04. Delivery', label: 'Streamlit Interface', desc: 'Readable patient risk scoring & visual indicators' },
      ];
    case 'resume-parser-api':
      return [
        { step: '01. Ingestion', label: 'Document Parser', desc: 'Multi-format PDF / DOCX byte stream ingest' },
        { step: '02. Extract', label: 'Gemini LLM', desc: 'Contextual field extraction & skill clustering' },
        { step: '03. Schema', label: 'Pydantic Models', desc: 'Strict type validation & sanitization layer' },
        { step: '04. Database', label: 'MongoDB Store', desc: 'Structured candidate JSON profiles' },
      ];
    default:
      return [
        { step: '01. Ingestion', label: 'Client / Sensors', desc: 'Raw application inputs & payload validation' },
        { step: '02. Processing', label: 'Backend Microservice', desc: 'FastAPI / Node logic, transformation, & caching' },
        { step: '03. Intelligence', label: 'ML / Business Rule', desc: 'Inference model or algorithmic computation' },
        { step: '04. Delivery', label: 'Product UI', desc: 'Optimized web/mobile interface outcome' },
      ];
  }
}

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
  const [viewMode, setViewMode] = useState<'stage' | 'dossier' | 'matrix'>('dossier');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'All' | ProjectCategory>('All');
  const [stageIndex, setStageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'visual' | 'pipeline' | 'specs'>('visual');
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const reduced = usePrefersReducedMotion();

  // Spotlight mouse tracking state for Matrix view
  const [spotlightPos, setSpotlightPos] = useState({ x: -500, y: -500 });
  const [isHovered, setIsHovered] = useState(false);

  // 3D Perspective Parallax for Stage Card
  const [perspectiveOffset, setPerspectiveOffset] = useState({ x: 0, y: 0 });

  const handleStageMouseMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType !== 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    setPerspectiveOffset({ x, y });
  };

  const handleMatrixMouseMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setSpotlightPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Filtered lists
  const featuredProjects = useMemo(() => projects.filter((p) => p.featured), []);

  const visibleProjects = useMemo(() => {
    const search = query.trim().toLowerCase();
    const base = projects.filter((project) => {
      const haystack = [project.title, project.category, project.summary, project.problem, project.solution, ...project.technologies].join(' ').toLowerCase();
      return (category === 'All' || project.category === category) && (!skillFilter || project.technologies.includes(skillFilter)) && (!search || haystack.includes(search));
    });
    return [...base.filter((p) => p.featured), ...base.filter((p) => !p.featured)];
  }, [category, query, skillFilter]);

  const activeStageProject = featuredProjects[stageIndex] ?? featuredProjects[0];
  const activePipeline = getProjectPipeline(activeStageProject);

  const prevStage = () => setStageIndex((i) => (i === 0 ? featuredProjects.length - 1 : i - 1));
  const nextStage = () => setStageIndex((i) => (i === featuredProjects.length - 1 ? 0 : i + 1));

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

        {/* MODE 1: FEATURED STAGE CONSOLE */}
        {viewMode === 'stage' && (
          <div className="mt-8 space-y-6">
            {/* Stage Selector Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line-strong)] pb-4">
              <div className="flex items-center gap-2">
                <span className="mono text-xs font-bold text-[var(--accent-text)]">Featured Project:</span>
                <span className="mono text-xs text-[var(--muted)]">
                  {stageIndex + 1} of {featuredProjects.length}
                </span>
              </div>

              {/* Stepper Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prevStage}
                  className="focus-ring border border-[var(--line-strong)] bg-[var(--panel)] p-1.5 text-[var(--text)] transition-colors hover:border-[var(--text)] hover:bg-[var(--bg)]"
                  aria-label="Previous featured project"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex items-center gap-1.5">
                  {featuredProjects.map((p, i) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setStageIndex(i)}
                      className={`h-2 transition-all duration-200 ${
                        i === stageIndex ? 'w-8 bg-[var(--accent)]' : 'w-2 bg-[var(--line-strong)] hover:bg-[var(--text)]'
                      }`}
                      aria-label={`Switch to ${p.title}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={nextStage}
                  className="focus-ring border border-[var(--line-strong)] bg-[var(--panel)] p-1.5 text-[var(--text)] transition-colors hover:border-[var(--text)] hover:bg-[var(--bg)]"
                  aria-label="Next featured project"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Stage Canvas */}
            <div
              className="corner-brackets grid gap-6 border border-[var(--text)] bg-[var(--panel)] p-5 lg:grid-cols-12 lg:gap-8 lg:p-7 shadow-[var(--shadow)]"
              onPointerMove={handleStageMouseMove}
              onPointerLeave={() => setPerspectiveOffset({ x: 0, y: 0 })}
            >
              {/* Left Column: Visual Viewport with ThreeUI-style Parallax & Shaders */}
              <div className="lg:col-span-7">
                <div
                  className="relative overflow-hidden border border-[var(--text)] bg-black/40 transition-transform duration-150"
                  style={{
                    transform: reduced
                      ? undefined
                      : `perspective(1000px) rotateY(${perspectiveOffset.x}deg) rotateX(${perspectiveOffset.y}deg)`,
                  }}
                >
                  {/* Screenshot Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[var(--bg)]">
                    <img
                      src={activeStageProject.image}
                      alt={`${activeStageProject.title} preview`}
                      className="h-full w-full object-cover object-top transition-transform duration-300 hover:scale-[1.02]"
                    />
                  </div>
                </div>

                {/* Sub-bar with Quick Navigation chips */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--line)] pt-3">
                  <div className="flex flex-wrap gap-1.5">
                    {activeStageProject.technologies.slice(0, 5).map((t) => (
                      <span key={t} className="tag text-xs">
                        {t}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpenProject(activeStageProject)}
                    className="mono text-xs font-bold text-[var(--text)] underline decoration-[var(--accent)] underline-offset-4 hover:text-[var(--accent-text)]"
                  >
                    View details →
                  </button>
                </div>
              </div>

              {/* Right Column: Interactive HUD Inspector */}
              <div className="flex flex-col justify-between lg:col-span-5">
                <div>
                  {/* Category & Status */}
                  <div className="flex items-center justify-between">
                    <span className="mono text-xs font-bold tracking-wider text-[var(--accent-text)]">
                      {activeStageProject.category}
                    </span>
                    <span className="mono border border-[var(--accent)] bg-[var(--accent-soft)] px-2 py-0.5 text-xs font-bold text-[var(--accent-text)]">
                      Featured Project {stageIndex + 1}
                    </span>
                  </div>

                  <h3 className="mt-2 text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl">
                    {activeStageProject.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted-strong)]">
                    {activeStageProject.summary}
                  </p>

                  {/* 3-Tab Inspector Switcher */}
                  <div className="mt-6 border border-[var(--line-strong)] bg-[var(--bg)] p-3.5">
                    <div className="flex items-center gap-1 border-b border-[var(--line)] pb-2.5" role="tablist">
                      <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === 'visual'}
                        onClick={() => setActiveTab('visual')}
                        className={`focus-ring mono flex items-center gap-1 px-2.5 py-1 text-xs font-bold transition-all duration-150 ${
                          activeTab === 'visual'
                            ? 'bg-[var(--accent)] text-[var(--accent-ink)]'
                            : 'text-[var(--muted)] hover:text-[var(--text)]'
                        }`}
                      >
                        <Monitor size={12} />
                        OVERVIEW
                      </button>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === 'pipeline'}
                        onClick={() => setActiveTab('pipeline')}
                        className={`focus-ring mono flex items-center gap-1 px-2.5 py-1 text-xs font-bold transition-all duration-150 ${
                          activeTab === 'pipeline'
                            ? 'bg-[var(--accent)] text-[var(--accent-ink)]'
                            : 'text-[var(--muted)] hover:text-[var(--text)]'
                        }`}
                      >
                        <GitFork size={12} />
                        PIPELINE
                      </button>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === 'specs'}
                        onClick={() => setActiveTab('specs')}
                        className={`focus-ring mono flex items-center gap-1 px-2.5 py-1 text-xs font-bold transition-all duration-150 ${
                          activeTab === 'specs'
                            ? 'bg-[var(--accent)] text-[var(--accent-ink)]'
                            : 'text-[var(--muted)] hover:text-[var(--text)]'
                        }`}
                      >
                        <Cpu size={12} />
                        SPECS
                      </button>
                    </div>

                    {/* Tab Body */}
                    <div className="mt-3">
                      {activeTab === 'visual' && (
                        <div className="space-y-2 text-xs leading-relaxed text-[var(--muted-strong)]">
                          <p>
                            <span className="mono font-bold text-[var(--text)]">Problem Statement: </span>
                            {activeStageProject.problem}
                          </p>
                          <p className="border-t border-[var(--line)] pt-2">
                            <span className="mono font-bold text-[var(--text)]">The Solution: </span>
                            {activeStageProject.solution}
                          </p>
                          {activeStageProject.facts && activeStageProject.facts.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 border-t border-[var(--line)] pt-2">
                              {activeStageProject.facts.map((fact) => (
                                <span key={fact.label} className="mono text-[11px] px-2 py-0.5 rounded bg-[var(--bg)] border border-[var(--line)] text-[var(--text)]">
                                  <strong className="text-[var(--accent-text)]">{fact.value}</strong> {fact.label}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {activeTab === 'pipeline' && (
                        <div className="space-y-2">
                          {activeStageProject.approach && activeStageProject.approach.length > 0 ? (
                            activeStageProject.approach.map((step, idx) => (
                              <div key={idx} className="border-l-2 border-[var(--accent)] pl-2.5 py-0.5">
                                <span className="mono text-xs font-bold text-[var(--accent-text)]">0{idx + 1}. </span>
                                <span className="text-xs text-[var(--muted-strong)]">{step}</span>
                              </div>
                            ))
                          ) : (
                            activePipeline.map((node) => (
                              <div key={node.step} className="border-l-2 border-[var(--accent)] pl-2.5 py-0.5">
                                <span className="mono text-xs font-bold text-[var(--accent-text)]">{node.step}: </span>
                                <span className="mono text-xs font-bold text-[var(--text)]">{node.label}</span>
                                <p className="text-xs text-[var(--muted-strong)]">{node.desc}</p>
                              </div>
                            ))
                          )}
                        </div>
                      )}

                      {activeTab === 'specs' && (
                        <div className="space-y-2 text-xs">
                          <div>
                            <span className="mono text-xs text-[var(--muted)]">PRIMARY STACK</span>
                            <p className="mono font-semibold text-[var(--text)]">{activeStageProject.technologies.join(', ')}</p>
                          </div>
                          {activeStageProject.role && (
                            <div className="border-t border-[var(--line)] pt-1.5">
                              <span className="mono text-xs text-[var(--muted)]">ENGINEERING ROLE</span>
                              <p className="text-[var(--muted-strong)]">{activeStageProject.role}</p>
                            </div>
                          )}
                          {activeStageProject.timeline && (
                            <div className="border-t border-[var(--line)] pt-1.5">
                              <span className="mono text-xs text-[var(--muted)]">TIMELINE &amp; COMMITS</span>
                              <p className="mono text-[var(--muted-strong)] text-[11px]">{activeStageProject.timeline}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Links */}
                <div className="mt-6 border-t border-[var(--line)] pt-4">
                  <ProjectLinks project={activeStageProject} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: GLASS DOSSIER VAULTS (@kedhareswer glass-folder-cards) */}
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
        {openProject && <ProjectDialog project={openProject} onClose={() => setOpenProject(null)} />}
      </AnimatePresence>
    </section>
  );
}

function ProjectDialog({ project, onClose }: { project: Project; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
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
  }, [onClose]);

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
              The Engineering Problem
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted-strong)]">{project.problem}</p>
          </div>
          <div className="border border-[var(--line)] bg-[var(--bg)] p-4">
            <h3 className="mono text-xs font-bold uppercase tracking-wider text-[var(--accent-text)]">
              Solution &amp; Architecture
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted-strong)]">{project.solution}</p>
          </div>
        </div>

        {/* Engineering Approach Steps */}
        {project.approach && project.approach.length > 0 && (
          <div className="mt-4 border border-[var(--line)] bg-[var(--bg)] p-4">
            <h3 className="mono text-xs font-bold uppercase tracking-wider text-[var(--accent-text)] mb-2.5">
              Implementation Approach
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
