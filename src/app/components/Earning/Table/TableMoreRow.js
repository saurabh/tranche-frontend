import React from 'react';
import { connect } from 'react-redux';
import { Form, Field, reduxForm, getFormValues } from 'redux-form';
import { required, number } from 'utils/validations';
import {
  TableMoreRowWrapper,
  TableMoreRowContent,
  TableMoreRowContentLeft,
  TableMoreRowContentRight,
  TableMoreLeftSection
} from '../../Stake/Table/styles/TableComponents';
import Chart from '../../Chart/Chart'
import { BtnArrow } from 'assets';

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

let TableMoreRow = ({ earnAllowanceCheck, earnApproveContract, buySellTrancheTokens }) => {
  return (
    <Form>
      <TableMoreRowWrapper className='table-more-row'>
        <TableMoreRowContent>
          <TableMoreRowContentLeft>
            <TableMoreLeftSection>
              <h2>deposit</h2>
              <h2>balance: 103,123 DAI</h2>
              {/* <Field component='input' type='checkbox' name='isApproved' /> */}
              <form onSubmit={e=>e.preventDefault()}>
                <div>
                  <Field
                    component={InputField}
                    validate={[required, number]}
                    // className='ModalFormInputNewLoan tradeFormInput'
                    name='deposit'
                    type='number'
                    step='0.001'
                  />
                  <button>max</button>
                </div>
                <button type='submit'>
                  <img src={BtnArrow} alt='arrow' />
                  deposit
                </button>
              </form>
            </TableMoreLeftSection>
            <TableMoreLeftSection withdraw>
              <h2>withdraw</h2>
              <h2>balance: 3,528 TACDAI</h2>
              <form onSubmit={e=>e.preventDefault()}>
                <div>
                  <Field
                    component={InputField}
                    validate={[required, number]}
                    // className='ModalFormInputNewLoan tradeFormInput'
                    name='withdraw'
                    type='number'
                    step='0.001'
                  />
                  <button>max</button>
                </div>
                <button type='submit'>
                  <img src={BtnArrow} alt='arrow' />
                  deposit
                </button>
              </form>
            </TableMoreLeftSection>
          </TableMoreRowContentLeft>
          <TableMoreRowContentRight>
            <Chart />
          </TableMoreRowContentRight>
        </TableMoreRowContent>
      </TableMoreRowWrapper>
    </Form>
  );
};

TableMoreRow = reduxForm({
  form: 'earn',
  enableReinitialize: true
})(TableMoreRow);

const mapStateToProps = (state) => ({
  ethereum: state.ethereum,
  initialValues: {},
  formValues: getFormValues('earn')(state)
});

export default TableMoreRow = connect(mapStateToProps, {})(TableMoreRow);
