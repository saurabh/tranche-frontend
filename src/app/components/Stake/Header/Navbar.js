import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import LogoColored from 'assets/images/svg/LogoColored.svg';
import { NavbarWrapper, NavbarContainer, NavbarLinks, NavBarMobile, NavBarMobileContent, LocaleWrapper, MobileNavbarIconWrapper, NavbarIconWrapper } from './styles/HeaderComponents';
import { apiUri, pairData  } from 'config/constants';
import { ETH, DAI, BackArrow, ChevronDown } from 'assets';
import { getRequest } from 'services/axios';
import { useOuterClick } from 'services/useOuterClick';
import { roundNumber, safeDivide } from 'utils/helperFunctions';
import { NavLink } from 'react-router-dom';
import i18n from "../../locale/i18n";

import {
  RatesWrapper,
  RatesBoxWrapper,
  RatesRowWrapper,
  RatesRowContent,
  RatesValue,
  RatesValueImg,
  RatesValueText,
  RatesRowDash,
  NavbarSpan
} from './styles/HeaderComponents';
import ConnectWallet from './ConnectWallet';
import { TrancheIcon } from 'assets';
export const baseUrl = i18n.language === 'en' ? '' : '/'+i18n.language;

function Navbar({ path }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pair0Value, setPair0Value] = useState(0);
  // const [pair1Value, setPair1Value] = useState(0);
  const [ratesVisability, setRatesVisability] = useState(false);
  const [ratesToggle, setRatesToggle] = useState(false);
  const [localeToggle, setLocaleToggle] = useState(false);

  const innerRef = useOuterClick(e => {
    setLocaleToggle(false);
  });

  const getPriceFeed = async () => {
    const { priceFeed: priceUrl } = apiUri;
    setRatesVisability(!ratesVisability);
    try {
      const { data: result } = await getRequest(priceUrl, {}, null);
      result.result.forEach(pair => {
        let price = safeDivide(pair.pairValue,10**pair.pairDecimals)
        price = roundNumber(price);
        if (pair.pairId === pairData[0].value) setPair0Value(price)
        // if (pair.pairId === pairData[1].value) setPair1Value(price)
      })
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(()=>{
    getPriceFeed();
    //eslint to be fixed
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const ratesToggleBtn = (e) =>{
    e.preventDefault();
    setRatesToggle(true);
  }
  const pathWindow =  window.location.pathname;
  let parsedPathWindow = pathWindow.split('/');
  let currentPath = parsedPathWindow[parsedPathWindow.length - 1];
  const newPath = (lng) =>{
    return `${"/" + lng + "/" + currentPath}`;
  }
  
  return (
    <NavbarWrapper>
      <NavbarContainer>
        <div id='logo-wrapper'>
            <a href="https://tranche.finance/">
              <img src={LogoColored} alt='Logo' />
            </a>
        </div>
        <MobileNavbarIconWrapper mobile>
          <LocaleWrapper color="rgb(68,65,207)" ref={innerRef} mobile>
            <h2 onClick={() => setLocaleToggle(!localeToggle)}>{i18n.language}<img src={ChevronDown} alt="chevron"/> </h2>
            { localeToggle ?
              <div>
                <a href={newPath("en")}>en</a>
                <a href={newPath("zh")}>ZH</a>
                <a href={newPath("kr")}>KR</a>
              </div> : ""
            }
          
          </LocaleWrapper>
          <NavbarIconWrapper id='navbar-icon' className={menuOpen ? "NavIconActive" : ""} onClick={() => setMenuOpen(!menuOpen)}>
            <NavbarSpan></NavbarSpan>
            <NavbarSpan></NavbarSpan>
            <NavbarSpan></NavbarSpan>
          </NavbarIconWrapper>
        </MobileNavbarIconWrapper>
        
        <NavBarMobile className={menuOpen ? "NavbarMobileToggle" : ""} >
          <NavBarMobileContent first>
            <img src={TrancheIcon} alt="icon" />
            {/* <h2>0xB51F1234DA3124124468</h2> */}
            <div>
              <a href="/" onClick={(e) => ratesToggleBtn(e)}>RATES</a>
              <a href="/">DASHBOARD</a>
              <a href="https://docs.tranche.finance/">DOCUMENTATION</a>
              <a href="/privacy">PRIVACY</a>
              <a href="/terms">TERMS</a>
              <a href="https://discord.gg/DTZrm4j4Yc">SUPPORT</a>
            </div>
          </NavBarMobileContent>
        </NavBarMobile>

        <NavBarMobile className={(ratesToggle && menuOpen) ? "NavbarMobileToggle ratesToggle" : ""} rates>
          <NavBarMobileContent>
            <button onClick={() => setRatesToggle(false)}><img src={BackArrow} alt="back" /></button>
            <RatesWrapper>
              <RatesBoxWrapper
                className='ratesBoxWrapper'
                mobile
              >
                <RatesRowWrapper border={false}>
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

                {/* <RatesRowWrapper>
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
                </RatesRowWrapper> */}
              </RatesBoxWrapper>
            </RatesWrapper>
          </NavBarMobileContent>
        </NavBarMobile>
        
        <div className='navbar-right'>
          <NavbarLinks>
            <NavLink
              to={baseUrl + '/stake'}
              activeStyle={{
                color: 'rgba(68, 65, 207, 1)'
              }}
              exact
            >
              {i18n.t('navbar.stake')}            
            </NavLink>
            <NavLink
              to={baseUrl + '/tranche'}
              activeStyle={{
                color: 'rgba(68, 65, 207, 1)'
              }}
              exact
            >
             {i18n.t('navbar.tranche')}
            </NavLink>
            <NavLink
              to={baseUrl + '/'}
              activeStyle={{
                color: 'rgba(68, 65, 207, 1)'
              }}
              className="navLinkDisabled"
              exact
            >
            {i18n.t('navbar.vote')}

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
