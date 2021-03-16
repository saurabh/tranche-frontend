import React from 'react';
import { connect } from 'react-redux';
import { Form, Field, reduxForm, getFormValues } from 'redux-form';
import {
  TableMoreRowWrapper,
  TableMoreRowContent,
  TableMoreRowContentLeft,
  TableMoreRowContentRight,
  TableMoreLeftSection
} from '../../Stake/Table/styles/TableComponents';
import {
  BtnArrow
} from 'assets';

let TableMoreRow = () => {
  return (
    <Form>
      <TableMoreRowWrapper className='table-more-row'>
          <TableMoreRowContent>
            <TableMoreRowContentLeft>
              <TableMoreLeftSection>
                <h2>deposit</h2>
                <h2>balance: 103,123 DAI</h2>
                <form>
                  <div>
                    <input type="number" />
                    <button>max</button>
                  </div>
                  <button type="submit"><img src={BtnArrow} alt="arrow" />deposit</button>
                </form>
              </TableMoreLeftSection>
              <TableMoreLeftSection withdraw>
                <h2>withdraw</h2>
                <h2>balance: 3,528 TACDAI</h2>
                <form>
                  <div>
                    <input type="number" />
                    <button>max</button>
                  </div>
                  <button type="submit"><img src={BtnArrow} alt="arrow" />withdraw</button>
                </form>
              </TableMoreLeftSection>
            </TableMoreRowContentLeft>
            <TableMoreRowContentRight>

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