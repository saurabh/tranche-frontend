import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Form, Field, reduxForm, getFormValues, change } from 'redux-form';
import { required, number, asyncValidateAdjust } from 'utils/validations';
import {
  BtnGrpLoanModal,
  ModalAdjustForm,
  ModalFormWrapper,
  ModalFormGrp,
  ModalFormLabel,
  ModalFormSubmit,
  AdjustBtnsWrapper,
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
  contractAddress,
  collateralTypeName,
  adjustLoan,
  newCollateralRatio,
  calcNewCollateralRatio,
  remainingLoan,
  cryptoFromLenderName,
  collateralAmount,
  collateralRatio,
  formValues,
  change
}) => {
  const [actionType, setActionType] = useState(); // true = adding; false = removing
  const [toggleInput, setToggleInput] = useState(false);
  const [addedRemovedCollateral, setAddedRemovedCollateral] = useState(0);
  const setContractAddress = useCallback(() => {
    change('contractAddress', contractAddress);
  }, [contractAddress]);
  const setCollateralTypeName = useCallback(() => {
    change('collateralTypeName', collateralTypeName);
  }, [collateralTypeName]);

  const searchArr = (collateral) => pairData.find((i) => i.collateral === collateral);

  useEffect(() => {
    setContractAddress();
    setCollateralTypeName();
  }, [setContractAddress, setCollateralTypeName]);

  const calcNewRatio = (collateralAmount) => {
    setAddedRemovedCollateral(collateralAmount);
    isAdjustSelected && calcNewCollateralRatio(collateralAmount, actionType);
  };

  const setAction = (type, collateralAmount) => {
    setToggleInput(true);
    setIsAdjustSelected(true);
    setActionType(type);
    change('actionType', type);
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
            <LoanDetailsRowTitle>New Collateralization Ratio</LoanDetailsRowTitle>

            <LoanDetailsRowValue>{newCollateralRatio}%</LoanDetailsRowValue>
          </LoanDetailsRow>
        </ModalNewLoanDetailsContent>
      </ModalNewLoanDetails>

      <ModalAdjustForm className='modalAdjustFormStyle'>
        
        <Form component={ModalFormWrapper} onSubmit={(e) => adjustLoan(e, actionType)}>
        {
          toggleInput ?
          <FormInputsWrapper>
            <ModalFormGrp currency={searchArr(collateralTypeName).collateral}>
              <NewLoanFormInput>
                <NewLoanInputWrapper>
                  <ModalFormLabel htmlFor='COLLATERALIZINGInput'>
                    {actionType ? "Collateral Amount To Add" : "Collateral Amount To Remove"}
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
          </FormInputsWrapper> : ""
        }
          <ModalFormSubmit adjustBtns={true}>
            <h2>Would you like to add or remove collateral?</h2>
            {!isAdjustSelected && (
              <AdjustBtnsWrapper>
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
              </AdjustBtnsWrapper>
            )}
            {isAdjustSelected && (
              <BtnGrpLoanModal>
                <ModalFormButton type='submit' disabled={pristine || submitting || error || !addedRemovedCollateral || newCollateralRatio < 150}>
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
  initialValues: {
    collateralAmount: '',
    actionType: '',
    collateralTypeName: '',
    contractAddress: ''
  },
  formValues: getFormValues('adjustLoan')(state)
});

AdjustLoan = connect(mapStateToProps, { change })(AdjustLoan);

export { AdjustLoan };
