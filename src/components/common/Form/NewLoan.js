import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Form, Field, reduxForm, getFormValues, change } from 'redux-form';
import { pairData } from 'config/constants';
import { calcMinCollateralAmount, getPairDetails, toWei } from 'services/contractMethods';
import { useDebouncedCallback } from 'utils/lodash';
import { safeSubtract } from 'utils/helperFunctions';
import { validate, asyncValidate } from 'utils/validations';
import { selectUp, selectDown } from 'assets';
import {
  BtnGrpLoanModal,
  ModalAdjustForm,
  ModalFormWrapper,
  ModalFormGrp,
  ModalFormLabel,
  ModalFormSubmit,
  ModalFormButton,
  SelectCurrencyOption,
  SelectCurrencyView,
  SelectCurrencyOptions,
  ModalFormGrpNewLoan,
  FormInputsWrapper,
  NewLoanInputWrapper,
  LoanCustomSelect,
  NewLoanFormInput,
  SelectChevron
} from '../Modals/ModalComponents';

const InputField = ({ input, type, className, meta: { touched, error } }) => (
  <div>
    {touched && error ? (
      <input
        {...input}
        type={type}
        style={{ boxShadow: 'inset 0 0 3px red' }}
        className={className}
      />
    ) : (
      <input
        {...input}
        type={type}
        style={{ border: '1px solid #ffffff' }}
        className={className}
      />
    )}
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
      ></span>
    )}
  </div>
);

