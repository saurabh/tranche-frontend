import React from 'react';
import { LinkArrow } from 'assets';
import { etherScanUrl } from 'config/constants';
import { statuses, events } from 'config/constants';
import { MoreRowSpan } from './styles/TableComponents';
import { roundBasedOnUnit, gweiOrEther } from 'utils/helperFunctions';

const TableMoreRow = ({
  ratio,
  hash,
  collateralTypeName,
  cryptoFromLenderName,
  amount,
  amountMetaData,
  status,
  createdAt,
  eventName
}) => {
  const searchObj = (val) => {
    return Object.fromEntries(
      Object.entries(statuses).filter(([key, value]) => value.status === val)
    );
  };

  return (
    <div className='table-more-row'>
      <div className='table-more-row-first flex table-more-row-content'>
        <div className='table-more-row-first-content flex'>
          <h2>{createdAt ? createdAt.substring(0, createdAt.length - 5) : ''}</h2>
          <a className='flex' href={etherScanUrl + 'tx/' + hash} target='_blank' rel='noopener noreferrer'>
            <img src={LinkArrow} alt='' />
          </a>
        </div>
      </div>
      <div className='table-more-row-second table-more-second-4 table-more-row-content'>
        <div className='table-more-row-second-content'>
          <h2 className='t-a-c'>            
            {eventName === events['APPROVE_LOAN'].toLowerCase()
              ? roundBasedOnUnit(amount, collateralTypeName) + " " + gweiOrEther(amount, cryptoFromLenderName)
              : eventName === events['TRANCHE_ADDED'].toLowerCase() 
              ? roundBasedOnUnit(amountMetaData, collateralTypeName) + "%"
              : roundBasedOnUnit(amount, collateralTypeName) + " " + gweiOrEther(amount, collateralTypeName)}
          </h2>
        </div>
      </div>
      <div className='table-more-row-third table-more-second-4 table-more-row-content'>
        <div className='table-more-row-third-content'>
          <h2 className='t-a-c'>{ratio}%</h2>
        </div>
      </div>
      <div className='table-more-row-fourth table-more-second-4 table-more-row-content'>
        <div className='table-more-row-fourth-content'></div>
      </div>
      <div className='table-more-row-fifth table-more-second-4 table-more-row-content'>
        <div className='table-more-row-fifth-content flex'>
          <MoreRowSpan color={Object.values(searchObj(parseInt(status)))[0].color}>•</MoreRowSpan>
          <h2>
            {eventName === events['LOAN_CREATED'].toLowerCase()
              ? 'Loan Requested'
              : eventName === events['NEW_LOAN_STATUS'].toLowerCase()
              ? 'Status Changed'
              : eventName === events['APPROVE_LOAN'].toLowerCase()
              ? 'Loan Approved'
              : eventName === events['LOAN_CLOSING_BORROWER'].toLowerCase()
              ? 'Loan Closing'
              : eventName === events['FORECLOSING'].toLowerCase()
              ? 'Loan Foreclosing'
              : eventName === events['FORECLOSED'].toLowerCase()
              ? 'Loan Foreclosed'
              : eventName === events['LOAN_CANCEL'].toLowerCase()
              ? 'Loan Cancelled'
              : eventName === events['INTEREST_WITHDRAWN'].toLowerCase()
              ? 'Interest Withdrawal'
              : eventName === events['COLLATERAL_RECEIVED'].toLowerCase()
              ? 'Collateral Adjusted'
              : eventName === events['REMOVE_COLLATERAL'].toLowerCase()
              ? 'Collateral Adjusted'
              : eventName === events['APPROVE_LOAN_FEES'].toLowerCase()
              ? 'Platform Fees'
              : eventName === events['INITIATE_FORECLOSE_FEES'].toLowerCase()
              ? 'Closure Initiation Fee'
              : eventName === events['FORECLOSED_FEES'].toLowerCase()
              ? 'Foreclosure Fee'
              : eventName === events['EARLY_CLOSING_FEES'].toLowerCase()
              ? 'Early Closing Fee'
              : eventName === events['LOAN_CANCEL_FEES'].toLowerCase()
              ? 'Loan Cancellation Fee'
              : eventName === events['INITIATE_FORECLOSE_REWARD'].toLowerCase()
              ? 'Closing Initiation Reward'
              : eventName === events['FORECLOSED_REWARD'].toLowerCase()
              ? 'Foreclosure Reward'
              : eventName === events['TRANCHE_ADDED'].toLowerCase() 
              ? 'Sold to Protocol'
              : 'N/A'}
          </h2>
        </div>
      </div>
      <div className='table-more-row-sixth table-more-second-4 table-more-row-content'></div>
    </div>
  );
};

export default TableMoreRow;
