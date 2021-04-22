import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import LogoColored from 'assets/images/svg/LogoColored.svg';
import { NavbarWrapper, NavbarContainer, NavbarLinks, NavBarMobile, NavBarMobileContent, MobileNavbarIconWrapper, NavbarIconWrapper, NavbarIconContent } from './styles/HeaderComponents';
import { apiUri, pairData, ModeThemes } from 'config/constants';
import { ETH, DAI, BackArrow, Logo } from 'assets';
import { getRequest } from 'services/axios';
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

function Navbar({ path, theme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pair0Value, setPair0Value] = useState(0);
  // const [pair1Value, setPair1Value] = useState(0);
  const [ratesVisability, setRatesVisability] = useState(false);
  const [ratesToggle, setRatesToggle] = useState(false);

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

  return (
    <NavbarWrapper>
      <NavbarContainer>
        <div id='logo-wrapper'>
            <a href="https://tranche.finance/"><img src={theme === "dark" ? Logo : LogoColored} alt='Logo' /></a>
        </div>
        <MobileNavbarIconWrapper mobile>

          <ConnectWallet />

          <NavbarIconWrapper id='navbar-icon' className={menuOpen ? "NavIconActive" : ""} onClick={() => setMenuOpen(!menuOpen)}>
            <NavbarIconContent>
              <NavbarSpan></NavbarSpan>
              <NavbarSpan></NavbarSpan>
              <NavbarSpan></NavbarSpan>
            </NavbarIconContent>
          </NavbarIconWrapper>
        </MobileNavbarIconWrapper>
        
        <NavBarMobile className={menuOpen ? "NavbarMobileToggle" : ""} >
          <NavBarMobileContent first>
            <img src={TrancheIcon} alt="icon" />
            {/* <h2>0xB51F1234DA3124124468</h2> */}
            <div>
              <a href="/" onClick={(e) => ratesToggleBtn(e)}>RATES</a>
              <a href="/">DASHBOARD</a>
              <a href="https://docs.tranche.finance/tranchefinance/">DOCUMENTATION</a>
              <a href="/privacy">PRIVACY</a>
              <a href="/terms">TERMS</a>
              <a href="https://discord.com/invite/Nv44PTdF3K">SUPPORT</a>
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
          <NavbarLinks theme={ModeThemes[theme]} color={ModeThemes[theme].NavbarBorder}>
            <NavLink
              to={baseUrl + '/stake'}
              activeStyle={{
                opacity: 1,
                background: ModeThemes[theme].NavbarBackground,
                boxShadow: ModeThemes[theme].NavbarShadow
              }}
              exact
            >
              {i18n.t('navbar.stake')}            
            </NavLink>
            <NavLink
              to={baseUrl + '/tranche'}
              activeStyle={{
                opacity: 1,
                background: ModeThemes[theme].NavbarBackground,
                boxShadow: ModeThemes[theme].NavbarShadow
              }}
              exact
            >
             {i18n.t('navbar.tranche')}
            </NavLink>
            <NavLink
              to={baseUrl + '/'}
              activeStyle={{
                opacity: 1,
                background: ModeThemes[theme].NavbarBackground,
                boxShadow: ModeThemes[theme].NavbarShadow
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
