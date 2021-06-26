import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import { postRequest } from 'services/axios';
import useAnalytics from 'services/analytics';
import { setAddress, setNetwork, setBalance, setWalletAndWeb3, setTokenBalance } from 'redux/actions/ethereum';
import { addNotification, updateNotification, setNotificationCount } from 'redux/actions/ethereum';
import { checkServer } from 'redux/actions/checkServer';
import { addrShortener, roundNumber, readyToTransact, ERC20Setup } from 'utils';
import { statuses, ApproveBigNumber, txMessage, etherScanUrl } from 'config';
import { LinkArrow, TrancheStake } from 'assets';
import { ModeThemes, LiquidityIcons } from 'config/constants';

import { toWei, stakingAllowanceCheck, addStake, withdrawStake } from 'services/contractMethods';
import StakingModal from '../../Modals/StakingModal';

import {
  TableContentCard,
  TableContentCardWrapper,
  FifthColContent,
  StatusTextWrapper,
  // AdjustLoanBtn,
  TableCardTag,
  TableCardImg,
  TableFirstCol,
  TableFirstColWrapper,
  FirstColContent,
  FirstColTitle,
  FirstColSubtitle,
  TableSecondCol,
  SecondColContent,
  TableThirdCol,
  ThirdColContent,
  TableFourthCol,
  FourthColContent,
  TableFifthCol,
  TableSixthCol,
  // AdustBtnWrapper,
  TableContentCardWrapperMobile,
  TableContentCardMobile,
  TableSeventhCol,
  StakeBtn,
  StakeBtns,
  TableMobileContent,
  TableMobileContentRow,
  TableMobileContentCol,
  TableCardImgWrapper,
  StakeBtnSlice
  // TableMobilCardBtn
} from './styles/TableComponents';
import { initOnboard } from 'services/blocknative';
import moment  from 'moment';

