import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Modal, Input, Button } from 'semantic-ui-react';
import { ModalDropdown } from 'components/common';
import { required, number } from 'utils/validations';
// import assets from 'constants';

const renderInput = ({ label, type, meta: { touched, error, warning } }) => (
  <>
    <Input placeholder={label} style={{ height: '40px' }} />
    {touched &&
      ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
  </>
);

const renderDropdown = ({
  label,
  assets,
  meta: { touched, error, warning }
}) => (
  <>
    <ModalDropdown placeholder={label} compact selection options={assets} />
    {touched &&
      ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
  </>
);

let NewLoan = ({ handleSubmit, calcMinCollateralAmount }) => {
  const assets = [{ key: 'DAI', text: 'DAI', value: 'DAI'}, { key: 'USDC', text: 'USDC', value: 'USDC'}];

  return (
    <>
      <Modal.Content style={{ background: '#f7f7f7' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Field
            name='borrowAmount'
            component={renderInput}
            label='Borrowing'
            validate={[required, number]}
            onChange={calcMinCollateralAmount}
          />
          <Field
            name='borrowAsset'
            component={renderDropdown}
            label='Currency'
            assets={assets}
            validate={[required]}
          />
        </div>
        <Input
          style={{ height: '40px', marginTop: '10px' }}
          fluid
          label={{ basic: true, content: 'ETH' }}
          labelPosition='right'
          icon='ethereum'
          iconPosition='left'
          placeholder='Collateralizing'
        />
        {/* </div> */}
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
