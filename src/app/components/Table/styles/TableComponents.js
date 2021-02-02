import styled from 'styled-components';
import { WhiteAdjust, DarkAdjust, GrayAdjust } from 'assets';


const TableContentCardWrapper = styled.div`
  min-height: 66px;
  position: relative;
`;
const TableContentCard = styled.div`
  display: flex;
  align-items: center;
  min-height: 66px;
  padding: 0 47px;
  border-bottom: 1px solid #efefef;
  justify-content: space-between;
  cursor: pointer;
  @media (max-width: 1200px) {
    flex-direction: column;
    align-items: flex-end;
    border-bottom: 3px solid #efefef;
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
  background: #ffffff;
  border: 1px solid #efefef;
  box-sizing: border-box;
  margin: 24px auto;
  overflow: hidden;
  border-radius: 12px;
  ${({ mobile }) => mobile && `
    display: none;
    box-shadow: 0px 1px 3px -1px rgba(0, 0, 0, 0.25);
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
    background: ${props => props.path === "borrow" ? "rgb(223, 210, 251, 0.2)" : props.path === "lend" ? " rgb(215, 255, 183, 0.2)" : "#F8F8F8"};
    border-top: 1px solid #EFEFEF;
    border-bottom: 1px solid #EFEFEF;
    padding: 0 47px;
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
    & > div {
        position: relative;
        cursor: pointer;
        & > h2{
            font-family: 'Roboto', sans-serif;
            font-style: normal;
            font-weight: 700;
            font-size: 11px;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            color: rgba(56, 56, 56, 0.3);
        }
    }
    @media (max-width: 1200px){
      display: none !important;
    }
    ${({ defaultCursor }) => defaultCursor && `
        & > div {
            cursor: default;
        }
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
    padding: 0 31px;
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
  background: ${props => props.path === "borrow" ? "rgba(84, 17, 226, 0.7)" : props.path === "earn" ? "rgba(30, 187, 27, 0.7)" : "#F8F8F8"};
  border-top: 1px solid #EFEFEF;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  border-bottom: 1px solid #EFEFEF;
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
  h2{
    font-style: normal;
    font-weight: 500;
    text-align: center;
    font-size: 8px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #FFFFFF;
    ${({ address }) => address && `
      text-align: left;
    `}
  }
`

const TableContentCardWrapperMobile = styled.div`
  width: 100%;
  height: 60px;
  border-bottom: 1px solid #F1F1F1;
  //border-left: 4px solid ${props => props.color ? props.color  : ""};
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


export {
  TableWrapper,
  TableContentCardWrapper,
  TableCardTag,
  TableHeadWrapper,
  TableHeadTitle,
  SortChevronWrapper,
  TableContentCard,
  StatusTextWrapper,
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
  TableMobileRowCreateLoan
};