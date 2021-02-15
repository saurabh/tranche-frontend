import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import {
  HeaderWrapper,
  HeaderContent,
  HeaderTitle,
  HeaderSubtitle
} from './styles/HeaderComponents';
import HeaderTabs from "./HeaderTabs"
import Navbar from "./Navbar"
import { PagesData } from 'config/constants';
import i18n from "../locale/i18n";

export function Header({updateDate}) {
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
    <HeaderWrapper color={PagesData[path].color}>
      <Navbar path={parsedPath[parsedPath.length - 1]}/>
        <div className='content-container container'>
          <HeaderContent path={path}>
            {  (path === "privacy" || path === "terms") ? 
              <HeaderSubtitle className='header-text' fontSize="9px">
                <h2>Last Updated: {updateDate}</h2>
              </HeaderSubtitle> : ""
            }
            <HeaderTitle className='header-text'>
              <h2>{i18n.t(`${path + ".title"}`)}</h2>
            </HeaderTitle>
            <HeaderSubtitle className='header-text'>
              <h2>{i18n.t(`${path + ".text"}`)}</h2>
            </HeaderSubtitle>
          </HeaderContent>
        </div>
        {
          (path === "borrow" || path === "lend" || path === "earn") ?
          <HeaderTabs /> : ""
        }
        
    </HeaderWrapper>
  );
}
