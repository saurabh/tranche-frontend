import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, Field, reduxForm, getFormValues, change } from 'redux-form';
import { number } from 'utils/validations';
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
  TableMoreLeftBottomSection
} from '../../Stake/Table/styles/TableComponents';
import { BtnArrow } from 'assets';
import { fromWei } from 'services/contractMethods';
import { roundNumber, isGreaterThan } from 'utils';
import { ModeThemes } from 'config';

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
  graphData,
  isEth,
  cryptoType,
  buyerCoinAddress,
  trancheToken,
  trancheTokenAddress,
  isApproveLoading,
  isDepositApproved,
  isWithdrawApproved,
  approveContract,
  buySellTrancheTokens,
  ethereum: { tokenBalance, balance, txOngoing },
  change,
  theme
}) => {
  const [depositBalanceCheck, setDepositBalanceCheck] = useState('');
  const [withdrawBalanceCheck, setWithdrawBalanceCheck] = useState('');
  const [formType, setFormType] = useState('deposit');
  const [isDesktop, setDesktop] = useState(window.innerWidth > 1200);

 
  
  let buyerTokenBalance =
    cryptoType === 'ETH' ? balance && balance !== -1 && fromWei(balance) : tokenBalance[buyerCoinAddress] && fromWei(tokenBalance[buyerCoinAddress]);
  let trancheTokenBalance = tokenBalance[trancheTokenAddress] && fromWei(tokenBalance[trancheTokenAddress]);

  const updateMedia = () => {
    setDesktop(window.innerWidth > 1200);
  };

  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  });
  const setMaxAmount = useCallback(
    (e, type) => {
      e.preventDefault();
      if (type) {
        change('depositAmount', buyerTokenBalance);
      } else {
        change('withdrawAmount', trancheTokenBalance);
      }
    },
    [buyerTokenBalance, trancheTokenBalance, change]
  );

  const handleInputChange = (newValue, type) => {
    if (type) {
      isGreaterThan(newValue, buyerTokenBalance) ? setDepositBalanceCheck('InputStylingError') : setDepositBalanceCheck('');
    } else {
      isGreaterThan(newValue, trancheTokenBalance) ? setWithdrawBalanceCheck('InputStylingError') : setWithdrawBalanceCheck('');
    }
  };

  return (
    <TableMoreRowWrapper className='table-more-row'>
      <TableMoreRowContent>
        <TableMoreRowContentLeft>
          <TableMoreLeftTopSection color={ModeThemes[theme].dropDownBorder}>
            <TableMoreLeftSection color={ModeThemes[theme].dropDownBorder}>
              <TableMoreLeftSectionContent title={ModeThemes[theme].titleSectionText} value={ModeThemes[theme].valueSectionText}>
                <h2>PRICE</h2>
                <h2>0.024 DAI</h2>
              </TableMoreLeftSectionContent>
            </TableMoreLeftSection>
              
            <TableMoreLeftSection color={ModeThemes[theme].dropDownBorder}>
              <TableMoreLeftSectionContent title={ModeThemes[theme].titleSectionText} value={ModeThemes[theme].valueSectionText}>
                <h2>Base APY</h2>
                <h2>5%</h2>
              </TableMoreLeftSectionContent>
            </TableMoreLeftSection>

            <TableMoreLeftSection color={ModeThemes[theme].dropDownBorder}>
              <TableMoreLeftSectionContent title={ModeThemes[theme].titleSectionText} value={ModeThemes[theme].valueSectionText}>
                <h2>SLICE APY</h2>
                <h2>5%</h2>
              </TableMoreLeftSectionContent>
            </TableMoreLeftSection>

            <TableMoreLeftSection>
              <TableMoreLeftSectionContent title={ModeThemes[theme].titleSectionText} value={ModeThemes[theme].valueSectionText}>
                <h2>NET APY</h2>
                <h2>22.3%</h2>
              </TableMoreLeftSectionContent>
            </TableMoreLeftSection>
          </TableMoreLeftTopSection>
          <TableMoreLeftBottomSection title={ModeThemes[theme].titleColor} value={ModeThemes[theme].textColor}>
            <h2>Fixed rate Yield</h2>
            <p>JCD Tranche A is the senior tranche of the cDai token. This tranche yields a fixed rate of 4%, in addition to variable SLICE rewards yielding in the displayed Net APY.</p>
          </TableMoreLeftBottomSection>

        </TableMoreRowContentLeft>

        {
          isDesktop ?
          <TableMoreRowContentRight>
            <TableMoreRightSection disabled={!isDepositApproved || isApproveLoading || txOngoing} color={ModeThemes[theme].dropDownBorder} disabledBackground={ModeThemes[theme].inputDisabledBackground} btn={ModeThemes[theme].backgroundBorder}>
              <TableMoreTitleWrapper color={ModeThemes[theme].dropDownText}>
                <h2>deposit</h2>
                <CheckboxWrapper hidden={isEth}>
                  <h2>{isDepositApproved ? 'Enabled' : 'Disabled'}</h2>
                  <CheckboxContent disabled={isApproveLoading || txOngoing}>
                    <Field
                      component='input'
                      type='checkbox'
                      name='depositIsApproved'
                      id='depositIsApproved'
                      checked={isDepositApproved}
                      disabled={isApproveLoading || txOngoing}
                    />
                    <label onClick={(isApproveLoading || txOngoing) ? false : (e) => approveContract(true, isDepositApproved, e)} htmlFor='depositIsApproved'></label>
                  </CheckboxContent>
                </CheckboxWrapper>
              </TableMoreTitleWrapper>

              <h2>
                balance: {roundNumber(buyerTokenBalance)} {cryptoType}
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
                  <button onClick={(e) => setMaxAmount(e, true)}>max</button>
                </FormContent>
                <button type='submit' disabled={depositBalanceCheck === 'InputStylingError'}>
                  <img src={BtnArrow} alt='arrow' />
                  deposit
                </button>
              </Form>
            </TableMoreRightSection>
            <TableMoreRightSection withdraw disabled={!isWithdrawApproved || isApproveLoading || txOngoing} color={ModeThemes[theme].dropDownBorder} disabledBackground={ModeThemes[theme].inputDisabledBackground} btn={ModeThemes[theme].backgroundBorder}>
              <TableMoreTitleWrapper color={ModeThemes[theme].dropDownText}>
                <h2>withdraw</h2>
                <CheckboxWrapper>
                  <h2>{isWithdrawApproved ? 'Enabled' : 'Disabled'}</h2>
                  <CheckboxContent disabled={isApproveLoading || txOngoing}> 
                    <Field
                      component='input'
                      type='checkbox'
                      name='withdrawIsApproved'
                      id='withdrawIsApproved'
                      checked={isWithdrawApproved}
                      disabled={isApproveLoading || txOngoing}
                    />
                    <label onClick={(isApproveLoading || txOngoing) ? false : () => approveContract(false, isWithdrawApproved)} htmlFor='withdrawIsApproved'></label>
                  </CheckboxContent>
                </CheckboxWrapper>
              </TableMoreTitleWrapper>
              <h2>
                balance: {roundNumber(trancheTokenBalance)} {trancheToken}
              </h2>
              <Form onSubmit={(e) => buySellTrancheTokens(e, false)}>
                <FormContent color={ModeThemes[theme].dropDownText} background={ModeThemes[theme].inputBackground} disabledBackground={ModeThemes[theme].inputDisabledBackground} btn={ModeThemes[theme].backgroundBorder}>
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
                  <button onClick={(e) => setMaxAmount(e, false)}>max</button>
                </FormContent>
                <button type='submit' disabled={withdrawBalanceCheck === 'InputStylingError'}>
                  <img src={BtnArrow} alt='arrow' />
                  withdraw
                </button>
              </Form>
            </TableMoreRightSection>
          </TableMoreRowContentRight> :
          <TableMoreRowContentRight>
            { formType === 'deposit' ?
              <TableMoreRightSection disabled={!isDepositApproved || isApproveLoading || txOngoing} color={ModeThemes[theme].dropDownBorder} disabledBackground={ModeThemes[theme].inputDisabledBackground} btn={ModeThemes[theme].backgroundBorder}>
              <TableMoreTitleWrapper color={ModeThemes[theme].dropDownText}>
                <MobileMoreFormBtns>
                  <MobileMoreFormBtn current={formType === 'deposit'} onClick={() => setFormType('deposit')}>
                    Deposit
                  </MobileMoreFormBtn>
                  <MobileMoreFormBtn current={formType === 'withdraw'} onClick={() => setFormType('withdraw')}>
                    Withdraw
                  </MobileMoreFormBtn>
                </MobileMoreFormBtns>
                <CheckboxWrapper hidden={isEth}>
                  <h2>{isDepositApproved ? 'Enabled' : 'Disabled'}</h2>
                  <CheckboxContent disabled={isApproveLoading || txOngoing}>
                    <Field
                      component='input'
                      type='checkbox'
                      name='depositIsApproved'
                      id='depositIsApproved'
                      checked={isDepositApproved}
                      disabled={isApproveLoading || txOngoing}
                    />
                    <label onClick={(isApproveLoading || txOngoing) ? false : (e) => approveContract(true, isDepositApproved, e)} htmlFor='depositIsApproved'></label>
                  </CheckboxContent>
                </CheckboxWrapper>
              </TableMoreTitleWrapper>

              <h2>
                balance: {roundNumber(buyerTokenBalance)} {cryptoType}
              </h2>
              <Form onSubmit={(e) => buySellTrancheTokens(e, true)}>
                <FormContent color={ModeThemes[theme].dropDownText} background={ModeThemes[theme].inputBackground} disabledBackground={ModeThemes[theme].inputDisabledBackground} btn={ModeThemes[theme].backgroundBorder}>
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
                  <button onClick={(e) => setMaxAmount(e, true)}>max</button>
                </FormContent>
                <button type='submit' disabled={depositBalanceCheck === 'InputStylingError'}>
                  <img src={BtnArrow} alt='arrow' />
                  deposit
                </button>
              </Form>
            </TableMoreRightSection> :
            <TableMoreRightSection withdraw disabled={!isWithdrawApproved || isApproveLoading || txOngoing} color={ModeThemes[theme].dropDownBorder} disabledBackground={ModeThemes[theme].inputDisabledBackground} btn={ModeThemes[theme].backgroundBorder}>
              <TableMoreTitleWrapper color={ModeThemes[theme].dropDownText}>
                <MobileMoreFormBtns>
                  <MobileMoreFormBtn current={formType === 'deposit'} onClick={() => setFormType('deposit')}>
                    Deposit
                  </MobileMoreFormBtn>
                  <MobileMoreFormBtn current={formType === 'withdraw'} onClick={() => setFormType('withdraw')}>
                    Withdraw
                  </MobileMoreFormBtn>
                </MobileMoreFormBtns>
                <CheckboxWrapper>
                  <h2>{isWithdrawApproved ? 'Enabled' : 'Disabled'}</h2>
                  <CheckboxContent disabled={isApproveLoading || txOngoing}>
                    <Field
                      component='input'
                      type='checkbox'
                      name='withdrawIsApproved'
                      id='withdrawIsApproved'
                      checked={isWithdrawApproved}
                      disabled={isApproveLoading || txOngoing}
                    />
                    <label onClick={(isApproveLoading || txOngoing) ? false : () => approveContract(false, isWithdrawApproved)} htmlFor='withdrawIsApproved'></label>
                  </CheckboxContent>
                </CheckboxWrapper>
              </TableMoreTitleWrapper>
              <h2>
                balance: {roundNumber(trancheTokenBalance)} {trancheToken}
              </h2>
              <Form onSubmit={(e) => buySellTrancheTokens(e, false)}>
                <FormContent color={ModeThemes[theme].dropDownText} background={ModeThemes[theme].inputBackground} disabledBackground={ModeThemes[theme].inputDisabledBackground} btn={ModeThemes[theme].backgroundBorder}>
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
                  <button onClick={(e) => setMaxAmount(e, false)}>max</button>
                </FormContent>
                <button type='submit' disabled={withdrawBalanceCheck === 'InputStylingError'}>
                  <img src={BtnArrow} alt='arrow' />
                  withdraw
                </button>
              </Form>
            </TableMoreRightSection>
            }
            
          </TableMoreRowContentRight>
        }
        
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
