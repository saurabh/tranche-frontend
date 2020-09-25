import React from "react";
import {
    HeaderTabsWrapper,
    MarketsTabsContainer,
    HeaderTabBtn
} from './HeaderComponents';
const HeaderTabs = () => {
    return (
        <div className="container content-container">
            <HeaderTabsWrapper>
                <MarketsTabsContainer>
                    
                    <HeaderTabBtn id="all-markets-tab" className="active-tab-btn">
                        All Markets
                    </HeaderTabBtn>
                    <HeaderTabBtn id="eth markets">
                        Eth Markets                        
                    </HeaderTabBtn>
                    <HeaderTabBtn id="jnt markets">
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


export default HeaderTabs;