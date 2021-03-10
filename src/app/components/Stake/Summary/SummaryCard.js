import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addStake, withdrawStake, massHarvest, getAccruedStakingRewards, fromWei } from 'services/contractMethods';
import { txMessage, StakingAddress } from 'config';
import { StakingSetup, ERC20Setup, roundNumber, isGreaterThan, isEqualTo } from 'utils';
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
  setHasAllowance,
  color
}) => {
  const [isDesktop, setDesktop] = useState(window.innerWidth > 992);
  const [isLPToken, setLPToken] = useState(false);
  const [accruedRewards, setAccruedRewards] = useState(0);
  const [approveLoading, setApproveLoading] = useState(false);
  const toWei = web3.utils.toWei;

  const updateMedia = () => {
    setDesktop(window.innerWidth > 992);
  };
  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  });

  useEffect(() => {
    const getRewards = async () => {
      if (type === 'reward' && address) {
        // const result = await getAccruedStakingRewards(address);
        // setAccruedRewards(fromWei(result))
      }
    };
    type === 'lp' ? setLPToken(true) : setLPToken(false);
    getRewards();
  }, [type, address]);

  const stakingAllowanceCheck = async (stakingAddress, tokenAddress, amount) => {
    console.log(stakingAddress)
    try {
      if (modalType && amount !== '') {
        amount = toWei(amount);
        const token = ERC20Setup(web3, tokenAddress);
        let userAllowance = await token.methods.allowance(address, stakingAddress).call();
        if (isGreaterThan(userAllowance, amount) || isEqualTo(userAllowance, amount)) {
          setHasAllowance(true);
        } else {
          setHasAllowance(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const stakingApproveContract = async (stakingAddress, tokenAddress, amount) => {
    try {
      amount = toWei(amount);
      const token = ERC20Setup(web3, tokenAddress);
      await token.methods
        .approve(stakingAddress, amount)
        .send({ from: address })
        .on('transactionHash', (hash) => {
          setApproveLoading(true);
          const { emitter } = notify.hash(hash);
          emitter.on('txPool', (transaction) => {
            return {
              message: txMessage(transaction.hash)
            };
          });
          emitter.on('txConfirmed', () => {
            setHasAllowance(true);
            setApproveLoading(false);
          });
          emitter.on('txCancel', () => setApproveLoading(false));
          emitter.on('txFailed', () => setApproveLoading(false));
        });
    } catch (error) {
      console.error(error);
    }
  };

  const adjustStake = (e, stakingAddress, tokenAddress) => {
    try {
      e.preventDefault();
      modalType ? addStake(stakingAddress, tokenAddress) : withdrawStake(stakingAddress, tokenAddress);
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {isDesktop ? (
        <SummaryCardWrapper color={color}>
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
                  : type === 'slice' || type === 'lp'
                  ? `${roundNumber(value)}`
                  : type === 'reward'
                  ? `${roundNumber(accruedRewards, 2)}`
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
                <SummaryClaimBtn claim>
                  <button onClick={() => massHarvest()}>Claim</button>
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
            path={path}
            modalIsOpen={modalIsOpen}
            modalType={modalType}
            summaryModal={summaryModal}
            tokenAddress={tokenAddress}
            // Functions
            closeModal={() => closeModal()}
            openModal={(bool) => openModal(bool)}
            hasAllowance={hasAllowance}
            approveLoading={approveLoading}
            isLPToken={isLPToken}
            // Functions
            stakingAllowanceCheck={stakingAllowanceCheck}
            stakingApproveContract={stakingApproveContract}
            adjustStake={adjustStake}
            type={type}
          />
        </SummaryCardWrapper>
      ) : (
        <StakingModal
          // State Values
          path={path}
          modalIsOpen={modalIsOpen}
          modalType={modalType}
          summaryModal={summaryModal}
          tokenAddress={tokenAddress}
          // Functions
          closeModal={() => closeModal()}
          openModal={(bool) => openModal(bool)}
          hasAllowance={hasAllowance}
          approveLoading={approveLoading}
          isLPToken={isLPToken}
          // Functions
          stakingAllowanceCheck={stakingAllowanceCheck}
          stakingApproveContract={stakingApproveContract}
          adjustStake={adjustStake}
          type={type}
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
