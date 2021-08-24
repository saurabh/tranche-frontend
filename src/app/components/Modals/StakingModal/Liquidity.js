import React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import StakingForm from '../../Form/Staking';
import { ModeThemes, LiquidityIcons } from 'config';
import { roundNumber } from 'utils';
import store from 'redux/store';
import i18n from 'app/components/locale/i18n';
import {
  StakingModalContentWrapper,
  StakingModalContent,
  StakingModalClose,
  StakingModalContentSideWrapper,
  StakingModalContentSide,
  BreakLink,
  StakingModalContentSideTitle,
  StakingModalContentSideHeader,
  StakingModalContentSideHeaderBoxWrapper,
  StakingModalContentSideHeaderBox,
  StakingModalContentSideHeaderImg,
  StakingModalContentSideHeaderText,
  StakeModalPoolTable,
  StakeModalPoolTableTitle,
  StakeModalPoolTableHead,
  StakeModalPoolTableRow,
  StakeModalPoolTableCol,
  StakeModalNavigationWrapper,
  StakeModalNavigationBtn,
  stakingModalStyles
} from '../styles/ModalsComponents';
import { CloseModal, CloseModalWhite, TrancheStake } from 'assets';

export const liquidityModal = ({
  modalTypeVar,
  setModalTypeVar,
  modalIsOpen,
  type,
  contractAddress,
  tokenAddress,
  title,
  reward,
  apy,
  userStaked,
  totalStaked,
  stakedShare,
  // Functions
  adjustStake,
  closeModal
}) => {
  const state = store.getState();
  let theme = state.theme;
console.log(modalIsOpen)
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={stakingModalStyles}
      closeTimeoutMS={200}
      shouldCloseOnOverlayClick={false}
      contentLabel='Claim'
      portalClassName='stakeModal'
    >
      <StakingModalContentWrapper height='454px' backgroundColor={ModeThemes[theme].ModalBackground}>
        <StakingModalContent height='454px'>
          <StakingModalClose>
            <button onClick={closeModal}>
              <img src={theme === 'light' ? CloseModal : CloseModalWhite} alt='close' />
            </button>
          </StakingModalClose>

          <StakingModalContentSideWrapper>
            <StakingModalContentSide>
              <StakingModalContentSideTitle textColor={ModeThemes[theme].ModalText}>
                <h2>Pool Info</h2>
              </StakingModalContentSideTitle>

              <StakingModalContentSideHeader BoxColor={ModeThemes[theme].BoxColor}>
                <StakingModalContentSideHeaderImg>
                  <img src={TrancheStake} alt='img' />
                  {title === 'Liquidity Provider Pools' && <img src={LiquidityIcons[type && type]} alt='Tranche' />}
                </StakingModalContentSideHeaderImg>
                <StakingModalContentSideHeaderText textColor={ModeThemes[theme].ModalText} boxText={ModeThemes[theme].boxText}>
                  <h2>{type}</h2>
                  <h2>{contractAddress}</h2>
                </StakingModalContentSideHeaderText>
              </StakingModalContentSideHeader>
              <StakingModalContentSideHeaderBoxWrapper>
                <StakingModalContentSideHeaderBox
                  textColor={ModeThemes[theme].ModalText}
                  BoxColor={ModeThemes[theme].BoxColor}
                  BoxColorText={ModeThemes[theme].BoxColorText}
                >
                  <h2>APY</h2>
                  <h2>{roundNumber(apy, false)}%</h2>
                </StakingModalContentSideHeaderBox>
                <StakingModalContentSideHeaderBox
                  textColor={ModeThemes[theme].ModalText}
                  BoxColor={ModeThemes[theme].BoxColor}
                  BoxColorText={ModeThemes[theme].BoxColorText}
                >
                  <h2>EPOCH REWARDS</h2>
                  <h2>{roundNumber(reward, false)} SLICE</h2>
                </StakingModalContentSideHeaderBox>
              </StakingModalContentSideHeaderBoxWrapper>

              <StakeModalPoolTable scroll={false}>
                <StakeModalPoolTableTitle textColor={ModeThemes[theme].ModalText}>
                  <h2>{i18n.t('yourStakes')}</h2>
                </StakeModalPoolTableTitle>
                <StakeModalPoolTableHead>
                  <StakeModalPoolTableCol head TableHeadText={ModeThemes[theme].TableHeadText}>
                    <h2>STAKED AMOUNT</h2>
                  </StakeModalPoolTableCol>
                  <StakeModalPoolTableCol head TableHeadText={ModeThemes[theme].TableHeadText}>
                    <h2>TOTAL STAKED</h2>
                  </StakeModalPoolTableCol>
                  <StakeModalPoolTableCol head TableHeadText={ModeThemes[theme].TableHeadText}>
                    <h2>YOUR SHARE</h2>
                  </StakeModalPoolTableCol>
                </StakeModalPoolTableHead>

                <StakeModalPoolTableRow BorderStake={ModeThemes[theme].BorderStake}>
                  <StakeModalPoolTableCol col textColor={ModeThemes[theme].ModalText}>
                    <h2>{roundNumber(userStaked)}</h2>
                  </StakeModalPoolTableCol>
                  <StakeModalPoolTableCol col textColor={ModeThemes[theme].ModalText}>
                    <h2>{roundNumber(totalStaked)}</h2>
                  </StakeModalPoolTableCol>
                  <StakeModalPoolTableCol col textColor={ModeThemes[theme].ModalText}>
                    <h2>{roundNumber(stakedShare, 2)}%</h2>
                  </StakeModalPoolTableCol>
                </StakeModalPoolTableRow>
              </StakeModalPoolTable>
            </StakingModalContentSide>

            <BreakLink>
              <span></span>
            </BreakLink>

            <StakingModalContentSide>
              <StakingModalContentSideTitle textColor={ModeThemes[theme].ModalText}>
                <h2>Manage</h2>
              </StakingModalContentSideTitle>
              <StakeModalNavigationWrapper
                modalTypeVar={modalTypeVar}
                stakeBoxBackground={ModeThemes[theme].stakeBoxBackground}
                stakeModalBoxBackground={ModeThemes[theme].stakeModalBoxBackground}
                StakeModalNavigationBorder={ModeThemes[theme].StakeModalNavigationBorder}
                theme={theme}
              >
                <span></span>
                <StakeModalNavigationBtn
                  stakeModalBoxShadow={ModeThemes[theme].stakeModalBoxShadow}
                  stakeModalBoxBackground={ModeThemes[theme].stakeModalBoxBackground}
                  StakeModalNavigationText={ModeThemes[theme].StakeModalNavigationText}
                  onClick={() => setModalTypeVar('liqStake')}
                  active={modalTypeVar === 'liqStake'}
                  Stake
                >
                  Stake
                </StakeModalNavigationBtn>
                <StakeModalNavigationBtn
                  stakeModalBoxShadow={ModeThemes[theme].stakeModalBoxShadow}
                  stakeModalBoxBackground={ModeThemes[theme].stakeModalBoxBackground}
                  StakeModalNavigationText={ModeThemes[theme].StakeModalNavigationText}
                  onClick={() => setModalTypeVar('liqWithdraw')}
                  active={modalTypeVar === 'liqWithdraw'}
                  Withdraw
                >
                  Withdraw
                </StakeModalNavigationBtn>
              </StakeModalNavigationWrapper>

              <StakingForm
                modalTypeVar={modalTypeVar}
                type={type}
                tokenAddress={tokenAddress}
                contractAddress={contractAddress}
                userStaked={userStaked}
                adjustStake={adjustStake}
              />
            </StakingModalContentSide>
          </StakingModalContentSideWrapper>
        </StakingModalContent>
      </StakingModalContentWrapper>
    </Modal>
  );
};

// const mapStateToProps = (state) => ({
//   theme: state.theme
// });

// connect(mapStateToProps, {})(liquidityModal)

// export { liquidityModal };
