import styled from "styled-components";

const HeaderWrapper = styled.div`
  min-height: 169px;
  border-radius: 13px;
  padding: 0 46px;
  display: flex;
  justify-content: center;
  background: linear-gradient(180deg, #433FFB 0%, #0C08D6 100%);
  position: relative;
  flex-direction: column;
  @media (max-width: 767px){
    min-height: 100px;
    padding: 0 20px;
    margin: 12px 0;
    z-index: -1;
  }
`;
const HeaderContent = styled.div`
  margin: 39px 0px;
  @media (max-width: 992px) {
    margin: 39px 0px;
  }
  ${({ path }) =>
    (path === "privacy" || path === "terms") &&
    `
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        @media (max-width: 992px){
            transform: translate(-50%, 50%);
        }
    `}
    ${({ path }) =>
    (path !== "stake" && path !== "tranche") &&
    `
      @media (max-width: 767px){
        display: block;
      }
    `}
`;
const HeaderTitle = styled.div`
  & > h2 {
    font-family: "Inter", sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 30px;
    line-height: 36px;
    align-items: center;
    color: #FFFFFF;
    @media (max-width: 767px){
      font-size: 20px;
    }
  }
`;
const HeaderSubtitle = styled.div`
  & > h2 {
    margin-top: 9px;
    font-family: "Inter", sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 17px;
    line-height: 21px;
    color: rgba(255, 255, 255, 0.8);
    @media (max-width: 767px){
      font-size: 12px;
      margin-top: 0;
    }

    ${({ fontSize }) =>
      fontSize &&
      `
            font-size: 9px;
        `}
  }
`;

const NavbarWrapper = styled.div`
  height: 112px;
  position: relative;
  border-bottom: 2px solid #E9E9FC;
  @media (max-width: 992px) {
    height: auto;
    padding: 15px 0;
    border-bottom: 2px solid #E9E9FC;  
  }
`;
const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  @media (max-width: 992px) {
    flex-wrap: wrap;
  }
`;

const NavbarLinks = styled.div`
  display: flex;
  justify-content: space-between;
  width: 336px;
  ${({ tabs }) =>
  tabs &&
  `
    width: auto;
  `}
  & > a {
    // display: inline-block;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    text-align: center;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: ${props => props.theme.navlinkTab};
    opacity: 0.5;
    :hover{
      opacity: 0.6;
    }
  }
  @media (max-width: 992px) {
    flex-direction: column;
    align-items: center;
  }
`;
const HeaderTabsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  height: 100px;
  @media (max-width: 992px){
    flex-direction: row;
    // width: auto;
    text-align: center;
    margin: 0;
  }

  // ${({ path }) => path === "stake" && `
  //   justify-content: flex-end;
  // `}
  



  ${({ mobile }) => mobile && `
    display: none;
    a{
      font-family: "Roboto", sans-serif;
      background-color: transparent;
      border: none;
      font-style: normal;
      font-weight: 700;
      font-size: 12px;
      letter-spacing: 0.05em;
      padding: 0;
      transition: 300ms;
      text-transform: uppercase;
      color: #ffffff;
      cursor: pointer;
      opacity: 0.5;
      border-bottom: 4px solid transparent;
      margin-right: 12px;
      &:focus {
        outline: none;
      }
      :hover{
        color: #FFFFFF;
        opacity: 0.5;
      }
    }
    @media (max-width: 992px){
      display: flex;
    }
  `}
  ${({ desktop }) => desktop && `
    display: none;
    @media (min-width: 992px){
      display: flex;
    }
  `}
`;

const MarketsTabsContainer = styled.div`
  position: relative;
  width: 200px;
  display: flex;
  justify-content: space-between;
  @media (max-width: 992px) {
    flex-direction: row;
    // width: auto;
    margin: 0 20px 0 0;
    text-align: center;
    align-items: flex-end;
  }
  @media (max-width: 767px){
    position: absolute;
    bottom: 0;
    left: 0;
    width: auto;
    padding-right: 15px; 
    padding-left: 15px; 
    margin-right: auto; 
    margin-left: auto; 
  }
  ${({ page }) =>
    page === "tranche" &&
    `
        width: 231px !important;
    `}
