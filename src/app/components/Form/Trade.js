import React from 'react';
import { connect } from 'react-redux';
import { Form, Field, reduxForm, getFormValues, change } from 'redux-form';
import { setTokenBalances } from 'redux/actions/ethereum';
import { pairData } from 'config/constants';
import { validate, asyncValidateCreate } from 'utils/validations';
import {
  BtnLoanModal
} from '../Modals/styles/ModalsComponents';

import {
  ModalFormGrp,
  ModalFormLabel,
  ModalFormWrapper,
  ModalAdjustForm,
  ModalFormGrpNewLoan,
  ModalFormSubmit,
  FormInputsWrapper,
  ModalFormButton,
  NewLoanInputWrapper,
  NewLoanFormInput,
} from './styles/FormComponents';

const InputField = ({ input, type, className, meta: { touched, error } }) => (
  <div>
    {touched && error ? (
      <input {...input} type={type} className={`${className} InputStylingError`} />
    ) : (
      <input {...input} type={type} className={`${className} InputStyling`} />
    )}
    {touched && error && <span></span>}
  </div>
);

let TradeForm = () => {


  return (
      <ModalAdjustForm>
        <Form component={ModalFormWrapper} 
        // onSubmit={(e) => createNewLoan(e)}
        >
          <FormInputsWrapper trade={true}>
            <ModalFormGrpNewLoan trade={true}>
              <NewLoanFormInput>
                <NewLoanInputWrapper name='borrowedAskAmount'>
                  <ModalFormLabel htmlFor='BORROWINGInput'>PRICE</ModalFormLabel>
                  <Field
                    component={InputField}
                    className='ModalFormInputNewLoan tradeFormInput'
                    name='borrowedAskAmount'
                    // onChange={(e, newValue) =>
                    //   handleBorrowingChange(pair, newValue, formValues.collateralAmount)
                    // }
                    type='number'
                    step='0.0001'
                    id='BORROWINGInput'
                  />
                </NewLoanInputWrapper>

                
              </NewLoanFormInput>
              <h2>
                {/* BORROW LIMIT: ~{' '} */}
                {/* {(maxBorrowedAskAmount
                  ? roundNumber(maxBorrowedAskAmount) !== 'NaN'
                    ? roundNumber(maxBorrowedAskAmount)
                    : 0
                  : 0) +
                  ' ' +
                  pairData[pair].text} */}
              </h2>
            </ModalFormGrpNewLoan>

            <ModalFormGrp cursor='pointer' trade={true}>
              <ModalFormLabel htmlFor='COLLATERALIZINGInput'>SHARES</ModalFormLabel>
              <Field
                component={InputField}
                className='ModalFormInput tradeFormInput'
                name='collateralAmount'
                // onChange={(e, newValue) =>
                //   handleCollateralizingChange(formValues.borrowedAskAmount, newValue)
                // }
                type='number'
                step='0.0001'
                id='COLLATERALIZINGInput'
              />
              <h2 
            //   onClick={() => setCollateralAmount(formValues.borrowedAskAmount)}
              >
                {/* MINIMUM COLLATERAL:{' '} */}
                <span>
                  {/* {minCollateralAmount ? roundNumber(minCollateralAmount) : 0}{' '} */}
                  {/* {pairData[pair].collateral} */}
                </span>
              </h2>
            </ModalFormGrp>
          </FormInputsWrapper>

          <ModalFormSubmit>
            <BtnLoanModal>
              <ModalFormButton
                type='submit'
                // disabled={
                // //   pristine ||
                //   submitting ||
                //   !borrowAsk ||
                //   !collateralValue ||
                //   isLessThan(Number(collateralValue), Number(minCollateralAmount)) ||
                //   !rpb ||
                //   !hasAllowance
                // }
              >
                <h2>ACTION</h2>
              </ModalFormButton>
            </BtnLoanModal>
          </ModalFormSubmit>
        </Form>
      </ModalAdjustForm>
  );
};

TradeForm = reduxForm({
  form: 'newLoan',
  validate,
  asyncValidate: asyncValidateCreate,
  asyncChangeFields: ['borrowedAskAmount', 'collateralAmount'],
  enableReinitialize: true
})(TradeForm);

const mapStateToProps = (state) => ({
  ethereum: state.ethereum,
  initialValues: { pairId: pairData[0].value, rpbRate: 0 },
  formValues: getFormValues('newLoan')(state)
});

export default TradeForm = connect(mapStateToProps, { change, setTokenBalances })(TradeForm);