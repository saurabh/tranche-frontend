import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  HeaderWrapper,
  HeaderContent,
  HeaderTitle,
  HeaderSubtitle
} from './HeaderComponents';
import HeaderTabs from "./HeaderTabs"
import Navbar from "./Navbar"
import { PagesData } from 'config/constants';


export function Header({updateDate}) {
  const { pathname } = useLocation();
  const [path, setPath] = useState(pathname.split('/')[1] || "borrow");
  useEffect(() => {
    const parsePath = () => {
      setPath(pathname.split('/')[1]);
    };

    parsePath();
  }, [pathname]);

  return (
    <HeaderWrapper color={PagesData[path].color}>
      <Navbar path={pathname.split('/')[1]}/>
        <div className='content-container container'>
          <HeaderContent path={path}>
            {  (path === "privacy" || path === "terms") ? 
              <HeaderSubtitle className='header-text' fontSize="9px">
                <h2>Last Updated: {updateDate}</h2>
              </HeaderSubtitle> : ""
            }
            <HeaderTitle className='header-text'>
              <h2>{PagesData[path].title}</h2>
            </HeaderTitle>
            <HeaderSubtitle className='header-text'>
              <h2>{PagesData[path].description}</h2>
            </HeaderSubtitle>
          </HeaderContent>
        </div>
        {
          (path === "borrow" || path === "earn" || path === "trade") ?
          <HeaderTabs /> : ""
        }
        
    </HeaderWrapper>
  );
}
