import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

import {
  HeaderWrapper,
  HeaderContent,
  HeaderTitle,
  HeaderSubtitle
} from './styles/HeaderComponents';
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
    <motion.div initial={{ opacity: 0.5, x: '-10%' }} animate={{ opacity: 1, x: '0' }} exit={{ opacity: 0.5, x: '-10%' }} transition={{ type: "tween", ease: "linear" }}>
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
    </motion.div>
  );
}
