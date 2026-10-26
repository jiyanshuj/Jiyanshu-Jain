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
// v4 key: any dark preference saved by earlier redesigns is ignored once, so a fresh visit is light.
const THEME_STORAGE_KEY = 'jiyanshu-theme-v4';
const LEGACY_THEME_STORAGE_KEYS = ['jiyanshu-theme', 'portfolio-theme-v2', 'jiyanshu-theme-v3'];

function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    LEGACY_THEME_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
  } catch { /* storage blocked: fall through to light */ }
  return 'light';
}

function App() {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  // Single source of truth: state drives both the data attribute and the .dark class.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try { localStorage.setItem(THEME_STORAGE_KEY, theme); } catch { /* ignore */ }
  }, [theme]);

  useEffect(() => {
    const ready = Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((resolve) => setTimeout(resolve, 650))]);
    ready.then(() => setLoading(false));
  }, []);

  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'));

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