const TableCard = ({
  staking: { contractAddress, reward, staked, type, poolName, apy, subscription, duration, durationIndex },
  setTokenBalance,
  ethereum: { tokenBalance, address, wallet, web3, notify, notificationCount },
  addNotification,
  updateNotification,
  setNotificationCount,
  summaryData: { slice, lp, lpList },
  theme,
  isDesktop,
  title
  // checkServer
}) => {
  const [ModalIsOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [hasAllowance, setHasAllowance] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [tokenAddress, setTokenAddress] = useState(null);
  // const [balance, setBalance] = useState(0);
  const Tracker = useAnalytics('ButtonClicks');

  const onboard = initOnboard({
    address: setAddress,
    network: setNetwork,
    balance: setBalance,
    wallet: setWalletAndWeb3
  });

  // const setBalanceCB = useCallback((balance) => {
  //   setBalance(roundNumber(balance, undefined, 'down'));
  // }, []);
  useEffect(() => {
    const setEpochTime = async () => {
        // const result = await epochTimeRemaining(StakingAddresses[StakingAddresses.length - 1]);
    };

    setEpochTime();
  }, [type]);


  const formatTime = () =>{
    let format = (val) => moment().add(duration, 'seconds').diff(moment(), val);
    let years =  format('years');
    let months =  format('months');
    let weeks =  format('weeks');
    let days =  format('days');
    let hours =  format('hours');
    let minutes =  format('minutes');

    return years !== 0 ? years + ' years' : months !== 0 ? months + ' months' : weeks !== 0 ? weeks + ' weeks' : days !== 0 ? days + ' days' : hours !== 0 ? hours + ' hours' : minutes !== 0 ? minutes + ' minutes' : ""
  }

  // useEffect(() => {
  //   const setBalance = async () => {
  //     if (tokenBalance) {
  //       if (type === 'SLICE' && slice.address) setBalanceCB(fromWei(tokenBalance[slice.address]));
  //       if ((type === 'SLICE/DAI LP' || type === 'SLICE/ETH LP') && lpList) {
  //         let lpBalance = 0;
  //         lpList.forEach((lp) => {
  //           if (tokenBalance[lp.address]) {
  //             lpBalance = safeAdd(lpBalance, fromWei(tokenBalance[lp.address]));
  //           }
  //         });
  //         setBalanceCB(lpBalance);
  //       }
  //     }
  //   };

  //   setBalance();
  // }, [type, slice, lp, tokenBalance, tokenAddress, lpList, setBalanceCB]);

  useEffect(() => {
    if (type === 'SLICE') {
      setTokenAddress(slice.address);
    } else if (type === 'SLICE/ETH LP') {
      setTokenAddress(lpList && lpList[0].address);
    } else if (type === 'SLICE/DAI LP') {
      setTokenAddress(lpList && lpList[1].address);
    }
  }, [type, slice, lpList, contractAddress]);

  let moreCardToggle = false;

  const searchObj = (val) => {
    return Object.fromEntries(Object.entries(statuses).filter(([key, value]) => value.status === val));
  };

  const openModal = async (type) => {
    const ready = await readyToTransact(wallet, onboard);
    if (!ready) return;
    address = !address ? onboard.getState().address : address;
    setTokenBalance(tokenAddress, address);
    if (type === 'staking' || type === 'liqStake') {
      let result = await stakingAllowanceCheck(tokenAddress, contractAddress, address);
      setHasAllowance(result);
    } else setHasAllowance(true);
    // if (type === 'staking') setDuration(duration);
    setModalType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const stakingApproveContract = async (contractAddress, tokenAddress) => {
    let id = notificationCount;
    setNotificationCount(notificationCount + 1);
    try {
      const token = ERC20Setup(web3, tokenAddress);
      addNotification({
        id,
        type: 'WAITING',
        message: 'Your transaction is waiting for you to confirm',
        title: 'awaiting confirmation'
      });
      await token.methods
        .approve(contractAddress, toWei(ApproveBigNumber))
        .send({ from: address })
        .on('transactionHash', (hash) => {
          setApproveLoading(true);
          const { emitter } = notify.hash(hash);
          emitter.on('txPool', (transaction) => {
            return {
              message: txMessage(transaction.hash)
            };
          });
          emitter.on('txCancel', () => setApproveLoading(false));
          emitter.on('txFailed', () => setApproveLoading(false));
        })
        .on('confirmation', () => {
          setHasAllowance(true);
          setApproveLoading(false);
        });
    } catch (error) {
      error.code === 4001 &&
        updateNotification({
          id,
          type: 'REJECTED',
          message: 'You rejected the transaction',
          title: 'Transaction rejected'
        });
      console.error(error);
    }
  };

  const adjustStake = (e, contractAddress, tokenAddress) => {
    try {
      e.preventDefault();
      modalType === 'liqStake' || modalType === 'staking' 
        ? addStake(contractAddress, tokenAddress, durationIndex) 
        : withdrawStake(contractAddress, tokenAddress);
      modalType === 'liqStake'
        ? Tracker('addStake', 'User address: ' + address)
        : modalType === 'staking' 
        ? Tracker('addLockup', 'User address: ' + address)
        : Tracker('withdrawStake', 'User address: ' + address);
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  const checkLoan = false;

  const TableCardDesktop = () => {
    return (
      <TableContentCardWrapper
        color={ModeThemes[theme].TableCard}
        borderColor={ModeThemes[theme].TableCardBorderColor}
        shadow={ModeThemes[theme].tableCardShadow}
        cardShadow={ModeThemes[theme].cardShadow}
      >
        <TableContentCard
          pointer={true}
          // onClick={() => cardToggle(contractAddress)}
          className={moreCardToggle ? 'table-card-toggle' : ''}
          color={ModeThemes[theme].borderColor}
        >
          {checkLoan ? (
            <TableCardTag color={checkLoan.color}>
              <img src={checkLoan.img} alt='checkLoan' />
            </TableCardTag>
          ) : (
            ''
          )}
          <TableFirstCol className='table-col'>
            <TableFirstColWrapper>
              <TableCardImg tranche={true}>
              
                <img src={TrancheStake} alt='Tranche' />
                { (title === "Liquidity Provider Pools") &&
                  <img src={LiquidityIcons[type && type]} alt='Tranche' />
                }
              </TableCardImg>
              <FirstColContent>
                <FirstColTitle color={ModeThemes[theme].tableText}>
                  {title === "SLICE Staking Pools" && duration ? <h2>{poolName && poolName}</h2> : <h2><h2>{type && type}</h2></h2>}
                </FirstColTitle>
                <FirstColSubtitle>
                  <h2>{addrShortener(contractAddress)}</h2>
                  <a href={etherScanUrl + 'address/' + contractAddress} target='_blank' rel='noopener noreferrer'>
                    <img src={LinkArrow} alt='' />
                  </a>
                </FirstColSubtitle>
              </FirstColContent>
            </TableFirstColWrapper>
          </TableFirstCol>

          <TableFifthCol className='table-col' stake stakeStatus sliceStaking={title === "SLICE Staking Pools"}>
            <FifthColContent>
              {
                title === "SLICE Staking Pools" && duration &&
                  <StatusTextWrapper
                  className='status-text-wrapper'
                  color={ModeThemes[theme].activeStatusText}
                  backgroundColor={ModeThemes[theme].activeStatus}
                  table='stake'
                  docsLockupText={ModeThemes[theme].docsLockupText}
                  docsLockupBackground={ModeThemes[theme].docsLockupBackground}
                  >
                  {/* {isActive ? i18n.t('stake.table.statuses.active') : ''} */}
                  {formatTime()}
                  </StatusTextWrapper>
              }
             {
                title === "SLICE Staking Pools" && !duration &&
                  <StatusTextWrapper
                  className='status-text-wrapper'
                  color={ModeThemes[theme].activeStatusText}
                  backgroundColor={ModeThemes[theme].activeStatus}
                  table='stake'
                  docsLockupText={ModeThemes[theme].docsLockupText}
                  docsLockupBackground={ModeThemes[theme].docsLockupBackground}
                  >
                    CLOSED
                  </StatusTextWrapper>
              }
            </FifthColContent>
          </TableFifthCol>

          <TableThirdCol className={'table-col table-fourth-col-return '} stake>
            <ThirdColContent className='content-3-col second-4-col-content' color={ModeThemes[theme].tableText}>
              <h2>{roundNumber(staked)}</h2>
              <h2>{''}</h2>
            </ThirdColContent>
          </TableThirdCol>
          <TableFourthCol tranche={true} className={'table-col table-fifth-col-subscription'} stake>
            <FourthColContent className='content-3-col second-4-col-content' color={ModeThemes[theme].tableText}>
              <h2>{roundNumber(reward)} SLICE</h2>
              <h2>{''}</h2>
            </FourthColContent>
          </TableFourthCol>

          <TableSecondCol className='table-col' stake stakeStaked>
            <SecondColContent className='content-3-col second-4-col-content' color={ModeThemes[theme].tableText}>
              <h2>{roundNumber(apy, false)}%</h2>
              <h2>{''}</h2>
            </SecondColContent>
          </TableSecondCol>

          <TableSixthCol
            onClick={(e) => e.stopPropagation()}
            className='table-sixth-col table-col'
            stake
            APYStake
            color={ModeThemes[theme].tableText}
          >
            <h2>{roundNumber(subscription)}</h2>
            <h2>{''}</h2>
          </TableSixthCol>

          { title === "SLICE Staking Pools" && duration ? 
            <TableSeventhCol onClick={(e) => e.stopPropagation()} className='table-sixth-col table-col' stake stakeCol sliceStaking={title === "SLICE Staking Pools"}>
              <StakeBtnSlice onClick={() => openModal('staking')}>
                Stake
              </StakeBtnSlice>
            </TableSeventhCol> :
            
            title === "SLICE Staking Pools" && !duration ? 
            
            <TableSeventhCol onClick={(e) => e.stopPropagation()} className='table-sixth-col table-col' stake stakeCol sliceStaking={title === "SLICE Staking Pools"}>
              <StakeBtnSlice onClick={() => openModal('staking')} withdraw>
                withdraw
              </StakeBtnSlice>
            </TableSeventhCol> 
            
            :
            <TableSeventhCol onClick={(e) => e.stopPropagation()} className='table-sixth-col table-col' stake stakeCol>
              <StakeBtn background='#6E41CF' onClick={() => openModal('liqWithdraw')}>
                -
              </StakeBtn>
              <StakeBtn background='#4441CF' onClick={() => openModal('liqStake')}>
                +
              </StakeBtn>
            </TableSeventhCol>
          }
        </TableContentCard>

        <StakingModal
          // State Values
          modalIsOpen={ModalIsOpen}
          type={type}
          modalType={modalType}
          contractAddress={contractAddress}
          tokenAddress={tokenAddress}
          title={title}
          rewards={reward}
          apy={apy}
          duration={duration}
          lockup={() => formatTime()}
          durationIndex={durationIndex}
          hasAllowance={hasAllowance}
          approveLoading={approveLoading}
          // Functions
          setHasAllowance={setHasAllowance}
          closeModal={() => closeModal()}
          stakingApproveContract={stakingApproveContract}
          adjustStake={adjustStake}
        />
      </TableContentCardWrapper>
    );
  };
  const TableCardMobile = () => {
    return (
      <TableContentCardWrapperMobile tranche color={ModeThemes[theme].TableCard} borderColor={ModeThemes[theme].TableCardBorderColor}>
        <TableContentCardMobile color={Object.values(searchObj(1))[0].background} tranche>
          <TableCardImgWrapper>
            <TableCardImg
              tranche={true}
              background={type === 'TRANCHE_A' ? '#68D2FF' : '#FF7A7F'}
              stake={title === "Liquidity Provider Pools"}
              // type={type === 'TRANCHE_A' ? 'A' : type === 'TRANCHE_B' ? 'B' : ''}
              // color={type === 'TRANCHE_A' ? '#12BB7E' : type === 'TRANCHE_B' ? '#FD8383' : ''}
            >
              <img src={TrancheStake} alt='Tranche' />
                { (title === "Liquidity Provider Pools") &&
                  <img src={LiquidityIcons[type && type]} alt='Tranche' />
                }
            </TableCardImg>
          </TableCardImgWrapper>

          <TableMobileContent>
            <TableMobileContentRow>
              <TableFirstColWrapper>
                <FirstColContent instrument>
                  <FirstColTitle color={ModeThemes[theme].tableText}>
                    <h2>{type && type}</h2>
                    { title === "SLICE Staking Pools" ? 
                      <StakeBtns>
                        <StakeBtnSlice onClick={() => openModal('staking')}>
                          Stake
                        </StakeBtnSlice>
                      </StakeBtns>
                      : 
                      <StakeBtns>
                        <StakeBtn background='#6E41CF' onClick={() => openModal('liqWithdraw')}>
                          -
                        </StakeBtn>
                        <StakeBtn background='#4441CF' onClick={() => openModal('liqStake')}>
                          +
                        </StakeBtn>
                      </StakeBtns>
                    }
                    
                  </FirstColTitle>
                  <FirstColSubtitle>
                    <h2>{addrShortener(contractAddress)}</h2>
                    <a href={etherScanUrl + 'address/' + contractAddress} target='_blank' rel='noopener noreferrer'>
                      <img src={LinkArrow} alt='' />
                    </a>
                  </FirstColSubtitle>
                </FirstColContent>
              </TableFirstColWrapper>
            </TableMobileContentRow>

            <TableMobileContentRow>
              <TableMobileContentCol color={ModeThemes[theme].tableText} stake>
                <h2>total staked</h2>
                <h2>{roundNumber(staked)}</h2>
              </TableMobileContentCol>
              <TableMobileContentCol color={ModeThemes[theme].tableText} stake>
                <h2>{ title === "SLICE Staking Pools" ? "POOL CAPACITY" : "EPOCH REWARDS"}</h2>
                <h2>{roundNumber(reward)} SLICE</h2>
              </TableMobileContentCol>
              <TableMobileContentCol color={ModeThemes[theme].tableText} stake>
                <h2>APY</h2>
                <h2>{roundNumber(apy, false)}%</h2>
              </TableMobileContentCol>
              <TableMobileContentCol color={ModeThemes[theme].tableText} stake>
                <h2>your stake</h2>
                <h2>{roundNumber(subscription)}</h2>
              </TableMobileContentCol>
            </TableMobileContentRow>
          </TableMobileContent>
        </TableContentCardMobile>
        <StakingModal
          modalIsOpen={ModalIsOpen}
          type={type}
          modalType={modalType}
          contractAddress={contractAddress}
          tokenAddress={tokenAddress}
          title={title}
          rewards={reward}
          apy={apy}
          duration={duration}
          durationIndex={durationIndex}
          hasAllowance={hasAllowance}
          approveLoading={approveLoading}
          // Functions
          setHasAllowance={setHasAllowance}
          closeModal={() => closeModal()}
          stakingApproveContract={stakingApproveContract}
          adjustStake={adjustStake}
        />
      </TableContentCardWrapperMobile>
    );
  };

  return isDesktop ? TableCardDesktop() : TableCardMobile();
};

TableCard.propTypes = {
  ethereum: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  setAddress: PropTypes.func.isRequired,
  setNetwork: PropTypes.func.isRequired,
  setBalance: PropTypes.func.isRequired,
  setWalletAndWeb3: PropTypes.func.isRequired,
  addNotification: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  ethereum: state.ethereum,
  form: state.form,
  trade: state.trade,
  theme: state.theme,
  summaryData: state.summaryData
});

export default connect(mapStateToProps, {
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
  setTokenBalance,
  addNotification,
  updateNotification,
  setNotificationCount,
  checkServer
})(TableCard);
