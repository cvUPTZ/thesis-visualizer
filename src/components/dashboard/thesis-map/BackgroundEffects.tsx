import React from 'react';
import { motion } from 'framer-motion';

export const BackgroundEffects = () => {
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.03),transparent_50%)]" />
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{
          background: [
            'radial-gradient(600px circle at 50% 50%, rgba(79,70,229,0.02), transparent 80%)',
            'radial-gradient(800px circle at 50% 50%, rgba(79,70,229,0.04), transparent 80%)'
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
      />
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/10 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>
    </>
  );
};