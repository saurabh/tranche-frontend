import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, Field, reduxForm, getFormValues, change } from 'redux-form';
import { pairData, blocksPerYear } from 'config/constants';
import {
  calcMinCollateralAmount,
  calcMaxBorrowAmount,
  getPairDetails,
  toWei,
  fromWei
} from 'services/contractMethods';
import { useDebouncedCallback } from 'utils/lodash';
import { safeSubtract, round, roundNumber, gweiOrEther } from 'utils/helperFunctions';
import { validate, asyncValidateCreate } from 'utils/validations';
import { selectUp, selectDown } from 'assets';
import {
  BtnLoanModal,
  LoanDetailsRow,
  LoanDetailsRowTitle,
  LoanDetailsRowValue
} from '../Modals/styles/ModalsComponents';

import {
  ModalFormGrp,
  ModalFormLabel,
  ModalFormWrapper,
  ModalAdjustForm,
  SelectChevron,
  LoanCustomSelect,
  ModalFormGrpNewLoan,
  SelectCurrencyOption,
  SelectCurrencyView,
  SelectCurrencyOptions,
  ModalFormSubmit,
  FormInputsWrapper,
  ModalFormButton,
  NewLoanInputWrapper,
  NewLoanFormInput,
  ModalNewLoanContent,
  ModalNewLoanDetails,
  ModalNewLoanDetailsContent
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

let NewLoan = ({
  error,
  pristine,
  submitting,
  createNewLoan,
  formValues,
  change,
  ethereum: { balance, tokenBalance }
}) => {
  const [pair, setPair] = useState(pairData[0].value);
  const [currencySelect, toggleCurrency] = useState(false);
  const [collateralBalance, setCollateralBalance] = useState(0);
  const [minCollateralAmount, setMinCollateralAmount] = useState(0);
  const [maxBorrowedAskAmount, setMaxBorrowedAskAmount] = useState(0);
  const [collateralRatio, setCollateralRatio] = useState(0);
  const [borrowAsk, setBorrowAskValue] = useState(0);
  const [collateralValue, setCollateralValue] = useState(0);
  const [rpb, setRpb] = useState(0);

  useEffect(() => {
    const getMaxBorrowed = async () => {
      const result = await calcMaxBorrowAmount(pair, balance);
      setMaxBorrowedAskAmount(round('down', Number(result), 2));
    };

    if (balance >= 0) {
      let collBalance = fromWei(balance);
      setCollateralBalance(roundNumber(collBalance, 3));
    }
    getMaxBorrowed();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balance]);

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

  const onPairChange = async (pairId, borrowedAskAmount, APY) => {
    const newPairId = parseFloat(pairId);
    setPair(newPairId);
    if (borrowedAskAmount) {
      let result = await calcMinCollateralAmount(pairId, borrowedAskAmount);
      result = roundNumber(result, 4);
      result = round('up', Number(result), 3);
      setMinCollateralAmount(result.toString());
    }
    let collBalance =
      pairData[newPairId].collateral === 'ETH'
        ? balance
        : pairData[newPairId].collateral === 'JNT'
        ? tokenBalance.JPT
        : undefined;
    setCollateralBalance(roundNumber(fromWei(collBalance), 3));
    const result = await calcMaxBorrowAmount(newPairId, collBalance);
    setMaxBorrowedAskAmount(round('down', Number(result), 2));
    calculateRPB(pairId, borrowedAskAmount, APY);
  };

  const [debounceCalcMinCollateralAmount] = useDebouncedCallback(
    async (pair, borrowedAskAmount) => {
      let result = await calcMinCollateralAmount(pair, borrowedAskAmount);
      result = roundNumber(result, 4);
      result = round('up', Number(result), 3);
      setMinCollateralAmount(result.toString());
    },
    500
  );

  const [debounceCalcCollateralRatio] = useDebouncedCallback(
    (borrowedAskAmount, collateralAmount) => {
      calcCollateralRatio(borrowedAskAmount, collateralAmount);
    },
    250
  );

  const handleBorrowingChange = (pair, newValue, collateralAmount) => {
    setBorrowAskValue(newValue);
    debounceCalcMinCollateralAmount(pair, newValue);
    collateralAmount && debounceCalcCollateralRatio(newValue, collateralAmount);
  };

  const setCollateralAmount = (borrowedAskAmount) => {
    change('collateralAmount', minCollateralAmount);
    calcCollateralRatio(borrowedAskAmount, minCollateralAmount);
    setCollateralValue(minCollateralAmount);
  };

  const handleCollateralizingChange = (borrowingValue, newValue) => {
    if (!newValue) {
      setTimeout(() => setCollateralRatio(0), 500);
    }
    setCollateralValue(newValue);
    debounceCalcCollateralRatio(borrowingValue, newValue);
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
          ((((collateralAmount * pairValue) / borrowedAskAmount) * 100) / 10 ** pairDecimals) *
          10 ** diffBaseQuoteDecimals;
        setCollateralRatio(newCollRatio);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const calculateRPB = async (pair, amount, APY) => {
    if (amount && APY > 0) {
      const result = await getPairDetails(pair);
      let { pairValue, pairDecimals } = result;
      let rpb = (toWei(amount) * (APY / 100)) / (blocksPerYear * (pairValue / 10 ** pairDecimals));
      setRpb(fromWei(Math.ceil(rpb).toString()));
      change('rpbRate', Math.ceil(rpb).toString());
    } else {
      setRpb(0);
    }
  };

  // const collateralBalance = pairData[pair].collateral === 'ETH' ? fromWei(balance) : pairData[pair].collateral === 'JNT' ? fromWei(tokenBalance.JPT) : undefined;

  return (
    <ModalNewLoanContent>
      <ModalNewLoanDetails>
        <ModalNewLoanDetailsContent>
          <LoanDetailsRow>
            <LoanDetailsRowTitle>COLLATERAL BALANCE</LoanDetailsRowTitle>

            <LoanDetailsRowValue>
              {`${collateralBalance} ${pairData[pair].collateral}`}
            </LoanDetailsRowValue>
          </LoanDetailsRow>

          <LoanDetailsRow>
            <LoanDetailsRowTitle>COLLATERALIZATION RATIO</LoanDetailsRowTitle>

            <LoanDetailsRowValue>
              {collateralRatio ? roundNumber(collateralRatio, 0) : 0}%
            </LoanDetailsRowValue>
          </LoanDetailsRow>

          <LoanDetailsRow>
            <LoanDetailsRowTitle>TOTAL FEES</LoanDetailsRowTitle>

            <LoanDetailsRowValue>0</LoanDetailsRowValue>
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
                    onChange={(e, newValue) =>
                      handleBorrowingChange(pair, newValue, formValues.collateralAmount)
                    }
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
                    onChange={(e, newValue) => onPairChange(newValue, formValues.borrowedAskAmount, formValues.apy)}
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
                            <button onClick={(e) => handleCurrencySelect(e, i.value)} value={i.key}>
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
              <h2>MAX BORROW AMOUNT: ~ {maxBorrowedAskAmount}</h2>
            </ModalFormGrpNewLoan>

            <ModalFormGrp currency={pairData[pair].collateral} cursor='pointer'>
              <ModalFormLabel htmlFor='COLLATERALIZINGInput'>COLLATERALIZING</ModalFormLabel>
              <Field
                component={InputField}
                className={`ModalFormInput ${'ModalFormInput' + pairData[pair].collateral}`}
                name='collateralAmount'
                onChange={(e, newValue) =>
                  handleCollateralizingChange(formValues.borrowedAskAmount, newValue)
                }
                type='number'
                step='0.0001'
                id='COLLATERALIZINGInput'
                background={pairData[pair].colIcon}
              />
              <h2 onClick={() => setCollateralAmount(formValues.borrowedAskAmount)}>
                MINIMUM COLLATERAL:{' '}
                <span>
                  {minCollateralAmount ? minCollateralAmount : 0} {pairData[pair].collateral}
                </span>
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
                onChange={(e, newValue) => calculateRPB(formValues.pairId, formValues.borrowedAskAmount, newValue)}
              />
              <h2>
                RPB:{' '}
                <span>
                  {gweiOrEther(rpb, pairData[pair].collateral) === 'Gwei' || 'nJNT'
                    ? roundNumber(rpb * 10 ** 9, 3)
                    : roundNumber(rpb, 3)}{' '}
                  {gweiOrEther(rpb, pairData[pair].collateral)}
                </span>
              </h2>
            </ModalFormGrpNewLoan>
          </FormInputsWrapper>

          <ModalFormSubmit>
            <BtnLoanModal>
              <ModalFormButton
                type='submit'
                disabled={pristine || submitting || error || !borrowAsk || !collateralValue}
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
  ethereum: state.ethereum,
  initialValues: { pairId: pairData[0].value, rpbRate: 0 },
  formValues: getFormValues('newLoan')(state)
});

export default NewLoan = connect(mapStateToProps, { change })(NewLoan);
