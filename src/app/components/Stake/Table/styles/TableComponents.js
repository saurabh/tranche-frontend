import styled from 'styled-components';
import { WhiteAdjust, DarkAdjust, GrayAdjust } from 'assets';


const TableContentCardWrapper = styled.div`
  min-height: 110px;
  position: relative;
  background: ${props => props.color};
  border: 1px solid ${props => props.borderColor};
  box-sizing: border-box;
  box-shadow: ${props => props.shadow};
  border-radius: 5px;
  margin: 12px 0;
`;
const TableContentCard = styled.div`
  display: flex;
  align-items: center;
  min-height: 110px;
  padding: 0 20px;
  // border-bottom: 1px solid #efefef;
  justify-content: space-between;
  cursor: pointer;
  // @media (max-width: 1200px) {
  //   flex-direction: column;
  //   align-items: flex-end;
  //   // border-bottom: 3px solid #efefef;
  //   padding: 0 12px;
  // }
  ${({ pointer }) => !pointer && `
    cursor: default; 
  `}
  ${({ border, color }) => border && `
    border-bottom: 2px solid ${color} !important;
  `}


`;
const TableCardTag = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 24px 24px 0 0;
  ${({ color }) => color && `
    border-color: ${color} transparent transparent transparent;
  `}
  img{
    position: absolute;
    left: ${({color}) => color === '#1ebb1b' ? '1px' : '3px'};
    top: ${({color}) => color === '#1ebb1b' ? '-22px' : '-20px'};
  }
`
const TableWrapper = styled.div`
  width: 100%;
  // background: #ffffff;
  // border: 1px solid #efefef;
  box-sizing: border-box;
  margin: 24px auto;
  // overflow: hidden;
  ${({ mobile }) => mobile && `
    display: none;
    @media (max-width: 1200px){
      display: block;
    }
  `}
  ${({ desktop }) => desktop && `
    display: none;
    @media (min-width: 1200px){
      display: block;
    }
  `}
  
`;




const StatusTextWrapper = styled.h2`
  color: ${props => props.color ? props.color : ""};
  background: ${props => props.backgroundColor ? props.backgroundColor  : ""};
  text-transform: uppercase;
  position: relative;
  ${({ table, color }) => table === 'tranche' && `
    background: transparent;
    border: ${color ? "1px solid " + color : ""};
  `}
`
const MoreRowSpan = styled.span`
  color: ${props => props.color ? props.color : ""};
`
const AdjustModalBtn = styled.button`
  border: 1px solid #39295A;
  box-sizing: border-box;
  background-color: #39295A;
  box-shadow: 0px 2px 2px rgba(237, 237, 237, 0.4);
  //background: ${props => props.backgroundColor ? props.backgroundColor  : ""};
  background-image: url(${WhiteAdjust});
  background-repeat: no-repeat;
  background-position: 50%;
  :hover {
    border: 1px solid #39295A;
    background-image: url(${DarkAdjust});
    background-color: #FFFFFF;
    box-shadow: 0px 2px 2px rgba(237, 237, 237, 0.4);
  }
  :disabled{
    background-image: url(${GrayAdjust}) !important;
    background-color: #F1F1F1;
    color: #666666;
    cursor: default !important;
    border: 1px solid #F1F1F1;
    pointer-events: none;
    box-shadow: none;
  }
  
  ${({ disabledBtn }) => disabledBtn && `
    background-image: url(${GrayAdjust}) !important;
    background-color: #F1F1F1;
    color: #666666;
    cursor: default !important;
    border: 1px solid #F1F1F1;
    pointer-events: none;
    box-shadow: none;
  `}
`
const TableHeadWrapper = styled.div`
    min-height: 28px;
    padding: 0 20px;
    // background: ${props => props.path === "borrow" ? "rgb(223, 210, 251, 0.2)" : props.path === "lend" ? "rgb(215, 255, 183, 0.2)" : "#F8F8F8"};
    // border-top: 1px solid #EFEFEF;
    // border-bottom: 1px solid #EFEFEF;
    // padding: 0 47px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;
const SortingMenu = styled.div`
  position: relative;
  width: 100%;
  display: none;
  @media (max-width: 1200px) {
    display: block;
  }
`;

