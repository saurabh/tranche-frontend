import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { CloseModal, CloseModalWhite, ETHCARD, Lock, LockLight, TrancheIcon } from 'assets';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {
  StakingModalContentWrapper,
  StakingModalContent,
  StakingModalClose,
  ClaimModalHeader,
  ClaimModalTableWrapper,
  ClaimModalTableTitle,
  ClaimModalTableSubTitle,
  ClaimModalTableHead,
  ClaimModalTableRow,
  ClaimModalTableCol,
  ClaimModalTableBtn,
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
  StakeModalFormWrapper,
  StakeModalFormBtn,
  StakeModalFormInputWrapper,
  StakeModalFormInput,
  EstimatedText,
  SliceNotFound,
  SliceNotFoundBtn,
  ModalHeader
} from './styles/ModalsComponents';
import ProgressBar from '../Stake/ProgressBar/ProgressBar';
import { ModeThemes } from 'config';
import i18n from '../locale/i18n';


const NotFoundStyles = {
  overlay: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    zIndex: '1000'
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
const MigrateStake = {
  overlay: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    zIndex: '1000'

  },
  content: {
    position: 'relative',
    maxWidth: '373px',
    width: '100%',
    minHeight: '373px',
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
const FirstCustomStyles = {
  overlay: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    zIndex: '1000'
  },
  content: {
    position: 'relative',
    maxWidth: '731px',
    width: '100%',
    minHeight: '634px',
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
const stakingModalStyles = {
  overlay: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    zIndex: '1000'
  },
  content: {
    position: 'relative',
    maxWidth: '731px',
    width: '100%',
    minHeight: '454px',
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
  modalIsOpen,
  theme,
  type,
  modalType,

  // Functions
  closeModal,
 
  // API Values,
}) => {

  const [modalTypeVar, setModalTypeVar] = useState("");

  useEffect(() =>{
    setModalTypeVar(modalType);
  }, [modalType])

  const claimModal = () => {
    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={FirstCustomStyles}
        closeTimeoutMS={200}
        shouldCloseOnOverlayClick={false}
        contentLabel='Claim'
      >
        <StakingModalContentWrapper height="634px" backgroundColor={ModeThemes[theme].ModalBackground}>
          <StakingModalContent height="634px">
            <StakingModalClose>
              <button onClick={closeModal}><img src={theme === "light" ? CloseModal : CloseModalWhite} alt="close"/></button>
            </StakingModalClose>
            <ClaimModalHeader textColor={ModeThemes[theme].ModalText}>
              <h2>Total Accrued Rewards</h2>
              <h2>100 SLICE <span>(Current Value is $70)</span></h2>
            </ClaimModalHeader>
            <ClaimModalTableWrapper>
              <ClaimModalTableTitle textColor={ModeThemes[theme].ModalText}>
                <h2>SLICE Pools</h2>
              </ClaimModalTableTitle>


              <ClaimModalTableHead BorderStake={ModeThemes[theme].BorderStake}>
                <ClaimModalTableCol head sliceliquidityFirstLast TableHeadText={ModeThemes[theme].TableHeadText}>
                  <h2>Pair</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol head sliceCol TableHeadText={ModeThemes[theme].TableHeadText}>
                  <h2>Deposit Date</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol head sliceCol TableHeadText={ModeThemes[theme].TableHeadText}>
                  <h2>End Date</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol head sliceCol TableHeadText={ModeThemes[theme].TableHeadText}> 
                  <h2>Total Locked</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol head sliceCol TableHeadText={ModeThemes[theme].TableHeadText}>
                  <h2>Rewards</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol head sliceliquidityFirstLast manage TableHeadText={ModeThemes[theme].TableHeadText}> 
                  <h2>Manage</h2>
                </ClaimModalTableCol>
              </ClaimModalTableHead>


              <ClaimModalTableRow BorderStake={ModeThemes[theme].BorderStake}>
                <ClaimModalTableCol col sliceliquidityFirstLast textColor={ModeThemes[theme].ModalText}>
                  <div>
                    <img src={ETHCARD} alt="img" />
                    <img src={ETHCARD} alt="img" />
                  </div>
                  <h2>Slice</h2>
                </ClaimModalTableCol>

                <ClaimModalTableCol col sliceCol textColor={ModeThemes[theme].ModalText}>
                  <h2>MAY 1 2021</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol col sliceCol textColor={ModeThemes[theme].ModalText}>
                  <h2>MAY 1 2022</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol col sliceCol staked textColor={ModeThemes[theme].ModalText}>
                  <h2><img src={Lock} alt="lock" /> 120.00</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol col sliceCol textColor={ModeThemes[theme].ModalText}>
                  <h2>0 SLICE</h2>
                </ClaimModalTableCol>

                <ClaimModalTableCol col sliceliquidityFirstLast>
                  <ClaimModalTableBtn>
                    Claim
                  </ClaimModalTableBtn>
                </ClaimModalTableCol>
              </ClaimModalTableRow>

              <ClaimModalTableRow BorderStake={ModeThemes[theme].BorderStake}>
                <ClaimModalTableCol col sliceliquidityFirstLast textColor={ModeThemes[theme].ModalText}>
                  <div>
                    <img src={ETHCARD} alt="img" />
                    <img src={ETHCARD} alt="img" />
                  </div>
                  <h2>Slice</h2>
                </ClaimModalTableCol>

                <ClaimModalTableCol col sliceCol textColor={ModeThemes[theme].ModalText}>
                  <h2>MAY 1 2021</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol col sliceCol textColor={ModeThemes[theme].ModalText}>
                  <h2>MAY 1 2022</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol col sliceCol staked textColor={ModeThemes[theme].ModalText}> 
                  <h2><img src={Lock} alt="lock" /> 120.00</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol col sliceCol textColor={ModeThemes[theme].ModalText}>
                  <h2>0 SLICE</h2>
                </ClaimModalTableCol>

                <ClaimModalTableCol col sliceliquidityFirstLast>
                  <ClaimModalTableBtn>
                    Claim
                  </ClaimModalTableBtn>
                </ClaimModalTableCol>
              </ClaimModalTableRow>

              <ClaimModalTableRow BorderStake={ModeThemes[theme].BorderStake}>
                <ClaimModalTableCol col sliceliquidityFirstLast textColor={ModeThemes[theme].ModalText}>
                  <div>
                    <img src={ETHCARD} alt="img" />
                    <img src={ETHCARD} alt="img" />
                  </div>
                  <h2>Slice</h2>
                </ClaimModalTableCol>

                <ClaimModalTableCol col sliceCol textColor={ModeThemes[theme].ModalText}>
                  <h2>MAY 1 2021</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol col sliceCol textColor={ModeThemes[theme].ModalText}>
                  <h2>MAY 1 2022</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol col sliceCol staked textColor={ModeThemes[theme].ModalText}>
                  <h2><img src={Lock} alt="lock" /> 120.00</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol col sliceCol textColor={ModeThemes[theme].ModalText}>
                  <h2>0 SLICE</h2>
                </ClaimModalTableCol>

                <ClaimModalTableCol col sliceliquidityFirstLast>
                  <ClaimModalTableBtn>
                    Claim
                  </ClaimModalTableBtn>
                </ClaimModalTableCol>
              </ClaimModalTableRow>

              
            </ClaimModalTableWrapper>
            <ClaimModalTableWrapper>
              <ClaimModalTableTitle textColor={ModeThemes[theme].ModalText}>
                <h2>Liquidity Provider Pools</h2>
              </ClaimModalTableTitle>
              <ClaimModalTableSubTitle textColor={ModeThemes[theme].ModalText}>
                <h2>6 Days until next distribution</h2>
              </ClaimModalTableSubTitle>

              <ProgressBar progress="50" width="100" colorOne="rgba(160, 160, 160, 0.15)" colorTwo="#369987"/>


              <ClaimModalTableHead BorderStake={ModeThemes[theme].BorderStake}>
                <ClaimModalTableCol head sliceliquidityFirstLast TableHeadText={ModeThemes[theme].TableHeadText}>
                  <h2>Pair</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol head liquidityCol TableHeadText={ModeThemes[theme].TableHeadText}>
                  <h2>Deposit Date</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol head liquidityCol TableHeadText={ModeThemes[theme].TableHeadText}> 
                  <h2>Total Staked</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol head liquidityCol TableHeadText={ModeThemes[theme].TableHeadText}>
                  <h2>Rewards</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol head sliceliquidityFirstLast manage TableHeadText={ModeThemes[theme].TableHeadText}> 
                  <h2>Manage</h2>
                </ClaimModalTableCol>
              </ClaimModalTableHead>


              <ClaimModalTableRow BorderStake={ModeThemes[theme].BorderStake}>
                <ClaimModalTableCol col sliceliquidityFirstLast textColor={ModeThemes[theme].ModalText}>
                  <div>
                    <img src={ETHCARD} alt="img" />
                    <img src={ETHCARD} alt="img" />
                  </div>
                  <h2>SLICE-ETH LP</h2>
                </ClaimModalTableCol>

                <ClaimModalTableCol col liquidityCol textColor={ModeThemes[theme].ModalText}>
                  <h2>MAY 1 2021</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol col liquidityCol staked textColor={ModeThemes[theme].ModalText}>
                  <h2><img src={Lock} alt="lock" /> 120.00</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol col liquidityCol textColor={ModeThemes[theme].ModalText}>
                  <h2>0 SLICE</h2>
                </ClaimModalTableCol>

                <ClaimModalTableCol col sliceliquidityFirstLast>
                  <ClaimModalTableBtn>
                    Claim
                  </ClaimModalTableBtn>
                </ClaimModalTableCol>
              </ClaimModalTableRow>

              <ClaimModalTableRow BorderStake={ModeThemes[theme].BorderStake}>
                <ClaimModalTableCol col sliceliquidityFirstLast textColor={ModeThemes[theme].ModalText}>
                  <div>
                    <img src={ETHCARD} alt="img" />
                    <img src={ETHCARD} alt="img" />
                  </div>
                  <h2>SLICE-ETH LP</h2>
                </ClaimModalTableCol>

                <ClaimModalTableCol col liquidityCol textColor={ModeThemes[theme].ModalText}>
                  <h2>MAY 1 2021</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol col liquidityCol staked textColor={ModeThemes[theme].ModalText}>
                  <h2><img src={Lock} alt="lock" /> 120.00</h2>
                </ClaimModalTableCol>
                <ClaimModalTableCol col liquidityCol textColor={ModeThemes[theme].ModalText}>
                  <h2>0 SLICE</h2>
                </ClaimModalTableCol>

                <ClaimModalTableCol col sliceliquidityFirstLast>
                  <ClaimModalTableBtn>
                    Claim
                  </ClaimModalTableBtn>
                </ClaimModalTableCol>
              </ClaimModalTableRow>
            </ClaimModalTableWrapper>
          </StakingModalContent>
        </StakingModalContentWrapper>
      </Modal>
    );
  };
  
  const stakingModal = () => {
    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={stakingModalStyles}
        closeTimeoutMS={200}
        shouldCloseOnOverlayClick={false}
        contentLabel='Claim'
        portalClassName="stakeModal"
      >
        <StakingModalContentWrapper height="454px" backgroundColor={ModeThemes[theme].ModalBackground}>
          <StakingModalContent height="454px">
            <StakingModalClose>
              <button onClick={closeModal}><img src={theme === "light" ? CloseModal : CloseModalWhite} alt="close"/></button>
            </StakingModalClose>

            <StakingModalContentSideWrapper>


              <StakingModalContentSide>
                <StakingModalContentSideTitle textColor={ModeThemes[theme].ModalText}>
                  <h2>Pool Info</h2>
                </StakingModalContentSideTitle>

                <StakingModalContentSideHeader BoxColor={ModeThemes[theme].BoxColor}>
                  <StakingModalContentSideHeaderImg>
                    <img src={ETHCARD} alt="img" />
                    <img src={ETHCARD} alt="img" />
                  </StakingModalContentSideHeaderImg>
                  <StakingModalContentSideHeaderText boxText={ModeThemes[theme].boxText} textColor={ModeThemes[theme].ModalText}>
                    <h2>Slice/ETH LP</h2>
                    <h2>0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd</h2>
                  </StakingModalContentSideHeaderText>
                </StakingModalContentSideHeader>
                <StakingModalContentSideHeaderBoxWrapper>
                  <StakingModalContentSideHeaderBox stake BoxColor={ModeThemes[theme].BoxColor} textColor={ModeThemes[theme].ModalText} BoxColorText={ModeThemes[theme].BoxColorText}>
                      <h2>APY</h2>
                      <h2>14%</h2>
                  </StakingModalContentSideHeaderBox>
                  <StakingModalContentSideHeaderBox stake BoxColor={ModeThemes[theme].BoxColor} textColor={ModeThemes[theme].ModalText} BoxColorText={ModeThemes[theme].BoxColorText}>
                      <h2>APY</h2>
                      <h2>14%</h2>
                  </StakingModalContentSideHeaderBox>
                  <StakingModalContentSideHeaderBox BoxColor={ModeThemes[theme].BoxColor} textColor={ModeThemes[theme].ModalText} BoxColorText={ModeThemes[theme].BoxColorText}>
                      <h2>APY</h2>
                      <h2>14%</h2>
                  </StakingModalContentSideHeaderBox>
                </StakingModalContentSideHeaderBoxWrapper>


                <StakeModalPoolTable>
                  <StakeModalPoolTableTitle textColor={ModeThemes[theme].ModalText}>
                    <h2>Your Stakes in this Pool</h2>
                  </StakeModalPoolTableTitle>
                  <StakeModalPoolTableHead>
                    <StakeModalPoolTableCol head stake TableHeadText={ModeThemes[theme].TableHeadText}> 
                        <h2>STAKED AMOUNT</h2>
                    </StakeModalPoolTableCol>
                    <StakeModalPoolTableCol head stake TableHeadText={ModeThemes[theme].TableHeadText}>
                        <h2>End date</h2>
                    </StakeModalPoolTableCol>
                    <StakeModalPoolTableCol head stake TableHeadText={ModeThemes[theme].TableHeadText}>
                        <h2>total locked</h2>
                    </StakeModalPoolTableCol>
                  </StakeModalPoolTableHead>
                </StakeModalPoolTable>

                <StakeModalPoolTableRow BorderStake={ModeThemes[theme].BorderStake}>
                  <StakeModalPoolTableCol col stake textColor={ModeThemes[theme].ModalText}>
                      <h2>MAY 30 2021</h2>
                  </StakeModalPoolTableCol>
                  <StakeModalPoolTableCol col stake textColor={ModeThemes[theme].ModalText}>
                      <h2>1030 SLICE</h2>
                  </StakeModalPoolTableCol>
                  <StakeModalPoolTableCol col stake textColor={ModeThemes[theme].ModalText}>
                      <h2><img src={LockLight} alt="img" />1030 SLICE</h2>
                  </StakeModalPoolTableCol>
                </StakeModalPoolTableRow>

                <StakeModalPoolTableRow BorderStake={ModeThemes[theme].BorderStake}> 
                  <StakeModalPoolTableCol col stake textColor={ModeThemes[theme].ModalText}>
                      <h2>MAY 30 2021</h2>
                  </StakeModalPoolTableCol>
                  <StakeModalPoolTableCol col stake textColor={ModeThemes[theme].ModalText}>
                      <h2>1030 SLICE</h2>
                  </StakeModalPoolTableCol>
                  <StakeModalPoolTableCol col stake textColor={ModeThemes[theme].ModalText}>
                      <h2><img src={LockLight} alt="img" />1030 SLICE</h2>
                  </StakeModalPoolTableCol>
                </StakeModalPoolTableRow>

                <StakeModalPoolTableRow BorderStake={ModeThemes[theme].BorderStake}>
                  <StakeModalPoolTableCol col stake textColor={ModeThemes[theme].ModalText}>
                      <h2>MAY 30 2021</h2>
                  </StakeModalPoolTableCol>
                  <StakeModalPoolTableCol col stake textColor={ModeThemes[theme].ModalText}>
                      <h2>1030 SLICE</h2>
                  </StakeModalPoolTableCol>
                  <StakeModalPoolTableCol col stake textColor={ModeThemes[theme].ModalText}>
                      <h2><img src={LockLight} alt="img" />1030 SLICE</h2>
                  </StakeModalPoolTableCol>
                </StakeModalPoolTableRow>
                








                
              </StakingModalContentSide>


              <BreakLink><span></span></BreakLink>


              <StakingModalContentSide>
                <StakingModalContentSideTitle textColor={ModeThemes[theme].ModalText}>
                  <h2>Manage</h2>
                </StakingModalContentSideTitle>

                <StakeModalFormWrapper stake textColor={ModeThemes[theme].ModalText} inputText={ModeThemes[theme].inputText}>
                  <h2>Amount of SLICE to stake: </h2>
                  <form>
                    <h2>You have 1,012,000 SLICE available to stake</h2>
                    <StakeModalFormInputWrapper textColor={ModeThemes[theme].ModalText} borderColor={ModeThemes[theme].borderInputColor}>
                      <StakeModalFormInput type="number" inputColor={ModeThemes[theme].BorderStake}/>
                      <div>
                        <img src={TrancheIcon} alt="" />
                        <h2>Slice</h2>
                      </div>
                    </StakeModalFormInputWrapper>
                    <EstimatedText textColor={ModeThemes[theme].ModalText} EstimatedTextColor={ModeThemes[theme].EstimatedColor}>
                      <h2>Estimated Rewards</h2>
                      <h2>You will get 1000 SLICE at the end of lockup</h2>
                    </EstimatedText>
                    <StakeModalFormBtn type="submit" stake>Stake</StakeModalFormBtn>
                  </form>
                </StakeModalFormWrapper>
              </StakingModalContentSide>



            </StakingModalContentSideWrapper>
           
          </StakingModalContent>
        </StakingModalContentWrapper>
      </Modal>
    );
  };
  
  const liquidityModal = () => {
    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={stakingModalStyles}
        closeTimeoutMS={200}
        shouldCloseOnOverlayClick={false}
        contentLabel='Claim'
        portalClassName="stakeModal"
      >
        <StakingModalContentWrapper height="454px" backgroundColor={ModeThemes[theme].ModalBackground}>
          <StakingModalContent height="454px">
            <StakingModalClose>
              <button onClick={closeModal}><img src={theme === "light" ? CloseModal : CloseModalWhite} alt="close"/></button>
            </StakingModalClose>

            <StakingModalContentSideWrapper>


              <StakingModalContentSide>
                <StakingModalContentSideTitle textColor={ModeThemes[theme].ModalText}>
                  <h2>Pool Info</h2>
                </StakingModalContentSideTitle>

                <StakingModalContentSideHeader BoxColor={ModeThemes[theme].BoxColor}>
                  <StakingModalContentSideHeaderImg>
                    <img src={ETHCARD} alt="img" />
                    <img src={ETHCARD} alt="img" />
                  </StakingModalContentSideHeaderImg>
                  <StakingModalContentSideHeaderText textColor={ModeThemes[theme].ModalText} boxText={ModeThemes[theme].boxText}>
                    <h2>Slice/ETH LP</h2>
                    <h2>0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd</h2>
                  </StakingModalContentSideHeaderText>
                </StakingModalContentSideHeader>
                <StakingModalContentSideHeaderBoxWrapper>
                  <StakingModalContentSideHeaderBox textColor={ModeThemes[theme].ModalText} BoxColor={ModeThemes[theme].BoxColor} BoxColorText={ModeThemes[theme].BoxColorText}>
                      <h2>APY</h2>
                      <h2>14%</h2>
                  </StakingModalContentSideHeaderBox>
                  <StakingModalContentSideHeaderBox textColor={ModeThemes[theme].ModalText} BoxColor={ModeThemes[theme].BoxColor} BoxColorText={ModeThemes[theme].BoxColorText}>
                      <h2>APY</h2>
                      <h2>14%</h2>
                  </StakingModalContentSideHeaderBox>
                </StakingModalContentSideHeaderBoxWrapper>


                <StakeModalPoolTable>
                  <StakeModalPoolTableTitle textColor={ModeThemes[theme].ModalText}>
                    <h2>Your Stakes in this Pool</h2>
                  </StakeModalPoolTableTitle>
                  <StakeModalPoolTableHead>
                    <StakeModalPoolTableCol head TableHeadText={ModeThemes[theme].TableHeadText}>
                        <h2>STAKED AMOUNT</h2>
                    </StakeModalPoolTableCol>
                    <StakeModalPoolTableCol head TableHeadText={ModeThemes[theme].TableHeadText}>
                        <h2>Deposit date</h2>
                    </StakeModalPoolTableCol>
                  </StakeModalPoolTableHead>
                </StakeModalPoolTable>

                <StakeModalPoolTableRow BorderStake={ModeThemes[theme].BorderStake}>
                  <StakeModalPoolTableCol col textColor={ModeThemes[theme].ModalText}>
                      <h2>MAY 30 2021</h2>
                  </StakeModalPoolTableCol>
                  <StakeModalPoolTableCol col textColor={ModeThemes[theme].ModalText}>
                      <h2>1030 SLICE</h2>
                  </StakeModalPoolTableCol>
                </StakeModalPoolTableRow>

                <StakeModalPoolTableRow BorderStake={ModeThemes[theme].BorderStake}>
                  <StakeModalPoolTableCol col textColor={ModeThemes[theme].ModalText}>
                      <h2>MAY 30 2021</h2>
                  </StakeModalPoolTableCol>
                  <StakeModalPoolTableCol col textColor={ModeThemes[theme].ModalText}>
                      <h2>1030 SLICE</h2>
                  </StakeModalPoolTableCol>
                </StakeModalPoolTableRow>

                <StakeModalPoolTableRow BorderStake={ModeThemes[theme].BorderStake}>
                  <StakeModalPoolTableCol col textColor={ModeThemes[theme].ModalText}>
                      <h2>MAY 30 2021</h2>
                  </StakeModalPoolTableCol>
                  <StakeModalPoolTableCol col textColor={ModeThemes[theme].ModalText}>
                      <h2>1030 SLICE</h2>
                  </StakeModalPoolTableCol>
                </StakeModalPoolTableRow>
                








                
              </StakingModalContentSide>


              <BreakLink><span></span></BreakLink>


              <StakingModalContentSide>
                <StakingModalContentSideTitle textColor={ModeThemes[theme].ModalText}>
                  <h2>Manage</h2>
                </StakingModalContentSideTitle>
                <StakeModalNavigationWrapper stakeModalBoxBackground={ModeThemes[theme].stakeBoxBackground} StakeModalNavigationBorder={ModeThemes[theme].StakeModalNavigationBorder}>
                  <StakeModalNavigationBtn stakeModalBoxShadow={ModeThemes[theme].stakeModalBoxShadow} stakeModalBoxBackground={ModeThemes[theme].stakeModalBoxBackground} StakeModalNavigationText={ModeThemes[theme].StakeModalNavigationText} onClick={() => setModalTypeVar("liqStake")} active={modalTypeVar === "liqStake"}>Stake</StakeModalNavigationBtn>
                  <StakeModalNavigationBtn  stakeModalBoxShadow={ModeThemes[theme].stakeModalBoxShadow} stakeModalBoxBackground={ModeThemes[theme].stakeModalBoxBackground}  StakeModalNavigationText={ModeThemes[theme].StakeModalNavigationText} onClick={() => setModalTypeVar("liqWithdraw")} active={modalTypeVar === "liqWithdraw"}>Withdraw</StakeModalNavigationBtn>
                </StakeModalNavigationWrapper>

                <StakeModalFormWrapper textColor={ModeThemes[theme].ModalText} inputText={ModeThemes[theme].inputText}> 
                  <h2>Amount of SLICE to Withdraw: </h2>
                  <form>
                    <h2>You have 1,012,000 SLICE available to withdraw</h2>
                    <StakeModalFormInputWrapper textColor={ModeThemes[theme].ModalText} borderColor={ModeThemes[theme].borderInputColor}>
                      <StakeModalFormInput type="number" inputColor={ModeThemes[theme].BorderStake}/>
                      <div>
                        <img src={TrancheIcon} alt="" />
                        <h2>Slice</h2>
                      </div>
                    </StakeModalFormInputWrapper>
                    <EstimatedText textColor={ModeThemes[theme].ModalText} EstimatedTextColor={ModeThemes[theme].EstimatedColor}>
                      <h2>Estimated Rewards</h2>
                      <h2>You will get 1000 SLICE per week </h2>
                    </EstimatedText>
                    <StakeModalFormBtn type="submit">Withdraw</StakeModalFormBtn>
                  </form>
                </StakeModalFormWrapper>
              </StakingModalContentSide>



            </StakingModalContentSideWrapper>
           
          </StakingModalContent>
        </StakingModalContentWrapper>
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
        portalClassName="notFound"
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

  const migrateStake = () => {
    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={MigrateStake}
        closeTimeoutMS={200}
        shouldCloseOnOverlayClick={false}
        contentLabel='Adjust'
        portalClassName="migrateStake"
      >
        <StakingModalContentWrapper height="373px" backgroundColor={ModeThemes[theme].ModalBackground} migrateStake>
          <StakingModalContent height="373px" textColor={ModeThemes[theme].ModalText} migrateStake>
            <StakingModalClose>
              <button onClick={closeModal}><img src={theme === "light" ? CloseModal : CloseModalWhite} alt="close"/></button>
            </StakingModalClose>
              <StakingModalContentSideTitle textColor={ModeThemes[theme].ModalText}>
                <h2>Withdraw Current Tokens</h2>
              </StakingModalContentSideTitle>
              <p>Tranche is migrating to new staking contracts which will require you to withdraw your tokens. In order to continue staking in SLICE Staking pools, please withdraw your current SLICE tokens and rewards in order to use them in SLICE staking pools.</p>
              <StakeModalFormWrapper migrateStake stake textColor={ModeThemes[theme].ModalText} inputText={ModeThemes[theme].inputText}>
                  <h2>You are withdrawing: </h2>
                  <form>
                    <StakeModalFormInputWrapper textColor={ModeThemes[theme].ModalText} borderColor={ModeThemes[theme].borderInputColor}>
                      <StakeModalFormInput MigrateInput={ModeThemes[theme].MigrateInput} migrateStake textColor={ModeThemes[theme].ModalText} type="number" inputColor={ModeThemes[theme].BorderStake}/>
                      <div>
                        <img src={TrancheIcon} alt="" />
                        <h2>Slice</h2>
                      </div>
                    </StakeModalFormInputWrapper>
                    <StakeModalFormBtn migrateStake type="submit">Withdraw</StakeModalFormBtn>
                  </form>
                </StakeModalFormWrapper>
            </StakingModalContent>
        </StakingModalContentWrapper>
                


        
      </Modal>
    );
  };
  
  

  

  return (
    modalType === "claim" ? claimModal() :
    modalType === "staking" ? stakingModal() :
    (modalTypeVar === "liqStake" || modalTypeVar === "liqWithdraw") ? liquidityModal() : 
    modalType === "withdrawTokens" ? migrateStake() :
    notFound()
  );
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
