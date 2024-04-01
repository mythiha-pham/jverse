'use client';

import { motion } from 'framer-motion';
import styles from '../styles';
import { TypingText, FeaturesCard } from '../components';
import { staggerContainer, slideInFromRight, slideInFromLeft } from '../utils/motion';
import { features } from '../constants';

/* The Features component is responsible for displaying the features section */
const Features = () => (
  <section id="features" className={`${styles.paddings} relative z-10`}>
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.25 }}
      className="w-[70%] mx-auto"
    >
      <TypingText title="| Features" textStyles="text-center" />
      <motion.p
        variants={slideInFromRight(0.5)}
        initial="hidden"
        whileInView="visible"
        className="mt-4 text-[16px] text-gray-400 lg:mx-auto text-center"
      >
        Experience the power of AI in converting speech to text and generating captions automatically
      </motion.p>
      <motion.div
        variants={slideInFromLeft(0.5)}
        initial="hidden"
        whileInView="visible"
        className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2"
      >
        {features.map((feature, index) => (
          <FeaturesCard key={index} image={feature.imgUrl} title={feature.title} description={feature.desc} />
        ))}
      </motion.div>
    </motion.div>
  </section>
);

export default Features;
