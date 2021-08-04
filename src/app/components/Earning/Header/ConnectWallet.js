import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import TrancheModal from '../../Modals/TrancheModal';
import { setTxModalOpen, setTxModalType, setTxModalStatus, setTxModalLoading } from 'redux/actions/tableData';
import { setAddress, setNetwork, setBalance, setWalletAndWeb3 } from 'redux/actions/ethereum';
import { initOnboard } from 'services/blocknative';
import { addrShortener, roundNumber, toBigNumber } from 'utils/helperFunctions';
import { WalletBtn, WalletBtnIcon, WalletBtnText, NavBarRightWrapper } from './styles/HeaderComponents';
import { ModeThemes, PagesData, SLICEAddress } from 'config/constants';
import Wallet from 'assets/images/svg/wallet.svg';
import i18n from '../../locale/i18n';
import { TrancheStake } from 'assets';
import { fromWei, toBN } from 'services';

const ConnectWallet = ({
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
  theme,
  ethereum: { address, balance, tokenBalance, unclaimedSIRRewards },
  setTxModalOpen,
  setTxModalStatus,
  setTxModalLoading,
  setTxModalType
}) => {
  const [totalSliceBalance, setTotalSliceBalance] = useState(0);
  const [unclaimedSlice, setUnclaimedSlice] = useState(0);
  const [totalSlice, setTotalSlice] = useState(0);
  useEffect(() => {
    setTotalSliceBalance(fromWei(tokenBalance[SLICEAddress]));
  }, [tokenBalance]);
  useEffect(() => {
    setUnclaimedSlice(fromWei(toBN(toBigNumber(+unclaimedSIRRewards || 0))));
  }, [ unclaimedSIRRewards ]);
  useEffect(() => {
    setTotalSlice(roundNumber(+totalSliceBalance + +unclaimedSlice));
  }, [totalSliceBalance, unclaimedSlice]);

  const { pathname } = useLocation();
  let parsedPath = pathname.split('/');
  const [path, setPath] = useState(parsedPath[parsedPath.length - 1] || 'borrow');

  const onboard = initOnboard({
    address: setAddress,
    network: setNetwork,
    balance: setBalance,
    wallet: setWalletAndWeb3
  });

  const openModal = () => {
    setTxModalOpen(true);
    setTxModalType('trancheRewards');
  };

  useEffect(() => {
    const previouslySelectedWallet = window.localStorage.getItem('selectedWallet');

    if (previouslySelectedWallet && onboard) {
      onboard.walletSelect(previouslySelectedWallet);
    }
  }, [onboard]);

  const parsePath = useCallback(() => {
    setPath(parsedPath[parsedPath.length - 1]);
  }, [parsedPath]);
  useEffect(() => {
    parsePath();
  }, [pathname, parsePath]);

  const handleConnect = async () => {
    await onboard.walletSelect();
    await onboard.walletCheck();
  };

  const closeModal = () => {
    setTxModalOpen(false);
    setTxModalStatus('initialState');
    setTxModalLoading(false);
  };

  return (
    <NavBarRightWrapper>
      <TrancheModal closeModal={() => closeModal()} />

      <WalletBtn
        disabled={!address}
        background={ModeThemes[theme].ModalTrancheNavbarBtn}
        shadow={ModeThemes[theme].ModalTrancheNavbarBtnShadow}
        border={ModeThemes[theme].ModalTrancheNavbarBtnBorder}
        tranche
        onClick={() => openModal()}
      >
        <WalletBtnIcon tranche>
          <img src={TrancheStake} alt='tranche' />
        </WalletBtnIcon>
        <WalletBtnText tranche icon={false} color={ModeThemes[theme].ModalTrancheNavbarBtnText}>
          <h2>{address ? totalSlice : '--'}</h2>
        </WalletBtnText>
      </WalletBtn>

      {balance < 0 ? (
        <WalletBtn background='#4441CF' onClick={handleConnect} onKeyUp={handleConnect}>
          <WalletBtnIcon>
            <img src={Wallet} alt='wallet' />
          </WalletBtnIcon>
          <WalletBtnText icon={false} color={PagesData[path].color}>
            <h2>{i18n.t('connect')}</h2>
          </WalletBtnText>
        </WalletBtn>
      ) : (
        <WalletBtn background='#4441CF' onClick={handleConnect} onKeyUp={handleConnect}>
          <WalletBtnIcon>
            <img src={Wallet} alt='' />
          </WalletBtnIcon>
          <WalletBtnText color={PagesData[path].color}>
            <h2>{addrShortener(address)}</h2>
          </WalletBtnText>
        </WalletBtn>
      )}
    </NavBarRightWrapper>
  );
};

ConnectWallet.propTypes = {
  setAddress: PropTypes.func.isRequired,
  setNetwork: PropTypes.func.isRequired,
  setBalance: PropTypes.func.isRequired,
  setWalletAndWeb3: PropTypes.func.isRequired,
  setTxModalOpen: PropTypes.func.isRequired,
  setTxModalType: PropTypes.func.isRequired,
  setTxModalStatus: PropTypes.func.isRequired,
  setTxModalLoading: PropTypes.func.isRequired,
  ethereum: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  ethereum: state.ethereum,
  theme: state.theme
});

export default connect(mapStateToProps, {
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
  setTxModalOpen,
  setTxModalType,
  setTxModalStatus,
  setTxModalLoading
})(ConnectWallet);
