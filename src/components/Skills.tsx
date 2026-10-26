import { AnimatePresence, motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { Terminal, ArrowUpRight, Search, Activity } from 'lucide-react';
import { projects } from '../data/portfolio';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

type Stage = { id: string; title: string; short: string; notes: string; details: string; tools: string[] };

const stages: Stage[] = [
  {
    id: 'ingestion',
    title: 'Data Ingestion & Extraction',
    short: 'Ingest',
    notes: 'Candidate locations, infrastructure context and demand signals are organised into an analysis-ready spatial dataset.',
    details: 'PostGIS spatial queries combine point-of-interest density, arterial road proximity, and electrical substation connectivity into canonical geo-data structures.',
    tools: ['Python', 'Pandas', 'GeoPandas', 'PostGIS'],
  },
  {
    id: 'features',
    title: 'Spatial Feature Engineering',
    short: 'Features',
    notes: 'Proximity matrices, point-of-interest density, road networks, and grid capacity become model-ready numerical vectors.',
    details: 'Spatial transformations and buffer calculations are verified against QGIS layers before training to ensure strict geographic validity.',
    tools: ['GeoPandas', 'Shapely', 'Pandas', 'QGIS'],
  },
  {
    id: 'ranking',
    title: 'Prioritisation & XGBoost Scoring',
    short: 'Rank',
    notes: 'XGBoost regression models combined with Analytic Hierarchy Process (AHP) weighting yield an explainable priority index.',
    details: 'SHAP summary plots validate that distance penalties and demand bonuses align with real-world infrastructure investment constraints.',
    tools: ['XGBoost', 'scikit-learn', 'AHP', 'SHAP'],
  },
  {
    id: 'service',
    title: 'Microservice API & Orchestration',
    short: 'Serve',
    notes: 'Ranked candidate sites and geospatial attributes are served via containerized FastAPI microservices.',
    details: 'Async endpoints return geojson payloads with Pydantic schema validation for consumption by client dashboards.',
    tools: ['FastAPI', 'Flask', 'Pydantic', 'REST APIs'],
  },
  {
    id: 'product',
    title: 'Map-Led Decision Interface',
    short: 'Interface',
    notes: 'Map-centric interactive views allow infrastructure stakeholders to explore constraints and candidate ranking metrics.',
    details: 'Interactive Folium/React mapping controls render choropleth overlays, site buffers, and scoring justifications side-by-side.',
    tools: ['React', 'Folium', 'QGIS', 'Tailwind CSS'],
  },
];

type SkillMetadata = {
  name: string;
  category: 'AI / ML' | 'Data / Geospatial' | 'Backend / APIs' | 'Frontend / Mobile' | 'Databases / Tools' | 'Languages';
  role: string;
  context: string;
};

const allSkills: SkillMetadata[] = [
  // Languages
  { name: 'Python', category: 'Languages', role: 'Primary Production Core', context: 'Geospatial ML, async microservices, data transformations & model training' },
  { name: 'TypeScript', category: 'Languages', role: 'Type-Safe Architecture', context: 'Typed frontends, robust application contracts & modern web tools' },
  { name: 'JavaScript', category: 'Languages', role: 'Web Runtimes', context: 'ESNext features, dynamic DOM interaction & full-stack integrations' },
  { name: 'SQL', category: 'Languages', role: 'Relational & Analytical', context: 'Complex spatial aggregations, window functions & relational modeling' },
  { name: 'C++', category: 'Languages', role: 'High-Performance Computing', context: 'Data structures, algorithms and OOP coursework' },

  // AI / ML
  { name: 'XGBoost', category: 'AI / ML', role: 'Gradient Boosted Trees', context: 'Geospatial site suitability scoring & multi-criteria feature ensembles' },
  { name: 'scikit-learn', category: 'AI / ML', role: 'Ensemble Learning', context: 'Multi-target classification pipelines, cross-validation & feature scaling' },
  { name: 'Gemini API', category: 'AI / ML', role: 'Multimodal LLM Core', context: 'Contextual resume parsing, structured presentation outlining & AI reasoning' },
  { name: 'OpenCV', category: 'AI / ML', role: 'Computer Vision', context: 'Real-time facial verification, frame preprocessing & spatial edge detection' },
  { name: 'TensorFlow', category: 'AI / ML', role: 'Deep Learning', context: 'Coursework and certification-level familiarity' },
  { name: 'SHAP', category: 'AI / ML', role: 'Model Interpretability', context: 'Explainable AI attribution, tree importance plots & feature contribution auditing' },

  // Data / Geospatial
  { name: 'GeoPandas', category: 'Data / Geospatial', role: 'Vector Spatial Analytics', context: 'Shapefile transformations, coordinate reference systems & buffer logic' },
  { name: 'Pandas', category: 'Data / Geospatial', role: 'DataFrame Engineering', context: 'High-volume tabular cleansing, vector aggregation & data prep' },
  { name: 'NumPy', category: 'Data / Geospatial', role: 'Vectorized Math', context: 'N-dimensional matrix operations, linear algebra & numeric computation' },
  { name: 'QGIS', category: 'Data / Geospatial', role: 'Geographic Information Systems', context: 'Cartographic validation, spatial layer composition & geospatial audits' },
  { name: 'Folium', category: 'Data / Geospatial', role: 'Interactive Mapping', context: 'Leaflet geospatial heatmaps, choropleths & candidate site visualization' },
  { name: 'Azure Databricks', category: 'Data / Geospatial', role: 'Cloud Analytics Lakehouse', context: 'Scalable data pipeline execution & distributed spatial workflows' },

  // Backend / APIs
  { name: 'FastAPI', category: 'Backend / APIs', role: 'Async REST Microservices', context: 'High-concurrency async endpoints, OpenAPI docs & Pydantic validation' },
  { name: 'Flask', category: 'Backend / APIs', role: 'Modular Python Services', context: 'Lightweight routing, internal utility microservices & model hosting' },
  { name: 'Django', category: 'Backend / APIs', role: 'Full-Featured Web Architecture', context: 'Familiar through coursework; most projects use FastAPI or Flask' },
  { name: 'Pydantic', category: 'Backend / APIs', role: 'Schema & Type Validation', context: 'Strict JSON payload serialization, environment configs & data contracts' },
  { name: 'Redis', category: 'Backend / APIs', role: 'In-Memory Cache & Queues', context: 'Session caching, latency reduction & fast key-value lookups' },
  { name: 'REST APIs', category: 'Backend / APIs', role: 'Service Interface Design', context: 'Stateless HTTP protocol design, rate-limiting & endpoint ergonomics' },

  // Frontend / Mobile
  { name: 'React', category: 'Frontend / Mobile', role: 'Component Systems', context: 'State-driven SPAs, reactive dashboards & client-side telemetry' },
  { name: 'React Native', category: 'Frontend / Mobile', role: 'Cross-Platform Mobile', context: 'Native iOS/Android candidate portals, gesture handling & mobile views' },
  { name: 'Tailwind CSS', category: 'Frontend / Mobile', role: 'Modern Design Systems', context: 'Utility-first tokens, dark mode orchestration & bespoke styling' },
  { name: 'Framer Motion', category: 'Frontend / Mobile', role: 'Physics Animation', context: 'Hardware-calibrated spring physics, gesture tracking & layout transitions' },
  { name: 'Vite', category: 'Frontend / Mobile', role: 'Next-Gen Build Engine', context: 'Instant hot module replacement, ESM bundling & production asset builds' },
  { name: 'Expo', category: 'Frontend / Mobile', role: 'Mobile Tooling Workflow', context: 'Managed native runtimes, fast client iteration & mobile deployment' },

  // Databases / Tools
  { name: 'PostGIS', category: 'Databases / Tools', role: 'Spatial Database Extension', context: 'Geographic indexing (R-Tree), spatial joins & geographic distance queries' },
  { name: 'PostgreSQL', category: 'Databases / Tools', role: 'ACID Relational Core', context: 'Relational data integrity, indexing strategies & transactional storage' },
  { name: 'MongoDB', category: 'Databases / Tools', role: 'Document Store', context: 'Unstructured JSON document storage, candidate profile indexing & caching' },
  { name: 'Supabase', category: 'Databases / Tools', role: 'Postgres Cloud BaaS', context: 'Row-level security policies, authentication & real-time database listeners' },
  { name: 'Docker', category: 'Databases / Tools', role: 'Container Orchestration', context: 'Reproducible microservice builds, isolation & deployment containers' },
  { name: 'Git', category: 'Databases / Tools', role: 'Version Control', context: 'Branching strategies, CI/CD integration & collaborative code management' },
];

const categoryList = ['All Stack', 'AI / ML', 'Data / Geospatial', 'Backend / APIs', 'Frontend / Mobile', 'Databases / Tools', 'Languages'] as const;
type CategoryTab = typeof categoryList[number];

type SkillsProps = { selectedSkill: string | null; onSelectSkill: (skill: string) => void; onClearSkill: () => void };

const flagshipSkillNames = ['Python', 'FastAPI', 'XGBoost', 'GeoPandas', 'PostGIS', 'scikit-learn', 'React', 'Docker'];

export default function Skills({ selectedSkill, onSelectSkill, onClearSkill }: SkillsProps) {
  const [index, setIndex] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState<CategoryTab>('All Stack');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllSkills, setShowAllSkills] = useState(false);
  const activeStage = stages[index];
  const reduced = usePrefersReducedMotion();

  // Find currently active skill metadata (defaults to first or selected)
  const activeSkillMeta = useMemo(() => {
    if (selectedSkill) {
      return allSkills.find((s) => s.name === selectedSkill) ?? allSkills[0];
    }
    return allSkills[0];
  }, [selectedSkill]);

  // Projects that use the currently active skill
  const matchingProjects = useMemo(() => {
    return projects.filter((p) => p.technologies.includes(activeSkillMeta.name));
  }, [activeSkillMeta]);

  // Filtered skills list with recruiter-friendly core collapse
  const filteredSkills = useMemo(() => {
    const list = allSkills.filter((s) => {
      const matchesCat = categoryFilter === 'All Stack' || s.category === categoryFilter;
      const matchesSearch =
        searchQuery.trim() === '' ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.context.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });

    // If on All Stack without active search and collapsed, only display the 8 flagship core skills
    if (categoryFilter === 'All Stack' && !searchQuery.trim() && !showAllSkills) {
      return list.filter((s) => flagshipSkillNames.includes(s.name));
    }

    return list;
  }, [categoryFilter, searchQuery, showAllSkills]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
      e.preventDefault();
      setIndex((i) => Math.min(i + 1, stages.length - 1));
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
      e.preventDefault();
      setIndex((i) => Math.max(i - 1, 0));
    }
  };

  return (
    <>
      {/* SECTION 03: TECHNICAL DEEP DIVES (The Isometric 3D Stack - Preserved) */}
      <section id="engineering" className="section" aria-labelledby="engineering-heading">
        <div className="page-width">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="section-label">Architecture</span>
              <h2 id="engineering-heading" className="h2">Technical deep dives</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="mono text-xs text-[var(--muted)]">
                EV Site Suitability Architecture
              </span>
            </div>
          </div>

          <div
            className="mt-8 grid items-center gap-8 border border-[var(--text)] bg-[var(--panel)] p-5 md:grid-cols-2 md:p-8 shadow-[var(--shadow)]"
          >
            {/* Isometric 3D Stack - Calibrated to display all 5 layers with zero clipping */}
            <div
              className="scene-3d relative mx-auto h-[28rem] w-full max-w-md"
              role="tablist"
              aria-label="Pipeline layers"
              aria-orientation="vertical"
              onKeyDown={onKey}
            >
              <div
                className="preserve-3d absolute left-1/2 top-[66%] h-0 w-0 scale-[0.82] sm:scale-[0.9] lg:scale-[0.95]"
                style={{ transform: 'rotateX(58deg) rotateZ(-38deg)' }}
              >
                {/* Dashed baseline frame */}
                <div
                  className="absolute border border-dashed border-[var(--line-strong)]"
                  style={{ width: 230, height: 140, left: -115, top: -70, transform: 'translateZ(-18px)' }}
                  aria-hidden="true"
                />

                {stages.map((stage, i) => {
                  const selected = i === index;
                  return (
                    <button
                      key={stage.id}
                      type="button"
                      role="tab"
                      id={`layer-${stage.id}`}
                      aria-selected={selected}
                      aria-controls="layer-detail"
                      tabIndex={selected ? 0 : -1}
                      onClick={() => setIndex(i)}
                      aria-label={`${stage.title}, layer ${i + 1} of ${stages.length}`}
                      className={`focus-ring absolute flex flex-col items-center justify-center border text-center text-xs font-bold transition-all duration-200 ${
                        selected
                          ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-ink)] shadow-[0_0_24px_var(--accent-glow)]'
                          : 'border-[var(--text)] bg-[var(--panel)] text-[var(--text)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]'
                      }`}
                      style={{
                        width: 200,
                        height: 110,
                        left: -100,
                        top: -55,
                        transform: `translateZ(${i * 54 + (selected ? 18 : 0)}px)`,
                      }}
                    >
                      <span className="mono text-xs uppercase tracking-wider opacity-80">
                        Stage {i + 1}
                      </span>
                      <span className="mt-0.5 text-sm font-extrabold">{stage.short}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stage Detail Panel */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStage.id}
                id="layer-detail"
                role="tabpanel"
                aria-labelledby={`layer-${activeStage.id}`}
                initial={reduced ? false : { opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduced ? undefined : { opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-[var(--line)] pb-2">
                    <span className="mono text-xs font-bold text-[var(--accent-text)]">
                      Layer {index + 1} of {stages.length}
                    </span>
                    <span className="mono text-xs text-[var(--muted)]">Explainable ML Pipeline</span>
                  </div>

                  <h3 className="mt-3 text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl">
                    {activeStage.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted-strong)]">{activeStage.notes}</p>

                  <div className="mt-4 border-l-2 border-[var(--accent)] bg-[var(--bg)] p-3">
                    <span className="mono text-xs font-bold uppercase tracking-wider text-[var(--accent-text)]">
                      Architecture Note
                    </span>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--muted-strong)]">{activeStage.details}</p>
                  </div>

                  <div className="mt-5">
                    <span className="mono text-xs text-[var(--muted)] block mb-1.5 font-semibold">Technologies</span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeStage.tools.map((t) => (
                        <span className="tag text-xs" key={t}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Progress Indicators */}
                <div className="mt-6 flex gap-1.5" aria-hidden="true">
                  {stages.map((s, i) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setIndex(i)}
                      tabIndex={-1}
                      className={`focus-ring h-1.5 flex-1 transition-colors ${
                        i <= index ? 'bg-[var(--accent)]' : 'bg-[var(--line-strong)]'
                      }`}
                      aria-label={`Jump to stage ${i + 1}`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* SECTION 04: REDESIGNED TECHNICAL SKILLS */}
      <section id="skills" className="section" aria-labelledby="skills-heading">
        <div className="page-width">
          {/* Header */}
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="section-label">Skills</span>
              <h2 id="skills-heading" className="h2">Technical skills</h2>
              <p className="mt-1.5 mono text-xs sm:text-sm font-semibold text-[var(--accent-text)]">
                Every skill here has a project behind it
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="mono flex items-center gap-1.5 border border-[var(--line-strong)] bg-[var(--panel)] px-2.5 py-1 text-xs text-[var(--muted-strong)]">
                <Activity size={12} className="animate-pulse text-[var(--accent)]" />
                Technical Stack ({allSkills.length} Technologies)
              </span>
            </div>
          </div>

          {/* Controls Bar: Domain Tabs + Quick Search Filter */}
          <div className="mt-8 flex flex-col gap-3 border-y border-[var(--line-strong)] py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-1.5" role="tablist">
              {categoryList.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={categoryFilter === cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`focus-ring mono px-2.5 py-1 text-xs font-semibold uppercase transition-all duration-150 ${
                    categoryFilter === cat
                      ? 'border border-[var(--text)] bg-[var(--text)] text-[var(--bg)] shadow-[0_0_8px_var(--accent-glow)]'
                      : 'border border-[var(--line)] text-[var(--muted-strong)] hover:border-[var(--text)] hover:text-[var(--text)]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative block sm:w-64">
              <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Query tool or domain..."
                className="focus-ring mono h-9 w-full border border-[var(--line-strong)] bg-[var(--panel)] pl-8 pr-3 text-xs placeholder:text-[var(--muted)]"
              />
            </div>
          </div>

          {/* Two-Column Hardware Matrix: Left is Tactile Chips, Right is Live Diagnostic Terminal HUD */}
          <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-8">
            {/* Left: Tactile Silicon Chip Matrix Grid */}
            <div className="lg:col-span-7">
              <div className="grid gap-3 sm:grid-cols-2 sm:gap-3.5">
                {filteredSkills.map((skill, i) => {
                  const isSelected = selectedSkill === skill.name || (!selectedSkill && activeSkillMeta.name === skill.name);
                  const linkedCount = projects.filter((p) => p.technologies.includes(skill.name)).length;

                  return (
                    <button
                      key={skill.name}
                      type="button"
                      onClick={() => onSelectSkill(skill.name)}
                      className={`focus-ring group relative flex flex-col justify-between border p-3.5 text-left transition-all duration-150 ${
                        isSelected
                          ? 'border-[var(--accent)] bg-[var(--panel)] shadow-[0_0_14px_var(--accent-glow)] translate-x-1'
                          : 'border-[var(--line)] bg-[var(--panel)] hover:border-[var(--accent)]'
                      }`}
                    >
                      {/* Top Pin Header */}
                      <div className="flex items-center justify-between border-b border-[var(--line)] pb-2">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`h-1.5 w-1.5 ${
                              isSelected ? 'bg-[var(--accent)] shadow-[0_0_6px_var(--accent)]' : 'bg-[var(--muted)]'
                            }`}
                          />
                          <span className="mono text-xs text-[var(--muted)]">
                            Skill {i + 1}
                          </span>
                        </div>
                        <span className="mono text-xs font-bold text-[var(--accent-text)]">
                          {skill.category.split(' ')[0]}
                        </span>
                      </div>

                      {/* Tool Name & Role */}
                      <div className="my-2.5">
                        <div className="mono text-sm font-bold text-[var(--text)] group-hover:text-[var(--accent-text)]">
                          {skill.name}
                        </div>
                        <p className="mono mt-0.5 text-xs text-[var(--muted-strong)] truncate">
                          {skill.role}
                        </p>
                      </div>

                      {/* Bottom Footer Info */}
                      <div className="flex items-center justify-between border-t border-[var(--line)] pt-1.5">
                        <span className="mono text-xs text-[var(--muted)]">
                          {linkedCount > 0 ? `${linkedCount} project${linkedCount === 1 ? '' : 's'}` : 'Core skill'}
                        </span>
                        <span className="mono text-xs font-semibold text-[var(--text)] group-hover:text-[var(--accent-text)]">
                          View →
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Recruiter / Senior Manager Compact View Toggle */}
              {categoryFilter === 'All Stack' && !searchQuery.trim() && (
                <button
                  type="button"
                  onClick={() => setShowAllSkills(!showAllSkills)}
                  className="focus-ring mono mt-4 flex w-full items-center justify-center gap-2 border border-[var(--line-strong)] bg-[var(--panel)] py-2.5 text-xs font-bold text-[var(--text)] transition-all hover:border-[var(--accent)] hover:text-[var(--accent-text)]"
                >
                  {showAllSkills ? (
                    <span>Collapse to core stack (8 tools)</span>
                  ) : (
                    <>
                      <span>View all {allSkills.length} technologies</span>
                    </>
                  )}
                </button>
              )}

              {filteredSkills.length === 0 && (
                <div className="border border-dashed border-[var(--line-strong)] p-8 text-center">
                  <p className="mono text-xs text-[var(--muted)]">No utilities match your search.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setCategoryFilter('All Stack');
                      setSearchQuery('');
                      onClearSkill();
                    }}
                    className="focus-ring mono mt-3 text-xs font-bold text-[var(--accent-text)] underline"
                  >
                    Reset filter
                  </button>
                </div>
              )}
            </div>

            {/* Right: Live Diagnostic Terminal HUD Station (Fixed to Top on Scroll) */}
            <div className="lg:col-span-5">
              <div className="border border-[var(--text)] bg-[var(--panel)] p-5 lg:sticky lg:top-8 shadow-[var(--shadow)]">
                {/* Terminal Window Header */}
                <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                  <div className="flex items-center gap-2">
                    <Terminal size={14} className="text-[var(--accent-text)]" />
                    <span className="mono text-xs font-bold uppercase tracking-wider text-[var(--text)]">
                      Skill Details
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-500/60" />
                    <span className="h-2 w-2 rounded-full bg-yellow-500/60" />
                    <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                  </div>
                </div>

                {/* Telemetry Readout Body */}
                <div className="mt-4 space-y-4">
                  {/* Module Title & Category */}
                  <div>
                    <span className="mono text-xs text-[var(--muted)] uppercase tracking-wider">
                      Selected Technology
                    </span>
                    <h3 className="mono mt-1 text-xl font-bold text-[var(--text)]">
                      {activeSkillMeta.name}
                    </h3>
                    <p className="mono text-xs font-semibold text-[var(--accent-text)]">
                      {activeSkillMeta.category} · {activeSkillMeta.role}
                    </p>
                  </div>

                  {/* Production Context */}
                  <div className="border border-[var(--line)] bg-[var(--bg)] p-3.5">
                    <span className="mono text-xs font-bold uppercase tracking-wider text-[var(--accent-text)]">
                      {matchingProjects.length > 0 ? 'How I use it' : 'Working knowledge'}
                    </span>
                    <p className="mt-1.5 text-xs leading-relaxed text-[var(--muted-strong)]">
                      {activeSkillMeta.context}
                    </p>
                  </div>

                  {/* Cross-Referenced Projects */}
                  <div>
                    <div className="flex items-center justify-between border-b border-[var(--line)] pb-1.5">
                      <span className="mono text-xs font-bold text-[var(--muted)] uppercase">
                        Used in projects ({matchingProjects.length})
                      </span>
                    </div>

                    {matchingProjects.length > 0 ? (
                      <div className="mt-2.5 space-y-2">
                        {matchingProjects.map((p) => (
                          <a
                            key={p.id}
                            href="#projects"
                            className="group flex items-center justify-between border border-[var(--line)] bg-[var(--bg)] p-2.5 text-xs transition-colors hover:border-[var(--accent)]"
                          >
                            <div>
                              <span className="mono font-bold text-[var(--text)] group-hover:text-[var(--accent-text)]">
                                {p.title}
                              </span>
                              <span className="mono block text-xs text-[var(--muted)]">
                                {p.category}
                              </span>
                            </div>
                            <ArrowUpRight size={13} className="text-[var(--muted)] group-hover:text-[var(--accent-text)]" />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 mono text-xs text-[var(--muted)]">
                        Learned through coursework and certifications; not shown in a listed project.
                      </p>
                    )}
                  </div>

                  {/* Terminal Execution Footer */}
                  <div className="border-t border-[var(--line)] pt-3">
                    <div className="flex items-center justify-between">
                      <span className="mono text-xs text-[var(--muted)]">
                        {matchingProjects.length > 0 ? 'Used in projects' : 'Working knowledge'}
                      </span>
                      {selectedSkill && (
                        <button
                          type="button"
                          onClick={onClearSkill}
                          className="mono text-xs font-bold text-[var(--accent-text)] underline hover:text-[var(--text)]"
                        >
                          Clear selection
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}