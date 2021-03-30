import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { Form, Field, reduxForm, getFormValues, change } from 'redux-form';
import { required, number } from 'utils/validations';
import {
  TableMoreRowWrapper,
  TableMoreRowContent,
  TableMoreRowContentLeft,
  TableMoreRowContentRight,
  TableMoreLeftSection,
  FormContent,
  CheckboxWrapper,
  CheckboxContent,
  TableMoreTitleWrapper
} from '../../Stake/Table/styles/TableComponents';
import Chart from '../../Chart/Chart';
import { BtnArrow } from 'assets';
import { fromWei } from 'services/contractMethods';
import { roundNumber } from 'utils';

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

let TableMoreRow = ({
  isEth,
  cryptoType,
  buyerCoinAddress,
  trancheToken,
  trancheTokenAddress,
  isApproveLoading,
  isDepositApproved,
  isWithdrawApproved,
  approveContract,
  buySellTrancheTokens,
  ethereum: { tokenBalance, balance },
  change
}) => {
  let buyerTokenBalance =
    cryptoType === 'ETH' ? balance && balance !== -1 && fromWei(balance) : tokenBalance[buyerCoinAddress] && fromWei(tokenBalance[buyerCoinAddress]);
  let trancheTokenBalance = tokenBalance[trancheTokenAddress] && fromWei(tokenBalance[trancheTokenAddress]);

  const setMaxAmount = useCallback(
    (e, type) => {
      e.preventDefault();
      if (type) {
        let num = roundNumber(buyerTokenBalance, 4, 'down')
        change('depositAmount', num.toString());
      } else {
        let num = roundNumber(trancheTokenBalance, 4, 'down')
        change('withdrawAmount', num.toString());
      }
    },
    [buyerTokenBalance, trancheTokenBalance, change]
  );

  return (
    <TableMoreRowWrapper className='table-more-row'>
      <TableMoreRowContent>
        <TableMoreRowContentLeft>
          <TableMoreLeftSection disabled={isApproveLoading}>
            <TableMoreTitleWrapper>
              <h2>deposit</h2>
              <CheckboxWrapper hidden={isEth}>
                <h2>{isDepositApproved ? 'Enabled' : 'Disabled'}</h2>
                <CheckboxContent>
                  <Field
                    component='input'
                    type='checkbox'
                    name='depositIsApproved'
                    id='depositIsApproved'
                    checked={isDepositApproved}
                    disabled={isApproveLoading}
                  />
                  <label onClick={(e) => approveContract(true, isDepositApproved, e)} htmlFor='depositIsApproved'></label>
                </CheckboxContent>
              </CheckboxWrapper>
            </TableMoreTitleWrapper>

            <h2>
              balance: {roundNumber(buyerTokenBalance)} {cryptoType}
            </h2>
            <Form onSubmit={(e) => buySellTrancheTokens(e, true)}>
              <FormContent>
                <Field
                  component={InputField}
                  validate={[number]}
                  // className='ModalFormInputNewLoan tradeFormInput'
                  name='depositAmount'
                  type='number'
                  step='0.001'
                />
                <button onClick={(e) => setMaxAmount(e, true)}>max</button>
              </FormContent>
              <button type='submit'>
                <img src={BtnArrow} alt='arrow' />
                deposit
              </button>
            </Form>
          </TableMoreLeftSection>
          <TableMoreLeftSection withdraw disabled={isApproveLoading}>
            <TableMoreTitleWrapper>
              <h2>withdraw</h2>
              <CheckboxWrapper>
                <h2>{isWithdrawApproved ? 'Enabled' : 'Disabled'}</h2>
                <CheckboxContent>
                  <Field
                    component='input'
                    type='checkbox'
                    name='withdrawIsApproved'
                    id='withdrawIsApproved'
                    checked={isWithdrawApproved}
                    disabled={isApproveLoading}
                  />
                  <label onClick={() => approveContract(false, isWithdrawApproved)} htmlFor='withdrawIsApproved'></label>
                </CheckboxContent>
              </CheckboxWrapper>
            </TableMoreTitleWrapper>
            <h2>
              balance: {roundNumber(trancheTokenBalance)} {trancheToken}
            </h2>
            <Form onSubmit={(e) => buySellTrancheTokens(e, false)}>
              <FormContent>
                <Field
                  component={InputField}
                  validate={[number]}
                  disabled={!isWithdrawApproved}
                  // className='ModalFormInputNewLoan tradeFormInput'
                  name='withdrawAmount'
                  type='number'
                  step='0.001'
                />
                <button onClick={(e) => setMaxAmount(e, false)}>max</button>
              </FormContent>
              <button type='submit'>
                <img src={BtnArrow} alt='arrow' />
                withdraw
              </button>
            </Form>
          </TableMoreLeftSection>
        </TableMoreRowContentLeft>
        <TableMoreRowContentRight>
          <Chart />
        </TableMoreRowContentRight>
      </TableMoreRowContent>
    </TableMoreRowWrapper>
  );
};

TableMoreRow = reduxForm({
  form: 'tranche',
  initialValues: {},
  destroyOnUnmount: true
})(TableMoreRow);

const mapStateToProps = (state) => ({
  ethereum: state.ethereum,
  formValues: getFormValues('tranche')(state)
});

export default TableMoreRow = connect(mapStateToProps, { change })(TableMoreRow);
