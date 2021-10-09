import React, { useState } from 'react';
import Modal from 'react-modal';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { CloseModal, CloseModalWhite, TrancheStake, LinkIcon, Migrated, TranchePending, TranchePendingLight, TrancheRejected } from 'assets';
import {
  ModalHeader,
  GovernanceModalStyles,
  GovernanceModalWrapper,
  GovernanceModalHeader,
  GovernanceModalContent,
  StakingModalContentSideHeader,
  StakingModalContentSideHeaderImg,
  StakingModalContentSideHeaderText,
  StakingModalContentSideHeaderBoxWrapper,
  StakingModalContentSideHeaderBox,
  GovernanceModalDelegateFormWrapper,
  GovernanceModalDelegateFormText,
  GovernanceModalDelegateFormSubmitBtn
} from '../../styles/ModalsComponents';
import { ModeThemes } from 'config';

export const GovernanceModal = ({
  closeModal,
  modalIsOpen,
  modalType
}) => {
  let theme = "dark";
  const [delegated, setDelegated] = useState(false);
  const [address, setAddress] = useState('');
  let newAddress = "0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd";

  const delegatedTest = (e) => {
    e.preventDefault();
    setDelegated(!delegated);
  }
  const setNewAddress = (e, add) =>{
    e.preventDefault();
    setAddress(add);
  }

  const delegateModal = () => {
    return (
      <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={GovernanceModalStyles}
          closeTimeoutMS={200}
          shouldCloseOnOverlayClick={false}
          contentLabel='Governance'
          portalClassName='GovernanceModal'
        >
  
          <GovernanceModalWrapper>
            <GovernanceModalHeader>
              <h2>Manage Delegation</h2>
              <button onClick={() => closeModal()}>
                <img src={theme === 'light' ? CloseModal : CloseModalWhite} alt='' />
              </button>
            </GovernanceModalHeader>
            <GovernanceModalContent>
            <StakingModalContentSideHeader BoxColor={ModeThemes[theme].BoxColor}>
              <StakingModalContentSideHeaderImg stake>
                <img src={TrancheStake} alt='img' />
              </StakingModalContentSideHeaderImg>
              <StakingModalContentSideHeaderText boxText={ModeThemes[theme].boxText} textColor={ModeThemes[theme].ModalText}>
                <h2>Voting power: 120000 SLICE</h2>
                <h2>0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd</h2>
              </StakingModalContentSideHeaderText>
              {/* <StakingModalChangeBtn>Change</StakingModalChangeBtn> */}
              </StakingModalContentSideHeader>
            <StakingModalContentSideHeaderBoxWrapper migrate>
                <StakingModalContentSideHeaderBox
                  governance
                  BoxColor={ModeThemes[theme].BoxColor}
                  textColor={ModeThemes[theme].ModalText}
                  BoxColorText={ModeThemes[theme].BoxColorText}
                >
                  <h2>SLICE</h2>
                  <h2>1000</h2>
                </StakingModalContentSideHeaderBox>
                <StakingModalContentSideHeaderBox
                  governance
                  BoxColor={ModeThemes[theme].BoxColor}
                  textColor={ModeThemes[theme].ModalText}
                  BoxColorText={ModeThemes[theme].BoxColorText}
                >
                  <h2>SLICE</h2>
                  <h2>1000</h2>
                </StakingModalContentSideHeaderBox>
                <StakingModalContentSideHeaderBox
                  governance
                  BoxColor={ModeThemes[theme].BoxColor}
                  textColor={ModeThemes[theme].ModalText}
                  BoxColorText={ModeThemes[theme].BoxColorText}
                >
                  <h2>SLICE</h2>
                  <h2>1000</h2>
                </StakingModalContentSideHeaderBox>
              </StakingModalContentSideHeaderBoxWrapper>
            
            <GovernanceModalDelegateFormWrapper delegated={delegated}>
              <form>
                <GovernanceModalDelegateFormText>
                  <h2>{delegated ? "Your voting power is currently delegated to:" : "Delegate your voting power to:"}</h2>
                  <button onClick={(e) => setNewAddress(e, newAddress)}>My address</button>
                </GovernanceModalDelegateFormText>
                <input type="text" defaultValue={address}/>
                <GovernanceModalDelegateFormSubmitBtn type="text" onClick={(e) => delegatedTest(e)}>{delegated ? "Change Delegation" : "Delegate"}</GovernanceModalDelegateFormSubmitBtn>
              </form>
            </GovernanceModalDelegateFormWrapper>
            </GovernanceModalContent>
          </GovernanceModalWrapper>
  
        
        </Modal>
    );
  }

  const proposalModal = () => {
    return (
      <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={GovernanceModalStyles}
          closeTimeoutMS={200}
          shouldCloseOnOverlayClick={false}
          contentLabel='Governance'
          portalClassName='GovernanceModal'
        >
          <GovernanceModalWrapper>
            <GovernanceModalHeader>
              <h2>Manage Delegation</h2>
              <button onClick={() => closeModal()}>
                <img src={theme === 'light' ? CloseModal : CloseModalWhite} alt='' />
              </button>
            </GovernanceModalHeader>
            <GovernanceModalContent>

            </GovernanceModalContent>
          </GovernanceModalWrapper>
        
        </Modal>
    );
  }

  return modalType === 'delegate' ? delegateModal() : modalType === 'proposal' ? proposalModal() : '';
  
};
