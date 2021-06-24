import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, Field, reduxForm, getFormValues, change } from 'redux-form';
import store from 'redux/store';
import { required, number, roundNumber, isGreaterThan } from 'utils';
import { fromWei } from 'services/contractMethods';
import { CheckBtn, TrancheIcon } from 'assets';
// import { FieldWrapper } from './styles/FormComponents';
import {
  StakeModalFormWrapper,
  StakeModalFormBtn,
  StakeModalFormInputWrapper,
  StakeModalFormInput,
  EstimatedText,
  InputTag,
  BtnLoadingIcon
} from '../Modals/styles/ModalsComponents';
import { ApproveBtnWrapper, ModalFormButton } from './styles/FormComponents';
import i18n from '../locale/i18n';
import { ModeThemes } from 'config';

const InputField = ({ input, type, className, meta: { touched, error } }) => {
  const state = store.getState();
  const { theme } = state;
  return (
    <div>
      {touched && error ? (
        <StakeModalFormInput inputColor={ModeThemes[theme].BorderStake} textColor={ModeThemes[theme].ModalText} {...input} type={type} className={`${className} InputStylingError`} />
      ) : (
        <StakeModalFormInput inputColor={ModeThemes[theme].BorderStake} textColor={ModeThemes[theme].ModalText} {...input} type={type} className={`${className} InputStyling`} />
      )}
      {touched && error && <span></span>}
    </div>
  );
};

