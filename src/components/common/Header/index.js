import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Dropdown } from 'semantic-ui-react';
import {
  HeaderWrapper,
  NavContainer,
  NavLinks,
  NavBrand,
  NavItem,
  Title,
  Options,
  StyledButton,
  Banner,
  PageMenu,
  PageMenuContainer,
  PageMenuItem
} from './HeaderComponents';

export function Header() {
  const { pathname } = useLocation();
  // const [mobileMenu, setMobileMenu] = useState(false);
  const [bannerColor, setBannerColor] = useState('#2c2cdf');
  const [bannerMessage, setBannerMessage] = useState('');
  const [bannerDescription, setBannerDescription] = useState('');

  // const home = {
  //   color: '#2c2cdf',
  //   bannerMessage: '',
  //   bannerDescription: ''
  // };

  const changeLinkData = (color, banner, description) => {
    setBannerColor(color);
    setBannerMessage(banner);
    setBannerDescription(description);
    console.log(bannerColor, bannerMessage, bannerDescription);
  };

  return (
    <>
      <HeaderWrapper color={bannerColor}>
        <Container>
          {/* <i class="fas fa-bars fa-3x"></i> */}
          <NavContainer>
            <NavBrand to='/' onClick={() => changeLinkData('#2c2cdf', '', '')}>
              <h1><strong>Jibrel</strong></h1>
            </NavBrand>
            <NavLinks>
              <NavItem
                to='/borrow'
                onClick={() =>
                  changeLinkData(
                    '#5411e2',
                    'Borrower Markets',
                    'APPLY FOR A COLLATERALIZED LOAN USING YOUR CRYPTOCURRENCY'
                  )
                }
              >
                <Title isActive={pathname === '/borrow'}>BORROW</Title>
              </NavItem>
              <NavItem
                to='/earn'
                isActive={pathname === '/earn'}
                onClick={() =>
                  changeLinkData(
                    '#1ebb1b',
                    'Earning Markets',
                    'EARN INTEREST ON YOUR CRYPTOCURRENCY DEPOSITS'
                  )
                }
              >
                <Title isActive={pathname === '/earn'}>EARN</Title>
              </NavItem>
              <NavItem
                to='/trade'
                isActive={pathname === '/trade'}
                onClick={() =>
                  changeLinkData(
                    '#1f1f1f',
                    'Trading Markets',
                    'BUY & SELL TOKENIZED DERIVATIVES ON ETHEREUM'
                  )
                }
              >
                <Title isActive={pathname === '/trade'}>TRADE</Title>
              </NavItem>
            </NavLinks>
            <Options text='USD'>
              <Dropdown.Menu>
                <Dropdown.Item>USD</Dropdown.Item>
                <Dropdown.Item>BTC</Dropdown.Item>
              </Dropdown.Menu>
            </Options>
            <StyledButton>Address</StyledButton>
          </NavContainer>
          <Banner>
            <h1>Trading Markets</h1>
            <h4>DAHWDJ JAWDO HHAWDM HHAWDO HAWDOJAWD TRADING BTC</h4>
          </Banner>
          <PageMenu>
            <PageMenuContainer>
              <PageMenuItem>
                <Title isActive>Test</Title>
              </PageMenuItem>
              <PageMenuItem>
                <Title>Test2</Title>
              </PageMenuItem>
              <PageMenuItem>
                <Title right>How-To</Title>
              </PageMenuItem>
            </PageMenuContainer>
          </PageMenu>
        </Container>
      </HeaderWrapper>
    </>
  );
}
