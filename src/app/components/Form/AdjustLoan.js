import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Form, Field, reduxForm, getFormValues, change } from 'redux-form';
import { useDebouncedCallback } from 'utils/lodash';
import { required, number, asyncValidateAdjust } from 'utils/validations';
import {
  BtnGrpLoanModal,
  LoanDetailsRow,
  LoanDetailsRowTitle,
  LoanDetailsRowValue
} from '../Modals/styles/ModalsComponents';

import {
  ModalFormGrp,
  ModalFormLabel,
  ModalFormSubmit,
  ModalAdjustForm,
  AdjustBtnsWrapper,
  FormInputsWrapper,
  ModalFormWrapper,
  ModalFormButton,
  NewLoanInputWrapper,
  NewLoanFormInput,
  ModalNewLoanContent,
  ModalNewLoanDetails,
  ModalNewLoanDetailsContent
} from './styles/FormComponents';

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
  loanId,
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
  change,
  adjustPositionToggle,
  setNewCollateralRatio
}) => {
  const [actionType, setActionType] = useState(); // true = adding; false = removing
  const [toggleInput, setToggleInput] = useState(false);
  const [newCollateralAmount, setNewCollateralAmount] = useState(0);
  const setContractAddress = useCallback(() => {
    change('contractAddress', contractAddress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractAddress]);
  const setLoanId = useCallback(() => {
    change('loanId', loanId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loanId]);

  const searchArr = (collateral) => pairData.find((i) => i.collateral === collateral);

  useEffect(() => {
    setContractAddress();
    setLoanId();
  }, [setContractAddress, setLoanId]);

  const [debounceCalcNewRatio] = useDebouncedCallback(
    (isAdjustSelected, collateralAmount, actionType) => {
      setNewCollateralAmount(collateralAmount);
      isAdjustSelected && calcNewCollateralRatio(collateralAmount, actionType);
    },
    500
  );

  const setAction = (type, collateralAmount) => {
    setToggleInput(true);
    setIsAdjustSelected(true);
    setActionType(type);
    change('actionType', type);
    collateralAmount !== '' && calcNewCollateralRatio(collateralAmount, type);
  };

  const adjustLoanHandler = (e, actionType) =>{
    e.preventDefault();
    setIsAdjustSelected(false);
    adjustPositionToggle(false);
    setNewCollateralRatio(0);
    adjustLoan(e, actionType);
  }

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
        <Form component={ModalFormWrapper} onSubmit={(e) => adjustLoanHandler(e, actionType)}>
          {toggleInput ? (
            <FormInputsWrapper>
              <ModalFormGrp currency={searchArr(collateralTypeName).collateral}>
                <NewLoanFormInput>
                  <NewLoanInputWrapper>
                    <ModalFormLabel htmlFor='COLLATERALIZINGInput'>
                      {actionType
                        ? 'Collateral Amount To Add'
                        : 'Collateral Amount To Remove'}
                    </ModalFormLabel>
                    <Field
                      component={InputField}
                      className={`ModalFormInput ${
                        'ModalFormInput' + searchArr(collateralTypeName).collateral
                      }`}
                      name='collateralAmount'
                      onChange={(event, newValue) => debounceCalcNewRatio(isAdjustSelected, newValue, actionType)}
                      validate={[required, number]}
                      type='number'
                      id='COLLATERALIZINGInput'
                      step='0.0001'
                    />
                  </NewLoanInputWrapper>
                </NewLoanFormInput>
              </ModalFormGrp>
            </FormInputsWrapper>
          ) : (
            ''
          )}
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
                <ModalFormButton
                  type='submit'
                  disabled={
                    pristine ||
                    submitting ||
                    error ||
                    !newCollateralAmount
                  }
                >
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
    contractAddress: '',
    loanId: '',
    collateralAmount: '',
    actionType: ''
  },
  formValues: getFormValues('adjustLoan')(state)
});

AdjustLoan = connect(mapStateToProps, { change })(AdjustLoan);

export { AdjustLoan };
