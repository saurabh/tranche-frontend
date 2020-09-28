import React, { useState } from 'react';
import { Form, Field, reduxForm, initialize } from 'redux-form';
import { useDebouncedCallback } from 'utils/lodash';
import { Modal, Input, Button } from 'semantic-ui-react';
import { required, number, minValue0, maxValue100 } from 'utils/validations';
import { assets } from 'config/constants';

const renderInput = ({ meta: { touched, error, warning }, ...props }) => (
  <>
    <Input {...props} />
    {touched &&
      ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
  </>
);

let NewLoan = ({
  handleSubmit,
  calcMinCollateralAmount,
  calcMaxBorrowedAmount
}) => {
  const [pair, setPair] = useState(0);

  const [debounceCalcMinCollateralAmount] = useDebouncedCallback(
    (pair, borrowedAskAmount) =>
      calcMinCollateralAmount(pair, borrowedAskAmount),
    500
  );

  const [debounceCalcMaxBorrowedAmount] = useDebouncedCallback(
    (pair, borrowedAskAmount) => calcMaxBorrowedAmount(pair, borrowedAskAmount),
    500
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Modal.Content style={{ background: '#f7f7f7' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Field
            name='borrowedAskAmount'
            style={{ height: '40px' }}
            validate={[required, number]}
            onChange={(event, newValue) =>
              debounceCalcMinCollateralAmount(pair, newValue)
            }
            // semantic props
            component={renderInput}
            placeholder='Borrowing'
          />
          <Field
            name='pairId'
            component='select'
            validate={[required]}
            onChange={(event, newValue) => setPair(+newValue)}
          >
            {assets.map((asset) => (
              <option value={asset.value} key={asset.key}>
                {asset.text}
              </option>
            ))}
          </Field>
        </div>
        <Field
          name='rpbRate'
          style={{ height: '40px', marginTop: '10px' }}
          component={renderInput}
          validate={[number, minValue0, maxValue100]} // Add required
          // semantic props
          fluid
          placeholder='Loan APY'
        />
        {assets.map(
          (asset) =>
            asset.value === pair && (
              <Field
                name='collateralAmount'
                component={renderInput}
                key={asset.key}
                style={{ height: '40px', marginTop: '10px' }}
                onChange={(event, newValue) =>
                  debounceCalcMaxBorrowedAmount(pair, newValue)
                }
                validate={[required, number]}
                // semantic props
                fluid
                label={{ basic: true, content: asset.collateral }}
                labelPosition='right'
                icon='ethereum'
                iconPosition='left'
                placeholder='Collateralizing'
              />
            )
        )}
      </Modal.Content>
      <Modal.Actions style={{ display: 'flex', justifyContent: 'center' }}>
        <Button type='submit' fluid>
          Create
        </Button>
      </Modal.Actions>
    </Form>
  );
};

NewLoan = reduxForm({
  form: 'newLoan'
})(NewLoan);

export { NewLoan };
