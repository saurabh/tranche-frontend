import React, { useState } from 'react';
import { BannerWrapper, BannerContent, BannerText, Close } from './styles/BannerComponents';
import CloseBanner from '../../../assets/images/svg/CloseBanner.svg';
// import { PagesData } from 'config/constants';
import i18n from "../locale/i18n";


const Banner = () => {
  const [showBanner, setShowBanner] = useState(true);
  // const pathname = window.location.pathname;
  // let parsedPath = pathname.split('/');
  // let path = parsedPath[parsedPath.length - 1] || 'borrow';
  return (
    <BannerWrapper>
      { showBanner ? 
        <BannerContent>
          <BannerText><span role="img" aria-label="Caution">⚠️</span> You are currently on the Tranche Development Environment - This is a sandbox environment for team and community testing - Please connect your wallet to a test network!</BannerText>
          <Close src={CloseBanner} onClick={() => setShowBanner(false)}/>
        </BannerContent> : ""
      }
      
    </BannerWrapper>
  );
};

export default Banner;