'use client';

import { Link as ScrollLink } from 'react-scroll';
import { motion } from 'framer-motion';
import styles from '../styles';
import { TypingText } from '../components';
import { fadeIn, staggerContainer } from '../utils/motion';

/* The About component is responsible for displaying the about section */
const About = () => (
  <section id="about" className={`${styles.paddings} relative z-10`}>
    <div className="gradient-01 z-0" />
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.25 }}
      className={`w-[70%] mx-auto ${styles.flexCenter} flex-col`}
    >
      <TypingText title="| About us" textStyles="text-center" />
      <motion.p
        variants={fadeIn('up', 'tween', 0.2, 1)}
        className="mt-[8px]  font-normal text-[18px] text-center text-gray-400"
      >
        Welcome to <span className={`${styles.siteName}`}>JVerse</span>! We are dedicated to revolutionizing how you interact with audio and video content. Through cutting-edge <span className="font-bold text-white">AI technology</span>, our web app offers seamless transcription and captioning services. With just a few clicks, our advanced algorithms ensure swift and precise transcriptions, freeing you from the hassle of manual work. Beyond transcription, our platform empowers you to make your content more accessible and engaging with our robust captioning features. Whether you're a <span className="font-bold text-white">content creator, educator, or business professional</span>, <span className={`${styles.siteName}`}>JVerse</span> simplifies your workflow while maintaining top-tier accuracy and quality. Join us and discover the future of transcription and captioning today!
      </motion.p>
      <ScrollLink to="features" spy smooth offset={10} duration={50} className="cursor-pointer">
        <div>
          <motion.img
            variants={fadeIn('up', 'tween', 0.3, 1)}
            src="/arrow-down.svg"
            alt="arrow down"
            className="w-[18px] h-[28px] object-contain mt-[28px]"
          />
        </div>
      </ScrollLink>
    </motion.div>
  </section>
);

export default About;
