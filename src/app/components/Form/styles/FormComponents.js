import styled from 'styled-components';
import { Input } from 'semantic-ui-react';


const ModalFormGrp = styled.div`
position: relative;
text-align: center;

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
${({ currency }) => currency === 'SLICE' && `
  &:after{
    content: 'SLICE';
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
  font-size: 10px;
  text-align: left;
  color: #B9B9B9;
  margin: 6px 0 0 0;
  @media (max-width: 633px){
    font-size: 7px;
    margin: 2px 0 0 0;
  }
}
${({ cursor }) => cursor && `
  h2{
    cursor: pointer;
  }
`}
`
const ModalFormWrapper = styled.form`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: auto;
  align-items: center;
  width: 100% !important;
`

const ModalFormLabel = styled.label`
  font-style: normal;
  font-weight: normal;
  font-size: 10px;
  text-align: center;
  letter-spacing: 0.15em;
  color: #4F4F4F;
  text-transform: uppercase;
`

const ModalFormSubmit = styled.div`
  width: 100%;
  height: 91px;
  /*height: 100%;*/
  padding: 0 35px;
  box-sizing: border-box;
  //border-top: 1px solid rgba(63,63,63,0.1);
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${({ adjustBtns }) => adjustBtns && `
    height: 100%;
    flex-direction: column;
    justify-content: center;
    h2{
      font-style: normal;
      font-weight: normal;
      font-size: 12px;
      margin: 12px 0;
      text-align: center;
      letter-spacing: 0.15em;
      color: #4F4F4F;
    }
  `}
  @media (max-width: 633px){
    flex-direction: column;
  }

`


const AdjustBtnsWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  //border-top: 1px solid rgba(63,63,63,0.1);
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 633px){
    flex-direction: column;
  }
`
const FormInputsWrapper = styled.div`
  transform: translateY(50%);
  padding:10px 35px;
  max-height: 266px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;    
  @media (max-width: 633px){
    transform: none;
    max-height: none;
  }
  h2:first-child{
    @media (max-width: 633px){
      font-style: normal;
      font-weight: normal;
      font-size: 11px;
      text-align: center;
      color: #B9B9B9;
      margin: 0 0 24px 0;
    }
  }
`
const ModalFormButton = styled.button`
  width: 164px;
  height: 38px;  
  background: #936CE6;
  border-radius: 27px;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  align-self: flex-end;
  letter-spacing: 0.15em;
  color: #FFFFFF;
  cursor: pointer;
  border: none;
  box-sizing: border-box;
  text-transform: uppercase;
  transition: 500ms;
  position: relative;
  overflow: hidden;
  outline: none;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
  @media (max-width: 633px){
    margin: 12px auto;
  }
  :disabled{
    opacity: 0.5;
    cursor: default;
    box-shadow: none;
    :hover{
      filter: brightness(1);
    }
  }
  h2{
    font-size: 12px;
    font-weight: normal;
  }

  :hover{
    filter: brightness(107%);
  }
  :active{
    filter: brightness(97%);
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.2);
  }

  span{
    display: none
  }
  

  
  ${({ loading }) => loading === 'true' && `
    background: transparent !important;
    cursor: unset !important;
    border: 1px solid #936CE6 !important;
    pointer-events: none !important;
    box-shadow: none !important;
  `}
  ${({ approveBtn, approved }) => (approveBtn && !approved) && `
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    h2{
      color: #ffffff !important;
    }
  `}
  ${({ approved }) => approved && `
    h2{
      color: #2ECC71 !important;
    }
    background: transparent !important;
    cursor: unset !important;
    box-shadow: none !important;
    border: 1px solid #2ECC71 !important;
    color: #2ECC71 !important;
    pointer-events: none !important;
    h2{
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
    }
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    margin-right: 12px;
    span{
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #2ECC71;
      display: block;
      margin-right: 9px;
    }
  `}

  ${({ adjustCollateralBtn }) => adjustCollateralBtn && `
    font-size: 10px;
    background: #EAEAEA;
    color: rgba(35, 69, 102, 0.7);
  `}

`
const NewLoanInputWrapper = styled.div`
  width: 100% !important;  
  display: flex;
  flex-direction: column;
  ${({ name }) => name === 'borrowedAskAmount' && `
    width: auto;
  `}
`
const NewLoanFormInput = styled.div`
  width: 100%;  
  position: relative;
  display: flex;
  justify-content: space-between;
`

