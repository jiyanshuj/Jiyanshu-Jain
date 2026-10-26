import { useState, useEffect } from 'react';
import { ArrowUp, Terminal, Radio, Github, Linkedin, Mail, FileText, Clock, MapPin, Copy, Check, ArrowUpRight } from 'lucide-react';
import VisitorCounter from './VisitorCounter';
import { contact } from '../data/portfolio';

const sitemap = [
  { num: '01', label: 'Professional Experience', id: 'experience' },
  { num: '02', label: 'Selected Projects', id: 'projects' },
  { num: '03', label: 'Technical Skills Matrix', id: 'skills' },
  { num: '04', label: 'Education & Credentials', id: 'certifications' },
  { num: '05', label: 'Engineering Approach', id: 'about' },
];

const dockLinks = [
  {
    name: 'GitHub',
    handle: '@jiyanshuj',
    href: contact.github,
    icon: Github,
    tag: 'Repository',
  },
  {
    name: 'LinkedIn',
    handle: 'in/jiyanshu-jain',
    href: contact.linkedin,
    icon: Linkedin,
    tag: 'Network',
  },
  {
    name: 'Direct Email',
    handle: contact.email,
    href: `mailto:${contact.email}`,
    icon: Mail,
    tag: 'Inquiries',
  },
  {
    name: 'Official Résumé',
    handle: 'PDF Document',
    href: contact.resume,
    icon: FileText,
    tag: 'Verified CV',
  },
];

