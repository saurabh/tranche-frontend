import React, { useState } from 'react';
import { connect } from 'react-redux';
import Logo from 'assets/images/svg/Logo.svg';
import { NavbarWrapper, NavbarContainer, NavbarLinks } from './styles/HeaderComponents';
import { PagesData } from 'config/constants';

import { NavLink } from 'react-router-dom';

import ConnectWallet from './ConnectWallet';

function Navbar({ path }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <NavbarWrapper>
      <NavbarContainer className='container navbar-container'>
        <div id='logo-wrapper'>
            <img src={Logo} alt='Logo' />
        </div>
        <div id='navbar-icon' onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className={'navbar-right ' + (menuOpen ? 'navbar-right-toggle' : '')}>
          <NavbarLinks>
            <NavLink
              to='/borrow'
              activeStyle={{
                borderBottom: '2px solid',
                borderColor: PagesData[path].secondaryColor,
                opacity: '1'
              }}
            >
              <span data-content="borrow"></span>
              Borrow
            </NavLink>
            <NavLink
              to='/lend'
              activeStyle={{
                borderBottom: '2px solid',
                borderColor: PagesData[path].secondaryColor,
                opacity: '1'
              }}
            >

              <span data-content="lend"></span>
              Lend
            </NavLink>
            <NavLink
              to='/earn'
              onClick={(e) => e.preventDefault()}
              className='navLinkDisabled'
              activeStyle={{
                borderBottom: '2px solid',
                borderColor: PagesData[path].secondaryColor,
                opacity: '1'
              }}
            >
              Earn
            </NavLink>
          </NavbarLinks>
          <ConnectWallet path={path} />
        </div>
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
