import React, { useState } from 'react';
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
  ethereum: { tokenBalance, wallet, web3, address, notify },
  form,
  setTokenBalance
}) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isLPToken, setIsLPToken] = useState(false);
  const [modalType, setModalType] = useState(true);
  const [hasAllowance, setHasAllowance] = useState(false);
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

  const openModal = async (type) => {
    const ready = await readyToTransact(wallet, onboard);
    if (!ready) return;
    address = !address ? onboard.getState().address : address;
    setIsOpen(true);
    let isLP = title.split(' ').includes('LP');
    isLP ? setIsLPToken(true) : setIsLPToken(false);
    setTokenBalance(SLICEAddress, address)
    setTokenBalance(LPTokenAddress, address)
    setModalType(type);
    type ? setHasAllowance(false) : setHasAllowance(true);
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
            <div></div>
          </SummaryCardValue>

          <SummaryCardDetails>
            {type === 'loan' && path !== 'staking'
              ? value.total + ' Loan Positions'
              : type === 'collateral' && path !== 'staking'
              ? `${roundNumber(value.coin1)} ETH`
              : details}
          </SummaryCardDetails>
          
        { path === "staking" && title !== "SLICE Rewards Collected" &&
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
      <StakingModal
        // State Values
        path={path}
        modalIsOpen={modalIsOpen}
        modalType={modalType}
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
    </SummaryCardWrapper>
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
