import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Code, Award, GraduationCap, Sparkles } from 'lucide-react';

const About: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="about" ref={ref} className="relative overflow-hidden bg-transparent py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_72%_55%_at_50%_-15%,rgba(50,59,130,0.32),transparent_72%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:42px_42px] opacity-35" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <motion.div
          variants={variants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="cert-kicker mx-auto mb-6 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
            <Sparkles size={14} />
            Quick Intro
          </div>
          <h2 className="cert-title mb-4 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">About Me</h2>
          <div className="mx-auto mb-8 h-px w-24 bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
          <p className="mx-auto max-w-3xl text-lg text-zinc-400">
            I'm a passionate developer with a strong foundation in machine learning, web development, and software engineering.
            I love turning complex problems into elegant solutions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <motion.div
            variants={variants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="cert-card rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
          >
            <div className="flex items-center mb-4">
              <div className="mr-4 rounded-md border border-white/15 bg-white/[0.08] p-3 text-[#00a4ef]">
                <Code size={24} />
              </div>
              <h3 className="text-xl font-semibold text-zinc-100">Technical Skills</h3>
            </div>
            <p className="text-zinc-400">
              Proficient in Python, machine learning, and web development. Experienced in building AI-powered applications and full-stack web solutions.
            </p>
          </motion.div>

          <motion.div
            variants={variants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="cert-card rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
          >
            <div className="flex items-center mb-4">
              <div className="mr-4 rounded-md border border-white/15 bg-white/[0.08] p-3 text-[#00a4ef]">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-semibold text-zinc-100">Certifications</h3>
            </div>
            <p className="text-zinc-400">
              Microsoft Learn Certified in AI workloads and machine learning. Completed intensive Python programming course with focus on practical applications.
            </p>
          </motion.div>

          <motion.div
            variants={variants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="cert-card rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
          >
            <div className="flex items-center mb-4">
              <div className="mr-4 rounded-md border border-white/15 bg-white/[0.08] p-3 text-[#00a4ef]">
                <GraduationCap size={24} />
              </div>
              <h3 className="text-xl font-semibold text-zinc-100">Education</h3>
            </div>
            <p className="text-zinc-400">
              Currently pursuing Computer Science with specialization in AI and machine learning. Active participant in technical events and hackathons.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;