const TableHeadTitle = styled.div`
    position: relative;
    display: flex;
    & > h2{
        cursor: pointer;
        font-family: 'Inter', sans-serif;
        font-style: normal;
        font-weight: 700;
        font-size: 14px;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: ${props => props.color};
    }
    & > h2:nth-child(2){
      margin-left: 42px;
    }
    & > div {
        position: relative;
        cursor: pointer;
        display: flex;
        text-align: center;
        width: 100%;
        & > h2{
            text-align: center;
            width: 100%;
            font-family: 'Inter', sans-serif;
            font-style: normal;
            font-weight: 700;
            font-size: 11px;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            color: rgba(56, 56, 56, 0.3);
        }
        & > h2:nth-child(2){
          margin-left: 73px;
        }
    }
    @media (max-width: 1200px){
      display: none !important;
    }
    ${({ stakingPool }) => stakingPool && `
       width: 100%;
       text-align: left;
       div{
        h2{
          text-align: left !important;
         }
       }
    `}
    ${({ defaultCursor }) => defaultCursor && `
      & > div {
          cursor: default;
      }
    `}
    ${({ platform }) => platform && `
      width: 10%;
    `}
    ${({ instrument }) => instrument && `
      width: 21%;
    `}
    ${({ apy }) => apy && `
      width: 14%;
      h2{
        text-align: center;
        width: 100%;
      }
    `}
    ${({ totalValue }) => totalValue && `
      width: 15%;
      h2{
        text-align: center;
        width: 100%;
      }
    `}
    ${({ subscription }) => subscription && `
      width: 15%;
      h2{
        text-align: center;
        width: 100%;
      }
    `}
    ${({ status }) => status && `
      width: 15%;
      h2{
        text-align: center;
        width: 100%;
      }
    `}
    ${({ trancheTableBtns }) => trancheTableBtns && `
      width: 5%;
    `}
        
    
`;

const SortChevronWrapper = styled.div`
    position: absolute;
    right: -12px;
    margin-top: -1px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    height: 10px;
    justify-content: space-between;  
    & > img{
        cursor: pointer;
    }
`;

const TableContainerHeader = styled.div`
    min-height: 71px;
    // padding: 0 31px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;
const TableTitle = styled.div`
    & > h2{
        font-family: 'Inter', sans-serif;
        font-style: normal;
        font-weight: bold;
        font-size: 18.3333px;
        line-height: 26px;        
        color: ${props => props.color};
    }
`;
const TableSubTitle = styled.div`
    & > h2{
        font-family: 'Inter', sans-serif;
        font-style: normal;
        font-weight: 500;
        font-size: 12.5px;
        line-height: 15px;
        color: ${props => props.color};
        ${({ sorting }) => sorting && `
          text-align: center;
          letter-spacing: 2px;
        `}
    }
`;
const CreateLoanBtn = styled.div`
    & > button{
        background-color: transparent;
        border: none;
        font-family: 'Inter', sans-serif;
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 14px;
        text-transform: uppercase;
        cursor: pointer;
        color: #39295A;
        transition: 300ms;
        &:focus{
            outline: none;
        }
        & > img{
            margin-bottom: -1px;
            pointer-events: none;
        }
        :active{
          transform: scale(0.9);
        }
    }
`;
const AdjustLoanBtn = styled.button`
  background-color: ${({color}) => color};
`;


const TableHeaderTitles = styled.div`
  position: relative;
`;
const TableMarketsSortingDropdown = styled.div`
  position: absolute;
  width: 150px;
  height: 55px;
  margin-top: 7px;
  overflow: hidden;
  right: ${({path}) => path === "tranche" ? "20px" : " -26px"};
  background: #FFFFFF;
  box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.19);
  border-radius: 6px;
  z-index: 1000;
  ${({ sorting }) => sorting && `
    right: 33px;  
  `}
`;
const TableMarketsSortingDropdownContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;
const TableMarketSortingBtn = styled.button`
  height: 50%;  
  cursor: pointer;
  background: transparent;
  border: none;
  color: rgba(56,56,56,0.7);
  text-transform: uppercase;
  font-size: 10px;
  letter-spacing: 1.09px;
  :hover{
    background: #FAFAFA;
  }
  :focus{
    outline: none;
  }
