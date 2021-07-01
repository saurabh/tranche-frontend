import React from 'react';
import Header from 'app/components/Stake/Header';
import Footer from 'app/components/Footer/Footer';
export function Layout({ children, updateDate, openModal, closeModal, modalType, ModalIsOpen }) {
  return (
    <div className="layout-wrapper">
      <Header updateDate={updateDate} ModalIsOpen={ModalIsOpen} modalType={modalType} openModal={openModal} closeModal={closeModal}/>
      <div className="layout-container">{children}</div>
      <Footer />
    </div>
  );
}