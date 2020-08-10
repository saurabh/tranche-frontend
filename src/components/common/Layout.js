import React from 'react';
import { Container } from 'semantic-ui-react';
import { Header } from 'components/common/Header';

export function Layout({ children }) {
  return (
    <>
      <Header />
      <Container style={{ marginTop: '3vh' }}>{children}</Container>
    </>
  );
}
