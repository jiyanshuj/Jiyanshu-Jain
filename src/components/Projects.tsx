import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Github, Brain, Activity, GraduationCap, FileText, Presentation, Compass, Sparkles, Globe, Smartphone, Shield, Terminal } from 'lucide-react';

type Project = {
  id: number;
  title: string;
  description: string;
  problem: string;
  solution: string;
  differentiators: string[];
  image: string;
  tags: string[];
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  icon: React.ReactNode;
  displayType?: 'phone';
};

const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

/* ─── Global styles for the terminal-blink / typewriter effect ───
   Injected once. Scoped by class name so it's safe alongside Tailwind. */
const TerminalStyles = () => (
  <style>{`
    @keyframes glass-typing {
      from { width: 0; }
      to { width: 100%; }
    }
    @keyframes glass-caret-blink {
      0%, 100% { border-color: rgba(125, 211, 252, 0.9); }
      50% { border-color: transparent; }
    }
    @keyframes glass-label-blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    .glass-typewriter {
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      width: 0;
      border-right: 2px solid transparent;
      font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
      letter-spacing: 0.01em;
    }
    .group:hover .glass-typewriter,
    [data-open="true"] .glass-typewriter {
      animation:
        glass-typing 0.7s steps(24, end) forwards,
        glass-caret-blink 0.85s step-end infinite 0.7s;
    }
    .glass-cursor {
      animation: glass-label-blink 1s step-start infinite;
    }
    /* mobile tap state — forces the popup open independent of :hover,
       since touch devices don't reliably support hover */
    [data-open="true"] .glass-overlay {
      opacity: 1 !important;
      transform: scale(1) !important;
      pointer-events: auto !important;
    }
    /* no ugly blue flash / double-tap zoom delay on tap */
    .cert-card {
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }
    /* tapped-open cards need the same z-index lift hover gives on desktop,
       so the breakout popup isn't covered by sibling cards */
    .cert-card[data-open="true"] {
      z-index: 40;
    }
    /* hide the native scrollbar on the popup panel — scrolling still works,
       the bar itself just isn't rendered (Chrome/Safari + Firefox + IE/Edge) */
    .no-scrollbar {
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    .no-scrollbar::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
    }
  `}</style>
);

/* ─── Section label with blinking terminal cursor ─── */
const GlassLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#7dd3fc]">
    <span>{children}</span>
    <span className="glass-cursor text-[#7dd3fc]">_</span>
  </div>
);

/* ─── Shared large glassmorphism popup ───
   Breaks out beyond the card bounds on hover (negative inset), scales in,
   sits above sibling cards (z-50), frosted glass panel with blinking terminal
   title + structured Problem / Solution / Stack / Edge / Links sections. */
