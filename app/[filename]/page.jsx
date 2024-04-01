'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ResultVideo from '../../components/ResultVideo';
import TranscriptionEditor from '../../components/TranscriptionManager';
import { cleanUpTranscription } from '../../libs/TranscriptionHelper';
import styles from '../../styles';
import { slideInFromTop, slideInFromLeft, slowlyAppear } from '../../utils/motion';
import Footer from '../../components/Footer';

/* The FilePage component is responsible for displaying the video player and the transcription editor */
export default function FilePage({ params }) {
  const { filename } = params;
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isFetchingInfo, setIsFetchingInfo] = useState(false);
  const [awsTranscriptionItems, setAwsTranscriptionItems] = useState([]);

  function getTranscription() {
    setIsFetchingInfo(true);
    // make a GET request to fetch transcription data
    axios.get(`/api/transcribe?filename=${filename}`).then((response) => {
      // once response is received, reset fetching flag
      setIsFetchingInfo(false);
      // extract status and transcription data from response
      const status = response.data?.status;
      const transcription = response.data?.transcription;
      // if transcription is in progress, set a timeout to fetch transcription data again
      if (status === 'IN_PROGRESS') {
        setIsTranscribing(true);
        setTimeout(getTranscription, 3000);
      } else {
        // if transcription is completed, set the transcription items
        setIsTranscribing(false);
        setAwsTranscriptionItems(cleanUpTranscription(transcription.results.items));
      }
    });
  }

  useEffect(() => {
    getTranscription();
  }, [filename]);

  /* If the transcription is in progress, display a loading screen */
  if (isTranscribing || isFetchingInfo) {
    return (
      <div className="bg-primary-black overflow-hidden w-screen h-screen">
        <motion.nav
          variants={slideInFromTop}
          initial="hidden"
          whileInView="visible"
          className={`${styles.xPaddings} relative`}
        >
          <div className={`${styles.innerWidth} flex mt-[-100px]`}>
            <div className="lg:mr-8">
              <img src="/logo.png" alt="logo" className="w-[300px] h-[300px] object-contain" />
            </div>
          </div>
        </motion.nav>
        <motion.div
          variants={slideInFromLeft(0.2)}
          initial="hidden"
          whileInView="visible"
          className="text-center"
        >
          <h1 className={`${styles.heroHeading} leading-3 mb-4 mt-[-50px]`}>
            We are transcribing your video...
          </h1>
        </motion.div>
        <motion.div
          variants={slideInFromLeft(0.5)}
          initial="hidden"
          whileInView="visible"
          className="text-center"
        >
          <p className={`${styles.heroSubheading} font-medium mb-8`}>
            Please have a little patience as the larger file size is, the more time it takes to process
          </p>
        </motion.div>
        <div className="absolute inset-x-0 bottom-0">
          <Footer />
        </div>
      </div>
    );
  }

  // If the transcription is completed, display the video player and the transcription editor
  return (
    <div className="bg-primary-black overflow-hidden">
      <div className="gradient-01 z-0" />
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
          Caption Editor
        </h1>
      </motion.div>
      <div className="grid sm:grid-cols-2 gap-8 sm:gap-16 mt-[100px] w-[90%] mx-auto">
        <motion.div
          variants={slowlyAppear(0.2)}
          initial="hidden"
          whileInView="visible"
        >
          <ResultVideo filename={filename} transcriptionItems={awsTranscriptionItems} />
        </motion.div>
        <motion.div
          variants={slowlyAppear(0.4)}
          initial="hidden"
          whileInView="visible"
        >
          <TranscriptionEditor awsTranscriptionItems={awsTranscriptionItems} setAwsTranscriptionItems={setAwsTranscriptionItems} />
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
