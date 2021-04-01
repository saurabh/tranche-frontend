import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, Field, reduxForm, getFormValues, change } from 'redux-form';
import { number } from 'utils/validations';
import {
  TableMoreRowWrapper,
  TableMoreRowContent,
  TableMoreRowContentLeft,
  TableMoreRowContentRight,
  TableMoreLeftSection,
  FormContent,
  CheckboxWrapper,
  CheckboxContent,
  TableMoreTitleWrapper,
  MobileMoreFormBtns,
  MobileMoreFormBtn
} from '../../Stake/Table/styles/TableComponents';
import Chart from '../../Chart/Chart';
import { BtnArrow } from 'assets';
import { fromWei } from 'services/contractMethods';
import { roundNumber, isGreaterThan } from 'utils';

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
  graphData,
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
  ethereum: { tokenBalance, balance, txOngoing },
  change
}) => {
  const [depositBalanceCheck, setDepositBalanceCheck] = useState('');
  const [withdrawBalanceCheck, setWithdrawBalanceCheck] = useState('');
  const [formType, setFormType] = useState('deposit');
  const [isDesktop, setDesktop] = useState(window.innerWidth > 1200);

 
  
  let buyerTokenBalance =
    cryptoType === 'ETH' ? balance && balance !== -1 && fromWei(balance) : tokenBalance[buyerCoinAddress] && fromWei(tokenBalance[buyerCoinAddress]);
  let trancheTokenBalance = tokenBalance[trancheTokenAddress] && fromWei(tokenBalance[trancheTokenAddress]);

  const updateMedia = () => {
    setDesktop(window.innerWidth > 1200);
  };

  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  });
  const setMaxAmount = useCallback(
    (e, type) => {
      e.preventDefault();
      if (type) {
        change('depositAmount', buyerTokenBalance);
      } else {
        change('withdrawAmount', trancheTokenBalance);
      }
    },
    [buyerTokenBalance, trancheTokenBalance, change]
  );

  const handleInputChange = (newValue, type) => {
    if (type) {
      isGreaterThan(newValue, buyerTokenBalance) ? setDepositBalanceCheck('InputStylingError') : setDepositBalanceCheck('');
    } else {
      isGreaterThan(newValue, trancheTokenBalance) ? setWithdrawBalanceCheck('InputStylingError') : setWithdrawBalanceCheck('');
    }
  };

  return (
    <TableMoreRowWrapper className='table-more-row'>
      <TableMoreRowContent>
        {
          isDesktop ?
          <TableMoreRowContentLeft>
            <TableMoreLeftSection disabled={!isDepositApproved || isApproveLoading || txOngoing}>
              <TableMoreTitleWrapper>
                <h2>deposit</h2>
                <CheckboxWrapper hidden={isEth}>
                  <h2>{isDepositApproved ? 'Enabled' : 'Disabled'}</h2>
                  <CheckboxContent disabled={isApproveLoading || txOngoing}>
                    <Field
                      component='input'
                      type='checkbox'
                      name='depositIsApproved'
                      id='depositIsApproved'
                      checked={isDepositApproved}
                      disabled={isApproveLoading || txOngoing}
                    />
                    <label onClick={(isApproveLoading || txOngoing) ? false : (e) => approveContract(true, isDepositApproved, e)} htmlFor='depositIsApproved'></label>
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
                    onChange={(e, newValue) => handleInputChange(newValue, true)}
                    disabled={!isDepositApproved}
                    className={depositBalanceCheck}
                    name='depositAmount'
                    type='number'
                    step='0.001'
                  />
                  <button onClick={(e) => setMaxAmount(e, true)}>max</button>
                </FormContent>
                <button type='submit' disabled={depositBalanceCheck === 'InputStylingError'}>
                  <img src={BtnArrow} alt='arrow' />
                  deposit
                </button>
              </Form>
            </TableMoreLeftSection>
            <TableMoreLeftSection withdraw disabled={!isWithdrawApproved || isApproveLoading || txOngoing}>
              <TableMoreTitleWrapper>
                <h2>withdraw</h2>
                <CheckboxWrapper>
                  <h2>{isWithdrawApproved ? 'Enabled' : 'Disabled'}</h2>
                  <CheckboxContent disabled={isApproveLoading || txOngoing}> 
                    <Field
                      component='input'
                      type='checkbox'
                      name='withdrawIsApproved'
                      id='withdrawIsApproved'
                      checked={isWithdrawApproved}
                      disabled={isApproveLoading || txOngoing}
                    />
                    <label onClick={(isApproveLoading || txOngoing) ? false : () => approveContract(false, isWithdrawApproved)} htmlFor='withdrawIsApproved'></label>
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
                    onChange={(e, newValue) => handleInputChange(newValue, false)}
                    disabled={!isWithdrawApproved}
                    className={withdrawBalanceCheck}
                    name='withdrawAmount'
                    type='number'
                    step='0.001'
                  />
                  <button onClick={(e) => setMaxAmount(e, false)}>max</button>
                </FormContent>
                <button type='submit' disabled={withdrawBalanceCheck === 'InputStylingError'}>
                  <img src={BtnArrow} alt='arrow' />
                  withdraw
                </button>
              </Form>
            </TableMoreLeftSection>
          </TableMoreRowContentLeft> :
          <TableMoreRowContentLeft>
            { formType === 'deposit' ?
              <TableMoreLeftSection disabled={!isDepositApproved || isApproveLoading || txOngoing}>
              <TableMoreTitleWrapper>
                <MobileMoreFormBtns>
                  <MobileMoreFormBtn current={formType === 'deposit'} onClick={() => setFormType('deposit')}>
                    Deposit
                  </MobileMoreFormBtn>
                  <MobileMoreFormBtn current={formType === 'withdraw'} onClick={() => setFormType('withdraw')}>
                    Withdraw
                  </MobileMoreFormBtn>
                </MobileMoreFormBtns>
                <CheckboxWrapper hidden={isEth}>
                  <h2>{isDepositApproved ? 'Enabled' : 'Disabled'}</h2>
                  <CheckboxContent disabled={isApproveLoading || txOngoing}>
                    <Field
                      component='input'
                      type='checkbox'
                      name='depositIsApproved'
                      id='depositIsApproved'
                      checked={isDepositApproved}
                      disabled={isApproveLoading || txOngoing}
                    />
                    <label onClick={(isApproveLoading || txOngoing) ? false : (e) => approveContract(true, isDepositApproved, e)} htmlFor='depositIsApproved'></label>
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
                    onChange={(e, newValue) => handleInputChange(newValue, true)}
                    disabled={!isDepositApproved}
                    className={depositBalanceCheck}
                    name='depositAmount'
                    type='number'
                    step='0.001'
                  />
                  <button onClick={(e) => setMaxAmount(e, true)}>max</button>
                </FormContent>
                <button type='submit' disabled={depositBalanceCheck === 'InputStylingError'}>
                  <img src={BtnArrow} alt='arrow' />
                  deposit
                </button>
              </Form>
            </TableMoreLeftSection> :
            <TableMoreLeftSection withdraw disabled={!isWithdrawApproved || isApproveLoading || txOngoing}>
              <TableMoreTitleWrapper>
                <MobileMoreFormBtns>
                  <MobileMoreFormBtn current={formType === 'deposit'} onClick={() => setFormType('deposit')}>
                    Deposit
                  </MobileMoreFormBtn>
                  <MobileMoreFormBtn current={formType === 'withdraw'} onClick={() => setFormType('withdraw')}>
                    Withdraw
                  </MobileMoreFormBtn>
                </MobileMoreFormBtns>
                <CheckboxWrapper>
                  <h2>{isWithdrawApproved ? 'Enabled' : 'Disabled'}</h2>
                  <CheckboxContent disabled={isApproveLoading || txOngoing}>
                    <Field
                      component='input'
                      type='checkbox'
                      name='withdrawIsApproved'
                      id='withdrawIsApproved'
                      checked={isWithdrawApproved}
                      disabled={isApproveLoading || txOngoing}
                    />
                    <label onClick={(isApproveLoading || txOngoing) ? false : () => approveContract(false, isWithdrawApproved)} htmlFor='withdrawIsApproved'></label>
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
                    onChange={(e, newValue) => handleInputChange(newValue, false)}
                    disabled={!isWithdrawApproved}
                    className={withdrawBalanceCheck}
                    name='withdrawAmount'
                    type='number'
                    step='0.001'
                  />
                  <button onClick={(e) => setMaxAmount(e, false)}>max</button>
                </FormContent>
                <button type='submit' disabled={withdrawBalanceCheck === 'InputStylingError'}>
                  <img src={BtnArrow} alt='arrow' />
                  withdraw
                </button>
              </Form>
            </TableMoreLeftSection>
            }
            
          </TableMoreRowContentLeft>
        }
        
        
        <TableMoreRowContentRight>
          <Chart graphData={graphData} />
        </TableMoreRowContentRight>
      </TableMoreRowContent>
    </TableMoreRowWrapper>
  );
};

TableMoreRow = reduxForm({
  form: 'tranche',
  initialValues: {},
  destroyOnUnmount: false
})(TableMoreRow);

const mapStateToProps = (state) => ({
  ethereum: state.ethereum,
  formValues: getFormValues('tranche')(state)
});

export default TableMoreRow = connect(mapStateToProps, { change })(TableMoreRow);
