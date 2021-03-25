import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Form, Field, reduxForm, getFormValues } from 'redux-form';
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
import { approveContract } from 'services/contractMethods';

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

let TableMoreRow = ({ isEth, buyerCoinAddress, trancheTokenAddress, contractAddress, buySellTrancheTokens }) => {
  const [depositEnabled, setDepositEnabled] = useState(true);
  const [withdrawEnabled, setWithdrawEnabled] = useState(false);

  const handleApprove = async (tokenAddress, contractAddress, e) => {
    console.log(tokenAddress)
    console.log(e.target)
    const result = await approveContract(tokenAddress, contractAddress, !e.target.checked);
    // if (result.message.includes('User denied transaction signature')) change(e.target.name, !e.target.checked);
  }
  return (
    <TableMoreRowWrapper className='table-more-row'>
      <TableMoreRowContent>
        <TableMoreRowContentLeft>
          <TableMoreLeftSection disabled={!depositEnabled}>
            <TableMoreTitleWrapper>
              <h2>deposit</h2>
              <CheckboxWrapper hidden={isEth}>
                <h2>{depositEnabled ? "Enabled" : "Disabled"}</h2>
                <CheckboxContent>
                  <Field component='input' type='checkbox' name='depositIsApproved' id='depositIsApproved' checked={depositEnabled}/>
                  <label onClick={(e) => handleApprove(buyerCoinAddress, contractAddress, e)} htmlFor="depositIsApproved"></label>
                </CheckboxContent>
              </CheckboxWrapper>
            </TableMoreTitleWrapper>
           
            <h2>balance: 103,123 DAI</h2>
            <Form onSubmit={(e) => buySellTrancheTokens(e, true)}>
              <FormContent>
                <Field
                  component={InputField}
                  validate={[required, number]}
                  disabled={!depositEnabled}
                  // className='ModalFormInputNewLoan tradeFormInput'
                  name='depositAmount'
                  type='number'
                  step='0.001'
                />
                <button>max</button>
              </FormContent>
              <button type='submit'>
                <img src={BtnArrow} alt='arrow' />
                deposit
              </button>
            </Form>
          </TableMoreLeftSection>
          <TableMoreLeftSection withdraw disabled={!withdrawEnabled}>
            <TableMoreTitleWrapper>
              <h2>withdraw</h2>
              <CheckboxWrapper>
                <h2>{withdrawEnabled ? "Enabled" : "Disabled"}</h2>
                <CheckboxContent>
                  <Field component='input'type='checkbox' name='withdrawIsApproved' id='withdrawIsApproved' checked={withdrawEnabled}/>
                  <label onClick={(e) => handleApprove(trancheTokenAddress, contractAddress, e)}  htmlFor="withdrawIsApproved"></label>
                </CheckboxContent>
              </CheckboxWrapper>
            </TableMoreTitleWrapper>
            <h2>balance: 3,528 TACDAI</h2>            
            <Form onSubmit={(e) => buySellTrancheTokens(e, false)}>
              <FormContent>
                <Field
                  component={InputField}
                  validate={[required, number]}
                  disabled={!withdrawEnabled}
                  // className='ModalFormInputNewLoan tradeFormInput'
                  name='withdrawAmount'
                  type='number'
                  step='0.001'
                />
                <button>max</button>
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
  form: 'earn',
  initialValues: {},
  destroyOnUnmount: true
})(TableMoreRow);

const mapStateToProps = (state) => ({
  ethereum: state.ethereum,
  formValues: getFormValues('earn')(state)
});

export default TableMoreRow = connect(mapStateToProps, {})(TableMoreRow);
