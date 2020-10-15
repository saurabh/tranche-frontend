import styled from 'styled-components';
import {Input} from 'semantic-ui-react';

const ModalHeader = styled.div` 
  width: 100%;
  height: 75px;
  border-bottom: 1px solid rgba(63, 63, 63, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 33px;
  & > h2{
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    color: #3F3F3F;
  }
  & > button{
    background: transparent;
    border: none;
    cursor: pointer;
  }
`
const ModalContent = styled.div`
  padding: 33px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const BtnGrpLoanModal = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
`


const ModalButton = styled.button`
  width: 100%;
  height: 32px;
  background: ${props => props.btnColor ? props.btnColor  : "#ECECEC"};
  /*opacity: 0.75;*/
  border: 0.3px solid #ECECEC;
  box-sizing: border-box;
  box-shadow: 0px 2px 2px rgba(236, 236, 236, 0.4);
  border-radius: 4px;
  font-style: normal;
  font-weight: 500;
  font-size: 9px;
  text-transform: uppercase;
  /*color: rgba(131, 129, 134, 0.4);*/
  cursor: pointer;
  &:last-child{
    margin: 12px 0 0 0;
    color: #ffffff;
    background: ${props => props.btnColor ? props.btnColor  : "#E42013"};
  }
`

const ConfirmAlertWrapper = styled.div`
  position: relative;
  width: auto;
  //height: 326px;
  height: auto;
  border-radius: 16px;
  background: #ffffff;
  border: none;
  box-shadow: 0px 2px 4px rgba(99, 99, 99, 0.7);
  padding: 33px;
  & > h2{
    font-style: normal;
    font-weight: bold;
    font-size: 15px;
    color: #3F3F3F;
  }

`

const ConfirmAlertBtnWrapper = styled.div`
  display: flex;
  justify-content: space-around;
 & > button{
    max-width: 100px;
    font-size: 14px;
    font-weight: 700;
    margin: 12px 0 0 0;
 } 
`



const ModalAdjustForm = styled.div`
 /*min-height: 160px;*/
 height: auto;
 width: 100%;
 border-bottom: 1px solid rgba(63, 63, 63, 0.1);
 background: rgba(247,247,247,1);
 box-sizing: border-box;
 /*padding: 10px 35px;*/
 display: flex;
`

const ModalFormWrapper = styled.form`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: auto;
`


const ModalFormGrp = styled.div`
  position: relative;
  
  ${({ currency }) => currency === 'ETH' && `
    &:after{
      content: 'ETH';
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #39295A;
      opacity: 0.1;
      position: absolute;
      right: 39px;
      top: 27px;
    }  
  `}
  ${({ currency }) => currency === 'JNT' && `
    &:after{
      content: 'JNT';
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #39295A;
      opacity: 0.1;
      position: absolute;
      right: 39px;
      top: 27px;
    }  
  `}
  
  & > h2{
    font-style: normal;
    font-weight: normal;
    font-size: 7px;
    text-align: right;
    color: #B9B9B9;
    margin: 6px 0 0 0;
  }
`


const ModalFormGrpNewLoan = styled.div`
  & > h2{
    font-style: normal;
    font-weight: normal;
    font-size: 7px;
    text-align: right;
    color: #B9B9B9;
    margin: 6px 0 0 0;
  }
`
const NewLoanFormInput = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
`
const ModalFormLabel = styled.label`
  font-style: normal;
  font-weight: 300;
  font-size: 9px;
  color: #4F4F4F;
`

const ModalFormInput = styled(Input)`
  position: relative;
  background: #FFFFFF;
  border: 1px solid #FFFFFF;
  box-sizing: border-box;
  border: none;
  border-radius: 4px;
  width: 100%;
  height: 32px;
  font-style: normal;
  font-weight: bold;
  text-align: right;
  font-size: 14px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: rgba(57,41,90,0.5);
  padding: 4px 74px 4px 44px;
  background-image: url(${props => props.background});
  background-repeat: no-repeat;
  background-position: 9px 50%;
  &:focus{
    outline: none;
  }
  &::-webkit-inner-spin-button, ::-webkit-outer-spin-button { 
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      margin: 0;
  }
