import React, { useState, useCallback } from 'react';
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
  RatesRowDash,
  TabIndicator
} from './styles/HeaderComponents';

const HeaderTabs = ({ path, changeOwnAllFilter, ethereum: { address }, loans: { filterType } }) => {
  // const [filterValue, setFilter] = useState('all');
  const [ratesVisability, setRatesVisability] = useState(false);
  const innerRef = useOuterClick(e => {
    setRatesVisability(false);
  });

  const loanListing = useCallback((filter) => {
    // setFilter(filter);
    changeOwnAllFilter(filter);
  }, [changeOwnAllFilter]);

  // useEffect(() => {
  //   loanListing('all')import Tab from '@material/react-tab';

  //   changeOwnAllFilter('all');
  // }, [path, loanListing, changeOwnAllFilter])
  
  return (
    <div className='container content-container'>
      <HeaderTabsWrapper>
        <MarketsTabsContainer>
          <HeaderTabBtn
            onClick={() => loanListing('all')}
            id='all'
            active={filterType === 'all'}
            color={PagesData[path].secondaryColor}
          >
            {path === "borrow" ? "All Loans" : path === "earn" ? "All Assets" : ""}
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
          <TabIndicator tab={filterType}></TabIndicator>
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
          <HeaderTabBtn link as="a" href="https://docs.tranche.finance" target="_blank" id='how-to-tab'>How-to</HeaderTabBtn>
          
        </div>
      </HeaderTabsWrapper>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    ethereum: state.ethereum,
    loans: state.loans,
    path: state.path
  };
};

export default connect(mapStateToProps, { changeOwnAllFilter })(HeaderTabs);