import React, { useState } from 'react';
import { required, number, minValue0, maxValue100, validate } from 'utils/validations';
import { useDebouncedCallback } from 'utils/lodash';
import { assets } from 'config/constants';
import CloseModal from 'assets/images/svg/closeModal.svg';
import DAI from 'assets/images/svg/dai.svg';
import { Form, Field, reduxForm } from 'redux-form';
import USDC from 'assets/images/svg/usdc.svg';
import selectUp from 'assets/images/svg/selectUp.svg';
import selectDown from 'assets/images/svg/selectDown.svg';
import ETHFORM from 'assets/images/svg/EthForm.svg';
import JNT from 'assets/images/svg/jnt.svg';
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
} from '../Modals/ModalComponents';

const InputField = ({
  input,
  type,
  placeholder,
  className,
  meta: { touched, error }
}) => (
  <div>
    <input {...input} placeholder={placeholder} type={type} className={className} />
    {touched && error && (
      <span
        style={{
          position: 'absolute',
          top: '0',
          right: '0',
          color: 'red',
          fontStyle: 'normal',
          fontWeight: '300',
          fontSize: '9px'
        }}
      >
        {error}
      </span>
    )}
  </div>
);

let AdjustLoan = ({ addCollateral, newCollateralRatio, calcNewCollateralRatio }) => {
  const [debounceCalcNewCollateralRatio] = useDebouncedCallback(
    (collateralAmount) => calcNewCollateralRatio(collateralAmount),
    500
  );

  return (
    <div>
      <ModalAdjustForm style={{minHeight: "auto"}}>
        <Form component={ModalFormWrapper} onSubmit={addCollateral}>
          <ModalFormGrp currency="ETH">
            <NewLoanFormInput>
              <NewLoanInputWrapper>
                <ModalFormLabel htmlFor='COLLATERALIZINGInput'>ADD COLLATERAL</ModalFormLabel>
                <Field
                  component={InputField}
                  className='ModalFormInput ModalFormInputETH'
                  name='collateralAmount'
                  onChange={(event, newValue) => debounceCalcNewCollateralRatio(newValue)}
                  validate={[required, number]}
                  type='number'
                  id='COLLATERALIZINGInput'
                  step='0.0001'
                />
              </NewLoanInputWrapper>
            </NewLoanFormInput> 
            <h2>
              NEW COLLATERAL RATIO: <span>{newCollateralRatio}</span>
            </h2>
          </ModalFormGrp>
         
        </Form>
      </ModalAdjustForm>

      <ModalFormSubmit>
        <BtnGrpLoanModal>
          <ModalFormButton onClick={addCollateral}>Adjust Loan</ModalFormButton>
        </BtnGrpLoanModal>
      </ModalFormSubmit>
    </div>
  );
};

AdjustLoan = reduxForm({
  form: 'adjustLoan',
  validate
})(AdjustLoan);

export { AdjustLoan };
