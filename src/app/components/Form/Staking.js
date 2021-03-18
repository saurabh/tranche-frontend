import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, Field, reduxForm, getFormValues, change } from 'redux-form';
import { required, number, roundNumber } from 'utils';
import { fromWei, stakingAllowanceCheck } from 'services/contractMethods';
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
  ApproveBtnWrapper,
  FieldWrapper,
  SelectCurrencyOptions,
  SelectCurrencyOption
} from './styles/FormComponents';
import i18n from '../locale/i18n';
import { ApproveBigNumber } from 'config';

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
  modalType,
  userStaked,
  tokenAddress,
  setTokenAddress,
  isLPToken,
  hasAllowance,
  setHasAllowance,
  approveLoading,
  path,
  // Functions
  stakingApproveContract,
  // setBalanceModal,
  adjustStake,
  // Redux
  ethereum: { tokenBalance },
  userSummary: { slice, lpList }
}) => {
  const [balance, setBalance] = useState(0);
  const [LPSelect, toggleLP] = useState(false);
  const [selectedLPName, setSelectedLPName] = useState(0);
  const [stakingAddress, setStakingAddress] = useState('');
  const [dropdownName, setDropdownName] = useState([]);
  const [amount, setAmount] = useState(0);
  const tokenName = isLPToken ? selectedLPName : 'SLICE';

  useEffect(() => {
    if (isLPToken && lpList) {
      setDropdownName(lpList[0].name.split(' ')[0]);
      setSelectedLPName(lpList[0].name);
      setTokenAddress(lpList[0].address);
      setStakingAddress(lpList[0].stakingAddress);
      let balance = tokenBalance[lpList[0].address];
      balance && setBalance(fromWei(balance.toString()));
    } else {
      setTokenAddress(slice.address);
      setStakingAddress(slice.stakingAddress);
      let balance = tokenBalance[slice.address];
      balance && setBalance(fromWei(balance.toString()));
    }
  }, [tokenBalance, setTokenAddress, isLPToken, slice, lpList]);

  const toggleLPSelect = () => {
    toggleLP(!LPSelect);
  };

  const handleLPSelect = async (e, index, tokenAddress, stakingAddress) => {
    e.preventDefault();
    setSelectedLPName(lpList[index].name);
    setDropdownName(lpList[index].name.split(' ')[0]);
    setTokenAddress(tokenAddress);
    setStakingAddress(stakingAddress);
    let balance = tokenBalance[tokenAddress];
    let result = await stakingAllowanceCheck(lpList[0].address, lpList[0].stakingAddress);
    setHasAllowance(result)
    setBalance(fromWei(balance.toString()));
    toggleLP(false);
  };

  const setMaxSliceAmount = useCallback(
    (e) => {
      e.preventDefault();
      let num;
      if (modalType) {
        num = balance.replace(/,/g, '');
        num = Number(num);
      } else {
        num = userStaked;
      }
      change('amount', num);
      setAmount(num);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [balance, userStaked]
  );

  return (
    <ModalAdjustForm>
      <Form component={ModalFormWrapper} onSubmit={(e) => adjustStake(e, stakingAddress, tokenAddress)}>
        <FormInputsWrapper trade={true}>
          <ModalFormGrpNewLoan trade={true} tranche={true}>
            <NewLoanFormInput>
              <NewLoanInputWrapper name='amount'>
                <ModalFormLabel htmlFor='amount' tranche={true}>
                  {tokenName === 'SLICE'
                    ? modalType
                      ? i18n.t('stake.modal.stakeFormTitle')
                      : i18n.t('stake.modal.withdrawFormTitle')
                    : 'Amount of ' + tokenName + ' to ' + (modalType ? 'stake' : 'withdraw')}
                </ModalFormLabel>
                <FieldWrapper modalType={true} staking={true}>
                  <Field
                    component={InputField}
                    onChange={(e, newValue) => setAmount(newValue)}
                    validate={[required, number]}
                    className='ModalFormInputNewLoan'
                    name='amount'
                    type='number'
                    step='0.0001'
                    id='amount'
                  />
                  <button onClick={(e) => setMaxSliceAmount(e)}>MAX</button>
                </FieldWrapper>
              </NewLoanInputWrapper>
              <LoanCustomSelect>
                <Field name='selectLP' component='input' id='selectLP' className='fieldStylingDisplay' />

                <SelectCurrencyView staking={true} onClick={() => toggleLPSelect()}>
                  <div>
                    {/* <img src={pairData[pair].img} alt='' /> */}
                    <h2>{isLPToken ? dropdownName : 'SLICE'}</h2>
                  </div>
                  <SelectChevron>
                    <img src={selectUp} alt='' />
                    <img src={selectDown} alt='' />
                  </SelectChevron>
                </SelectCurrencyView>
                {isLPToken && LPSelect ? (
                  <SelectCurrencyOptions>
                    {lpList.map((lp, index) => {
                      return (
                        <SelectCurrencyOption key={index}>
                          <button onClick={(e) => handleLPSelect(e, index, lp.address, lp.stakingAddress)}>
                            <img src={lp.img} alt='' /> {lp.name.split(' ')[0]}
                          </button>
                        </SelectCurrencyOption>
                      );
                    })}
                  </SelectCurrencyOptions>
                ) : (
                  ''
                )}
              </LoanCustomSelect>
            </NewLoanFormInput>
            <h2>
              {tokenName === 'SLICE'
                ? modalType
                  ? i18n.t('stake.modal.youHaveStake') + ' ' + roundNumber(balance) + ' ' + i18n.t('stake.modal.availableStake')
                  : i18n.t('stake.modal.youHaveWithdraw') + ' ' + userStaked + ' ' + i18n.t('stake.modal.availableWithdraw')
                : modalType
                ? `You have ${roundNumber(balance)} ${tokenName} available to stake`
                : `You have ${userStaked} ${tokenName} available to withdraw`}
            </h2>
          </ModalFormGrpNewLoan>
        </FormInputsWrapper>

        <ModalFormSubmit>
          <BtnLoanModal>
            <ApproveBtnWrapper>
              {modalType && (
                <ModalFormButton
                  type='button'
                  loading={approveLoading ? 'true' : ''}
                  approved={hasAllowance}
                  onClick={() => stakingApproveContract(stakingAddress, tokenAddress, formValues.amount)}
                  backgroundColor={path === 'stake' ? '#4441CF' : ''}
                >
                  {!hasAllowance && !approveLoading ? (
                    <h2>Approve</h2>
                  ) : !hasAllowance && approveLoading ? (
                    <div className='btnLoadingIconWrapper'>
                      <div className='btnLoadingIconCut'>
                        <BtnLoadingIcon loadingColor={path === 'stake' ? '#4441CF' : '#936CE6'}></BtnLoadingIcon>
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
              )}
            </ApproveBtnWrapper>

            <ModalFormButton
              type='submit'
              backgroundColor={modalType ? '#4441CF' : !modalType ? '#6E41CF' : '#845AD9'}
              disabled={!hasAllowance || amount === 0}
              stake
            >
              <h2>{modalType ? i18n.t('stake.modal.stake') : !modalType ? i18n.t('stake.modal.withdraw') : ''}</h2>
            </ModalFormButton>
          </BtnLoanModal>
        </ModalFormSubmit>
      </Form>
    </ModalAdjustForm>
  );
};

StakingForm = reduxForm({
  form: 'stake',
  // asyncValidate: asyncValidateSell,
  enableReinitialize: true
})(StakingForm);

const mapStateToProps = (state) => ({
  ethereum: state.ethereum,
  userSummary: state.userSummary,
  initialValues: {
    amount: ''
  },
  formValues: getFormValues('stake')(state)
});

export default StakingForm = connect(mapStateToProps, { change })(StakingForm);