`;
const CallToActionWrapper = styled.div`
  width: 100%;
  padding: 40px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h2{
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    letter-spacing: 0.05em;
    color: #AEAEAE;
    text-align: center;
    margin: 9px 0;
  }
  button{
    width: 320px;
    height: 42px;
    background: rgba(225, 225, 225, 0.27);
    border-radius: 7px;
    font-family: Open Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    letter-spacing: 0.135em;
    cursor: pointer;
    border: none;
    box-sizing: border-box;
    text-transform: uppercase;
    outline: none;
    color: #AEAEAE;
    transition: 300ms;
    :hover{
      filter: brightness(0.9);
    }
    :active{
      filter: brightness(0.8);
    }
    img{
      margin-right: 12px;
      height: 16px;
    }
  }
`;
const CallToActionTradeWrapper = styled.div`
  width: 100%;
  text-align: center;
`
const CallToActionTradeBtns = styled.div`
  margin-bottom: 41px;
`
const CallToActionTradetext = styled.div`
  margin: -12px auto 29px auto;
  h2{
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    color: #838186;
  }
`
const CallToActionTradeBtn = styled.button`
  width: 148px;
  height: 27px;
  cursor: pointer;
  margin: 2px 12px;
  background: ${props => props.type === "loans" ? "#9B6BFF" : "#2ECC71"}; 
  box-shadow: 0px 1px 1px #E5E5E5;
  border-radius: 2px;
  top: 716px;
  font-style: normal;
  font-weight: normal;
  font-size: 10px;
  text-align: center;
  border: none;
  outline: none;
  color: #FFFFFF;
  span{
    font-weight: bold;
  }
`

const TableHeadWrapperMobile = styled.div`
  min-height: 22px;
  background: transparent;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  padding-left: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const TableColMobile = styled.div`
  width: 19%; //14
  ${({ address }) => address && `
    width: 34%;
  `}
  ${({ btn }) => btn && `
    width: 9%;
  `}
`

const TableHeadTitleMobile = styled.div`
  width: 100%;
  width: 100%;
  text-align: center;
  h2{
    font-style: normal;
    font-weight: 500;
    text-align: center;
    font-size: 8px;
    letter-spacing: 0.05em;
    text-align: center;
    text-transform: uppercase;
    color: rgba(56,56,56,0.3);
    width: 100%;
    text-align: center;
    ${({ address }) => address && `
      text-align: left;
    `}
  }
  display: flex;
  h2:nth-child(2){
    margin-left: 73px;
  }
  
`

const TableContentCardWrapperMobile = styled.div`
  width: 100%;
  height: 60px;
  background: ${props => props.color};
  border: 1px solid ${props => props.borderColor};  
  box-sizing: border-box;
  box-shadow: 0px 4px 4px rgb(189 189 189 / 7%);
  border-radius: 5px;
  margin: 12px 0;
  ${({ tranche }) => tranche && `
    min-height: 92px;
    height: auto;
  `}
`
const TableContentCardMobile = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 12px;
  span{
    height: 100%;
    width: 4px;
    background: ${props => props.color ? props.color  : ""};
    position: absolute;
    left: 0;
  }
  ${({ tranche }) => tranche && `
   
  `}
  border-bottom: none !important;
`
const TableMobilColContent = styled.div`

  h2{
    margin: 1px 0;
  }
  h2:first-child{
    font-style: normal;
    font-weight: 600;
    font-size: 10px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #39295A;
  }
  h2:last-child{
    font-style: normal;
    font-weight: 600;
    font-size: 7px;
    line-height: 10px;    
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #838186;
  }
  ${({ col }) => col && `
    text-align: center;
  `}
  
`
const TableMobilCardBtn = styled.div`
  display: flex;
  justify-content: flex-end;
  button{
    width: 36px;
    height: 60px;
    background-color: ${({color}) => color};
    border: none;
    outline: none;
    display: flex;
    border-radius: 0 !important;
    align-items: center;
    justify-content: center;
  }
  img{
    width: 7px;
  }
  ${({ chevron }) => chevron && `
    button{
      background: transparent  !important;
    }
  `}
