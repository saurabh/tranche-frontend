import React, { useState } from 'react';
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

const SummaryCard = ({ title, value, type, details, path }) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState(true);

  const openModal = async (type) => {
    setIsOpen(true);
    setModalType(type);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalType(true);
  };

  return (
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
              <div>

              </div>
          </SummaryCardValue>

          <SummaryCardDetails>
            {type === 'loan' && path !== "staking"
              ? value.total + ' Loan Positions'
              : type === 'collateral' && path !== "staking"
              ? `${roundNumber(value.coin1)} ETH`
              : details}
          </SummaryCardDetails>
          
        { path === "staking" &&
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
      ): 
      <SummaryCardContainer loading>
        <div>
        </div>
        <div>
        </div>
        <div>
        </div>
      </SummaryCardContainer>
    }
    <StakingModal
      // State Values
      path={path}
      modalIsOpen={modalIsOpen}
      modalType={modalType}
      // Functions
      closeModal={() => closeModal()}
    />
    </SummaryCardWrapper>
  );
};

export default SummaryCard;
