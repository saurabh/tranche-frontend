import styled from 'styled-components';
import { WhiteAdjust, DarkAdjust, GrayAdjust, Key } from 'assets';


const TableContentCardWrapper = styled.div`
  min-height: 66px;
  position: relative;
`;
const TableContentCard = styled.div`
  display: flex;
  align-items: center;
  min-height: 66px;
  padding: 0 39px 0 47px;
  border-bottom: 1px solid #efefef;
  cursor: pointer;
  @media (max-width: 1200px) {
    flex-direction: column;
    align-items: flex-end;
    border-bottom: 3px solid #efefef;
    padding: 0 12px;
  }
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
  border-radius: 12px;
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
    background: #FAF8FF;
    border-top: 1px solid #EFEFEF;
    border-bottom: 1px solid #EFEFEF;
    padding: 0 47px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    @media (max-width: 1200px){
        display: none !important;
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
        color: #292929;
    }
`;
const CreateLoadBtn = styled.div`
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
        &:focus{
            outline: none;
        }
        & > img{
            margin-bottom: -1px;
            pointer-events: none;
        }
    }
`;
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
    CreateLoadBtn,
    AdjustModalBtn
};
  