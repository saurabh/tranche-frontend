import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { useLocation, NavLink } from 'react-router-dom';
import {
  HeaderWrapper,
  HeaderContent,
  HeaderTitle,
  HeaderSubtitle,
  NavbarLinks
} from './styles/HeaderComponents';
import HeaderTabs from "./HeaderTabs"
import Navbar from "./Navbar"
import {
  ModeThemes
} from 'config/constants';
import i18n from "../../locale/i18n";
export const baseUrl = i18n.language === 'en' ? '' : '/'+i18n.language;

function Header({updateDate, theme}) {
  const { pathname } = useLocation();
  let parsedPath = pathname.split('/');
  const [isDesktop, setDesktop] = useState(window.innerWidth > 992);


  const [path, setPath] = useState(parsedPath[parsedPath.length - 1] || "borrow");
  const parsePath = useCallback(() =>{
    setPath(parsedPath[parsedPath.length - 1]);
  }, [parsedPath]);
  const updateMedia = () => {
    setDesktop(window.innerWidth > 992);
  };
  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  });
  useEffect(() => {
    parsePath();
  }, [pathname, parsePath]);
  return (
    <div className='content-container container'>
      <Navbar path={parsedPath[parsedPath.length - 1]} theme={theme}/>
      {
        path === "stake" &&
        <HeaderTabs theme={theme}/>
      }
       {
        !isDesktop &&
        <NavbarLinks theme={ModeThemes[theme]}>
          <NavLink
            to={baseUrl + '/stake'}
            activeStyle={{
              opacity: 1,
              background: 'rgba(175, 155, 255, 0.15)'
            }}
            exact
          >
            {i18n.t('navbar.stake')}            
          </NavLink>
          <NavLink
            to={baseUrl + '/tranche'}
            activeStyle={{
              opacity: 1,
              background: 'rgba(175, 155, 255, 0.15)'
            }}
            exact
          >
          {i18n.t('navbar.tranche')}
          </NavLink>
          <NavLink
            to={baseUrl + '/'}
            activeStyle={{
              opacity: 1,
              background: 'rgba(175, 155, 255, 0.15)'
            }}
            className="navLinkDisabled"
            exact
          >
          {i18n.t('navbar.vote')}

          </NavLink>
        </NavbarLinks>
          }
      <HeaderWrapper>
            <HeaderContent path={path}>
              {  (path === "privacy" || path === "terms") ? 
                <HeaderSubtitle className='header-text' fontSize="9px">
                  <h2>Last Updated: {updateDate}</h2>
                </HeaderSubtitle> : ""
              }
              <HeaderTitle path={path} color={ModeThemes[theme].HeaderTitle}>
                <h2>{i18n.t(`${path}.title`)}</h2>
              </HeaderTitle>
              <HeaderSubtitle path={path} color={ModeThemes[theme].HeaderSubtitle}>
                <h2>{i18n.t(`${path}.text`)}</h2>
              </HeaderSubtitle>
            </HeaderContent>
      </HeaderWrapper>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    theme: state.theme
  };
};

export default connect(mapStateToProps,  null)(Header);