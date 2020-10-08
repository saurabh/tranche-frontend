import React, { useState } from 'react';
import {
  required,
  number,
  minValue0,
  maxValue100,
  validate
} from 'utils/validations';
import { useDebouncedCallback } from 'utils/lodash';
import { assets } from 'config/constants';
import { connect } from 'react-redux';
import CloseModal from 'assets/images/svg/closeModal.svg';
import DAI from 'assets/images/svg/dai.svg';
import { Form, Field, reduxForm } from 'redux-form';
import USDC from 'assets/images/svg/usdc.svg';
import selectUp from 'assets/images/svg/selectUp.svg';
import selectDown from 'assets/images/svg/selectDown.svg';
import ETHFORM from 'assets/images/svg/EthForm.svg';
import JNT from 'assets/images/svg/jnt.svg';
import { statuses } from '../../../config/constants';
import {
  ModalHeader,
  ModalContent,
  BtnGrpLoanModal,
  ModalButton,
  ConfirmAlertWrapper,
  ConfirmAlertBtnWrapper,
  ModalAdjustForm,
  ModalFormWrapper,
  ModalFormGrp,
  ModalFormLabel,
  ModalFormInput,
  ModalFormSubmit,
  ModalFormButton,
  SelectCurrencyOption,
  SelectCurrencyView,
  SelectCurrencyOptions,
  ModalFormGrpNewLoan,
  ModalFormInputNewLoan,
  NewLoanInputWrapper,
  LoanCustomSelect,
  NewLoanFormInput,
  SelectChevron,
  ModalFormInputAPY
} from '../Modals/ModalComponents';

const InputField = ({
  input,
  type,
  placeholder,
  className,
  meta: { touched, error }
}) => (
  <div>
    <input
      {...input}
      placeholder={placeholder}
      type={type}
      className={className}
    />
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
  createNewLoan,
  calcMinCollateralAmount,
  calcMaxBorrowedAmount,
  collateralAmountForInput,
  setPair
}) => {
  const [pair, setPairLocal] = useState(0);
  const [selectedCurrency, selectCurrency] = useState('dai');
  const [currencySelect, toggleCurrency] = useState(false);
  const [RPB, SETRPB] = useState(0);

  const selectPair = (pairId) => {
    setPairLocal(pairId)
    setPair(pairId)
  };

  const handleCurrenySelect = (e) => {
    e.preventDefault();
    selectCurrency(e.target.value);
    toggleCurrency(false);
  };
  

  const [debounceCalcMinCollateralAmount] = useDebouncedCallback(
    (pair, borrowedAskAmount) =>
      calcMinCollateralAmount(pair, borrowedAskAmount),
    500
  );

  const [debounceCalcMaxBorrowedAmount] = useDebouncedCallback(
    (pair, borrowedAskAmount) => calcMaxBorrowedAmount(pair, borrowedAskAmount),
    500
  );

  const calculateRPB = (APY) =>{
    if(APY > 0){
      let rpb = -(100^(-1/365)*(100^(1/365)-(APY+100)^(1/365)))/5760;
      SETRPB(parseFloat(rpb).toFixed(3));
    }
    else{
      SETRPB(0);
    }
  }

  return (
    <div>
      <ModalAdjustForm>
        <Form component={ModalFormWrapper}>
          <ModalFormGrpNewLoan>
            <NewLoanFormInput>
              <NewLoanInputWrapper>
                <ModalFormLabel htmlFor='BORROWINGInput'>
                  BORROWING
                </ModalFormLabel>
                <Field
                  component={InputField}
                  className='ModalFormInputNewLoan'
                  name='borrowedAskAmount'
                  validate={[required, number]}
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
                  component='select'
                  validate={[required]}
                  onChange={(event, newValue) => setPairLocal(+newValue)}
                >
                  {assets.map((asset) => (
                    <option value={asset.value} key={asset.key}>
                      {asset.text}
                    </option>
                  ))}
                </Field>
                {/* <SelectCurrencyView onClick={() => toggleCurrencySelect()}>
                  {selectedCurrency === 'dai' ? (
                    <div>
                      <img src={DAI} alt='' />
                      <h2>DAI</h2>
                    </div>
                  ) : selectedCurrency === 'usdc' ? (
                    <div>
                      <img src={USDC} alt='' />
                      <h2>USDC</h2>
                    </div>
                  ) : (
                    ''
                  )}

                  <SelectChevron>
                    <img src={selectUp} alt='' />
                    <img src={selectDown} alt='' />
                  </SelectChevron>
                </SelectCurrencyView>
                {currencySelect ? (
                  <SelectCurrencyOptions>
                    <SelectCurrencyOption>
                      <button
                        onClick={(e) => handleCurrenySelect(e)}
                        value='dai'
                      >
                        <img src={DAI} alt='' /> DAI
                      </button>
                    </SelectCurrencyOption>
                    <SelectCurrencyOption>
                      <button
                        onClick={(e) => handleCurrenySelect(e)}
                        value='usdc'
                      >
                        <img src={USDC} alt='' /> USDC
                      </button>
                    </SelectCurrencyOption>
                  </SelectCurrencyOptions>
                ) : (
                  ''
                )} */}
              </LoanCustomSelect>
            </NewLoanFormInput>
            <h2>
              MINIMUM COLLATERAL: <span>{collateralAmountForInput}</span> ETH
            </h2>
          </ModalFormGrpNewLoan>

          <ModalFormGrp currency={selectedCurrency === 'dai' ? 'ETH' : 'JNT'}>
            <ModalFormLabel htmlFor='COLLATERALIZINGInput'>
              COLLATERALIZING
            </ModalFormLabel>
            <Field
              component={InputField}
              className={
                'ModalFormInput ' +
                (selectedCurrency === 'dai'
                  ? 'ModalFormInputETH'
                  : 'ModalFormInputJNT')
              }
              name='collateralAmount'
              type='number'
              step='0.0001'
              id='COLLATERALIZINGInput'
              background={selectedCurrency === 'dai' ? ETHFORM : JNT}
              onChange={(event, newValue) =>
                debounceCalcMaxBorrowedAmount(pair, newValue)
              }
              validate={[required, number]}
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
        </Form>
      </ModalAdjustForm>

      <ModalFormSubmit>
        <BtnGrpLoanModal>
          <ModalFormButton onClick={createNewLoan}>Open Loan</ModalFormButton>
        </BtnGrpLoanModal>
      </ModalFormSubmit>
    </div>
  );
};

// const mapStateToProps = (state) => ({
//   form: state.form,
//   initialValues: { pairId: 0 }
// });

// NewLoan = connect(mapStateToProps, {})(NewLoan);

// NewLoan = reduxForm({
//   form: 'newLoan'
// })(NewLoan);

NewLoan = reduxForm({
  form: 'newLoan',
  validate
})(NewLoan);

NewLoan = connect(() => ({
  initialValues: { pairId: 0 }
}))(NewLoan);

export { NewLoan };
