import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = Math.min(prev + Math.random() * 6 + 2, 100);

        if (newProgress >= 100) {
          clearInterval(timer);
          setIsExiting(true);
          setTimeout(onComplete, 1200);
          return 100;
        }
        return newProgress;
      });
    }, 250); // slowed down interval

    return () => clearInterval(timer);
  }, [onComplete]);

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 1.05,
      transition: { duration: 1, ease: "easeInOut" },
    },
  };

  const logoVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    exit: {
      scale: 0.9,
      opacity: 0,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
  };

  const textVariants = {
    initial: { y: 20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { delay: 0.6, duration: 0.8, ease: "easeOut" },
    },
    exit: {
      y: -20,
      opacity: 0,
      transition: { duration: 0.6, ease: "easeInOut" },
    },
  };

  const progressVariants = {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { delay: 1, duration: 0.8, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -30,
      transition: { duration: 0.6, ease: "easeInOut" },
    },
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="fixed inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black flex items-center justify-center z-50"
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-[0.02]">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px)`,
                backgroundSize: "100px 100px",
              }}
            />
          </div>

          {/* Main Content */}
          <div className="text-center space-y-12 max-w-md mx-auto px-6">
            {/* Elegant Logo */}
            <motion.div
              variants={logoVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="relative"
            >
              {/* Outer Ring */}
              <motion.div
                className="w-32 h-32 mx-auto relative"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-full h-full border border-zinc-700/50 rounded-full" />
                <div className="absolute inset-2 border border-zinc-600/30 rounded-full" />
              </motion.div>

              {/* Logo Container */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-full border border-zinc-600/40 flex items-center justify-center shadow-2xl">
                  <img
                    src="/images/logo.png"
                    alt="TPC Logo"
                    className="w-16 h-16 object-contain rounded-full "
                  />
                </div>
              </div>

              {/* Subtle Glow */}
              <motion.div
                className="absolute inset-0 rounded-full bg-white/5 blur-xl scale-150"
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            {/* Elegant Typography */}
            <motion.div
              variants={textVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-4"
            >
              <h1
                className="text-4xl text-white font-light tracking-[0.2em] leading-tight"
                style={{ fontFamily: "serif" }}
              >
                TURNING POINT
                <span className="block text-2xl tracking-[0.3em] mt-2 text-zinc-300">
                  COMMUNITY
                </span>
              </h1>

              <div className="w-16 h-px bg-gradient-to-r from-transparent via-zinc-500 to-transparent mx-auto" />

              <p className="text-zinc-400 text-sm font-light tracking-wider uppercase">
                India’s largest Debate Society
              </p>
            </motion.div>

            {/* Minimalist Progress */}
            <motion.div
              variants={progressVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              {/* Progress Bar */}
              <div className="relative">
                <div className="w-64 h-px bg-zinc-800 mx-auto relative overflow-hidden">
                  <motion.div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-zinc-400 to-white"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />

                  {/* Elegant shimmer */}
                  <motion.div
                    className="absolute top-0 w-8 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    animate={{ x: [-32, 256] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>

                {/* Progress Percentage */}
                <motion.div
                  className="mt-4 text-zinc-400 text-xs font-light tracking-widest"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {Math.round(progress)}%
                </motion.div>
              </div>

              {/* Elegant Loading Dots */}
              <div className="flex justify-center space-x-3">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-1 bg-zinc-500 rounded-full"
                    animate={{
                      scale: [0.8, 1.2, 0.8],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Corner Accent */}
          <div className="absolute bottom-8 right-8">
            <motion.div
              className="w-8 h-8 border-r border-b border-zinc-700/50"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          <div className="absolute top-8 left-8">
            <motion.div
              className="w-8 h-8 border-l border-t border-zinc-700/50"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
