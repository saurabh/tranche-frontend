import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { roundNumber } from 'utils';
import {
  SummaryCardWrapper,
  SummaryCardContainer,
  SummaryCardTitle,
  SummaryCardValue,
  SummaryCardDetails,
  SummaryCardCounter,
  SummaryClaimBtn,
  SummaryCardBtn,
  StakeCardBtn,
  StakeCardText,
  SummaryCardWrapperContent
} from './styles/SummaryComponents';
import i18n from '../../locale/i18n';
import { TooltipWrapper } from 'app/components/Stake/Table/styles/TableComponents';
import { InfoWhite } from 'assets';
import { ModeThemes } from 'config';

const SummaryCard = ({
  title,
  value,
  type,
  path,
  openModal,
  color,
  stakeCard,
  theme
}) => {
  const [TooltipToggle, setTooltipToggle] = useState("");

  const tooltipToggle = (val) => {
    setTooltipToggle(val);
  }

  const Card = () =>{
    return (
      <SummaryCardWrapperContent>
          <SummaryCardWrapper color={color}>
            {value || value === 0 ? (
              <SummaryCardContainer>
                <SummaryCardTitle>
                  {title}
                  {
                    title === i18n.t('tranche.summary.valueLocked.title') &&
                    <div>
                      <img src={InfoWhite} alt="info" onMouseOver={() => tooltipToggle("valueLocked")} onMouseLeave={() => tooltipToggle("")}/>
                      <TooltipWrapper tooltip={TooltipToggle === "valueLocked"} summary color={ModeThemes[theme].Tooltip}> 
                        <div>
                            <h2>
                              The total amount of staked or deposited assets in USD on the Tranche Protocol.
                            </h2>
                        </div>
                      </TooltipWrapper>
                    </div>
                    
                  }
                  
                </SummaryCardTitle>
  
                <SummaryCardValue>
                  {'$' + roundNumber(value)}
                  <div></div>
                </SummaryCardValue>
                <SummaryCardDetails>
                </SummaryCardDetails>
                {path === 'stake' && type !== 'reward' && (
                  <SummaryCardCounter>
                    <SummaryCardBtn onClick={() => openModal(true)}>+</SummaryCardBtn>
                    <SummaryCardBtn onClick={() => openModal(false)}>-</SummaryCardBtn>
                  </SummaryCardCounter>
                )}
                {path === 'stake' && type === 'reward' && (
                  <SummaryClaimBtn claim>
                    <button onClick={() => openModal()}>Claim</button>
                  </SummaryClaimBtn>
                )}
              </SummaryCardContainer>
            ) : (
              <SummaryCardContainer loading='true'>
                <div></div>
                <div></div>
                <div></div>
              </SummaryCardContainer>
            )}
          </SummaryCardWrapper>
      </SummaryCardWrapperContent>
    );
  }
  const StakeCard = () =>{
    return (
      <SummaryCardWrapperContent stakeCard={stakeCard}>
          <SummaryCardWrapper color={color}>
            {value || value === 0 ? (
              <SummaryCardContainer stakeCard>
                <StakeCardText>
                  <h2>{i18n.t('tranche.summary.stakeLive.title')}</h2>
                  <h2>{i18n.t('tranche.summary.stakeLive.details')}</h2>
                </StakeCardText>
                <StakeCardBtn>
                  <button><a href="/stake">STAKE</a></button>
                </StakeCardBtn>
              </SummaryCardContainer>
            ) : (
              <SummaryCardContainer loading='true'>
                <div></div>
                <div></div>
                <div></div>
              </SummaryCardContainer>
            )}
          </SummaryCardWrapper>      
      </SummaryCardWrapperContent>
    );
  }
  return stakeCard ? StakeCard() : Card();
};

SummaryCard.propTypes = {
  ethereum: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  ethereum: state.ethereum,
  theme: state.theme
});

export default connect(mapStateToProps, {})(SummaryCard);
