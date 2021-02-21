import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { PagesData } from 'config/constants';
import {
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
  setTokenBalances
} from 'redux/actions/ethereum';
import { roundNumber, readyToTransact } from 'utils/helperFunctions';
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
  ethereum: { tokenBalance, wallet }
}) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState(true);

  const onboard = initOnboard({
    address: setAddress,
    network: setNetwork,
    balance: setBalance,
    wallet: setWalletAndWeb3
  });

  const openModal = async (type) => {
    const ready = await readyToTransact(wallet, onboard);
    if (!ready) return;
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
            <div></div>
          </SummaryCardValue>

          <SummaryCardDetails>
            {type === 'loan' && path !== 'staking'
              ? value.total + ' Loan Positions'
              : type === 'collateral' && path !== 'staking'
              ? `${roundNumber(value.coin1)} ETH`
              : details}
          </SummaryCardDetails>

          {path === 'staking' && (
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

SummaryCard.propTypes = {
  ethereum: PropTypes.object.isRequired,
  setAddress: PropTypes.func.isRequired,
  setNetwork: PropTypes.func.isRequired,
  setBalance: PropTypes.func.isRequired,
  setWalletAndWeb3: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  ethereum: state.ethereum
});

export default connect(mapStateToProps, {
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
  setTokenBalances
})(SummaryCard);
