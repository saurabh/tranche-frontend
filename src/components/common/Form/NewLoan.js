import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Form, Field, reduxForm, getFormValues, change, reset } from 'redux-form';
import { pairData } from 'config/constants';
import {
  calcMinCollateralAmount,
  getPairDetails,
  toWei,
  fromWei
} from 'services/contractMethods';
import { useDebouncedCallback } from 'utils/lodash';
import { safeSubtract } from 'utils/helperFunctions';
import { validate, asyncValidateCreate } from 'utils/validations';
import { selectUp, selectDown } from 'assets';
import {
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
  SelectChevron,
  ModalNewLoanDetails,
  ModalNewLoanContent,
  BtnLoanModal,
  LoanDetailsRow,
  LoanDetailsRowTitle,
  LoanDetailsRowValue,
  ModalNewLoanDetailsContent
} from '../Modals/ModalComponents';

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

let NewLoan = ({ error, pristine, submitting, createNewLoan, formValues, change }) => {
  const [pair, setPair] = useState(pairData[0].value);
  const [currencySelect, toggleCurrency] = useState(false);
  const [minCollateralAmount, setminCollateralAmount] = useState(0);
  const [collateralRatio, setCollateralRatio] = useState(0);
  const [borrowAsk, setBorrowAskValue] = useState(0);
  const [collateralValue, setCollateralValue] = useState(0);
  const [rpb, setRpb] = useState(0);

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

  const handleCurrencySelect = (e, pair) => {
    e.preventDefault();
    change('collateralAmount', null);
    setCollateralValue(0);
    setCollateralRatio(0);
    inputChange(pair);
    toggleCurrency(false);
  };

  const onPairChange = async (pairId, borrowedAskAmount) => {
    setPair(parseFloat(pairId));
    if (borrowedAskAmount) {
      const result = await calcMinCollateralAmount(pairId, borrowedAskAmount);
      setminCollateralAmount(result);
    }
  };

  const [debounceCalcMinCollateralAmount] = useDebouncedCallback(
    async (pair, borrowedAskAmount) => {
      const result = await calcMinCollateralAmount(pair, borrowedAskAmount);
      setminCollateralAmount(result);
    },
    500
  );

  const handleBorrowingChange = (pair, newValue) => {
    setBorrowAskValue(newValue);
    debounceCalcMinCollateralAmount(pair, newValue);
  };

  const setCollateralAmount = (borrowedAskAmount) => {
    change('collateralAmount', minCollateralAmount);
    calcCollateralRatio(borrowedAskAmount, minCollateralAmount);
    setCollateralValue(minCollateralAmount);
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

  const [debounceCalcCollateralRatio] = useDebouncedCallback((newValue) => {
    setCollateralRatio(newValue);
  }, 500);

  const handleCollateralizingChange = (borrowingValue, newValue) => {
    if (!newValue) {
      setTimeout(() => debounceCalcCollateralRatio(0), 500);
    }
    setCollateralValue(newValue);
    calcCollateralRatio(borrowingValue, newValue);
  };

  const calculateRPB = async (amount, APY) => {
    if (amount && APY > 0) {
      let blocksPerYear = 2372500;
      const result = await getPairDetails(pair);
      let { pairValue, pairDecimals } = result;
      let rpb =
        (toWei(amount) * (APY / 100)) /
        (blocksPerYear * (pairValue / 10 ** pairDecimals));
      setRpb(fromWei(Math.ceil(rpb).toString()));
      change('rpbRate', Math.ceil(rpb).toString());
    } else {
      setRpb(0);
    }
  };

  return (
    <ModalNewLoanContent>
      <ModalNewLoanDetails>
        <ModalNewLoanDetailsContent>
          <LoanDetailsRow>
            <LoanDetailsRowTitle>MINIMUM COLLATERAL</LoanDetailsRowTitle>

            <LoanDetailsRowValue
              cursor='pointer'
              onClick={() => setCollateralAmount(formValues.borrowedAskAmount)}
            >
              {minCollateralAmount ? minCollateralAmount : 0} {pairData[pair].collateral}
            </LoanDetailsRowValue>
          </LoanDetailsRow>

          <LoanDetailsRow>
            <LoanDetailsRowTitle>COLLATERALIZATION RATIO</LoanDetailsRowTitle>

            <LoanDetailsRowValue>
              {collateralRatio ? collateralRatio : 0}%
            </LoanDetailsRowValue>
          </LoanDetailsRow>

          <LoanDetailsRow>
            <LoanDetailsRowTitle>RBP</LoanDetailsRowTitle>

            <LoanDetailsRowValue>{rpb}</LoanDetailsRowValue>
          </LoanDetailsRow>
        </ModalNewLoanDetailsContent>
      </ModalNewLoanDetails>

      <ModalAdjustForm>
        <Form component={ModalFormWrapper} onSubmit={(e) => createNewLoan(e)}>
          <FormInputsWrapper>
            <ModalFormGrpNewLoan>
              <NewLoanFormInput>
                <NewLoanInputWrapper name='borrowedAskAmount'>
                  <ModalFormLabel htmlFor='BORROWINGInput'>BORROWING</ModalFormLabel>
                  <Field
                    component={InputField}
                    className='ModalFormInputNewLoan'
                    name='borrowedAskAmount'
                    onChange={(e, newValue) => handleBorrowingChange(pair, newValue)}
                    type='number'
                    step='0.0001'
                    id='BORROWINGInput'
                  />
                </NewLoanInputWrapper>

                <LoanCustomSelect>
                  <Field
                    name='pairId'
                    component='input'
                    id='selectPair'
                    onChange={(e, newValue) =>
                      onPairChange(newValue, formValues.borrowedAskAmount)
                    }
                    className='fieldStylingDisplay'
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
                              onClick={(e) => handleCurrencySelect(e, i.value)}
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
                  handleCollateralizingChange(formValues.borrowedAskAmount, newValue)
                }
                type='number'
                step='0.0001'
                id='COLLATERALIZINGInput'
                background={pairData[pair].colIcon}
              />
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
            </ModalFormGrpNewLoan>
          </FormInputsWrapper>

          <ModalFormSubmit>
            <BtnLoanModal>
              <ModalFormButton
                type='submit'
                disabled={
                  pristine ||
                  submitting ||
                  error ||
                  !borrowAsk ||
                  !collateralValue ||
                  !rpb
                }
              >
                Request Loan
              </ModalFormButton>
            </BtnLoanModal>
          </ModalFormSubmit>
        </Form>
      </ModalAdjustForm>
    </ModalNewLoanContent>
  );
};

NewLoan = reduxForm({
  form: 'newLoan',
  validate,
  asyncValidate: asyncValidateCreate,
  asyncChangeFields: ['borrowedAskAmount', 'collateralAmount'],
  enableReinitialize: true
})(NewLoan);

const mapStateToProps = (state) => ({
  initialValues: { pairId: pairData[0].value },
  formValues: getFormValues('newLoan')(state)
});

export default NewLoan = connect(mapStateToProps, { change })(NewLoan);
