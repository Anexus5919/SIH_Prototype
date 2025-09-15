// components/ui/GlassCard.tsx
import React from 'react';
import { motion } from 'framer-motion';

type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
};

export const GlassCard = ({ children, className = '', id }: GlassCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white/5 backdrop-blur-xl rounded-2xl shadow-lg border border-white/10 ${className}`}
      id={id}
    >
      {children}
    </motion.div>
  );
};