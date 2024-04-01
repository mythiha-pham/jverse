'use client';

import { motion } from 'framer-motion';
import styles from '../styles';
import { footerVariants } from '../utils/motion';

/* The Footer component is responsible for displaying the footer */
const Footer = () => (
  <motion.footer
    variants={footerVariants}
    initial="hidden"
    whileInView="visible"
    className={`${styles.paddings} py-8 relative`}
  >
    <div className="footer-gradient" />
    <div className={`${styles.innerWidth} mx-auto flex flex-col gap-8`}>
      <div className="flex flex-col">
        <div className="mb-[50px] h-[2px] bg-white opacity-10" />
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h4 className={`${styles.siteName} font-extrabold text-[24px]`}>JVerse</h4>
          <p className="font-normal text-[14px] text-white opacity-50">
            Copyright © 2024 JVerse. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </motion.footer>
);

export default Footer;
