'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from '../../styles';
import { slideInFromLeft, slideInFromTop, slowlyAppear } from '../../utils/motion';
import UploadForm from '../../components/UploadForm';
import { Footer } from '../../components';

/* The UploadPage component is responsible for displaying the upload form */
const UploadPage = () => (
  <div className="bg-primary-black overflow-hidden">
    <motion.nav
      variants={slideInFromTop}
      initial="hidden"
      whileInView="visible"
      className={`${styles.xPaddings} relative`}
    >
      <div className={`${styles.innerWidth} flex justify-between items-center mt-[-100px]`}>
        <div className="lg:mr-8">
          <img src="/logo.png" alt="logo" className="w-[300px] h-[300px] object-contain" />
        </div>
        <Link href="/" className={`${styles.navSubHeading}`}>
          Home
        </Link>
      </div>
    </motion.nav>

    <motion.div
      variants={slideInFromLeft(0.2)}
      initial="hidden"
      whileInView="visible"
      className="text-center"
    >
      <h1 className={`${styles.heroHeading} leading-3 mb-4 mt-[-50px]`}>
        File upload
      </h1>
    </motion.div>

    <motion.div
      variants={slideInFromLeft(0.5)}
      initial="hidden"
      whileInView="visible"
      className="text-center"
    >
      <p className={`${styles.heroSubheading} font-medium mb-8`}>
        Upload your video and <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-green-200">JVerse</span> will do the rest!
      </p>
    </motion.div>

    <motion.div
      variants={slowlyAppear(0.8)}
      initial="hidden"
      whileInView="visible"
      className="text-center"
    >
      <UploadForm />
    </motion.div>
    <Footer />
  </div>

);

export default UploadPage;
