import styled from 'styled-components';

const SummaryCardWrapperContent = styled.div`
    //change
    width: 21.6666667%;
    height: 121px;
    background: ${props => props.color};;
    // border: 1px solid #EFEFEF;
    // border-top: 6px solid ${props => props.color};
    box-sizing: border-box;
    border-radius: 12px;
     @media (max-width: 992px){
        // margin: 0 19px;
        width: 90% !important;
        // display: none !important;
    }
    ${({ stakeCard }) => stakeCard && `
        width: 30% !important;
        @media (max-width: 992px){
            margin: 15px 0;
            width: 90% !important;
            // display: none !important;
        }
     `}
`;
const SummaryCardWrapper = styled.div`
    //change
    width: 100%;
    height: 121px;
    background: ${props => props.color};;
    // border: 1px solid #EFEFEF;
    // border-top: 6px solid ${props => props.color};
    box-sizing: border-box;
    padding: 17px;
    border-radius: 12px;
     @media (max-width: 992px){
        margin: 0 19px;
        width: 90% !important;
        // display: none !important;
        width: 90%;
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
            background: 0 0/300% 300% -webkit-gradient(linear, left top, right top, color-stop(40%, rgba(255,255,255,0.09)), color-stop(50%, rgba(255,255,255,0.09)), color-stop(60%, rgba(255,255,255,0.09)));
            background: 0 0/300% 300% linear-gradient(90deg, rgba(255,255,255,0.09) 40%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.09) 60%);
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
    ${({ stakeCard }) => stakeCard && `
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    `}
`;
const SummaryCardTitle = styled.h2`
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    color: #FFFFFF;
    div{
        img{
            position: absolute;
            right: -9px;
            top: -9px;
            @media (max-width: 992px){
                display: none;
            }
        }
    }
`;
const SummaryCardValue = styled.h2`
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: 700;
    font-size: 32px;
    color: #FFFFFF;
`;
const SummaryCardDetails = styled.h2`
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    color: #FFFFFF;
`;

const SummaryCardsWrapper = styled.div`
  margin-top: ${props => props.path === "stake" && !props.isDesktop ? "" : "30px"};
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
            background: rgba(255,255,255,0.3);
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
    font-family: 'Inter', sans-serif;
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
const StakeCardText = styled.div`
        h2{
            font-family: "Inter", sans-serif;
            font-style: normal;
            color: #FFFFFF;
        }
        h2:nth-child(1){
            font-weight: bold;
            font-size: 20px;

            @media (max-width: 992px) {
                font-size: 15px;            
            }

        }
        h2:nth-child(2){
            font-size: 14px;
            font-weight: 500;
            @media (max-width: 992px) {
                font-size: 14px;
            }
        }
`;
const StakeCardBtn = styled.div`
        button{
            font-family: "Inter", sans-serif;
            background: #FFFFFF;
            border: 2px solid #FFFFFF;
            box-sizing: border-box;
            border-radius: 10px;
            font-style: normal;
            font-weight: bold;
            font-size: 13px;
            text-align: center;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            padding: 7px 27px;
            outline: none;
            transition: 300ms;
            cursor: pointer;
            color: #1D19E1;
            a{
                color: #1D19E1;
            }
            :hover{
                filter: drop-shadow(0px 3px 2px rgba(0,0,0,0.3));
                transform: translateY(-2px);
            }

        }
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
    SummaryClaimBtn,
    StakeCardText,
    StakeCardBtn
};