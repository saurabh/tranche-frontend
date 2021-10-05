import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import { postRequest } from 'services/axios';
import {
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
  setTokenBalance,
  addNotification,
  setNotificationCount
} from 'redux/actions/ethereum';
import { checkServer } from 'redux/actions/checkServer';
import { addrShortener, roundNumber, readyToTransact, formatTime } from 'utils';
import { statuses, ModeThemes, LiquidityIcons, etherScanUrl } from 'config';
import { LinkArrow, TrancheStake } from 'assets';
// import { stakingApproveContract } from 'services/contractMethods';
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

const TableCard = ({
  staking: { contractAddress, staked, reward, type, poolName, apy, subscription, duration, durationIndex, remainingCap },
  setTokenBalance,
  ethereum: { address, wallet },
  summaryData: { slice, lpList },
  theme,
  isDesktop,
  title
  // checkServer
}) => {
  const [ModalIsOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [tokenAddress, setTokenAddress] = useState(null);

  const onboard = initOnboard({
    address: setAddress,
    network: setNetwork,
    balance: setBalance,
    wallet: setWalletAndWeb3
  });

  useEffect(() => {
    const setEpochTime = async () => {
      // const result = await epochTimeRemaining(StakingAddresses[StakingAddresses.length - 1]);
    };

    setEpochTime();
  }, [type]);

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
    setModalType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
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
                {title === 'Liquidity Provider Pools' && <img src={LiquidityIcons[type && type]} alt='Tranche' />}
              </TableCardImg>
              <FirstColContent>
                <FirstColTitle color={ModeThemes[theme].tableText}>
                  {title === 'SLICE Staking Pools' && duration ? <h2>{poolName && poolName}</h2> : <h2>{type && type}</h2>}
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

          <TableFifthCol className='table-col' stake stakeStatus sliceStaking={title === 'SLICE Staking Pools'}>
            <FifthColContent>
              {title === 'SLICE Staking Pools' && duration && (
                <StatusTextWrapper
                  className='status-text-wrapper'
                  color={ModeThemes[theme].activeStatusText}
                  backgroundColor={ModeThemes[theme].activeStatus}
                  table='stake'
                  docsLockupText={ModeThemes[theme].docsLockupText}
                  docsLockupBackground={ModeThemes[theme].docsLockupBackground}
                >
                  {/* {isActive ? i18n.t('stake.table.statuses.active') : ''} */}
                  {formatTime(duration)}
                </StatusTextWrapper>
              )}
              {title === 'SLICE Staking Pools' && !duration && (
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
              )}
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
              {title === 'SLICE Staking Pools' && duration && <h2>{roundNumber(remainingCap)} SLICE</h2>}
              {title === 'SLICE Staking Pools' && !duration && <h2>N/A</h2>}
              {title === 'Liquidity Provider Pools' && <h2>{roundNumber(reward)}</h2>}
              <h2>{''}</h2>
            </FourthColContent>
          </TableFourthCol>

          <TableSecondCol className='table-col' stake stakeStaked>
            <SecondColContent className='content-3-col second-4-col-content' color={ModeThemes[theme].tableText}>
              <h2>{roundNumber(apy, 2)}%</h2>
              <h2>{''}</h2>
            </SecondColContent>
          </TableSecondCol>

          <TableSixthCol
            onClick={(e) => e.stopPropagation()}
            className='table-sixth-col table-col'
            stake
            StakeBtnsProvider
            color={ModeThemes[theme].tableText}
          >
            <h2>{roundNumber(subscription)}</h2>
            <h2>{''}</h2>
          </TableSixthCol>

          {title === 'SLICE Staking Pools' && duration ? (
            <TableSeventhCol
              onClick={(e) => e.stopPropagation()}
              className='table-sixth-col table-col'
              stake
              stakeCol
              sliceStaking={title === 'SLICE Staking Pools'}
            >
              <StakeBtnSlice onClick={() => openModal('staking')} disabled={remainingCap <= 0} disabledBtnColor={ModeThemes[theme].disabledBtnColor}>
                {remainingCap === 0 ? 'Capped' : 'Stake'}
              </StakeBtnSlice>
            </TableSeventhCol>
          ) : title === 'SLICE Staking Pools' && !duration ? (
            <TableSeventhCol
              onClick={(e) => e.stopPropagation()}
              className='table-sixth-col table-col'
              stake
              stakeCol
              sliceStaking={title === 'SLICE Staking Pools'}
            >
              <StakeBtnSlice
                onClick={() => openModal('withdrawTokens')}
                withdraw
                disabled={true}
                disabledBtnColor={ModeThemes[theme].disabledBtnColor}
              >
                disabled
              </StakeBtnSlice>
            </TableSeventhCol>
          ) : (
            <TableSeventhCol onClick={(e) => e.stopPropagation()} className='table-sixth-col table-col' stake stakeCol stakeColProvider>
              <StakeBtn background='#6E41CF' onClick={() => openModal('liqWithdraw')} disabled={false}>
                -
              </StakeBtn>
              <StakeBtn background='#4441CF' onClick={() => openModal('liqStake')} disabled={false}>
                +
              </StakeBtn>
            </TableSeventhCol>
          )}
        </TableContentCard>

        <StakingModal
          // State Values
          modalIsOpen={ModalIsOpen}
          type={type}
          modalType={modalType}
          contractAddress={contractAddress}
          tokenAddress={tokenAddress}
          title={title}
          reward={reward}
          remainingCap={remainingCap}
          apy={apy}
          duration={duration}
          durationIndex={durationIndex}
          // Functions
          closeModal={() => closeModal()}
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
              stake={title === 'Liquidity Provider Pools'}
              // type={type === 'TRANCHE_A' ? 'A' : type === 'TRANCHE_B' ? 'B' : ''}
              // color={type === 'TRANCHE_A' ? '#12BB7E' : type === 'TRANCHE_B' ? '#FD8383' : ''}
            >
              <img src={TrancheStake} alt='Tranche' />
              {title === 'Liquidity Provider Pools' && <img src={LiquidityIcons[type && type]} alt='Tranche' />}
            </TableCardImg>
          </TableCardImgWrapper>

          <TableMobileContent>
            <TableMobileContentRow>
              <TableFirstColWrapper>
                <FirstColContent instrument>
                  <FirstColTitle color={ModeThemes[theme].tableText}>
                    <h2>{title === 'SLICE Staking Pools' && duration ? poolName && poolName : type && type}</h2>
                    {title === 'SLICE Staking Pools' && duration ? (
                      <StakeBtns>
                        <StakeBtnSlice
                          onClick={() => openModal('staking')}
                          disabled={remainingCap === 0}
                          disabledBtnColor={ModeThemes[theme].disabledBtnColor}
                        >
                          {remainingCap === 0 ? 'Capped' : 'Stake'}
                        </StakeBtnSlice>
                      </StakeBtns>
                    ) : title === 'SLICE Staking Pools' && !duration ? (
                      <StakeBtns>
                        <StakeBtnSlice
                          onClick={() => openModal('withdrawTokens')}
                          withdraw
                          disabled={true}
                          disabledBtnColor={ModeThemes[theme].disabledBtnColor}
                        >
                          disabled
                        </StakeBtnSlice>
                      </StakeBtns>
                    ) : (
                      <StakeBtns>
                        <StakeBtn background='#6E41CF' onClick={() => openModal('liqWithdraw')} disabled={false}>
                          -
                        </StakeBtn>
                        <StakeBtn background='#4441CF' onClick={() => openModal('liqStake')} disabled={false}>
                          +
                        </StakeBtn>
                      </StakeBtns>
                    )}
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
                <h2>{title === 'SLICE Staking Pools' ? 'REMAINING CAPACITY' : 'EPOCH REWARDS'}</h2>
                {title === 'SLICE Staking Pools' && duration && <h2>{roundNumber(remainingCap)} SLICE</h2>}
                {title === 'SLICE Staking Pools' && !duration && <h2>N/A</h2>}
                {title === 'Liquidity Provider Pools' && <h2>{roundNumber(reward)}</h2>}
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
          reward={reward}
          remainingCap={remainingCap}
          apy={apy}
          duration={duration}
          durationIndex={durationIndex}
          // Functions
          closeModal={() => closeModal()}
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
  setNotificationCount,
  checkServer
})(TableCard);
