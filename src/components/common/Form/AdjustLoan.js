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
  FormInputsWrapper,
  ModalFormButton,
  NewLoanInputWrapper,
  NewLoanFormInput,
} from '../Modals/ModalComponents';
import { pairData } from 'config/constants'

const InputField = ({
  input,
  type,
  placeholder,
  className,
  meta: { touched, error }
}) => (
  <div>    
    {
    (touched && error) ? <input placeholder={placeholder} {...input} type={type} style={{boxShadow: "inset 0 0 3px red"}} className={className} /> :
    <input {...input} type={type} style={{border: "1px solid #ffffff"}} className={className} />
    }
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
      </span>
    )}
  </div>
);

let AdjustLoan = ({ collateralTypeName, addCollateral, newCollateralRatio, calcNewCollateralRatio }) => {

  const searchArr = (collateral) => pairData.find((i) => i.collateral === collateral);

  const [debounceCalcNewCollateralRatio] = useDebouncedCallback(
    (collateralAmount) => calcNewCollateralRatio(collateralAmount),
    500
  );

  return (
    <div>
      <ModalAdjustForm style={{minHeight: "auto"}}>
        <Form component={ModalFormWrapper} onSubmit={e => addCollateral(e)}>
          <FormInputsWrapper>
          <ModalFormGrp currency={searchArr(collateralTypeName).collateral}>
            <NewLoanFormInput>
              <NewLoanInputWrapper>
                <ModalFormLabel htmlFor='COLLATERALIZINGInput'>New Collateral Amount</ModalFormLabel>
                <Field
                  component={InputField}
                  className={`ModalFormInput ${'ModalFormInput' + searchArr(collateralTypeName).collateral}`}
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
          </FormInputsWrapper>
          <ModalFormSubmit>
            <BtnGrpLoanModal>
              <ModalFormButton onClick={addCollateral}>Adjust Loan</ModalFormButton>
            </BtnGrpLoanModal>
          </ModalFormSubmit>
        </Form>
      </ModalAdjustForm>
    </div>
  );
};

AdjustLoan = reduxForm({
  form: 'adjustLoan',
})(AdjustLoan);

export { AdjustLoan };
