import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Github, Brain, Activity, GraduationCap, FileText, Presentation, Compass, Sparkles } from 'lucide-react';

type Project = {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  features: string[];
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  icon: React.ReactNode;
};

const Projects: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [activeFilter, setActiveFilter] = useState<string>('All');

  const projects: Project[] = [
    {
      id: 1,
      title: "Student Campus Cloud Network",
      description: "A full-stack, cloud-based smart campus management system integrating AI attendance (face recognition), PaperVista, AutoSlideX, Smart Career Guidance, Student Forum, E-Canteen, E-Library, and Online Fee Payment with secure role-based access for Teacher, Student, Admin, and Guest panels, serving 10+ users.",
      image: "images/Student-Campus-Cloud-Network.png",
      tags: ["AI", "Cloud Computing", "Full Stack", "Campus Management"],
      features: [
        "AI-powered face recognition attendance",
        "Integrated PaperVista & AutoSlideX",
        "Smart Career Guidance System",
        "Student Forum & E-Library",
        "E-Canteen & Online Fee Payment",
        "Role-based access (Teacher/Student/Admin/Guest)"
      ],
      technologies: [
        "React.js",
        "Python",
        "Flask",
        "FastAPI",
        "Machine Learning",
        "KNN",
        "Gemini API",
        "Supabase",
        "PostgreSQL",
        "REST APIs"
      ],
      githubUrl: "https://github.com/Yug-Bothra/NEURO_CAMPUS",
      liveUrl: "https://neuro-campus-73w8.vercel.app/",
      icon: <GraduationCap className="w-6 h-6" />
    },
    {
      id: 2,
      title: "Smart Career Guidance System",
      description: "An AI-driven career assessment and guidance platform that evaluates students across core computer science domains including OS, DBMS, Compiler Design, OOP, and Programming. The system analyzes performance, tracks progress, and recommends personalized career paths and learning resources to support informed decision-making.",
      image: "images/Smart-Career-Guidance-System.png",
      tags: ["AI", "Career Guidance", "EdTech"],
      features: [
        "Domain-wise assessment (OS, DBMS, CD, OOP, Programming)",
        "Skill evaluation and progress analysis",
        "Personalized career path recommendations",
        "Curated learning resource suggestions",
        "Real-time progress tracking dashboard",
        "Secure authentication and user management"
      ],
      technologies: [
        "React.js",
        "Python",
        "FastAPI",
        "Clerk Authentication",
        "Supabase",
        "PostgreSQL",
        "REST API"
      ],
      githubUrl: "https://github.com/jiyanshuj/Smart-Career-Guidance-System",
      liveUrl: "https://smart-career-guidance-system.vercel.app/",
      icon: <Compass className="w-6 h-6" />
    },
    {
      id: 3,
      title: "AutoSlideX",
      description: "An AI-powered presentation generation platform that converts a simple topic into a complete, structured PowerPoint. It follows a two-step AI workflow where users first customize slide headings and then generate detailed content with relevant images and diagrams.",
      image: "images/AutoSlideX.png",
      tags: ["AI", "Presentation", "Productivity"],
      features: [
        "Two-step AI-based slide generation",
        "Editable slide structure before final creation",
        "Automatic content generation per slide",
        "Context-aware image fetching",
        "Architecture & diagram-aware slides",
        "Download-ready PowerPoint output"
      ],
      technologies: [
        "React",
        "FastAPI",
        "Python",
        "Gemini API",
        "Google Custom Search API",
        "PPTX",
        "REST API"
      ],
      githubUrl: "https://github.com/jiyanshuj/AutoSlideX",
      liveUrl: "https://auto-slide-x.vercel.app/",
      icon: <Presentation className="w-6 h-6" />
    },
    {
      id: 4,
      title: "PaperVista",
      description: "A smart AI-powered question paper generator designed for college examinations. PaperVista generates MST-1, MST-2, and End-Semester question papers in a proper university-style format based on subject, syllabus, and marks distribution.",
      image: "images/PaperVista.png",
      tags: ["AI", "Education", "Exam Automation"],
      features: [
        "MST-1, MST-2, and End-Sem paper generation",
        "College-standard question paper format",
        "Configurable number of questions and marks",
        "Balanced difficulty level",
        "Syllabus-based paper generation",
        "Downloadable question paper output"
      ],
      technologies: [
        "React",
        "FastAPI",
        "Python",
        "Gemini API",
        "REST API",
        "JSON"
      ],
      githubUrl: "https://github.com/jiyanshuj/PaperVista",
      liveUrl: "https://paper-vista-five.vercel.app/",
      icon: <FileText className="w-6 h-6" />
    },
    {
      id: 5,
      title: "Health Guard AI",
      description: "A machine learning-powered web application designed to predict diseases like Diabetes, Heart Disease, and Parkinson's based on user input. Utilizes pre-trained models and Streamlit for an intuitive user experience.",
      image: "images/Health-Guard-AI.png",
      tags: ["Python", "Machine Learning", "Healthcare"],
      features: [
        "Disease Prediction",
        "Health Analysis",
        "Custom Navigation",
        "User Interface"
      ],
      technologies: [
        "Python",
        "Streamlit",
        "scikit-learn",
        "Pandas",
        "NumPy"
      ],
      githubUrl: "https://github.com/jiyanshuj/Health-Guard-AI",
      liveUrl: "https://health-guard-ai.streamlit.app/",
      icon: <Brain className="w-6 h-6" />
    },
    {
      id: 6,
      title: "NextStep Resume",
      description: "A full-stack web application for generating professional resumes with a modern tech stack. Features include dynamic form handling, real-time preview, and document generation.",
      image: "images/NextStep-CV.png",
      tags: ["TypeScript", "Python", "Full Stack"],
      features: [
        "Dynamic form handling",
        "Real-time preview",
        "Document generation",
        "Responsive design",
        "Type safety",
        "Modern UI/UX"
      ],
      technologies: [
        "React",
        "TypeScript",
        "Flask",
        "Tailwind CSS",
        "PostgreSQL",
        "Python-docx"
      ],
      githubUrl: "https://github.com/jiyanshuj/Resume-Gen",
      liveUrl: "https://nextstep-resume.netlify.app/",
      icon: <FileText className="w-6 h-6" />
    },
    {
      id: 7,
      title: "Sustainable Travel Planner",
      description: "An eco-friendly travel planning application that helps users make environmentally conscious travel decisions. Developed during Hack Wave Hackathon.",
      image: "https://images.pexels.com/photos/7412069/pexels-photo-7412069.jpeg",
      tags: ["Python", "Web Development", "Sustainability"],
      features: [
        "Carbon footprint calculation",
        "Eco-friendly routes",
        "Impact tracking"
      ],
      technologies: [
        "Python",
        "Django",
        "JavaScript",
        "HTML/CSS",
        "APIs"
      ],
      githubUrl: "https://github.com/jiyanshuj/Errror-404-v1-",
      liveUrl: "https://error-404-v1-1.onrender.com/",
      icon: <Activity className="w-6 h-6" />
    },
    {
      id: 8,
      title: "Skills Bridge Platform",
      description: "An AI-powered educational platform bridging the gap between academic learning and job skills. The platform features personalized learning paths, skill gap analysis, and industry collaboration portal.",
      image: "images/Skills-Bridge-Platform.png",
      tags: ["AI", "Education", "Web Development"],
      features: [
        "AI-driven skill gap analysis",
        "Personalized learning paths",
        "Gamification features",
        "Industry collaboration portal",
        "Responsive design",
        "Resource library"
      ],
      technologies: [
        "React",
        "Node.js",
        "TensorFlow",
        "MongoDB",
        "Express",
        "AWS",
        "Docker"
      ],
      githubUrl: "https://github.com/jiyanshuj/project",
      liveUrl: "https://skillpulse.netlify.app/",
      icon: <GraduationCap className="w-6 h-6" />
    }
  ];

  // Updated filters
  const filters = ['All', 'Web Apps', 'AI/ML', 'APIs'];

  // Updated filter logic
  const filteredProjects = activeFilter === 'All'
    ? projects
    : projects.filter(project => {
      if (activeFilter === 'Web Apps') {
        return ['Web Development', 'Full Stack', 'TypeScript'].some(tag => project.tags.includes(tag));
      }
      if (activeFilter === 'AI/ML') {
        return ['AI', 'Machine Learning', 'Python', 'Healthcare', 'Education', 'Presentation', 'Productivity', 'Career Guidance', 'EdTech', 'Exam Automation', 'Campus Management', 'Cloud Computing'].some(tag => project.tags.includes(tag));
      }
      if (activeFilter === 'APIs') {
        return project.technologies.includes('APIs') || project.technologies.includes('REST API');
      }
      return false;
    });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
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
          <div className="cert-kicker mx-auto mb-6 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
            <Sparkles size={14} />
            Featured Work
          </div>
          <h2 className="cert-title mb-4 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
            My Projects
          </h2>
          <div className="mx-auto mb-8 h-px w-24 bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
          <p className="mx-auto mb-8 max-w-3xl text-lg text-zinc-400">
            Here are some of my notable projects that showcase my skills in machine learning, web development, and problem-solving.
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
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
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
                      <span
                        key={index}
                        className="rounded-full border border-white/15 bg-white/[0.08] px-2 py-1 text-xs font-medium text-zinc-100"
                      >
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
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;