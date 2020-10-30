import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Form, Field, reduxForm, getFormValues } from 'redux-form';
import { required, number, asyncValidateAdjust } from 'utils/validations';
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
    {touched && error ? (
      <input
        placeholder={placeholder}
        {...input}
        type={type}
        className={`${className} InputStylingError`}
      />
    ) : (
      <input {...input} type={type} className={`${className} InputStyling`} />
    )}
    {touched && error && <span></span>}
  </div>
);

let AdjustLoan = ({
  error,
  pristine,
  submitting,
  isAdjustSelected,
  setIsAdjustSelected,
  collateralTypeName,
  adjustLoan,
  newCollateralRatio,
  calcNewCollateralRatio,
  remainingLoan,
  cryptoFromLenderName,
  collateralAmount,
  collateralRatio,
  formValues
}) => {
  const [actionType, setActionType] = useState(); // true = adding; false = removing

  const searchArr = (collateral) => pairData.find((i) => i.collateral === collateral);

  const calcNewRatio = (collateralAmount) => {
    isAdjustSelected && calcNewCollateralRatio(collateralAmount, actionType);
  };

  const setAction = (type, collateralAmount) => {
    setIsAdjustSelected(true);
    setActionType(type);
    collateralAmount !== '' && calcNewCollateralRatio(collateralAmount, type);
  };

  return (
    <ModalNewLoanContent>
      <ModalNewLoanDetails>
        <ModalNewLoanDetailsContent adjustDetails={true}>
          <LoanDetailsRow>
            <LoanDetailsRowTitle>Loan amount</LoanDetailsRowTitle>

            <LoanDetailsRowValue>
              {remainingLoan} {cryptoFromLenderName}
            </LoanDetailsRowValue>
          </LoanDetailsRow>

          <LoanDetailsRow>
            <LoanDetailsRowTitle>Collateral amount</LoanDetailsRowTitle>

            <LoanDetailsRowValue>
              {collateralAmount} {collateralTypeName}
            </LoanDetailsRowValue>
          </LoanDetailsRow>

          <LoanDetailsRow>
            <LoanDetailsRowTitle>Collateral ratio</LoanDetailsRowTitle>

            <LoanDetailsRowValue>{collateralRatio}%</LoanDetailsRowValue>
          </LoanDetailsRow>

          <LoanDetailsRow newValue={true}>
            <LoanDetailsRowTitle>NEW COLLATERAL RATIO</LoanDetailsRowTitle>

            <LoanDetailsRowValue>{newCollateralRatio}%</LoanDetailsRowValue>
          </LoanDetailsRow>
        </ModalNewLoanDetailsContent>
      </ModalNewLoanDetails>

      <ModalAdjustForm className='modalAdjustFormStyle'>
        <Form component={ModalFormWrapper} onSubmit={(e) => adjustLoan(e, actionType)}>
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
                    onChange={(event, newValue) => calcNewRatio(newValue)}
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
            {!isAdjustSelected && (
              <>
                <BtnGrpLoanModal submitBtn={true}>
                  <ModalFormButton
                    adjustCollateralBtn={true}
                    onClick={() => setAction(true, formValues.collateralAmount)}
                  >
                    Add Collateral
                  </ModalFormButton>
                </BtnGrpLoanModal>
                <BtnGrpLoanModal submitBtn={true}>
                  <ModalFormButton
                    adjustCollateralBtn={true}
                    onClick={() => setAction(false, formValues.collateralAmount)}
                  >
                    Remove Collateral
                  </ModalFormButton>
                </BtnGrpLoanModal>
              </>
            )}
            {isAdjustSelected && (
              <BtnGrpLoanModal>
                <ModalFormButton type='submit' disabled={pristine || submitting || error}>
                  Confirm
                </ModalFormButton>
              </BtnGrpLoanModal>
            )}
          </ModalFormSubmit>
        </Form>
      </ModalAdjustForm>
    </ModalNewLoanContent>
  );
};

AdjustLoan = reduxForm({
  form: 'adjustLoan',
  asyncValidate: asyncValidateAdjust
})(AdjustLoan);

const mapStateToProps = (state) => ({
  initialValues: { collateralAmount: '' },
  formValues: getFormValues('adjustLoan')(state)
});

AdjustLoan = connect(mapStateToProps, {})(AdjustLoan);

export { AdjustLoan };