export default function Footer() {
  const [timeString, setTimeString] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      setTimeString(formatted);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <footer 
      id="contact" 
      className="relative border-t-2 border-[var(--line-strong)] bg-[var(--panel)] pt-12 pb-8 overflow-hidden"
      aria-labelledby="contact-heading"
    >
      {/* Background Ambient Radial Glow */}
      <div 
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[var(--accent)]/5 rounded-full blur-[100px]"
        aria-hidden="true"
      />

      <div className="page-width relative z-10 space-y-10">
        {/* Contact Section Header: Status & Direct Action */}
        <div className="flex flex-col gap-6 border-b border-[var(--line)] pb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="mono text-xs font-bold uppercase tracking-wider text-[var(--accent-text)]">
              07 · Direct Contact &amp; Channels
            </span>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--line)] bg-[var(--panel-elevated)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="mono text-[11px] font-semibold text-[var(--text)]">
                Available for AI/ML Roles · Global Remote or On-site
              </span>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <h2 id="contact-heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--text)]">
                Got an idea? Let&apos;s build it.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--muted-strong)]">
                The quickest way to reach me is email. Open to AI/ML engineering positions, production data pipelines, and scalable technical collaborations.
              </p>

              {/* Big Email Link */}
              <a
                href={`mailto:${contact.email}`}
                className="focus-ring mt-5 inline-block text-[clamp(1.2rem,3vw,2.2rem)] font-bold tracking-tight text-[var(--text)] underline decoration-[var(--accent)] decoration-[2px] underline-offset-8 hover:text-[var(--accent-text)] transition-colors break-all"
              >
                {contact.email}
              </a>
            </div>

            {/* Telemetry & Fast Copy Actions */}
            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
              {/* Live IST Clock */}
              <div className="flex items-center gap-2 border border-[var(--line)] bg-[var(--bg)] px-3.5 py-2 rounded-lg text-xs mono text-[var(--muted-strong)]">
                <Clock size={13} className="text-[var(--accent-text)]" />
                <span>Indore, IN ·</span>
                <span className="font-semibold text-[var(--text)] tabular-nums">{timeString || 'IST'}</span>
              </div>

              {/* 1-Click Copy */}
              <button
                type="button"
                onClick={handleCopyEmail}
                className="group flex items-center gap-2 border border-[var(--line-strong)] bg-[var(--bg)] px-3.5 py-2 rounded-lg text-xs font-semibold text-[var(--text)] transition-all hover:border-[var(--accent)] hover:text-[var(--accent-text)]"
                title="Copy direct email address"
              >
                {copied ? (
                  <>
                    <Check size={13} className="text-emerald-500" />
                    <span className="text-emerald-500 mono font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} className="text-[var(--muted)] group-hover:text-[var(--accent-text)]" />
                    <span className="mono">Copy email</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 4 Interactive Glass Dock Cards */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <span className="mono text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
              Verified Networks &amp; Dossiers
            </span>
            <span className="mono text-[11px] text-[var(--accent-text)]">
              Direct Access ↗
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {dockLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  target={item.href.startsWith('mailto:') ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  className="group relative flex flex-col justify-between p-4 rounded-xl border border-[var(--line)] bg-[var(--panel-elevated)] backdrop-blur-md transition-all duration-150 hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-[0_8px_20px_rgba(56,189,248,0.12)] no-underline"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg border border-[var(--line)] bg-[var(--bg)] text-[var(--text)] group-hover:border-[var(--accent)] group-hover:text-[var(--accent-text)] transition-colors">
                      <Icon size={16} />
                    </div>
                    <span className="mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-[var(--line)] bg-[var(--bg)] text-[var(--muted)]">
                      {item.tag}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text)] group-hover:text-[var(--accent-text)] transition-colors">
                        {item.name}
                      </span>
                      <ArrowUpRight size={13} className="text-[var(--muted)] group-hover:text-[var(--accent-text)] transition-colors" />
                    </div>
                    <div className="mono text-[11px] text-[var(--muted)] truncate mt-0.5">
                      {item.handle}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* 3-Column Navigation, Telemetry & Philosophy */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-12 pt-6 border-t border-[var(--line)]">
          {/* Column 1: System Telemetry & Visitor Counter */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2 border-b border-[var(--line)] pb-2">
              <Terminal size={14} className="text-[var(--accent-text)]" />
              <span className="mono text-xs font-bold uppercase tracking-wider text-[var(--text)]">
                System Telemetry
              </span>
            </div>

            <dl className="space-y-2 text-xs">
              <div className="flex items-start justify-between border-b border-[var(--line)] pb-1.5">
                <dt className="mono text-xs text-[var(--muted)] flex items-center gap-1">
                  <MapPin size={11} /> Location
                </dt>
                <dd className="mono font-semibold text-[var(--text)]">Indore, India</dd>
              </div>
              <div className="flex items-start justify-between border-b border-[var(--line)] pb-1.5">
                <dt className="mono text-xs text-[var(--muted)]">Timezone</dt>
                <dd className="mono font-semibold text-[var(--text)]">Asia/Kolkata (IST)</dd>
              </div>
              <div className="flex items-start justify-between border-b border-[var(--line)] pb-1.5">
                <dt className="mono text-xs text-[var(--muted)]">Status</dt>
                <dd className="mono font-semibold text-[var(--accent-text)]">Available for Full-Time Roles</dd>
              </div>
            </dl>

            <div className="pt-2">
              <VisitorCounter />
            </div>
          </div>

          {/* Column 2: Sitemap Navigation */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2 border-b border-[var(--line)] pb-2">
              <Radio size={14} className="text-[var(--accent-text)]" />
              <span className="mono text-xs font-bold uppercase tracking-wider text-[var(--text)]">
                Navigation Index
              </span>
            </div>

            <ul className="space-y-1.5 text-xs">
              {sitemap.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="focus-ring group flex items-center gap-2 text-[var(--muted-strong)] no-underline transition-colors hover:text-[var(--text)]"
                  >
                    <span className="mono text-xs text-[var(--accent-text)]">{item.num} ·</span>
                    <span className="group-hover:translate-x-1 transition-transform">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Engineering Directive */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2 border-b border-[var(--line)] pb-2">
              <span className="mono text-xs font-bold uppercase tracking-wider text-[var(--text)]">
                Engineering Directive
              </span>
            </div>

            <p className="text-xs leading-relaxed text-[var(--muted-strong)]">
              Focused on high-performance machine learning workflows, spatial optimization pipelines, and resilient distributed applications. Dedicated to deterministic code quality, zero-DOM CSS acceleration, and clear documentation.
            </p>

            <div className="pt-2">
              <span className="mono text-[11px] text-[var(--muted)]">
                Indore, India · Open for contract &amp; full-time opportunities.
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Strip: Copyright & Back To Top */}
        <div className="flex flex-col gap-4 border-t border-[var(--line)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="mono text-xs text-[var(--muted)]">
            © {new Date().getFullYear()} Jiyanshu Jain. Engineered with React, TypeScript &amp; Tailwind CSS.
          </p>

          <a
            href="#top"
            className="focus-ring mono inline-flex items-center gap-2 border border-[var(--line-strong)] bg-[var(--bg)] px-3.5 py-1.5 text-xs font-bold text-[var(--text)] rounded-md transition-all hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent-text)]"
          >
            Back to top
            <ArrowUp size={13} className="text-[var(--accent-text)]" />
          </a>
        </div>
      </div>
    </footer>
  );
}
