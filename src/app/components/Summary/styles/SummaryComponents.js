import styled from 'styled-components';

const SummaryCardWrapper = styled.div`
    width: 300px;
    height: 121px;
    background: #FFFFFF;
    border: 1px solid #EFEFEF;
    border-top: 6px solid ${props => props.color};
    box-sizing: border-box;
    padding: 17px;
    border-radius: 12px;
    @media (max-width: 992px){
        margin-bottom: 15px;
        width: 100%;
        display: none;
    }
      
`;
const SummaryCardContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
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
    color: rgba(0, 0, 0, 0.45);
`;
const SummaryCardValue = styled.h2`
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 700;
    font-size: 32px;
    color: rgba(0, 0, 0, 0.8);
`;
const SummaryCardDetails = styled.h2`
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    color: rgba(0, 0, 0, 0.25);
`;

const SummaryCardsWrapper = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  @media (max-width: 992px) {
    justify-content: center;
    flex-direction: column;
  }
`;


export {
    SummaryCardWrapper,
    SummaryCardContainer,
    SummaryCardTitle,
    SummaryCardValue,
    SummaryCardDetails,
    SummaryCardsWrapper
};