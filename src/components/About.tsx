import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const approach = [
  ['01', 'Start from the data', 'Spatial, structured and unstructured data become models people can use, which means understanding the data before choosing the model.'],
  ['02', 'Build the system around it', 'Typed APIs, practical services and the data layer are part of the product, not an afterthought.'],
  ['03', 'Make it legible', 'A focused interface turns technical capability into something the person making the decision can follow.'],
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function About() {
  const reduced = usePrefersReducedMotion();
  return (
    <section id="about" className="section" aria-labelledby="about-heading">
      <div className="page-width grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <span className="section-label">Approach</span>
          <h2 id="about-heading" className="h2">My engineering approach</h2>
          <p className="mt-6 text-xl font-medium leading-8 tracking-tight">I'm an AI/ML engineer from Indore focused on the path from data to a working product.</p>
          <p className="mt-4 text-sm leading-7 text-[var(--muted-strong)]">My work combines model development, APIs and interfaces, so the result is useful to the person on the other end rather than only accurate on a notebook.</p>
        </div>
        <dl className="border-t border-[var(--line-strong)] lg:mt-14">
          {approach.map(([num, term, text], i) => (
            <motion.div
              key={term}
              initial={reduced ? false : { opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: i * 0.1, ease }}
              className="border-b border-[var(--line)] py-5"
            >
              <div className="flex items-start gap-4">
                <span className="mono text-[2rem] font-extrabold leading-none text-[var(--accent)] opacity-30 select-none">{num}</span>
                <div>
                  <dt className="font-semibold">{term}</dt>
                  <dd className="mt-1 text-sm leading-6 text-[var(--muted-strong)]">{text}</dd>
                </div>
              </div>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}
