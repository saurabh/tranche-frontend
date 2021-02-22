import React, { useCallback, useEffect } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Form, Field, reduxForm, getFormValues, change } from 'redux-form';
import {
  required, number,
  asyncValidateSell
} from 'utils/validations';
// import { isGreaterThan } from 'utils/helperFunctions';
import { pairData } from 'config/constants';
import { selectUp, selectDown } from 'assets';
import { BtnLoanModal, BtnLoadingIcon } from '../Modals/styles/ModalsComponents';
import {
  // ModalFormGrp,
  ModalFormLabel,
  ModalFormWrapper,
  ModalAdjustForm,
  ModalFormGrpNewLoan,
  ModalFormSubmit,
  FormInputsWrapper,
  ModalFormButton,
  NewLoanInputWrapper,
  NewLoanFormInput,
  SelectChevron,
  LoanCustomSelect,
  SelectCurrencyView,
  ApproveBtnWrapper
} from './styles/FormComponents';

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

let StakingForm = ({
  // Redux-form
  // pristine,
  // submitting,
  change,
  formValues,
  // State Values
  address,
  sellToggle,
  buyToggle,
  modalType,
  hasAllowance,
  approveLoading,
  isLPToken,
  // Functions
  stakingAllowanceCheck,
  stakingApproveContract,
  adjustStake,
  // API Values
}) => {
  const pair = pairData[1].value;
  const setLoanIdandAddress = useCallback(() => {
    change('address', address);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  useEffect(() => {
    setLoanIdandAddress();
  }, [setLoanIdandAddress]);

  const debounceAllowanceCheck = useCallback(
    _.debounce(
      async (amount) => {
        await stakingAllowanceCheck(amount, sellToggle);
      },
      500,
      { leading: true }
    ),
    []
  );

  return (
    <ModalAdjustForm>
      <Form component={ModalFormWrapper} onSubmit={(e) => adjustStake(e, isLPToken)}>
        <FormInputsWrapper trade={true}>
          <ModalFormGrpNewLoan trade={true} tranche={true}>
            <NewLoanFormInput>
              <NewLoanInputWrapper name='amount'>
                <ModalFormLabel htmlFor='amount' tranche={true}>
                  Amount of SLICE to {modalType ? 'stake' : 'withdraw'}:
                </ModalFormLabel>
                <Field
                  component={InputField}
                  onChange={(e, newValue) => debounceAllowanceCheck(newValue, isLPToken)}
                  validate={[required, number]}
                  className='ModalFormInputNewLoan'
                  name='amount'
                  type='number'
                  step='0.0001'
                  id='amount'
                />
              </NewLoanInputWrapper>

              <LoanCustomSelect>
                <Field
                  name='pairId'
                  component='input'
                  id='selectPair'
                  className='fieldStylingDisplay'
                />
                <SelectCurrencyView>
                  <div>
                    <img src={pairData[pair].img} alt='' />
                    <h2>{pairData[pair].text}</h2>
                  </div>
                  <SelectChevron>
                    <img src={selectUp} alt='' />
                    <img src={selectDown} alt='' />
                  </SelectChevron>
                </SelectCurrencyView>
                {/* {currencySelect ? (
                    <SelectCurrencyOptions>
                      {pairData.map((i) => {
                        return (
                          <SelectCurrencyOption key={i.key}>
                            <button onClick={(e) => handleCurrencySelect(e, i.value)} value={i.key}>
                              <img src={i.img} alt='' /> {i.text}
                            </button>
                          </SelectCurrencyOption>
                        );
                      })}
                    </SelectCurrencyOptions>
                  ) : (
                    ''
                  )} */}
              </LoanCustomSelect>
            </NewLoanFormInput>
            <h2>
              {modalType
                ? 'You have 1,012,151 SLICE available to stake'
                : 'You have 1,012,151 SLICE available to withdraw'}
            </h2>
          </ModalFormGrpNewLoan>
        </FormInputsWrapper>

        <ModalFormSubmit>
          <BtnLoanModal>
            <ApproveBtnWrapper>
              <ModalFormButton
                type='button'
                loading={approveLoading ? 'true' : ''}
                approved={hasAllowance}
                onClick={() => stakingApproveContract(formValues.amount, isLPToken)}
              >
                {!hasAllowance && !approveLoading ? (
                  <h2>Approve</h2>
                ) : !hasAllowance && approveLoading ? (
                  <div className='btnLoadingIconWrapper'>
                    <div className='btnLoadingIconCut'>
                      <BtnLoadingIcon loadingColor='#936CE6'></BtnLoadingIcon>
                    </div>
                  </div>
                ) : hasAllowance && !approveLoading ? (
                  <h2>
                    <span></span> Approved
                  </h2>
                ) : (
                  ''
                )}
              </ModalFormButton>
            </ApproveBtnWrapper>
            <ModalFormButton
              type='submit'
              backgroundColor={modalType ? '#0071F5' : !modalType ? '#FD8383' : '#845AD9'}
              disabled={!hasAllowance}
            >
              <h2>{modalType ? 'STAKE' : !modalType ? 'WITHDRAW' : ''}</h2>
            </ModalFormButton>
          </BtnLoanModal>
        </ModalFormSubmit>
      </Form>
    </ModalAdjustForm>
  );
};

StakingForm = reduxForm({
  form: 'stake',
  asyncValidate: asyncValidateSell,
  enableReinitialize: true
})(StakingForm);

const mapStateToProps = (state) => ({
  ethereum: state.ethereum,
  initialValues: {
    address: ''
  },
  formValues: getFormValues('stake')(state)
});

export default StakingForm = connect(mapStateToProps, { change })(StakingForm);
