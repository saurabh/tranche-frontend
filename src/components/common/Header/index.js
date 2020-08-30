import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Dropdown } from 'semantic-ui-react';
import {
  HeaderWrapper,
  NavContainer,
  NavLinks,
  NavBrand,
  NavItem,
  Options,
  Banner,
  PageMenu,
  PageMenuContainer,
  PageMenuItem,
  MobileMenuContainer,
  MobileMenuIcon
} from './HeaderComponents';

import ConnectWallet from './ConnectWallet';

export function Header() {
  const { pathname } = useLocation();
  const [path, setPath] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  const bannerDetails = {
    home: {
      color: '#2c2cdf',
      inactiveColor: '#aba9f9',
      title: 'Welcome to Jibrel',
      description: 'PLACEHOLDER SLOGAN'
    },
    borrow: {
      color: '#5411e2',
      inactiveColor: '#a988f1',
      title: 'Borrower Markets',
      description: 'APPLY FOR A COLLATERALIZED LOAN USING YOUR CRYPTOCURRENCY'
    },
    earn: {
      color: '#389725',
      inactiveColor: '#8edd8d',
      title: 'Earning Markets',
      description: 'EARN INTEREST ON YOUR CRYPTOCURRENCY DEPOSITS'
    },
    trade: {
      color: '#1f1f1f',
      inactiveColor: '#8f8f8f',
      title: 'Trading Markets',
      description: 'BUY & SELL TOKENIZED DERIVATIVES ON ETHEREUM'
    }
  };

  useEffect(() => {
    const parsePath = () => {
      if (pathname === '/') {
        setPath('home');
      } else {
        setPath(pathname.split('/')[1]);
      }
    };

    parsePath();
  }, [pathname]);

  return (
    <>
      <HeaderWrapper color={bannerDetails[path].color}>
        <Container>
          <MobileMenuContainer>
            <NavBrand to='/'>
              <h1>
                <strong>Jibrel</strong>
              </h1>
            </NavBrand>
            <MobileMenuIcon onClick={() => setMenuOpen((isOpen) => !isOpen)}>
              <div />
              <div />
              <div />
            </MobileMenuIcon>
            {menuOpen && (
              <NavLinks>
                <NavItem to='/borrow' isActive={pathname === '/borrow'} color={bannerDetails[path].inactiveColor}>
                  <h3>BORROW</h3>
                </NavItem>
                <NavItem to='/earn' isActive={pathname === '/earn'} color={bannerDetails[path].inactiveColor}>
                  <h3>EARN</h3>
                </NavItem>
                <NavItem to='/trade' isActive={pathname === '/trade'} color={bannerDetails[path].inactiveColor}>
                  <h3>TRADE</h3>
                </NavItem>
              </NavLinks>
            )}
          </MobileMenuContainer>
          <NavContainer>
            <NavBrand to='/'>
              <h1>
                <strong>Jibrel</strong>
              </h1>
            </NavBrand>
            <NavLinks>
              <NavItem to='/borrow' isActive={pathname === '/borrow'} color={bannerDetails[path].inactiveColor}>
                <h3>BORROW</h3>
              </NavItem>
              <NavItem to='/earn' isActive={pathname === '/earn'} color={bannerDetails[path].inactiveColor}>
                <h3>EARN</h3>
              </NavItem>
              <NavItem to='/trade' isActive={pathname === '/trade'} color={bannerDetails[path].inactiveColor}>
                <h3>TRADE</h3>
              </NavItem>
            </NavLinks>
            <Options text='USD'>
              <Dropdown.Menu>
                <Dropdown.Item>USD</Dropdown.Item>
                <Dropdown.Item>BTC</Dropdown.Item>
              </Dropdown.Menu>
            </Options>
            <ConnectWallet />
          </NavContainer>
          <Banner color={bannerDetails[path].inactiveColor}>
            <h1>{bannerDetails[path].title}</h1>
            <h4>{bannerDetails[path].description}</h4>
          </Banner>
          <PageMenu>
            <PageMenuContainer>
              <PageMenuItem isActive color={bannerDetails[path].inactiveColor}>
                <h3>Test</h3>
              </PageMenuItem>
              <PageMenuItem color={bannerDetails[path].inactiveColor}>
                <h3>Test2</h3>
              </PageMenuItem>
              <PageMenuItem color={bannerDetails[path].inactiveColor}>
                <h3>How-To</h3>
              </PageMenuItem>
            </PageMenuContainer>
          </PageMenu>
        </Container>
      </HeaderWrapper>
    </>
  );
}
