import React, { useState, useEffect } from 'react';
import { PagesData } from 'config';
import { roundNumber } from 'utils';
import {
  SummaryCardWrapper,
  SummaryCardContainer,
  SummaryCardTitle,
  SummaryCardValue,
  SummaryCardDetails
} from './styles/SummaryComponents';

const SummaryCard = ({
  title,
  value,
  type,
  details,
  path
}) => {
  return (
    <div>
      <SummaryCardWrapper color={PagesData[path].cardColor}>
        {value || value === 0 ? (
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

              <div></div>
            </SummaryCardValue>

            <SummaryCardDetails>
              {type === 'loan' && path !== 'stake'
                ? value.total + ' Loan Positions'
                : type === 'collateral' && path !== 'stake'
                ? `${roundNumber(value.coin1)} ETH`
                : details}
            </SummaryCardDetails>
          </SummaryCardContainer>
        ) : (
          <SummaryCardContainer loading>
            <div></div>
            <div></div>
            <div></div>
          </SummaryCardContainer>
        )}
      </SummaryCardWrapper>
    </div>
  );
};

export default SummaryCard;