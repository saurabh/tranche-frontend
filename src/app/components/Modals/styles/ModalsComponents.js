import styled from 'styled-components';


const ModalHeader = styled.div` 
position: absolute;
z-index: 1;
width: 100%;
height: 75px;
display: flex;
align-items: center;
justify-content: space-between;
padding: 0 35px;
& > h2{
  font-style: normal;
  font-weight: normal;
  font-size: 17px;
  letter-spacing: 0.1em;
  color: #3F3F3F;
  text-transform: uppercase;
}
& > button{
  background: transparent;
  border: none;
  cursor: pointer;
}
@media (max-width: 633px){
  position: relative;
}

`
const ModalContent = styled.div`
padding: 33px;
min-height: 554px;
height: 100%;
display: flex;
justify-content: center;
align-items: center;
flex-direction: row;
`
const ModalContentDetails = styled.div`
width: 100%;
margin: 15px 0;
& > div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin: 15px 0;
  border-bottom: 1px solid rgba(63,63,63,0.1);

  & > h2 {
    font-style: normal;
    font-weight: 300;
    font-size: 12px;
    color: rgba(56,56,56,0.7) !important;
    text-transform: uppercase;
    margin-bottom: 12px;
    & > span{
      font-weight: 700 !important;
      font-size: 15px;
      letter-spacing: 3px;
    }
  }
}
`

const BtnGrpLoanModal = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
text-align: center;
max-height: 200px;
height: 100%;
width: 100%;

${({ submitBtn }) => submitBtn && `
  max-width: 164px;
`}
`
const BtnGrpLoanModalWrapper = styled.div`
margin: 25px 0;
width: 100%;
& > h2{
  font-style: normal;
  font-weight: normal;
  font-size: 10px;
  text-align: center;
  letter-spacing: 0.15em;
  color: #4F4F4F;
  max-width: 200px;
  margin: auto;
}
`
const BtnLoanModal = styled.div`
display: flex;
flex-direction: column;
justify-content: space-between;
width: 100%;
& > button:disabled{
  opacity: 0.5;
  cursor: default;
}
`


const ModalButton = styled.button`
max-width: 241px;
width: 100%;
height: 38px;
box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
border-radius: 27px;
border: none;
margin: 12px 0 0 0;
background: ${props => props.backgroundColor ? props.backgroundColor  : "#ECECEC"};
/*opacity: 0.75;*/
font-family: Roboto;
font-style: normal;
font-weight: normal;
font-size: 12px;
letter-spacing: 0.15em;
color: #FFFFFF;
text-transform: uppercase;
/*color: rgba(131, 129, 134, 0.4);*/
cursor: pointer;
color: ${props => props.btnColor ? props.btnColor : "#000000"};
&:last-child{
  /*margin: 12px 0 0 0;
  color: #ffffff !important;
  background: ${props => props.btnColor ? props.btnColor  : "#E42013"};*/
}
${({ display }) => display && `
  display: ${display}
`}
:disabled{
  color: ${props => props.grayBtn && props.btnColor ? "#C1C1C1" : !props.grayBtn && props.btnColor ? props.btnColor : "#000000" };
  opacity: 0.5;
  cursor: default;
}
`

const ConfirmAlertWrapper = styled.div`
position: relative;
width: auto;
//height: 326px;
height: auto;
border-radius: 12px;
background: #ffffff;
border: none;
box-shadow: 0px 2px 4px rgba(99,99,99,0.7);
padding: 33px 100px;
& > h2{
  font-style: normal;
  font-weight: normal;
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

const ModalFormWrapper = styled.form`
position: relative;
display: flex;
flex-direction: column;
justify-content: space-between;
flex: auto;
align-items: center;
width: 100% !important;
`


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
  font-size: 10px;
  text-align: right;
  color: #B9B9B9;
  margin: 6px 0 0 0;
}
`

const ModalActionsContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  @media (max-width: 633px){
    flex-direction: column-reverse;
  }
`
const ModalActionDetails = styled.div`
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
  }
`

const ModalUserActions = styled.div`
  width: 100%;
`
const ModalActionDetailsContent = styled.div`
  min-height: 290px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @media (max-width: 633px){
    max-height: 310px;
  }
  ${({ row4 }) => row4 && `
    min-height: 350px;
  `}

`

const LoanDetailsRow = styled.div`
  position: relative;
  margin: 15px auto;
  
  ${({ newValue }) => newValue && `
    bottom: -50px;
  `}
`
const LoanDetailsRowTitle = styled.h2`
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  letter-spacing: 0.05em;
  color: #B3B3B3;
  text-transform: uppercase;
  ${({ row4 }) => row4 && `
    font-size: 12px;
  `}
`
const LoanDetailsRowValue = styled.h2`
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 0.15em;
  color: #B3B3B3;
  margin: 5px 0 0 0;
  ${({ cursor }) => cursor && `
    cursor: ${cursor}
  `}
`

export {
    ModalHeader, 
    ModalContent,
    ModalContentDetails,
    BtnGrpLoanModal, 
    ModalButton, 
    ConfirmAlertWrapper, 
    ConfirmAlertBtnWrapper, 
    ModalAdjustForm, 
    ModalFormWrapper, 
    ModalFormGrp,
    BtnLoanModal,
    ModalActionDetails,
    ModalActionsContent,
    ModalUserActions,
    BtnGrpLoanModalWrapper,
    ModalActionDetailsContent,
    LoanDetailsRow,
    LoanDetailsRowTitle,
    LoanDetailsRowValue
};