`
const TableMobileFiltersWrapper = styled.div`
  width: ${({width}) => width};
  background: #FFFFFF;
  position: relative;
  box-shadow: 0px 1px 3px -1px rgba(0, 0, 0, 0.25);
  margin: 15px 0;
  border-radius: 10px;
  display: none;
  @media (max-width: 992px){
    display: block;
  }
`
const TableMobileFilter = styled.div`
  width: 100%;  
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  ${({ menu }) => menu && `
    :hover{
      background: #f7f7f7;
    }
  `}
`
const TableMobileFiltersMenu = styled.div`
  height: 84px;
  transition: 300ms;
  overflow: hidden;
`
const TableMobileFiltersText = styled.h2`
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 14px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(56, 56, 56, 0.5);
`

const TableMobileFilterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const TableMobileRowCreateLoan = styled.div`
  width: 20%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: -25%;
  button{
    border: none;
    outline: none;
    background: transparent;
  }
`
const InfoBoxWrapper = styled.div`
  position: absolute;
  right: -44px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;

`
const WithdrawBtnWrapper = styled.div`
  width: 16px;
  height: 16px;
  position: absolute;
  right: -4px;
  top: 50%;
  transform: translateY(-50%);
  button{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: transparent;
    border: 1px solid #2ECC71;
    border-radius: 5px;
    outline: none;
    cursor: pointer;
  }
`


const InfoBox = styled.div`
  width: 292px;
  height: 326px;
  background: #FFFFFF;
  border: 1px solid #EFEFEF;
  position: absolute;
  bottom: 36px;
  z-index: 2000;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: default;

  & > div:first-child > div:nth-child(1){
    padding: 17px;
    & > button{
      background: transparent;
      border: none;
      outline: none;
      float: right;
      cursor: pointer;
    }
  }

  & > div:first-child > div:nth-child(2){
    padding: 0 25px 25px;
    text-align: left;
    h2:first-child{
      font-style: normal;
      font-weight: bold;
      font-size: 20px;
      color: #3F3F3F;
    }
    
    h2:last-child{
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      color: rgba(63, 63, 63, 0.5);
    }
  }
  & > div:first-child >div:nth-child(3){
    text-align: left;
    padding: 0 25px 25px;
    p{
      font-weight: normal;
      font-size: 10px;
      color: #3F3F3F;
    }
  }
  & > div:last-child > div:nth-child(1){
    background: #F7F7F7;
    border-radius: 0px 0px 16px 16px;
    padding: 27px 0;
    text-align: center;
    button{
      background: rgb(46, 204, 113, 0.75);
      box-shadow: 0px 2px 2px rgba(236, 236, 236, 0.4);
      border-radius: 4px;
      font-style: normal;
      font-weight: 500;
      font-size: 9px;
      text-align: center;
      color: #FFFFFF;
      min-height: 32px;
      border: none;
      padding: 0 37px;
      cursor: pointer;
      outline: none;
    }
  }
`

const TableCardImgWrapper = styled.div`
  height: 92px;
  width: 17%;
  display: flex;
  align-items: center;
`

const TableCardImg = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  img{
    border-radius: 50%;
    height: 37px;
  }
  span{
    position: absolute;
    width: 16px;
    height: 16px;
    background: ${props => props.background ? props.background : ''};
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    right: -9px;
    bottom: 0;
    @media (max-width: 992px){
      left: 29px;
    }
    img{
      height: 9px;
    }
  }
  
  
  ${({ tranche, color, type }) => tranche && type === "A" && `
    ::after{
      content: "A";
      position: absolute;
      right: -5px;
      bottom: 0;
      color: #FFFFFF;
      font-size: 8px;
      width: 15px;
      height: 15px;
      background: ${color};
      display: flex;
      justify-content: center;
      align-items: center;
    border-radius: 4px;
    }
  `}
  ${({ tranche, color, type }) => tranche  && type === "B" && `
    ::after{
      content: "B";
      position: absolute;
      right: -5px;
      bottom: 0;
      color: #FFFFFF;
      font-size: 8px;
      width: 15px;
      height: 15px;
      background: ${color};
      display: flex;
      justify-content: center;
      align-items: center;
    border-radius: 4px;
    }
  `}
`








