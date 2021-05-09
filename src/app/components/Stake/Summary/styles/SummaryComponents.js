import styled from 'styled-components';


const SummaryCardWrapperContent = styled.div`
    width: 30%;
    height: 121px;
    background: ${props => props.color};;
    // border: 1px solid #EFEFEF;
    // border-top: 6px solid ${props => props.color};
    box-sizing: border-box;
    border-radius: 12px;
    @media (max-width: 992px){
        margin-bottom: 15px;
        width: 100%;
        // display: none !important;
    }
`;
const SummaryCardWrapper = styled.div`
    width: 100%;
    height: 121px;
    background: ${props => props.color};;
    // border: 1px solid #EFEFEF;
    // border-top: 6px solid ${props => props.color};
    box-sizing: border-box;
    padding: 17px;
    border-radius: 12px;
    @media (max-width: 992px){
        margin-bottom: 15px;
        width: 100%;
        // display: none !important;
    }
`;
const SummaryCardContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    position: relative;
    ${({ loading }) => loading && `
        div{
            width: 100%;
            height: 7px;
            animation: gradient-slide 2.2s ease infinite;
            background: 0 0/300% 300% -webkit-gradient(linear, left top, right top, color-stop(40%, #eee), color-stop(50%, #f7f7f7), color-stop(60%, #eee));
            background: 0 0/300% 300% linear-gradient(90deg, #eee 40%, #f7f7f7 50%, #eee 60%);
        }
        div:nth-child(1){
            width: 50%;
        }
        div:nth-child(2){
            height: 27px;
        }
        div:nth-child(3){
            width: 80%;
        }
  `}
`;
const SummaryCardTitle = styled.h2`
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    color: #FFFFFF;
`;
const SummaryCardValue = styled.h2`
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 700;
    font-size: 32px;
    color: #FFFFFF;
`;
const SummaryCardDetails = styled.h2`
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    color: #FFFFFF;
`;

const SummaryCardsWrapper = styled.div`
//   margin-top: ${props => props.path === "stake" && !props.isDesktop ? "" : "30px"};
  display: flex;
  justify-content: space-between;
  @media (max-width: 992px) {
    justify-content: center;
    flex-direction: column;
  }
  & > button{
    height: 42px;
    box-shadow: 0px 1px 3px -1px rgba(0, 0, 0, 0.25);
    border: none;
    border-radius: 10px;
    background: #FFFFFF;
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: center;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: rgba(56, 56, 56, 0.5);
    padding: 15px;
    margin: 15px 0 0 0;
    cursor: pointer;
    outline: none;
  }
`;

const SummaryCardCounter = styled.div`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
    ${({ stakingMobile }) => stakingMobile && `
        button{
            background: #4441CF;
        }
        @media (max-width: 633px){
            position: relative;
            transform: none;
            display: flex;
            justify-content: center;
            margin: 7px 0;
        }
    `}
`;
const SummaryClaimBtn = styled.div`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
    ${({ claim }) => claim && `
       button{
            font-size: 12px;
            padding: 12px 25px;
            font-family: "Inter",sans-serif;
            background: rgba(255,255,255,1);
            border-radius: 10px;
            font-weight: 600;
            color: #369987;
            border: none;
            cursor: pointer;
            letter-spacing: 0.05em;
            text-transform: uppercase;    
            outline: none;
       }
    `}
    ${({ stakingMobile }) => stakingMobile && `
        button{
            background: #4441CF;
            color: #FFFFFF !important;
        }
        @media (max-width: 633px){
            position: relative;
            transform: none;
            display: flex;
            justify-content: center;
            margin: 7px 0;
        }
    `}

`;

const SummaryCardBtn = styled.button`
    background: rgba(255, 255, 255, 0.3);
    color: #FFFFFF;
    border-radius: 50%;
    border: none;
    outline: none;
    font-size: 24px;
    font-family: 'Roboto';
    font-weight: 100;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin: 5px 0;
    cursor: pointer;
    ${({ disabled }) => disabled && `
        background: #E4E4E4;
        pointer-events: none;
    `}
    ${({ stakingMobile }) => stakingMobile && `
        @media (max-width: 633px){
            margin: 3px;
        }
    `}
`;





export {
    SummaryCardWrapperContent,
    SummaryCardWrapper,
    SummaryCardContainer,
    SummaryCardTitle,
    SummaryCardValue,
    SummaryCardDetails,
    SummaryCardsWrapper,
    SummaryCardCounter,
    SummaryCardBtn,
    SummaryClaimBtn
};