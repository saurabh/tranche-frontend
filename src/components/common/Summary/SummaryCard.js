import React from "react";
import styled from 'styled-components';

const SummaryCardWrapper = styled.div`
    width: 250px;
    height: 121px;
    background: #FFFFFF;
    border: 1px solid #EFEFEF;
    border-top: 6px solid #DFD2FB;
    box-sizing: border-box;
    padding: 17px;
    border-radius: 12px;
    @media (max-width: 992px){
        margin-bottom: 15px;
    }
      
`;
const SummaryCardContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
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

const SummaryCard = ({title, value, details}) => {
    return (
        <SummaryCardWrapper>
           <SummaryCardContainer>
               <SummaryCardTitle>
                    {title}
               </SummaryCardTitle>

               <SummaryCardValue>
                    {value}
               </SummaryCardValue>

               <SummaryCardDetails>
                    {details}
               </SummaryCardDetails>
           </SummaryCardContainer>
        </SummaryCardWrapper>
    );
}


export default SummaryCard;