const TableFirstCol = styled.div`
  display: flex;
  align-items: center;
  width: 28%;
  ${({ platform }) => platform && `
    width: 10% !important;
  `}
  ${({ instrument }) => instrument && `
    width: 21% !important;
  `}
`
const TableFirstColWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 992px){
    width: 100%;
  }
`
const FirstColImg = styled.div`
  position: relative;
  img{
    border-radius: 50%;
    height: 37px;
  }
`
const FirstColContent = styled.div`
  position: relative;
  margin-left: 12px;

  ${({ instrument }) => instrument && `
    margin-left: 0;
  `}
  @media (max-width: 992px){
    width: 100%;
  }
  
`
const FirstColTitle = styled.div`
  h2{
    font-family: 'Open Sans', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 15px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: ${props => props.color};
  }   
  @media (max-width: 992px){
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    h2{
      font-size: 12px;
    }
    div{
      button{
        width: auto;
        height: auto;
        img{
          width: 12px;
        }
      }
    }
  }
`
const FirstColSubtitle = styled.div`
  display: flex;
  align-items: center;
  h2{
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 9px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #838186;  
  }
  a{
    img{
      height: 12px;
      margin-left: 2px;
    }
  }
`

const TableSecondCol = styled.div`
  width: 12%;
  ${({ stake }) => stake && `
    width: 14%;
  `}
  ${({ apy }) => apy && `
    width: 14% !important;
    div{
      display: flex;
      justify-content: space-around; 
    }
  `}
  position: relative;
`
const SecondColContent = styled.div`
  h2{
    text-align: center !important;
    font-size: 17px !important;
    color: ${props => props.color};
  }
  
  & > img:nth-child(1){
    height: 19px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 25px;
  }
  & > div{
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 25px;
    z-index: 2000;
    img{
      height: 15px;
      z-index: 3000;
      transition: 500ms;
      ${({ tooltip }) => tooltip && `
        transform: rotate(360deg);
      `}
    }
    div{
      width: 225px;
      height: 50px;
      padding: 12px 12px 12px 30px;
      background: #F3F3FE;
      box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.25);
      border-radius: 7px;
      position: absolute;
      top: 50%;
      left: -7px;
      transform: translate(-25px, -50%);
      transition: 300ms;
      z-index: 2000;
      visibility: hidden;
      opacity: 0;
      ${({ tooltip }) => tooltip && `
        transform: translate(0, -50%);
        opacity: 1;
        visibility: visible;
      `}
      h2{
        font-family: 'Inter', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 6px;
        text-align: left !important;
      }
    }
    
  }
  
`
const TableThirdCol = styled.div`
  width: 7%;
  ${({ stake }) => stake && `
    width: 12% !important;
  `}
  ${({ totalValue }) => totalValue && `
    width: 15% !important;
  `}

  position: relative;
`
const ThirdColContent = styled.div`
  h2:first-child{
    text-align: center !important;
    font-size: 17px !important;
    color: ${props => props.color};
  }
  h2:last-child{
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 15px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    text-align: center;
    color: #CCCCCD;
  }
`
const TableFourthCol = styled.div`
  width: 17%;
  ${({ tranche }) => tranche && `
    width: 15%;
  `}
  ${({ stake }) => stake && `
    width: 10% !important;
  `}
  ${({ subscription }) => subscription && `
    width: 15% !important;
  `}

`
const FourthColContent = styled.div`
  position: relative;
  h2:first-child{
    text-align: center !important;
    font-size: 17px !important;
    display: flex;
    flex-direction: column;
    color: ${props => props.color};
    span{
      position: relative;
      font-size: 12px;
      font-weight: bold !important;
      color: rgba(56,56,56,0.3);
    }
  }
  h2:last-child{
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 15px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    text-align: center;
    color: #CCCCCD;
  }
`
const TableFifthCol = styled.div`
  width: 12%;
  ${({ stake }) => stake && `
    width: 30% !important;
  `}
  ${({ status }) => status && `
    width: 15% !important;
  `}

  position: relative;