const ModalNewLoanContent = styled.div`
  width: 100%;
  min-height: 554px;
  height: 100%;
  display: flex;
  flex-direction: row;
  @media (max-width: 633px){
    flex-direction: column-reverse;
    margin: 50px auto;
    justify-content: flex-end;
    min-height: auto;
    height: auto;
  }
  
`
const ModalNewLoanDetails = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  max-width: 413px;
  width: 100%;
  min-height: 554px;
  height: 100%;
  background: #FAFAFA;
  @media (max-width: 633px){
    max-width: initial;
    display: none;
    min-height: auto;
    height: auto;
  }
  
`

const ModalNewLoanDetailsContent = styled.div`
  max-height: 190px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  ${({ adjustDetails }) => adjustDetails && `
    min-height: 220px;
  `}
  @media (max-width: 633px){
    max-height: 190px;
  }
`

const ModalAdjustForm = styled.div`
  /*min-height: 160px;*/
  height: auto;
  width: 100%;
  //border-bottom: 1px solid rgba(63, 63, 63, 0.1);
  //background: rgba(247,247,247,1);
  box-sizing: border-box;
  /*padding: 10px 35px;*/
  display: flex;
  & > form{
  width: 100% !important;
  //min-height: 351px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  }
`

const SelectCurrencyView = styled.div`
  position: relative;
  & > div{
    width: 100px;
    height: 19px;
    border-left: 2px solid #F1F1F1;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    box-sizing: border-box;
    padding: 9px 20px 9px 9px;
    cursor: pointer;  
    & > h2{
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      text-align: center;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: rgba(57, 41, 90, 0.2);
    }
    & > img{
      margin: 0 6px -1px 0;
      height: 14px;
    }
  }
  
`

const LoanCustomSelect = styled.div`
  position: absolute;
  right: 5px;
  bottom: 6px;
  align-self: flex-end;
  

`
const SelectCurrencyOptions = styled.div`
  border-radius: 4px;
  position: absolute;
  margin-top: 7px;
  box-shadow: 0px 1px 4px 1px rgba(0, 0, 0, 0.12);
  z-index: 1000;
  img{
    height: 14px;
  }
`
const SelectCurrencyOption = styled.div`
  & > button{
    width: 100px;
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
    justify-content: flex-start;
    align-items: center;
    box-sizing: border-box;
    padding: 9px;
    &:hover{
      background: #E7E7E7;
    } 
    & > img{
      margin: 0 6px 0 0;
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

const ModalFormGrpNewLoan = styled.div`
  position: relative;
  text-align: center;
  & > h2{
    font-style: normal;
    font-weight: normal;
    font-size: 10px;
    text-align: left;
    color: #B9B9B9;
    margin: 6px 0 0 0;
    @media (max-width: 633px){
      font-size: 7px;
      margin: 2px 0 0 0;
    }
  }
  

  ${({ placeholder }) => placeholder === '%' && `
    &:after{
      content: '%';
      font-style: normal;
      font-weight: normal;
      font-size: 20px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #39295A;
      opacity: 0.1;
      position: absolute;
      right: 39px;
      top: 27px;
    }  
  `}
`

const ApproveBtnWrapper = styled.div`
  display: flex;
  margin-right: 12px;
  button{
    width: 133px !important;
  }
`



export {
    ModalFormGrp,
    ModalFormLabel,
    ModalAdjustForm,
    ModalFormSubmit,
    AdjustBtnsWrapper,
    FormInputsWrapper,
    SelectCurrencyOption,
    SelectCurrencyView,
    SelectCurrencyOptions,
    LoanCustomSelect,
    SelectChevron,
    ModalFormButton,
    NewLoanInputWrapper,
    ModalFormGrpNewLoan,
    NewLoanFormInput,
    ModalNewLoanContent,
    ModalFormWrapper, 
    ModalNewLoanDetails,
    ModalFormInput,
    ModalFormInputAPY,
    ModalFormInputNewLoan,
    ModalNewLoanDetailsContent,
    ApproveBtnWrapper
};