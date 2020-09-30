import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  HeaderWrapper,
  HeaderContent,
  HeaderTitle,
  HeaderSubtitle
} from './HeaderComponents';
import HeaderTabs from './HeaderTabs';
import { Navbar } from './Navbar';
import { HeaderData } from 'config';

export function Header() {
  const { pathname } = useLocation();
  const [path, setPath] = useState('home');

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
    <HeaderWrapper color={HeaderData[path].color}>
      <Navbar />
      <div className='content-container container'>
        <HeaderContent>
          <HeaderTitle className='header-text'>
            <h2>{HeaderData[path].title}</h2>
          </HeaderTitle>
          <HeaderSubtitle className='header-text'>
            <h2>{HeaderData[path].description}</h2>
          </HeaderSubtitle>
        </HeaderContent>
      </div>
      <HeaderTabs />
    </HeaderWrapper>
  );
}
