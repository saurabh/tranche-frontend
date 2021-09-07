import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, Field, reduxForm, getFormValues, change } from 'redux-form';
import { number } from 'utils/validations';
import ReactLoading from 'react-loading';
import {
  TableMoreRowWrapper,
  TableMoreRowContent,
  TableMoreRowContentLeft,
  TableMoreRowContentRight,
  TableMoreRightSection,
  FormContent,
  CheckboxWrapper,
  CheckboxContent,
  TableMoreTitleWrapper,
  MobileMoreFormBtns,
  MobileMoreFormBtn,
  TableMoreLeftSection,
  TableMoreLeftSectionContent,
  TableMoreLeftTopSection,
  TableMoreLeftBottomSection,
  TooltipWrapper
} from '../../Stake/Table/styles/TableComponents';
import { LoadingButton, LoadingButtonCircle } from '../../Modals/styles/ModalsComponents';
import { BtnArrow } from 'assets';
import { setTxModalOpen, setTxModalType, setTxModalData, setTxModalStatus, setTxModalLoading } from 'redux/actions/tableData';
import { fromWei } from 'services/contractMethods';
import { roundNumber, isGreaterThan, isEqualTo, isLessThan } from 'utils';
import { ModeThemes, ETHorMaticCheck } from 'config';
import i18n from '../../locale/i18n';

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

