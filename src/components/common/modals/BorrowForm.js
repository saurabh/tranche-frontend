import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Modal, Input, Button, Dropdown } from 'semantic-ui-react';
import { ModalDropdown } from 'components/common';
import { required, number } from 'utils/validations';

const renderInput = ({
  input,
  label,
  type,
  meta: { touched, error, warning }
}) => (
  <>
    <Input placeholder={label} style={{ height: '40px' }} />
    {touched &&
      ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
  </>
);

const renderDropdown = ({ input, label, ...custom }) => (
  <Dropdown.Item text={label} compact selection {...input} {...custom} />
);

let NewLoan = ({ handleSubmit }) => {
  return (
    <>
      <Modal.Content style={{ background: '#f7f7f7' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Field
            name='borrowAmount'
            component={renderInput}
            label='Borrowing'
            validate={[required, number]}
          />
          <ModalDropdown text='Currency' compact selection>
            <Dropdown.Menu>
              <Dropdown.Item>DAI</Dropdown.Item>
              <Dropdown.Item>JEUR</Dropdown.Item>
            </Dropdown.Menu>
          </ModalDropdown>
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
