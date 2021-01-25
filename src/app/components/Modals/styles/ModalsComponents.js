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
  outline: none;
  transition: 300ms;
  :active{
    transform: scale(0.9);
  }
}
@media (max-width: 633px){
  position: relative;
  h2{
    font-size: 12px;
  }
}
${({ error }) => error && `
  position: relative;
`}

`
const ModalContent = styled.div`
padding: 33px;
min-height: 554px;
height: 100%;
display: flex;
justify-content: center;
align-items: center;
flex-direction: row;
@media (max-width: 633px){
  flex-direction: column;
}
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
@media (max-width: 633px){
  max-height: none;
}

${({ confirmBtn }) => confirmBtn && `
  flex-direction: row;
  justify-content: flex-end;
`}


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
  span{
    color: red;
  }
}
`
const BtnLoanModal = styled.div`
display: flex;
flex-direction: row;
justify-content: flex-end;
width: 100%;
& > button:disabled{
  opacity: 0.5;
  cursor: default;
}
`


const ModalButton = styled.button`
position: relative;
max-width: 241px;
width: 100%;
height: 38px;
box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
border-radius: 27px;
border: none;
margin: 12px 0;
background: ${props => props.backgroundColor ? props.backgroundColor  : "#ECECEC"};
/*opacity: 0.75;*/
font-family: Roboto;
font-style: normal;
font-weight: normal;
font-size: 12px;
letter-spacing: 0.15em;
transition: 500ms;
outline: none;
overflow: hidden;
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
:disabled{
  color: ${props => props.grayBtn && props.btnColor ? "#C1C1C1" : !props.grayBtn && props.btnColor ? props.btnColor : "#000000" };
  opacity: 0.5;
  cursor: default;
  :hover{
    filter: brightness(1);
  }
  span{
    display: none;
  }
}

${({ loading, backgroundColor }) => loading === 'true' && `
  border: 1px solid ${backgroundColor};
  background: transparent;
  cursor: unset;
  pointer-events: none;
  box-shadow: none;
`}



span{
  transform: translate(-581px,-399px) rotate(-45deg);
  transition: 600ms;
  background: #ffffff;
  height: 500px;
  width: 500px;
  display: block;
  position: absolute;
  opacity: 0.3;
  filter: brightness(1.5);
}
:hover{
  span{
    transform: translate(-370px,-399px) rotate(-45deg);
  }
}

:active{
  span{
    transform: translate(370px,-399px) rotate(-45deg);
  }
}


`

const ConfirmAlertWrapper = styled.div`
  position: relative;
  width: 100% !important;
  min-height: 120px;
  border-radius: 7px !important;
  background: #ffffff !important;
  border: none !important;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.19) !important;
  padding: 13px !important;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  & > h2{
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    color: #3F3F3F;
  }

`

const ConfirmAlertBtnWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  border-radius: 7px;

  & > button{
    max-width: 100px;
    height: 33px;
    font-size: 12px;
    font-weight: 500;
    display: flex;
    justify-content: center;
    align-items: center;  
    box-shadow: none;
    border-radius: 3px;
    transition: 300ms;

    :hover{
      filter: brightness(0.93);
    }
    :active{
      filter: brightness(0.9);
    }
  }
  & > button:first-child{
    margin-right: 12px;
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
    display: none;
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
const ModalTextConfirm = styled.div`
  padding: 0 35px;
  h2{
    width: 535px;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    margin: 0 auto;
    line-height: 19px;
    text-align: center;
    color: #3F3F3F;
    margin: 10px auto 29px auto;
  }
`

const ModalTextConfirmBtnWrapper = styled.div`
  text-align: center;
`
const ModalTextConfirmBtn = styled.button`
  max-width: 323px;
  width: 100%;
  height: 32px;
  background: ${props => props.errorBtn ? "#EE2222" : "#1EBB1B"};
  opacity: 0.75;
  box-shadow: 0px 2px 2px rgba(236, 236, 236, 0.4);
  border-radius: 4px;
  font-style: normal;
  border: none;
  font-weight: 500;
  font-size: 9px;
  line-height: 11px;
  text-align: center;
  color: #FFFFFF;
  cursor: pointer;
`
const ModalErrorWrapper = styled.div`
  text-align: center;
  padding: 33px;
  div{
    text-align: center;
    img{
      width: 150px;
    }
  }
`

const BtnLoadingIcon = styled.div`
  box-sizing: border-box;
  width: 16px;
  height: 16px;	
  border: 2px solid ${props => props.loadingColor};
  border-radius: 50%;
  border-left-color: transparent;
  border-bottom-color: transparent;
  position: absolute;
  top: 0;
  left: 0;
  position: absolute;
  top: 0;
  left: 0; 
  background: none;
  margin:0;
  -webkit-animation: donut-rotate 1000ms cubic-bezier(.4,0,.22,1) infinite;
  animation: donut-rotate 1000ms cubic-bezier(.4,0,.22,1) infinite;
`
const LoanDetailsMobile = styled.div`
  display: none;  
  h2{
    font-style: normal;
    font-weight: normal;
    font-size: 8px;
    text-align: center;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #4F4F4F;
    max-width: 200px;
    margin: 7px auto;
    span{
      font-weight: 600;
    }
  }
  @media (max-width: 633px){
    display: block !important;
  }
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
    LoanDetailsRowValue,
    ModalErrorWrapper,
    ModalTextConfirm,
    ModalTextConfirmBtn,
    ModalTextConfirmBtnWrapper,
    BtnLoadingIcon,
    LoanDetailsMobile
};