`;
const HeaderTabBtn = styled.button`
  font-family: "Roboto", sans-serif;
  background-color: transparent;
  border: none;
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.05em;
  padding: 0;
  padding-bottom: 6px;
  transition: 300ms;
  text-transform: uppercase;
  color: #ffffff;
  cursor: pointer;
  opacity: 0.5;
  border-bottom: 4px solid transparent;
  &:focus {
    outline: none;
  }
  ${({ active, color }) =>
    active &&
    `
        opacity: 1;
        @media (max-width: 992px){
            border-color: ${color};
        }
    `}
  @media (max-width: 992px) {
    padding: 0;
    margin: 0 2px;
    font-size: 9px;
    height: 24px;
  }
  ${({ link }) =>
    link &&
    `
        :hover{
            color: #FFFFFF;
            opacity: 0.5;
        }
    `}
`;
const WalletBtn = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 155px;
  height: 40px;
  background: ${(props) => props.background} !important;
  border-radius: 30px;
  padding: 0 14px;
  border: none;
  cursor: pointer;
  ${({ icon }) =>
    !icon &&
    `
        justify-content: center;
    `}
  &:focus {
    outline: none;
  }
  @media (max-width: 992px) {
    margin: 5px 0;
    width: 129px;
    height: 33px;
  }
`;

const WalletBtnIcon = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 992px) {
    img{
      width: 17px;
    }
  }
`;

const WalletBtnText = styled.div`
  & > h2 {
    font-family: "Inter", sans-serif;;
    font-style: normal;
    font-weight: bold;
    font-size: 12px;    
    text-align: center;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #FFFFFF;
    margin-left: 12px;
    @media (max-width: 992px) {
      font-size: 10px;
    }
  }
`;
const RatesWrapper = styled.div`
  position: relative;
`;

const RatesBoxWrapper = styled.div`
  position: absolute;
  top: -88px;
  right: -220px;
  width: 298px;
  height: auto;
  background: #F9F9FE;
  border: 1px solid #efefef;
  box-sizing: border-box;
  @media (max-width: 992px) {
    left: -29px;
    transform: translateX(-50%);
  }
  ${({ mobile }) =>mobile && ` 
    left: 50% !important;
    top: 0;
    div{

    }
  `}
  
`;
const RatesRowWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 46px;
  ${({ border }) =>
    border &&
    `
        border-bottom: 1px solid #EFEFEF;
    `}
`;
const RatesRowContent = styled.div`
  padding: 14px 21px;
  display: flex;
  align-items: center;
`;
const RatesValue = styled.div`
  display: flex;
  align-items: center;
  h2 {
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    letter-spacing: 0.055em;
    color: #39295a;
    margin-left: 8px;
  }
`;
const RatesValueImg = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25px;
  height: 25px;
  background: transparent;
  border: 1px solid #f2f2f2;
  box-sizing: border-box;
  border-radius: 50%;
  img {
    height: 14.66px;
  }
`;
const RatesValueText = styled.div`
  position: relative;
`;
const RatesRowDash = styled.div`
  h2 {
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    letter-spacing: 0.175em;
    color: #000000;
    margin: 0 18px;
  }
`;
const TabIndicator = styled.div`
  height: 4px;
  width: ${(props) => ((props.path === "lend" && props.language === "en") ? "92px" : (props.path === "lend" && props.language === "zh") ? "64px" : props.path === "borrow" ? "81px" : props.path === "tranche" ? "115px" : "0")};
  background: ${(props) => (props.path === "lend" ? "#D7FFB7" : props.path === "borrow" ? "#CEB7FF" : props.path === "tranche" ? "#ffffff" : "")};
  transition: 300ms;
  bottom: 0;
  position: absolute;
  left: ${(props) =>
    props.tab === "all"
      ? "-2px"
      : props.tab === "own" && props.path === "lend" && props.language === "en" //to be optimized
      ? "calc(100% - 88px)"
      : props.tab === "own" && props.path === "lend" && props.language === "zh" //to be optimized
      ? "calc(100% - 62px)"
      : props.tab === "own" && props.path === "borrow"
      ? "calc(100% - 78px)"
      : props.tab === "allTranches" && props.path === "tranche"  
      ? "-4px"
      : props.tab === "myTranches" && props.path === "tranche"
      ? "calc(100% - 110px)"
      : ""};
  @media (max-width: 992px) {
    display: none;
  }
