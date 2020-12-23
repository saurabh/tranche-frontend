import React from "react";
import { PagesData } from 'config/constants';
import { 
    SummaryCardWrapper,
    SummaryCardContainer,
    SummaryCardTitle,
    SummaryCardValue,
    SummaryCardDetails } from './styles/SummaryComponents';



const SummaryCard = ({title, value, type, details, path}) => {
    return (
        <SummaryCardWrapper color={PagesData[path].cardColor}>
            {
            value &&  
           <SummaryCardContainer>
               <SummaryCardTitle>
                    {title}
               </SummaryCardTitle>

               <SummaryCardValue>
                    {type === "loan" ? `$${value.amount}` : type === "collateral" ?`$${Math.round(value.amount)}` : type === "ratio" ? `${Math.round(value.total)}%` : ""}
               </SummaryCardValue>

               <SummaryCardDetails>
                    {type === "loan" ? value.total + " Loan Positions" : type === "collateral" ? `${value.coin1} ETH / ${value.coin2} JNT` : details}
               </SummaryCardDetails>
           </SummaryCardContainer>
           }
        </SummaryCardWrapper>
    );
}


export default SummaryCard;