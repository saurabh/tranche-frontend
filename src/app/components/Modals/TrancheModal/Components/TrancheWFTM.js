import React from 'react';
import Modal from 'react-modal';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { CloseModal, CloseModalWhite, FTMIconInput, LinkIcon, TranchePending, TranchePendingLight } from 'assets';
import { ModeThemes } from 'config/constants';
import { ModalHeader, ModalMarketWrapper, ModalMarketWrapperBtn, TrancheWFTMStyles, TrancheModalContent, TrancheModalWrapper, WrapFTMHeader, TrancheModalHeader, TrancheModalContentHeader, TrancheModalContentHeaderImg, TrancheModalContentHeaderText, TrancheModalContentStatus, TrancheModalFooter } from '../../styles/ModalsComponents';
import { FormContentWrapper, FormContent, WrapSubmitBtn } from 'app/components/Stake/Table/styles/TableComponents';


export const TrancheWFTM = ({ theme, txModalIsOpen, closeModal, trancheMarketsToggling }) => {

  const TrancheWFTMToFTM = () => {
    return(
      <TrancheModalWrapper backgroundColor={ModeThemes[theme].ModalBackground} TrancheWFTM>

        <ModalHeader tranche ModalBackground={ModeThemes[theme].ModalBackground} textColor={ModeThemes[theme].textColor} TrancheWFTM>
          <h2>WFTM FTM</h2>
          <button onClick={() => closeModal()}>
            <img src={theme === 'light' ? CloseModal : CloseModalWhite} alt='' />
          </button>
        </ModalHeader>

        <TrancheModalContent trancheStatus color={ModeThemes[theme].ModalTrancheTextColor} TrancheWFTM>
          <WrapFTMHeader textColor={ModeThemes[theme].textColor}>
            <h2>You need to wrap FTM to Deposit.</h2>
          </WrapFTMHeader>
          <FormContentWrapper>
            <FormContent color={ModeThemes[theme].dropDownText} background={ModeThemes[theme].inputBackground} FTMIcon={FTMIconInput} TrancheWFTM>
              <input type='number' step='0.001' name='from' placeholder="FTM Amount" />
              <h2>MAX</h2>
            </FormContent>
            <h3>Balance: 43,321,313,232 FTM</h3>
          </FormContentWrapper>
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_f_1392:16273)">
            <circle cx="60" cy="60" r="28" fill="#4441CF"/>
            </g>
            <path d="M67.5 67.5V52.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M61.5 61.5L67.5 67.5L73.5 61.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M51.5 52.5V67.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M57.5 58.5L51.5 52.5L45.5 58.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <defs>
            <filter id="filter0_f_1392:16273" x="0" y="0" width="120" height="120" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feGaussianBlur stdDeviation="16" result="effect1_foregroundBlur_1392:16273"/>
            </filter>
            </defs>
          </svg>
          <FormContentWrapper>
            <FormContent color={ModeThemes[theme].dropDownText} background={ModeThemes[theme].inputBackground} FTMIcon={FTMIconInput} TrancheWFTM>
              <input type='number' step='0.001' name='from' placeholder="Wrapped FTM"/>
              <h2>MAX</h2>
            </FormContent>
          </FormContentWrapper>
          <WrapSubmitBtn>WRAP FTM</WrapSubmitBtn>
        </TrancheModalContent>
      </TrancheModalWrapper>
    )
  }
  const TrancheWFTMToFTMStatus = () => {
    return(
      <TrancheModalWrapper backgroundColor={ModeThemes[theme].ModalBackground} TrancheWFTM>
        <TrancheModalHeader color={ModeThemes[theme].ModalTrancheTextColor} border={ModeThemes[theme].ModalTrancheTextRowBorder} TrancheWFTM>
          <ModalHeader tranche ModalBackground={ModeThemes[theme].ModalBackground} enableModal>
            <button onClick={() => closeModal()}>
              <img src={theme === 'light' ? CloseModal : CloseModalWhite} alt='' />
            </button>
          </ModalHeader>
          <TrancheModalContentHeader color={ModeThemes[theme].ModalTrancheTextColor} TrancheWFTM>
            <TrancheModalContentHeaderImg TrancheWFTM>
              <img src={FTMIconInput} alt='img' />
            </TrancheModalContentHeaderImg>
            <TrancheModalContentHeaderText
              rateColor={ModeThemes[theme].TrancheRateTypeColor}
              color={ModeThemes[theme].ModalTrancheTextColor}
              textColor={ModeThemes[theme].textColor}
              TrancheWFTM
            >
              <h2>FTM Wrapping</h2>
            </TrancheModalContentHeaderText>
          </TrancheModalContentHeader>
          </TrancheModalHeader>

          <TrancheModalContent trancheStatus color={ModeThemes[theme].ModalTrancheTextColor} TrancheWFTMStatus>
            <h2>
              FTM to WFTM
            </h2>
            <TrancheModalContentStatus color={ModeThemes[theme].ModalTrancheTextColor} TrancheWFTMStatus>
              <img src={theme === 'light' ? TranchePendingLight : TranchePending} alt='img' /> {/* TrancheRejected - Migrated */}
              <h2>Wrapping Pending</h2> {/* Wrapping Failed - Wrapping Confirmed */}
            </TrancheModalContentStatus>
            
          </TrancheModalContent>
          <TrancheModalFooter
              color={ModeThemes[theme].ModalTrancheTextColor}
              link
              TrancheEnableConfirm
              disabledColor={ModeThemes[theme].DisabledBtn}
              disabledTextColor={ModeThemes[theme].DisabledBtnText}
              TrancheWFTMStatus
            >
          {/* <button>
              <LoadingButton>
                  {[...Array(4).keys()].map((idx) => {
                    return <LoadingButtonCircle i={idx + 1}></LoadingButtonCircle>;
            })}
                  </LoadingButton>
            </button> */}
                <a href="/" target='_blank' rel='noreferrer noopener'>
                  <img src={LinkIcon} alt='img' />View on Explorer
                </a>
            </TrancheModalFooter>
      </TrancheModalWrapper>
    )
  }
  return (
    <Modal
      isOpen={txModalIsOpen}
      onRequestClose={closeModal}
      style={TrancheWFTMStyles}
      closeTimeoutMS={200}
      shouldCloseOnOverlayClick={false}
      contentLabel='Adjust'
      portalClassName='TrancheMarketsModal'
    >
      
      {
        <TrancheWFTMToFTM />
      }
    </Modal>
  );
};
