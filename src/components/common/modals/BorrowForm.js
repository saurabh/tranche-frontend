import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
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
  borrowedAskAmount,
  collateralAmount
}) => {
  const [pair, setPair] = useState(0);

  return (
    <>
      <Modal.Content style={{ background: '#f7f7f7' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Field
            name='borrowedAskAmount'
            style={{ height: '40px' }}
            validate={[required, number]}
            onChange={() => calcMinCollateralAmount(pair, borrowedAskAmount)}
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
          validate={[required, number, minValue0, maxValue100]}
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
        <Button fluid onClick={handleSubmit}>
          Create
        </Button>
      </Modal.Actions>
    </>
  );
};

NewLoan = reduxForm({
  form: 'newLoan'
})(NewLoan);

const selector = formValueSelector('newLoan');

NewLoan = connect((state) => {
  const borrowedAskAmount = selector(state, 'borrowedAskAmount');
  const collateralAmount = selector(state, 'collateralAmount');
  return {
    borrowedAskAmount,
    collateralAmount
  };
})(NewLoan);

export { NewLoan };
