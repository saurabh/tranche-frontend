import React, { useState } from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import CloseModal from 'assets/images/svg/closeModal.svg';
import DAI from 'assets/images/svg/dai.svg';
import { Form, Field, reduxForm } from 'redux-form';
import JEUR from 'assets/images/svg/jeur.svg';
import selectUp from 'assets/images/svg/selectUp.svg';
import selectDown from 'assets/images/svg/selectDown.svg';
import ETHFORM from  "assets/images/svg/EthForm.svg";
import JNT from  "assets/images/svg/jnt.svg";

import { statuses } from '../../../config/constants';
import {
  ModalHeader,
  ModalContent,
  BtnGrpLoanModal,
  ModalButton,
  ConfirmAlertWrapper,
  ConfirmAlertBtnWrapper,
  ModalAdjustForm,
  ModalFormWrapper,
  ModalFormGrp,
  ModalFormLabel,
  ModalFormInput,
  ModalFormSubmit,
  ModalFormButton,
  SelectCurrencyOption,
  SelectCurrencyView,
  SelectCurrencyOptions,
  ModalFormGrpNewLoan,
  ModalFormInputNewLoan,
  NewLoanInputWrapper,
  LoanCustomSelect,
  NewLoanFormInput,
  SelectChevron,
  ModalFormInputAPY
} from './ModalComponents';
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
    maxWidth: '292px',
    width: '100%',
    //height: '326px',
    height: 'auto',
    borderRadius: '16px',
    border: 'none',
    boxShadow: '0px 2px 4px rgba(99, 99, 99, 0.7)',
    padding: '0',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0'
  }
};
const AdjustPositionStyles = {
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
    minHeight: '326px',
    height: 'auto',
    borderRadius: '16px',
    border: 'none',
    boxShadow: '0px 2px 4px rgba(99, 99, 99, 0.7)',
    padding: '0',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0'
  }
};

Modal.setAppElement('#root');

let ModalLoan = ({
  modalIsOpen,
  closeModal,
  path,
  status
}) => {
  
    const [selectedCurrency, selectCurrency] = useState("dai");
    const [currencySelect, toggleCurrency] = useState(false);


  const modalClose = () => {
    closeModal();
  };
  const toggleCurrencySelect =()=>{
    toggleCurrency(!currencySelect)
  }
  const handleCurrenySelect =(e)=>{
    e.preventDefault();
    selectCurrency(e.target.value);
    toggleCurrency(false);
  }
  const borrowModal = () => {
    return (
      <div>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={AdjustPositionStyles}
            shouldCloseOnOverlayClick={false}
            contentLabel='NewLoan'
          >
            <ModalHeader>
              <h2>New Loan</h2>
              <button onClick={() => modalClose()}>
                <img src={CloseModal} alt='' />
              </button>
            </ModalHeader>
            <ModalAdjustForm>
              <Form component={ModalFormWrapper}>
                <ModalFormGrpNewLoan>
                    <NewLoanFormInput>
                        <NewLoanInputWrapper>
                                <ModalFormLabel htmlFor='BORROWINGInput'>BORROWING</ModalFormLabel>
                                <ModalFormInputNewLoan
                                    type='number'
                                    step='0.0001'
                                    id='BORROWINGInput'
                                    style={{maxWidth: "120px"}}
                                />
                        </NewLoanInputWrapper>
                        <LoanCustomSelect>
                            <SelectCurrencyView onClick={() => toggleCurrencySelect()}>
                                {
                                    selectedCurrency === "dai" ?
                                    <div>
                                        <img src={DAI} alt=""/>
                                        <h2>DAI</h2>
                                    </div> :
                                    selectedCurrency === "jeur" ?
                                    <div>
                                        <img src={JEUR} alt=""/>
                                        <h2>JEUR</h2>
                                    </div> : ""
                                }

                                <SelectChevron>
                                  <img src={selectUp} alt=""/>
                                  <img src={selectDown} alt=""/>
                                </SelectChevron>
                                
                            </SelectCurrencyView>
                            {
                                currencySelect ? 
                                <SelectCurrencyOptions>
                                    <SelectCurrencyOption>
                                        <button onClick={(e) => handleCurrenySelect(e)} value="dai"><img src={DAI} alt=""/> DAI</button>
                                    </SelectCurrencyOption>  
                                    <SelectCurrencyOption>
                                        <button onClick={(e) => handleCurrenySelect(e)} value="jeur"><img src={JEUR} alt=""/> JEUR</button>
                                    </SelectCurrencyOption>
                                </SelectCurrencyOptions> : ""
                            }
                            
                        </LoanCustomSelect>
                    
                    </NewLoanFormInput>
                    <h2>
                        MINIMUM COLLATERAL: <span>42,201.20</span> ETH
                    </h2>

                </ModalFormGrpNewLoan>
              
                <ModalFormGrp currency={selectedCurrency === "dai" ? "ETH" : "JNT"}>
                  <ModalFormLabel htmlFor='COLLATERALIZINGInput'>COLLATERALIZING</ModalFormLabel>
                  <Field component={ModalFormInput}
                    type='number'
                    step='0.0001'
                    id='COLLATERALIZINGInput'
                    background={selectedCurrency === "dai" ? ETHFORM : JNT}
                  />
                  <h2>
                        COLLATERALIZATION RATIO: <span>250</span>%
                  </h2>
                </ModalFormGrp>

                <ModalFormGrpNewLoan>
                  <ModalFormLabel htmlFor='LOAN APYInput'>LOAN APY</ModalFormLabel>
                  <Field component={ModalFormInputAPY}
                    type='number'
                    step='0.0001'
                    id='LOAN APYInput'
                  />
                </ModalFormGrpNewLoan>
              </Form>
            </ModalAdjustForm>

            
            <ModalFormSubmit>
              <BtnGrpLoanModal>
                <ModalFormButton>Open Loan</ModalFormButton>
              </BtnGrpLoanModal>
            </ModalFormSubmit>
          </Modal>
        
      </div>
    );
  };
  return path === 'borrow'
    ? borrowModal()
    : false;
}

ModalLoan = reduxForm({
  form: 'ModalLoan'
})(ModalLoan);

ModalLoan = connect(() => ({
  initialValues: { pairId: 0 }
}))(ModalLoan);

export default ModalLoan;