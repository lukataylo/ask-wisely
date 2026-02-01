
import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 45, 0],
          x: [-50, 50, -50],
          y: [-50, 50, -50],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] opacity-40 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, #f5f0e1 0%, #fdfbf7 70%)',
        }}
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [45, 0, 45],
          x: [50, -50, 50],
          y: [50, -50, 50],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -bottom-1/4 -right-1/4 w-[150%] h-[150%] opacity-30 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, #e8dfd0 0%, #fdfbf7 70%)',
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
