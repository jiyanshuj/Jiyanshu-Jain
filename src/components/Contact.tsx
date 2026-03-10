import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mail, Github, Linkedin, Heart, ArrowUpRight, Sparkles } from 'lucide-react';

const Contact: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const socialLinks = [
    {
      icon: <Github size={34} />,
      title: 'GitHub',
      subtitle: 'Explore projects and experiments',
      link: 'https://github.com/jiyanshuj',
      accent: 'text-zinc-200',
      ring: 'group-hover:border-zinc-400/40',
      glow: 'group-hover:shadow-[0_0_40px_-20px_rgba(255,255,255,0.45)]',
    },
    {
      icon: <Mail size={34} />,
      title: 'Email',
      subtitle: 'Reach out for work or collaboration',
      link: 'mailto:jiyanshujain321@gmail.com',
      accent: 'text-rose-300',
      ring: 'group-hover:border-rose-400/40',
      glow: 'group-hover:shadow-[0_0_40px_-20px_rgba(244,63,94,0.65)]',
    },
    {
      icon: <Linkedin size={34} />,
      title: 'LinkedIn',
      subtitle: 'Connect professionally and network',
      link: 'https://www.linkedin.com/in/jiyanshu-jain',
      accent: 'text-cyan-300',
      ring: 'group-hover:border-cyan-400/40',
      glow: 'group-hover:shadow-[0_0_40px_-20px_rgba(34,211,238,0.65)]',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        type: "spring",
        stiffness: 100
      }
    },
  };

  return (
    <section id="contact" ref={ref} className="relative overflow-hidden bg-transparent py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_-10%,rgba(48,56,125,0.35),transparent_72%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:42px_42px] opacity-30" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="cert-kicker mx-auto mb-6 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur">
            <Sparkles size={14} />
            Get In Touch
          </div>
          <h2 className="cert-title mb-6 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            Let's Connect
          </h2>
          <div className="mx-auto mb-8 h-px w-28 bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
          <p className="mx-auto max-w-2xl text-base text-zinc-400 md:text-lg">
            I enjoy building practical, impactful products. If you have an idea, opportunity, or challenge, I would love to collaborate.
          </p>

          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { label: 'Open To', value: 'Projects' },
              { label: 'Preferred', value: 'Email' },
              { label: 'Timezone', value: 'IST' },
            ].map((stat) => (
              <div key={stat.label} className="cert-card rounded-xl px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">{stat.label}</p>
                <p className="mt-1 text-sm font-semibold text-zinc-200">{stat.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mb-16 grid grid-cols-1 gap-5 md:grid-cols-3"
        >
          {socialLinks.map((social, index) => (
            <motion.a
              key={index}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              variants={itemVariants}
              whileHover={{
                scale: 1.01,
                y: -4
              }}
              whileTap={{ scale: 0.95 }}
              className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-7 text-left backdrop-blur-md transition-all duration-300 ${social.ring} ${social.glow}`}
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-40" />
              <div className={`mb-5 inline-flex rounded-xl border border-white/10 bg-white/[0.03] p-3 transition-colors ${social.accent}`}>
                {social.icon}
              </div>

              <h3 className="mb-2 text-xl font-bold text-white">
                {social.title}
              </h3>
              <p className="mb-5 text-sm leading-relaxed text-zinc-400">
                {social.subtitle}
              </p>

              <div className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 transition-colors group-hover:text-white">
                Reach out
                <ArrowUpRight size={16} />
              </div>
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <div className="cert-card mx-auto max-w-2xl rounded-3xl p-8">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="mb-4"
            >
              <Heart size={34} className="mx-auto text-rose-400" />
            </motion.div>
            <h3 className="cert-title mx-auto mb-4 max-w-xl bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-2xl font-bold leading-tight text-transparent md:text-3xl">
              "Build what matters. Make it useful. Keep it human."
            </h3>
            <p className="mx-auto max-w-xl text-xs leading-relaxed text-zinc-400 md:text-sm">
              I love collaborating on ideas that solve real problems and create measurable impact.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
