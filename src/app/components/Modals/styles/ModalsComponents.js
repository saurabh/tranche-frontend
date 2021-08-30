import { processNodes } from 'react-html-parser';
import styled, { keyframes } from 'styled-components';

const bounce = keyframes`
	0%, 50%, 100%{
		transform: scale(0.8);
	}
	25% {
		transform: scale(0.6);
	}
	75% {
		transform: scale(1);
	}
}
`
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
${({ stake }) => stake && `
  h2{
    color: #FFFFFF;
  }
  button{
    position: absolute;
    right: 0;
    padding: 0 35px;
    @media (max-width: 633px){
      padding: 0 50px !important;
    }
  } 
  @media (max-width: 633px){
    display: none;
  }
`}
${({ stakeModal }) => stakeModal && `
    @media (max-width: 633px){
      width: 100%;
    }
  `}
${({ stake, font, left }) => (stake && left) && `
  h2{
    color: #FFFFFF;
    font-size: ${font};
  }
  button{
    position: absolute;
    right: 0;
    padding: 0 35px;
    @media (max-width: 633px){
      padding: 0 50px !important;
    }
  } 
`}
${({ claim, ModalHeader }) => claim && `
  h2{
    text-transform: capitalize;
    font-weight: 700;
    color: ${ModalHeader};
  }
  button{
    position: absolute;
    right: 0;
    padding: 0 35px;
    @media (max-width: 633px){
      padding: 0 50px !important;
    }
  } 
`}
${({ rightStakeModal, ModalHeader }) => rightStakeModal && `
  width: 50%;
  h2{
    color: ${ModalHeader};
  }
  @media (max-width: 633px){
    width: 100%;
  }
  button{
    position: absolute;
    right: 0;
    padding: 0 35px;
    @media (max-width: 633px){
      padding: 0 50px !important;
    }
  } 
`}


${({ error }) => error && `
  position: relative;
`}
${({ notFound, ModalBackground }) => notFound && `
  height: 46px;
  justify-content: flex-end;
  position: relative;
  padding: 0 10px;
  background: ${ModalBackground};
`}
${({ tranche }) => tranche && `
  max-height: 68px;
  display: flex;
  justify-content: flex-end;
  button{
    padding: 0;
    height: 15px;
  }
`}

