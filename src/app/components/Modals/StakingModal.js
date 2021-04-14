import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import Modal from 'react-modal';
import { serverUrl, apiUri, pairLogos } from 'config';
import { getUserStaked, massHarvest, stakingAllowanceCheck } from 'services/contractMethods';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { CloseModal } from 'assets';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { fromWei } from 'services/contractMethods';
import { safeAdd } from 'utils';
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
  SliceNotFoundBtn,
  ModalUserActions,
  ClaimModalHalfWrapper,
  ClaimModalHalfContentWrapper,
  ClaimModalHalfContent,
  ClaimModalRow,
  ClaimModalCol
} from './styles/ModalsComponents';

import { SummaryCardCounter, SummaryCardBtn, SummaryClaimBtn } from '../Stake/Summary/styles/SummaryComponents';
import { roundNumber } from 'utils';
import { Lock, TrancheClaim } from 'assets';

import i18n from '../locale/i18n';
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
  userSummary: { slice, lp, lpList, stakableAssets, accruedRewards },
  // State Values
  summaryModal,
  stakingList,
  noBalance,
  modalIsOpen,
  modalType,
  setModalType,
  isLPToken,
  hasAllowance,
  setHasAllowance,
  approveLoading,
  tokenBalance,
  type,
  sliceAddress,
  lpAddress,
  tokenAddress,
  // Functions
  closeModal,
  setTokenAddress,
  openModal,
  stakingApproveContract,
  adjustStake,
  contractAddress
  // API Values,
}) => {
  // const stakableAssets = useRef();
  const [isDesktop, setDesktop] = useState(window.innerWidth > 992);
  // const [tokenAddress, setTokenAddress] = useState(null);
  const [stakingAddress, setStakingAddress] = useState(null);
  const [isLPTokenMobile, setLPTokenMobile] = useState(false);
  const [typeMobile, setTypeMobile] = useState('slice');
  const [totalStaked, setTotalStaked] = useState(0);
  const [userStaked, setUserStaked] = useState(0);
  const [stakedShare, setStakedShare] = useState(0);
  const [balanceMobile, setBalanceMobile] = useState(0);
  const [modalTypeMobile, setModalTypeMobile] = useState(undefined);

  const tokenType = type === 'SLICE' ? 'SLICE' : (type === 'SLICE/DAI LP' || type === 'SLICE/ETH LP') ? 'LP Tokens' : '';

  const updateMedia = () => {
    setDesktop(window.innerWidth > 992);
  };
  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  });
  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  });

  useEffect(() => {
    const getStakingDetails = async () => {
      const res = await axios(`${serverUrl + stakingSummaryDetail + tokenAddress + '/' + address}`);
      const { result } = res.data;
      setTotalStaked(result.staked);
      let userStaked = await getUserStaked(stakingAddress, tokenAddress);
      console.log(stakingAddress)
      setUserStaked(userStaked);
      setStakedShare((parseFloat(result.userStaked) / result.staked) * 100);
    };

    modalIsOpen && type !== 'reward' && tokenAddress && getStakingDetails();
  }, [modalIsOpen, type, tokenAddress, stakingAddress, address]);

  const modalClose = () => {
    closeModal();
    setModalTypeMobile(undefined);
  };
  const setBalanceCB = (balance) => {
    setBalanceMobile(roundNumber(balance));
  };
  const toggleModalMobile = async (bool, type) => {
    setModalTypeMobile(bool);
    setTypeMobile(type);
    setModalType(bool)
    if (type === 'SLICE') {
      if (bool) {
        let result = slice ? await stakingAllowanceCheck(sliceAddress, slice.stakingAddress, address) : false;
        setHasAllowance(result);
      } else setHasAllowance(true);
    } else if (type === 'SLICE/DAI LP' || type === 'SLICE/ETH LP') {
      if (bool) {
        let result = lpList ? await stakingAllowanceCheck(lpAddress, lpList[0].stakingAddress, address) : false;
        setHasAllowance(result);
      } else setHasAllowance(true);
    }
    setLPTokenMobile((type === 'SLICE/DAI LP' || type === 'SLICE/ETH LP') ? true : false);
  };
  useEffect(() => {
    const setBalance = async () => {
      if (tokenBalance) {
        if (typeMobile === 'slice' && sliceAddress) setBalanceCB(fromWei(tokenBalance[sliceAddress]));
        if (typeMobile === 'lp' && lpList) {
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
  }, [typeMobile, sliceAddress, lpList, tokenBalance]);

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
              ? i18n.t('stake.modal.stakeModalTitle')
              : modalType === false
              ? i18n.t('stake.modal.withdrawModalTitle')
              : 'Claim rewards'}
          </h2>
          <button onClick={() => modalClose()}>
            <img src={CloseModal} alt='' />
          </button>
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
                <LoanDetailsRowTitle stake>YOUR SHARE</LoanDetailsRowTitle>
                <LoanDetailsRowValue stake>{roundNumber(stakedShare, 2) !== 'NaN' ? roundNumber(stakedShare, 2) : 0}%</LoanDetailsRowValue>
              </LoanDetailsRow>
            </ModalActionDetailsContent>
          </ModalActionDetails>
          <ModalUserActions>
            <ModalHeader rightStakeModal claim>
              <h2>{modalType ? 'Increase' : 'Decrease'} Stake</h2>
            </ModalHeader>

            <StakingForm
              modalType={modalType}
              userStaked={userStaked}
              type={type}
              tokenAddress={tokenAddress}
              stakingAddress={stakingAddress}
              setTokenAddress={setTokenAddress}
              setStakingAddress={setStakingAddress}
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
          <h2>Your Stakes</h2>
          <button onClick={() => modalClose()}>
            <img src={CloseModal} alt='' />
          </button>
        </ModalHeader>
        <ModalActionsContent stakingMobile>
          <ModalActionDetails color={modalType === true ? '#4441CF' : modalType === false ? '#6E41CF' : '#369987'} claimModal stake>
            <ClaimModalHalfWrapper>
              <ClaimModalHalfContentWrapper>
                <ClaimModalHalfContent>
                  <ClaimModalRow head>
                    <ClaimModalCol head>
                      <h2>PAIR</h2>
                    </ClaimModalCol>
                    <ClaimModalCol head>
                      <h2>Total Locked</h2>
                    </ClaimModalCol>
                  </ClaimModalRow>

                  <ClaimModalRow>
                    <ClaimModalCol>
                      <h2>SLICE</h2>
                    </ClaimModalCol>
                    <ClaimModalCol>
                      <h2>
                        <img src={Lock} alt='lock' />
                        {roundNumber(slice.balance) !== 'NaN' ? roundNumber(slice.balance) : 0}
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
                        {roundNumber(lp.balance1) !== 'NaN' ? roundNumber(lp.balance1) : 0}
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
                        {roundNumber(lp.balance2) !== 'NaN' ? roundNumber(lp.balance2) : 0}
                      </h2>
                    </ClaimModalCol>
                  </ClaimModalRow>
                </ClaimModalHalfContent>
              </ClaimModalHalfContentWrapper>
            </ClaimModalHalfWrapper>
          </ModalActionDetails>

          <ModalUserActions claimModal>
            <ModalHeader rightStakeModal claim>
              <h2>Available Rewards</h2>
            </ModalHeader>

            <ClaimModalHalfWrapper>
              <ClaimModalHalfContentWrapper>
                <ClaimModalHalfContent>
                  <ClaimModalRow head right>
                    <ClaimModalCol head right pair>
                      <h2>PAIR</h2>
                    </ClaimModalCol>
                    <ClaimModalCol head right rewards>
                      <h2>Rewards</h2>
                    </ClaimModalCol>
                    <ClaimModalCol head right claim>
                      <h2>Claim</h2>
                    </ClaimModalCol>
                  </ClaimModalRow>
                  {stakableAssets &&
                    stakableAssets.map((item) => (
                      <ClaimModalRow key={item.name} right>
                        <ClaimModalCol value right pair>
                          <img src={TrancheClaim} alt='' />
                          <img src={pairLogos[item.name]} alt='' />
                        </ClaimModalCol>
                        <ClaimModalCol value right rewards>
                          <h2>{accruedRewards ? roundNumber(accruedRewards[item.address]) : '0'} SLICE</h2>
                        </ClaimModalCol>
                        {/* <ClaimModalCol disabled={accruedRewards[item.address] && accruedRewards[item.address] === '0'} value right claim btn> */}
                        <ClaimModalCol value right claim btn>
                          <button onClick={() => massHarvest(item.yieldAddress)}>
                            <h2>Claim</h2>
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
  const InitialStakingModal = () => {
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
              ? i18n.t('stake.modal.stakeModalTitle')
              : modalType === false
              ? i18n.t('stake.modal.withdrawModalTitle')
              : 'Claim rewards'}
          </h2>
          <button onClick={() => modalClose()}>
            <img src={CloseModal} alt='' />
          </button>
        </ModalHeader>

        <ModalActionsContent stakingMobile>
          <StakingModalWrapper>
            <StakingModalRow>
              <h2>Staked SLICE Tokens</h2>
              {/* <h2>00.00</h2> */}
              <SummaryCardCounter stakingMobile>
                <SummaryCardBtn stakingMobile onClick={() => toggleModalMobile(true, 'slice')}>
                  +
                </SummaryCardBtn>
                <SummaryCardBtn stakingMobile onClick={() => toggleModalMobile(false, 'slice')}>
                  -
                </SummaryCardBtn>
              </SummaryCardCounter>
            </StakingModalRow>

            <StakingModalRow>
              <h2>Staked LP Tokens</h2>
              {/* <h2>00.00</h2> */}
              <SummaryCardCounter stakingMobile>
                <SummaryCardBtn stakingMobile onClick={() => toggleModalMobile(true, 'lp')}>
                  +
                </SummaryCardBtn>
                <SummaryCardBtn stakingMobile onClick={() => toggleModalMobile(false, 'lp')}>
                  -
                </SummaryCardBtn>
              </SummaryCardCounter>
            </StakingModalRow>

            <StakingModalRow>
              <h2>SLICE Rewards Collected</h2>
              {/* <h2>00.00</h2> */}
              <SummaryClaimBtn stakingMobile claim>
                <button onClick={() => toggleModalMobile(null, null)}>Claim</button>
              </SummaryClaimBtn>
            </StakingModalRow>
          </StakingModalWrapper>
          <LoanDetailsMobile>
            <h2>
              {i18n.t('stake.modal.sliceLocked')}— {roundNumber(totalStaked)}
              <span></span>
            </h2>{' '}
          </LoanDetailsMobile>
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
        <ModalHeader notFound>
          <button onClick={() => modalClose()}>
            <img src={CloseModal} alt='' />
          </button>
        </ModalHeader>
        {(type === 'SLICE/DAI LP' || type === 'SLICE/ETH LP') ? (
          <SliceNotFound>
            <p>{i18n.t('stake.modal.DontHaveSliceLP')}</p>
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
            <p>{i18n.t('stake.modal.DontHaveSlice')}</p>
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

  return isDesktop
    ? noBalance && modalType === true
      ? notFound()
      : modalType === null
      ? claimModal()
      : stakingModal()
    : !isDesktop
    ? summaryModal && modalTypeMobile === undefined
      ? InitialStakingModal()
      : modalTypeMobile && Number(balanceMobile) === 0
      ? notFound()
      : modalTypeMobile === null
      ? claimModal()
      : modalTypeMobile === true || modalTypeMobile === false
      ? stakingModal()
      : false
    : false;
};

StakingModal.propTypes = {
  ethereum: PropTypes.object.isRequired,
  userSummary: PropTypes.object.isRequired,
  stakingList: PropTypes.array.isRequired,
  path: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  ethereum: state.ethereum,
  userSummary: state.userSummary,
  stakingList: state.data.stakingList,
  path: state.path
});

export default connect(mapStateToProps, {})(StakingModal);
