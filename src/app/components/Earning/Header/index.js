import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { changeTheme } from 'redux/actions/theme';
import { useLocation } from 'react-router-dom';
import {
  HeaderWrapper,
  HeaderContent,
  HeaderTitle,
  HeaderSubtitle
} from './styles/HeaderComponents';
import HeaderTabs from "./HeaderTabs"
import Navbar from "./Navbar"
import {
  ModeThemes
} from 'config/constants';
import i18n from "../../locale/i18n";

function Header({updateDate, theme}) {
  const { pathname } = useLocation();
  let parsedPath = pathname.split('/');

  const [path, setPath] = useState(parsedPath[parsedPath.length - 1] || "borrow");
  const parsePath = useCallback(() =>{
    setPath(parsedPath[parsedPath.length - 1]);
  }, [parsedPath]);
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
      <HeaderWrapper>
            <HeaderContent path={path}>
              {  (path === "privacy" || path === "terms") ? 
                <HeaderSubtitle className='header-text' fontSize="9px">
                  <h2>Last Updated: {updateDate}</h2>
                </HeaderSubtitle> : ""
              }
              <HeaderTitle path={path} color={ModeThemes[theme].HeaderTitle}>
                <h2>{i18n.t("tranche.title")}</h2>
              </HeaderTitle>
              <HeaderSubtitle path={path} color={ModeThemes[theme].HeaderSubtitle}>
                <h2>{i18n.t("tranche.text")}</h2>
              </HeaderSubtitle>
            </HeaderContent>
      </HeaderWrapper>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    theme: state.theme,
  };
};

export default connect(mapStateToProps, { changeTheme })(Header);