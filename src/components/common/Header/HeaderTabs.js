import React, { useState } from "react";
import { connect } from 'react-redux';
import { loansFetchData } from 'redux/actions/loans';
import { ETH, JNT } from 'config';

import {
    HeaderTabsWrapper,
    MarketsTabsContainer,
    HeaderTabBtn
} from './HeaderComponents';
const HeaderTabs = ({fetchData}) => {
    const [filterValue, setFilter] = useState(null);
    const loanListing = async (filter=null) => {
        setFilter(filter);
        await fetchData({
          skip: 0,
          limit: 10000,
          filter: {
            type: filter, //ETH/JNT keep these in constant file
          },
        });
    };
    return (
        <div className="container content-container">
            <HeaderTabsWrapper>
                <MarketsTabsContainer>
                    
                    <HeaderTabBtn onClick={()=>loanListing(null)} id="all-markets-tab" className={filterValue === null ? "active-tab-btn" : ""}>
                        All Markets
                    </HeaderTabBtn>
                    <HeaderTabBtn onClick={()=>loanListing(ETH)} id="eth markets" className={filterValue === ETH ? "active-tab-btn" : ""}>
                        Eth Markets                        
                    </HeaderTabBtn>
                    <HeaderTabBtn onClick={()=>loanListing(JNT)} id="jnt markets" className={filterValue === JNT ? "active-tab-btn" : ""}>
                        Jnt Markets
                    </HeaderTabBtn>
                </MarketsTabsContainer>

                <div id="other-tabs-container">
                    <HeaderTabBtn id="how-to-tab">
                        How-to
                    </HeaderTabBtn>
                </div>
            </HeaderTabsWrapper>
        </div>
    );
}



  
  const mapDispatchToProps = (dispatch) => {
    return {
        fetchData: (data) => dispatch(loansFetchData(data))
    };
  };
  
  export default connect(null, mapDispatchToProps)(HeaderTabs);