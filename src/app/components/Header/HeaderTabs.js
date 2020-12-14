import React, { useState } from 'react';
import { connect } from 'react-redux';
import { changeOwnAllFilter } from 'redux/actions/loans';
import { PagesData } from 'config/constants';
import { useOuterClick } from 'services/useOuterClick'
import { ETH, USDC, JNT, DAI } from 'assets';
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
  RatesRowDash
} from './styles/HeaderComponents';

const HeaderTabs = ({ path, changeOwnAllFilter, ethereum: { address } }) => {
  const [filterValue, setFilter] = useState('all');
  const [ratesVisability, setRatesVisability] = useState(false);
  const innerRef = useOuterClick(e => {
    setRatesVisability(false);
  });
  
  const loanListing = (filter) => {
    setFilter(filter);
    changeOwnAllFilter(filter);
  };
  
  return (
    <div className='container content-container'>
      <HeaderTabsWrapper>
        <MarketsTabsContainer>
          <HeaderTabBtn
            onClick={() => loanListing('all')}
            id='all'
            active={filterValue === 'all'}
            color={PagesData[path].secondaryColor}
          >
            {path === "borrow" ? "All Loans" : path === "earn" ? "All Assets" : ""}
          </HeaderTabBtn>
          {
            address ? 
              <HeaderTabBtn
                onClick={() => loanListing('own')}
                id='own'
                active={filterValue === 'own'}
                color={PagesData[path].secondaryColor}
              >
                {path === "borrow" ? "My Loans" : path === "earn" ? "My Assets" : ""}
              </HeaderTabBtn>
            : ""
          }
        </MarketsTabsContainer>

        <div id='other-tabs-container'>
        <RatesWrapper ref={innerRef}>

            <RatesBoxWrapper className={ "ratesBoxWrapper " + (!ratesVisability ? "ratesBoxWrapperDisplay" : '') } >
              
              <RatesRowWrapper border={true}>
                <RatesRowContent>
                  <RatesValue>
                    <RatesValueImg>
                      <img src={DAI} alt="DAI" />
                    </RatesValueImg>
                    <RatesValueText>
                      <h2>1 DAI</h2>
                    </RatesValueText>
                  </RatesValue>
                  <RatesRowDash>
                    <h2>—</h2>
                  </RatesRowDash>
                  <RatesValue>
                    <RatesValueImg>
                      <img src={ETH} alt="ETH" />
                    </RatesValueImg>
                    <RatesValueText>
                      <h2>0.0000 ETH</h2>
                    </RatesValueText>
                  </RatesValue>
                </RatesRowContent>
              </RatesRowWrapper>

              <RatesRowWrapper>
                <RatesRowContent>
                  <RatesValue>
                    <RatesValueImg>
                      <img src={USDC} alt="USDC" />
                    </RatesValueImg>
                    <RatesValueText>
                      <h2>1 USDC</h2>
                    </RatesValueText>
                  </RatesValue>
                  <RatesRowDash>
                    <h2>—</h2>
                  </RatesRowDash>
                  <RatesValue>
                    <RatesValueImg>
                      <img src={JNT} alt="JNT" />
                    </RatesValueImg>
                    <RatesValueText>
                      <h2>0.0000 JNT</h2>
                    </RatesValueText>
                  </RatesValue>
                </RatesRowContent>
              </RatesRowWrapper>

            </RatesBoxWrapper>
            <HeaderTabBtn onClick={() => setRatesVisability(!ratesVisability)} id=''>Rates</HeaderTabBtn>
          </RatesWrapper>
          <HeaderTabBtn as="a" href="https://docs.tranche.finance" target="_blank" id='how-to-tab'>How-to</HeaderTabBtn>
          
        </div>
      </HeaderTabsWrapper>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    ethereum: state.ethereum,
    path: state.path
  };
};

export default connect(mapStateToProps, { changeOwnAllFilter })(HeaderTabs);