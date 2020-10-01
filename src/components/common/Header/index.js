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


export function Header() {
  const { pathname } = useLocation();
  const [path, setPath] = useState('home');

  const HeaderData = {
    home: {
      color: '#2c2cdf',
      title: 'Welcome to Jibrel',
      description: 'PLACEHOLDER SLOGAN'
    },
    borrow: {
      color: '#5411e2',
      title: 'Borrower Markets',
      description: 'APPLY FOR A COLLATERALIZED LOAN USING YOUR CRYPTOCURRENCY'
    },
    earn: {
      color: '#1ebb1b',
      title: 'Earning Markets',
      description: 'EARN INTEREST ON YOUR CRYPTOCURRENCY DEPOSITS'
    },
    trade: {
      color: '#1f1f1f',
      title: 'Trading Markets',
      description: 'BUY & SELL TOKENIZED DERIVATIVES ON ETHEREUM'
    }
  };

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
      <div className="content-container container">
        <HeaderContent>
            <HeaderTitle className="header-text">
                <h2>{HeaderData[path].title}</h2>
            </HeaderTitle>
            <HeaderSubtitle className="header-text">
                <h2>{HeaderData[path].description}</h2>
            </HeaderSubtitle>
        </HeaderContent>
      </div>
      <HeaderTabs />
    </HeaderWrapper>
  );
}
