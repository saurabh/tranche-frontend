import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { setAddress, setNetwork, setBalance, setWalletAndWeb3 } from 'redux/actions/ethereum';
import { initOnboard } from 'services/blocknative';
import { addrShortener } from 'utils/helperFunctions';
import { WalletBtn, WalletBtnIcon, WalletBtnText, NavBarRightWrapper, LocaleWrapper } from './styles/HeaderComponents';
import { PagesData } from 'config/constants';
import { ChevronDown } from "assets";
import Wallet from "assets/images/svg/wallet.svg";
import { useOuterClick } from 'services/useOuterClick';
import i18n from '../../locale/i18n';

const ConnectWallet = ({
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
  ethereum: { address, balance }
}) => {
  const { pathname } = useLocation();
  let parsedPath = pathname.split('/');
  const [path, setPath] = useState(parsedPath[parsedPath.length - 1] || 'borrow');
  const [localeToggle, setLocaleToggle] = useState(false);
  const innerRef = useOuterClick(e => {
    setLocaleToggle(false);
  });

  const onboard = initOnboard({
    address: setAddress,
    network: setNetwork,
    balance: setBalance,
    wallet: setWalletAndWeb3
  });

  useEffect(() => {
    const previouslySelectedWallet = window.localStorage.getItem('selectedWallet');

    if (previouslySelectedWallet && onboard) {
      onboard.walletSelect(previouslySelectedWallet);
    }
  }, [onboard]);

  const parsePath = useCallback(() =>{
    setPath(parsedPath[parsedPath.length - 1]);
  }, [parsedPath]);
  useEffect(() => {
    parsePath();
  }, [pathname, parsePath]);

  const handleConnect = async () => {
    try {
      await onboard.walletSelect();
      await onboard.walletCheck();
    } catch (error) {
      console.error(error);
    }
  };
  
  const pathWindow =  window.location.pathname;
  let parsedPathWindow = pathWindow.split('/');
  let currentPath = parsedPathWindow[parsedPathWindow.length - 1];
  const newPath = (lng) =>{
    return `${"/" + lng + "/" + currentPath}`;
  }
  return (
    <NavBarRightWrapper>
      <LocaleWrapper color="rgb(68,65,207)" ref={innerRef}>
        <h2 onClick={() => setLocaleToggle(!localeToggle)}>{i18n.language}<img src={ChevronDown} alt="chevron"/> </h2>
        { localeToggle ?
          <div>
            <a href={newPath("en")}>en</a>
            <a href={newPath("zh")}>ZH</a>
            <a href={newPath("kr")}>KR</a>
          </div> : ""
        }
       
      </LocaleWrapper>
      {balance < 0 ? (
        <WalletBtn
          background="#4441CF"
          onClick={handleConnect}
          onKeyUp={handleConnect}
        >
           <WalletBtnIcon>
            <img src={Wallet} alt='wallet' />
          </WalletBtnIcon>
          <WalletBtnText icon={false} color={PagesData[path].color}>
            <h2>{i18n.t('connect')}</h2>
          </WalletBtnText>
        </WalletBtn>
      ) : (
        <WalletBtn
          background="#4441CF"
          onClick={handleConnect}
          onKeyUp={handleConnect}
        >
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
  ethereum: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  ethereum: state.ethereum
});

export default connect(mapStateToProps, {
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3
})(ConnectWallet);