let TableMoreRow = ({
  name,
  type,
  trancheId,
  apyStatus,
  apy,
  sliceAPY,
  netAPY,
  contractAddress,
  cryptoType,
  dividendType,
  protocolAPY,
  buyerTokenBalance,
  trancheToken,
  trancheRate,
  buyerCoinAddress,
  trancheTokenAddress,
  // isDepositApproved,
  // isWithdrawApproved,
  // setDepositApproved,
  // setWithdrawApproved,
  // redux
  ethereum: { tokenBalance, trancheAllowance, txOngoing },
  data: { txOngoingData, trancheCard },
  setTxModalOpen,
  setTxModalType,
  setTxModalStatus,
  setTxModalData,
  setTxModalLoading,
  change,
  formValues,
  theme
}) => {
  const [isEth, setIsEth] = useState(false);
  const [isDepositApproved, setDepositApproved] = useState(false);
  const [isWithdrawApproved, setWithdrawApproved] = useState(false);
  const [depositBalanceCheck, setDepositBalanceCheck] = useState('');
  const [withdrawBalanceCheck, setWithdrawBalanceCheck] = useState('');
  const [formType, setFormType] = useState('deposit');
  const [isDesktop, setDesktop] = useState(window.innerWidth > 992);
  const [TooltipToggle, setTooltipToggle] = useState('');
  let trancheTokenBalance = tokenBalance[trancheTokenAddress] && fromWei(tokenBalance[trancheTokenAddress]);

  const updateMedia = () => {
    setDesktop(window.innerWidth > 992);
  };

  const tooltipToggle = (val) => {
    setTooltipToggle(val);
  };

  const openModal = (txType, isDeposit) => {
    setTxModalType(txType);
    setTxModalOpen(true);
    setTxModalData({
      name: name.split('-')[1].trim(),
      contractAddress,
      trancheId,
      trancheType: type,
      apyStatus,
      cryptoType,
      trancheToken,
      dividendType,
      apy,
      protocolAPY,
      sliceAPY,
      netAPY,
      isDeposit,
      isDepositApproved,
      isWithdrawApproved,
      buyerCoinAddress,
      trancheTokenAddress
    });
  };

  // const closeModal = () => {
  //   setTxModalOpen(false);
  //   setTxModalStatus('initialState');
  //   setTxModalLoading(false);
  // };

  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  });

  useEffect(() => {
    if (trancheAllowance[contractAddress]) {
      if (ETHorMaticCheck.indexOf(cryptoType) !== -1) {
        setIsEth(true);
        setDepositApproved(true);
        setWithdrawApproved(trancheAllowance[contractAddress][trancheTokenAddress]);
        change('withdrawIsApproved', trancheAllowance[contractAddress][trancheTokenAddress]);
      } else {
        setIsEth(false);
        setDepositApproved(trancheAllowance[contractAddress][buyerCoinAddress]);
        setWithdrawApproved(trancheAllowance[contractAddress][trancheTokenAddress]);
        change('depositIsApproved', trancheAllowance[contractAddress][buyerCoinAddress]);
        change('withdrawIsApproved', trancheAllowance[contractAddress][trancheTokenAddress]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cryptoType, buyerCoinAddress, trancheTokenAddress, trancheAllowance, setDepositApproved, setWithdrawApproved]);

  const setMaxAmount = useCallback(
    (e, type) => {
      // e.preventDefault();
      if (type) {
        change('depositAmount', buyerTokenBalance);
        isEqualTo(buyerTokenBalance, 0) ? setDepositBalanceCheck('InputStylingError') : setDepositBalanceCheck('');
      } else {
        change('withdrawAmount', trancheTokenBalance);
        isEqualTo(trancheTokenBalance, 0) ? setWithdrawBalanceCheck('InputStylingError') : setWithdrawBalanceCheck('');
      }
    },
    [buyerTokenBalance, trancheTokenBalance, change]
  );

  const handleInputChange = (newValue, type) => {
    if (type) {
      isGreaterThan(newValue, buyerTokenBalance || 0) || isLessThan(newValue, 0)
        ? setDepositBalanceCheck('InputStylingError')
        : setDepositBalanceCheck('');
    } else {
      isGreaterThan(newValue, trancheTokenBalance || 0) || isLessThan(newValue, 0)
        ? setWithdrawBalanceCheck('InputStylingError')
        : setWithdrawBalanceCheck('');
    }
  };

  return (
    <TableMoreRowWrapper>
      <TableMoreRowContent>
        <TableMoreRowContentLeft>
          <TableMoreLeftTopSection color={ModeThemes[theme].dropDownBorder}>
            <TableMoreLeftSection color={ModeThemes[theme].dropDownBorder}>
              <TableMoreLeftSectionContent titleColor={ModeThemes[theme].titleSectionText} value={ModeThemes[theme].valueSectionText} dividend>
                <h2>
                  {dividendType} {i18n.t('tranche.trancheData.APY')}
                </h2>
                <h2>{protocolAPY && roundNumber(protocolAPY, 2) !== 'NaN' ? roundNumber(protocolAPY, 2) : 0}%</h2>
              </TableMoreLeftSectionContent>
            </TableMoreLeftSection>

            <TableMoreLeftSection color={ModeThemes[theme].dropDownBorder}>
              <TableMoreLeftSectionContent titleColor={ModeThemes[theme].titleSectionText} value={ModeThemes[theme].valueSectionText}>
                <h2>{i18n.t('tranche.trancheData.trancheAPY')}</h2>
                <h2>{apy && roundNumber(apy, 2) !== 'NaN' ? roundNumber(apy, 2) : 0}%</h2>
              </TableMoreLeftSectionContent>
            </TableMoreLeftSection>

            <TableMoreLeftSection color={ModeThemes[theme].dropDownBorder}>
              <TableMoreLeftSectionContent titleColor={ModeThemes[theme].titleSectionText} value={ModeThemes[theme].valueSectionText}>
                <h2>{i18n.t('tranche.trancheData.sliceAPY')}</h2>
                {/* <h2>{sliceAPY && roundNumber(sliceAPY, 2) !== 'NaN' ? roundNumber(sliceAPY, 2) : 0}%</h2> */}
                <h2>TBD</h2>
              </TableMoreLeftSectionContent>
            </TableMoreLeftSection>

            <TableMoreLeftSection color={ModeThemes[theme].dropDownBorder} last>
              <TableMoreLeftSectionContent titleColor={ModeThemes[theme].titleSectionText} value={ModeThemes[theme].valueSectionText}>
                <h2 onMouseOver={() => tooltipToggle('PRICE')} onMouseLeave={() => tooltipToggle('')}>
                  {i18n.t('tranche.trancheData.price')}
                </h2>
                <h2>
                  {roundNumber(trancheRate)} {cryptoType}
                </h2>
                <TooltipWrapper tooltip={TooltipToggle === 'PRICE'} row color={ModeThemes[theme].Tooltip}>
                  <div>
                    <h2>The value of each instrument token.</h2>
                  </div>
                </TooltipWrapper>
              </TableMoreLeftSectionContent>
            </TableMoreLeftSection>
          </TableMoreLeftTopSection>
          <TableMoreLeftBottomSection titleColor={ModeThemes[theme].titleColor} value={ModeThemes[theme].textColor}>
            <h2>{type === 'TRANCHE_A' ? i18n.t('tranche.trancheData.fixedRate') : i18n.t('tranche.trancheData.variableRate')}</h2>
            <p>
              {type === 'TRANCHE_A'
                ? `${name} ${i18n.t('tranche.trancheData.isTheSenior')} ${dividendType}  ${i18n.t('tranche.trancheData.token')}. ${i18n.t(
                    'tranche.trancheData.thisTrancheFixed'
                  )} ${roundNumber(apy, 2)}%, ${i18n.t('tranche.trancheData.inAddition')}`
                : `${name} ${i18n.t('tranche.trancheData.isTheJunior')}  ${dividendType}  ${i18n.t('tranche.trancheData.token')}. ${i18n.t(
                    'tranche.trancheData.thisTrancheVariable'
                  )} ${roundNumber(apy, 2)}%, ${i18n.t('tranche.trancheData.inAddition')}`}
            </p>
          </TableMoreLeftBottomSection>
        </TableMoreRowContentLeft>

        {isDesktop ? (
          <TableMoreRowContentRight>
            <TableMoreRightSection
              color={ModeThemes[theme].dropDownBorder}
              disabledBackground={ModeThemes[theme].inputDisabledBackground}
              btn={ModeThemes[theme].backgroundBorder}
              // loading={txOngoing}
              disabled={!isDepositApproved}
              approved={!isDepositApproved}
              disabledColor={ModeThemes[theme].DisabledBtn}
              disabledTextColor={ModeThemes[theme].DisabledBtnText}
            >
              {/* {txOngoing && (
                <div>
                  <ReactLoading type={'spin'} color={ModeThemes[theme].loadingSpinner} />
                </div>
              )} */}
              <TableMoreTitleWrapper color={ModeThemes[theme].dropDownText}>
                <h2>{i18n.t('tranche.trancheData.deposit')}</h2>
                {/* <CheckboxWrapper hidden={isEth}>
                  <h2>{isDepositApproved ? i18n.t('tranche.trancheData.enabled') : i18n.t('tranche.trancheData.disabled')}</h2>
                  <CheckboxContent disabled={txOngoing}>
                    <Field
                      component='input'
                      type='checkbox'
                      name='depositIsApproved'
                      id='depositIsApproved'
                      checked={isDepositApproved}
                      disabled={txOngoing}
                    />
                    <label
                      onClick={txOngoing ? () => {} : (e) => approveContract(true, isDepositApproved, e)}
                      htmlFor='depositIsApproved'
                    ></label>
                  </CheckboxContent>
                </CheckboxWrapper> */}
              </TableMoreTitleWrapper>

              <h2>
                {i18n.t('tranche.trancheData.balance')}: {buyerTokenBalance ? roundNumber(buyerTokenBalance) : '0'} {cryptoType}
              </h2>
              <Form onSubmit={(e) => e.preventDefault()}>
                <FormContent color={ModeThemes[theme].dropDownText} background={ModeThemes[theme].inputBackground}>
                  <Field
                    component={InputField}
                    validate={[number]}
                    onChange={(e, newValue) => handleInputChange(newValue, true)}
                    disabled={!isDepositApproved}
                    className={depositBalanceCheck}
                    name='depositAmount'
                    type='number'
                    step='0.001'
                  />
                  {!isEth && <h2 onClick={isDepositApproved ? (e) => setMaxAmount(e, true) : undefined}>{i18n.t('tranche.trancheData.max')}</h2>}
                </FormContent>
                {isDepositApproved ? (
                  txOngoing && txOngoingData.isDeposit === true && txOngoingData.trancheCardId === trancheCard.id ? (
                    <button>
                      <LoadingButton>
                        {[...Array(4).keys()].map((idx) => {
                          return <LoadingButtonCircle i={idx + 1}></LoadingButtonCircle>;
                        })}
                      </LoadingButton>
                    </button>
                  ) : (
                    <button
                      onClick={() => openModal('trancheConfirm', true)}
                      disabled={depositBalanceCheck === 'InputStylingError' || +formValues.depositAmount <= 0 || isNaN(+formValues.depositAmount)}
                    >
                      <img src={BtnArrow} alt='arrow' />
                      {i18n.t('tranche.trancheData.deposit')}
                    </button>
                  )
                ) : txOngoing && txOngoingData.isDeposit === true && txOngoingData.trancheCardId === trancheCard.id ? (
                  <button>
                    <LoadingButton>
                      {[...Array(4).keys()].map((idx) => {
                        return <LoadingButtonCircle i={idx + 1}></LoadingButtonCircle>;
                      })}
                    </LoadingButton>
                  </button>
                ) : (
                  <button onClick={() => openModal('trancheEnable', true)}>
                    <img src={BtnArrow} alt='arrow' />
                    Enable
                  </button>
                )}
              </Form>
            </TableMoreRightSection>
            <TableMoreRightSection
              withdraw
              color={ModeThemes[theme].dropDownBorder}
              disabledBackground={ModeThemes[theme].inputDisabledBackground}
              btn={ModeThemes[theme].backgroundBorder}
              // loading={txOngoing}
              disabled={!isWithdrawApproved}
              approved={!isWithdrawApproved}
              disabledColor={ModeThemes[theme].DisabledBtn}
              disabledTextColor={ModeThemes[theme].DisabledBtnText}
            >
              {/* {txOngoing && (
                <div>
                  <ReactLoading type={'spin'} color={ModeThemes[theme].loadingSpinner} />
                </div>
              )} */}
              <TableMoreTitleWrapper color={ModeThemes[theme].dropDownText}>
                <h2>{i18n.t('tranche.trancheData.withdraw')}</h2>
                {/* <CheckboxWrapper>
                  <h2>{isWithdrawApproved ? i18n.t('tranche.trancheData.enabled') : i18n.t('tranche.trancheData.disabled')}</h2>
                  <CheckboxContent disabled={txOngoing}>
                    <Field
                      component='input'
                      type='checkbox'
                      name='withdrawIsApproved'
                      id='withdrawIsApproved'
                      checked={isWithdrawApproved}
                      disabled={txOngoing}
                    />
                    <label onClick={txOngoing ? () => {} : (e) => approveContract(false, isWithdrawApproved, e)} htmlFor='withdrawIsApproved'></label>
                  </CheckboxContent>
                </CheckboxWrapper> */}
              </TableMoreTitleWrapper>
              <h2>
                {i18n.t('tranche.trancheData.balance')}: {trancheTokenBalance ? roundNumber(trancheTokenBalance) : '0'} {trancheToken}
              </h2>
              <Form onSubmit={(e) => e.preventDefault()}>
                <FormContent
                  color={ModeThemes[theme].dropDownText}
                  background={ModeThemes[theme].inputBackground}
                  disabledBackground={ModeThemes[theme].inputDisabledBackground}
                  btn={ModeThemes[theme].backgroundBorder}
                >
                  <Field
                    component={InputField}
                    validate={[number]}
                    onChange={(e, newValue) => handleInputChange(newValue, false)}
                    disabled={!isWithdrawApproved}
                    className={withdrawBalanceCheck}
                    name='withdrawAmount'
                    type='number'
                    step='0.001'
                  />
                  <h2 onClick={isWithdrawApproved ? (e) => setMaxAmount(e, false) : undefined}>{i18n.t('tranche.trancheData.max')}</h2>
                </FormContent>
                {isWithdrawApproved ? (
                  txOngoing && txOngoingData.isDeposit === false && txOngoingData.trancheCardId === trancheCard.id ? (
                    <button>
                      <LoadingButton>
                        {[...Array(4).keys()].map((idx) => {
                          return <LoadingButtonCircle i={idx + 1}></LoadingButtonCircle>;
                        })}
                      </LoadingButton>
                    </button>
                  ) : (
                    <button
                      onClick={() => openModal('trancheConfirm', false)}
                      disabled={withdrawBalanceCheck === 'InputStylingError' || +formValues.withdrawAmount <= 0 || isNaN(+formValues.withdrawAmount)}
                    >
                      <img src={BtnArrow} alt='arrow' />
                      {i18n.t('tranche.trancheData.withdraw')}
                    </button>
                  )
                ) : txOngoing && txOngoingData.isDeposit === false && txOngoingData.trancheCardId === trancheCard.id ? (
                  <button>
                    <LoadingButton>
                      {[...Array(4).keys()].map((idx) => {
                        return <LoadingButtonCircle i={idx + 1}></LoadingButtonCircle>;
                      })}
                    </LoadingButton>
                  </button>
                ) : (
                  <button onClick={() => openModal('trancheEnable', false)}>
                    <img src={BtnArrow} alt='arrow' />
                    Enable
                  </button>
                )}
              </Form>
            </TableMoreRightSection>
          </TableMoreRowContentRight>
        ) : (
          <TableMoreRowContentRight>
            {formType === 'deposit' ? (
              <TableMoreRightSection
                color={ModeThemes[theme].dropDownBorder}
                disabledBackground={ModeThemes[theme].inputDisabledBackground}
                btn={ModeThemes[theme].backgroundBorder}
                // loading={txOngoing}
                disabled={!isDepositApproved}
                approved={!isDepositApproved}
                disabledColor={ModeThemes[theme].DisabledBtn}
                disabledTextColor={ModeThemes[theme].DisabledBtnText}
              >
                {txOngoing && (
                  <div>
                    <ReactLoading type={'spin'} color={ModeThemes[theme].loadingSpinner} />
                  </div>
                )}
                <TableMoreTitleWrapper color={ModeThemes[theme].dropDownText}>
                  <MobileMoreFormBtns color={ModeThemes[theme].dropDownText}>
                    <MobileMoreFormBtn current={formType === 'deposit'} onClick={() => setFormType('deposit')} color={ModeThemes[theme].dropDownText}>
                      {i18n.t('tranche.trancheData.deposit')}
                    </MobileMoreFormBtn>
                    <MobileMoreFormBtn
                      current={formType === 'withdraw'}
                      onClick={() => setFormType('withdraw')}
                      color={ModeThemes[theme].dropDownText}
                    >
                      {i18n.t('tranche.trancheData.withdraw')}
                    </MobileMoreFormBtn>
                  </MobileMoreFormBtns>
                  {/* <CheckboxWrapper hidden={isEth}>
                    <h2>{isDepositApproved ? i18n.t('tranche.trancheData.enabled') : i18n.t('tranche.trancheData.disabled')}</h2>

                    <CheckboxContent disabled={txOngoing}>
                      <Field
                        component='input'
                        type='checkbox'
                        name='depositIsApproved'
                        id='depositIsApproved'
                        checked={isDepositApproved}
                        disabled={txOngoing}
                      />
                      <label
                        onClick={txOngoing ? () => {} : (e) => approveContract(true, isDepositApproved, e)}
                        htmlFor='depositIsApproved'
                      ></label>
                    </CheckboxContent>
                  </CheckboxWrapper> */}
                </TableMoreTitleWrapper>

                <h2>
                  {i18n.t('tranche.trancheData.balance')}: {buyerTokenBalance ? roundNumber(buyerTokenBalance) : '0'} {cryptoType}
                </h2>
                <Form onSubmit={(e) => e.preventDefault()}>
                  <FormContent
                    color={ModeThemes[theme].dropDownText}
                    background={ModeThemes[theme].inputBackground}
                    disabledBackground={ModeThemes[theme].inputDisabledBackground}
                    btn={ModeThemes[theme].backgroundBorder}
                  >
                    <Field
                      component='input'
                      validate={[number]}
                      onChange={(e, newValue) => handleInputChange(newValue, true)}
                      disabled={!isDepositApproved}
                      className={depositBalanceCheck}
                      name='depositAmount'
                      type='number'
                      step='0.001'
                    />
                    {!isEth && <h2 onClick={isDepositApproved ? (e) => setMaxAmount(e, true) : undefined}>{i18n.t('tranche.trancheData.max')}</h2>}
                  </FormContent>
                  {isDepositApproved ? (
                    <button
                      onClick={() => openModal('trancheConfirm', true)}
                      disabled={depositBalanceCheck === 'InputStylingError' || +formValues.depositAmount <= 0 || isNaN(+formValues.depositAmount)}
                    >
                      <img src={BtnArrow} alt='arrow' />
                      {i18n.t('tranche.trancheData.deposit')}
                    </button>
                  ) : (
                    <button onClick={() => openModal('trancheEnable', true)}>
                      <img src={BtnArrow} alt='arrow' />
                      Enable
                    </button>
                  )}
                </Form>
              </TableMoreRightSection>
            ) : (
              <TableMoreRightSection
                withdraw
                color={ModeThemes[theme].dropDownBorder}
                disabledBackground={ModeThemes[theme].inputDisabledBackground}
                btn={ModeThemes[theme].backgroundBorder}
                // loading={txOngoing}
                disabled={!isWithdrawApproved}
                approved={!isWithdrawApproved}
                disabledColor={ModeThemes[theme].DisabledBtn}
                disabledTextColor={ModeThemes[theme].DisabledBtnText}
              >
                {txOngoing && (
                  <div>
                    <ReactLoading type={'spin'} color={ModeThemes[theme].loadingSpinner} />
                  </div>
                )}
                <TableMoreTitleWrapper color={ModeThemes[theme].dropDownText}>
                  <MobileMoreFormBtns color={ModeThemes[theme].dropDownText}>
                    <MobileMoreFormBtn current={formType === 'deposit'} onClick={() => setFormType('deposit')} color={ModeThemes[theme].dropDownText}>
                      {i18n.t('tranche.trancheData.deposit')}
                    </MobileMoreFormBtn>
                    <MobileMoreFormBtn
                      current={formType === 'withdraw'}
                      onClick={() => setFormType('withdraw')}
                      color={ModeThemes[theme].dropDownText}
                    >
                      {i18n.t('tranche.trancheData.withdraw')}
                    </MobileMoreFormBtn>
                  </MobileMoreFormBtns>
                  {/* <CheckboxWrapper>
                    <h2>{isWithdrawApproved ? i18n.t('tranche.trancheData.enabled') : i18n.t('tranche.trancheData.disabled')}</h2>

                    <CheckboxContent disabled={txOngoing}>
                      <Field
                        component='input'
                        type='checkbox'
                        name='withdrawIsApproved'
                        id='withdrawIsApproved'
                        checked={isWithdrawApproved}
                        disabled={txOngoing}
                      />
                      <label
                        onClick={txOngoing ? () => {} : (e) => approveContract(false, isWithdrawApproved, e)}
                        htmlFor='withdrawIsApproved'
                      ></label>
                    </CheckboxContent>
                  </CheckboxWrapper> */}
                </TableMoreTitleWrapper>
                <h2>
                  {i18n.t('tranche.trancheData.balance')}: {trancheTokenBalance ? roundNumber(trancheTokenBalance) : '0'} {trancheToken}
                </h2>
                <Form onSubmit={(e) => e.preventDefault()}>
                  <FormContent
                    color={ModeThemes[theme].dropDownText}
                    background={ModeThemes[theme].inputBackground}
                    disabledBackground={ModeThemes[theme].inputDisabledBackground}
                    btn={ModeThemes[theme].backgroundBorder}
                  >
                    <Field
                      component='input'
                      validate={[number]}
                      onChange={(e, newValue) => handleInputChange(newValue, false)}
                      disabled={!isWithdrawApproved}
                      className={withdrawBalanceCheck}
                      name='withdrawAmount'
                      type='number'
                      step='0.001'
                    />
                    <h2 onClick={isWithdrawApproved ? (e) => setMaxAmount(e, false) : undefined}>{i18n.t('tranche.trancheData.max')}</h2>
                  </FormContent>
                  {isWithdrawApproved ? (
                    <button
                      onClick={() => openModal('trancheConfirm', false)}
                      disabled={withdrawBalanceCheck === 'InputStylingError' || +formValues.withdrawAmount <= 0 || isNaN(+formValues.withdrawAmount)}
                    >
                      <img src={BtnArrow} alt='arrow' />
                      {i18n.t('tranche.trancheData.withdraw')}
                    </button>
                  ) : (
                    <button onClick={() => openModal('trancheEnable', false)}>
                      <img src={BtnArrow} alt='arrow' />
                      Enable
                    </button>
                  )}
                </Form>
              </TableMoreRightSection>
            )}
          </TableMoreRowContentRight>
        )}
      </TableMoreRowContent>
    </TableMoreRowWrapper>
  );
};

TableMoreRow = reduxForm({
  form: 'tranche',
  initialValues: { depositAmount: '', withdrawAmount: '' }
  // destroyOnUnmount: false
})(TableMoreRow);

const mapStateToProps = (state) => ({
  ethereum: state.ethereum,
  data: state.data,
  formValues: getFormValues('tranche')(state),
  theme: state.theme
});

export default TableMoreRow = connect(mapStateToProps, {
  change,
  setTxModalOpen,
  setTxModalType,
  setTxModalStatus,
  setTxModalData,
  setTxModalLoading
})(TableMoreRow);
