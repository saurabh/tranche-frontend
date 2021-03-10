import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addStake, withdrawStake, massHarvest, getAccruedStakingRewards, fromWei } from 'services/contractMethods';
import { PagesData, txMessage } from 'config';
import { ERC20Setup, roundNumber, isGreaterThan, isEqualTo } from 'utils';
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
  isLP,
  value,
  type,
  details,
  path,
  openModal,
  closeModal,
  modalIsOpen,
  modalType,
  summaryModal,
  ethereum: { web3, address, notify },
  form,
  hasAllowance,
  setHasAllowance
}) => {
  const [isDesktop, setDesktop] = useState(window.innerWidth > 992);
  const [accruedRewards, setAccruedRewards] = useState(0);
  const toWei = web3.utils.toWei;

  const updateMedia = () => {
    setDesktop(window.innerWidth > 992);
  };
  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  });

  return (
    <div>
      {isDesktop ? (
        <SummaryCardWrapper color={PagesData[path].cardColor}>
          {value || value === 0 ? (
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
              {path === 'stake' && type !== 'reward' && (
                <SummaryCardCounter>
                  <SummaryCardBtn onClick={() => openModal(true)}>+</SummaryCardBtn>
                  <SummaryCardBtn onClick={() => openModal(false)}>-</SummaryCardBtn>
                </SummaryCardCounter>
              )}
              {path === 'stake' && type === 'reward' && (
                <SummaryCardCounter>
                  <button onClick={() => massHarvest()}>Claim</button>
                </SummaryCardCounter>
              )}
            </SummaryCardContainer>
          ) : (
            <SummaryCardContainer loading>
              <div></div>
              <div></div>
              <div></div>
            </SummaryCardContainer>
          )}

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
        </SummaryCardWrapper>
      ) : (
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
      )}
    </div>
  );
};

SummaryCard.propTypes = {
  ethereum: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  ethereum: state.ethereum,
  form: state.form
});

export default connect(mapStateToProps, {})(SummaryCard);
