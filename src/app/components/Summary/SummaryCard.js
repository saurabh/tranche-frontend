import React from "react";
import { PagesData } from 'config/constants';
import { 
    SummaryCardWrapper,
    SummaryCardContainer,
    SummaryCardTitle,
    SummaryCardValue,
    SummaryCardDetails } from './styles/SummaryComponents';



const SummaryCard = ({title, value, details, path}) => {
    return (
        <SummaryCardWrapper color={PagesData[path].cardColor}>
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