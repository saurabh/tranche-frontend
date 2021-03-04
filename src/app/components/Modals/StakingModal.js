import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import Modal from 'react-modal';
import { serverUrl, apiUri } from 'config'
import 'react-confirm-alert/src/react-confirm-alert.css';
import { CloseModal } from 'assets';
import 'react-confirm-alert/src/react-confirm-alert.css';
import StakingForm from '../Form/Staking';
import {
  // gweiOrEther,
  // roundBasedOnUnit
  // roundNumber
} from 'utils';
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
import {
  SummaryCardCounter,
  SummaryCardBtn
} from '../Summary/styles/SummaryComponents';
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
  // State Values
  summaryModal,
  path,
  modalIsOpen,
  modalType,
  isLPToken,
  hasAllowance,
  approveLoading,
  tokenBalance,
  type,
  tokenAddress,
  // Functions
  closeModal,
  openModal,
  stakingAllowanceCheck,
  stakingApproveContract,
  adjustStake,
  // API Values,
}) => {
  const [isDesktop, setDesktop] = useState(window.innerWidth > 992);
  const [totalStaked, setTotalStaked] = useState(0);
  const [rewardsPerBlock, setRewardsPerBlock] = useState(0);
  const updateMedia = () => {
    setDesktop(window.innerWidth > 992);
  };
  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });

  useEffect(() => {
    const getStakingDetails = async () => {
      const res = await axios(`${BASE_URL + stakingSummaryDetail + tokenAddress}`);
      const { result } = res.data;
      setTotalStaked(result.staked)
      setRewardsPerBlock(result.reward)
      // console.log(result)
    }

    modalIsOpen && getStakingDetails()
  }, [modalIsOpen, tokenAddress])

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
          <h2>{modalType ? 'STAKE SLICE TOKENS' : !modalType ? 'WITHDRAW SLICE TOKENS' : ''}</h2>
          <button onClick={() => modalClose()}>
            <img src={CloseModal} alt='' />
          </button>
        </ModalHeader>
        {
        !isDesktop && summaryModal ?
        <ModalActionsContent stakingMobile>
          <StakingModalWrapper>
            <StakingModalRow>
              <h2>Staked SLICE Tokens</h2>
              <h2>00.00</h2>
              <SummaryCardCounter stakingMobile>
                <SummaryCardBtn
                  stakingMobile
                    onClick={() => openModal(true, 1)}
                >+</SummaryCardBtn>
                <SummaryCardBtn
                  stakingMobile
                    onClick={() => openModal(false, 1)}
                >-</SummaryCardBtn>
              </SummaryCardCounter>
            </StakingModalRow>

            <StakingModalRow>
              <h2>Staked SLICE Tokens</h2>
              <h2>00.00</h2>
              <SummaryCardCounter stakingMobile>
                <SummaryCardBtn
                  stakingMobile
                    onClick={() => openModal(true, 2)}
                >+</SummaryCardBtn>
                <SummaryCardBtn
                  stakingMobile
                    onClick={() => openModal(false, 2)}
                >-</SummaryCardBtn>
              </SummaryCardCounter>
            </StakingModalRow>
          </StakingModalWrapper>
          <LoanDetailsMobile>
            <h2>
              SLICE LOCKED — {totalStaked}
              {/* SLICE LOCKED — {roundBasedOnUnit(reward, 'SLICE')} {gweiOrEther(reward, 'SLICE')} */}
              <span>
              </span>
            </h2>
            <h2>
              REWARDS PER BLOCK — {rewardsPerBlock}
              <span>
              </span>
            </h2>
          </LoanDetailsMobile>
        </ModalActionsContent> : 

          <ModalActionsContent stakingMobile>
            <ModalActionDetails color={modalType ? "#4441CF" : "#6E41CF"} stake>
              <ModalActionDetailsContent trade={true} stake>
                <LoanDetailsRow trade={true}>
                  <LoanDetailsRowTitle stake>SLICE LOCKED</LoanDetailsRowTitle>
                  <LoanDetailsRowValue stake>{totalStaked}</LoanDetailsRowValue>
                </LoanDetailsRow>

                <LoanDetailsRow trade={true}>
                  <LoanDetailsRowTitle stake>REWARDS PER BLOCK</LoanDetailsRowTitle>

                  <LoanDetailsRowValue stake>
                  {rewardsPerBlock}
                  </LoanDetailsRowValue>
                </LoanDetailsRow>
              </ModalActionDetailsContent>
            </ModalActionDetails>
            <StakingForm
              modalType={modalType}
              hasAllowance={hasAllowance}
              approveLoading={approveLoading}
              isLPToken={isLPToken}
              // Functions
              stakingAllowanceCheck={stakingAllowanceCheck}
              stakingApproveContract={stakingApproveContract}
              adjustStake={adjustStake}
              path={path}
            />
            <LoanDetailsMobile>
            <h2>
              SLICE LOCKED — {totalStaked}
              <span>
              </span>
            </h2>
            <h2>
              REWARDS PER BLOCK — {rewardsPerBlock}
              <span>
              </span>
            </h2>
          </LoanDetailsMobile>
          </ModalActionsContent>
        }
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
        {
          type === 'lp' ?
          <SliceNotFound>
            <p>You don’t have any <strong>SLICE-LP</strong> available to stake. Click the button below to go to UniSwap and get <strong>SLICE-LP</strong> Tokens</p>
            <SliceNotFoundBtn color="#1E80DA">
              <a href="https://app.uniswap.org/#/swap?outputCurrency=0x0aee8703d34dd9ae107386d3eff22ae75dd616d1" target="_blank" rel="noopener noreferrer">GET SLICE LP TOKENS</a>
            </SliceNotFoundBtn>
          </SliceNotFound>  : 
          <SliceNotFound>
            <p>You don’t have any <strong>SLICE</strong> available to stake. Click the button below to purchase<strong>SLICE</strong> Tokens</p>
            <SliceNotFoundBtn color="#4441CF">
              <a href="https://app.uniswap.org/#/swap?outputCurrency=0x0aee8703d34dd9ae107386d3eff22ae75dd616d1" target="_blank" rel="noopener noreferrer">GET SLICE TOKENS</a>
            </SliceNotFoundBtn>
          </SliceNotFound>
        }
      </Modal>
    );
  };
  return true ? stakingModal() : notFound();
};

StakingModal.propTypes = {
  // ethereum: PropTypes.object.isRequired,
  // form: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  stakingData: state.data.stakingList,
  path: state.path
});

export default connect(mapStateToProps, {

})(StakingModal);