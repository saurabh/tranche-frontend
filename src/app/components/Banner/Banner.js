import React, { useState } from 'react';
import { BannerWrapper, BannerContent, BannerText, Close } from './styles/BannerComponents';
import CloseBanner from '../../../assets/images/svg/CloseBanner.svg';


const Banner = () => {
  const [showBanner, setShowBanner] = useState(true);
  return (
    <BannerWrapper>
      { showBanner ? 
        <BannerContent>
          <BannerText>Caution! Tranche is still in beta mode and is currently active on the Kovan test network. Please do not send funds directly to the contract.</BannerText>
          <Close src={CloseBanner} onClick={() => setShowBanner(false)}/>
        </BannerContent> : ""
      }
      
    </BannerWrapper>
  );
};

export default Banner;