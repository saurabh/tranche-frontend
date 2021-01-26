import React from 'react';
import { connect } from 'react-redux';
import { Form, Field, reduxForm, getFormValues, change } from 'redux-form';
import { setTokenBalances } from 'redux/actions/ethereum';
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

let TradeForm = ({ sellProtocol, offerMarket, sellToProtocol }) => {

  return (
      <ModalAdjustForm>
        {
          offerMarket ?
              <Form component={ModalFormWrapper}>
                <FormInputsWrapper trade={true}>
                  <ModalFormGrpNewLoan trade={true}>
                    <NewLoanFormInput>
                      <NewLoanInputWrapper name='price'>
                        <ModalFormLabel htmlFor='price'>PRICE</ModalFormLabel>
                        <Field
                          component={InputField}
                          className='ModalFormInputNewLoan tradeFormInput'
                          name='price'
                          type='number'
                          step='0.0001'
                        />
                      </NewLoanInputWrapper>                      
                    </NewLoanFormInput>
                    <h2>
                      
                    </h2>
                  </ModalFormGrpNewLoan>

                  <ModalFormGrp cursor='pointer' trade={true}>
                    <ModalFormLabel htmlFor='numberOfShares'>SHARES</ModalFormLabel>
                    <Field
                      component={InputField}
                      className='ModalFormInput tradeFormInput'
                      name='numberOfShares'
                      type='number'
                      step='0.0001'
                    />
                    <h2>
                      
                      <span>
                        
                      </span>
                    </h2>
                  </ModalFormGrp>
                </FormInputsWrapper>

                <ModalFormSubmit>
                  <BtnLoanModal>
                    <ModalFormButton type='submit'>
                      <h2>SELL</h2>
                    </ModalFormButton>
                  </BtnLoanModal>
                </ModalFormSubmit>
              </Form> : 

        <Form component={ModalFormWrapper}>
          <FormInputsWrapper trade={true}>
            <ModalFormGrpNewLoan trade={true}>
              <NewLoanFormInput>
                <NewLoanInputWrapper name='numberOfShares'>
                  <ModalFormLabel htmlFor='numberOfShares'>SHARES</ModalFormLabel>
                  <Field
                    component={InputField}
                    className='ModalFormInputNewLoan tradeFormInput'
                    name='numberOfShares'
                    type='number'
                    step='0.0001'
                  />
                </NewLoanInputWrapper>

                
              </NewLoanFormInput>
              <h2>
              </h2>
            </ModalFormGrpNewLoan>           
          </FormInputsWrapper>

          <ModalFormSubmit>
            <BtnLoanModal>
              <ModalFormButton onClick={(e) => sellToProtocol(e)}>
                <h2>SELL</h2>
              </ModalFormButton>
            </BtnLoanModal>
          </ModalFormSubmit>
        </Form>

        }

      </ModalAdjustForm>
  );
};

TradeForm = reduxForm({
  form: 'sell',
  validate,
  asyncValidate: asyncValidateCreate,
  enableReinitialize: true
})(TradeForm);

const mapStateToProps = (state) => ({
  ethereum: state.ethereum,
  formValues: getFormValues('sell')(state)
});

export default TradeForm = connect(mapStateToProps, { change, setTokenBalances })(TradeForm);