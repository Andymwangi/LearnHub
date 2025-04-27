'use client';

import { motion } from 'framer-motion';
import React from 'react';

// Create specific wrapper components for commonly used motion components
export function MotionDiv(props) {
  return <motion.div {...props} />;
}

export function MotionSection(props) {
  return <motion.section {...props} />;
}

export function MotionButton(props) {
  return <motion.button {...props} />;
}

export function MotionSpan(props) {
  return <motion.span {...props} />;
}

export function MotionParagraph(props) {
  return <motion.p {...props} />;
}

export function MotionImage(props) {
  return <motion.img {...props} />;
}

// Generic animation wrapper that applies standard animations
export function AnimationWrapper({
  children,
  variant = 'fadeIn',
  delay = 0,
  duration = 0.5,
  className = '',
  ...motionProps
}) {
  let variants;
  
  switch (variant) {
    case 'slideUp':
      variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      };
      break;
    case 'scaleIn':
      variants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 }
      };
      break;
    case 'fadeIn':
    default:
      variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      };
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ duration, delay }}
      className={className}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
} 