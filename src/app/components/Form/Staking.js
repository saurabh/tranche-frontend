import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, Field, reduxForm, getFormValues, change } from 'redux-form';
import { required, number, roundNumber, isGreaterThan } from 'utils';
import { fromWei } from 'services/contractMethods';
import { selectUp, selectDown, TrancheImg, TrancheImgColored, LinkArrow } from 'assets';
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
  SelectedStakingWrapper,
  SelectedStaking,
  SelectedStakingImg,
  SelectedStakingContent
} from './styles/FormComponents';
import i18n from '../locale/i18n';
import { etherScanUrl } from 'config';

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
  stakingAddress,
  isLPToken,
  hasAllowance,
  setHasAllowance,
  approveLoading,
  path,
  // Functions
  stakingApproveContract,
  adjustStake,
  contractAddress,
  // Redux
  ethereum: { tokenBalance },
  summaryData: { slice, lpList },
  type
}) => {
  const [balance, setBalance] = useState(0);
  const [balanceCheck, setBalanceCheck] = useState('');
  // const [LPSelect, toggleLP] = useState(false);
  const [selectedLPName, setSelectedLPName] = useState(0);
  const [dropdownName, setDropdownName] = useState([]);
  const [amount, setAmount] = useState(0);
  const tokenName = isLPToken ? selectedLPName : 'SLICE';

  useEffect(() => {
    if (isLPToken && lpList) {
      let lpObj = lpList.filter((i) => i.name === type)[0];
      setDropdownName(lpObj.name.split(' ')[0]);
      setSelectedLPName(lpObj.name);
      let balance = tokenBalance[lpObj.address];
      balance && setBalance(fromWei(balance.toString()));
    } else {
      let balance = tokenBalance[slice.address];
      balance && setBalance(fromWei(balance.toString()));
    }
  }, [tokenBalance, isLPToken, slice, lpList, type]);

  const handleInputChange = (newValue) => {
    setAmount(newValue);
    modalType
      ? isGreaterThan(newValue, balance)
        ? setBalanceCheck('InputStylingError')
        : setBalanceCheck('')
      : isGreaterThan(newValue, userStaked)
      ? setBalanceCheck('InputStylingError')
      : setBalanceCheck('');
  };

  const setMaxAmount = useCallback(
    (e) => {
      e.preventDefault();
      let num = modalType ? balance : userStaked;
      change('amount', num);
      setAmount(Number(num));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [balance, userStaked, modalType]
  );

  return (
    <ModalAdjustForm stake>
      <Form component={ModalFormWrapper} onSubmit={(e) => adjustStake(e, stakingAddress, tokenAddress)}>
        <FormInputsWrapper trade={true}>
          <SelectedStakingWrapper>
            <h2>Selected Staking Pool</h2>
            <SelectedStaking>
              <SelectedStakingImg>
                <img src={TrancheImg} alt='tranche' />
              </SelectedStakingImg>
              <SelectedStakingContent>
                <h2>{type} STAKING POOL</h2>
                <a href={etherScanUrl + 'address/' + contractAddress} target='_blank' rel='noopener noreferrer'>
                  {/* <img src={LinkArrow} alt='' /> */}{contractAddress}
                </a>
              </SelectedStakingContent>
            </SelectedStaking>
          </SelectedStakingWrapper>
          <ModalFormGrpNewLoan trade={true} stake={true}>
            <NewLoanFormInput>
              <NewLoanInputWrapper name='amount'>
                <ModalFormLabel htmlFor='amount' stake={true}>
                  {tokenName === 'SLICE'
                    ? modalType
                      ? i18n.t('stake.modal.stakeFormTitle')
                      : i18n.t('stake.modal.withdrawFormTitle')
                    : 'Amount of ' + tokenName + ' to ' + (modalType ? 'stake' : 'withdraw')}
                </ModalFormLabel>
                <FieldWrapper modalType={true} staking={true}>
                  <Field
                    component={InputField}
                    onChange={(e, newValue) => handleInputChange(newValue)}
                    validate={[required, number]}
                    className={`ModalFormInputNewLoan ${balanceCheck}`}
                    name='amount'
                    type='number'
                    step='0.0001'
                    id='amount'
                  />
                  <button onClick={(e) => setMaxAmount(e)}>MAX</button>
                </FieldWrapper>
              </NewLoanInputWrapper>
              <LoanCustomSelect>
                <Field name='selectLP' component='input' id='selectLP' className='fieldStylingDisplay' />

                <SelectCurrencyView staking={true}>
                  <div>
                    <img src={TrancheImgColored} alt='tranche' />
                    <h2>{isLPToken ? dropdownName : 'SLICE'}</h2>
                  </div>
                  <SelectChevron>
                    <img src={selectUp} alt='' />
                    <img src={selectDown} alt='' />
                  </SelectChevron>
                </SelectCurrencyView>
                {/* {isLPToken && LPSelect ? (
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
                )} */}
              </LoanCustomSelect>
            </NewLoanFormInput>
            <h2>
              {tokenName === 'SLICE'
                ? modalType
                  ? i18n.t('stake.modal.youHaveStake') + ' ' + roundNumber(balance) + ' ' + i18n.t('stake.modal.availableStake')
                  : i18n.t('stake.modal.youHaveWithdraw') + ' ' + roundNumber(userStaked) + ' ' + i18n.t('stake.modal.availableWithdraw')
                : modalType
                ? `You have ${roundNumber(balance)} ${tokenName} available to stake`
                : `You have ${roundNumber(userStaked)} ${tokenName} available to withdraw`}
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
              disabled={!hasAllowance || amount === 0 || balanceCheck === 'InputStylingError'}
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
  summaryData: state.summaryData,
  initialValues: {
    amount: ''
  },
  formValues: getFormValues('stake')(state)
});

export default StakingForm = connect(mapStateToProps, { change })(StakingForm);
