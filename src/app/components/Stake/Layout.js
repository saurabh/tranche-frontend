import React from 'react';
import { Header } from 'app/components/Stake/Header';
import  { Footer } from 'app/components/Footer/Footer';
export function Layout({ children, updateDate }) {
  return (
    <div className="layout-wrapper">
      <Header updateDate={updateDate}/>
      <div className="layout-container">{children}</div>
      <Footer />
    </div>
  );
}