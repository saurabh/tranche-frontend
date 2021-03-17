import styled from 'styled-components';
import { WhiteAdjust, DarkAdjust, GrayAdjust } from 'assets';


const TableContentCardWrapper = styled.div`
  min-height: 66px;
  position: relative;
  background: #FFFFFF;
  border: 1px solid #F0F0F7;
  box-sizing: border-box;
  box-shadow: 0px 4px 4px rgba(189, 189, 189, 0.07);
  border-radius: 5px;
  margin: 12px 0;
`;
const TableContentCard = styled.div`
  display: flex;
  align-items: center;
  min-height: 66px;
  padding: 0 20px;
  // border-bottom: 1px solid #efefef;
  justify-content: space-between;
  cursor: pointer;
  @media (max-width: 1200px) {
    flex-direction: column;
    align-items: flex-end;
    // border-bottom: 3px solid #efefef;
    padding: 0 12px;
  }
  ${({ pointer }) => !pointer && `
    cursor: default; 
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
        font-family: 'Roboto', sans-serif;
        font-style: normal;
        font-weight: 700;
        font-size: 11px;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: rgba(56, 56, 56, 0.3);
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
            font-family: 'Roboto', sans-serif;
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
      width: 10%;
    `}
    ${({ apy }) => apy && `
      width: 18%;
      h2{
        text-align: center;
        width: 100%;
      }
    `}
    ${({ totalValue }) => totalValue && `
      width: 18%;
      h2{
        text-align: center;
        width: 100%;
      }
    `}
    ${({ subscription }) => subscription && `
      width: 18%;
      h2{
        text-align: center;
        width: 100%;
      }
    `}
    ${({ status }) => status && `
      width: 16%;
      h2{
        text-align: center;
        width: 100%;
      }
    `}
    ${({ trancheTableBtns }) => trancheTableBtns && `
       width: 10%;
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
        font-family: "Roboto", sans-serif;
        font-style: normal;
        text-transform: uppercase;
        font-weight: 400;
        font-size: 18px;
        color: #292929;   
    }
`;
const TableSubTitle = styled.div`
    & > h2{
        font-family: "Roboto", sans-serif;
        font-style: normal;
        text-transform: uppercase;
        font-weight: 400;
        font-size: 10px;
        cursor: pointer;
        color: #292929;
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
        font-family: 'Roboto', sans-serif;
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
  right: ${({path}) => path === "earn" ? "20px" : " -26px"};
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
    font-family: Roboto;
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
  background: #FFFFFF;
  border: 1px solid #F0F0F7;
  box-sizing: border-box;
  box-shadow: 0px 4px 4px rgb(189 189 189 / 7%);
  border-radius: 5px;
  margin: 12px 0;
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
const TableCardImg = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  img{
    border-radius: 50%;
    height: 37px;
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
    width: 10% !important;
  `}
`
const TableFirstColWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
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
  ${({ instrument }) => instrument && `
    margin-left: 0;
  `}
  
`
const FirstColTitle = styled.div`
  h2{
    font-family: 'Open Sans', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 10px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #39295A;
  }   
`
const FirstColSubtitle = styled.div`
  display: flex;
  align-items: center;
  h2{
    font-family: 'Roboto', sans-serif;
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
    width: 18% !important;
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
  }
`
const TableThirdCol = styled.div`
  width: 7%;
  ${({ stake }) => stake && `
    width: 12% !important;
  `}
  ${({ totalValue }) => totalValue && `
    width: 18% !important;
  `}

  position: relative;
`
const ThirdColContent = styled.div`
  h2{
    text-align: center !important;
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
    width: 18% !important;
  `}

`
const FourthColContent = styled.div`
  position: relative;
  h2{
    text-align: center !important;
    display: flex;
    flex-direction: column;
    padding-top: 13px;
    span{
      position: relative;
      font-size: 10px;
      font-weight: bold !important;
      color: rgba(56,56,56,0.3);
    }
  }
`
const TableFifthCol = styled.div`
  width: 12%;
  ${({ stake }) => stake && `
    width: 30% !important;
  `}
  ${({ status }) => status && `
    width: 16% !important;
  `}

  position: relative;
`
const FifthColContent = styled.div`
  position: relative;   
`
const TableSixthCol = styled.div`
  width: 18%;  
  ${({ stake }) => stake && `
    width: 0% !important;
  `}
  ${({ trancheTableBtns }) => trancheTableBtns && `
    width: 10% !important;
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
    transition: 1s;
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
`
const TableCardMore = styled.div`
  @media (max-width: 1200px){
    // padding: 0 39px 0 47px;
  }
  @media (max-width: 992px){
    padding: 30px 12px 30px 12px;
  }

`
const TableCardMoreContent = styled.div`
  position: relative;   
`
const TableMoreRowWrapper = styled.div`
  position: relative;   
`
const TableMoreRowContent = styled.div` 
  display: flex;
  min-height: 220px;  
  width: 100%;
`

const TableMoreRowContentLeft = styled.div` 
  display: flex;  
  width: 50%;
  min-height: 220px;
`

const TableMoreRowContentRight = styled.div` 
  width: 50%;
  min-height: 220px;
`

const TableMoreLeftSection = styled.div` 
  width: 50%;
  min-height: 220px;
  padding: 0 20px;
  border-right: 2px solid #F9F9FB;
  display: flex;
  flex-direction: column;
  justify-content: center;
  h2{
    font-family: 'Inter', sans-serif;
    font-style: normal;
  }
  h2:nth-child(1){
    font-weight: bold;
    font-size: 16px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #39295A;
  }
  h2:nth-child(2){
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
    div{
      position: relative;
      button{
        position: absolute;
        right: 0;
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
        color: #39295A;
      }
      input{
        width: 100%;
        height: 33px;
        border-radius: 4px;
        border: 1px solid #CFCFE5;
        outline: none;
        padding: 2px 40px 2px 17px;
        font-family: 'Inter', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: #39295A;
      }
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button{
        -webkit-appearance: none;
        margin: 0;
      }
      input[type=number]{
        -moz-appearance: textfield;
      }
    }
    
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
  TableMoreLeftSection
};