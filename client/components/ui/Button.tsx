// components/ui/Button.tsx
import React from 'react';
import { motion } from 'framer-motion';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
};

export const Button = ({ children, onClick, className = '', type = 'button', disabled = false }: ButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${className}`}
    >
      {children}
    </motion.button>
  );
};