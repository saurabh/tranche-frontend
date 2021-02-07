import React, { useState, useCallback, useEffect } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Form, Field, reduxForm, getFormValues, change } from 'redux-form';
import { required, number, asyncValidateSell } from 'utils/validations';
import { isGreaterThan } from 'utils/helperFunctions';
import { pairData } from 'config/constants';
import { selectUp, selectDown } from 'assets';
import { BtnLoanModal, BtnLoadingIcon } from '../Modals/styles/ModalsComponents';
import {
  // ModalFormGrp,
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
  SelectCurrencyView,
  ApproveBtnWrapper
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

let TradeForm = ({
  // Redux-form
  pristine,
  submitting,
  change,
  formValues,
  // State Values
  address,
  sellProtocol,
  offerMarket,
  sellToggle,
  buyToggle,
  shareholdersShares,
  hasAllowance,
  approveLoading,
  // Functions
  allowanceCheck,
  approveContract,
  sellToProtocol,
  buyTrancheTokens,
  // API Values
  loanId,
  trancheType,
}) => {
  const [shares, setShares] = useState('');
  const pair = pairData[0].value;

  const setLoanIdandAddress = useCallback(() => {
    change('loanId', loanId);
    change('address', address);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loanId, address]);

  useEffect(() => {
    setLoanIdandAddress();
  }, [setLoanIdandAddress]);

  const debounceAllowanceCheck = useCallback(_.debounce(async (amount) => {
    const allowanceResult = await allowanceCheck(amount);
  }, 500, {leading: true}), []);

  return (
    <ModalAdjustForm>
      {offerMarket ? (
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
              {/* <h2></h2> */}
            </ModalFormGrpNewLoan>
          </FormInputsWrapper>

          <ModalFormSubmit>
            <BtnLoanModal>
              <ModalFormButton type='submit'>
                <h2>SELL</h2>
              </ModalFormButton>
            </BtnLoanModal>
          </ModalFormSubmit>
        </Form>
      ) : sellProtocol ? (
        <Form component={ModalFormWrapper} onSubmit={(e) => sellToProtocol(e)}>
          <FormInputsWrapper trade={true}>
            <ModalFormGrpNewLoan trade={true}>
              <NewLoanFormInput>
                <NewLoanInputWrapper name='shares'>
                  <ModalFormLabel htmlFor='shares'>SHARES</ModalFormLabel>
                  <Field
                    component={InputField}
                    onChange={(e, newValue) => setShares(newValue)}
                    validate={[required, number]}
                    className='ModalFormInputNewLoan tradeFormInput'
                    name='shares'
                    type='number'
                    step='0.0001'
                  />
                </NewLoanInputWrapper>
              </NewLoanFormInput>
              {/* <h2></h2> */}
            </ModalFormGrpNewLoan>
          </FormInputsWrapper>

          <ModalFormSubmit>
            <BtnLoanModal>
              <ModalFormButton
                disabled={
                  pristine ||
                  submitting ||
                  shares === '' ||
                  isGreaterThan(shares, shareholdersShares)
                }
              >
                <h2>SELL</h2>
              </ModalFormButton>
            </BtnLoanModal>
          </ModalFormSubmit>
        </Form>
      ) : (
        <Form component={ModalFormWrapper} onSubmit={(e) => buyTrancheTokens(e)}>
          <FormInputsWrapper trade={true}>
            <ModalFormGrpNewLoan trade={true} tranche={true}>
              <NewLoanFormInput>
                <NewLoanInputWrapper name='amount'>
                  <ModalFormLabel htmlFor='amount' tranche={true}>
                    Amount of {trancheType === 'TRANCHE_A' ? 'TRANCHE A' : 'TRANCHE B'} to {buyToggle ? 'purchase' : 'sell'}:
                  </ModalFormLabel>
                  <Field
                    component={InputField}
                    onChange={(e, newValue) => debounceAllowanceCheck(newValue)}
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
                {buyToggle
                  ? 'You are buying an Ethereum Perpetual Bond paying a 6% APY'
                  : 'You are selling an Ethereum Perpetual Bond incurring a 0.5% fee'}
              </h2>
            </ModalFormGrpNewLoan>
          </FormInputsWrapper>

          <ModalFormSubmit>
            <BtnLoanModal>
              <ApproveBtnWrapper>
                  <ModalFormButton
                    type='button'
                    loading={approveLoading ? 'true' : ''}
                    approved={hasAllowance}
                    onClick={() => approveContract(formValues.amount)}
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
                </ApproveBtnWrapper>
              <ModalFormButton
                type='submit'
                backgroundColor={sellToggle ? '#845AD9' : buyToggle ? '#2ECC71' : '#845AD9'}
                disabled={!hasAllowance}
              >
                <h2>{sellToggle ? 'SELL' : buyToggle ? 'BUY' : ''}</h2>
              </ModalFormButton>
            </BtnLoanModal>
          </ModalFormSubmit>
        </Form>
      )}
    </ModalAdjustForm>
  );
};

TradeForm = reduxForm({
  form: 'sell',
  asyncValidate: asyncValidateSell,
  enableReinitialize: true
})(TradeForm);

const mapStateToProps = (state) => ({
  ethereum: state.ethereum,
  initialValues: {
    loanId: '',
    address: ''
  },
  formValues: getFormValues('sell')(state)
});

export default TradeForm = connect(mapStateToProps, { change })(TradeForm);
