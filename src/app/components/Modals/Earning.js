import React, { useState } from 'react';
import Modal from 'react-modal';
import 'react-confirm-alert/src/react-confirm-alert.css';
//import { statuses } from 'config/constants';
import { initiateEarning, toggleEarning } from 'redux/actions/ToggleEarning';
import { changeOwnAllFilter} from 'redux/actions/loans';
import { connect } from 'react-redux';


import {
  ModalHeader,
  ModalTextConfirm,
  ModalTextConfirmBtn,
  ModalTextConfirmBtnWrapper,
  ModalEarningContent, 
  ModalCardWrapper, 
  ModalCardLeft, 
  ModalCardRight,
  ModalEarningBtnWrapper, 
  ModalEarningBtn,
  ModalCardImg,
  ModalCardTextWrapper,
  ModalCardText,
  ModalCardSubText,
  ModalCardRightText
} from './styles/ModalsComponents';

import { CloseModal, UserImg, WarningIcon, EthImg } from 'assets';
import ToggleEarning from 'redux/reducers/ToggleEarning';
const SelectLoansStyles = {
  overlay: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    overflowY: 'scroll'
  },
  content: {
    position: 'absolute',
    maxWidth: '831px',
    width: '100%',
    minHeight: '220px',
    border: 'none',
    boxShadow: '0px 1px 4px 1px rgba(0, 0, 0, 0.12)',
    borderRadius: '12px',
    padding: '0',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxHeight: '700px',
    overlfow: 'scroll'
  }
};

Modal.setAppElement('#root');

