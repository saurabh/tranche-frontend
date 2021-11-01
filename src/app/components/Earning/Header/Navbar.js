import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import LogoColored from 'assets/images/svg/LogoColored.svg';
import { NavbarWrapper, NavbarContainer, NavbarLinks, NavBarMobile, NavBarMobileContent, MobileNavbarIconWrapper, NavbarIconWrapper, NavbarIconContent } from './styles/HeaderComponents';
import { ModeThemes } from 'config/constants';
import { BackArrow, Logo } from 'assets';
// import { getRequest } from 'services/axios';
// import { roundNumber, safeDivide } from 'utils/helperFunctions';
import { NavLink } from 'react-router-dom';
import i18n from "../../locale/i18n";
import {
  RatesWrapper,
  RatesBoxWrapper,
  NavbarSpan
} from './styles/HeaderComponents';
import ConnectWallet from './ConnectWallet';
import { TrancheIcon } from 'assets';
export const baseUrl = i18n.language === 'en' ? '' : '/'+i18n.language;

function Navbar({ path, theme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  // const [pair0Value, setPair0Value] = useState(0);
  // const [pair1Value, setPair1Value] = useState(0);
  // const [ratesVisability, setRatesVisability] = useState(false);
  const [ratesToggle, setRatesToggle] = useState(false);
  const [isDesktop, setDesktop] = useState(window.innerWidth > 992);
  const updateMedia = () => {
    setDesktop(window.innerWidth > 992);
  };
  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  });

  return (
    <NavbarWrapper>
      <NavbarContainer>
        <div id='logo-wrapper'>
            <a href="https://tranche.finance/"><img src={theme === "dark" ? Logo : LogoColored} alt='Logo' /></a>
        </div>
        <MobileNavbarIconWrapper mobile>
        { !isDesktop &&
          <ConnectWallet />
        }

        </MobileNavbarIconWrapper>
        
        <NavBarMobile className={menuOpen ? "NavbarMobileToggle" : ""} >
          <NavBarMobileContent first>
            <img src={TrancheIcon} alt="icon" />
            {/* <h2>0xB51F1234DA3124124468</h2> */}
            <div>
              <a href="https://docs.tranche.finance/tranchefinance/" target="_blank" rel="noopener noreferrer">DOCUMENTATION</a>
              <a href="/privacy"  target="_blank" rel="noopener noreferrer">PRIVACY</a>
              <a href="/terms"  target="_blank" rel="noopener noreferrer">TERMS</a>
              <a href="https://discord.com/invite/Nv44PTdF3K" target="_blank" rel="noopener noreferrer">SUPPORT</a>
            </div>
          </NavBarMobileContent>
        </NavBarMobile>

        <NavBarMobile className={(ratesToggle && menuOpen) ? "NavbarMobileToggle ratesToggle" : ""} rates>
          <NavBarMobileContent>
            <button onClick={() => setRatesToggle(false)}><img src={BackArrow} alt="back" /></button>
            <RatesWrapper>
              <RatesBoxWrapper
                className='ratesBoxWrapper' 
                mobile
              >


              </RatesBoxWrapper>
            </RatesWrapper>
          </NavBarMobileContent>
        </NavBarMobile>
        
        <div className='navbar-right'>
          <NavbarLinks path={path} theme={ModeThemes[theme]} color={ModeThemes[theme].NavbarBorder} boxBackground={ModeThemes[theme].stakeBoxBackground}>
            <NavLink
              to={baseUrl + '/stake'}
              activeStyle={{
                opacity: 1,
                background: ModeThemes[theme].NavbarBackground,
                boxShadow: ModeThemes[theme].NavbarShadow
              }}
              exact
            >
              {i18n.t('navbar.stake')}            
            </NavLink>
            <NavLink
              to={baseUrl + '/tranche'}
              activeStyle={{
                opacity: 1,
                background: ModeThemes[theme].NavbarBackground,
                boxShadow: ModeThemes[theme].NavbarShadow
              }}
              exact
            >
             {i18n.t('navbar.tranche')}
            </NavLink>
            <a
              href="https://snapshot.org/#/tranche.eth"
              target="_blank"
              rel="noopener noreferrer"
              >
              Vote
            </a>
          </NavbarLinks>
        </div>
        { isDesktop &&
          <ConnectWallet path={path} />
        }
      </NavbarContainer>
    </NavbarWrapper>
  );
}
const mapStateToProps = (state) => {
  return {
    path: state.path
  };
};
export default connect(mapStateToProps, null)(Navbar);