const GlassOverlay: React.FC<{ project: Project }> = ({ project }) => (
  <div
    className="
      glass-overlay
      pointer-events-none absolute -inset-3 sm:-inset-6 md:-inset-8 z-50
      flex items-center justify-center
      opacity-0 scale-90
      transition-all duration-300 ease-out
      group-hover:pointer-events-auto group-hover:opacity-100 group-hover:scale-100
    "
  >
    <div
      className="
        relative w-[min(90vw,24rem)] max-h-[calc(100vh-2rem)] overflow-y-auto overflow-x-hidden no-scrollbar
        rounded-2xl border border-white/12
        bg-[#0a0a0b]/80 backdrop-blur-2xl
        shadow-[0_20px_60px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.08)]
        p-5
      "
      style={{
        // neutral black/graphite base — guarantees contrast on any screenshot
        // and reads as intentional glass rather than a generic blue-tinted template.
        // cyan is kept out of the fill and only shows up as accents (border, labels, icons).
        backgroundImage:
          'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(0,0,0,0.05) 55%, rgba(255,255,255,0.02) 100%)',
      }}
    >
      {/* subtle ambient glow — accent only, kept faint so black stays the dominant read */}
      <div className="pointer-events-none absolute -inset-8 -z-10 rounded-2xl bg-[radial-gradient(circle_at_50%_50%,rgba(0,164,239,0.10),transparent_70%)]" />

      {/* header */}
      <div className="mb-3 flex items-center gap-2 border-b border-white/10 pb-3">
        <Terminal size={14} className="shrink-0 text-[#7dd3fc]" />
        <h3 className="glass-typewriter text-base font-bold text-zinc-50">
          {project.title}
        </h3>
      </div>

      {/* problem */}
      <div className="mb-2.5">
        <GlassLabel>Problem</GlassLabel>
        <p className="text-xs leading-snug text-zinc-200/90">{project.problem}</p>
      </div>

      {/* solution */}
      <div className="mb-2.5">
        <GlassLabel>Solution</GlassLabel>
        <p className="text-xs leading-snug text-zinc-200/90">{project.solution}</p>
      </div>

      {/* tech stack */}
      <div className="mb-2.5">
        <GlassLabel>Tech Stack</GlassLabel>
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.map((tech, index) => (
            <span
              key={index}
              className="rounded-full border border-white/20 bg-white/[0.08] backdrop-blur-md px-2 py-0.5 text-[10px] font-medium text-zinc-100"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* differentiators */}
      <div className="mb-3.5">
        <GlassLabel>AI Capabilities</GlassLabel>
        <ul className="space-y-0.5">
          {project.differentiators.map((point, index) => (
            <li key={index} className="flex items-start gap-1.5 text-xs text-zinc-200/90">
              <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#7dd3fc]" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* links */}
      <div className="flex gap-2 border-t border-white/10 pt-3">
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 rounded-md border border-white/25 bg-white/[0.10] backdrop-blur-md px-3 py-1 text-xs font-medium text-zinc-100 transition-colors hover:bg-white/[0.18]"
        >
          <Github size={13} />
          <span>Code</span>
        </a>
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 rounded-md border border-[#00a4ef]/45 bg-[#00a4ef]/15 backdrop-blur-md px-3 py-1 text-xs font-medium text-[#7dd3fc] transition-colors hover:bg-[#00a4ef]/25"
          >
            <ExternalLink size={13} />
            <span>Demo</span>
          </a>
        )}
      </div>
    </div>
  </div>
);

/* ─── Phone frame card ─── */
const PhoneCard: React.FC<{ project: Project; isOpen: boolean; onToggle: (id: number) => void }> = ({
  project,
  isOpen,
  onToggle,
}) => (
  <motion.div
    variants={itemVariants}
    data-open={isOpen ? 'true' : undefined}
    role="button"
    tabIndex={0}
    aria-expanded={isOpen}
    aria-label={`View details for ${project.title}`}
    onClick={(e) => {
      e.stopPropagation();
      onToggle(project.id);
    }}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onToggle(project.id);
      }
    }}
    className="group cert-card relative h-80 overflow-visible rounded-2xl transition-all duration-300 hover:z-40 hover:-translate-y-1 hover:border-white/20 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7dd3fc]"
  >
    {/* clipped media layer */}
    <div className="absolute inset-0 overflow-hidden rounded-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d1117] via-[#0f1923] to-[#060b10]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:28px_28px] opacity-35" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,rgba(0,164,239,0.09),transparent_70%)]" />

      <div className="absolute inset-0 flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:blur-[3px] group-hover:brightness-50">
        <div
          className="relative rounded-[2rem] border-[3px] border-white/20 bg-black shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_20px_60px_-10px_rgba(0,0,0,0.85)] overflow-hidden"
          style={{ width: '148px', height: '272px' }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-4 bg-black rounded-b-xl z-20 flex items-center justify-center gap-1">
            <div className="w-1 h-1 rounded-full bg-zinc-700" />
            <div className="w-5 h-1.5 rounded-full bg-zinc-700" />
          </div>
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
        </div>

        <div className="absolute rounded-r-full bg-white/15" style={{ left: 'calc(50% - 77px)', top: '88px', width: '3px', height: '22px' }} />
        <div className="absolute rounded-r-full bg-white/15" style={{ left: 'calc(50% - 77px)', top: '120px', width: '3px', height: '36px' }} />
        <div className="absolute rounded-l-full bg-white/15" style={{ right: 'calc(50% - 77px)', top: '108px', width: '3px', height: '44px' }} />
      </div>

      <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/40 p-2 text-[#7dd3fc] backdrop-blur">
        {project.icon}
      </div>
    </div>

    {/* large popup overlay — breaks out beyond card bounds */}
    <GlassOverlay project={project} />
  </motion.div>
);

/* ─── Standard card ─── */
const StandardCard: React.FC<{ project: Project; isOpen: boolean; onToggle: (id: number) => void }> = ({
  project,
  isOpen,
  onToggle,
}) => (
  <motion.div
    variants={itemVariants}
    data-open={isOpen ? 'true' : undefined}
    role="button"
    tabIndex={0}
    aria-expanded={isOpen}
    aria-label={`View details for ${project.title}`}
    onClick={(e) => {
      e.stopPropagation();
      onToggle(project.id);
    }}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onToggle(project.id);
      }
    }}
    className="group cert-card relative h-72 overflow-visible rounded-2xl transition-all duration-300 hover:z-40 hover:-translate-y-1 hover:border-white/20 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7dd3fc]"
  >
    {/* clipped media layer */}
    <div className="absolute inset-0 overflow-hidden rounded-2xl">
      <img
        src={project.image}
        alt={project.title}
        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:blur-[3px] group-hover:brightness-50"
      />
      <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/40 p-2 text-[#7dd3fc] backdrop-blur">
        {project.icon}
      </div>
    </div>

    {/* large popup overlay — breaks out beyond card bounds */}
    <GlassOverlay project={project} />
  </motion.div>
);

