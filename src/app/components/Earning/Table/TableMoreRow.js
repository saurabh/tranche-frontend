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
import { BtnArrow } from 'assets';
import { fromWei } from 'services/contractMethods';
import { roundNumber, isGreaterThan, isEqualTo } from 'utils';
import { ModeThemes, zeroAddress } from 'config';
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
  apy,
  contractAddress,
  cryptoType,
  dividendType,
  buyerTokenBalance,
  trancheToken,
  trancheRate,
  buyerCoinAddress,
  trancheTokenAddress,
  isApproveLoading,
  isDepositApproved,
  isWithdrawApproved,
  setDepositApproved,
  setWithdrawApproved,
  approveContract,
  buySellTrancheTokens,
  ethereum: { tokenBalance, trancheAllowance, txOngoing },
  change,
  theme
}) => {
  const [isEth, setIsEth] = useState(false);
  const [depositBalanceCheck, setDepositBalanceCheck] = useState('');
  const [withdrawBalanceCheck, setWithdrawBalanceCheck] = useState('');
  const [formType, setFormType] = useState('deposit');
  const [isDesktop, setDesktop] = useState(window.innerWidth > 1200);
  const [TooltipToggle, setTooltipToggle] = useState("");

  let trancheTokenBalance =
    cryptoType === 'USDC'
      ? tokenBalance[trancheTokenAddress] && fromWei(tokenBalance[trancheTokenAddress], 'Mwei')
      : tokenBalance[trancheTokenAddress] && fromWei(tokenBalance[trancheTokenAddress]);

  const updateMedia = () => {
    setDesktop(window.innerWidth > 1200);
  };

  const tooltipToggle = (val) => {
    setTooltipToggle(val);
  }

  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  });

  useEffect(() => {
    if (buyerCoinAddress === zeroAddress) {
      setIsEth(true);
      setDepositApproved(true);
    }
    if (trancheAllowance[contractAddress]) {
      setDepositApproved(trancheAllowance[contractAddress][buyerCoinAddress]);
      setWithdrawApproved(trancheAllowance[contractAddress][trancheTokenAddress]);
      change('depositIsApproved', trancheAllowance[contractAddress][buyerCoinAddress]);
      change('withdrawIsApproved', trancheAllowance[contractAddress][trancheTokenAddress]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buyerCoinAddress, trancheTokenAddress, trancheAllowance, setDepositApproved, setWithdrawApproved]);

  const setMaxAmount = useCallback(
    (e, type) => {
      // e.preventDefault();
      if (type) {
        change('depositAmount', buyerTokenBalance);
        isEqualTo(buyerTokenBalance, 0) ? setDepositBalanceCheck('InputStylingError') : setDepositBalanceCheck('');
      } else {
        change('withdrawAmount', trancheTokenBalance);
        isEqualTo(trancheTokenBalance, 0) ? setDepositBalanceCheck('InputStylingError') : setDepositBalanceCheck('');
      }
    },
    [buyerTokenBalance, trancheTokenBalance, change]
  );

  const handleInputChange = (newValue, type) => {
    if (type) {
      isGreaterThan(newValue, buyerTokenBalance) || isEqualTo(newValue, 0) ? setDepositBalanceCheck('InputStylingError') : setDepositBalanceCheck('');
    } else {
      isGreaterThan(newValue, trancheTokenBalance) || isEqualTo(newValue, 0)
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
              <TableMoreLeftSectionContent titleColor={ModeThemes[theme].titleSectionText} value={ModeThemes[theme].valueSectionText}>
                <h2>{dividendType}</h2>
                <h2>
                  0
                </h2>
              </TableMoreLeftSectionContent>
            </TableMoreLeftSection>

            <TableMoreLeftSection color={ModeThemes[theme].dropDownBorder}>
              <TableMoreLeftSectionContent titleColor={ModeThemes[theme].titleSectionText} value={ModeThemes[theme].valueSectionText}>
                <h2>{i18n.t('tranche.trancheData.baseAPY')}</h2>
                <h2>{roundNumber(apy, 2)}%</h2>
              </TableMoreLeftSectionContent>
            </TableMoreLeftSection>

            <TableMoreLeftSection color={ModeThemes[theme].dropDownBorder}>
              <TableMoreLeftSectionContent titleColor={ModeThemes[theme].titleSectionText} value={ModeThemes[theme].valueSectionText}>
                <h2>SLICE APY</h2>
                <h2>TBD</h2>
              </TableMoreLeftSectionContent>
            </TableMoreLeftSection>

            <TableMoreLeftSection color={ModeThemes[theme].dropDownBorder}>
              <TableMoreLeftSectionContent titleColor={ModeThemes[theme].titleSectionText} value={ModeThemes[theme].valueSectionText}>
                <h2 onMouseOver={() => tooltipToggle("PRICE")} onMouseLeave={() => tooltipToggle("")}>{i18n.t('tranche.trancheData.price')}</h2>
                <h2>
                  {roundNumber(trancheRate)} {cryptoType}
                </h2>
                <TooltipWrapper tooltip={TooltipToggle === "PRICE"} row color={ModeThemes[theme].Tooltip}>
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
                ? `${name} is the senior tranche of the ${dividendType} token. This tranche yields a fixed rate of ${apy}%, in addition to SLICE rewards as shown in Net APY.`
                : `${name} is the junior tranche of the ${dividendType} token. This tranche yields a variable rate of ${apy}%, in addition to SLICE rewards as shown in Net APY.`}
            </p>
          </TableMoreLeftBottomSection>
        </TableMoreRowContentLeft>

        {isDesktop ? (
          <TableMoreRowContentRight>
            <TableMoreRightSection
              color={ModeThemes[theme].dropDownBorder}
              disabledBackground={ModeThemes[theme].inputDisabledBackground}
              btn={ModeThemes[theme].backgroundBorder}
              loading={isApproveLoading}
            >
              {isApproveLoading && (
                <div>
                <ReactLoading type={'spin'} color={ModeThemes[theme].loadingSpinner}/>
                </div>
              )}
              <TableMoreTitleWrapper color={ModeThemes[theme].dropDownText}>
                <h2>{i18n.t('tranche.trancheData.deposit')}</h2>
                <CheckboxWrapper hidden={isEth}>
                  <h2>{isDepositApproved ? i18n.t('tranche.trancheData.enabled') : i18n.t('tranche.trancheData.disabled')}</h2>
                  <CheckboxContent disabled={isApproveLoading || txOngoing}>
                    <Field
                      component='input'
                      type='checkbox'
                      name='depositIsApproved'
                      id='depositIsApproved'
                      checked={isDepositApproved}
                      disabled={isApproveLoading || txOngoing}
                    />
                    <label
                      onClick={isApproveLoading || txOngoing ? () => {} : (e) => approveContract(true, isDepositApproved, e)}
                      htmlFor='depositIsApproved'
                    ></label>
                  </CheckboxContent>
                </CheckboxWrapper>
              </TableMoreTitleWrapper>

              <h2>
                {i18n.t('tranche.trancheData.balance')}: {buyerTokenBalance ? roundNumber(buyerTokenBalance) : '0'} {cryptoType}
              </h2>
              <Form onSubmit={(e) => buySellTrancheTokens(e, true)}>
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
                  <h2 onClick={(e) => setMaxAmount(e, true)}>{i18n.t('tranche.trancheData.max')}</h2>
                </FormContent>
                <button type='submit' disabled={depositBalanceCheck === 'InputStylingError'}>
                  <img src={BtnArrow} alt='arrow' />
                  {i18n.t('tranche.trancheData.deposit')}
                </button>
              </Form>
            </TableMoreRightSection>
            <TableMoreRightSection
              withdraw
              color={ModeThemes[theme].dropDownBorder}
              disabledBackground={ModeThemes[theme].inputDisabledBackground}
              btn={ModeThemes[theme].backgroundBorder}
              loading={isApproveLoading}
            >
              {isApproveLoading && (
                <div>
                  <ReactLoading type={'spin'} color={ModeThemes[theme].loadingSpinner} />
                </div>
              )}
              <TableMoreTitleWrapper color={ModeThemes[theme].dropDownText}>
                <h2>{i18n.t('tranche.trancheData.withdraw')}</h2>
                <CheckboxWrapper>
                  <h2>{isWithdrawApproved ? i18n.t('tranche.trancheData.enabled') : i18n.t('tranche.trancheData.disabled')}</h2>
                  <CheckboxContent disabled={isApproveLoading || txOngoing}>
                    <Field
                      component='input'
                      type='checkbox'
                      name='withdrawIsApproved'
                      id='withdrawIsApproved'
                      checked={isWithdrawApproved}
                      disabled={isApproveLoading || txOngoing}
                    />
                    <label
                      onClick={isApproveLoading || txOngoing ? () => {} : (e) => approveContract(false, isWithdrawApproved, e)}
                      htmlFor='withdrawIsApproved'
                    ></label>
                  </CheckboxContent>
                </CheckboxWrapper>
              </TableMoreTitleWrapper>
              <h2>
                {i18n.t('tranche.trancheData.balance')}: {trancheTokenBalance ? roundNumber(trancheTokenBalance) : '0'} {trancheToken}
              </h2>
              <Form onSubmit={(e) => buySellTrancheTokens(e, false)}>
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
                  <h2 onClick={(e) => setMaxAmount(e, false)}>{i18n.t('tranche.trancheData.max')}</h2>
                </FormContent>
                <button type='submit' disabled={withdrawBalanceCheck === 'InputStylingError'}>
                  <img src={BtnArrow} alt='arrow' />
                  {i18n.t('tranche.trancheData.withdraw')}
                </button>
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
                loading={isApproveLoading}
              >
                {isApproveLoading && (
                  <div>
                    <ReactLoading type={'spin'} color={ModeThemes[theme].loadingSpinner}/>
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
                      {i18n.t('tranche.trancheData.withdraw') }
                    </MobileMoreFormBtn>
                  </MobileMoreFormBtns>
                  <CheckboxWrapper hidden={isEth}>
                    <h2>{isDepositApproved ? i18n.t('tranche.trancheData.enabled') : i18n.t('tranche.trancheData.disabled')}</h2>

                    <CheckboxContent disabled={isApproveLoading || txOngoing}>
                      <Field
                        component='input'
                        type='checkbox'
                        name='depositIsApproved'
                        id='depositIsApproved'
                        checked={isDepositApproved}
                        disabled={isApproveLoading || txOngoing}
                      />
                      <label
                        onClick={isApproveLoading || txOngoing ? () => {} : (e) => approveContract(true, isDepositApproved, e)}
                        htmlFor='depositIsApproved'
                      ></label>
                    </CheckboxContent>
                  </CheckboxWrapper>
                </TableMoreTitleWrapper>

                <h2>
                  {i18n.t('tranche.trancheData.balance')}: {buyerTokenBalance ? roundNumber(buyerTokenBalance) : '0'} {cryptoType}
                </h2>
                <Form onSubmit={(e) => buySellTrancheTokens(e, true)}>
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
                    <h2 onClick={(e) => setMaxAmount(e, true)}>{i18n.t('tranche.trancheData.max')}</h2>
                  </FormContent>
                  <button type='submit' disabled={depositBalanceCheck === 'InputStylingError'}>
                    <img src={BtnArrow} alt='arrow' />
                    {i18n.t('tranche.trancheData.deposit')}
                  </button>
                </Form>
              </TableMoreRightSection>
            ) : (
              <TableMoreRightSection
                withdraw
                color={ModeThemes[theme].dropDownBorder}
                disabledBackground={ModeThemes[theme].inputDisabledBackground}
                btn={ModeThemes[theme].backgroundBorder}
                loading={isApproveLoading}
              >
                {isApproveLoading && (
                  <div>
                    <ReactLoading type={'spin'} color={ModeThemes[theme].loadingSpinner}/>
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
                  <CheckboxWrapper>
                    <h2>{isWithdrawApproved ? i18n.t('tranche.trancheData.enabled') : i18n.t('tranche.trancheData.disabled')}</h2>

                    <CheckboxContent disabled={isApproveLoading || txOngoing}>
                      <Field
                        component='input'
                        type='checkbox'
                        name='withdrawIsApproved'
                        id='withdrawIsApproved'
                        checked={isWithdrawApproved}
                        disabled={isApproveLoading || txOngoing}
                      />
                      <label
                        onClick={isApproveLoading || txOngoing ? () => {} : (e) => approveContract(false, isWithdrawApproved, e)}
                        htmlFor='withdrawIsApproved'
                      ></label>
                    </CheckboxContent>
                  </CheckboxWrapper>
                </TableMoreTitleWrapper>
                <h2>
                  {i18n.t('tranche.trancheData.balance')}: {trancheTokenBalance ? roundNumber(trancheTokenBalance) : '0'} {trancheToken}
                </h2>
                <Form onSubmit={(e) => buySellTrancheTokens(e, false)}>
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
                    <h2 onClick={(e) => setMaxAmount(e, false)}>{i18n.t('tranche.trancheData.max')}</h2>
                  </FormContent>
                  <button type='submit' disabled={withdrawBalanceCheck === 'InputStylingError'}>
                    <img src={BtnArrow} alt='arrow' />
                    {i18n.t('tranche.trancheData.withdraw')}
                  </button>
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
  initialValues: {},
  destroyOnUnmount: false
})(TableMoreRow);

const mapStateToProps = (state) => ({
  ethereum: state.ethereum,
  formValues: getFormValues('tranche')(state),
  theme: state.theme
});

export default TableMoreRow = connect(mapStateToProps, { change })(TableMoreRow);
