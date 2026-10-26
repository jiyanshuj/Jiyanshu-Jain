import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .25 }} className="fixed inset-0 z-[100] grid place-items-center bg-[var(--bg)] text-[var(--text)]">
      <div className="w-40">
        <p className="text-4xl font-extrabold tracking-tight text-[var(--accent)]">JJ</p>
        <div className="mt-4 h-1 w-full bg-[var(--line-strong)]">
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: .55, ease: 'easeOut' }} className="h-full origin-left bg-[var(--accent)]" />
        </div>
        <p className="mono mt-3 text-[.7rem] text-[var(--muted)]">Loading…</p>
      </div>
    </motion.div>
  );
}
