import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { changeOwnAllFilter } from 'redux/actions/loans';
import { ETH, JNT, PagesData } from 'config/constants';
import {
  HeaderTabsWrapper,
  MarketsTabsContainer,
  HeaderTabBtn
} from './styles/HeaderComponents';

const HeaderTabs = ({ path, changeOwnAllFilter, ethereum: { address } }) => {
  const [filterValue, setFilter] = useState('all');
  const loanListing = (filter) => {
    setFilter(filter);
    changeOwnAllFilter(filter);
  };
  useEffect(() => {
    setFilter('all');
    changeOwnAllFilter('all');
  }, [path]);
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
          <HeaderTabBtn id='how-to-tab'>How-to</HeaderTabBtn>
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