`
const FifthColContent = styled.div`
  position: relative;
  h2:first-child{
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 17px !important;
    letter-spacing: 0.05em;
    text-align: center !important;
    color: ${props => props.color};
    text-transform: uppercase;
  }
  h2:last-child{
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 15px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    text-align: center;
    color: #CCCCCD;
  }
`
const TableSixthCol = styled.div`
  width: 18%;  
  ${({ stake }) => stake && `
    width: 0% !important;
  `}
  ${({ trancheTableBtns }) => trancheTableBtns && `
    width: 5% !important;
  `}
  display: flex;
  justify-content: center;
  button{
    cursor: pointer;
  }
  button:focus{
    outline: none;
  }  
  @media (max-width: 1200px){
    justify-content: center !important;
  }
  @media (max-width: 992px){
    justify-content: center !important;
  }
`
const AdustBtnWrapper = styled.div`
  button{
    box-sizing: border-box;
    border-radius: 4px;
    border: none;
    width: 50px;
    height: 27px;
    align-items: center;
    justify-content: center;
    display: flex;
    overflow: hidden;
    transition: none;
    ${({ status }) => status && `
      transform: rotate(180deg);
    `}
    :hover{
      filter: brightness(97%);
    }
    img{
      pointer-events: none;
    }
    :disabled{
      background-color: #F1F1F1;
      color: #666666;
      cursor: default
      img{
        filter: grayscale(1);
        opacity: 0.3;
      }
    }
  }
  ${({ chevron }) => chevron && `
    button{
      background: transparent  !important;
    }
  `}
  
`
const TableCardMore = styled.div`
  @media (max-width: 1200px){
    // padding: 0 39px 0 47px;
  }
  @media (max-width: 992px){
    padding: 0 !important;  
    border-top: 2px solid #F9F9FB;
  }
  border-bottom: 2px solid ${props => props.color} !important;
  ${({ border, color }) => border && `
    border-bottom: 1px solid ${color};  
  `}

`
const TableCardMoreContent = styled.div`
  position: relative;   
`
const TableMoreRowWrapper = styled.div`
  position: relative;   
  @media (max-width: 992px){
    padding: 0 !important;  
  }
`
const TableMoreRowContent = styled.div` 
  display: flex;
  min-height: 220px;  
  width: 100%;
  @media (max-width: 992px){
    flex-direction: column;
  }
`

const TableMoreRowContentLeft = styled.div` 
  width: 50%;
  min-height: 220px;
  @media (max-width: 992px){
    width: 100%;
  }
`


const TableMoreLeftTopSection = styled.div`
  display: flex;
  border-bottom: 2px solid ${props => props.color};
`
const TableMoreLeftBottomSection = styled.div`
  height: 120px;
  padding: 20px;
  h2{
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 15px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin: 0 auto 5px auto;
    color: ${props => props.title};
  }
  p{
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    letter-spacing: 0.05em;
    margin: 5px  auto 0 auto;
    color: ${props => props.value};
  }
`
const TableMoreLeftSection = styled.div`
  display: flex;
  justify-content: center;
  width: 25%;
  height: 100px;
  ${({color }) => color && `
    border-right: 2px solid ${color};
  `}
`
const TableMoreLeftSectionContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h2{
    font-family: 'Inter', sans-serif;
    font-style: normal;
    margin: 5px auto;
  }
  h2:first-child{
    font-weight: 600;
    font-size: 14px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: ${props => props.title};
    @media (max-width: 992px){
      font-size: 12px;
    }
  }
  h2:last-child{
    font-weight: bold;
    font-size: 17px;
    text-transform: uppercase;
    color: ${props => props.value};
    @media (max-width: 992px){
      font-size: 14px;
    }
  }
`



const TableMoreRowContentRight = styled.div` 
  display: flex;
  width: 50%;
  min-height: 220px;
  @media (max-width: 992px){
    width: 100%;
    display: flex;
    flex-direction: column;
  }
`

