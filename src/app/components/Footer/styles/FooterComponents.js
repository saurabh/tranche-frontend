import styled from "styled-components";

const LanguageContainer = styled.div` 
  display: flex;
  align-items: center;
  position: relative;
  max-width: 190px; 
  width: 100%;
  h2{
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    color: #9496B6;
  }
`;
const LanguageContent = styled.div` 
  background: ${props => props.color};
  border-radius: 0 0 15px 15px;
  padding: 0 12px;
  width: 105px;
  min-height: 29px;
  height: 100%;
  display: flex;
  position: relative;
  align-items: center;
  margin-left: 12px;
  ${({ menu }) => !menu && `
    border-radius: 15px;
  `}
  div a, div h2{
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 11.4964px;
    color: ${props => props.textColor};
  }
  div:first-child{
    display: flex;
    flex-direction: column;
    height: 87px;
    position: absolute;
    overflow: hidden;
    border-radius: 15px 15px 0 0;
    width: 100%;
    left: 0;
    bottom: 29px;
    background: ${props => props.color};
    a{
      padding: 0 12px;
      height: 29px;
      display: flex;
      align-items: center;
      opacity: 0.8;
      :hover{
        background: ${props => props.color};
      }
    }
    ${({ menu }) => !menu && `
      height: 0;
    `}
  }
  div:last-child{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 29px;
    box-sizing: border-box;
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    padding: 0 12px;  
    cursor: pointer;
  }
  div:last-child img{
    height: 5px;
    transform: rotate(180deg);
  }
  
 
`;

const FooterLeft = styled.div` 
  display: flex;
  align-items: center;
`;

const FooterContainer = styled.div` 
  background: ${props => props.color};
`;
const FooterLinks = styled.div` 
  a{
    color: ${props => props.color};
  }
`;



export {
  FooterContainer,
  LanguageContainer, 
  LanguageContent,
  FooterLinks,
  FooterLeft
};
