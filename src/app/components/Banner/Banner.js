import React, { useState } from 'react';
import { BannerWrapper, BannerContent, BannerText, Close } from './styles/BannerComponents';
import CloseBanner from '../../../assets/images/svg/CloseBanner.svg';


const Banner = () => {
  const [showBanner, setShowBanner] = useState(true);
  return (
    <BannerWrapper>
      { showBanner ? 
        <BannerContent>
          <BannerText><span role="img" aria-label="Caution">⚠️</span>Caution! Tranche is still in beta. Use at your own risk.</BannerText>
          <Close src={CloseBanner} onClick={() => setShowBanner(false)}/>
        </BannerContent> : ""
      }
      
    </BannerWrapper>
  );
};

export default Banner;