let NewLoan = ({ error, pristine, submitting, createNewLoan, formValues, change }) => {
  const [pair, setPair] = useState(pairData[0].value);
  const [currencySelect, toggleCurrency] = useState(false);
  const [minCollateralAmount, setminCollateralAmount] = useState(0);
  const [collateralRatio, setCollateralRatio] = useState(0);
  const [RPB, SETRPB] = useState(0);

  const inputChange = (val) => {
    const input = document.getElementById('selectPair');

    const lastValue = input.value;
    input.value = val;
    const event = new Event('input', { bubbles: true });
    const tracker = input._valueTracker;
    if (tracker) {
      tracker.setValue(lastValue);
    }
    input.dispatchEvent(event);
  };

  const toggleCurrencySelect = () => {
    toggleCurrency(!currencySelect);
  };

  const handleCurrenySelect = (e, pair) => {
    e.preventDefault();
    inputChange(pair);
    toggleCurrency(false);
  };

  const onPairChange = async (pairId, borrowedAskAmount) => {
    setPair(parseFloat(pairId));
    const result = await calcMinCollateralAmount(pairId, borrowedAskAmount);
    setminCollateralAmount(result);
  };

  const [debounceCalcMinCollateralAmount] = useDebouncedCallback(
    async (pair, borrowedAskAmount) => {
      const result = await calcMinCollateralAmount(pair, borrowedAskAmount);
      setminCollateralAmount(result);
    },
    500
  );

  const setCollateralAmount = (borrowedAskAmount) => {
    change('collateralAmount', minCollateralAmount);
    calcCollateralRatio(borrowedAskAmount, minCollateralAmount);
  };

  const calcCollateralRatio = async (borrowedAskAmount, collateralAmount) => {
    try {
      if (!borrowedAskAmount) return;
      borrowedAskAmount = toWei(borrowedAskAmount);
      collateralAmount = toWei(collateralAmount);
      let newCollRatio;
      const result = await getPairDetails(pair);
      let { baseDecimals, quoteDecimals, pairValue, pairDecimals } = result;
      let diffBaseQuoteDecimals = safeSubtract(baseDecimals, quoteDecimals);
      if (baseDecimals >= quoteDecimals) {
        newCollRatio =
          (((collateralAmount * pairValue) / borrowedAskAmount) * 100) /
          10 ** pairDecimals /
          10 ** diffBaseQuoteDecimals;
        setCollateralRatio(newCollRatio);
      } else {
        newCollRatio =
          ((((collateralAmount * pairValue) / borrowedAskAmount) * 100) /
            10 ** pairDecimals) *
          10 ** diffBaseQuoteDecimals;
        setCollateralRatio(newCollRatio);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const calculateRPB = async (amount, APY) => {
    if (amount && APY > 0) {
      let blocksPerYear = 2372500;
      const result = await getPairDetails(pair);
      let { pairValue, pairDecimals } = result;
      let rpb =
        (toWei(amount) * (APY / 100)) /
        (blocksPerYear * (pairValue / 10 ** pairDecimals));
      SETRPB(parseFloat(rpb));
      change('rpbRate', Math.ceil(rpb).toString());
    } else {
      SETRPB(0);
    }
  };

  return (
    <div>
      <ModalAdjustForm>
        <Form component={ModalFormWrapper} onSubmit={(e) => createNewLoan(e)}>
          <FormInputsWrapper>
            <ModalFormGrpNewLoan>
              <NewLoanFormInput>
                <NewLoanInputWrapper name="borrowedAskAmount">
                  <ModalFormLabel htmlFor='BORROWINGInput'>BORROWING</ModalFormLabel>
                  <Field
                    component={InputField}
                    className='ModalFormInputNewLoan'
                    name='borrowedAskAmount'
                    onChange={(e, newValue) =>
                      debounceCalcMinCollateralAmount(pair, newValue)
                    }
                    type='number'
                    step='0.0001'
                    id='BORROWINGInput'
                    style={{ maxWidth: '120px' }}
                  />
                </NewLoanInputWrapper>

                <LoanCustomSelect>
                  <Field
                    name='pairId'
                    component='input'
                    id='selectPair'
                    onChange={(e, newValue) =>
                      onPairChange(+newValue, formValues.borrowedAskAmount)
                    }
                    style={{ display: 'none' }}
                  />
                  <SelectCurrencyView onClick={() => toggleCurrencySelect()}>
                    <div>
                      <img src={pairData[pair].img} alt='' />
                      <h2>{pairData[pair].text}</h2>
                    </div>
                    <SelectChevron>
                      <img src={selectUp} alt='' />
                      <img src={selectDown} alt='' />
                    </SelectChevron>
                  </SelectCurrencyView>
                  {currencySelect ? (
                    <SelectCurrencyOptions>
                      {pairData.map((i) => {
                        return (
                          <SelectCurrencyOption key={i.key}>
                            <button
                              onClick={(e) => handleCurrenySelect(e, i.value)}
                              value={i.key}
                            >
                              <img src={i.img} alt='' /> {i.text}
                            </button>
                          </SelectCurrencyOption>
                        );
                      })}
                    </SelectCurrencyOptions>
                  ) : (
                    ''
                  )}
                </LoanCustomSelect>
              </NewLoanFormInput>
              <h2
                style={{ cursor: 'pointer' }}
                onClick={() => setCollateralAmount(formValues.borrowedAskAmount)}
              >
                MINIMUM COLLATERAL:{' '}
                <span style={{ cursor: 'pointer' }}>{minCollateralAmount}</span>{' '}
                {pairData[pair].collateral}
              </h2>
            </ModalFormGrpNewLoan>

            <ModalFormGrp currency={pairData[pair].collateral}>
              <ModalFormLabel htmlFor='COLLATERALIZINGInput'>
                COLLATERALIZING
              </ModalFormLabel>
              <Field
                component={InputField}
                className={`ModalFormInput ${
                  'ModalFormInput' + pairData[pair].collateral
                }`}
                name='collateralAmount'
                onChange={(e, newValue) =>
                  calcCollateralRatio(formValues.borrowedAskAmount, newValue)
                }
                type='number'
                step='0.0001'
                id='COLLATERALIZINGInput'
                background={pairData[pair].colIcon}
              />
              <h2>
                COLLATERALIZATION RATIO: <span>{collateralRatio}</span>%
              </h2>
            </ModalFormGrp>

            <ModalFormGrpNewLoan placeholder='%'>
              <ModalFormLabel htmlFor='LOAN APYInput'>LOAN APY</ModalFormLabel>
              <Field
                name='apy'
                component={InputField}
                className='ModalFormInputAPY'
                type='number'
                // step='0.0001'
                id='LOAN APYInput'
                onChange={(e, newValue) =>
                  calculateRPB(formValues.borrowedAskAmount, newValue)
                }
              />
              <h2>
                RPB: <span>{RPB}</span>
              </h2>
            </ModalFormGrpNewLoan>
          </FormInputsWrapper>
          <ModalFormSubmit>
            <BtnGrpLoanModal>
              <ModalFormButton type='submit' disabled={pristine || submitting || error}>
                Request Loan
              </ModalFormButton>
            </BtnGrpLoanModal>
          </ModalFormSubmit>
        </Form>
      </ModalAdjustForm>
    </div>
  );
};

NewLoan = reduxForm({
  form: 'newLoan',
  validate,
  asyncValidate,
  asyncChangeFields: ['borrowedAskAmount', 'collateralAmount'],
  enableReinitialize: true
})(NewLoan);

const mapStateToProps = (state) => ({
  initialValues: { pairId: pairData[0].value },
  formValues: getFormValues('newLoan')(state)
});

export default NewLoan = connect(mapStateToProps, { change })(NewLoan);
