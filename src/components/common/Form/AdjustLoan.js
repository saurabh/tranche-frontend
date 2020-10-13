import React from 'react';
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
  ModalFormButton,
  NewLoanInputWrapper,
  NewLoanFormInput,
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
})(AdjustLoan);

export { AdjustLoan };
