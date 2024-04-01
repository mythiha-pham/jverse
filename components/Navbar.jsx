'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Link as ScrollLink } from 'react-scroll';
import styles from '../styles';
import { slideInFromTop } from '../utils/motion';

/* The Navbar component is responsible for displaying the navigation bar */
const Navbar = () => (
  <motion.nav
    variants={slideInFromTop}
    initial="hidden"
    whileInView="visible"
    className={`${styles.xPaddings} relative`}
  >
    <div className="absolute w-[50%] inset-0 gradient-03" />
    <div className={`${styles.innerWidth} mx-auto flex justify-between items-center gap-8 mt-[-100px]`}>
      <div className="mb-8 lg:mb-0 lg:mr-8">
        <img src="/logo.png" alt="logo" className="w-[300px] h-[300px] object-contain" />
      </div>
      <div className="flex flex-col gap-2 lg:flex-row lg:gap-16">
        <ScrollLink to="about" spy smooth offset={-70} duration={50} className={`${styles.navSubHeading}`}>About</ScrollLink>
        <ScrollLink to="features" spy smooth offset={10} duration={50} className={`${styles.navSubHeading}`}>Features</ScrollLink>
        <ScrollLink to="pricing" spy smooth offset={-50} duration={50} className={`${styles.navSubHeading}`}>Pricing</ScrollLink>
        <ScrollLink to="contact" spy smooth offset={10} duration={50} className={`${styles.navSubHeading}`}>Contact</ScrollLink>
      </div>
      <div className="mb-8 lg:mb-0 lg:mr-8">
        <button type="button" className={`${styles.button}`}>
          <Link href="/upload">Get started</Link>
        </button>
      </div>
    </div>
  </motion.nav>
);

export default Navbar;
