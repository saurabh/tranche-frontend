import React, { useState, useCallback, useEffect } from 'react';
import { FormContentWrapper, FormContent } from 'app/components/Stake/Table/styles/TableComponents';
import { TrancheModalContent, ModalHeader, WrapSubmitBtn } from 'app/components/Modals/styles/ModalsComponents';
import { roundNumber } from 'utils';
import { ModeThemes } from 'config/constants';
import { CloseModal, CloseModalWhite, FTMIconInput } from 'assets';
import { wrapFTM, unwrapFTM, fromWei } from 'services';

export const WrapForm = ({ theme, closeModal, txModalType, cryptoType, buyerTokenBalance, FTMBalance }) => {
  const [Coin1, setCoin1] = useState({ name: 'FTM', balance: 0 });
  const [Coin2, setCoin2] = useState({ name: 'WFTM', balance: 0 });
  const [Coin1Value, setCoin1Value] = useState({ name: '', balance: 0 });
  const [Coin2Value, setCoin2Value] = useState({ name: '', balance: 0 });

  useEffect(() => {
    if (txModalType === 'trancheWFTM' && FTMBalance && FTMBalance !== -1) {
      setCoin1({ name: 'FTM', balance: fromWei(FTMBalance)});
      setCoin2({ name: cryptoType, balance: buyerTokenBalance});
    }
  }, [txModalType, buyerTokenBalance, FTMBalance, cryptoType])

  const onValueChange = (e, input) => {
    // input === 'FTM' ? setCoin1Value(e.target.value) : setCoin2Value(e.target.value);
    console.log(e.target.value)
    setCoin1Value(e.target.value)
    setCoin2Value(e.target.value)
  };

  const setMaxAmount = (input) => {
    setCoin1Value(input);
    setCoin2Value(input);
  };

  const handleSubmit = (input) => {
    input === 'wrap' ? wrapFTM(Coin1Value) : unwrapFTM(Coin2Value);
  };

  const swapCoins = () => {
    let tempVar = Coin1;
    setCoin1(Coin2);
    setCoin2(tempVar);
    setCoin1Value('')
    setCoin2Value('')
  };

  return (
    <>
      <ModalHeader tranche ModalBackground={ModeThemes[theme].ModalBackground} textColor={ModeThemes[theme].textColor} TrancheWFTM>
        {Coin1.name === 'FTM' ? <h2>Wrap {Coin1.name}</h2> : <h2>Unwrap {Coin1.name}</h2>}
        <button onClick={() => closeModal()}>
          <img src={theme === 'light' ? CloseModal : CloseModalWhite} alt='' />
        </button>
      </ModalHeader>
      <TrancheModalContent trancheStatus color={ModeThemes[theme].ModalTrancheTextColor} TrancheWFTM>
        {/* <WrapFTMHeader textColor={ModeThemes[theme].textColor}>
      {Coin1.name === 'FTM' ? <h2>You need to wrap {Coin1.name} to Deposit.</h2> : <h2>Unwrap {Coin2.name}</h2>}
    </WrapFTMHeader> */}
        <FormContentWrapper>
          <FormContent color={ModeThemes[theme].dropDownText} background={ModeThemes[theme].inputBackground} FTMIcon={FTMIconInput} TrancheWFTM>
            <input
              value={Coin1Value}
              onChange={(e) => onValueChange(e, Coin1.name)}
              type='number'
              step='0.001'
              name='from'
              placeholder={`${Coin1.name} Amount`}
              
            />
            {Coin1.name === 'WFTM' && <h2 onClick={() => setMaxAmount(Coin1.balance)}>MAX</h2>}
          </FormContent>
          <h3>
            Balance: {Coin1.balance ? roundNumber(Coin1.balance) : 0} {Coin1.name}
          </h3>
        </FormContentWrapper>

        <div onClick={() => swapCoins()} style={{cursor: 'pointer'}}>
          <svg width='120' height='120' viewBox='0 0 120 120' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <g filter='url(#filter0_f_1392:16273)'>
              <circle cx='60' cy='60' r='28' fill='#4441CF' />
            </g>
            <path d='M67.5 67.5V52.5' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' />
            <path d='M61.5 61.5L67.5 67.5L73.5 61.5' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' />
            <path d='M51.5 52.5V67.5' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' />
            <path d='M57.5 58.5L51.5 52.5L45.5 58.5' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' />
            <defs>
              <filter id='filter0_f_1392:16273' x='0' y='0' width='120' height='120' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'>
                <feFlood flood-opacity='0' result='BackgroundImageFix' />
                <feBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape' />
                <feGaussianBlur stdDeviation='16' result='effect1_foregroundBlur_1392:16273' />
              </filter>
            </defs>
          </svg>
        </div>
        <FormContentWrapper>
          <FormContent color={ModeThemes[theme].dropDownText} background={ModeThemes[theme].inputBackground} FTMIcon={FTMIconInput} TrancheWFTM>
            <input value={Coin2Value} type='number' step='0.001' name='from' placeholder={`${Coin2.name} Amount`} disabled />
          </FormContent>
          <h3>
            Balance: {Coin2.balance ? roundNumber(Coin2.balance) : 0} {Coin2.name}
          </h3>
        </FormContentWrapper>
        <WrapSubmitBtn onClick={() => (Coin1.name === 'FTM' ? handleSubmit('wrap') : handleSubmit('unwrap'))}>
          {Coin1.name === 'FTM' ? <h2>Wrap {Coin1.name}</h2> : <h2>Unwrap {Coin1.name}</h2>}
        </WrapSubmitBtn>
      </TrancheModalContent>
    </>
  );
};