/* ─── Main component ─── */
const Projects: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [activeFilter, setActiveFilter] = useState<string>('All');
  // tracks which card's popup is tap-opened on mobile/touch (desktop still uses hover)
  const [openId, setOpenId] = useState<number | null>(null);
  const handleToggle = (id: number) => setOpenId((prev) => (prev === id ? null : id));

  const projects: Project[] = [
    {
      id: 1,
      title: 'Campus Cloud Network',
      description:
        'AI-powered campus management ecosystem — 8 production apps with face recognition attendance (KNN), AI notes/PPT/exam generation via Gemini, social forum (FORAM), e-library, fee payment, and e-canteen across 4 role-based panels.',
      problem: 'New ERP rollout meant more manual work for students & faculty, not less.',
      solution: 'One platform — AutoSlideX, PaperVista, career guidance & 5 more — automating attendance, exams, forum & resumes.',
      differentiators: ['8 sub-apps: AutoSlideX, PaperVista, forum, career guidance & more', 'Face-recognition self-attendance (KNN)', 'Replaces manual ERP workflows end-to-end'],
      image: '/images/Student-Campus-Cloud-Network.png',
      tags: ['AI', 'Full Stack', 'Campus Management', 'Machine Learning'],
      technologies: [
        'React', 'TypeScript', 'JavaScript', 'Vite',
        'Python', 'Flask', 'FastAPI',
        'Gemini API', 'Generative AI', 'NLP', 'Machine Learning',
        'KNN', 'OpenCV', 'dlib', 'scikit-learn', 'NumPy', 'TensorFlow',
        'Supabase', 'Supabase Storage', 'PostgreSQL', 'SQL', 'RDBMS',
        'Clerk API', 'JWT', 'bcryptjs', 'REST API', 'JSON',
        'Cloudinary', 'Google Custom Search API', 'Pydantic',
        'python-pptx', 'python-docx',
        'Tailwind CSS', 'Framer Motion', 'Lucide React',
        'Netlify', 'Vercel', 'Render',
        'Prettier', 'ESLint', 'PostCSS',
      ],
      githubUrl: 'https://github.com/jiyanshuj/Major-project',
      liveUrl: 'https://neuro-campus-73w8.vercel.app/',
      icon: <GraduationCap className="w-6 h-6" />,
    },
    {
      id: 2,
      title: 'Smart Career Guidance System',
      description:
        'AI-driven career assessment platform with adaptive quizzes across 6 CS domains (OS, DBMS, Networks, Aptitude, Verbal, Programming), Gemini-generated questions, and a performance analytics dashboard.',
      problem: 'Students don\u2019t know which technical domain actually fits their strengths.',
      solution: '30-question adaptive quizzes across 6 CS domains, with AI-generated questions and career analytics.',
      differentiators: ['6 domains: OS, DBMS, Networks, Aptitude, Verbal, Programming', 'Gemini-generated questions, instant feedback, timed', 'Analytics dashboard + career recommendations'],
      image: '/images/Smart-Career-Guidance-System.png',
      tags: ['AI', 'EdTech', 'Full Stack'],
      technologies: [
        'React.js', 'TypeScript', 'JavaScript', 'Vite',
        'Python', 'Flask', 'FastAPI',
        'Gemini API', 'Generative AI',
        'Clerk API', 'REST API', 'JSON',
        'Tailwind CSS', 'Framer Motion', 'Lucide React',
        'Vercel', 'Netlify',
      ],
      githubUrl: 'https://github.com/jiyanshuj/Smart-Career-Guidance-System',
      liveUrl: 'https://smart-career-guidance-system.vercel.app/',
      icon: <Compass className="w-6 h-6" />,
    },
    {
      id: 3,
      title: 'AutoSlideX',
      description:
        'AI presentation generator — enter a topic and slide count, Gemini creates structured content with professional layouts, context-aware image fetching, and exports to PowerPoint (.pptx).',
      problem: 'Building PPTs & finding the right diagrams eats up teachers\u2019 time.',
      solution: 'AI pulls verified diagrams (GDG, W3Schools) and summarizes each topic into slides.',
      differentiators: ['Verified-source image search (GDG, W3Schools)', 'Auto-summarized topic content', 'One-click .pptx export'],
      image: '/images/AutoSlideX.png',
      tags: ['AI', 'Productivity'],
      technologies: [
        'React 19.1', 'Vite 7.1', 'Tailwind CSS 3.4', 'Lucide React', 'ESLint',
        'FastAPI', 'Uvicorn', 'Gemini API', 'Google Custom Search API',
        'python-pptx', 'Pydantic', 'Pillow',
      ],
      githubUrl: 'https://github.com/jiyanshuj/AutoSlideX',
      liveUrl: 'https://auto-slide-x.vercel.app/',
      icon: <Presentation className="w-6 h-6" />,
    },
    {
      id: 4,
      title: 'PaperVista',
      description:
        'AI exam paper generator for educators. Supports MST-1, MST-2, and End-Semester formats with configurable difficulty, topic-based Gemini question generation, and print-ready university-style output.',
      problem: 'Manually setting exam papers is repetitive and time-consuming for teachers.',
      solution: 'AI generates topic-based questions in standard university MST / End-Sem formats.',
      differentiators: ['3 exam format templates', 'Configurable difficulty levels', 'Print-ready output'],
      image: '/images/PaperVista.png',
      tags: ['AI', 'EdTech'],
      technologies: [
        'React 19.1', 'Vite 7.1', 'Tailwind CSS 3.4', 'PostCSS', 'Lucide React',
        'FastAPI', 'Uvicorn', 'Gemini API', 'Pydantic', 'Python 3.11',
      ],
      githubUrl: 'https://github.com/jiyanshuj/PaperVista',
      liveUrl: 'https://paper-vista-five.vercel.app/',
      icon: <FileText className="w-6 h-6" />,
    },
    {
      id: 7,
      title: 'EV Site Suitability Analysis',
      description:
        'ML and decision-analysis pipeline for selecting the best EV charging station locations in India, combining transaction, traffic, telecom, and grid data to rank candidate sites by demand, readiness, and financial viability.',
      problem: 'Where should new EV stations go so they get used and stay financially viable?',
      solution: 'ML + AHP pipeline scores candidate sites across India on demand, infrastructure & ROI.',
      differentiators: [
        'XGBoost models: kWh demand, utilization & success probability',
        'AHP ranks sites on 6 criteria (traffic, grid, EV adoption...)',
        'NPV/ROI/payback filtering, 30km minimum site spacing',
        'Flask API + Folium maps, tunneled via ngrok',
      ],
      image: '/images/EY-EV-Charging.png',
      tags: ['Full Stack', 'AI', 'Machine Learning'],
      technologies: [
        'Python', 'Pandas', 'NumPy', 'scikit-learn', 'XGBoost',
        'Matplotlib', 'Seaborn', 'Joblib', 'GeoPandas', 'Shapely', 'Folium',
        'AHP', 'Flask', 'Flask-CORS', 'ngrok', 'Jupyter',
      ],
      githubUrl: '#',
      icon: <Activity className="w-6 h-6" />,
    },
    {
      id: 5,
      title: 'HealthGuard AI',
      description:
        "ML app predicting risk for Diabetes, Coronary Heart Disease, and Parkinson's using pre-trained models. Auto-trains on UCI datasets with confidence levels and personalised health recommendations.",
      problem: 'Early risk screening for common chronic diseases isn\u2019t easily accessible.',
      solution: 'ML models predict Diabetes, CHD & Parkinson\u2019s risk with confidence scores.',
      differentiators: ['3 disease models in one app', 'Auto-trains on UCI datasets', 'Personalized health tips'],
      image: '/images/Health-Guard-AI.png',
      tags: ['Machine Learning', 'Healthcare', 'Python'],
      technologies: ['Python', 'Streamlit', 'scikit-learn', 'Pandas', 'NumPy'],
      githubUrl: 'https://github.com/jiyanshuj/Health-Guard-AI',
      liveUrl: 'https://health-guard-ai.streamlit.app/',
      icon: <Brain className="w-6 h-6" />,
    },
    {
      id: 6,
      title: 'NextStep CV',
      description:
        'ATS-optimized AI resume builder with multi-section form, real-time preview, Gemini AI content optimization, and export to PDF & Word (.docx).',
      problem: 'Generic resumes often fail ATS filters and take hours to tailor.',
      solution: 'AI-optimized resume builder with live preview and PDF/Word export.',
      differentiators: ['Gemini content optimization', 'ATS-focused formatting', 'Dual PDF & DOCX export'],
      image: '/images/NextStep-CV.png',
      tags: ['Full Stack', 'AI'],
      technologies: ['React', 'TypeScript', 'Flask', 'Gemini API', 'python-docx', 'Tailwind CSS'],
      githubUrl: 'https://github.com/jiyanshuj/Resume-Gen',
      liveUrl: 'https://nextstep-resume.netlify.app/',
      icon: <FileText className="w-6 h-6" />,
    },
    {
      id: 14,
      title: 'SnapAttend',
      description:
        'Smart face-recognition attendance platform with live camera capture, student management, auto KNN model training, and real-time attendance tracking dashboard.',
      problem: 'Manual attendance-taking is slow, error-prone, and easy to fudge.',
      solution: 'Live face-recognition attendance with an auto-trained model and real-time dashboard.',
      differentiators: ['Live camera capture', 'Auto model retraining', 'Real-time tracking dashboard'],
      image: 'https://raw.githubusercontent.com/jiyanshuj/SnapAttend/main/Home.png',
      tags: ['AI', 'Full Stack', 'Machine Learning'],
      technologies: ['Flask', 'React', 'Vite', 'OpenCV', 'scikit-learn', 'SQLite'],
      githubUrl: 'https://github.com/jiyanshuj/SnapAttend',
      icon: <Activity className="w-6 h-6" />,
    },
    {
      id: 8,
      title: 'Resume Parser API',
      description:
        'FastAPI backend powering the job seeker app — parses uploaded PDF/DOCX resumes with Gemini AI, extracts structured profile data, handles Cloudinary file hosting, and stores results in MongoDB.',
      problem: 'Manually reading resumes to extract structured data doesn\u2019t scale.',
      solution: 'FastAPI service parses PDF/DOCX resumes into structured profiles via Gemini AI.',
      differentiators: ['AI-structured extraction', 'Cloud file hosting built-in', 'Powers a production job app'],
      image: '/images/Resume-Parser-API.png',
      tags: ['API', 'AI', 'Python'],
      technologies: ['FastAPI', 'Python', 'Gemini AI', 'MongoDB', 'Cloudinary', 'PyPDF2', 'Pydantic'],
      githubUrl: 'https://github.com/jiyanshuj/resume-parse',
      liveUrl: 'https://resume-parse-1.onrender.com',
      icon: <Shield className="w-5 h-5" />,
    },
    {
      id: 9,
      title: 'Skills Bridge Platform',
      description:
        'Career upskilling platform with AI-powered learning paths, Langflow video analysis chatbot, user dashboard, partner portal, admin panel, and multi-method auth (Email, GitHub, Google OAuth).',
      problem: 'Learners lack a personalized, guided path through upskilling content.',
      solution: 'AI learning paths with a video-analysis chatbot and dashboards for learners & partners.',
      differentiators: ['Langflow AI video chatbot', 'Multi-role portals', 'Multi-provider OAuth'],
      image: '/images/Skills-Bridge-Platform.png',
      tags: ['AI', 'EdTech', 'Full Stack'],
      technologies: ['React', 'TypeScript', 'Firebase', 'Langflow AI', 'Google OAuth', 'Tailwind CSS'],
      githubUrl: 'https://github.com/jiyanshuj/Skills-Bridge-Platform',
      liveUrl: 'https://skillpulse.netlify.app/',
      icon: <GraduationCap className="w-6 h-6" />,
    },
    {
      id: 10,
      title: 'Visnex Global',
      description:
        'AI-powered startup ecosystem platform connecting founders, investors, incubators, and partners. Features AI-driven matching, startup discovery, investor search, and real-time stats across 120+ countries.',
      problem: 'Founders and investors struggle to discover the right global connections.',
      solution: 'AI-matching platform connecting founders, investors & incubators across 120+ countries.',
      differentiators: ['AI-driven matchmaking', 'Global startup discovery', 'Real-time ecosystem stats'],
      image: '/images/Visnex-Global.png',
      tags: ['Full Stack', 'Web Development'],
      technologies: ['React', 'JavaScript', 'Python', 'Vercel'],
      githubUrl: 'https://github.com/jiyanshuj/Visnex-Global',
      liveUrl: 'https://visnex-global-2ake.vercel.app/#home',
      icon: <Globe className="w-6 h-6" />,
    },
    {
      id: 11,
      title: 'Error 404 Travel Planner',
      description:
        'Django web app for smart travel planning. Calculates distance via TomTom API, recommends transport mode (Bus/Train/Flight), and includes a hotel booking system with full payment flow.',
      problem: 'Planning multi-mode travel plus stay means juggling several separate tools.',
      solution: 'Calculates distance, recommends the best transport mode, and books hotels end-to-end.',
      differentiators: ['TomTom-based distance calculation', 'Smart transport recommendation', 'Integrated payment flow'],
      image: '/images/Error-404-Travel-Planner.png.png',
      tags: ['Full Stack', 'Web Development', 'Python'],
      technologies: ['Django', 'Python', 'TomTom API', 'PostgreSQL', 'JavaScript', 'HTML/CSS'],
      githubUrl: 'https://github.com/jiyanshuj/Error-404-v1',
      liveUrl: 'https://error-404-v1-1.onrender.com/',
      icon: <Activity className="w-6 h-6" />,
    },
    {
      id: 12,
      title: 'Job Seeker App',
      description:
        'React Native mobile app with swipe-based job matching, AI match scoring, salary range filters, saved jobs, and resume upload with AI parsing and Cloudinary storage.',
      problem: 'Job hunting on mobile feels tedious and impersonal.',
      solution: 'Swipe-based mobile job matching with AI scoring and resume auto-parsing.',
      differentiators: ['Swipe-to-apply UX', 'AI match scoring', 'Resume upload with AI parsing'],
      image: '/images/Job-Seeker-App.jpeg',
      tags: ['Mobile', 'Full Stack'],
      technologies: ['React Native', 'Expo', 'TypeScript', 'REST API'],
      githubUrl: 'https://github.com/jiyanshuj/job-seekr-app',
      icon: <Smartphone className="w-5 h-5" />,
      displayType: 'phone',
    },
  ];

  const filters = ['All', 'Full Stack', 'AI', 'Machine Learning', 'API', 'Mobile'];

  const filteredProjects =
    activeFilter === 'All'
      ? projects
      : projects.filter((p) => p.tags.includes(activeFilter));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
    <section id="projects" ref={ref} className="relative overflow-x-hidden bg-transparent py-24">
      <TerminalStyles />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-15%,rgba(52,60,130,0.34),transparent_72%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:42px_42px] opacity-35" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="cert-kicker mx-auto mb-6 flex items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
            <Sparkles size={14} />
            Featured Work
          </div>
          <h2 className="cert-title mb-4 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
            My Projects
          </h2>
          <div className="mx-auto mb-8 h-px w-24 bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
          <p className="mx-auto mb-8 max-w-3xl text-lg text-zinc-400">
            Projects that started as problems and ended as products
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${activeFilter === filter
                  ? 'border-[#00a4ef]/45 bg-[#00a4ef]/18 text-[#7dd3fc] shadow-[0_10px_30px_-18px_rgba(0,164,239,0.9)]'
                  : 'cert-card text-zinc-400 hover:border-white/25 hover:text-zinc-200'
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          onClick={() => setOpenId(null)}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProjects.map((project) =>
            project.displayType === 'phone' ? (
              <PhoneCard
                key={project.id}
                project={project}
                isOpen={openId === project.id}
                onToggle={handleToggle}
              />
            ) : (
              <StandardCard
                key={project.id}
                project={project}
                isOpen={openId === project.id}
                onToggle={handleToggle}
              />
            )
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;