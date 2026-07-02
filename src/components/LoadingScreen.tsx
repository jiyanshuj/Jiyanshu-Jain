import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.86)_0%,rgba(0,0,0,0.96)_45%,rgba(0,0,0,1)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_72%_55%_at_50%_-15%,rgba(50,59,130,0.32),transparent_72%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_0%,rgba(0,164,239,0.08),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:42px_42px] opacity-30" />
      </div>

      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-cyan-300/40"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
            }}
            animate={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center">
        {/* Main Logo/Name Animation with Interactive Gradient */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="cert-kicker mx-auto mb-6 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em]">
            Initializing Portfolio
          </div>
          <motion.h1
            className="cert-title animate-gradient bg-gradient-to-r from-white via-[#7dd3fc] to-zinc-300 bg-clip-text text-4xl font-bold text-transparent md:text-6xl"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              backgroundSize: "200% 200%",
            }}
          >
            JJ
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-2 text-lg text-zinc-400"
          >
            AI · Data · Full Stack
          </motion.p>
        </motion.div>

        {/* Loading Spinner */}
        <motion.div
          className="relative w-20 h-20 mx-auto mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {/* Outer Ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-white/15"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />

          {/* Inner Ring */}
          <motion.div
            className="absolute inset-2 rounded-full border-4 border-transparent border-r-[#00a4ef] border-t-[#7dd3fc]"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />

          {/* Center Dot */}
          <motion.div
            className="absolute inset-6 rounded-full bg-gradient-to-r from-[#00a4ef] to-[#7dd3fc]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="space-y-2"
        >
          <motion.p
            className="text-sm font-medium text-zinc-400"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading Portfolio...
          </motion.p>

          {/* Progress Bar */}
          <div className="mx-auto h-1 w-48 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#00a4ef] to-[#7dd3fc]"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
            />
          </div>
        </motion.div>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-cyan-300/40"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
