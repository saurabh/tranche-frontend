import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import Modal from 'react-modal';
import { serverUrl, apiUri, pairLogos } from 'config';
import { getUserStaked, massHarvest } from 'services/contractMethods';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { CloseModal, CloseModalWhite } from 'assets';
import 'react-confirm-alert/src/react-confirm-alert.css';
import StakingForm from '../Form/Staking';
import {
  ModalHeader,
  ModalActionsContent,
  ModalActionDetails,
  ModalActionDetailsContent,
  LoanDetailsRow,
  LoanDetailsRowTitle,
  LoanDetailsRowValue,
  LoanDetailsMobile,
  SliceNotFound,
  SliceNotFoundBtn,
  ModalUserActions,
  ClaimModalHalfWrapper,
  ClaimModalHalfContentWrapper,
  ClaimModalHalfContent,
  ClaimModalRow,
  ClaimModalCol
} from './styles/ModalsComponents';

import { roundNumber } from 'utils';
import { Lock, TrancheClaim } from 'assets';

import i18n from '../locale/i18n';
import { ModeThemes } from 'config';
const { stakingSummaryDetail } = apiUri;

const FirstCustomStyles = {
  overlay: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0'
  },
  content: {
    position: 'relative',
    maxWidth: '831px',
    width: '100%',
    minHeight: '554px',
    //height: '326px',
    height: 'auto',
    border: 'none',
    boxShadow: '0px 1px 4px 1px rgba(0, 0, 0, 0.12)',
    borderRadius: '12px',
    padding: '0',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0'
  }
};
const NotFoundStyles = {
  overlay: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0'
  },
  content: {
    position: 'relative',
    maxWidth: '292px',
    width: '100%',
    minHeight: '245px',
    //height: '326px',
    height: 'auto',
    border: 'none',
    boxShadow: '0px 1px 4px 1px rgba(0, 0, 0, 0.12)',
    borderRadius: '12px',
    padding: '0',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0'
  }
};

Modal.setAppElement('#root');

