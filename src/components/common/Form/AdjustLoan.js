import React, { useState } from 'react';
import { required, number } from 'utils/validations';
import { useDebouncedCallback } from 'utils/lodash';
import { Form, Field, reduxForm } from 'redux-form';
import {
  BtnGrpLoanModal,
  ModalAdjustForm,
  ModalFormWrapper,
  ModalFormGrp,
  ModalFormLabel,
  ModalFormSubmit,
  FormInputsWrapper,
  ModalFormButton,
  NewLoanInputWrapper,
  NewLoanFormInput,
  ModalNewLoanContent,
  ModalNewLoanDetails,
  ModalNewLoanDetailsContent,
  LoanDetailsRow,
  LoanDetailsRowTitle,
  LoanDetailsRowValue
} from '../Modals/ModalComponents';
import { pairData } from 'config/constants';

const InputField = ({
  input,
  type,
  placeholder,
  className,
  meta: { touched, error }
}) => (
  <div>    
    {
    (touched && error) ? <input placeholder={placeholder} {...input} type={type} className={className + " " + "InputStylingError"} /> :
    <input {...input} type={type} className={className + " " + "InputStyling"} />
    }
    {touched && error && (
      <span>
      </span>
    )}
  </div>
);

let AdjustLoan = ({
  collateralTypeName,
  adjustLoan,
  newCollateralRatio,
  calcNewCollateralRatio,
  remainingLoan,
  cryptoFromLenderName,
  collateralAmount,
  collateralRatio
}) => {
  const [isConfirmButton, setIsConfirmButton] = useState(false);
  const [adjustAction, setAdjustAction] = useState('');
  const searchArr = (collateral) => pairData.find((i) => i.collateral === collateral);

  const [debounceCalcNewCollateralRatio] = useDebouncedCallback(
    (collateralAmount) => calcNewCollateralRatio(collateralAmount),
    500
  );

  const setAction = (type) => {
    setAdjustAction(type);
    setIsConfirmButton(true);
  };
  
  return (
    <ModalNewLoanContent>



    <ModalNewLoanDetails>
        <ModalNewLoanDetailsContent adjustDetails={true}>
            <LoanDetailsRow>
              <LoanDetailsRowTitle>
                Loan amount
              </LoanDetailsRowTitle>

              <LoanDetailsRowValue>
                {remainingLoan} {cryptoFromLenderName}
              </LoanDetailsRowValue>

            </LoanDetailsRow>

            <LoanDetailsRow>
              <LoanDetailsRowTitle>
                Collateral amount
              </LoanDetailsRowTitle>

              <LoanDetailsRowValue>
                {collateralAmount} {collateralTypeName}
              </LoanDetailsRowValue>

            </LoanDetailsRow>

            <LoanDetailsRow>
              <LoanDetailsRowTitle>
                Collateral ratio
              </LoanDetailsRowTitle>

              <LoanDetailsRowValue>
                {collateralRatio}%
              </LoanDetailsRowValue>

            </LoanDetailsRow>


            <LoanDetailsRow newValue={true}>
              <LoanDetailsRowTitle>
                NEW COLLATERAL RATIO
              </LoanDetailsRowTitle>

              <LoanDetailsRowValue>
                {newCollateralRatio}%
              </LoanDetailsRowValue>

            </LoanDetailsRow>
          </ModalNewLoanDetailsContent>

      </ModalNewLoanDetails>




      <ModalAdjustForm className="modalAdjustFormStyle">
        <Form component={ModalFormWrapper}>
          <FormInputsWrapper>
            <ModalFormGrp currency={searchArr(collateralTypeName).collateral}>
              <NewLoanFormInput>
                <NewLoanInputWrapper>
                  <ModalFormLabel htmlFor='COLLATERALIZINGInput'>
                    New Collateral Amount
                  </ModalFormLabel>
                  <Field
                    component={InputField}
                    className={`ModalFormInput ${
                      'ModalFormInput' + searchArr(collateralTypeName).collateral
                    }`}
                    name='collateralAmount'
                    onChange={(event, newValue) =>
                      debounceCalcNewCollateralRatio(newValue)
                    }
                    validate={[required, number]}
                    type='number'
                    id='COLLATERALIZINGInput'
                    step='0.0001'
                  />
                </NewLoanInputWrapper>
              </NewLoanFormInput>
              
            </ModalFormGrp>
          </FormInputsWrapper>
          <ModalFormSubmit>
            {!isConfirmButton && (
              <>
                <BtnGrpLoanModal submitBtn={true}>
                  <ModalFormButton adjustCollateralBtn={true} onClick={() => setAction('addCollateral')}>
                    Add Collateral
                  </ModalFormButton>
                </BtnGrpLoanModal>
                <BtnGrpLoanModal submitBtn={true}>
                  <ModalFormButton adjustCollateralBtn={true} onClick={() => setAction('removeCollateral')}>
                    Remove Collateral
                  </ModalFormButton>
                </BtnGrpLoanModal>
              </>
            )}
            {isConfirmButton && (
              <BtnGrpLoanModal>
                <ModalFormButton type='submit'>Confirm</ModalFormButton>
              </BtnGrpLoanModal>
            )}
          </ModalFormSubmit>
        </Form>
      </ModalAdjustForm>
    </ModalNewLoanContent>
  );
};

AdjustLoan = reduxForm({
  form: 'adjustLoan'
})(AdjustLoan);

export { AdjustLoan };
