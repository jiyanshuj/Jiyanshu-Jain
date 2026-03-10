import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Heart, ChevronUp, Sparkles, ArrowUpRight } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: <Github size={18} />,
      label: 'GitHub',
      href: 'https://github.com/jiyanshuj',
      accent: 'group-hover:text-zinc-100',
    },
    {
      icon: <Linkedin size={18} />,
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/jiyanshu-jain/',
      accent: 'group-hover:text-cyan-300',
    },
    {
      icon: <Mail size={18} />,
      label: 'Email',
      href: 'mailto:jiyanshujain@gmail.com',
      accent: 'group-hover:text-rose-300',
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden bg-transparent py-16 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_120%,rgba(34,211,238,0.14),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:44px_44px] opacity-35" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="cert-card rounded-3xl p-7 md:p-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="cert-kicker mb-4 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em]">
                <Sparkles size={13} />
                Thanks For Visiting
              </div>
              <h3 className="cert-title mb-2 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
                Jiyanshu Jain
              </h3>
              <p className="max-w-md text-sm leading-relaxed text-zinc-400 md:text-base">
                Building practical digital products with clean UI, strong fundamentals, and meaningful user impact.
              </p>
            </div>

            <div className="flex flex-col items-start gap-4 md:items-end">
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`cert-card group inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-zinc-400 transition-all duration-300 hover:border-white/25 hover:bg-white/[0.06] ${social.accent}`}
                    aria-label={social.label}
                  >
                    {social.icon}
                    <span>{social.label}</span>
                    <ArrowUpRight size={14} />
                  </a>
                ))}
              </div>
              <p className="text-sm text-zinc-500">
                Copyright {currentYear} Jiyanshu Jain. All rights reserved.
              </p>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
            <div className="inline-flex items-center gap-2 text-sm text-zinc-400">
              Made with <Heart size={14} className="text-rose-400" /> and curiosity
            </div>

            <motion.button
              onClick={scrollToTop}
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-[#00a4ef]/45 hover:text-[#7dd3fc]"
              aria-label="Scroll to top"
            >
              Top
              <ChevronUp size={16} className="transition-transform group-hover:-translate-y-0.5" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