`;

const NavBarMobile = styled.div`
  width: 100%;
  background: #F9F9FE;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1000;
  height: 0;
  overflow: hidden;
  opacity: 0;
  transition-property: height, opacity, padding;
  transition-duration: 300ms, 100ms, 300ms;
  transition-timing-function: ease;
  ${({ rates }) => rates && `
    left: -100px;
    transition: 300ms;
    background: #F1F1F1;
    z-index: 2000;
  `}
`
const NavBarMobileContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 100px;
  h2:nth-child(2){
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #686565;
    margin: 12px auto;
  }
  ${({ first }) => first && `
    div{
      margin: 25px auto;
      display: flex;
      flex-direction: column;
      a{
        font-style: normal;
        font-weight: normal;
        margin: 14px auto;
        font-size: 28px;
        text-align: center;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: #282828;
        opacity: 0.5;
      }
    }
  `}
  
  
  button{
    border: none;
    outline: none;
    position: absolute;
    left: 20px;
    top: 20px;
  }
`
const LocaleWrapper = styled.div`
  position: relative;
  margin-right: 15px;
  h2, a{
    font-size: 12px;
    text-transform: uppercase;
    font-weight: normal;
    cursor: pointer;
    color: ${(props) => (props.color)}
  }
  img{
    opacity: 0.7;
    margin-left: 2px;
  }
  div{
    position: absolute;
    display: flex;
    flex-direction: column;
    @media (max-width: 992px) {
      position: relative;  
    }
  }
  @media (max-width: 992px) {
    margin-right: 0;
  }
  ${({ mobile }) => mobile && `
    position: absolute;
    right: 33px;
    z-index: 0;
    h2, a{
      color: #2B3193;
    }
  `}
  
`
const NavBarRightWrapper = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 992px) {
    flex-direction: column;
  }
`
const OtherTabsContainer = styled.div`
  position: relative;
  width: 150px;
  display: flex;
  -webkit-justify-content: space-between;
  justify-content: space-between;
  @media (max-width: 767px){
    width: auto;
  }
`
const HeaderTabsBtnsLinks = styled.div`
  width: 481px;
  display: flex;
  justify-content: space-between;
  a, div > button{
    font-family: "Inter", sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    // color: #4441CF;
    color: ${props => props.theme.navlinkTab};
    text-decoration: none;
    outline: none;
    cursor: pointer;
    border: none;
    background: transparent;
    opacity: 0.5;
    :hover{
      opacity: 0.6;
    }
  }
`
const NavbarSpan = styled.span`
  background: #4441CF !important;
`
const MobileNavbarIconWrapper = styled.div`
  display: none;
  @media (max-width: 992px) {
    display: flex;
    align-items: center;
  }

`
const NavbarIconWrapper = styled.div`
  margin-left: 12px !important;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 30px;
  height: 30px;
  background: rgba(68, 65, 207, 0.1);
  border-radius: 50%;
`

const NavbarIconContent = styled.div`
`


export {
  HeaderWrapper,
  HeaderContent,
  HeaderTitle,
  HeaderSubtitle,
  NavbarWrapper,
  NavbarContainer,
  NavbarLinks,
  HeaderTabsWrapper,
  MarketsTabsContainer,
  HeaderTabBtn,
  WalletBtn,
  WalletBtnIcon,
  WalletBtnText,
  RatesWrapper,
  RatesBoxWrapper,
  RatesRowWrapper,
  RatesRowContent,
  RatesValue,
  RatesValueImg,
  RatesValueText,
  RatesRowDash,
  TabIndicator,
  NavBarMobile,
  NavBarMobileContent,
  NavBarRightWrapper,
  LocaleWrapper,
  OtherTabsContainer,
  HeaderTabsBtnsLinks,
  NavbarSpan,
  MobileNavbarIconWrapper,
  NavbarIconWrapper,
  NavbarIconContent
};
