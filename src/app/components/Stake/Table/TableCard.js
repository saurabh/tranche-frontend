import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import { postRequest } from 'services/axios';
import useAnalytics from 'services/analytics';
import { setAddress, setNetwork, setBalance, setWalletAndWeb3, setTokenBalances, setTokenBalance } from 'redux/actions/ethereum';
import { checkServer } from 'redux/actions/checkServer';
import { addrShortener, roundNumber, readyToTransact, ERC20Setup, safeAdd } from 'utils';
import { statuses, ApproveBigNumber, txMessage } from 'config';
import { LinkArrow, TrancheImg } from 'assets';
import { ModeThemes } from 'config/constants';

import { toWei, fromWei, stakingAllowanceCheck, addStake, withdrawStake } from 'services/contractMethods';
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
  TableCardImgWrapper
  // TableMobilCardBtn
} from './styles/TableComponents';
import i18n from 'app/components/locale/i18n';
import { initOnboard } from 'services/blocknative';

const TableCard = ({
  staking: { contractAddress, isActive, reward, staked, type, apy, subscription },
  setTokenBalance,
  ethereum: { tokenBalance, address, wallet, web3, notify, blockExplorerUrl },
  summaryData: { slice, lp, lpList },
  theme,
  isDesktop
  // checkServer
}) => {
  const [ModalIsOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(true);
  const [hasAllowance, setHasAllowance] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [tokenAddress, setTokenAddress] = useState(null);
  const [balance, setBalance] = useState(0);
  const [isLPToken, setLPToken] = useState(false);
  const [stakingAddress, setStakingAddress] = useState(null);
  const Tracker = useAnalytics("ButtonClicks");


  const onboard = initOnboard({
    address: setAddress,
    network: setNetwork,
    balance: setBalance,
    wallet: setWalletAndWeb3
  });

  const setBalanceCB = useCallback((balance) => {
    setBalance(roundNumber(balance, undefined, 'down'));
  }, []);

  useEffect(() => {
    type === 'SLICE/DAI LP' || type === 'SLICE/ETH LP' ? setLPToken(true) : setLPToken(false);
  }, [type]);

  useEffect(() => {
    const setBalance = async () => {
      if (tokenBalance) {
        if (type === 'SLICE' && slice.address) setBalanceCB(fromWei(tokenBalance[slice.address]));
        if ((type === 'SLICE/DAI LP' || type === 'SLICE/ETH LP') && lpList) {
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
  }, [type, slice, lp, tokenBalance, tokenAddress, lpList, setBalanceCB]);

  useEffect(() => {
    if (type === 'SLICE') {
      setTokenAddress(slice.address);
      setStakingAddress(slice.stakingAddress);
    } else if (type === 'SLICE/ETH LP') {
      setTokenAddress(lpList && lpList[0].address);
      setStakingAddress(lpList && lpList[0].stakingAddress);
    } else if (type === 'SLICE/DAI LP') {
      setTokenAddress(lpList && lpList[1].address);
      setStakingAddress(lpList && lpList[1].stakingAddress);
    }
  }, [type, slice, lpList]);

  let moreCardToggle = false;

  const searchObj = (val) => {
    return Object.fromEntries(Object.entries(statuses).filter(([key, value]) => value.status === val));
  };

  const openModal = async (type) => {
    const ready = await readyToTransact(wallet, onboard);
    if (!ready) return;
    address = !address ? onboard.getState().address : address;
    setTokenBalance(tokenAddress, address);
    if (type) {
      let result = await stakingAllowanceCheck(tokenAddress, stakingAddress, address);
      setHasAllowance(result);
    } else setHasAllowance(true);
    setModalType(type);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  const stakingApproveContract = async (stakingAddress, tokenAddress) => {
    try {
      const token = ERC20Setup(web3, tokenAddress);
      await token.methods
        .approve(stakingAddress, toWei(ApproveBigNumber))
        .send({ from: address })
        .on('transactionHash', (hash) => {
          setApproveLoading(true);
          console.log('true');
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
      console.error(error);
    }
  };

  const adjustStake = (e, stakingAddress, tokenAddress) => {
    try {
      e.preventDefault();
      modalType ? addStake(stakingAddress, tokenAddress) : withdrawStake(stakingAddress, tokenAddress);
      modalType? Tracker("addStake", "User address: " + address) : Tracker("withdrawStake", "User address: " + address) ;
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
                <img src={TrancheImg} alt='Tranche' />
              </TableCardImg>
              <FirstColContent>
                <FirstColTitle color={ModeThemes[theme].tableText}>
                  <h2>{type && type}</h2>
                </FirstColTitle>
                <FirstColSubtitle>
                  <h2>{addrShortener(contractAddress)}</h2>
                  <a href={blockExplorerUrl + 'address/' + contractAddress} target='_blank' rel='noopener noreferrer'>
                    <img src={LinkArrow} alt='' />
                  </a>
                </FirstColSubtitle>
              </FirstColContent>
            </TableFirstColWrapper>
          </TableFirstCol>

          <TableFifthCol className='table-col' stake stakeStatus>
            <FifthColContent>
              <StatusTextWrapper
                className='status-text-wrapper'
                color={ModeThemes[theme].activeStatusText}
                backgroundColor={ModeThemes[theme].activeStatus}
                table='stake'
              >
                {isActive ? i18n.t('stake.table.statuses.active') : ''}
              </StatusTextWrapper>
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

          <TableSeventhCol onClick={(e) => e.stopPropagation()} className='table-sixth-col table-col' stake stakeCol>
            <StakeBtn background='#6E41CF' onClick={() => openModal(false)}>
              -
            </StakeBtn>
            <StakeBtn background='#4441CF' onClick={() => openModal(true)}>
              +
            </StakeBtn>
          </TableSeventhCol>
        </TableContentCard>

        <StakingModal
          // State Values
          modalIsOpen={ModalIsOpen}
          modalType={modalType}
          tokenAddress={tokenAddress}
          stakingAddress={stakingAddress}
          noBalance={Number(balance) === 0}
          contractAddress={contractAddress}
          // Functions
          closeModal={() => closeModal()}
          hasAllowance={hasAllowance}
          setHasAllowance={setHasAllowance}
          approveLoading={approveLoading}
          isLPToken={isLPToken}
          // Functions
          stakingApproveContract={stakingApproveContract}
          adjustStake={adjustStake}
          type={type}
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
              // type={type === 'TRANCHE_A' ? 'A' : type === 'TRANCHE_B' ? 'B' : ''}
              // color={type === 'TRANCHE_A' ? '#12BB7E' : type === 'TRANCHE_B' ? '#FD8383' : ''}
            >
              <img src={TrancheImg} alt='Tranche' />
            </TableCardImg>
          </TableCardImgWrapper>

          <TableMobileContent>
            <TableMobileContentRow>
              <TableFirstColWrapper>
                <FirstColContent instrument>
                  <FirstColTitle color={ModeThemes[theme].tableText}>
                    <h2>{type && type}</h2>
                    <StakeBtns>
                      <StakeBtn background='#4441CF' onClick={() => openModal(true)}>
                        +
                      </StakeBtn>
                      <StakeBtn background='#6E41CF' onClick={() => openModal(false)}>
                        -
                      </StakeBtn>
                    </StakeBtns>
                  </FirstColTitle>
                  <FirstColSubtitle>
                    <h2>{addrShortener(contractAddress)}</h2>
                    <a href={blockExplorerUrl + 'address/' + contractAddress} target='_blank' rel='noopener noreferrer'>
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
                <h2>EPOCH REWARDS</h2>
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
          // State Values
          modalIsOpen={ModalIsOpen}
          modalType={modalType}
          tokenAddress={tokenAddress}
          stakingAddress={stakingAddress}
          noBalance={Number(balance) === 0}
          contractAddress={contractAddress}
          // Functions
          closeModal={() => closeModal()}
          hasAllowance={hasAllowance}
          setHasAllowance={setHasAllowance}
          approveLoading={approveLoading}
          isLPToken={isLPToken}
          // Functions
          stakingApproveContract={stakingApproveContract}
          adjustStake={adjustStake}
          type={type}
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
  setWalletAndWeb3: PropTypes.func.isRequired
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
  setTokenBalances,
  setTokenBalance,
  checkServer
})(TableCard);
