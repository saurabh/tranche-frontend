import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fromWei, epochTimeRemaining } from 'services/contractMethods';
import { StakingAddresses } from 'config';
import { roundNumber, safeAdd } from 'utils';
import {
  SummaryCardWrapper,
  SummaryCardContainer,
  SummaryCardTitle,
  SummaryCardValue,
  SummaryCardDetails,
  SummaryCardCounter,
  SummaryClaimBtn,
  SummaryCardBtn
} from './styles/SummaryComponents';
import StakingModal from '../../Modals/StakingModal';

const SummaryCard = ({
  title,
  tokenAddress,
  lpList,
  value,
  type,
  details,
  openModal,
  closeModal,
  modalIsOpen,
  modalType,
  summaryModal,
  adjustStake,
  approveLoading,
  stakingApproveContract,
  ethereum: { web3, address, tokenBalance, notify },
  summaryData: { totalAccruedRewards },
  hasAllowance,
  setHasAllowance,
  color
}) => {
  // const [isDesktop, setDesktop] = useState(window.innerWidth > 992);
  const [isLPToken, setLPToken] = useState(false);
  const [balance, setBalance] = useState(0);
  const [epochTimeLeft, setEpochTimeLeft] = useState(0);
  const setBalanceCB = useCallback((balance) => {
    setBalance(roundNumber(balance, undefined, 'down'));
  }, []);

  // const updateMedia = () => {
  //   setDesktop(window.innerWidth > 992);
  // };
  // useEffect(() => {
  //   window.addEventListener('resize', updateMedia);
  //   return () => window.removeEventListener('resize', updateMedia);
  // });

  useEffect(() => {
    const setEpochTime = async () => {
      if (type === 'reward') {
        const result = await epochTimeRemaining(StakingAddresses[StakingAddresses.length - 1]);
        setEpochTimeLeft(result);
      }
    };

    setEpochTime();
  }, [type]);

  useEffect(() => {
    type === 'lp' ? setLPToken(true) : setLPToken(false);
  }, [type]);

  useEffect(() => {
    const setBalance = async () => {
      if (tokenBalance) {
        if (type === 'slice' && tokenAddress) setBalanceCB(fromWei(tokenBalance[tokenAddress]));
        if (type === 'lp' && lpList) {
          let lpBalance = 0;
          lpList.forEach((lp) => {
            if (tokenBalance[lp.address]) {
              lpBalance = safeAdd(lpBalance, fromWei(tokenBalance[lp.address]));
            }
          });
          setBalanceCB(lpBalance);
        }
      }
    };

    setBalance();
  }, [type, tokenBalance, tokenAddress, lpList, setBalanceCB]);

  return (
    <div>
      <SummaryCardWrapper color={color}>
        {value || value === 0 ? (
          <SummaryCardContainer>
            <SummaryCardTitle>{title}</SummaryCardTitle>

            <SummaryCardValue>
              {type === 'slice' || type === 'lp'
                ? `${roundNumber(value, 2)}`
                : type === 'reward' && roundNumber(totalAccruedRewards, 2) !== 'NaN'
                ? `${roundNumber(totalAccruedRewards, 2)}`
                : '0.00'}
              <div></div>
            </SummaryCardValue>
            <SummaryCardDetails>
              {type === 'slice'
                ? balance + ' SLICE Available'
                : type === 'lp'
                ? balance + ' SLICE-LP Available'
                : epochTimeLeft + ' Until Next Distribution'}
            </SummaryCardDetails>
            {type !== 'reward' && (
              <SummaryCardCounter>
                <SummaryCardBtn onClick={() => openModal(true)}>+</SummaryCardBtn>
                <SummaryCardBtn onClick={() => openModal(false)}>-</SummaryCardBtn>
              </SummaryCardCounter>
            )}
            {type === 'reward' && (
              <SummaryClaimBtn claim>
                <button onClick={() => openModal()}>Claim</button>
              </SummaryClaimBtn>
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
          modalIsOpen={modalIsOpen}
          modalType={modalType}
          summaryModal={summaryModal}
          tokenAddress={tokenAddress}
          noBalance={Number(balance) === 0}
          // Functions
          closeModal={() => closeModal()}
          openModal={(bool) => openModal(bool)}
          hasAllowance={hasAllowance}
          setHasAllowance={setHasAllowance}
          approveLoading={approveLoading}
          isLPToken={isLPToken}
          // Functions
          stakingApproveContract={stakingApproveContract}
          adjustStake={adjustStake}
          type={type}
        />
      </SummaryCardWrapper>
    </div>
  );
};

SummaryCard.propTypes = {
  ethereum: PropTypes.object.isRequired,
  summaryData: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  ethereum: state.ethereum,
  summaryData: state.summaryData
});

export default connect(mapStateToProps, {})(SummaryCard);