const TableMoreRightSection = styled.div` 
  width: 50%;
  min-height: 220px;
  padding: 0 20px;
  border-left: 2px solid ${props => props.color};
  display: flex;
  flex-direction: column;
  
  justify-content: center;
  h2{
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #7C859B;
    margin: 12px 0;
  }
  form{
    display: flex;
    flex-direction: column;
    & > button{
      display: flex;
      justify-content: center;
      align-items: center;
      height: 38px;
      background: #4441CF;
      border: none;
      border-radius: 4px;
      font-family: 'Inter', sans-serif;
      font-style: normal;
      font-weight: bold;
      font-size: 12px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #FFFFFF;
      margin: 23px 0 0 0;
      outline: none;
      cursor: pointer;
      img{
        margin-right: 5px;
      }
    }
  }
  ${({ withdraw }) => withdraw && `
    form{
      button{
        img{
          transform: rotate(180deg);
        }
      }
    }
  `}
  ${({ disabled, disabledBackground, btn }) => disabled && `
    form{
      div{
        button{
          color: rgba(57, 41, 90, 0.5);
          pointer-events: none;
        }
        input{
          background: ${disabledBackground};  
          pointer-events: none;
          border-color: ${btn}
        }
      }
      & > button{
        pointer-events: none;
        background: ${btn};
      }
    }
  `}
  @media (max-width: 992px){
    width: 100%;
  }
`
const FormContent = styled.div` 
  position: relative;
  button{
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: ${props => props.color} !important;
  }
  input{
    width: 100%;
    height: 33px;
    border-radius: 4px;
    border: 1px solid #CFCFE5;
    background: transparent;
    outline: none;
    padding: 2px 45px 2px 17px;
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: ${props => props.color} !important;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button{
    -webkit-appearance: none;
    margin: 0;
  }
  input[type=number]{
    -moz-appearance: textfield;
  }
`
const CheckboxWrapper = styled.div`
  display: ${({hidden}) => hidden ? 'none' : 'flex'};
  align-items: center;
  & > h2{
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 9px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin: 0 7px 4px 0;
    color: #7C859B;
  }
  ${({ themeToggle }) => themeToggle &&  `
    margin-left: 40px;
    h2{
      font-size: 11.91px;
      color: #9496B6;
      margin: 0 12px;
    }
  `}
`
const CheckboxContent = styled.div`
  input{
    opacity: 0;
    position: absolute;
  }
  input + label{
    position: relative;
    display: inline-block;
    user-select: none;
    cursor: pointer;
    -moz-transition: 0.4s ease;
    -o-transition: 0.4s ease;
    -webkit-transition: 0.4s ease;
    transition: 0.4s ease;
    -webkit-tap-highlight-color: transparent;
    height: 19.99px;
    width: 33.99px;
    background: #CCCCCD;
    border-radius: 60px;
    :before{
      content: "";
      position: absolute;
      display: block;
      -moz-transition: 0.2s cubic-bezier(0.24, 0, 0.5, 1);
      -o-transition: 0.2s cubic-bezier(0.24, 0, 0.5, 1);
      -webkit-transition: 0.2s cubic-bezier(0.24, 0, 0.5, 1);
      transition: 0.2s cubic-bezier(0.24, 0, 0.5, 1);
      height: 19.99px;
      width: 33.99px;
      top: 0;
      left: 0;
      border-radius: 30px;
    }
    :after{
      content: "";
      position: absolute;
      display: block;
      box-shadow: 0 0 0 1px hsla(0, 0%, 0%, 0.1), 0 4px 0px 0 hsla(0, 0%, 0%, 0.04), 0 4px 9px hsla(0, 0%, 0%, 0.13), 0 3px 3px hsla(0, 0%, 0%, 0.05);
      -moz-transition: 0.35s cubic-bezier(0.54, 1.6, 0.5, 1);
      -o-transition: 0.35s cubic-bezier(0.54, 1.6, 0.5, 1);
      -webkit-transition: 0.35s cubic-bezier(0.54, 1.6, 0.5, 1);
      transition: 0.35s cubic-bezier(0.54, 1.6, 0.5, 1);
      background: #FAFAFA;
      height: 11.34px;
      width: 11.34px;
      top: 50%;
      transform: translateY(-50%);
      left: 4px;
      border-radius: 60px;
    }
  }
  input:checked + label{
    :before{
      background: #4441CF;
      -moz-transition: width 0.2s cubic-bezier(0, 0, 0, 0.1);
      -o-transition: width 0.2s cubic-bezier(0, 0, 0, 0.1);
      -webkit-transition: width 0.2s cubic-bezier(0, 0, 0, 0.1);
      transition: width 0.2s cubic-bezier(0, 0, 0, 0.1);
    }
    :after{
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  ${({ disabled }) => disabled && `
    pointer-events: none;
  `}
  ${({ themeToggle }) => themeToggle && `
    display: flex;
    input + label{
      background: #9496B6;
    }
  `}
`

const TableMoreTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  & > h2:nth-child(1){
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: ${props => props.color};
  }
`
const TableMobileContent = styled.div`
  width: 83%;
  height: 92px;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const TableMobileContentRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`


const TableMobileContentCol = styled.div`
  width: 33.3333333%;
  text-align: left;
  :nth-child(1){
    h2{
      display: flex;
      align-items: center;
      img{
        height: 12px;    
        :nth-child(1){
          margin: 0 5px 0 0;
        }
        :nth-child(2){
          margin: 0 0 0 2px;
        }
      }
    }
  }
  h2:first-child{
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 5.55px;
    line-height: 7px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: ${props => props.color};
  }
  h2:last-child{
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 10.42px;
    line-height: 13px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: ${props => props.color};
    margin: 3px 0 0 0;
    span{
      font-weight: normal;
      height: auto;
      width: auto;
      background: none;
      position: relative;
    }
  }
`

const MobileMoreFormBtns = styled.div`
  button{
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 10.5px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    background: transparent;
    border: none;
    padding: 7px 0;
    outline: none;
    opacity: 0.5;
    margin-right: 12px;
    color: ${props => props.color};
  }
`
const MobileMoreFormBtn = styled.button`
  ${({ current, color }) => current && `
    border-bottom: 1px solid ${color} !important;
    opacity: 1 !important;
  `}
`

  

export {
  TableWrapper,
  TableContentCardWrapper,
  TableCardTag,
  TableHeadWrapper,
  TableHeadTitle,
  SortChevronWrapper,
  TableContentCard,
  StatusTextWrapper,
  TableCardImg,
  MoreRowSpan,
  TableContainerHeader,
  TableTitle,
  TableSubTitle,
  TableHeaderTitles,
  CreateLoanBtn,
  AdjustLoanBtn,
  AdjustModalBtn,
  TableMarketsSortingDropdown,
  TableMarketsSortingDropdownContent,
  TableMarketSortingBtn,
  CallToActionWrapper,
  SortingMenu,
  TableHeadWrapperMobile,
  TableHeadTitleMobile,
  TableColMobile,
  TableContentCardWrapperMobile,
  TableContentCardMobile,
  TableMobilColContent,
  TableMobilCardBtn,
  TableMobileFiltersWrapper,
  TableMobileFilter,
  TableMobileFiltersMenu,
  TableMobileFiltersText,
  CallToActionTradeWrapper,
  CallToActionTradeBtns,
  CallToActionTradeBtn,
  CallToActionTradetext,
  TableMobileFilterRow,
  TableMobileRowCreateLoan,
  InfoBoxWrapper,
  InfoBox,
  TableFirstCol,
  TableFirstColWrapper,
  FirstColImg,
  FirstColContent,
  FirstColTitle,
  FirstColSubtitle,
  TableSecondCol,
  SecondColContent,
  TableThirdCol,
  ThirdColContent,
  TableFourthCol,
  FourthColContent,
  TableFifthCol,
  FifthColContent,
  TableSixthCol,
  AdustBtnWrapper,
  TableCardMore,
  TableCardMoreContent,
  WithdrawBtnWrapper,
  TableMoreRowWrapper,
  TableMoreRowContent,
  TableMoreRowContentLeft,
  TableMoreRowContentRight,
  TableMoreRightSection,
  FormContent,
  CheckboxWrapper,
  CheckboxContent,
  TableMoreTitleWrapper,
  TableMobileContent,
  TableMobileContentRow, 
  TableMobileContentCol,
  TableCardImgWrapper,
  MobileMoreFormBtns,
  MobileMoreFormBtn,
  TableMoreLeftSection, 
  TableMoreLeftSectionContent,
  TableMoreLeftTopSection,
  TableMoreLeftBottomSection
};