${({ enableModal }) => enableModal && `
  top: 0;
  @media (max-width: 633px){
    position: absolute;
  }
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
${({ interest }) => interest && `
  & > h2{
    text-transform: uppercase;
  }
`}

${({ stake }) => stake && `
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`}

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
  color: ${props => props.grayBtn && props.btnColor ? "#C1C1C1" : !props.grayBtn && props.btnColor ? props.btnColor : props.trade ? "#FFFFFF" : "#000000" };
  background: ${props => props.trade ? "#E7E7E7" : "" };
  opacity: ${props => props.trade ? "1" : "0.5" };;
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
  ${({ stakingMobile }) => stakingMobile && `
    @media (max-width: 633px){
      flex-direction: column;
    }
  `}

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
  ${({ stake, color}) => stake && color && `
    background: ${color};
  `}
  
`

const ModalUserActions = styled.div`
  width: 100%;
  background: ${props => props.ModalBackground};
  ${({ form }) => form && `
    display: flex;
  `}
  ${({ stake }) => stake && `
    @media (max-width: 633px){
      height: 100vh;
      overflow: hidden;
    }
  `}

`
const ModalActionDetailsContent = styled.div`
  min-height: 290px;
  ${({ stake }) => stake && `
    min-height: 100px;
  `}
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

  ${({ stake }) => stake && `
    min-height: 100px;
  `}

`

const LoanDetailsRow = styled.div`
  position: relative;
  margin: 15px auto;
  
  ${({ newValue }) => newValue && `
    bottom: -50px;
  `}
  ${({ trade }) => trade && `
    display: flex;
    align-items: center;
    margin: 15px 0;
    h2{
      margin: 0 12px;
    }
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
  ${({ stake }) => stake && `
    color: #FFFFFF;
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
  ${({ stake }) => stake && `
    color: #FFFFFF;
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
  ${({ error }) => error && `
    h2{
      width: 100%;
    }
  `}
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
    color: ${props => props.ModalText};
    max-width: 200px;
    margin: 7px auto;
    span{
      font-weight: 600;
    }
  }
  ${({ trade }) => trade && `
    margin-top: -100px;
  `}
  @media (max-width: 633px){
    display: block !important;
  }
`

const StakingModalRow = styled.div`
  margin: 25px 0;
  h2:nth-child(1){
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    // line-height: 16px;
    text-align: center;
    text-transform: uppercase;
    color: rgba(0, 0, 0, 0.45);
  }
  h2:nth-child(2){
    font-style: normal;
    font-weight: bold;
    font-size: 32px;
    // line-height: 37px;
    text-align: center;
    text-transform: uppercase;
    color: rgba(0, 0, 0, 0.8);
  }
  h2:nth-child(3){
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    // line-height: 14px;
    text-align: center;
    color: rgba(0, 0, 0, 0.25);
  }
`;
const StakingModalWrapper = styled.div`
  margin: 100px 0;
`;

const SliceNotFound = styled.div`
  min-height: 200px;
  background: ${props => props.ModalBackground};
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  p{

    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 19px;
    margin: 12px 0 0 0;
    text-align: center;
    color: ${props => props.ModalText};
    padding: 0 23px;
    width: 100%;
  }
`;

const SliceNotFoundBtn = styled.div`
  background: #F7F7FF;
  min-height: 67px;
  height: 100%;
  padding: 0 23px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${props => props.ModalBackground};
  a{
    min-height: 33px;
    height: 100%;
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 11px;
    text-align: center;
    color: #FFFFFF;
    background: ${props => props.color};
    border-radius: 4px;
    width: 100%;
    border: none;
    outline: none;
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    transition: 300ms;
    :hover{
      opacity: 0.7;
    }
  }
`;
const ModalMarketWrapper = styled.div`
  min-height: 342px;
  background: ${props => props.ModalBackground};
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  & > div{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  & > div p{
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 19px;
    margin: 12px 0 0 0;
    text-align: center;
    color: ${props => props.ModalText};
    padding: 0 23px;
    width: 100%;
  }
  & > div a{
    background: ${props => props.linkBackground};
    border-radius: 80.8581px;
    padding: 12px 26px;
    margin: 15px 0 0 0;
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 10.5116px;
    line-height: 13px;
    display: flex;
    align-items: center;
    text-align: center;
    color: ${props => props.linkColor};
    transition: 200ms;
    :hover{
      opacity: 0.7;
    }
    
  }
`;

const ModalMarketWrapperBtn = styled.div`
  background: #F7F7FF;
  min-height: 67px;
  height: 100%;
  padding: 0 23px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${props => props.ModalBackground};
  button{
    min-height: 33px;
    height: 100%;
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 11px;
    cursor: pointer;
    text-align: center;
    color: #FFFFFF;
    background: ${props => props.color};
    border-radius: 4px;
    width: 100%;
    border: none;
    outline: none;
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    transition: 200ms;
    :hover{
      opacity: 0.7;
    }
  }
`;

const ClaimModalHalfWrapper = styled.div`
  width: 100%;
  min-height: 554px;
  height: 100%;
`;
const ClaimModalHalfContentWrapper = styled.div`
  width: 100%;
  min-height: 554px;
  height: 100%;
  padding: 40px;
  @media (max-width: 992px){
    padding: 0 40px 40px 40px;
    margin: -90px 0 0 0;
  }
  
`;
const ClaimModalHalfContent = styled.div`
  margin: 100px 0;
  ${({ mobile, color }) => mobile && `
    display: none;
    & > div{
      border-bottom: 1px solid #F0F0F6;
      div{
        h2{
          color: ${color} !important;
        }
      }
    }
    @media (max-width: 992px){
      display: block;
    }
  `}
  
`;
const ClaimModalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 4px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  max-height: 55px;
  ${({ head }) => head && `
    padding: 12px 4px;
  `}
  ${({ right }) => right && `
    border-bottom: 1px solid #F0F0F6;
  `}
`;
const ClaimModalCol = styled.div`
  h2{
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: 700;
    font-size: 12px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 1);
    display: flex;
    align-items: center;
    span{
      margin: 3px 0 0 0;
    }
    img{
      margin-right: 4px;
      width: 12px;
    }
  }
  ${({ head }) => head && `
    h2{
      font-weight: 600;
      font-size: 9.40209px;
      color: rgba(255, 255, 255, 0.6);
    }
  `}
  ${({ right, color }) => right && `
    h2{
      font-weight: 600;
      font-size: 9.40209px;
      color: ${color} !important;
    }
  `}
  ${({ pair }) => pair && `
    width: 30%;
  `}
  ${({ rewards, ModalText }) => rewards && `
    width: 30%;
    h2{
      color: ${ModalText} !important;
    }
  `}
  ${({ claim }) => claim && `
    width: 40%;
    text-align: center;
    display: flex;
    justify-content: center;
  `}

  ${({ value }) => value && `
    display: flex;
    align-items: center;
    img:nth-child(1){
      position: relative;
      z-index: 1;
    }
    img:nth-child(2){
      margin: 0 -12px;
    }
    h2{
      font-family: 'Inter', sans-serif;
      font-style: normal;
      font-weight: 700;
      font-size: 12px;
      text-transform: uppercase;
      color: #4F4F4F;
      img{
        margin-right: 4px;
      }
    }
  `}
  ${({ btn }) => btn && `
    justify-content: center;
    button{
      background: #369987;
      box-shadow: 0px 1.88042px 3.76084px rgba(0, 0, 0, 0.15);
      border-radius: 25.3857px;
      border: none;
      outline: none;
      cursor: pointer;
      padding: 6px 20px;
      h2{
        font-family: 'Inter', sans-serif;
        font-style: normal;
        font-weight: 700;
        font-size: 12px;
        text-transform: capitalize;        
        color: #FFFFFF;
      }
    }
  `}
  ${({ disabled }) => disabled && `
    justify-content: center;
    button{
      pointer-events: none;
      background: #E5E5E5;
      h2{
        color: #999999;
      }
    }
  `}
  
`;
const StakingModalContentWrapper = styled.div`
  width: ${props => props.migrateStake ? "473px" : "731px"};
  height: ${props => props.height};
  background: ${props => props.backgroundColor};
  @media (max-width: 663px){
    width: 100%;
    height: 100vh;
    border-radius: 12px;
    position: absolute;
    top: 50%;
    overflow: scroll;
    transform: translateY(-50%);
  }
  ${({ migrateStake }) => migrateStake && `
    @media (max-width: 663px){
    }
  `}
`;
const StakingModalContent = styled.div`
  width: 100%;
  padding: 33px;
  height: ${props => props.height};
  & > p{
    font-family: 'Inter', sans-serif;
    font-weight: normal;
    font-size: 12px;
    line-height: 15px;
    color: ${props => props.textColor};
    opacity: 0.8;
    margin: 16px 0 12px 0;
  }
  @media (max-width: 663px){
    position: relative;
    width: 100%;
    min-height: 100vh;
    overflow-y: scroll;
  }
  @media (max-height: 375px){
    position: relative;
    width: 100%;
    overflow-y: scroll;
  }
  ${({ migrateStake }) => migrateStake && `
    top: unset;
    padding: 0;
    // padding: 25px 33px;
  `}
`;

const StakingModalClose = styled.div`
  position: absolute;
  right: 15px;
  top: 15px;
  button{
    background: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    img{
      opacity: 0.7;
      transition: 300ms;
    }
    :hover{
      img{
        opacity: 1;
      }
    }
  }
  ${({ migrate }) => migrate && `
    top: unset;
  `}
  
`;
const ClaimModalHeader = styled.div`
  h2:first-child{
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 15px;
    line-height: 18px;
    color: #898FA4; 
  }
  h2:nth-child(2){
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 24px;
    // color: #FFFFFF;
    color: ${props => props.textColor};
    margin: 9px 0 0 0;
    span{
      font-style: normal;
      font-weight: 600;
      font-size: 14px;
      color: #898FA4;
    }
  }
  button{
    img{
      opacity: 0.7;
      transition: 300ms;
    }
    :hover{
      img{
        opacity: 1;
      }
    }
  }
`;
const ClaimModalTableWrapper = styled.div`
  margin: 27px 0 0 0;   
  max-height: 250px;
  overflow-y: ${props => props.scroll ? "scroll" : ""};
  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-track {
    background: rbga(227,227,227,3);
  }

  ::-webkit-scrollbar-thumb {
    background: #C2C2C2;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #C0C0C0;
  }
`;
const ClaimModalTableTitle = styled.div`
  h2{
    font-family: 'Inter', sans-serif;
    font-weight: bold;
    font-size: 18px;
    line-height: 22px;
    // color: #FFFFFF;
    color: ${props => props.textColor};
  }
`;
const ClaimModalTableSubTitle = styled.div`
    margin: 5px 0 10px 0;
    display: flex;
    justify-content: space-between;
    h2{
      font-family: 'Inter', sans-serif;
      font-weight: bold;
      font-size: 14px;
      width: 45%;
      line-height: 17px;
      color: #898FA4;
    }
    @media (max-width: 663px){
      h2{
        width: 100%;
      }
      & > h2{
        margin: 12px auto;
      }
      flex-direction: column;
    }
`;
const ClaimModalTableHead = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 11px;
  margin: 18px 0 0 0;
  border-bottom: 0.940209px solid ${props => props.BorderStake};
`;
const ClaimModalTableCol = styled.div`
  ${({ head, TableHeadText }) => head && `
    h2{
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      font-size: 9.40209px;
      text-transform: uppercase;
      color: ${TableHeadText};
    }
  `}
  ${({ col, textColor, slice }) => col && `
    display: flex;
    align-items: center;
    h2{
      font-family: 'Inter', sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 10px;
      // color: #FFFFFF;
      color: ${textColor};
      font-family: Inter;
      text-transform: uppercase;
    }
    div{
      display: flex;
      img{
        width: 22px;
        :last-child{
          margin-left: ${(slice) ? "" : "-5px"};
          z-index: 1;
        }
      }
    }
  `}
  ${({ col, sliceliquidityFirstLast, rewards}) => ((col && sliceliquidityFirstLast) || (col && rewards)) && `
    display: flex;
    align-items: center;
    h2{
      font-weight: bold;
      margin-left: 12px;
      img{
        height: 10px;
        margin-right: 2px;
      }
    }
  `}
  
  ${({ sliceliquidityFirstLast }) => sliceliquidityFirstLast && `
      width: 20%;
  `}
  ${({ sliceCol }) => sliceCol && `
      width: 15%;
  `}
  ${({ liquidityCol }) => liquidityCol && `
      width: 20%;
  `}
  
  ${({ staked }) => staked && `
    h2{
      display: flex;
      align-items: center;
      img{
        height: 10px;
        margin-right: 5px;
      }
    }
  `}
  
  ${({ manage }) => manage && `
      h2{
        text-align: center;
      }
  `}

  
  ${({ pair }) => pair && `
    & > div{
      @media (max-width: 663px){
        // display: none;
      }
    }
    h2{
      @media (max-width: 663px){
        // margin-left: 0;
      }
    }
  `}

  h2{
    @media (max-width: 663px){
      font-size: 7px;
    }
  }  
  ${({ mobileHide }) => mobileHide && `
    @media (max-width: 663px){
      display: none;
    }
  `}
  ${({ mobile }) => mobile && `
    @media (max-width: 663px){
      width: 25%;
      justify-content: center;
      text-align: center;
    }
  `}
  ${({ mobilePair }) => mobilePair && `
    @media (max-width: 663px){
      width: 30%;
    }
  `}
  
`;
const ClaimModalTableRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 0.940209px solid ${props => props.BorderStake};
`;
const ClaimModalTableBtn = styled.button`
  width: 72.55px;
  height: 25.72px;    
  background: #369987;
  box-shadow: 0px 1.71442px 3.42883px rgba(0, 0, 0, 0.15);
  border-radius: 23.1446px;
  font-family: 'Inter', sans-serif;
  font-weight: bold;
  font-size: 9.42929px;
  line-height: 11px;
  text-align: center;
  color: #FFFFFF;
  border: none;
  outline: none;
  cursor: pointer;
  margin: 0 auto;

  ${({ disabled, disabledBtnColor }) => disabled && `
    background: ${disabledBtnColor};
    pointer-events: none;
  `}

  // background: #CECECE;
  // background: #C22D2D;
  // color: #666666;
  transition: 300ms;
  :hover{
    opacity: 0.7;
  }
`;
const StakingModalContentSideWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  @media (max-width: 663px){
    flex-direction: column;
  }
`;
const StakingModalContentSide = styled.div`
  width: 50%;
  height: 100%;
  position: relative;
  @media (max-width: 663px){
    width: 100%;
  }
`;
const BreakLink = styled.div`
  padding: 0 19px;    
  span{
    position: absolute;
    height: 100%;
    width: 1px;
    background: rgba(249, 249, 251, 0.1);
    left: 50%;
    top: 0;
    transform: translateX(-50%);
  }
  @media (max-width: 663px){
    display: none;
  }
`;
const StakingModalContentSideTitle = styled.div`
  h2{
    font-family: 'Inter', sans-serif;
    font-weight: bold;
    font-size: 17px;
    // color: #FFFFFF;
    color: ${props => props.textColor};
  }
  ${({ migrate }) => migrate && `
    display: flex;
    align-items: center;
    justify-content: space-between;
  `}
`;
const StakingModalContentSideHeader = styled.div`
  width: 100%;
  height: 57px;
  display: flex;
  align-items: center;
  margin: 14px 0 12px 0;
  background: ${props => props.BoxColor};
  border-radius: 4.33px;
  padding: 0 12px;
  position: relative;
`;
const StakingModalContentSideHeaderBoxWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  ${({ migrate }) => migrate && `
    width: 100%;
  `}
`

const StakingModalContentSideHeaderBox = styled.div`
  width: 48%;
  height: 60px;
  background: ${props => props.BoxColor};
  border-radius: 4.33px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  h2:first-child{
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 9.1px;
    letter-spacing: 0.05em;
    text-align: center;
    text-transform: uppercase;
    margin: 2px auto;
    // color: #FFFFFF;
    color: ${props => props.textColor};
  }
  h2:last-child{
    font-family: 'Inter', sans-serif;
    font-weight: bold;
    font-size: 9.8px;
    text-align: center;
    text-transform: uppercase;
    margin: 2px auto;
    color: ${props => props.BoxColorText};
  }

  ${({ stake }) => stake && `
    width: 23%;
  `}

  


  
`;
const StakingModalContentSideHeaderImg = styled.div`
  display: flex;
  img{
    height: ${props => props.stake ? "24px" : "19px"};
    z-index: 1;
    :last-child{
      margin-left: -5px;
      z-index: 0;    
    }
  }
`;
const StakingModalContentSideHeaderText = styled.div`
  margin-left: 8px;
  h2:first-child{
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 9.33278px;
    line-height: 11px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin: 2px 0;
    // color: #FFFFFF;
    color: ${props => props.textColor};
  }
  h2:last-child{
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 7.77732px;
    line-height: 9px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin: 4px 0;
    color: ${props => props.boxText};
  }

  @media (max-width: 663px){
    h2:first-child{
      font-size: 10px;
    }
    h2:last-child{
      font-size: 5px;
    }
  }
`;
const StakeModalPoolTable = styled.div`
  margin: 24px 0 0 0;
  max-height: 200px;
  overflow-y: ${props => props.scroll ? "scroll" : ""};
  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-track {
    background: rbga(227,227,227,3);
  }

  ::-webkit-scrollbar-thumb {
    background: #C2C2C2;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #C0C0C0;
  }
`;
const StakeModalPoolTableTitle = styled.div`
  h2{
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 12px;
    // color: #FFFFFF;
    color: ${props => props.textColor};
  }
`;
const StakeModalPoolTableHead = styled.div`
  padding: 15px 0 12px 0;
  display: flex;
  justify-content: space-between;
`;

const StakeModalPoolTableRow = styled.div`
  border-top: 0.940209px solid ${props => props.BorderStake};
  padding: 19px 0;
  display: flex;
  justify-content: space-between;
`;
const StakeModalPoolTableCol = styled.div`

  ${({ head, TableHeadText }) => head && `
    h2{
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      font-size: 9.40209px;
      text-transform: uppercase;
      color: ${TableHeadText};
    }
  `}
  ${({ col, textColor }) => col && `
    h2{
      font-family: 'Inter', sans-serif;
      font-weight: bold;
      font-size: 10px;
      text-transform: uppercase;
      // color: #FFFFFF;
      color: ${textColor};
    }
  `}
  ${({ stake }) => stake && `
    width:  33.3333333%;
    h2{
      display: flex;
      align-items: center;
      img{
        height: 10px;
        margin-right: 5px;
      }
    }
  `}

 
`; 

const StakeModalNavigationWrapper = styled.div`
  height: 32px;
  max-width: 164px;
  background: ${props => props.stakeModalBoxBackground};
  border: 1px solid ${props => props.StakeModalNavigationBorder};
  border-radius: 159px; 
  margin: 18px 0 21px 0;
  position: relative;
  span{
    width: 50%;
    height: 100%;
    background:  ${props => props.stakeBoxBackground};
    border-radius: 159px;
    position: absolute;
    opacity: 1;
    transition: 300ms;
    ${({ modalTypeVar }) =>  modalTypeVar === "liqStake" && `
      left: 0;
    `}
    ${({ modalTypeVar }) =>  modalTypeVar === "liqWithdraw" && `
      left: 100%;
      transform: translateX(-100%);
    `}
    ${({ modalTypeVar, theme }) =>  (modalTypeVar === "liqStake" && theme === "light") && `
      border-right: 0.536446px solid #E9E9FC;
    `}
    ${({ modalTypeVar, theme }) =>  (modalTypeVar === "liqWithdraw" && theme === "light") && `
      border-left: 0.536446px solid #E9E9FC;
    `}
  }
`;
const StakeModalNavigationBtn = styled.button`
  width: 50%;
  height: 100%;
  background: transparent;
  opacity: 0.5;
  ${({ active, stakeModalBoxShadow, stakeModalBoxBackground }) => active && `
    // background: ${stakeModalBoxBackground};
    // box-shadow: ${stakeModalBoxShadow};
    opacity: 1;
  `}
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  position: absolute;
  font-size: 9.65602px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: ${props => props.StakeModalNavigationText};
  cursor: pointer;
  border-radius: 159px;
  border: none;
  outline: none;
  ${({ Stake }) => Stake && `
    left: 0;
  `}
  ${({ Withdraw }) => Withdraw && `
    right: 0;
  `}
  transition: 300ms;
  :hover{
    opacity: 1;
  }
`;
const StakeModalFormWrapper = styled.div`
    & > h2{
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      font-size: 12px;
      // color: #FFFFFF;
      color: ${props => props.textColor};
    }
    form{
      & > h2{
        margin: 12px 0;
      }
      h2{
        font-family: 'Inter', sans-serif;
        font-weight: normal;
        font-size: 11px;
        color: ${props => props.inputText};
      }
    }
    ${({ stake }) => stake && `
      margin: 13px 0 0 0;
      width: 100%;
    `}
    ${({ migrateStake }) => migrateStake && `
      margin: 0;
      & > h2{
        margin: 0 0 10px 0;
      }
      form{
        & > h2{
          margin: 5px 0;
        }
      }
    `}
    ${({ migrate }) => migrate && `
      form{
        & > h2{
          margin: 5px 0;
        }
      }
    `}
`;
const StakeModalFormInputWrapper = styled.div`
  position: relative;
  div{
    input{
      border: 0.92283px solid ${props => props.borderColor};
      padding: 10px ${props => props.padding} 10px 16px !important;  
    }
  }
`
const StakeModalFormInput = styled.input`
  width: 100%;
  height: 34.68px;
  background: rgba(255, 255, 255, 0.05);
  border: 0.92283px solid rgba(255, 255, 255, 0.5);
  box-sizing: border-box;
  border-radius: 3.69132px;
  font-family: 'Inter', sans-serif;
  padding: 10px 173px 10px 16px;  
  font-weight: 500;
  font-size: 11px;
  outline: none;
  line-height: 13px;
  // color: #FFFFFF;
  color: ${props => props.textColor};
  ${({ migrateStake }) => migrateStake && `
    background: ${props=>props.MigrateInput};
    border: 0.92283px solid ${props => props.inputColor};
  `}
`;
const StakeModalFormBtn = styled.button`
  font-family: 'Inter', sans-serif;
  font-weight: bold;
  font-size: 12px;
  h2{
    color: #FFFFFF !important;
  }
  color: #FFFFFF;
  width: 100%;
  height: 38px;
  background: #6E41CF;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
  border-radius: 27px;
  border: none;
  outline: none;
  cursor: pointer;
  position: absolute;
  bottom: 0;
  ${({ stake }) => stake && `
    background: #4441CF;
    right: 0;
  `}
  ${({ stake, migrate }) => (!stake && !migrate) && `
    right: 0;
  `}

  ${({ migrateStake }) => migrateStake && `
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 66px);
    margin: 33px 0 25px 0;
  `}
  ${({ step }) => step && `
    background: ${step === "stake" ? "#43406C" : step === "done" ? "#369987" : "#6E41CF"};
  `}
  ${({ disabled, disabledBtnColor }) => disabled && `
    background: ${disabledBtnColor};
    pointer-events: none;
  `}

  ${({ migrate }) => migrate && `
    right: 33px;
  `}
  ${({ migrateStep }) => migrateStep && `
    width: 192px !important;
  `}
  ${({ migrateLoading }) => migrateLoading && `
    background: #4441CF;

  `}  

  @media (max-width: 663px){
    position: relative;
    width: 100%;
    margin: 15px 0;
  }

  transition: 300ms;
  :hover{
    opacity: 0.7;
  }
  
`;
const EstimatedText = styled.div`
  h2:first-child{
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    font-size: 11px;
    color: ${props => props.EstimatedTextColor};
    margin: 17px 0 11px 0;
  }
  h2:last-child{
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    font-size: 11px;
    // color: #FFFFFF;
    color: ${props => props.textColor};
  }
  ${({ migrate, textColor, EstimatedTextColor }) => migrate && `
    display: flex;
    align-items: center;
    h2:first-child{
      margin: 5px 0;
      color: ${textColor};
    }
    h2:last-child{
      margin: 0 5px;
      color: ${EstimatedTextColor};
    }
  `}
`;
const StakingModalHeader = styled.div`
  height: 104px;
  padding: 25px 33px 20px 33px;
  background: rgba(255,255,255, 0.02);
  border-bottom: 1px solid rgba(255,255,255,0.1);

`;
const StepProgressBarWrapper = styled.div`
  margin: 15px 0 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;
const ProgressBarStep = styled.div`
  display: flex;
  align-items: center;  
  width: ${props => props.Withdraw ? "23.3333333%" : "17.333333%"};
  justify-content: ${props => props.Stake ? "flex-end" : "flex-start"};
  
  span{
    min-width: 22px;
    height: 22px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    background: ${props => props.MigrateStepBackground};
    border: 1px solid ${props => props.MigrateStepBorder};
    justify-content: center;
    font-family: 'Inter', sans-serif;
    font-weight: bold;
    font-size: 10.3529px;
    color: ${props => props.MigrateStepTextPending};
    
    ${({ active }) => active && `
      background: #6E41CF;
      border: 1px solid #6E41CF;
      color: #FFFFFF;
    `}
    ${({ done }) => done && `
      background: #369987;
      border: 1px solid #369987;
      color: #FFFFFF;
    `}    
  }
  h2{
    font-family: 'Inter', sans-serif;
    font-weight: bold;
    font-size: 13.1765px;
    margin-left: 9px;
    color: ${props => props.MigrateProgressTextPending};
    ${({ active, done, MigrateProgressTextActive }) => (active || done) && `
      color: ${MigrateProgressTextActive};
    `}
  }
`;
const ProgressBarLineWrapper = styled.div`
  width: 15%;
  height: 1px;
  margin-top: 2px;
  @media (max-width: 663px){
    display: none;    
  }
`;
const ProgressBarDashedLine = styled.div`
  border: 0 none;
  border-top: 1px dashed ${props => props.MigrateProgressLine};
  background: none;
  height:0;
  ${({ done }) => done && `
    display: none;
  `}
`;
const ProgressBarLine = styled.div`
  height: 100%;
  width: 0;
  transition: 300ms;
  background: ${props => props.MigrateProgressLine};
  ${({ done }) => done && `
    width: 100%;
  `}
`;
const InputTag = styled.div`
  div{
    display: flex;
    align-items: center;
    border-left: 2.16725px solid ${props => props.borderColor};
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 15px;
    img{
      width: 18.5px !important;
      margin: 0 9px 0 15px;
    }
    h2{
      font-family: 'Inter', sans-serif;
      font-weight: normal;
      font-size: 13.0035px;
      letter-spacing: 0.05em;
      text-transform: uppercase;        
      // color: #FFFFFF;
      color: ${props => props.textColor};
    }
  }
  button{
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: ${props => props.right};
    background: none;
    border: none;
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    cursor: pointer;
    font-size: 11px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: ${props => props.textColor};
    transition: 300ms;
    :hover{
      opacity: 0.7;
    }
  }

`;
const StakingMigrateModalContent = styled.div`
  padding: 25px 33px 20px 33px;
`;
const RewardsAmountWrapper = styled.div`
  & > h2{
    font-family: 'Inter', sans-serif;
    font-weight: bold;
    font-size: 14px;
    margin: 0 0 15px 0;
    color: ${props => props.MigrateContentTitle};
  }
`;

const RewardsAmountCardsWrapper = styled.div`
  
`;
const RewardsAmountCard = styled.div`
  background: ${props => props.MigrateClaimCardBackground};
  border-radius: 10px;
  padding: 8px 20px;
  margin: 9px 0;
  height: 74px;
  h2{
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 14px;
    color: ${props => props.MigrateClaimCardValue};
    display: flex;
    align-items: center;
    margin: 8px 0;
    span{
      display: flex;
      align-items: center;
      text-transform: uppercase;
      font-size: 13px;
      font-weight: 400;
      img{
        margin: 0 4px;
        width: 18.4px;
      }
    }
  }
  & > h2:first-child{
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 12px;
    color: ${props => props.MigrateClaimCardTitle};
  }
`;
const StakeNewWrapper = styled.div`
  & > h2{
    font-family: 'Inter', sans-serif;
    font-weight: bold;
    font-size: 14px;
    margin: 0 0 15px 0;
    color: ${props => props.MigrateContentTitle};
  }
`;

const StakeNewTable = styled.div`
  
`;
const StakeNewCol = styled.div`
  ${({ pool }) => pool && `
    width: 40%;
  `}
  ${({ lockup }) => lockup && `
    width: 20.6666667%;
    h2{
      text-align: center;
    }
  `}
  ${({ apy }) => apy && `
    width: 13.6666667%;
    h2{
      text-align: center;
    }
  `}
  ${({ stake }) => stake && `
    width: 25.6666667%;
    h2{
      text-align: center;
    }
    button{
      transition: 300ms;
      :hover{
        opacity: 0.7;
      }
    }
  `}
  ${({ head, color }) => head && `
    h2{
      font-family: 'Inter', sans-serif;
      font-weight: bold;
      font-size: 9px;
      line-height: 11px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: ${color};
    }
  `}
  ${({ lockupValue, docsLockupText, docsLockupBackground }) => lockupValue && `
    display: flex;
    justify-content: center;
    h2{
      font-family: 'Inter', sans-serif;
      font-weight: bold;
      font-size: 8px;
      background: ${docsLockupBackground};
      border-radius: 6.38182px;
      text-align: center;
      text-transform: uppercase;
      color: ${docsLockupText};
      height: 21px;
      display: flex;
      align-items: center;
      justify-content: center;
      span{
        padding: 0 12px;
      }
    }
  `}
  ${({ apyValue, color }) => apyValue && `
    display: flex;
    justify-content: center;
    h2{
      font-family: 'Inter', sans-serif;
      font-weight: bold;
      font-size: 10.8491px;
      line-height: 13px;
      text-align: right;
      letter-spacing: 0.05em;
      text-transform: uppercase;
       color: ${color};
    }
  `}
  ${({ stakeValue }) => stakeValue && `
    display: flex;
    justify-content: center;
    button{
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      font-size: 9.57273px;
      line-height: 12px;
      text-align: center;
      text-transform: uppercase;
      background: #4441CF;
      border-radius: 31.9091px;
      border: none;
      cursor: pointer;
      width: 61px;
      height: 21px;
      color: #FFFFFF;
    }
  `}
  ${({ disabled, disabledBtnColor }) => disabled && `
      button{
        background: ${disabledBtnColor} !important;
        pointer-events: none !important;
      }    
  `}
  
  

  

  
`;

const StakeNewTableHead = styled.div`
  margin: 0 0 10px 0;
  display: flex;
`;
const StakeNewTableCards = styled.div`
  
`;
const StakeNewTableCard = styled.div`
  width: 100%;
  height: 57px;
  margin: 0 0 7px 0;
  background: ${props => props.color};
  border: 0.638182px solid ${props => props.borderColor};
  box-sizing: border-box;
  border-radius: 3.19091px;
  display: flex;
  align-items: center;
`;
const StakeNewColFirst = styled.div`
  display: flex;
  align-items: center;
`;
const StakeNewColImg = styled.div`
  display: flex;
  img{
    width: 27px;
    margin: 0 17px;
  }
`;
const StakeNewColText = styled.div`
  h2:first-child{
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 9.57273px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: ${props => props.color};
    margin: 1px 0;
  }
  h2:last-child{
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 7.65818px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #838186;
    margin: 1px 0;
  }
`;
const SliceMigratedWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 45px 0 0 0; 
  & > img{
    max-width: 86px;
    width: 100%;
  }
  ${({ migrate }) => migrate && `
    margin: 0;
  `}
`;
const SliceMigratedText = styled.div`
  h2:first-child{
    font-family: 'Inter', sans-serif;
    font-weight: bold;
    font-size: 20px;
    text-align: center;
    color: ${props => props.MigrateContentTitle};
    margin: 20px auto 12px auto;
  }
  h2:last-child{
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    font-size: 14px;
    text-align: center;
    color: ${props => props.CongratsText};
  }
`;
const LoadingButton = styled.div`
  display: flex;
  justify-content: center;
  opacity: 0.7;
`;
const LoadingButtonCircle = styled.div`
  background-color: #FFFFFF;
  width: 12px;
	height: 12px;
	border-radius: 100%;
	margin: 4px;
	animation: ${bounce} 1s ${props => props.i*0.2}s linear infinite;
`;
const StakingModalChangeBtn = styled.button`
  font-family: 'Inter', sans-serif;
  font-weight: bold;
  font-size: 9px;
  color: #FFFFFF;
  background: #4441CF;
  border-radius: 100px;
  border: none;
  outline: none;
  cursor: pointer;
  position: absolute;
  right: 26px;
  height: 21px;
  width: 58px;
  @media (max-width: 633px){
    font-size: 8px;
    height: 19px;
    width: 46px;
  }
  
`;
const StakingMigrateModalContentWrapper = styled.div`
  
`;
const TrancheModalWrapper = styled.div`
  max-height: 571px;
  ${({ TrancheRewards }) => TrancheRewards && `
      max-height: 517px;
  `}
  ${({ TrancheEnable }) => TrancheEnable && `
    max-height: 600px;  
    height: 100%;  
    @media (max-width: 633px){
      height: 100vh;
    }
  `}
  ${({ TrancheConfirm }) => TrancheConfirm && `
    max-height: 685px;
    min-height: 685px;
    @media (max-width: 633px){
      height: 100vh;
      max-height: unset;
    }
  `}
  width: 100%;
  background: ${props => props.backgroundColor};
  @media (max-height: 560px){
    min-height: 571px;
  }
`;
const TrancheModalHeader = styled.div`
  height: 68px; 
  ${({ TrancheEnable }) => TrancheEnable && `
    height: 210px;   
  `}
  ${({ TrancheConfirm }) => TrancheConfirm && `
    height: 210px; 
  `}
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1.05851px solid ${props => props.border};
  ${({ trancheRewardsModal, color }) => trancheRewardsModal && `
    h2{
      font-family: 'Inter', sans-serif;
      font-weight: bold;
      font-size: 15px;
      text-transform: uppercase;
      text-align: center;
      z-index: 2;
      color: ${color};
    }
  `}


`;
const TrancheModalContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 5px 40px;

  ${({ TrancheRewards }) => TrancheRewards && `
    padding: 0 40px;
  `}
  & > h2{
    font-family: 'Inter', sans-serif;
    font-weight: bold;
    font-size: 14px;
    text-align: center;
    color: ${props => props.color};
    margin: 29px auto 9px auto;
  }
  ${({ trancheStatus }) => trancheStatus && `
    min-height: 280px;
    & > h2{
      margin: -33px 0 0 0;
    }
  `}
`;
const TrancheModalContentHeader = styled.div`
  display: flex;
  justify-content: center;
  text-align: center; 
  flex-direction: column;
  margin: 32px 40px 18px 40px;
  align-items: center;
  text-align: center; 

  
  ${({ trancheRewardsModal, color }) => trancheRewardsModal && `
    h2{
      font-family: 'Inter', sans-serif;
    }
    h2:nth-child(2){
      font-weight: bold;
      font-size: 18.0132px;
      line-height: 22px;
      text-align: center;
      margin: 12px 0 6px 0;
      color: ${color};
    }
    h2:nth-child(3){
      font-weight: bold;
      font-size: 13.5099px;
      line-height: 16px;
      text-align: center;
      color: #898FA4;
    }
  `}

  img{
    width: 65px;
  }
`;
const TrancheModalContentRow = styled.div`
  border-bottom: ${props => props.noBorder ? "" : `1.05851px solid ${props.border}`};
  padding: 21px 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  h2{
    font-family: 'Inter', sans-serif;
  }
  h2:nth-child(1){
    font-weight: bold;
    font-size: 11.2583px;
    color: #898FA4;
  }
  h2:nth-child(2){
    font-weight: bold;
    font-size: 11.2583px;
    line-height: 14px;
    color: ${props => props.color};
  }
`;
const TrancheModalFooter = styled.div` 
  padding: ${props => props.link ? "10px 40px" : "0 40px"};
  button{
    height: 41.66px;
    width: 100%;
    background: #4939D7;
    border-radius: 4.50331px;
    font-family: 'Inter', sans-serif;
    font-weight: bold;
    font-size: 12.3841px;
    text-align: center;
    border: none;
    cursor: pointer;
    outline: none;
    color: #FFFFFF;
    margin: 10px auto 16px auto;
    img{
      margin-right: 5px;
    }
    :disabled{
      background: ${props => props.disabledColor};
      color: ${props => props.disabledTextColor};
      pointer-events: none;
    }
    transition: 200ms;
    :hover{
      opacity: 0.7;
    }
  }
  a{
    transition: 200ms;
    :hover{
      opacity: 0.7;
    }
  }
  

 

  


  h2{
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    padding: 0 0 20px 0;
    font-size: 12.3841px;
    text-align: center;
    color: ${props => props.color};
    a{
      color: #A98BFF;
      font-weight: bold;
      transition: 200ms;
      :hover{
        opacity: 0.7;
      } 
    }
  }
  ${({ TrancheEnableConfirm }) => TrancheEnableConfirm && `
    a{
      display: flex;
      align-items: center;
      justify-content: center;
      height: 41.66px;
      width: 100%;
      background: #4939D7;
      border-radius: 4.50331px;
      font-family: 'Inter', sans-serif;
      font-weight: bold;
      font-size: 12.3841px;
      text-align: center;
      border: none;
      cursor: pointer;
      outline: none;
      color: #FFFFFF;
      margin: 10px auto 16px auto;
      img{
        margin-right: 5px;
      }
    }
  `}
`;

const TrancheModalContentHeaderImg = styled.div`
  position: relative;
  & > img{
    width: 47px;
    margin-bottom: 15px;
  }
  span{
    img{
      width: 47px;
      margin-left: -15px;
      z-index: 2;
    }
  }
`


const TrancheModalContentHeaderText = styled.div`
  & > h2{
    font-family: 'Inter', sans-serif;
    font-weight: bold;
    font-size: 18.0132px;
    text-align: center;
    color: ${props => props.color};
    margin: 17px auto 12px auto;
  }
  div{
    display: flex;
    align-items: center;
    justify-content: space-between;
    // max-width: 129px; 
    width: 100%;
    h2:first-child{
      font-family: 'Inter', sans-serif;
      font-weight: bold;
      font-size: 13.5099px;
      text-align: center;
      color: ${props => props.textColor};
      opacity: 0.5;
    }
    h2:last-child{
      font-family: 'Inter', sans-serif;
      font-weight: bold;
      font-size: 11.4706px;
      text-align: center;
      text-transform: uppercase;
      color: #FFFFFF;
      width: 75.71px;
      height: 26px;
      background: ${props => props.rateColor};
      border-radius: 7.64706px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
    }
  }
`
const TrancheModalContentStatus = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img{
    margin: 45px auto 25px auto;
  }
  h2{
    font-family: 'Inter', sans-serif;
    font-weight: bold;
    font-size: 18.9804px;
    text-align: center;
    color: ${props => props.color};
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
  LoanDetailsMobile,
  StakingModalRow,
  StakingModalWrapper,
  SliceNotFound,
  SliceNotFoundBtn,
  ClaimModalHalfWrapper,
  ClaimModalHalfContentWrapper,
  ClaimModalHalfContent,
  ClaimModalRow,
  ClaimModalCol,
  ModalMarketWrapperBtn,
  ModalMarketWrapper,
  StakingModalContentWrapper,
  StakingModalContent,
  StakingModalClose,
  ClaimModalHeader,
  ClaimModalTableWrapper,
  ClaimModalTableTitle,
  ClaimModalTableSubTitle,
  ClaimModalTableHead,
  ClaimModalTableRow,
  ClaimModalTableCol,
  ClaimModalTableBtn,
  StakingModalContentSideWrapper,
  StakingModalContentSide,
  BreakLink,
  StakingModalContentSideTitle,
  StakingModalContentSideHeader,
  StakingModalContentSideHeaderBoxWrapper,
  StakingModalContentSideHeaderBox,
  StakingModalContentSideHeaderImg,
  StakingModalContentSideHeaderText,
  StakeModalPoolTable,
  StakeModalPoolTableTitle,
  StakeModalPoolTableHead,
  StakeModalPoolTableRow,
  StakeModalPoolTableCol,
  StakeModalNavigationWrapper,
  StakeModalNavigationBtn,
  StakeModalFormWrapper,
  StakeModalFormInputWrapper,
  StakeModalFormInput,
  StakeModalFormBtn,
  EstimatedText,
  StakingModalHeader,
  StepProgressBarWrapper,
  ProgressBarStep,
  ProgressBarLineWrapper,
  ProgressBarDashedLine,
  ProgressBarLine,
  InputTag,
  StakingMigrateModalContent,
  RewardsAmountWrapper,
  RewardsAmountCardsWrapper,
  RewardsAmountCard,
  StakeNewWrapper,
  StakeNewTable,
  StakeNewCol,
  StakeNewTableHead,
  StakeNewTableCards,
  StakeNewTableCard,
  StakeNewColFirst,
  StakeNewColImg,
  StakeNewColText,
  SliceMigratedWrapper,
  SliceMigratedText,
  LoadingButton,
  LoadingButtonCircle,
  StakingModalChangeBtn,
  StakingMigrateModalContentWrapper,
  TrancheModalWrapper,
  TrancheModalHeader,
  TrancheModalContent,
  TrancheModalContentHeader,
  TrancheModalContentRow,
  TrancheModalFooter,
  TrancheModalContentHeaderImg,
  TrancheModalContentHeaderText,
  TrancheModalContentStatus
};