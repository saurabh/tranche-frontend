import React, { useState } from 'react';
import { connect } from 'react-redux';
import { changeOwnAllFilter, ownAllToggle } from 'redux/actions/tableData';
import { apiUri, pairData } from 'config/constants';
import { useOuterClick } from 'services/useOuterClick';
import { getRequest } from 'services/axios';
import { roundNumber, safeDivide } from 'utils/helperFunctions';
import { ETH, DaiLogo } from 'assets';
import { NavLink } from 'react-router-dom';
import i18n from "../locale/i18n";

import {
  HeaderTabsWrapper,
  HeaderTabsBtnsLinks,
  RatesWrapper,
  RatesBoxWrapper,
  RatesRowWrapper,
  RatesRowContent,
  RatesValue,
  RatesValueImg,
  RatesValueText,
  RatesRowDash,
} from './styles/HeaderComponents';
export const baseUrl = i18n.language === 'en' ? '' : '/'+i18n.language;

const HeaderTabs = ({ path }) => {
  // const [pair1Value, setPair1Value] = useState(0);
  const [ratesVisability, setRatesVisability] = useState(false);
  const [pair0Value, setPair0Value] = useState(0);
  // const [pair1Value, setPair1Value] = useState(0);
  
  const innerRef = useOuterClick((e) => {
    setRatesVisability(false);
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
  
  
  
  return (
    <HeaderTabsWrapper path={path} desktop>
      <HeaderTabsBtnsLinks>
          <NavLink
            to={baseUrl + '/stake'}
            activeStyle={{
              color: 'rgba(68, 65, 207, 1)'
            }}
            exact
          >
            Staking
          </NavLink>
          <NavLink
            to={baseUrl + '/'}
            activeStyle={{
              color: 'rgba(68, 65, 207, 1)'
            }}
            exact
          >
            Dashboard
          </NavLink>
          <div ref={innerRef}>
            <button onClick={() => getPriceFeed()}>
              Rates
            </button>
            <RatesWrapper>
              <RatesBoxWrapper
                className={'ratesBoxWrapper ' + (!ratesVisability ? 'ratesBoxWrapperDisplay' : '')}
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
                      <img src={DaiLogo} alt='DAI' />
                    </RatesValueImg>
                    <RatesValueText>
                      <h2>{pair0Value} DAI</h2>
                    </RatesValueText>
                  </RatesValue>
                </RatesRowContent>
              </RatesRowWrapper>
            {/* 
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
              </RatesRowWrapper> */}
          </RatesBoxWrapper>
        </RatesWrapper>
          </div>
          <NavLink
            to={baseUrl + '/'}
            activeStyle={{
              color: 'rgba(68, 65, 207, 1)'
            }}
            exact
          >
            How-to
          </NavLink>
      </HeaderTabsBtnsLinks>
      
    </HeaderTabsWrapper>
  );
};

const mapStateToProps = (state) => {
  return {
    ethereum: state.ethereum,
    data: state.data,
    path: state.path,
    trade: state.trade
  };
};

export default connect(mapStateToProps, { changeOwnAllFilter, ownAllToggle })(HeaderTabs);