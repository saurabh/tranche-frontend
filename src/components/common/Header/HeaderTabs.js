import React, { useState } from "react";
import { connect } from 'react-redux';
import { loansFetchData } from '../../../redux/actions/loans';
import { ETH, JNT, ColorData } from '../../../config/constants';

import {
    HeaderTabsWrapper,
    MarketsTabsContainer,
    HeaderTabBtn
} from './HeaderComponents';
const HeaderTabs = ({fetchData, pathChanged}) => {
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
                    <HeaderTabBtn onClick={()=>loanListing(null)} id="all-markets-tab" active={filterValue === null} color={ColorData[pathChanged].secondaryColor}>
                        All Markets
                    </HeaderTabBtn>
                    <HeaderTabBtn onClick={()=>loanListing(ETH)} id="eth markets" active={filterValue === ETH} color={ColorData[pathChanged].secondaryColor}>
                        Eth Markets                        
                    </HeaderTabBtn>
                    <HeaderTabBtn onClick={()=>loanListing(JNT)} id="jnt markets" active={filterValue === JNT} color={ColorData[pathChanged].secondaryColor}>
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


const mapStateToProps = (state) => {
    return {
        pathChanged: state.changePath
    };
};
  
const mapDispatchToProps = (dispatch) => {
    return {
        fetchData: (data) => dispatch(loansFetchData(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderTabs);