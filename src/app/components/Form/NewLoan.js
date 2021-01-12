import React, { useState, useEffect, useCallback } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Form, Field, reduxForm, getFormValues, change } from 'redux-form';
import { setTokenBalances } from 'redux/actions/ethereum';
import { pairData, blocksPerYear } from 'config/constants';
import {
  allowanceCheck,
  calcMinCollateralAmount,
  calcMaxBorrowAmount,
  getPairDetails,
  calculateFees,
  toWei,
  fromWei,
  toBN
} from 'services/contractMethods';
import { validate, asyncValidateCreate } from 'utils';
import {
  isLessThan,
  safeSubtract,
  roundNumber,
  gweiOrEther,
  roundBasedOnUnit,
  formatString
} from 'utils/helperFunctions';
import { selectUp, selectDown } from 'assets';
import {
  BtnLoanModal,
  LoanDetailsRow,
  LoanDetailsRowTitle,
  LoanDetailsRowValue,
  BtnLoadingIcon
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
  ModalNewLoanDetailsContent,
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

let NewLoan = ({
  pristine,
  submitting,
  setHasAllowance,
  hasAllowance,
  approveLoading,
  approveContract,
  createNewLoan,
  formValues,
  change,
  ethereum: { address, balance, tokenBalance, web3 },
  setTokenBalances
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
  const [platformFee, setPlatformFee] = useState(0);
  let collBalance =
    pairData[pair].collateral === 'ETH'
      ? balance
      : pairData[pair].collateral === 'SLICE'
      ? tokenBalance.SLICE
      : 0;

  const fetchTokenBalances = useCallback(_.debounce(() => {
    setTokenBalances(web3, address);
  }, 2000, {leading: true}), [address, web3, setTokenBalances]);

  useEffect(() => {
    if (pair === 1) {
      setHasAllowance(false);
    } else {
      setHasAllowance(true);
    }
  }, [pair, setHasAllowance]);

  useEffect(() => {
    const getMaxBorrowed = async () => {
      let result = await calcMaxBorrowAmount(pair, collBalance);
      result = roundNumber(result, undefined, 'down');
      setMaxBorrowedAskAmount(result);
    };

    if (collBalance >= 0) {
      setCollateralBalance(roundNumber(fromWei(collBalance)));
    }

    fetchTokenBalances();
    getMaxBorrowed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, collBalance]);

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
      let result = await calcMinCollateralAmount(pairId, borrowedAskAmount, web3);
      result = roundNumber(result, undefined, 'up');
      setMinCollateralAmount(result.toString());
    }
    let collBalance =
      pairData[newPairId].collateral === 'ETH'
        ? balance
        : pairData[newPairId].collateral === 'SLICE'
        ? tokenBalance.SLICE
        : undefined;
    setCollateralBalance(roundNumber(fromWei(collBalance)));
    let result = await calcMaxBorrowAmount(newPairId, collBalance, web3);
    result = roundNumber(result, undefined, 'down');
    setMaxBorrowedAskAmount(result);
    calculateRPB(pairId, borrowedAskAmount, APY);
  };

  const debounceCalcMinCollateralAmount = useCallback(_.debounce(async (pair, borrowedAskAmount) => {
    let result = await calcMinCollateralAmount(pair, borrowedAskAmount, web3);
    if (result) {
      result = roundNumber(result, undefined, 'up');
      setMinCollateralAmount(result.toString());
    } else setMinCollateralAmount(0)
  }, 500), []);

  const debounceCalcCollateralRatio = useCallback(_.debounce((borrowedAskAmount, collateralAmount, pair) => {
    calcCollateralRatio(borrowedAskAmount, collateralAmount, pair);
  }, 250), []);

  const debounceAllowanceCheck = useCallback(_.debounce(async (pair, collateralAmount, address, web3) => {
    if (pair === 1) {
      const allowanceResult = await allowanceCheck(pair, collateralAmount, address, web3, true);
      setHasAllowance(allowanceResult);
    }
  }, 500, {leading: true}), []);

  const handleBorrowingChange = (pair, newValue, collateralAmount) => {
    setBorrowAskValue(newValue);
    debounceCalcMinCollateralAmount(pair, newValue);
    if (collateralAmount)  {
      if (newValue === '') debounceCalcCollateralRatio('0', collateralAmount, pair);
      else debounceCalcCollateralRatio(newValue, collateralAmount, pair);
    }
  };

  const setCollateralAmount = async (borrowedAskAmount) => {
    let formattedAmount = formatString(minCollateralAmount.toString());
    change('collateralAmount', formattedAmount);
    if (pair === 1) {
      const allowanceResult = await debounceAllowanceCheck(pair, formattedAmount, address, web3);
      setHasAllowance(allowanceResult);
    }
    calcCollateralRatio(borrowedAskAmount, formattedAmount);
    setCollateralValue(formattedAmount);
    let fee = await calculateFees(toWei(formattedAmount), web3);
    if (fee > 0) setPlatformFee(fee);
  };

  const handleCollateralizingChange = async (borrowingValue, newValue) => {
    if (!newValue) {
      setTimeout(() => setCollateralRatio(0), 500);
    }
    if (pair === 1) {
      const allowanceResult = await debounceAllowanceCheck(pair, newValue, address, web3);
      setHasAllowance(allowanceResult);
    }
    setCollateralValue(newValue);
    let formattedAmount = formatString(newValue.toString());
    if (newValue) {
      let fee = await calculateFees(toWei(formattedAmount), web3);
      if (fee > 0) setPlatformFee(fee);
    }
    debounceCalcCollateralRatio(borrowingValue, formattedAmount, pair);
  };

  const calcCollateralRatio = async (borrowedAskAmount, collateralAmount, pairId = pair) => {
    try {
      if (!borrowedAskAmount || !collateralAmount) return;
      borrowedAskAmount = toWei(borrowedAskAmount);
      collateralAmount = toWei(collateralAmount);
      let newCollRatio;
      const result = await getPairDetails(pairId, web3);
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
      const result = await getPairDetails(pair, web3);
      let { pairValue, pairDecimals } = result;
      let rpbValue =
        (toWei(amount) * (APY / 100)) / (blocksPerYear * (pairValue / 10 ** pairDecimals));
      rpbValue = toBN(Math.ceil(rpbValue));
      setRpb(fromWei(rpbValue));
      change('rpbRate', rpbValue);
    } else {
      setRpb(0);
    }
  };

  return (
    <ModalNewLoanContent>
      <ModalNewLoanDetails>
        <ModalNewLoanDetailsContent>
          <LoanDetailsRow>
            <LoanDetailsRowTitle>COLLATERAL BALANCE</LoanDetailsRowTitle>

            <LoanDetailsRowValue>
              {collateralBalance ? collateralBalance : 0} {` ${pairData[pair].collateral}`}
            </LoanDetailsRowValue>
          </LoanDetailsRow>

          <LoanDetailsRow>
            <LoanDetailsRowTitle>COLLATERALIZATION RATIO</LoanDetailsRowTitle>

            <LoanDetailsRowValue>
              {collateralRatio ? roundNumber(collateralRatio, 1) : 0}%
            </LoanDetailsRowValue>
          </LoanDetailsRow>

          <LoanDetailsRow>
            <LoanDetailsRowTitle>Platform Fee</LoanDetailsRowTitle>

            <LoanDetailsRowValue>
              {platformFee + ' ' + pairData[pair].collateral}
            </LoanDetailsRowValue>
          </LoanDetailsRow>
        </ModalNewLoanDetailsContent>
      </ModalNewLoanDetails>

      <ModalAdjustForm>
        <Form component={ModalFormWrapper} onSubmit={(e) => createNewLoan(e)}>
          <FormInputsWrapper>
            <h2 className="FormDetails">
              COLLATERAL BALANCE: {' '}
              {collateralBalance ? collateralBalance : 0} {` ${pairData[pair].collateral}`}
            </h2>
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
                    onChange={(e, newValue) =>
                      onPairChange(newValue, formValues.borrowedAskAmount, formValues.apy)
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
              <h2>
                BORROW LIMIT: ~{' '}
                {(maxBorrowedAskAmount
                  ? roundNumber(maxBorrowedAskAmount) !== 'NaN'
                    ? roundNumber(maxBorrowedAskAmount)
                    : 0
                  : 0) +
                  ' ' +
                  pairData[pair].text}
              </h2>
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
                  {minCollateralAmount ? roundNumber(minCollateralAmount) : 0}{' '}
                  {pairData[pair].collateral}
                </span>
              </h2>
              <h2 className="FormDetails" onClick={() => setCollateralAmount(formValues.borrowedAskAmount)}>
                COLLATERALIZATION RATIO:{' '}
                <span>
                  {collateralRatio ? roundNumber(collateralRatio, 1) : 0}%
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
                onChange={(e, newValue) =>
                  calculateRPB(formValues.pairId, formValues.borrowedAskAmount, newValue)
                }
              />
              <h2>
                RPB:{' '}
                <span>
                  {roundBasedOnUnit(rpb, pairData[pair].collateral)}{' '}
                  {gweiOrEther(rpb, pairData[pair].collateral)}
                </span>
              </h2>
              <h2 className="FormDetails">
                PLATFORM FEE:{' '}
                <span>
                {platformFee + ' ' + pairData[pair].collateral}
                </span>
              </h2>
              
            </ModalFormGrpNewLoan>
          </FormInputsWrapper>

          <ModalFormSubmit>
            <BtnLoanModal>
              {pair === 1 ? (
                <ApproveBtnWrapper>
                  <ModalFormButton
                    type='button'
                    loading={approveLoading ? 'true' : ''}
                    approved={hasAllowance}
                    onClick={() => approveContract(pair, formValues.collateralAmount)}
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
              ) : (
                ''
              )}
              <ModalFormButton
                type='submit'
                disabled={
                  pristine ||
                  submitting ||
                  !borrowAsk ||
                  !collateralValue ||
                  isLessThan(Number(collateralValue), Number(minCollateralAmount)) ||
                  !rpb ||
                  !hasAllowance
                }
              >
                <h2>Request Loan</h2>
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

export default NewLoan = connect(mapStateToProps, { change, setTokenBalances })(NewLoan);