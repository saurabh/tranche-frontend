import React from 'react';
import { Header } from 'app/components/Header';
import  { Footer } from 'app/components/Footer';
import { motion } from 'framer-motion';
export function Layout({ children, updateDate }) {
  return (
    <motion.div className="layout-wrapper" initial={{ opacity: 0.5, x: '-10%' }} animate={{ opacity: 1, x: '0' }} exit={{ opacity: 0.5, x: '-10%' }} transition={{ type: "tween", ease: "linear" }}>
      <Header updateDate={updateDate}/>
      <div className="layout-container">{children}</div>
      <Footer />
    </motion.div>
  );
}