import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'About', id: 'about' },
    { name: 'Experience', id: 'experience' },
    { name: 'Skills', id: 'skills' },
    { name: 'Projects', id: 'projects' },
    { name: 'Contact', id: 'contact' },
  ];

  const socialLinks = [
    { icon: <Github size={20} />, url: 'https://github.com/jiyanshuj', label: 'GitHub' },
    { icon: <Linkedin size={20} />, url: 'https://www.linkedin.com/in/jiyanshu-jain/', label: 'LinkedIn' },
    { icon: <Mail size={20} />, url: 'mailto:jiyanshujain321@gmail.com', label: 'Email' },
  ];

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${mobileMenuOpen
        ? 'bg-[#0a0a0f]/55 py-3 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.85)] backdrop-blur-sm'
        : isScrolled
          ? 'bg-[#0a0a0f]/80 py-3 shadow-[0_12px_30px_-20px_rgba(0,0,0,0.9)] backdrop-blur-md'
          : 'bg-transparent py-6'
        }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="cert-title bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-2xl font-bold text-transparent"
        >
          JJ
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
            className="flex space-x-8"
          >
            {navLinks.map((link) => (
              <motion.li
                key={link.id}
                whileHover={{ y: -2 }}
                className="cursor-pointer font-medium text-zinc-400 transition-colors hover:text-[#7dd3fc]"
                onClick={() => scrollToSection(link.id)}
              >
                {link.name}
              </motion.li>
            ))}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex items-center space-x-4"
          >
            {socialLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.url}
                aria-label={link.label}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3, scale: 1.1 }}
                className="rounded-lg border border-transparent p-2 text-zinc-400 transition-all hover:border-white/10 hover:bg-white/[0.05] hover:text-[#7dd3fc]"
              >
                {link.icon}
              </motion.a>
            ))}
          </motion.div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-zinc-300"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-white/10 bg-[#0a0a0f]/50 shadow-[0_18px_45px_-25px_rgba(0,0,0,0.9)] backdrop-blur-sm"
        >
          <div className="container mx-auto px-4 py-4">
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    className="w-full py-2 text-left font-medium text-zinc-300 transition-colors hover:text-[#7dd3fc]"
                    onClick={() => scrollToSection(link.id)}
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center space-x-4 border-t border-white/10 pt-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  aria-label={link.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-zinc-400 transition-colors hover:text-[#7dd3fc]"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;