`
const ModalFormInputAPY = styled(Input)`
  position: relative;
  background: #FFFFFF;
  border: 1px solid #FFFFFF;
  box-sizing: border-box;
  border: none;
  border-radius: 4px;
  width: 100%;
  height: 32px;
  font-style: normal;
  font-weight: bold;
  text-align: right;
  font-size: 14px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: rgba(57,41,90,0.5);
  padding: 4px 10px;
  &:focus{
    outline: none;
  }
  &::-webkit-inner-spin-button, ::-webkit-outer-spin-button { 
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      margin: 0;
  }
`
const ModalFormInputNewLoan = styled(Input)`
  position: relative;
  background: #FFFFFF;
  border: 1px solid #FFFFFF;
  box-sizing: border-box;
  border: none;
  border-radius: 4px;
  width: 100%;
  height: 32px;
  font-style: normal;
  font-weight: bold;
  text-align: right;
  font-size: 14px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #39295A;
  padding: 4px 10px;
  &:focus{
    outline: none;
  }
  &::-webkit-inner-spin-button, ::-webkit-outer-spin-button { 
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      margin: 0;
  }
`
const FormInputsWrapper = styled.div`
  padding:10px 35px;
`
const ModalFormSubmit = styled.div`
  width: 100%;
  height: 91px;
  /*height: 100%;*/
  padding: 0 33px;
  box-sizing: border-box;
  border-top: 1px solid rgba(63,63,63,0.1);
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
`


const ModalFormButton = styled.button`
  width: 100%;
  height: 32px;
  background: #ECECEC;
  /*opacity: 0.75;*/
  border: 0.3px solid #ECECEC;
  box-sizing: border-box;
  box-shadow: 0px 2px 2px rgba(236, 236, 236, 0.4);
  border-radius: 4px;
  font-style: normal;
  font-weight: 500;
  font-size: 9px;
  text-transform: uppercase;
  /*color: rgba(131, 129, 134, 0.4);*/
  cursor: pointer;
`
const SelectCurrencyView = styled.div`
  position: relative;
  & > div{
    width: 88px;
    height: 32px;
    background: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 9px 20px 9px 9px;
    cursor: pointer;  
    border-radius: 4px;
    & > h2{
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      text-align: center;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: rgba(57, 41, 90, 0.2);
    }
  }
  
`
const NewLoanInputWrapper = styled.div`
  display: flex;
  flex-direction: column;

`
const LoanCustomSelect = styled.div`
  align-self: flex-end;
`
const SelectCurrencyOptions = styled.div`
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  position: absolute;
  margin-top: 3px;
  z-index: 1000;
`
const SelectCurrencyOption = styled.div`
  & > button{
    width: 88px;
    height: 32px;
    background: #ffffff;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    text-align: center;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: rgba(57, 41, 90, 0.2);
    border: none;
    cursor: pointer;
    outline: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 9px;
    &:hover{
      background: #E7E7E7;
    } 
  }
  &:last-child{
    & > button{
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }  
`
const SelectChevron = styled.span`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 50%;
  transform: translateY(-50%);
  right: 12px;
  height: 8px;
  justify-content: space-between;
  cursor: pointer;

`
export {
    ModalHeader, 
    ModalContent,
    BtnGrpLoanModal, 
    ModalButton, 
    ConfirmAlertWrapper, 
    ConfirmAlertBtnWrapper, 
    ModalAdjustForm, 
    ModalFormWrapper, 
    ModalFormGrp, 
    ModalFormLabel,
    ModalFormInput,
    ModalFormSubmit,
    ModalFormButton,
    SelectCurrencyOption,
    SelectCurrencyView,
    SelectCurrencyOptions,
    ModalFormGrpNewLoan,
    ModalFormInputNewLoan,
    FormInputsWrapper,
    NewLoanInputWrapper,
    LoanCustomSelect,
    NewLoanFormInput,
    SelectChevron,
    ModalFormInputAPY
 
};
  