import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Sparkles } from 'lucide-react';

type Skill = {
  name: string;
  icon: string;
  category: 'languages' | 'frameworks' | 'tools' | 'soft-skills';
};

const Skills: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const skills: Skill[] = [
    { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', category: 'languages' },
    { name: 'C++', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg', category: 'languages' },
    { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', category: 'languages' },
    { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', category: 'languages' },
    { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', category: 'frameworks' },
    { name: 'Django', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg', category: 'frameworks' },
    { name: 'Flask', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original-wordmark.svg', category: 'frameworks' },
    { name: 'FastAPI', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg', category: 'frameworks' },
    { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', category: 'tools' },
    { name: 'Redis', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg', category: 'tools' },
    { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', category: 'tools' },
    { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', category: 'tools' },
  ];

  const marqueeVariants = {
    animate: {
      x: [0, -1035],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop" as const,
          duration: 20,
          ease: "linear",
        },
      },
    },
  };

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

        <div className="mb-16 overflow-hidden">
          <motion.div
            className="flex gap-8"
            variants={marqueeVariants}
            animate="animate"
          >
            {[...skills, ...skills].map((skill, index) => (
              <motion.div
                key={`${skill.name}-${index}`}
                className="cert-card flex min-w-[110px] flex-col items-center justify-center rounded-xl p-4"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg border border-white/15 bg-white/[0.08] p-2">
                  {skill.icon ? (
                    <img
                      src={skill.icon}
                      alt={skill.name}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="text-center text-xs font-bold leading-none text-cyan-400">
                      {skill.name === 'GeoPandas' ? 'GPD' : 'XGB'}
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium text-zinc-200">
                  {skill.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Languages', items: ['Python', 'JavaScript', 'TypeScript', 'C++', 'SQL', 'HTML/CSS'] },
            { title: 'Backend', items: ['FastAPI', 'Flask', 'Django', 'Node.js', 'REST APIs', 'WebSockets'] },
            { title: 'ML/Data', items: ['scikit-learn', 'Pandas', 'NumPy', 'OpenCV', 'Gemini AI', 'Langflow'] },
            { title: 'Cloud', items: ['Azure', 'Vercel', 'Render', 'Netlify', 'Firebase', 'Supabase', 'Cloudinary'] },
            { title: 'Databases', items: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'Supabase'] },
            { title: 'Tools', items: ['Git', 'Docker', 'Postman', 'Figma', 'Linux', 'VS Code'] },
          ].map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="cert-card rounded-xl p-6 transition-colors hover:border-white/20"
            >
              <h3 className="mb-4 text-lg font-bold text-cyan-400">{category.title}</h3>
              <div className="flex flex-wrap gap-2">
                {category.items.map((item, i) => (
                  <span key={i} className="rounded-full border border-white/15 bg-white/[0.08] px-3 py-1 text-sm text-zinc-200">
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;