const EarningModal = ({
  openModal,
  closeModal,
  status,
  toggleEarning,
  ToggleEarning: { earningStatus, initiateEarningStatus, initiateEarning, loansStatus },
  changeOwnAllFilter
}) => {
  

  const modalClose = (step = 'notFirst') => {
    if(step === 'first'){
      closeModal();
      toggleEarning(false);
    }
    else{
      closeModal();
    }
  };
  const EarningHandler = () => {
    toggleEarning(true);
    changeOwnAllFilter('own');
    closeModal();
  };

  const NotEnoughLoans = () => {
    return (
      <div className="earningModal">
          <Modal
            isOpen={openModal}
            onRequestClose={closeModal}
            style={SelectLoansStyles}
            shouldCloseOnOverlayClick={false}
            contentLabel='Earning'
          >
            <ModalHeader earning>
              <h2>
                NOT ENOUGH LOANS
              </h2>
              <button onClick={() => modalClose('first')}>
                <img src={CloseModal} alt='' />
              </button>
            </ModalHeader>
            <ModalTextConfirm>
              <h2>
              You need to own at least 3 unique active loans to create an earning asset
              </h2>
            </ModalTextConfirm>
            <ModalTextConfirmBtnWrapper>
              <ModalTextConfirmBtn>
                BUY MORE LOAN TOKENS
              </ModalTextConfirmBtn>
            </ModalTextConfirmBtnWrapper>
          </Modal>
      </div>
    );
  };

  
  const SelectLoans = () => {
    return (
      <div className="earningModal">
          <Modal
            isOpen={openModal}
            onRequestClose={closeModal}
            style={SelectLoansStyles}
            shouldCloseOnOverlayClick={false}
            contentLabel='Earning'
          >
            <ModalHeader earning>
              <h2>
                SELECT LOANS
              </h2>
              <button onClick={() => modalClose('first')}>
                <img src={CloseModal} alt='' />
              </button>
            </ModalHeader>
            <ModalTextConfirm>
              <h2>
                Select the loans you would like to include in your Earning Asset by clicking on the individual loans
              </h2>
            </ModalTextConfirm>
            <ModalTextConfirmBtnWrapper>
              <ModalTextConfirmBtn onClick={EarningHandler}>
                CONTINUE
              </ModalTextConfirmBtn>
            </ModalTextConfirmBtnWrapper>
          </Modal>
      </div>
    );
  };

  const ConfirmLoans = () => {
    return (
      <div className="earningModal">
          <Modal
            isOpen={openModal}
            onRequestClose={closeModal}
            style={SelectLoansStyles}
            shouldCloseOnOverlayClick={false}
            contentLabel='Earning'
          >
            <ModalHeader earning>
              <h2>
                CONFIRM LOANS
              </h2>
              <button onClick={() => modalClose()}>
                <img src={CloseModal} alt='' />
              </button>
            </ModalHeader>

            <ModalEarningContent>
              <ModalCardWrapper>
                <ModalCardLeft>

                  <ModalCardImg>
                    <img src={UserImg} />
                  </ModalCardImg>

                  <ModalCardTextWrapper>
                    <ModalCardText>
                      FAT PANGOLIN’S LOAN
                    </ModalCardText>
                    <ModalCardSubText>
                      50 Shares
                    </ModalCardSubText>
                  </ModalCardTextWrapper>

                </ModalCardLeft>
                <ModalCardRight>
                  <ModalCardRightText>
                    0.0045 ETH
                  </ModalCardRightText>
                </ModalCardRight>
              </ModalCardWrapper>

              <ModalCardWrapper>
                <ModalCardLeft>

                  <ModalCardImg>
                    <img src={UserImg} />
                  </ModalCardImg>

                  <ModalCardTextWrapper>
                    <ModalCardText>
                      FAT PANGOLIN’S LOAN
                    </ModalCardText>
                    <ModalCardSubText>
                      50 Shares
                    </ModalCardSubText>
                  </ModalCardTextWrapper>

                </ModalCardLeft>
                <ModalCardRight>
                  <ModalCardRightText>
                    0.0045 ETH
                  </ModalCardRightText>
                </ModalCardRight>
              </ModalCardWrapper>
            </ModalEarningContent>


            <ModalEarningBtnWrapper>
              <ModalEarningBtn>
                CONTINUE
              </ModalEarningBtn>
            </ModalEarningBtnWrapper>
    
          </Modal>
      </div>
    );
  };


  const TrancheSummary = () => {
    return (
      <div className="earningModal">
          <Modal
            isOpen={openModal}
            onRequestClose={closeModal}
            style={SelectLoansStyles}
            shouldCloseOnOverlayClick={false}
            contentLabel='Earning'
          >
            <ModalHeader earning>
              <h2>
                Tranche Summary <img src={WarningIcon} />
              </h2>
              <button onClick={() => modalClose()}>
                <img src={CloseModal} alt='' />
              </button>
            </ModalHeader>

            <ModalEarningContent>
              <ModalCardWrapper>
                <ModalCardLeft>

                  <ModalCardImg>
                    <img src={EthImg} />
                  </ModalCardImg>

                  <ModalCardTextWrapper>
                    <ModalCardText>
                      OWL’S ASSET - TRANCHE A
                    </ModalCardText>
                    <ModalCardSubText>
                      50 Shares
                    </ModalCardSubText>
                  </ModalCardTextWrapper>

                </ModalCardLeft>
                <ModalCardRight>
                  <ModalCardRightText>
                    0.0045 ETH
                  </ModalCardRightText>
                </ModalCardRight>
              </ModalCardWrapper>

              <ModalCardWrapper>
                <ModalCardLeft>

                  <ModalCardImg>
                    <img src={EthImg} />
                  </ModalCardImg>

                  <ModalCardTextWrapper>
                    <ModalCardText>
                      OWL’S ASSET - TRANCHE A
                    </ModalCardText>
                    <ModalCardSubText>
                      50 Shares
                    </ModalCardSubText>
                  </ModalCardTextWrapper>

                </ModalCardLeft>
                <ModalCardRight>
                  <ModalCardRightText>
                    0.0045 ETH
                  </ModalCardRightText>
                </ModalCardRight>
              </ModalCardWrapper>

              <ModalCardWrapper disabled>
                <ModalCardLeft>

                  <ModalCardImg>
                    <img src={EthImg} />
                  </ModalCardImg>

                  <ModalCardTextWrapper>
                    <ModalCardText>
                    OWL’S ASSET - TRANCHE T
                    </ModalCardText>
                    <ModalCardSubText>
                      50 Shares
                    </ModalCardSubText>
                  </ModalCardTextWrapper>

                </ModalCardLeft>
                <ModalCardRight>
                  <ModalCardRightText>
                    0.0045 ETH
                  </ModalCardRightText>
                </ModalCardRight>
              </ModalCardWrapper>
            </ModalEarningContent> 

            
            <ModalEarningBtnWrapper>
              <ModalEarningBtn>
                CONTINUE
              </ModalEarningBtn>
            </ModalEarningBtnWrapper>
    
          </Modal>
      </div>
    );
  };


  return (loansStatus === false) ? NotEnoughLoans() : (initiateEarningStatus && !earningStatus) ? SelectLoans() : (initiateEarningStatus && earningStatus) ? ConfirmLoans() : '';
};

const mapStateToProps = (state) => {
  return {
    ToggleEarning: state.ToggleEarning,
    initiateEarningStatus: state.initiateEarningStatus
  };
};

export default connect(mapStateToProps, { toggleEarning, initiateEarning, changeOwnAllFilter })(EarningModal);