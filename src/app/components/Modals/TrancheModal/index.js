import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import Modal from 'react-modal';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { trancheMarketsToggle } from 'redux/actions/tableData';
import { SLICEAddress } from 'config/constants';
import { roundNumber, safeMultiply, toBigNumber } from 'utils';
import { fromWei, buyTrancheTokens, sellTrancheTokens, toBN } from 'services';
import useAnalytics from 'services/analytics';
import { TrancheRewards, TrancheEnable, TrancheConfirm, TrancheMarket } from './Components';

Modal.setAppElement('#root');

const TrancheModal = ({
  // Redux
  formValues,
  ethereum: { address, txOngoing, tokenBalance, unclaimedSIRRewards, wallet },
  data: {
    txModalIsOpen,
    txModalType,
    txModalStatus,
    txOngoingData,
    txLoading,
    txLink,
    exchangeRates = {},
    txModalData: {
      name,
      contractAddress,
      trancheId,
      trancheCard,
      trancheType,
      apyStatus,
      cryptoType,
      trancheToken,
      dividendType,
      apy,
      protocolAPY,
      sliceAPY,
      netAPY,
      isDeposit,
      isDepositApproved,
      isWithdrawApproved,
      buyerCoinAddress,
      trancheTokenAddress
    }
  },
  // Props
  theme,
  // Functions
  trancheMarketsToggle,
  closeModal
  // API Values,
}) => {
  const [totalSliceBalance, setTotalSliceBalance] = useState(0);
  const [unclaimedSlice, setUnclaimedSlice] = useState(0);
  const [totalSlice, setTotalSlice] = useState(0);
  const [totalSliceInUSD, setTotalSliceInUSD] = useState(0);
  const Tracker = useAnalytics('ButtonClicks');

  useEffect(() => {
    setTotalSliceBalance(fromWei(tokenBalance[SLICEAddress]));
  }, [tokenBalance]);
  useEffect(() => {
    setUnclaimedSlice(fromWei(toBN(toBigNumber(+unclaimedSIRRewards || 0))));
  }, [unclaimedSIRRewards]);

  useEffect(() => {
    setTotalSliceInUSD(roundNumber(safeMultiply(+totalSliceBalance + +unclaimedSlice, exchangeRates.SLICE)));
    setTotalSlice(roundNumber(+totalSliceBalance + +unclaimedSlice));
  }, [exchangeRates.SLICE, totalSliceBalance, unclaimedSlice]);

  const trancheMarketsToggling = () => {
    trancheMarketsToggle('aavePolygon');
    closeModal();
  };

  const handleSubmit = () => {
    try {
      isDeposit
        ? buyTrancheTokens(contractAddress, trancheId, trancheType, cryptoType)
        : sellTrancheTokens(contractAddress, trancheId, trancheType, trancheToken);
      isDeposit ? Tracker('Deposit', 'User address: ' + address) : Tracker('Withdraw', 'User address: ' + address);
    } catch (error) {
      console.error(error);
    }
  };

  return txModalType === 'trancheRewards'
    ? TrancheRewards({
        theme,
        totalSlice,
        totalSliceInUSD,
        totalSliceBalance,
        unclaimedSlice,
        exchangeRates,
        txModalType,
        txModalIsOpen,
        txModalStatus,
        txLoading,
        txLink,
        txOngoing,
        closeModal,
        wallet
      })
    : txModalType === 'trancheEnable'
    ? TrancheEnable({
        theme,
        closeModal,
        txModalIsOpen,
        txModalStatus,
        trancheCard,
        txOngoingData,
        txLoading,
        txLink,
        name,
        contractAddress,
        apyStatus,
        trancheToken,
        dividendType,
        apy,
        protocolAPY,
        sliceAPY,
        netAPY,
        isDeposit,
        isDepositApproved,
        isWithdrawApproved,
        buyerCoinAddress,
        trancheTokenAddress
      })
    : txModalType === 'trancheConfirm'
    ? TrancheConfirm({
        theme,
        formValues,
        tokenBalance,
        txModalIsOpen,
        txModalStatus,
        trancheCard,
        txOngoingData,
        txLoading,
        txLink,
        name,
        apyStatus,
        cryptoType,
        trancheToken,
        dividendType,
        apy,
        protocolAPY,
        sliceAPY,
        netAPY,
        isDeposit,
        buyerCoinAddress,
        trancheTokenAddress,
        // Functions
        closeModal,
        handleSubmit
      })
    : txModalType === 'trancheMarkets'
    ? TrancheMarket({ theme, txModalIsOpen, closeModal, trancheMarketsToggling })
    : '';
};

const mapStateToProps = (state) => ({
  theme: state.theme,
  ethereum: state.ethereum,
  formValues: getFormValues('tranche')(state),
  data: state.data
});

export default connect(mapStateToProps, { trancheMarketsToggle })(TrancheModal);
