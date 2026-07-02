import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Sparkles,
  Code2,
  LayoutTemplate,
  Server,
  Brain,
  Cloud,
  Wrench,
  ChevronDown,
} from 'lucide-react';

type Skill = {
  name: string;
  icon?: string;
  category: 'languages' | 'frontend' | 'backend' | 'ml-data' | 'cloud-db' | 'mobile' | 'tools';
};

const Skills: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // tracks which category cards have their "long tail" expanded
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const toggleExpanded = (index: number) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const skills: Skill[] = [
    { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', category: 'languages' },
    { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', category: 'languages' },
    { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', category: 'languages' },
    { name: 'C++', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg', category: 'languages' },
    { name: 'SQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', category: 'languages' },
    { name: 'HTML/CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', category: 'languages' },
    { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', category: 'frontend' },
    { name: 'React Native', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', category: 'frontend' },
    { name: 'Vite', icon: 'https://vitejs.dev/logo.svg', category: 'frontend' },
    { name: 'Tailwind CSS', icon: 'https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg', category: 'frontend' },
    { name: 'Framer Motion', category: 'frontend' },
    { name: 'Lucide React', category: 'frontend' },
    { name: 'Expo', category: 'mobile' },
    { name: 'FastAPI', icon: 'https://cdn.worldvectorlogo.com/logos/fastapi.svg', category: 'backend' },
    { name: 'Flask', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg', category: 'backend' },
    { name: 'Django', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg', category: 'backend' },
    { name: 'REST APIs', category: 'backend' },
    { name: 'Uvicorn', category: 'backend' },
    { name: 'Gemini API', category: 'ml-data' },
    { name: 'Langflow AI', category: 'ml-data' },
    { name: 'OpenCV', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg', category: 'ml-data' },
    { name: 'scikit-learn', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg', category: 'ml-data' },
    { name: 'XGBoost', category: 'ml-data' },
    { name: 'TensorFlow', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg', category: 'ml-data' },
    { name: 'GeoPandas', category: 'ml-data' },
    { name: 'Pandas', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg', category: 'ml-data' },
    { name: 'NumPy', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg', category: 'ml-data' },
    { name: 'Pydantic', category: 'ml-data' },
    { name: 'Streamlit', category: 'ml-data' },
    { name: 'AHP', category: 'ml-data' },
    { name: 'SHAP', category: 'ml-data' },
    { name: 'Folium', category: 'ml-data' },
    { name: 'Shapely', category: 'ml-data' },
    { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', category: 'cloud-db' },
    { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', category: 'cloud-db' },
    { name: 'Redis', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg', category: 'cloud-db' },
    { name: 'SQLite', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg', category: 'cloud-db' },
    { name: 'Supabase', category: 'cloud-db' },
    { name: 'Firebase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg', category: 'cloud-db' },
    { name: 'Cloudinary', category: 'cloud-db' },
    { name: 'PostGIS', category: 'cloud-db' },
    { name: 'Clerk', category: 'cloud-db' },
    { name: 'Azure Databricks', category: 'cloud-db' },
    { name: 'QGIS', category: 'cloud-db' },
    { name: 'Vercel', icon: 'https://www.vectorlogo.zone/logos/vercel/vercel-icon.svg', category: 'cloud-db' },
    { name: 'Netlify', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/netlify/netlify-original.svg', category: 'cloud-db' },
    { name: 'Render', category: 'cloud-db' },
    { name: 'Google OAuth', category: 'cloud-db' },
    { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', category: 'tools' },
    { name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', category: 'tools' },
    { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', category: 'tools' },
    { name: 'Postman', category: 'tools' },
    { name: 'Jupyter', category: 'tools' },
    { name: 'VS Code', category: 'tools' },
    { name: 'Linux', category: 'tools' },
    { name: 'Figma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg', category: 'tools' },
    { name: 'ESLint', category: 'tools' },
    { name: 'Prettier', category: 'tools' },
    { name: 'ngrok', category: 'tools' },
    { name: 'Python-docx', category: 'tools' },
    { name: 'Python-pptx', category: 'tools' },
    { name: 'PyPDF2', category: 'tools' },
    { name: 'Pillow', category: 'tools' },
    { name: 'TomTom API', category: 'tools' },
    { name: 'Google Custom Search API', category: 'tools' },
  ];

  const groupedSkills = [
    {
      title: 'Languages',
      icon: Code2,
      items: ['Python', 'TypeScript', 'JavaScript', 'C++', 'SQL', 'HTML/CSS'],
    },
    {
      title: 'Frontend',
      icon: LayoutTemplate,
      items: ['React', 'React Native', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Lucide React', 'Expo'],
    },
    {
      title: 'Backend',
      icon: Server,
      items: ['FastAPI', 'Flask', 'Django', 'REST APIs', 'Uvicorn'],
    },
    {
      title: 'ML / Data',
      icon: Brain,
      items: ['Gemini API', 'Langflow AI', 'OpenCV', 'scikit-learn', 'XGBoost', 'TensorFlow', 'GeoPandas', 'Pandas', 'NumPy', 'Pydantic', 'Streamlit', 'AHP', 'SHAP', 'Folium', 'Shapely'],
    },
    {
      title: 'Cloud / Data',
      icon: Cloud,
      items: ['PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Supabase', 'Firebase', 'Cloudinary', 'PostGIS', 'Clerk', 'Azure Databricks', 'QGIS', 'Vercel', 'Netlify', 'Render', 'Google OAuth'],
    },
    {
      title: 'Tools',
      icon: Wrench,
      items: ['Git', 'GitHub', 'Docker', 'Postman', 'Jupyter', 'VS Code', 'Linux', 'Figma', 'ESLint', 'Prettier', 'ngrok', 'Python-docx', 'Python-pptx', 'PyPDF2', 'Pillow', 'TomTom API', 'Google Custom Search API'],
    },
  ];

  const SECONDARY_PREVIEW_COUNT = 4;

  return (
    <section id="skills" ref={ref} className="relative overflow-hidden bg-transparent py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_72%_55%_at_50%_-15%,rgba(50,59,130,0.32),transparent_72%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:42px_42px] opacity-35" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="cert-kicker mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
            <Sparkles size={14} />
            Core Capabilities
          </div>
          <h2 className="cert-title mb-4 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">My Skills</h2>
          <div className="mx-auto mb-8 h-px w-24 bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
          <p className="mx-auto max-w-3xl text-lg text-zinc-400">
            Every skill here has a project behind it
          </p>
        </motion.div>

        {/* Category breakdown — recognizable tech leads as icon chips, the long tail collapses */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupedSkills.map((category, index) => {
            const CategoryIcon = category.icon;

            const itemsWithData = category.items.map((name) => ({
              name,
              icon: skills.find((s) => s.name === name)?.icon,
            }));

            // Recognizable-logo skills surface first; unlabeled ones become quieter secondary pills
            const primaryItems = itemsWithData.filter((item) => item.icon);
            const secondaryItems = itemsWithData.filter((item) => !item.icon);

            const isExpanded = expanded[index];
            const visibleSecondary = isExpanded
              ? secondaryItems
              : secondaryItems.slice(0, SECONDARY_PREVIEW_COUNT);
            const hiddenCount = secondaryItems.length - visibleSecondary.length;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="cert-card rounded-xl p-6 transition-colors hover:border-white/20"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CategoryIcon size={18} className="text-cyan-400" />
                    <h3 className="text-lg font-bold text-cyan-400">{category.title}</h3>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-xs font-medium text-zinc-500">
                    {category.items.length}
                  </span>
                </div>

                {/* Primary: recognizable logos, scannable at a glance */}
                {primaryItems.length > 0 && (
                  <div className="mb-4 grid grid-cols-2 gap-2">
                    {primaryItems.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.08] px-2.5 py-2"
                      >
                        <img src={item.icon} alt={item.name} className="h-5 w-5 shrink-0 object-contain" />
                        <span className="truncate text-sm font-medium text-zinc-200">{item.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Secondary: everything else, quieter and collapsible */}
                {secondaryItems.length > 0 && (
                  <>
                    {primaryItems.length > 0 && (
                      <div className="mb-3 h-px w-full bg-white/10" />
                    )}
                    <div className="flex flex-wrap gap-2">
                      {visibleSecondary.map((item) => (
                        <span
                          key={item.name}
                          className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-400"
                        >
                          {item.name}
                        </span>
                      ))}
                    </div>

                    {hiddenCount > 0 && (
                      <button
                        type="button"
                        onClick={() => toggleExpanded(index)}
                        className="mt-3 flex items-center gap-1 text-xs font-medium text-cyan-400/80 transition-colors hover:text-cyan-300"
                      >
                        {isExpanded ? 'Show less' : `+${hiddenCount} more`}
                        <ChevronDown
                          size={14}
                          className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                    )}
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;