import { useEffect, useState, useRef } from 'react';
import { Menu, Moon, Sun, X, ArrowUpRight, Download, FileText } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { contact } from '../data/portfolio';

const navLinks = [
  { label: 'Experience', id: 'experience' },
  { label: 'Work', id: 'projects' },
  { label: 'Skills', id: 'skills' },
  { label: 'Credentials', id: 'certifications' },
  { label: 'Contact', id: 'contact' },
];

type HeaderProps = { theme: 'light' | 'dark'; onThemeToggle: () => void };

export default function Header({ theme, onThemeToggle }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState('top');
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile nav on click outside or Escape key
  useEffect(() => {
    if (!mobileOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileOpen]);

  // Most sections are React.lazy, so they are not in the DOM yet when this effect first runs.
  // Observe whatever exists now, then keep watching the DOM and pick up the rest as they mount.
  useEffect(() => {
    const ids = ['top', ...navLinks.map((link) => link.id)];
    const observed = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );

    // Returns true once every nav target is being observed.
    const observeAvailable = () => {
      ids.forEach((id) => {
        if (observed.has(id)) return;
        const el = document.getElementById(id);
        if (el) {
          observer.observe(el);
          observed.add(id);
        }
      });
      return observed.size === ids.length;
    };

    let mutationObserver: MutationObserver | null = null;
    if (!observeAvailable()) {
      mutationObserver = new MutationObserver(() => {
        if (observeAvailable()) {
          mutationObserver?.disconnect();
          mutationObserver = null;
        }
      });
      mutationObserver.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      mutationObserver?.disconnect();
      observer.disconnect();
    };
  }, []);

  const themeLabel = `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`;

  return (
    <header
      ref={headerRef}
      className={`site-header fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'px-3 pt-2 sm:pt-3'
          : 'border-b border-[var(--line)] bg-[var(--panel)]/80 backdrop-blur-md'
      }`}
    >
      <div
        className={`page-width header-content mx-auto flex h-14 items-center justify-between transition-all duration-300 ${
          isScrolled
            ? 'site-header--scrolled rounded-[1.25rem] sm:rounded-[1.5rem] border border-[var(--line-strong)] bg-[var(--panel)]/95 px-3.5 sm:px-6 shadow-[var(--shadow)] backdrop-blur-xl'
            : 'px-3.5 sm:px-6'
        }`}
      >
        {/* Brand Monogram & Identity */}
        <a
          href="#top"
          className="focus-ring group flex shrink-0 items-center gap-2 no-underline"
          aria-label="Jiyanshu Jain, back to top"
          onClick={() => setMobileOpen(false)}
        >
          <span className="text-base font-black tracking-tight text-[var(--text)] transition-transform group-hover:scale-110">
            JJ
          </span>
        </a>

        {/* Center Navigation Links (Desktop lg+) */}
        <nav className="hidden lg:flex items-center justify-center gap-1" aria-label="Primary navigation">
          {navLinks.map((link) => {
            const active = activeId === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                aria-current={active ? 'location' : undefined}
                className={`focus-ring relative whitespace-nowrap px-3 py-1.5 text-xs font-semibold no-underline transition-colors ${
                  active
                    ? 'text-[var(--text)]'
                    : 'text-[var(--muted-strong)] hover:text-[var(--text)]'
                }`}
              >
                <span>{link.label}</span>
                {active && (
                  <motion.span
                    layoutId="header-active-pill"
                    className="absolute inset-x-2 -bottom-1 h-[2px] bg-[var(--accent)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right Tools: Desktop (lg+) */}
        <div className="hidden lg:flex shrink-0 items-center gap-2.5">
          {/* Résumé Quick Action */}
          <a
            className="focus-ring mono inline-flex items-center gap-1.5 rounded-lg border border-[var(--text)] bg-[var(--accent)] px-3 py-1.5 text-xs font-bold text-[var(--accent-ink)] transition-transform hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_var(--text)]"
            href={contact.resume}
            target="_blank"
            rel="noopener noreferrer"
          >
            RÉSUMÉ
            <ArrowUpRight size={13} />
          </a>

          {/* Theme Switcher */}
          <button
            type="button"
            onClick={onThemeToggle}
            className="focus-ring grid h-8 w-8 place-items-center rounded-lg border border-[var(--line-strong)] bg-[var(--panel)] text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent-text)]"
            aria-label={themeLabel}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>

        {/* Right Tools: Mobile & Tablet (< lg) */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Compact Résumé Link */}
          <a
            href={contact.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring mono inline-flex items-center gap-1 rounded-md border border-[var(--line-strong)] bg-[var(--accent)] px-2.5 py-1 text-[11px] font-bold text-[var(--accent-ink)] transition-transform active:scale-95"
            title="Open Résumé"
          >
            <span>CV</span>
            <ArrowUpRight size={11} />
          </a>

          {/* Theme Switcher */}
          <button
            type="button"
            onClick={onThemeToggle}
            className="focus-ring grid h-8 w-8 place-items-center rounded-lg border border-[var(--line-strong)] bg-[var(--panel)] text-[var(--text)] transition-colors hover:border-[var(--accent)]"
            aria-label={themeLabel}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Hamburger Menu Button */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="focus-ring grid h-8 w-8 place-items-center rounded-lg border border-[var(--line-strong)] bg-[var(--panel)] text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent-text)]"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Floating Sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="page-width mx-auto px-3 pt-2 lg:hidden"
            aria-label="Mobile navigation"
          >
            <nav className="rounded-2xl border-2 border-[var(--line-strong)] bg-[var(--panel)]/95 p-4 shadow-2xl backdrop-blur-2xl">
              <div className="grid grid-cols-2 gap-2 pb-3.5 border-b border-[var(--line)]">
                {navLinks.map((link) => {
                  const active = activeId === link.id;
                  return (
                    <a
                      key={link.id}
                      href={`#${link.id}`}
                      onClick={() => setMobileOpen(false)}
                      className={`focus-ring flex items-center justify-between rounded-xl p-2.5 text-xs font-bold transition-all no-underline ${
                        active
                          ? 'border border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-text)] shadow-sm'
                          : 'border border-[var(--line)] bg-[var(--bg)] text-[var(--text)] hover:border-[var(--accent)]'
                      }`}
                    >
                      <span>{link.label}</span>
                      {active && <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />}
                    </a>
                  );
                })}
              </div>

              {/* Résumé Quick Actions inside Mobile Menu */}
              <div className="pt-3 flex flex-col gap-2">
                <a
                  href={contact.resumeDownload}
                  download="Jiyanshu-Jain-Resume.pdf"
                  className="focus-ring mono flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-xs font-bold text-[var(--accent-ink)] transition-transform active:scale-95 no-underline shadow-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  <Download size={14} />
                  <span>Download Résumé PDF</span>
                </a>

                <a
                  href={contact.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring mono flex items-center justify-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-xs font-semibold text-[var(--muted-strong)] hover:text-[var(--text)] transition-colors no-underline"
                  onClick={() => setMobileOpen(false)}
                >
                  <FileText size={13} />
                  <span>View in Drive ↗</span>
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}