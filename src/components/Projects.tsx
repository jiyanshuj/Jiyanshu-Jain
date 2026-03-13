import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Github, Brain, Activity, GraduationCap, FileText, Presentation, Compass, Sparkles, Globe, Smartphone, Shield } from 'lucide-react';

type Project = {
  id: number;
  title: string;
  description: string;
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

/* ─── Phone frame card ─── */
const PhoneCard: React.FC<{ project: Project }> = ({ project }) => (
  <motion.div
    variants={itemVariants}
    className="group cert-card relative h-80 overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
  >
    {/* dark bg so phone looks intentional */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#0d1117] via-[#0f1923] to-[#060b10]" />
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:28px_28px] opacity-35" />
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,rgba(0,164,239,0.09),transparent_70%)]" />

    {/* centered phone mockup — visible by default, scales on hover */}
    <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
      <div
        className="relative rounded-[2rem] border-[3px] border-white/20 bg-black shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_20px_60px_-10px_rgba(0,0,0,0.85)] overflow-hidden"
        style={{ width: '148px', height: '272px' }}
      >
        {/* notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-4 bg-black rounded-b-xl z-20 flex items-center justify-center gap-1">
          <div className="w-1 h-1 rounded-full bg-zinc-700" />
          <div className="w-5 h-1.5 rounded-full bg-zinc-700" />
        </div>
        {/* screen */}
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover object-top"
        />
        {/* shine */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* side buttons */}
      <div className="absolute rounded-r-full bg-white/15" style={{ left: 'calc(50% - 77px)', top: '88px', width: '3px', height: '22px' }} />
      <div className="absolute rounded-r-full bg-white/15" style={{ left: 'calc(50% - 77px)', top: '120px', width: '3px', height: '36px' }} />
      <div className="absolute rounded-l-full bg-white/15" style={{ right: 'calc(50% - 77px)', top: '108px', width: '3px', height: '44px' }} />
    </div>

    {/* hover overlay — same pattern as StandardCard */}
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#030305]/95 via-[#040507]/75 to-transparent opacity-0 transition-opacity duration-300 group-hover:pointer-events-auto group-hover:opacity-100">
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <h3 className="mb-2 text-xl font-bold text-zinc-100">{project.title}</h3>
        <p className="mb-4 line-clamp-2 text-sm text-zinc-300">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 3).map((tech, index) => (
            <span key={index} className="rounded-full border border-white/15 bg-white/[0.08] px-2 py-1 text-xs font-medium text-zinc-100">
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="rounded-full border border-white/15 bg-white/[0.08] px-2 py-1 text-xs font-medium text-zinc-100">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-md border border-white/20 bg-white/[0.12] px-3 py-1 text-sm font-medium text-zinc-100 transition-colors hover:bg-white/[0.18]"
          >
            <Github size={14} />
            <span>Code</span>
          </a>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-md border border-[#00a4ef]/35 bg-[#00a4ef]/15 px-3 py-1 text-sm font-medium text-[#7dd3fc] transition-colors hover:bg-[#00a4ef]/25"
            >
              <ExternalLink size={14} />
              <span>Demo</span>
            </a>
          )}
        </div>
      </div>
    </div>

    {/* icon badge — top right, always visible */}
    <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-white/[0.13] p-2 text-[#7dd3fc] backdrop-blur">
      {project.icon}
    </div>
  </motion.div>
);

/* ─── Standard card (unchanged) ─── */
const StandardCard: React.FC<{ project: Project }> = ({ project }) => (
  <motion.div
    variants={itemVariants}
    className="group cert-card relative h-72 overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
  >
    <img
      src={project.image}
      alt={project.title}
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
    />

    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#030305]/95 via-[#040507]/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:pointer-events-auto group-hover:opacity-100">
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <h3 className="mb-2 text-xl font-bold text-zinc-100">{project.title}</h3>
        <p className="mb-4 line-clamp-2 text-sm text-zinc-300">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 3).map((tech, index) => (
            <span key={index} className="rounded-full border border-white/15 bg-white/[0.08] px-2 py-1 text-xs font-medium text-zinc-100">
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="rounded-full border border-white/15 bg-white/[0.08] px-2 py-1 text-xs font-medium text-zinc-100">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-md border border-white/20 bg-white/[0.12] px-3 py-1 text-sm font-medium text-zinc-100 transition-colors hover:bg-white/[0.18]"
          >
            <Github size={14} />
            <span>Code</span>
          </a>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-md border border-[#00a4ef]/35 bg-[#00a4ef]/15 px-3 py-1 text-sm font-medium text-[#7dd3fc] transition-colors hover:bg-[#00a4ef]/25"
            >
              <ExternalLink size={14} />
              <span>Demo</span>
            </a>
          )}
        </div>
      </div>
    </div>

    <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-white/[0.13] p-2 text-[#7dd3fc] backdrop-blur">
      {project.icon}
    </div>
  </motion.div>
);

/* ─── Main component ─── */
const Projects: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const projects: Project[] = [
    {
      id: 1,
      title: 'Student Campus Cloud Network',
      description:
        'AI-powered campus management ecosystem — 8 production apps with face recognition attendance (KNN), AI notes/PPT/exam generation via Gemini, social forum (FORAM), e-library, fee payment, and e-canteen across 4 role-based panels.',
      image: '/images/Student-Campus-Cloud-Network.png',
      tags: ['AI', 'Full Stack', 'Campus Management'],
      technologies: ['React.js', 'FastAPI', 'Gemini API', 'Supabase', 'PostgreSQL', 'KNN', 'OpenCV'],
      githubUrl: 'https://github.com/jiyanshuj/Major-project',
      liveUrl: 'https://neuro-campus-73w8.vercel.app/',
      icon: <GraduationCap className="w-6 h-6" />,
    },
    {
      id: 2,
      title: 'Smart Career Guidance System',
      description:
        'AI-driven career assessment platform with adaptive quizzes across 6 CS domains (OS, DBMS, Networks, Aptitude, Verbal, Programming), Gemini-generated questions, and a performance analytics dashboard.',
      image: '/images/Smart-Career-Guidance-System.png',
      tags: ['AI', 'EdTech', 'Full Stack'],
      technologies: ['React.js', 'TypeScript', 'Flask', 'Clerk', 'Supabase', 'Gemini API', 'REST API'],
      githubUrl: 'https://github.com/jiyanshuj/Smart-Career-Guidance-System',
      liveUrl: 'https://smart-career-guidance-system.vercel.app/',
      icon: <Compass className="w-6 h-6" />,
    },
    {
      id: 3,
      title: 'AutoSlideX',
      description:
        'AI presentation generator — enter a topic and slide count, Gemini creates structured content with professional layouts, context-aware image fetching, and exports to PowerPoint (.pptx).',
      image: '/images/AutoSlideX.png',
      tags: ['AI', 'Productivity'],
      technologies: ['React', 'FastAPI', 'Python', 'Gemini API', 'Google Custom Search API', 'python-pptx'],
      githubUrl: 'https://github.com/jiyanshuj/AutoSlideX',
      liveUrl: 'https://auto-slide-x.vercel.app/',
      icon: <Presentation className="w-6 h-6" />,
    },
    {
      id: 4,
      title: 'PaperVista',
      description:
        'AI exam paper generator for educators. Supports MST-1, MST-2, and End-Semester formats with configurable difficulty, topic-based Gemini question generation, and print-ready university-style output.',
      image: '/images/PaperVista.png',
      tags: ['AI', 'EdTech'],
      technologies: ['React', 'FastAPI', 'Python', 'Gemini API', 'Pydantic', 'REST API'],
      githubUrl: 'https://github.com/jiyanshuj/PaperVista',
      liveUrl: 'https://paper-vista-five.vercel.app/',
      icon: <FileText className="w-6 h-6" />,
    },
    {
      id: 5,
      title: 'HealthGuard AI',
      description:
        "ML app predicting risk for Diabetes, Coronary Heart Disease, and Parkinson's using pre-trained models. Auto-trains on UCI datasets with confidence levels and personalised health recommendations.",
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
      image: '/images/NextStep-CV.png',
      tags: ['Full Stack', 'AI'],
      technologies: ['React', 'TypeScript', 'Flask', 'Gemini API', 'python-docx', 'Tailwind CSS'],
      githubUrl: 'https://github.com/jiyanshuj/Resume-Gen',
      liveUrl: 'https://nextstep-resume.netlify.app/',
      icon: <FileText className="w-6 h-6" />,
    },
    {
      id: 7,
      title: 'EY EV Charging Station Locator',
      description:
        'Built at EY — Production-grade geospatial platform for EV charging infrastructure. Features real-time station search, route optimization, availability tracking, and analytics dashboard with 50K+ station data.',
      image: '/images/EY-EV-Charging.png',
      tags: ['Full Stack', 'AI'],
      technologies: ['React', 'FastAPI', 'GeoPandas', 'XGBoost', 'PostgreSQL', 'Redis', 'Mapbox'],
      githubUrl: '#',
      icon: <Activity className="w-6 h-6" />,
    },
    {
      id: 8,
      title: 'Resume Parser API',
      description:
        'FastAPI backend powering the job seeker app — parses uploaded PDF/DOCX resumes with Gemini AI, extracts structured profile data, handles Cloudinary file hosting, and stores results in MongoDB.',
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
      image: 'https://images.pexels.com/photos/7412069/pexels-photo-7412069.jpeg',
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
    <section id="projects" ref={ref} className="relative overflow-hidden bg-transparent py-24">
      <div className="pointer-events-none absolute inset-0">
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
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                  activeFilter === filter
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProjects.map((project) =>
            project.displayType === 'phone' ? (
              <PhoneCard key={project.id} project={project} />
            ) : (
              <StandardCard key={project.id} project={project} />
            )
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;