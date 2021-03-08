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
    <div className='content-container container'>
      <Navbar path={parsedPath[parsedPath.length - 1]}/>
      {
        path === "stake" &&
        <HeaderTabs />
      }
      <HeaderWrapper>
            <HeaderContent path={path}>
              {  (path === "privacy" || path === "terms") ? 
                <HeaderSubtitle className='header-text' fontSize="9px">
                  <h2>Last Updated: {updateDate}</h2>
                </HeaderSubtitle> : ""
              }
              <HeaderTitle path={path}>
                <h2>{i18n.t(`${path + ".title"}`)}</h2>
              </HeaderTitle>
              <HeaderSubtitle path={path}>
                <h2>Stake Cryptocurrency for SLICE Rewards</h2>
              </HeaderSubtitle>
            </HeaderContent>
      </HeaderWrapper>
    </div>
  );
}
