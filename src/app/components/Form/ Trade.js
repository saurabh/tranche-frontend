import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Form, Field, reduxForm, getFormValues, change } from 'redux-form';
import { setTokenBalances } from 'redux/actions/ethereum';
import { validate, asyncValidateCreate } from 'utils/validations';
import { pairData } from 'config/constants';
import { selectUp, selectDown } from 'assets';
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
  SelectChevron,
  LoanCustomSelect,
  SelectCurrencyView
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

let TradeForm = ({ sellProtocol, offerMarket, sellToggle, buyToggle, sellToProtocol }) => {
  const [pair, setPair] = useState(pairData[0].value);
  

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
              sellProtocol ?

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
        </Form> :

        <Form component={ModalFormWrapper}>
          <FormInputsWrapper trade={true}>
            <ModalFormGrpNewLoan trade={true} tranche={true}>
            <NewLoanFormInput>
                <NewLoanInputWrapper name='amount'>
                  <ModalFormLabel htmlFor='amount' tranche={true}>Amount of Tranche A to { buyToggle ? "purchase" : "sell"}:</ModalFormLabel>
                  <Field
                    component={InputField}
                    className='ModalFormInputNewLoan'
                    name='amount'
                    type='number'
                    step='0.0001'
                    id='amount'
                  />
                </NewLoanInputWrapper>

                <LoanCustomSelect>
                  <Field
                    name='pairId'
                    component='input'
                    id='selectPair'
                    className='fieldStylingDisplay'
                  />
                  <SelectCurrencyView>
                    <div>
                      <img src={pairData[pair].img} alt='' />
                      <h2>{pairData[pair].text}</h2>
                    </div>
                    <SelectChevron>
                      <img src={selectUp} alt='' />
                      <img src={selectDown} alt='' />
                    </SelectChevron>
                  </SelectCurrencyView>
                  {/* {currencySelect ? (
                    <SelectCurrencyOptions>
                      {pairData.map((i) => {
                        return (
                          <SelectCurrencyOption key={i.key}>
                            <button onClick={(e) => handleCurrencySelect(e, i.value)} value={i.key}>
                              <img src={i.img} alt='' /> {i.text}
                            </button>
                          </SelectCurrencyOption>
                        );
                      })}
                    </SelectCurrencyOptions>
                  ) : (
                    ''
                  )} */}
                </LoanCustomSelect>
              </NewLoanFormInput>
              <h2>
              {buyToggle ?  "You are buying an Ethereum Perpetual Bond paying a 6% APY" : "You are selling an Ethereum Perpetual Bond incurring a 0.5% fee"}
              </h2>
            </ModalFormGrpNewLoan>
          </FormInputsWrapper>

          <ModalFormSubmit>
            <BtnLoanModal>
              <ModalFormButton
                type='submit'
                backgroundColor={sellToggle ? '#845AD9' : buyToggle ? '#2ECC71' : "#845AD9"}
              >
                <h2>{sellToggle ? 'SELL' : buyToggle ? 'BUY' : ""}</h2>
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