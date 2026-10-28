import React, { Suspense, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import LoadingScreen from './components/LoadingScreen';
import { LiquidSculptureBackground } from './components/BorderGlow';

const Skills = React.lazy(() => import('./components/Skills'));
const Experience = React.lazy(() => import('./components/Experience'));
const Projects = React.lazy(() => import('./components/Projects'));
const Certifications = React.lazy(() => import('./components/Certifications'));
const Footer = React.lazy(() => import('./components/Footer'));

type Theme = 'light' | 'dark';
const THEME_STORAGE_KEY = 'jiyanshu-theme-v5';

function getSystemTheme(): Theme {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch { /* storage blocked: fall through to system */ }
  return getSystemTheme();
}

function App() {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  // Single source of truth: state drives both the data attribute and the .dark class.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Listen to system theme changes if user has not manually set a preference
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      try {
        const saved = localStorage.getItem(THEME_STORAGE_KEY);
        if (!saved) {
          setTheme(e.matches ? 'dark' : 'light');
        }
      } catch {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  useEffect(() => {
    const ready = Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((resolve) => setTimeout(resolve, 650))]);
    ready.then(() => setLoading(false));
  }, []);

  // Sections are lazy-loaded, so a link like /#contact has no target when the page first paints.
  // Wait for the target to mount, then jump to it (instant, so it does not animate from the top).
  useEffect(() => {
    const raw = window.location.hash.slice(1);
    if (!raw || raw === 'top') return;
    let id = raw;
    try { id = decodeURIComponent(raw); } catch { /* keep raw */ }

    const jump = () => {
      const el = document.getElementById(id);
      if (!el) return false;
      el.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'start' });
      return true;
    };
    if (jump()) return;

    const observer = new MutationObserver(() => {
      if (jump()) {
        observer.disconnect();
        window.clearTimeout(giveUp);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    const giveUp = window.setTimeout(() => observer.disconnect(), 6000);
    return () => {
      observer.disconnect();
      window.clearTimeout(giveUp);
    };
  }, []);

  const toggleTheme = () => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(THEME_STORAGE_KEY, next); } catch { /* ignore */ }
      return next;
    });
  };

  return (
    <>
      <AnimatePresence>{loading && <LoadingScreen />}</AnimatePresence>
      <div className="site-shell relative">
        {/* Liquid sculpture hero background (@gughigug/liquid-sculpture-hero on 21st.dev) */}
        <LiquidSculptureBackground />
        <Header theme={theme} onThemeToggle={toggleTheme} />
        <div className="content-col relative z-10">
          <main>
          <Hero />
          <Suspense fallback={null}>
            <Experience />
            <Projects skillFilter={selectedSkill} onClearSkillFilter={() => setSelectedSkill(null)} />
            <Skills selectedSkill={selectedSkill} onSelectSkill={(skill) => setSelectedSkill((current) => (current === skill ? null : skill))} onClearSkill={() => setSelectedSkill(null)} />
            <Certifications />
            <About />
          </Suspense>
        </main>
        <Suspense fallback={null}><Footer /></Suspense>
        </div>
      </div>
    </>
  );
}

export default App;