import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { changeOwnAllFilter } from 'redux/actions/loans';
import { ownAllToggle } from 'redux/actions/trade';

import { PagesData, apiUri, pairData } from 'config/constants';
import { useOuterClick } from 'services/useOuterClick';
import { getRequest } from 'services/axios';
import { roundNumber, safeDivide } from 'utils/helperFunctions';
import { ETH, DaiLogo } from 'assets';
import { NavLink } from 'react-router-dom';
import i18n from 'i18next';


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

const HeaderTabs = ({ path, changeOwnAllFilter, ownAllToggle, ethereum: { address }, loans: { filterType }, trade: { tradeType } }) => {
  const [ratesVisability, setRatesVisability] = useState(false);
  const [pair0Value, setPair0Value] = useState(0);
  // const [pair1Value, setPair1Value] = useState(0);
  
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
        // if (pair.pairId === pairData[1].value) setPair1Value(price)
      })
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <div className='content-container container'>
      <HeaderTabsWrapper mobile>
          <MarketsTabsContainer links>
            <NavLink to="/borrow"
              activeStyle={{
                borderColor: PagesData[path].secondaryColor,
                opacity: '1'
              }}
            >Borrow</NavLink>
            <NavLink to="/lend"
              activeStyle={{
                borderColor: PagesData[path].secondaryColor,
                opacity: '1'
              }}
            >Lend</NavLink>
            <NavLink to="/earn"
              activeStyle={{
                borderColor: PagesData[path].secondaryColor,
                opacity: '1'
              }}
            >Earn</NavLink>
          </MarketsTabsContainer>
              

        <div id='other-tabs-container'>
            <HeaderTabBtn link as='a' href='https://docs.tranche.finance' target='_blank' id='how-to-tab'>
              DOCS
            </HeaderTabBtn>
        </div>
      </HeaderTabsWrapper>


      <HeaderTabsWrapper desktop className="desktopViewTabs">
        { (path === "borrow" || path === "lend") ?
          <MarketsTabsContainer>
          <HeaderTabBtn
            onClick={() => loanListing('all')}
            id='all'
            active={filterType === 'all'}
            color={PagesData[path].secondaryColor}
          >
            {path === 'borrow' ? 'All Loans' : path === 'lend' ? i18n.t("earn.tabs.all") : ''}
          </HeaderTabBtn>
          {
            address ? 
              <HeaderTabBtn
                onClick={() => loanListing('own')}
                id='own'
                active={filterType === 'own'}
                color={PagesData[path].secondaryColor}
              >
                {path === "borrow" ? "My Loans" : path === "lend" ? i18n.t("earn.tabs.own") : ""}
              </HeaderTabBtn>
            : ""
          }
          <TabIndicator tab={filterType} path={path} language={i18n.language}></TabIndicator>
        </MarketsTabsContainer>
        :
        <MarketsTabsContainer page="earn">
          <HeaderTabBtn
            id='allTranches'
            active={tradeType === 'allTranches'}
            onClick={() => ownAllToggle('allTranches')}
            color={PagesData[path].secondaryColor}
          >
            All tranches
          </HeaderTabBtn>
          {
            address ? 
              <HeaderTabBtn
                id='myTranches'
                active={tradeType === 'myTranches'}
                onClick={() => ownAllToggle('myTranches')}
                color={PagesData[path].secondaryColor}
              >
                My tranches
              </HeaderTabBtn>
            : ""
          }
          <TabIndicator tab={tradeType} path={path} language={i18n.language}></TabIndicator>
        </MarketsTabsContainer>
        }
        

        <div id='other-tabs-container'>
          <RatesWrapper ref={innerRef}>
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
            <HeaderTabBtn onClick={() => getPriceFeed()} id=''>
            {i18n.t("rates")}
            </HeaderTabBtn>
          </RatesWrapper>
          <div>
            <HeaderTabBtn link as='a' href={"https://docs.tranche.finance/tranchefinance/guides/for-users/" + (path === "borrow" ? "borrowing" : path === "lend" ? "lending" : "")} target='_blank' id='how-to-tab'>
              {i18n.t("HowTo")}
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

export default connect(mapStateToProps, { changeOwnAllFilter, ownAllToggle })(HeaderTabs);