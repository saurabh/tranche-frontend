import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, Field, reduxForm, getFormValues, change } from 'redux-form';
import store from 'redux/store';
import { required, number, roundNumber, isGreaterThan } from 'utils';
import { fromWei, stakingApproveContract } from 'services/contractMethods';
import { CheckBtn, TrancheIcon } from 'assets';
// import { FieldWrapper } from './styles/FormComponents';
import {
  StakeModalFormWrapper,
  StakeModalFormBtn,
  StakeModalFormInputWrapper,
  StakeModalFormInput,
  EstimatedText,
  InputTag,
  BtnLoadingIcon,
  LoadingButton,
  LoadingButtonCircle
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
  durationIndex,
  path,
  // Functions
  adjustStake,
  // Redux
  ethereum: { tokenBalance, txOngoing, trancheAllowance },
  type,
  theme,
  migrate,
  migrateLoading
}) => {
  const [balance, setBalance] = useState(0);
  const [balanceCheck, setBalanceCheck] = useState('');
  // const [LPSelect, toggleLP] = useState(false);
  const [tokenName, setTokenName] = useState(0);
  const [dropdownName, setDropdownName] = useState([]);
  const [amount, setAmount] = useState(0);
  const hasAllowance = trancheAllowance[contractAddress] ? trancheAllowance[contractAddress][tokenAddress] : false;

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
    modalTypeVar === 'liqStake' || modalTypeVar === 'staking'
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
      <Form onSubmit={(e) => adjustStake(e, contractAddress, tokenAddress, durationIndex, migrate)}>
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
              loading={txOngoing ? 'true' : ''}
              approved={hasAllowance}
              onClick={(e) => stakingApproveContract(e, contractAddress, tokenAddress, hasAllowance)}
              backgroundColor={path === 'stake' ? '#369987' : ''}
            >
              {!hasAllowance && !txOngoing ? (
                <h2>Approve Staking</h2>
              ) : !hasAllowance && txOngoing ? (
                <div className='btnLoadingIconWrapper'>
                  <div className='btnLoadingIconCut'>
                    <BtnLoadingIcon loadingColor={path === 'stake' ? '#555555' : '#555555'}></BtnLoadingIcon>
                  </div>
                </div>
              ) : hasAllowance && !txOngoing ? (
                <h2>
                  <img src={CheckBtn} alt=""/> Staking Approved
                </h2>
              ) : (
                ''
              )}
            </ModalFormButton>
          )}
          {!migrateLoading ?
             <StakeModalFormBtn 
             type='submit' 
             stake={modalTypeVar === 'liqStake' || modalTypeVar === 'staking'} 
             migrate={migrate}
             migrateStep={migrate}
             disabled={!hasAllowance || amount === 0 || balanceCheck === 'InputStylingError'}
           >
             {(modalTypeVar === 'liqStake' || modalTypeVar === 'staking') ? 'Stake' : 'Withdraw'}
           </StakeModalFormBtn> :
            <StakeModalFormBtn migrate migrateStake>
              <LoadingButton>
                {
                  [...Array(4).keys()].map((idx) =>{
                    return <LoadingButtonCircle i={idx+1}></LoadingButtonCircle>
                  })
                }
              </LoadingButton>
            </StakeModalFormBtn>
          }
        </ApproveBtnWrapper>
        
      </Form>
    </StakeModalFormWrapper>
  );
};

StakingForm = reduxForm({
  form: 'stake',
  // asyncValidate: asyncValidateSell,
  enableReinitialize: true
})(StakingForm);

const mapStateToProps = (state) => ({
  ethereum: state.ethereum,
  theme: state.theme,
  initialValues: {
    amount: ''
  },
  formValues: getFormValues('stake')(state)
});

export default StakingForm = connect(mapStateToProps, { change })(StakingForm);
