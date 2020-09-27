import styled from 'styled-components';

const HeaderWrapper = styled.div`
    min-height: 330px;
    background-color: ${(props) => props.color};
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;
const HeaderContent = styled.div`
    margin: 39px 0px;
    @media (max-width: 992px){
        margin: 39px 0px;
    }
`;
const HeaderTitle = styled.div`
    & > h2{
        font-weight: 500;
        font-size: 36px;
        line-height: 42px;
    }
`;
const HeaderSubtitle = styled.div`
    & > h2{
        font-weight: 400;
        font-size: 12px;
        letter-spacing: 0.05em;
        margin-top: 9px;
        text-transform: uppercase;
    }
`;
  
const NavbarWrapper = styled.div`
    height: 85px;
    position: relative;
    @media (max-width: 992px){
        height: auto;
        padding: 15px 0;
    }
`;
const NavbarContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    @media (max-width: 992px){
        flex-wrap: wrap;
    }
`;

const NavbarLinks = styled.div`
    display: flex;
    justify-content: space-between;
    width: 336px;
    & > a{
        font-family: 'Roboto', sans-serif;
        font-style: normal;
        font-weight: 700;
        font-size: 15px;
        line-height: 18px;
        letter-spacing: 0.05em;
        text-decoration: none;
        text-transform: uppercase;
        color: #FFFFFF;
        opacity: 0.5;
        @media (max-width: 992px){
            margin: 5px 0;
        }
    }
    @media (max-width: 992px){
        flex-direction: column;
        align-items: center; 
    }
`;
const HeaderTabsWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    @media (max-width: 992px){
        flex-direction: column;
        width: auto;
        text-align: center;
        margin: 26px 0;
    }
`;

const MarketsTabsContainer = styled.div`
    width: 384px; 
    display: flex;
    justify-content: space-between;
    @media (max-width: 992px){
        flex-direction: column;
        width: auto;
        text-align: center;
    }
`;
const HeaderTabBtn = styled.button`
    font-family: 'Roboto', sans-serif;
    background-color: transparent;
    border: none;
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 0.05em;
    padding: 0;
    padding-bottom: 6px;
    text-transform: uppercase;
    color: #FFFFFF;
    cursor: pointer;
    opacity: 0.5;
    border-bottom: 4px solid transparent;
    &:focus{
        outline: none;
    }
    @media (max-width: 992px){
        padding: 0;
        margin: 12px 0;
    }
`;

const WalletBtn = styled.button`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 119px;
    height: 30px;
    background: #DFD2FB;
    border-radius: 9px;
    padding: 0 13px;
    border: none;
    cursor: pointer;
    ${({ icon }) => !icon && `
        justify-content: center;
    `}
    &:focus{
        outline: none;
    }
    @media (max-width: 992px){
        margin: 5px 0;
    }
`;

const WalletBtnIcon = styled.div`
    display: flex;
    align-items: center;
`;

const WalletBtnText = styled.div`
    & > h2{
        font-family: 'Roboto', sans-serif;
        font-style: normal;
        font-weight: 400;
        font-size: 10px;
        line-height: 12px;
        display: flex;
        align-items: center;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: rgba(58, 10, 159, 0.85);
        margin: 0;
    }
`;
 
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
  WalletBtnText
};
