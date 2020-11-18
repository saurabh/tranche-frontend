import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { changeFilter } from 'redux/actions/loans';
import { ETH, JNT, PagesData } from 'config/constants';
import {
  HeaderTabsWrapper,
  MarketsTabsContainer,
  HeaderTabBtn
} from './styles/HeaderComponents';

const HeaderTabs = ({ path, changeFilter }) => {
  const [filterValue, setFilter] = useState(null);
  const loanListing = async (filter = null) => {
    setFilter(filter);
    changeFilter(filter);
  };
  return (
    <div className='container content-container'>
      <HeaderTabsWrapper>
        <MarketsTabsContainer>
          <HeaderTabBtn
            /*onClick={() => loanListing(null)}*/
            id='my'
            active={filterValue === null}
            color={PagesData[path].secondaryColor}
          >
           {path === "borrow" ? "My Loans" : path === "earn" ? "My Assets" : ""}
          </HeaderTabBtn>
          <HeaderTabBtn
            /*onClick={() => loanListing(ETH)}*/
            id='all'
            active={filterValue === ETH}
            color={PagesData[path].secondaryColor}
          >
            {path === "borrow" ? "All Loans" : path === "earn" ? "All Assets" : ""}
          </HeaderTabBtn>
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
    path: state.path,
  };
};

export default connect(mapStateToProps, { changeFilter })(HeaderTabs);