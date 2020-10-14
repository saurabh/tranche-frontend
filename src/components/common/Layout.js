import React from 'react';
import { Container } from 'semantic-ui-react';
import { Header } from 'components/common/Header';
import  { Footer } from 'components/common/Footer';

export function Layout({ children, updateDate }) {
  return (
    <div style={{position: 'relative', minHeight: '100vh'}}>
      <Header updateDate={updateDate}/>
      <Container style={{ marginTop: '3vh' }}>{children}</Container>
      <Footer />
    </div>
  );
}