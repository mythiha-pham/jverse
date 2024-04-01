'use client';

import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';
import styles from '../styles';
import { TypingText } from '../components';
import { staggerContainer, slowlyAppear } from '../utils/motion';

/* Create contact form components with EmailJS integration */
const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_bxlda4j', 'template_gfymdrf', form.current, 'rBVj4bT3dWc4TRTKU').then((result) => {
      console.log(result.text);
      e.target.reset();
      alert('Email Sent!');
    }, (error) => {
      console.log(error.text);
    });
  };

  return (
    <section id="contact" className={`${styles.paddings} relative z-10`}>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        className="mx-auto"
      >
        <TypingText title="| Contact Us" textStyles="text-center" />
        <motion.p
          variants={slowlyAppear(0.4)}
          initial="hidden"
          whileInView="visible"
          className="mt-2 text-[16px] text-gray-400 lg:mx-auto text-center"
        >
          Got a question? We'd love to hear from you.
        </motion.p>

        <motion.form
          variants={slowlyAppear(0.6)}
          initial="hidden"
          whileInView="visible"
          ref={form}
          onSubmit={sendEmail}
          className="mt-4 flex flex-col gap-4 w-[50%] mx-auto"
        >
          <input className={`${styles.contactBox}`} type="text" placeholder="Your name" name="user_name" />
          <input className={`${styles.contactBox}`} type="email" placeholder="Email (e.g., name@company.com)" name="user_email" />
          <textarea className={`${styles.contactBox}`} name="message" rows="8" placeholder="What can we help with?" />
          <div className={`${styles.flexCenter}`}>
            <button type="submit" value="Send" className={`${styles.button} w-[25%]`}>Send</button>
          </div>
        </motion.form>
      </motion.div>
    </section>
  );
};

export default Contact;
