import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Modal, Input, Button } from 'semantic-ui-react';
import { ModalDropdown } from 'components/common';
import { required, number, minValue0, maxValue100 } from 'utils/validations';
import { assets } from 'config/constants';

const renderInput = ({ meta: { touched, error, warning }, ...props }) => (
  <>
    <Input {...props} />
    {touched &&
      ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
  </>
);

const renderDropdown = ({ meta: { touched, error, warning }, ...props }) => (
  <>
    <ModalDropdown {...props} />
    {touched &&
      ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
  </>
);

let NewLoan = ({ handleSubmit, calcMinCollateralAmount }) => {
  return (
    <>
      <Modal.Content style={{ background: '#f7f7f7' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Field
            name='borrowAmount'
            component={renderInput}
            style={{ height: '40px' }}
            placeholder='Borrowing'
            validate={[required, number]}
            onChange={calcMinCollateralAmount}
          />
          <Field
            name='borrowAsset'
            component={renderDropdown}
            compact
            selection
            options={assets}
            defaultValue={assets[0].value}
            validate={[required]}
          />
        </div>
        <Field
          name='rpbRate'
          component={renderInput}
          style={{ height: '40px', marginTop: '10px' }}
          fluid
          placeholder='Loan APY'
          validate={[required, number, minValue0, maxValue100]}
        />
        <Field
          name='collateralAmount'
          component={renderInput}
          style={{ height: '40px', marginTop: '10px' }}
          fluid
          label={{ basic: true, content: 'ETH' }}
          labelPosition='right'
          icon='ethereum'
          iconPosition='left'
          placeholder='Collateralizing'
          validate={[required, number]}
        />
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

export { NewLoan };
