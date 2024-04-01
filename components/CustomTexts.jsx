'use client';

import { motion } from 'framer-motion';
import { textContainer, textVariant } from '../utils/motion';

/* The TypingText component is responsible for displaying a typing text effect */
export const TypingText = ({ title, textStyles }) => (
  <motion.p
    variants={textContainer}
    className={`${textStyles} font-normal text-[20px] text-secondary-white`}
  >
    {Array.from(title).map((letter, index) => (
      <motion.span
        variants={textVariant}
        key={index}
      >
        {letter === ' ' ? '\u00A0' : letter}
      </motion.span>
    ))}
  </motion.p>
);

