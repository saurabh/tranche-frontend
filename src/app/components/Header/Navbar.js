import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Logo from 'assets/images/svg/Logo.svg';
import { NavbarWrapper, NavbarContainer, NavbarLinks, NavBarMobile, NavBarMobileContent  } from './styles/HeaderComponents';
import { PagesData, apiUri, pairData  } from 'config/constants';
import { ETH, USDC, SLICE, DAI, BackArrow } from 'assets';
import { getRequest } from 'services/axios';
import { roundNumber, safeDivide } from 'utils/helperFunctions';
import { NavLink } from 'react-router-dom';
import {
  RatesWrapper,
  RatesBoxWrapper,
  RatesRowWrapper,
  RatesRowContent,
  RatesValue,
  RatesValueImg,
  RatesValueText,
  RatesRowDash
} from './styles/HeaderComponents';
import ConnectWallet from './ConnectWallet';
import { TrancheIcon } from 'assets';

function Navbar({ path }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pair0Value, setPair0Value] = useState(0);
  const [pair1Value, setPair1Value] = useState(0);
  const [ratesVisability, setRatesVisability] = useState(false);


  const getPriceFeed = async () => {
    const { priceFeed: priceUrl } = apiUri;
    setRatesVisability(!ratesVisability);
    try {
      const { data: result } = await getRequest(priceUrl, {}, null);
      result.result.forEach(pair => {
        let price = safeDivide(pair.pairValue,10**pair.pairDecimals)
        price = roundNumber(price);
        if (pair.pairId === pairData[0].value) setPair0Value(price)
        if (pair.pairId === pairData[1].value) setPair1Value(price)
      })
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(()=>{
    getPriceFeed();
  }, [])
  
  return (
    <NavbarWrapper>
      <NavbarContainer className='container navbar-container'>
        <div id='logo-wrapper'>
            <img src={Logo} alt='Logo' />
        </div>
        <div id='navbar-icon' className={menuOpen ? "NavIconActive" : ""} onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        <NavBarMobile className={menuOpen ? "NavbarMobileToggle" : ""} style={{display: "none"}}>
          <NavBarMobileContent>
            <img src={TrancheIcon} alt="icon" />
            <h2>0xB51F1234DA3124124468</h2>
            <div>
              <a href="">RATES</a>
              <a href="">DASHBOARD</a>
              <a href="">DOCUMENTATION</a>
              <a href="">PRIVACY</a>
              <a href="">TERMS</a>
              <a href="">SUPPORT</a>
            </div>
          </NavBarMobileContent>
        </NavBarMobile>

        <NavBarMobile className={!menuOpen ? "NavbarMobileToggle" : ""} rates>
          <NavBarMobileContent>
            <button><img src={BackArrow} alt="back" /></button>
            <RatesWrapper>
              <RatesBoxWrapper
                className='ratesBoxWrapper ratesBoxWrapperDisplay'
              >
                <RatesRowWrapper border={true}>
                  <RatesRowContent>
                    <RatesValue>
                      <RatesValueImg>
                        <img src={ETH} alt='ETH' />
                      </RatesValueImg>
                      <RatesValueText>
                        <h2>1 ETH</h2>
                      </RatesValueText>
                    </RatesValue>
                    <RatesRowDash>
                      <h2>—</h2>
                    </RatesRowDash>
                    <RatesValue>
                      <RatesValueImg>
                        <img src={DAI} alt='DAI' />
                      </RatesValueImg>
                      <RatesValueText>
                        <h2>{pair0Value} DAI</h2>
                      </RatesValueText>
                    </RatesValue>
                  </RatesRowContent>
                </RatesRowWrapper>

                <RatesRowWrapper>
                  <RatesRowContent>
                    <RatesValue>
                      <RatesValueImg>
                        <img src={SLICE} alt='SLICE' />
                      </RatesValueImg>
                      <RatesValueText>
                        <h2>1 SLICE</h2>
                      </RatesValueText>
                    </RatesValue>
                    <RatesRowDash>
                      <h2>—</h2>
                    </RatesRowDash>
                    <RatesValue>
                      <RatesValueImg>
                        <img src={USDC} alt='USDC' />
                      </RatesValueImg>
                      <RatesValueText>
                        <h2>{pair1Value} USDC</h2>
                      </RatesValueText>
                    </RatesValue>
                  </RatesRowContent>
                </RatesRowWrapper>
              </RatesBoxWrapper>
            </RatesWrapper>
          </NavBarMobileContent>
        </NavBarMobile>
        
        <div className='navbar-right'>
          <NavbarLinks>
            <NavLink
              to='/borrow'
              activeStyle={{
                borderBottom: '2px solid',
                borderColor: PagesData[path].secondaryColor,
                opacity: '1'
              }}
            >
              <span data-content="borrow"></span>
              Borrow
              
            </NavLink>
            <NavLink
              to='/earn'
              activeStyle={{
                borderBottom: '2px solid',
                borderColor: PagesData[path].secondaryColor,
                opacity: '1'
              }}
            >
              <span data-content="earn"></span>
              Earn
            </NavLink>
            <NavLink
              to='/trade'
              onClick={(e) => e.preventDefault()}
              className='navLinkDisabled'
              activeStyle={{
                borderBottom: '2px solid',
                borderColor: PagesData[path].secondaryColor,
                opacity: '1'
              }}
            >
              Trade
            </NavLink>
          </NavbarLinks>
          <ConnectWallet path={path} />
        </div>
      </NavbarContainer>
    </NavbarWrapper>
  );
}
const mapStateToProps = (state) => {
  return {
    path: state.path
  };
};
export default connect(mapStateToProps, null)(Navbar);
