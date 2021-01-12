import React from 'react';
import { PagesData } from 'config/constants';
import { roundNumber } from 'utils/helperFunctions';
import {
  SummaryCardWrapper,
  SummaryCardContainer,
  SummaryCardTitle,
  SummaryCardValue,
  SummaryCardDetails
} from './styles/SummaryComponents';

const SummaryCard = ({ title, value, type, details, path }) => {
  return (
    <SummaryCardWrapper color={PagesData[path].cardColor}>
      {value && (
        <SummaryCardContainer>
          <SummaryCardTitle>{title}</SummaryCardTitle>

          <SummaryCardValue>
            {type === 'loan'
              ? `$${roundNumber(value.amount)}`
              : type === 'collateral'
              ? `$${Math.round(value.amount)}`
              : type === 'ratio'
              ? `${roundNumber(value.total, 1)}%`
              : ''}
          </SummaryCardValue>

          <SummaryCardDetails>
            {type === 'loan'
              ? value.total + ' Loan Positions'
              : type === 'collateral'
              ? `${roundNumber(value.coin1)} ETH / ${roundNumber(value.coin2)} SLICE`
              : details}
          </SummaryCardDetails>
        </SummaryCardContainer>
      )}
    </SummaryCardWrapper>
  );
};

export default SummaryCard;
