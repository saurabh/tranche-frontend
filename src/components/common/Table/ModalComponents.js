import styled from 'styled-components';
import ETHFORM from  "assets/images/svg/EthForm.svg";

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
  align-item: center;
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
 min-height: 160px;
 height: auto;
 width: 100%;
 border-bottom: 1px solid rgba(63, 63, 63, 0.1);
 background: rgba(247,247,247,1);
 box-sizing: border-box;
 padding: 10px 35px;
 display: flex;
`

const ModalFormWrapper = styled.form`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`


const ModalFormGrp = styled.div`
  position: relative;
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
  & > h2{
    font-style: normal;
    font-weight: normal;
    font-size: 7px;
    text-align: right;
    color: #B9B9B9;
    margin: 4px 0 0 0;
  }
`

const ModalFormLabel = styled.label`
  font-style: normal;
  font-weight: 300;
  font-size: 9px;
  color: #4F4F4F;
`

const ModalFormInput = styled.input`
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
  background-image: url(${ETHFORM});
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

const ModalFormSubmit = styled.div`
  width: 100%;
  min-height: 91px;
  height: 100%;  
  padding: 0 33px;
  box-sizing: border-box;
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
    ModalFormButton
 
};
  