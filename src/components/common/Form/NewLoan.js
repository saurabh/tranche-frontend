import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Form, Field, reduxForm } from 'redux-form';
import { pairData } from 'config/constants';
import { useDebouncedCallback } from 'utils/lodash';
import { validate, asyncValidate } from 'utils/validations';
import selectUp from 'assets/images/svg/selectUp.svg';
import selectDown from 'assets/images/svg/selectDown.svg';
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
  SelectChevron,
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

let NewLoan = ({
  submitting,
  createNewLoan,
  calcMinCollateralAmount,
  calcMaxBorrowedAmount,
  collateralAmountForInput
}) => {
  const [pair, setPair] = useState(0);
  const [selectedCurrency, selectCurrency] = useState(pairData[0].key);
  const [currencySelect, toggleCurrency] = useState(false);
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

  const searchArr = (key) => pairData.find((i) => i.key === key);

  const toggleCurrencySelect = () => {
    toggleCurrency(!currencySelect);
  };

  const handleCurrenySelect = (e, pair) => {
    e.preventDefault();
    inputChange(pair);
    selectCurrency(e.target.value);
    toggleCurrency(false);
  };

  const [debounceCalcMinCollateralAmount] = useDebouncedCallback(
    (pair, borrowedAskAmount) => calcMinCollateralAmount(pair, borrowedAskAmount),
    500
  );

  const [debounceCalcMaxBorrowedAmount] = useDebouncedCallback(
    (pair, borrowedAskAmount) => calcMaxBorrowedAmount(pair, borrowedAskAmount),
    500
  );

  const calculateRPB = (APY) => {
    if (APY > 0) {
      let rpb =
        -(100 ^ ((-1 / 365) * (100 ^ (1 / 365 - (APY + 100)) ^ (1 / 365)))) / 5760;
      SETRPB(parseFloat(rpb).toFixed(3));
    } else {
      SETRPB(0);
    }
  };

  return (
    <div>
      <ModalAdjustForm>
        <Form component={ModalFormWrapper} onSubmit={createNewLoan}>
        <FormInputsWrapper>
          <ModalFormGrpNewLoan>
            <NewLoanFormInput>
              <NewLoanInputWrapper>
                <ModalFormLabel htmlFor='BORROWINGInput'>BORROWING</ModalFormLabel>
                <Field
                  component={InputField}
                  className='ModalFormInputNewLoan'
                  name='borrowedAskAmount'
                  onChange={(event, newValue) =>
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
                  onChange={(event, newValue) => setPair(+newValue)}
                  style={{ display: 'none' }}
                />
                <SelectCurrencyView onClick={() => toggleCurrencySelect()}>
                  <div>
                    <img src={searchArr(selectedCurrency).img} alt='' />
                    <h2>{searchArr(selectedCurrency).text}</h2>
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
            <h2>
              MINIMUM COLLATERAL: <span>{collateralAmountForInput}</span> ETH
            </h2>
          </ModalFormGrpNewLoan>

          <ModalFormGrp currency={searchArr(selectedCurrency).collateral}>
            <ModalFormLabel htmlFor='COLLATERALIZINGInput'>
              COLLATERALIZING
            </ModalFormLabel>
            <Field
              component={InputField}
              className={
                'ModalFormInput ' +
                `${'ModalFormInput' + searchArr(selectedCurrency).collateral}`
              }
              name='collateralAmount'
              type='number'
              step='0.0001'
              id='COLLATERALIZINGInput'
              background={searchArr(selectedCurrency).colIcon}
              onChange={(event, newValue) =>
                debounceCalcMaxBorrowedAmount(pair, newValue)
              }
            />
            <h2>
              COLLATERALIZATION RATIO: <span>250</span>%
            </h2>
          </ModalFormGrp>

          <ModalFormGrpNewLoan>
            <ModalFormLabel htmlFor='LOAN APYInput'>LOAN APY</ModalFormLabel>
            <Field
              component={InputField}
              className='ModalFormInputAPY'
              type='number'
              step='0.0001'
              id='LOAN APYInput'
              onChange={(e) => calculateRPB(e.target.value)}
            />
            <h2>
              RPB: <span>{RPB}</span>
            </h2>
          </ModalFormGrpNewLoan>
          </FormInputsWrapper>
          <ModalFormSubmit>
            <BtnGrpLoanModal>
              <ModalFormButton onClick={createNewLoan}>Open Loan</ModalFormButton>
              {/* <ModalFormButton type='submit' disabled={submitting}>Open Loan</ModalFormButton> */}
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
  asyncChangeFields: ['borrowedAskAmount', 'collateralAmount']
})(NewLoan);

NewLoan = connect(() => ({
  initialValues: { pairId: pairData[0].value }
}))(NewLoan);

export { NewLoan };
