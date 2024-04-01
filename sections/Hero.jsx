'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from '../styles';
import { slideInFromLeft, slideInFromRight, staggerContainer } from '../utils/motion';

/* The Hero component is responsible for displaying the hero section */
const Hero = () => (
  <div className="relative flex flex-col h-full w-full">
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.25 }}
      className={`${styles.flexCenter} flex-row px-20 w-full z-[20]`}
    >
      <div className="h-full w-full flex flex-col gap-6">
        <motion.div
          variants={slideInFromLeft(0.2)}
          className={`${styles.heroHeading} flex flex-col max-w-[600px]`}
        >
          <span>
            Simplify Content Creation with <span className={`${styles.siteName}`}>JVerse</span>
          </span>
        </motion.div>
        <motion.p
          variants={slideInFromLeft(0.5)}
          className={`${styles.heroSubheading} flex flex-col max-w-[600px]`}
        >
          Transform audio into text and add caption your videos effortlessly using AWS's AI audio-to-text technology (Amazon Transcribe).
        </motion.p>
        <motion.div
          variants={slideInFromLeft(0.8)}
          className="mb-8 lg:mb-0 lg:mr-8"
        >
          <button type="button" className={`${styles.button}`}>
            <Link href="/upload">Try it now!</Link>
          </button>
        </motion.div>
      </div>
      <motion.div
        variants={slideInFromRight(0.5)}
        className={`${styles.flexCenter} w-full h-full`}
      >
        <img src="/banner.png" alt="banner" className="w-auto h-auto" />
      </motion.div>
    </motion.div>
  </div>

);

export default Hero;
