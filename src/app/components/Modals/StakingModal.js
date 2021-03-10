import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import Modal from 'react-modal';
import { serverUrl, apiUri } from 'config';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { CloseModal } from 'assets';
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
  StakingModalRow,
  StakingModalWrapper,
  SliceNotFound,
  SliceNotFoundBtn
} from './styles/ModalsComponents';
import { SummaryCardCounter, SummaryCardBtn } from '../Stake/Summary/styles/SummaryComponents';
import { roundNumber } from 'utils';
import i18n from '../locale/i18n';
const { stakingSummaryDetail } = apiUri;
const BASE_URL = serverUrl;

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
  ethereum: {address},
  // State Values
  summaryModal,
  modalIsOpen,
  modalType,
  isLPToken,
  hasAllowance,
  approveLoading,
  tokenBalance,
  type,
  // tokenAddress,
  // Functions
  closeModal,
  openModal,
  stakingAllowanceCheck,
  stakingApproveContract,
  adjustStake
  // API Values,
}) => {
  const [isDesktop, setDesktop] = useState(window.innerWidth > 992);
  const [tokenAddress, setTokenAddress] = useState(null);
  const [totalStaked, setTotalStaked] = useState(0);
  const [balance, setBalance] = useState(false);
  const [userStaked, setUserStaked] = useState(0);
  const [stakedShare, setStakedShare] = useState(0);
  
  const updateMedia = () => {
    setDesktop(window.innerWidth > 992);
  };
  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  });

  useEffect(() => {
    const getStakingDetails = async () => {
      const res = await axios(`${BASE_URL + stakingSummaryDetail + tokenAddress + '/' + address}`);
      const { result } = res.data;
      setTotalStaked(result.staked);
      setUserStaked(result.userStaked);
      setStakedShare((result.userStaked / result.staked) * 100)
    };

    modalIsOpen && tokenAddress && getStakingDetails();
  }, [modalIsOpen, tokenAddress, address]);

  const modalClose = () => {
    closeModal();
  };

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
          <h2>{modalType ? i18n.t('stake.modal.stakeModalTitle') : !modalType ? i18n.t('stake.modal.withdrawModalTitle') : ''}</h2>
          <button onClick={() => modalClose()}>
            <img src={CloseModal} alt='' />
          </button>
        </ModalHeader>
        {!isDesktop && summaryModal ? (
          <ModalActionsContent stakingMobile>
            <StakingModalWrapper>
              <StakingModalRow>
                <h2>Staked SLICE Tokens</h2>
                <h2>00.00</h2>
                <SummaryCardCounter stakingMobile>
                  <SummaryCardBtn stakingMobile onClick={() => openModal(true, 1)}>
                    +
                  </SummaryCardBtn>
                  <SummaryCardBtn stakingMobile onClick={() => openModal(false, 1)}>
                    -
                  </SummaryCardBtn>
                </SummaryCardCounter>
              </StakingModalRow>

              <StakingModalRow>
                <h2>Staked SLICE Tokens</h2>
                <h2>00.00</h2>
                <SummaryCardCounter stakingMobile>
                  <SummaryCardBtn stakingMobile onClick={() => openModal(true, 2)}>
                    +
                  </SummaryCardBtn>
                  <SummaryCardBtn stakingMobile onClick={() => openModal(false, 2)}>
                    -
                  </SummaryCardBtn>
                </SummaryCardCounter>
              </StakingModalRow>
            </StakingModalWrapper>
            <LoanDetailsMobile>
              <h2>
                {i18n.t('stake.modal.sliceLocked')}— {totalStaked}
                <span></span>
              </h2>{' '}
            </LoanDetailsMobile>
          </ModalActionsContent>
        ) : (
          <ModalActionsContent stakingMobile>
            <ModalActionDetails color={modalType ? '#4441CF' : '#6E41CF'} stake>
              <ModalActionDetailsContent stake={true} trade={true}>
                <LoanDetailsRow trade={true}>
                  <LoanDetailsRowTitle stake>{i18n.t('stake.modal.sliceLocked')}</LoanDetailsRowTitle>
                  <LoanDetailsRowValue stake>{userStaked}</LoanDetailsRowValue>
                </LoanDetailsRow>

                <LoanDetailsRow trade={true}>
                  <LoanDetailsRowTitle stake>YOUR SHARE</LoanDetailsRowTitle>
                  <LoanDetailsRowValue stake>{roundNumber(stakedShare, 2)}%</LoanDetailsRowValue>
                </LoanDetailsRow>
              </ModalActionDetailsContent>
            </ModalActionDetails>
            <StakingForm
              modalType={modalType}
              userStaked={userStaked}
              tokenAddress={tokenAddress}
              setTokenAddress={setTokenAddress}
              hasAllowance={hasAllowance}
              approveLoading={approveLoading}
              isLPToken={isLPToken}
              // Functions
              stakingAllowanceCheck={stakingAllowanceCheck}
              stakingApproveContract={stakingApproveContract}
              adjustStake={adjustStake}
              setBalanceModal={setBalance}
              path={path}
            />
            <LoanDetailsMobile>
              <h2>
                SLICE LOCKED — {totalStaked}
                <span></span>
              </h2>
            </LoanDetailsMobile>
          </ModalActionsContent>
        )}
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
        <ModalHeader notFound>
          <button onClick={() => modalClose()}>
            <img src={CloseModal} alt='' />
          </button>
        </ModalHeader>
        {type === 'lp' ? (
          <SliceNotFound>
            <p>
            {i18n.t('stake.modal.DontHaveSliceLP')}
            </p>
            <SliceNotFoundBtn color='#1E80DA'>
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
          <SliceNotFound>
            <p>
              {i18n.t('stake.modal.DontHaveSlice')}
            </p>
            <SliceNotFoundBtn color='#4441CF'>
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
  return 0 === 1 ? notFound() : stakingModal() ;
  // return balance === 0 && modalType ? notFound() : stakingModal() ;
};

StakingModal.propTypes = {
  ethereum: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  ethereum: state.ethereum,
  path: state.path
});

export default connect(mapStateToProps, {})(StakingModal);
