import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Form, Field, reduxForm, getFormValues, change } from 'redux-form';
import _ from 'lodash';
import { loanAllowanceCheck } from 'services/contractMethods';
import { roundNumber } from 'utils';
import { required, number, asyncValidateAdjust } from 'utils/validations';
import { pairData } from 'config/constants';
import {
  BtnGrpLoanModal,
  LoanDetailsRow,
  LoanDetailsRowTitle,
  LoanDetailsRowValue,
  BtnLoadingIcon
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

const InputField = ({ input, type, placeholder, className, meta: { touched, error } }) => (
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
  ethereum: { address, web3 },
  // Redux-form
  pristine,
  submitting,
  formValues,
  change,
  // State Values
  isAdjustSelected,
  adjustPositionToggle,
  approveLoading,
  hasAllowance,
  newCollateralRatio,
  setIsAdjustSelected,
  setNewCollateralRatio,
  setHasAllowance,
  // Functions
  loanApproveContract,
  adjustLoan,
  calcNewCollateralRatio,
  // API Values
  loanId,
  pairId,
  remainingLoan,
  cryptoFromLenderName,
  collateralAmount,
  collateralTypeName,
  collateralRatio
}) => {
  const [actionType, setActionType] = useState(); // true = adding; false = removing
  const [toggleInput, setToggleInput] = useState(false);
  const [newCollateralAmount, setNewCollateralAmount] = useState(0);

  const setLoanId = useCallback(() => {
    change('loanId', loanId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loanId]);

  useEffect(() => {
    if (pairId === 1) {
      setHasAllowance(false);
    } else {
      setHasAllowance(true);
    }
  }, [pairId, setHasAllowance]);

  useEffect(() => {
    setLoanId();
  }, [setLoanId]);

  const debounceCalcNewRatio = useCallback(
    _.debounce((collateralAmount, actionType) => {
      calcNewCollateralRatio(collateralAmount, actionType);
    }, 500),
    []
  );

  const debounceAllowanceCheck = useCallback(
    _.debounce(async (collateralAmount) => {
      if (pairId === 1) {
        const allowanceResult = await loanAllowanceCheck(pairId, collateralAmount, true);
        setHasAllowance(allowanceResult);
      }
    }, 500),
    []
  );

  const handleCollateralizingChange = async (collateralAmount, actionType) => {
    try {
      setNewCollateralAmount(collateralAmount);
      debounceCalcNewRatio(collateralAmount, actionType);
      if (collateralAmount !== '' && actionType) debounceAllowanceCheck(collateralAmount);
    } catch (error) {
      console.error(error);
    }
  };

  const setAction = async (type, collateralAmount) => {
    setToggleInput(true);
    setIsAdjustSelected(true);
    setActionType(type);
    change('actionType', type);
    collateralAmount !== '' && calcNewCollateralRatio(collateralAmount, type);
  };

  const adjustLoanHandler = (e, actionType) => {
    e.preventDefault();
    setIsAdjustSelected(false);
    adjustPositionToggle(false);
    setNewCollateralRatio(0);
    adjustLoan(e, actionType);
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
              {roundNumber(collateralAmount)} {collateralTypeName}
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
              <ModalFormGrp currency={pairData[pairId].collateral}>
                <NewLoanFormInput>
                  <NewLoanInputWrapper>
                    <ModalFormLabel htmlFor='COLLATERALIZINGInput'>
                      {actionType ? 'Collateral Amount To Add' : 'Collateral Amount To Remove'}
                    </ModalFormLabel>
                    <Field
                      component={InputField}
                      className={`ModalFormInput ${'ModalFormInput' + pairData[pairId].collateral}`}
                      name='collateralAmount'
                      onChange={(event, newValue) =>
                        handleCollateralizingChange(newValue, actionType)
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
          ) : (
            ''
          )}
          <ModalFormSubmit adjustBtns={true}>
            {!isAdjustSelected && (
              <>
                <h2>Would you like to add or remove collateral?</h2>
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
              </>
            )}
            {isAdjustSelected && (
              <BtnGrpLoanModal confirmBtn={true}>
                {actionType && cryptoFromLenderName === 'USDC' ? (
                  <ModalFormButton
                    type='button'
                    onClick={() => loanApproveContract(pairId, formValues.collateralAmount, true)}
                    approveBtn={true}
                    loading={approveLoading ? 'true' : ''}
                    approved={hasAllowance}
                  >
                    {!hasAllowance && !approveLoading ? (
                      <h2>Approve</h2>
                    ) : !hasAllowance && approveLoading ? (
                      <div className='btnLoadingIconWrapper'>
                        <div className='btnLoadingIconCut'>
                          <BtnLoadingIcon loadingColor='#936CE6'></BtnLoadingIcon>
                        </div>
                      </div>
                    ) : hasAllowance && !approveLoading ? (
                      <h2>
                        <span></span> Approved
                      </h2>
                    ) : (
                      ''
                    )}
                  </ModalFormButton>
                ) : (
                  ''
                )}

                <ModalFormButton
                  type='submit'
                  disabled={
                    pristine ||
                    submitting ||
                    !newCollateralAmount ||
                    !hasAllowance ||
                    Number(formValues.collateralAmount) <= 0 ||
                    (!actionType && newCollateralRatio < 160)
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
  ethereum: state.ethereum,
  initialValues: {
    loanId: '',
    collateralAmount: '',
    actionType: ''
  },
  formValues: getFormValues('adjustLoan')(state)
});

AdjustLoan = connect(mapStateToProps, { change })(AdjustLoan);

export { AdjustLoan };