const StakingModal = ({
  path,
  ethereum: { address },
  summaryData: { slice, lp, stakableAssets, accruedRewards },
  // State Values
  noBalance,
  modalIsOpen,
  modalType,
  isLPToken,
  hasAllowance,
  setHasAllowance,
  approveLoading,
  type,
  tokenAddress,
  stakingAddress,
  theme,
  // Functions
  closeModal,
  stakingApproveContract,
  adjustStake,
  contractAddress
  // API Values,
}) => {
  const [totalStaked, setTotalStaked] = useState(0);
  const [userStaked, setUserStaked] = useState(0);
  const [stakedShare, setStakedShare] = useState(0);

  const tokenType = type === 'SLICE' ? 'SLICE' : (type === 'SLICE/DAI LP' || type === 'SLICE/ETH LP') ? 'LP Tokens' : '';
  
  useEffect(() => {
    const getStakingDetails = async () => {
      const res = await axios(`${serverUrl + stakingSummaryDetail + tokenAddress + '/' + address}`);
      const { result } = res.data;
      setTotalStaked(result.staked);
      let userStaked = await getUserStaked(stakingAddress, tokenAddress);
      setUserStaked(userStaked);
      setStakedShare((parseFloat(result.userStaked) / result.staked) * 100);
    };

    modalIsOpen && type !== 'reward' && tokenAddress && getStakingDetails();
  }, [modalIsOpen, type, tokenAddress, stakingAddress, address]);

  const stakingModal = () => {
    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={FirstCustomStyles}
        closeTimeoutMS={200}
        shouldCloseOnOverlayClick={false}
        contentLabel='Adjust'
      >
        <ModalHeader stake>
          <h2>
            {modalType === true
              ? `Stake ${type} tokens` 
              : modalType === false
              ? `Withdraw ${type} tokens` 
              : 'Claim rewards'}
          </h2>
        </ModalHeader>
        <ModalActionsContent stakingMobile>
          <ModalActionDetails color={modalType === true ? '#4441CF' : modalType === false ? '#6E41CF' : '#369987'} stake>
            <ModalActionDetailsContent stake={true} trade={true}>
              <LoanDetailsRow trade={true}>
                <LoanDetailsRowTitle stake>USER {tokenType} LOCKED</LoanDetailsRowTitle>
                <LoanDetailsRowValue stake>{roundNumber(userStaked)}</LoanDetailsRowValue>
              </LoanDetailsRow>

              <LoanDetailsRow trade={true}>
                <LoanDetailsRowTitle stake>TOTAL {tokenType} LOCKED</LoanDetailsRowTitle>
                <LoanDetailsRowValue stake>{roundNumber(totalStaked) !== 'NaN' ? roundNumber(totalStaked) : 0}</LoanDetailsRowValue>
              </LoanDetailsRow>

              <LoanDetailsRow trade={true}>
                <LoanDetailsRowTitle stake>{i18n.t('stake.modal.yourShare')}</LoanDetailsRowTitle>
                <LoanDetailsRowValue stake>{roundNumber(stakedShare, 2) !== 'NaN' ? roundNumber(stakedShare, 2) : 0}%</LoanDetailsRowValue>
              </LoanDetailsRow>
            </ModalActionDetailsContent>
          </ModalActionDetails>
          <ModalUserActions ModalBackground={ModeThemes[theme].ModalBackground}>
            <ModalHeader rightStakeModal claim ModalHeader={ModeThemes[theme].ModalText}>
              <h2>{modalType ? i18n.t('stake.modal.increaseStake') : i18n.t('stake.modal.decreaseStake')}</h2>
              <button onClick={() => closeModal()}>
                <img src={theme === "light" ? CloseModal : CloseModalWhite} alt='' />
              </button>
            </ModalHeader>

            <StakingForm
              modalType={modalType}
              userStaked={userStaked}
              type={type}
              tokenAddress={tokenAddress}
              stakingAddress={stakingAddress}
              hasAllowance={hasAllowance}
              setHasAllowance={setHasAllowance}
              contractAddress={contractAddress}
              approveLoading={approveLoading}
              isLPToken={isLPToken}
              // Functions
              stakingApproveContract={stakingApproveContract}
              adjustStake={adjustStake}
              // setBalanceModal={setBalance}
              path={path}
            />
          </ModalUserActions>
          

          <LoanDetailsMobile>
            <h2>
              {/* SLICE LOCKED — {totalStaked} */}
              <span></span>
            </h2>
          </LoanDetailsMobile>
        </ModalActionsContent>
      </Modal>
    );
  };
  const claimModal = () => {
    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={FirstCustomStyles}
        closeTimeoutMS={200}
        shouldCloseOnOverlayClick={false}
        contentLabel='Adjust'
      >
        <ModalHeader stake claim>
          <h2>{i18n.t('stake.modal.yourStakes')}</h2>
        </ModalHeader>
        <ModalActionsContent stakingMobile>
          <ModalActionDetails color={modalType === true ? '#4441CF' : modalType === false ? '#6E41CF' : '#369987'} claimModal stake>
            <ClaimModalHalfWrapper>
              <ClaimModalHalfContentWrapper>
                <ClaimModalHalfContent>
                  <ClaimModalRow head>
                    <ClaimModalCol head>
                      <h2>{i18n.t('stake.modal.pair')}</h2>
                    </ClaimModalCol>
                    <ClaimModalCol head>
                      <h2>{i18n.t('stake.modal.totalLocked')}</h2>
                    </ClaimModalCol>
                  </ClaimModalRow>

                  <ClaimModalRow>
                    <ClaimModalCol>
                      <h2>SLICE</h2>
                    </ClaimModalCol>
                    <ClaimModalCol>
                      <h2>
                        <img src={Lock} alt='lock' />
                        <span>
                          {roundNumber(slice.balance) !== 'NaN' ? roundNumber(slice.balance) : 0}
                        </span>
                      </h2>
                    </ClaimModalCol>
                  </ClaimModalRow>

                  <ClaimModalRow>
                    <ClaimModalCol>
                      <h2>SLICE-ETH LP</h2>
                    </ClaimModalCol>
                    <ClaimModalCol>
                      <h2>
                        <img src={Lock} alt='lock' />
                        <span>
                          {roundNumber(lp.balance1) !== 'NaN' ? roundNumber(lp.balance1) : 0}
                        </span>
                      </h2>
                    </ClaimModalCol>
                  </ClaimModalRow>

                  <ClaimModalRow>
                    <ClaimModalCol>
                      <h2>SLICE-DAI LP</h2>
                    </ClaimModalCol>
                    <ClaimModalCol>
                      <h2>
                        <img src={Lock} alt='lock' />
                        <span>
                          {roundNumber(lp.balance2) !== 'NaN' ? roundNumber(lp.balance2) : 0}
                        </span>
                      </h2>
                    </ClaimModalCol>
                  </ClaimModalRow>
                </ClaimModalHalfContent>
              </ClaimModalHalfContentWrapper>
            </ClaimModalHalfWrapper>
          </ModalActionDetails>

          <ModalUserActions claimModal ModalBackground={ModeThemes[theme].ModalBackground}>
            <ModalHeader rightStakeModal claim ModalHeader={ModeThemes[theme].ModalText}> 
              <h2>{i18n.t('stake.modal.availableRewards')}</h2>
              <button onClick={() => closeModal()}>
                <img src={theme === "light" ? CloseModal : CloseModalWhite}alt='' />
              </button>
            </ModalHeader>

            <ClaimModalHalfWrapper>
              <ClaimModalHalfContentWrapper>
                <ClaimModalHalfContent>
                  <ClaimModalRow head right>
                    <ClaimModalCol head right pair color={ModeThemes[theme].ClaimHead}>
                      <h2>{i18n.t('stake.modal.pair')}</h2>
                    </ClaimModalCol>
                    <ClaimModalCol head right rewards color={ModeThemes[theme].ClaimHead}>
                      <h2>{i18n.t('stake.modal.rewards')}</h2>
                    </ClaimModalCol>
                    <ClaimModalCol head right claim color={ModeThemes[theme].ClaimHead}>
                      <h2>{i18n.t('stake.modal.claim')}</h2>
                    </ClaimModalCol>
                  </ClaimModalRow>
                  {stakableAssets &&
                    stakableAssets.map((item) => (
                      <ClaimModalRow key={item.name} right>
                        <ClaimModalCol value right pair>
                          <img src={TrancheClaim} alt='' />
                          <img src={pairLogos[item.name]} alt='' />
                        </ClaimModalCol>
                        <ClaimModalCol value right rewards ModalText={ModeThemes[theme].ModalText}>
                          <h2>{accruedRewards ? roundNumber(accruedRewards[item.address]) : '0'} SLICE</h2>
                        </ClaimModalCol>
                        {/* <ClaimModalCol disabled={accruedRewards[item.address] && accruedRewards[item.address] === '0'} value right claim btn> */}
                        <ClaimModalCol value right claim btn>
                          <button onClick={() => massHarvest(item.yieldAddress)}>
                            <h2>{i18n.t('stake.modal.claim')}</h2>
                          </button>
                        </ClaimModalCol>
                      </ClaimModalRow>
                    ))}
                </ClaimModalHalfContent>
              </ClaimModalHalfContentWrapper>
            </ClaimModalHalfWrapper>
          </ModalUserActions>
        </ModalActionsContent>
      </Modal>
    );
  };
  const notFound = () => {
    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={NotFoundStyles}
        closeTimeoutMS={200}
        shouldCloseOnOverlayClick={false}
        contentLabel='Adjust'
      >
        <ModalHeader notFound ModalBackground={ModeThemes[theme].ModalBackground}>
          <button onClick={() => closeModal()}>
            <img src={theme === "light" ? CloseModal : CloseModalWhite}alt='' />
          </button>
        </ModalHeader>
        {(type === 'SLICE/DAI LP' || type === 'SLICE/ETH LP') ? (
          <SliceNotFound ModalBackground={ModeThemes[theme].ModalBackground} ModalText={ModeThemes[theme].ModalText}>
            <p>{i18n.t('stake.modal.DontHaveSliceLP')}</p>
            <SliceNotFoundBtn color='#1E80DA'  ModalBackground={ModeThemes[theme].SelectedStaking}>
              <a
                href='https://app.uniswap.org/#/swap?outputCurrency=0x0aee8703d34dd9ae107386d3eff22ae75dd616d1'
                target='_blank'
                rel='noopener noreferrer'
              >
                {i18n.t('stake.modal.getSliceLP')}
              </a>
            </SliceNotFoundBtn>
          </SliceNotFound>
        ) : (
          <SliceNotFound ModalBackground={ModeThemes[theme].ModalBackground} ModalText={ModeThemes[theme].ModalText}>
            <p>{i18n.t('stake.modal.DontHaveSlice')}</p>
            <SliceNotFoundBtn color='#4441CF'  ModalBackground={ModeThemes[theme].SelectedStaking}>
              <a
                href='https://app.uniswap.org/#/swap?outputCurrency=0x0aee8703d34dd9ae107386d3eff22ae75dd616d1'
                target='_blank'
                rel='noopener noreferrer'
              >
                {i18n.t('stake.modal.getSlice')}
              </a>
            </SliceNotFoundBtn>
          </SliceNotFound>
        )}
      </Modal>
    );
  };

  return noBalance && modalType === true
    ? notFound()
    : modalType === null
    ? claimModal()
    : stakingModal()
};

StakingModal.propTypes = {
  ethereum: PropTypes.object.isRequired,
  summaryData: PropTypes.object.isRequired,
  stakingList: PropTypes.array.isRequired,
  path: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  ethereum: state.ethereum,
  summaryData: state.summaryData,
  stakingList: state.data.stakingList,
  path: state.path,
  theme: state.theme
});

export default connect(mapStateToProps, {})(StakingModal);
