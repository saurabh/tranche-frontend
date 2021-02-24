import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { PagesData, txMessage, StakingAddress, LPTokenAddress, SLICEAddress } from 'config';
import {
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
  setTokenBalances,
  setTokenBalance
} from 'redux/actions/ethereum';
import {
  StakingSetup,
  SLICESetup,
  ERC20Setup,
  roundNumber,
  readyToTransact,
  isGreaterThan,
  isEqualTo
} from 'utils';
import { initOnboard } from 'services/blocknative';
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
  summaryModal,
  ethereum: { tokenBalance, wallet, web3, address, notify },
  form,
  setTokenBalance,
  isLPToken,
  hasAllowance,
  setHasAllowance
}) => {
  const [isDesktop, setDesktop] = useState(window.innerWidth > 992);
  const updateMedia = () => {
    setDesktop(window.innerWidth > 992);
  };
  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  });
  // const [modalIsOpen, setIsOpen] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const toWei = web3.utils.toWei;

  const onboard = initOnboard({
    address: setAddress,
    network: setNetwork,
    balance: setBalance,
    wallet: setWalletAndWeb3
  });

  const stakingAllowanceCheck = async (amount, isLPToken) => {
    try {
      amount = toWei(amount);
      const token = isLPToken ? ERC20Setup(web3, StakingAddress) : SLICESetup(web3);
      let userAllowance = await token.methods.allowance(address, StakingAddress).call();
      if (isGreaterThan(userAllowance, amount) || isEqualTo(userAllowance, amount)) {
        setHasAllowance(true);
      } else {
        setHasAllowance(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const stakingApproveContract = async (amount, isLPToken) => {
    try {
      amount = toWei(amount);
      const token = isLPToken ? ERC20Setup(web3, LPTokenAddress) : SLICESetup(web3);
      await token.methods
        .approve(StakingAddress, amount)
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

  const addStake = async (isLPToken) => {
    try {
      const StakingContract = StakingSetup(web3);
      let { amount } = form.stake.values;
      amount = toWei(amount);
      let tokenAddress = isLPToken ? LPTokenAddress : SLICEAddress;
      await StakingContract.methods
        .deposit(tokenAddress, amount)
        .send({ from: address })
        .on('transactionHash', (hash) => {
          const { emitter } = notify.hash(hash);
          emitter.on('txPool', (transaction) => {
            return {
              message: txMessage(transaction.hash)
            };
          });
          emitter.on('txCancel', () => setApproveLoading(false));
          emitter.on('txFailed', () => setApproveLoading(false));
        });
    } catch (error) {
      console.error(error);
    }
  };

  const withdrawStake = async (isLPToken) => {
    try {
      const StakingContract = StakingSetup(web3);
      let { amount } = form.stake.values;
      amount = toWei(amount);
      let tokenAddress = isLPToken ? LPTokenAddress : SLICEAddress;
      await StakingContract.methods
        .withdraw(tokenAddress, amount)
        .send({ from: address })
        .on('transactionHash', (hash) => {
          const { emitter } = notify.hash(hash);
          emitter.on('txPool', (transaction) => {
            return {
              message: txMessage(transaction.hash)
            };
          });
          emitter.on('txCancel', () => setApproveLoading(false));
          emitter.on('txFailed', () => setApproveLoading(false));
        });
    } catch (error) {
      console.error(error);
    }
  };

  const adjustStake = (e, isLPToken) => {
    try {
      e.preventDefault();
      modalType ? addStake(isLPToken) : withdrawStake(isLPToken);
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

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
                  : type === 'stake'
                  ? `${roundNumber(value)}`
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
              {path === 'stake' && title !== 'SLICE Rewards Collected' && (
                <SummaryCardCounter>
                  <SummaryCardBtn onClick={() => openModal(true)}>+</SummaryCardBtn>
                  <SummaryCardBtn onClick={() => openModal(false)}>-</SummaryCardBtn>
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
          hasAllowance={hasAllowance}
          approveLoading={approveLoading}
          isLPToken={isLPToken}
          tokenBalance={tokenBalance}
          // Functions
          closeModal={() => closeModal()}
          stakingAllowanceCheck={stakingAllowanceCheck}
          stakingApproveContract={stakingApproveContract}
          adjustStake={adjustStake}
        />
      )}
    </div>
  );
};
SummaryCard.propTypes = {
  ethereum: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  setAddress: PropTypes.func.isRequired,
  setNetwork: PropTypes.func.isRequired,
  setBalance: PropTypes.func.isRequired,
  setWalletAndWeb3: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  ethereum: state.ethereum,
  form: state.form
});

export default connect(mapStateToProps, {
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
  setTokenBalance
})(SummaryCard);
