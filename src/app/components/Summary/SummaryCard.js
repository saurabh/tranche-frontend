import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { PagesData } from 'config/constants';
import { roundNumber } from 'utils/helperFunctions';
import {
  SummaryCardWrapper,
  SummaryCardContainer,
  SummaryCardTitle,
  SummaryCardValue,
  SummaryCardDetails,
  SummaryCardCounter,
  SummaryCardBtn
} from './styles/SummaryComponents';
import StakingModal from '../Modals/StakingModal';

const SummaryCard = ({
  title,
  value,
  type,
  details,
  path,
  openModal,
  closeModal,
  modalIsOpen,
  modalType,
  summaryModal
}) => {
  const [isDesktop, setDesktop] = useState(window.innerWidth > 992);
  const updateMedia = () => {
    setDesktop(window.innerWidth > 992);
  };
  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });
  return (
    <div>
    { isDesktop ?
    <SummaryCardWrapper color={PagesData[path].cardColor}>
      {value ? (
        <SummaryCardContainer>
          <SummaryCardTitle>{title}</SummaryCardTitle>
          
          <SummaryCardValue>
            {type === 'loan'
              ? `$${roundNumber(value.amount)}`
              : type === 'collateral'
              ? `$${Math.round(value.amount)}`
              : type === 'ratio'
              ? `${roundNumber(value.total, 1)}%`
              : ''}
            <div></div>
          </SummaryCardValue>

          <SummaryCardDetails>
            {type === 'loan' && path !== 'stake'
              ? value.total + ' Loan Positions'
              : type === 'collateral' && path !== 'stake'
              ? `${roundNumber(value.coin1)} ETH`
              : details}
          </SummaryCardDetails>
        { path === "stake" && title !== "SLICE Rewards Collected" &&
          <SummaryCardCounter>
            <SummaryCardBtn
                onClick={() => openModal(true)}
            >+</SummaryCardBtn>
            <SummaryCardBtn
                onClick={() => openModal(false)}
            >-</SummaryCardBtn>
          </SummaryCardCounter>
        }
          
        </SummaryCardContainer>

      ) : (
        <SummaryCardContainer loading>
          <div></div>
          <div></div>
          <div></div>
        </SummaryCardContainer>
      )}

    </SummaryCardWrapper> :
      <StakingModal
        // State Values
        path={path}
        modalIsOpen={modalIsOpen}
        modalType={modalType}
        summaryModal={summaryModal}
        // Functions
        closeModal={() => closeModal()}
        openModal={(bool) => openModal(bool)}
      />
    }
    </div>
      
  );
    
};


const mapStateToProps = (state) => ({
  ethereum: state.ethereum
});

export default connect(mapStateToProps)(SummaryCard);