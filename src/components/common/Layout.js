import React from 'react';
import { Container } from 'semantic-ui-react';
import { Header } from 'components/common/Header';
import  { Footer } from 'components/common/Footer';

export function Layout({ children, updateDate }) {
  return (
    <div className="layout-wrapper">
      <Header updateDate={updateDate}/>
      <Container className="layout-container">{children}</Container>
      <Footer />
    </div>
  );
}