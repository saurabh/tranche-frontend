import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { changeOwnAllFilter } from 'redux/actions/loans';
import { sellBuyToggle } from 'redux/actions/trade';

import { PagesData, apiUri, pairData } from 'config/constants';
import { useOuterClick } from 'services/useOuterClick';
import { getRequest } from 'services/axios';
import { roundNumber, safeDivide } from 'utils/helperFunctions';
import { ETH, USDC, SLICE, DAI } from 'assets';
import {
  HeaderTabsWrapper,
  MarketsTabsContainer,
  HeaderTabBtn,
  RatesWrapper,
  RatesBoxWrapper,
  RatesRowWrapper,
  RatesRowContent,
  RatesValue,
  RatesValueImg,
  RatesValueText,
  RatesRowDash,
  TabIndicator
} from './styles/HeaderComponents';

const HeaderTabs = ({ path, changeOwnAllFilter, sellBuyToggle, ethereum: { address }, loans: { filterType }, trade: { tradeType } }) => {
  const [ratesVisability, setRatesVisability] = useState(false);
  const [pair0Value, setPair0Value] = useState(0);
  const [pair1Value, setPair1Value] = useState(0);

  const innerRef = useOuterClick((e) => {
    setRatesVisability(false);
  });

  const loanListing = useCallback(
    (filter) => {
      changeOwnAllFilter(filter);
    },
    [changeOwnAllFilter]
  );
  
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

  return (
    <div className='content-container container'>
      <HeaderTabsWrapper>
        { (path === "borrow" || path === "earn") ?
          <MarketsTabsContainer>
          <HeaderTabBtn
            onClick={() => loanListing('all')}
            id='all'
            active={filterType === 'all'}
            color={PagesData[path].secondaryColor}
          >
            {path === 'borrow' ? 'All Loans' : path === 'earn' ? 'All Assets' : ''}
          </HeaderTabBtn>
          {
            address ? 
              <HeaderTabBtn
                onClick={() => loanListing('own')}
                id='own'
                active={filterType === 'own'}
                color={PagesData[path].secondaryColor}
              >
                {path === "borrow" ? "My Loans" : path === "earn" ? "My Assets" : ""}
              </HeaderTabBtn>
            : ""
          }
          <TabIndicator tab={filterType} path={path}></TabIndicator>
        </MarketsTabsContainer>
        :
        <MarketsTabsContainer page="trade">
          <HeaderTabBtn
            id='buy'
            active={tradeType === 'buy'}
            onClick={() => sellBuyToggle('buy')}
            color={PagesData[path].secondaryColor}
          >
            Buy
          </HeaderTabBtn>
          {
            address ? 
              <HeaderTabBtn
                id='sell'
                active={tradeType === 'sell'}
                onClick={() => sellBuyToggle('sell')}
                color={PagesData[path].secondaryColor}
              >
                Sell
              </HeaderTabBtn>
            : ""
          }
          <TabIndicator tab={tradeType} path={path}></TabIndicator>
        </MarketsTabsContainer>
        }
        

        <div id='other-tabs-container'>
          <RatesWrapper ref={innerRef}>
            <RatesBoxWrapper
              className={'ratesBoxWrapper ' + (!ratesVisability ? 'ratesBoxWrapperDisplay' : '')}
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
            <HeaderTabBtn onClick={() => getPriceFeed()} id=''>
              Rates
            </HeaderTabBtn>
          </RatesWrapper>
          <div>
            <HeaderTabBtn link as='a' href={" https://docs.tranche.finance/tranche-finance/use/" + (path === "borrow" ? "borrowing" : path === "earn" ? "earning" : "")} target='_blank' id='how-to-tab'>
              How-to
            </HeaderTabBtn>
          </div>
        </div>
      </HeaderTabsWrapper>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    ethereum: state.ethereum,
    loans: state.loans,
    path: state.path,
    trade: state.trade
  };
};

export default connect(mapStateToProps, { changeOwnAllFilter, sellBuyToggle })(HeaderTabs);