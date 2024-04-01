'use client';

import { motion } from 'framer-motion';
import styles from '../styles';
import { TypingText, PricingTable } from '../components';
import { staggerContainer, slowlyAppear } from '../utils/motion';

/* The Pricing component is responsible for displaying the pricing section */
const Pricing = () => (
  <section id="pricing" className={`${styles.paddings} relative z-10`}>
    <div className="pricing-gradient z-0" />
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.25 }}
      className="w-[70%] mx-auto"
    >
      <TypingText title="| Pricing" textStyles="text-center" />
      <motion.p
        variants={slowlyAppear(0.3)}
        initial="hidden"
        whileInView="visible"
        className="mt-4 flex flex-col gap-2 text-[16px] text-gray-400 lg:mx-auto text-center italic"
      >
        “With Amazon Transcribe, you only pay for what you use based on the seconds of audio transcribed per month.”
        <a href="https://aws.amazon.com/transcribe/pricing/" className={`${styles.heroSubheading} text-[12px] text-cyan-500 not-italic underline`}>
          Learn more →
        </a>
      </motion.p>

      <motion.div
        variants={slowlyAppear(0.5)}
        initial="hidden"
        whileInView="visible"
        className="mt-8"
      >
        <PricingTable />
      </motion.div>
    </motion.div>
  </section>
);

export default Pricing;
