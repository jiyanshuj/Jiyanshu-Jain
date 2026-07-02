import React, { Suspense, useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import VisitorCounter from './components/VisitorCounter';
import LoadingScreen from './components/LoadingScreen';

const Skills = React.lazy(() => import('./components/Skills'));
const Experience = React.lazy(() => import('./components/Experience'));
const Projects = React.lazy(() => import('./components/Projects'));
const Certifications = React.lazy(() => import('./components/Certifications'));
const Contact = React.lazy(() => import('./components/Contact'));
const Footer = React.lazy(() => import('./components/Footer'));

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    let cancelled = false;

    const ready = Promise.race([
      // Resolves immediately when font loading APIs are unavailable.
      document.fonts?.ready ?? Promise.resolve(),
      // Hard cap so a slow connection never blocks the first render for long.
      new Promise((resolve) => setTimeout(resolve, 800)),
    ]);

    ready.then(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="cert-theme-shell min-h-screen transition-colors duration-300">
      <Header />
      <VisitorCounter />
      <main className="relative z-10">
        <Hero />
        <About />
        <Suspense fallback={null}>
          <Experience />
          <Skills />
          <Projects />
          <Certifications />
          <Contact />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default App;