let StakingForm = ({
  // Redux-form
  // pristine,
  // submitting,
  change,
  formValues,
  // State Values
  modalTypeVar,
  userStaked,
  tokenAddress,
  contractAddress,
  hasAllowance,
  setHasAllowance,
  approveLoading,
  path,
  tokenType,
  totalStaked,
  stakedShare,
  // Functions
  stakingApproveContract,
  adjustStake,
  // Redux
  ethereum: { tokenBalance, blockExplorerUrl },
  summaryData: { slice, lpList },
  type,
  theme,
  migrate
}) => {
  const [balance, setBalance] = useState(0);
  const [balanceCheck, setBalanceCheck] = useState('');
  // const [LPSelect, toggleLP] = useState(false);
  const [tokenName, setTokenName] = useState(0);
  const [dropdownName, setDropdownName] = useState([]);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    let balance = tokenBalance[tokenAddress] ? tokenBalance[tokenAddress] : '0';
    setBalance(fromWei(balance));
    if (type !== 'SLICE') {
      setDropdownName(type.split(' ')[0]);
      setTokenName(type.concat(' Tokens'));
    } else {
      setDropdownName(type);
      setTokenName(type);
    }
  }, [type, tokenAddress, tokenBalance]);

  const handleInputChange = (newValue) => {
    setAmount(newValue);
    modalTypeVar === 'liqStake'
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
      let num = modalTypeVar === 'liqStake' ? balance : userStaked;
      change('amount', num);
      setAmount(Number(num));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [balance, userStaked, modalTypeVar]
  );

  return (
    <StakeModalFormWrapper textColor={ModeThemes[theme].ModalText} inputText={ModeThemes[theme].inputText} stake migrate={migrate}>
      <h2>Amount of {tokenName} to {modalTypeVar === 'liqStake' || modalTypeVar === 'staking' ? 'Stake' : 'Withdraw'}: </h2>
      <Form onSubmit={(e) => adjustStake(e, contractAddress, tokenAddress)}>
        <h2>You have {modalTypeVar === 'liqStake' || modalTypeVar === 'staking' ? roundNumber(balance) : roundNumber(userStaked)} {tokenName} available to {modalTypeVar === 'liqStake' ? 'stake' : 'withdraw'}</h2>
        <StakeModalFormInputWrapper textColor={ModeThemes[theme].ModalText} borderColor={ModeThemes[theme].borderInputColor}>
          <Field
            component={InputField}
            onChange={(e, newValue) => handleInputChange(newValue)}
            validate={[required, number]}
            className={`${balanceCheck}`}
            name='amount'
            type='number'
            step='0.0001'
            id='amount'
          />
          {/* <button onClick={(e) => setMaxAmount(e)}>{i18n.t('tranche.trancheData.max')}</button> */}
          <InputTag textColor={ModeThemes[theme].ModalText} borderColor={ModeThemes[theme].borderInputColor}>
            <img src={TrancheIcon} alt='' />
            <h2>{dropdownName}</h2>
          </InputTag>
        </StakeModalFormInputWrapper>
        {modalTypeVar === 'staking' && <EstimatedText textColor={ModeThemes[theme].ModalText} EstimatedTextColor={ModeThemes[theme].EstimatedColor} migrate={migrate}>
          <h2>{i18n.t('Estimated')}</h2>
          <h2>You will get 1000 SLICE per week</h2>
        </EstimatedText>}
        <ApproveBtnWrapper migrate={migrate}>
          {(modalTypeVar === 'liqStake' || modalTypeVar === 'staking') && (
            <ModalFormButton
              type='button'
              loading={approveLoading ? 'true' : ''}
              approved={hasAllowance}
<<<<<<< HEAD
              onClick={() => stakingApproveContract(stakingAddress, tokenAddress, formValues.amount)}
              backgroundColor={path === 'stake' ? '#369987' : ''}
=======
              onClick={() => stakingApproveContract(contractAddress, tokenAddress, formValues.amount)}
              backgroundColor={path === 'stake' ? '#4441CF' : ''}
>>>>>>> ba458858b65743176698edee02b10224f87f6cb2
            >
              {!hasAllowance && !approveLoading ? (
                <h2>Approve Staking</h2>
              ) : !hasAllowance && approveLoading ? (
                <div className='btnLoadingIconWrapper'>
                  <div className='btnLoadingIconCut'>
                    <BtnLoadingIcon loadingColor={path === 'stake' ? '#555555' : '#555555'}></BtnLoadingIcon>
                  </div>
                </div>
              ) : hasAllowance && !approveLoading ? (
                <h2>
                  <img src={CheckBtn} alt=""/> Staking Approved
                </h2>
              ) : (
                ''
              )}
            </ModalFormButton>
          )}
          <StakeModalFormBtn 
            type='submit' 
            stake={modalTypeVar === 'liqStake' || modalTypeVar === 'staking'} 
            migrate={migrate}
            disabled={!hasAllowance || amount === 0 || balanceCheck === 'InputStylingError'}
          >
            {(modalTypeVar === 'liqStake' || modalTypeVar === 'staking') ? 'Stake' : 'Withdraw'}
          </StakeModalFormBtn>
        </ApproveBtnWrapper>
        
      </Form>
    </StakeModalFormWrapper>
    // <ModalAdjustForm stake>
    //   <Form component={ModalFormWrapper} onSubmit={(e) => adjustStake(e, contractAddress, tokenAddress)}>
    //     <FormInputsWrapper trade={true} stake>
    //       <SelectedStakingWrapper ModalText={ModeThemes[theme].ModalText}>
    //         <h2>{i18n.t('stake.modal.selectedStaking')}</h2>
    //         <SelectedStaking color={ModeThemes[theme].SelectedStaking}>
    //           <SelectedStakingImg>
    //             <img src={TrancheImg} alt='tranche' />
    //           </SelectedStakingImg>
    //           <SelectedStakingContent
    //             SelectedStakingText={ModeThemes[theme].SelectedStakingText}
    //             SelectedStakingLink={ModeThemes[theme].SelectedStakingLink}
    //           >
    //             <h2>{type}</h2>
    //             <a href={blockExplorerUrl + 'address/' + contractAddress} target='_blank' rel='noopener noreferrer'>
    //               {contractAddress}
    //             </a>
    //           </SelectedStakingContent>
    //         </SelectedStaking>
    //       </SelectedStakingWrapper>
    //       <ModalFormGrpNewLoan trade={true} stake={true} StakingInputText={ModeThemes[theme].StakingInputText}>
    //         <NewLoanFormInput>
    //           <NewLoanInputWrapper name='amount'>
    //             <ModalFormLabel htmlFor='amount' stake={true} ModalText={ModeThemes[theme].ModalText}>
    //               {tokenName === 'SLICE'
    //                 ? modalType
    //                   ? i18n.t('stake.modal.stakeFormTitle')
    //                   : i18n.t('stake.modal.withdrawFormTitle')
    //                 : 'Amount of ' + tokenName + ' to ' + (modalType ? 'stake' : 'withdraw')}
    //             </ModalFormLabel>
    //             <FieldWrapper
    //               modalType={true}
    //               staking={true}
    //               StakingInputText={ModeThemes[theme].StakingInputText}
    //               StakingMax={ModeThemes[theme].StakingMax}
    //               ModalText={ModeThemes[theme].ModalText}
    //             >
    //               <Field
    //                 component={InputField}
    //                 onChange={(e, newValue) => handleInputChange(newValue)}
    //                 validate={[required, number]}
    //                 className={`ModalFormInputNewLoan ${balanceCheck}`}
    //                 name='amount'
    //                 type='number'
    //                 step='0.0001'
    //                 id='amount'
    //               />
    //               <button onClick={(e) => setMaxAmount(e)}>{i18n.t('tranche.trancheData.max')}</button>
    //             </FieldWrapper>
    //           </NewLoanInputWrapper>
    //           <LoanCustomSelect>
    //             <Field name='selectLP' component='input' id='selectLP' className='fieldStylingDisplay' />

    //             <SelectCurrencyView staking={true} ModalText={ModeThemes[theme].ModalText}>
    //               <div>
    //                 <img src={TrancheImgColored} alt='tranche' />
    //                 <h2>{isLPToken ? dropdownName : 'SLICE'}</h2>
    //               </div>
    //             </SelectCurrencyView>
    //           </LoanCustomSelect>
    //         </NewLoanFormInput>
    //         <h2>
    //           {tokenName === 'SLICE'
    //             ? modalType
    //               ? i18n.t('stake.modal.youHaveStake') + ' ' + roundNumber(balance) + ' ' + i18n.t('stake.modal.availableStake')
    //               : i18n.t('stake.modal.youHaveWithdraw') + ' ' + roundNumber(userStaked) + ' ' + i18n.t('stake.modal.availableWithdraw')
    //             : modalType
    //             ? `You have ${roundNumber(balance)} ${tokenName} available to stake`
    //             : `You have ${roundNumber(userStaked)} ${tokenName} available to withdraw`}
    //         </h2>
    //       </ModalFormGrpNewLoan>
    //     </FormInputsWrapper>

    //     <ModalFormSubmit ModalBackground={ModeThemes[theme].ModalBackground}>
    //       <BtnLoanModal>
    //         <ApproveBtnWrapper>
    //           {modalType && (
    //             <ModalFormButton
    //               type='button'
    //               loading={approveLoading ? 'true' : ''}
    //               approved={hasAllowance}
    //               onClick={() => stakingApproveContract(contractAddress, tokenAddress, formValues.amount)}
    //               backgroundColor={path === 'stake' ? '#4441CF' : ''}
    //             >
    //               {!hasAllowance && !approveLoading ? (
    //                 <h2>Approve</h2>
    //               ) : !hasAllowance && approveLoading ? (
    //                 <div className='btnLoadingIconWrapper'>
    //                   <div className='btnLoadingIconCut'>
    //                     <BtnLoadingIcon loadingColor={path === 'stake' ? '#4441CF' : '#936CE6'}></BtnLoadingIcon>
    //                   </div>
    //                 </div>
    //               ) : hasAllowance && !approveLoading ? (
    //                 <h2>
    //                   <span></span> Approved
    //                 </h2>
    //               ) : (
    //                 ''
    //               )}
    //             </ModalFormButton>
    //           )}
    //         </ApproveBtnWrapper>

    //         <ModalFormButton
    //           type='submit'
    //           backgroundColor={modalType ? '#4441CF' : !modalType ? '#6E41CF' : '#845AD9'}
    //           disabled={!hasAllowance || amount === 0 || balanceCheck === 'InputStylingError'}
    //           stake
    //         >
    //           <h2>{modalType ? i18n.t('stake.modal.stake') : !modalType ? i18n.t('stake.modal.withdraw') : ''}</h2>
    //         </ModalFormButton>
    //       </BtnLoanModal>
    //     </ModalFormSubmit>
    //     <LoanDetailsMobile  ModalText={ModeThemes[theme].ModalText}>
    //       <h2>
    //         {tokenType === "SLICE" ? i18n.t('stake.modal.userSLICE') : tokenType === "LP Tokens" ? i18n.t('stake.modal.userSLICELP') : ""} — {roundNumber(userStaked)}
    //         <span></span>
    //       </h2>
    //       <h2>
    //         {tokenType === "SLICE" ? i18n.t('stake.modal.totalSLICE') : tokenType === "LP Tokens" ? i18n.t('stake.modal.totalSLICELP') : ""} — {roundNumber(totalStaked) !== 'NaN' ? roundNumber(totalStaked) : 0}
    //         <span></span>
    //       </h2>
    //       <h2>
    //         {i18n.t('stake.modal.yourShare')} — {roundNumber(stakedShare, 2) !== 'NaN' ? roundNumber(stakedShare, 2) : 0}%
    //       </h2>
    //     </LoanDetailsMobile>
    //   </Form>
    // </ModalAdjustForm>
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
  theme: state.theme,
  initialValues: {
    amount: ''
  },
  formValues: getFormValues('stake')(state)
});

export default StakingForm = connect(mapStateToProps, { change })(StakingForm);
