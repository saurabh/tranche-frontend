import React, { useState } from 'react';
import { required, number, minValue0, maxValue100 } from 'utils/validations';
import { useDebouncedCallback } from 'utils/lodash';
import { assets } from 'config/constants';
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
} from '../Table/ModalComponents';
const renderInput = ({ meta: { touched, error, warning }, ...props }) => (
  <>
    <ModalFormInput {...props} />
    {touched &&
      ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
  </>
);
const renderInputAPY = ({ meta: { touched, error, warning }, ...props }) => (
  <>
    <ModalFormInputAPY {...props} />
    {touched &&
      ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
  </>
);


const renderInputNewLoan = ({meta: { touched, error, warning }, ...props}) => (
  <>
    <ModalFormInputNewLoan {...props} />
    {touched &&
      ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
  </>
)

let NewLoan = ({
  handleSubmit,
  calcMinCollateralAmount,
  calcMaxBorrowedAmount
}) => {
  const [pair, setPair] = useState(0);
  const [selectedCurrency, selectCurrency] = useState("dai");
  const [currencySelect, toggleCurrency] = useState(false);


  const toggleCurrencySelect =()=>{
    toggleCurrency(!currencySelect)
  }
  const handleCurrenySelect =(e)=>{
    e.preventDefault();
    selectCurrency(e.target.value);
    toggleCurrency(false);
  }
  const [debounceCalcMinCollateralAmount] = useDebouncedCallback(
    (pair, borrowedAskAmount) =>
      calcMinCollateralAmount(pair, borrowedAskAmount),
    500
  );

  const [debounceCalcMaxBorrowedAmount] = useDebouncedCallback(
    (pair, borrowedAskAmount) => calcMaxBorrowedAmount(pair, borrowedAskAmount),
    500
  );

  return (
    <div>
      <ModalAdjustForm>
        <Form component={ModalFormWrapper} onSubmit={handleSubmit}>
            
          <ModalFormGrpNewLoan>
              <NewLoanFormInput>
                  <NewLoanInputWrapper>
                          <ModalFormLabel htmlFor='BORROWINGInput'>BORROWING</ModalFormLabel>
                          <Field
                              name='borrowedAskAmount'
                              component={renderInputNewLoan}
                              validate={[required, number]}
                              onChange={(event, newValue) =>
                                debounceCalcMinCollateralAmount(pair, newValue)
                              }

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
            <Field component={renderInput}
              type='number'
              step='0.0001'
              id='COLLATERALIZINGInput'
              background={selectedCurrency === "dai" ? ETHFORM : JNT}
              onChange={(event, newValue) =>
                debounceCalcMaxBorrowedAmount(pair, newValue)
              }
              validate={[required, number]}
            />
            <h2>
                  COLLATERALIZATION RATIO: <span>250</span>%
            </h2>
          </ModalFormGrp>

          <ModalFormGrpNewLoan>
            <ModalFormLabel htmlFor='LOAN APYInput'>LOAN APY</ModalFormLabel>
            <Field component={renderInputAPY}
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
    </div>
  );
};

NewLoan = reduxForm({
  form: 'newLoan'
})(NewLoan);

NewLoan = connect(() => ({
  initialValues: { pairId: 0 }
}))(NewLoan);

export { NewLoan };