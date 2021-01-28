import styled from "styled-components";

const HeaderWrapper = styled.div`
  min-height: 330px;
  background-color: ${(props) => props.color};
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @media (max-width: 767px){
    min-height: 100px;
  }
`;
const HeaderContent = styled.div`
  margin: 39px 0px;
  @media (max-width: 992px) {
    margin: 39px 0px;
  }
  @media (max-width: 767px){
    display: none;
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
`;
const HeaderTitle = styled.div`
  & > h2 {
    font-weight: 500;
    font-size: 36px;
    line-height: 42px;
  }
`;
const HeaderSubtitle = styled.div`
  & > h2 {
    font-weight: 400;
    font-size: 12px;
    letter-spacing: 0.05em;
    margin-top: 9px;
    text-transform: uppercase;
    ${({ fontSize }) =>
      fontSize &&
      `
            font-size: 9px;
        `}
  }
`;

const NavbarWrapper = styled.div`
  height: 85px;
  position: relative;
  @media (max-width: 992px) {
    height: auto;
    padding: 15px 0;
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
  & > a {
    position: relative;
    display: inline-block;
    font-family: "Roboto", sans-serif;
    font-style: normal;
    font-weight: 700;
    font-size: 15px;
    transition: clip-path 275ms ease;
    line-height: 18px;
    letter-spacing: 0.05em;
    text-decoration: none;
    text-transform: uppercase;
    color: #ffffff;
    opacity: 0.5;
    @media (max-width: 992px) {
      margin: 5px 0;
    }
    span {
      position: absolute;
      display: inline-block;
      color: #ffffff;
      :before {
        position: absolute;
        top: 0;
        content: attr(data-content);
        color: #ffffff;
        border-bottom: 2px solid #ffffff;
        clip-path: polygon(0 0, 0 0, 0% 100%, 0 100%);
        transition: clip-path 275ms ease;
      }
    }
    :hover {
      span:before {
        clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
      }
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
  justify-content: space-between;
  @media (max-width: 992px){
    flex-direction: row;
    // width: auto;
    text-align: center;
    margin: 0;
  }

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
    page === "earn" &&
    `
        width: 100px !important;
    `}
  ${({ links }) =>
    links &&
    `
      a:nth-child(3){
        pointer-events: none;
        opacity: 0.09 !important;
      }
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
  width: 119px;
  height: 30px;
  background: ${(props) => props.background} !important;
  border-radius: 9px;
  padding: 0 13px;
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
  }
`;

const WalletBtnIcon = styled.div`
  display: flex;
  align-items: center;
`;

const WalletBtnText = styled.div`
  & > h2 {
    font-family: "Roboto", sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 10px;
    line-height: 12px;
    display: flex;
    align-items: center;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: ${(props) => props.color} !important;
    margin: 0;
  }
`;
const RatesWrapper = styled.div`
  position: relative;
`;

const RatesBoxWrapper = styled.div`
  position: absolute;
  top: -55px;
  left: -220px;
  width: 298px;
  height: auto;
  background: #ffffff;
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
  width: ${(props) => (props.path === "lend" ? "92px" : props.path === "borrow" ? "81px" : props.path === "earn" ? "36px" : "0")};
  background: ${(props) => (props.path === "lend" ? "#D7FFB7" : props.path === "borrow" ? "#CEB7FF" : props.path === "earn" ? "#ffffff" : "")};
  transition: 300ms;
  bottom: 0;
  position: absolute;
  left: ${(props) =>
    props.tab === "all"
      ? "-2px"
      : props.tab === "own" && props.path === "lend"
      ? "calc(100% - 88px)"
      : props.tab === "own" && props.path === "borrow"
      ? "calc(100% - 78px)"
      : props.tab === "buy" && props.path === "earn"
      ? "-4px"
      : props.tab === "sell" && props.path === "earn"
      ? "calc(100% - 36px)"
      : ""};
  @media (max-width: 992px) {
    display: none;
  }
`;

const NavBarMobile = styled.div`
  width: 100%;
  background: #282828;
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
        color: #FFFFFF;
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
  NavBarMobileContent
};
