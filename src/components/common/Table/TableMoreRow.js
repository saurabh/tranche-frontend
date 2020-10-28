import React from "react";
import { LinkArrow } from "assets";
import { etherScanUrl } from "config/constants";
import { statuses, events } from "config/constants";
import { addrShortener } from "utils";
import { MoreRowSpan } from "../Modals/ModalComponents";

const TableMoreRow = ({
  ethImg,
  arrow,
  ratio,
  hash,
  collateralTypeName,
  interest,
  status,
  createdAt,
  eventName,
}) => {
  const searchObj = (val) => {
    return Object.fromEntries(
      Object.entries(statuses).filter(([key, value]) => value.status === val)
    );
  };
  return (
    <div className="table-more-row">
      <div className="table-more-row-first table-more-row-content">
        {/*<div className="table-more-row-first-img">
                    <img src={ethImg} alt=""/>
                    <span className={arrow}></span>
                </div>*/}
        <div className="table-more-row-first-content">
          {/* <h2>apr 15, 2020 - 1:53 pm</h2>*/}
          <h2>{createdAt}</h2>
          <a
            href={etherScanUrl + "tx/" + hash}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={LinkArrow} alt="" />
          </a>
        </div>
      </div>
      <div className="table-more-row-second table-more-second-4 table-more-row-content">
        {/*<h2>12.85 <span>DAI</span></h2>*/}
      </div>
      <div className="table-more-row-third table-more-second-4 table-more-row-content">
        <div className="table-more-row-third-content">
          <h2>{ratio}%</h2>
        </div>
      </div>
      <div className="table-more-row-fourth table-more-second-4 table-more-row-content">
        <div className="table-more-row-fourth-content">
          <h2>
            {interest} <span>{collateralTypeName}</span>
          </h2>
        </div>
      </div>
      <div className="table-more-row-fifth table-more-second-4 table-more-row-content">
        <div className="table-more-row-fifth-content">
          <MoreRowSpan
            color={Object.values(searchObj(parseInt(status)))[0].color}
          >
            •
          </MoreRowSpan>
          <h2>
            {eventName === events["LOAN_CREATED_ETH"].toLowerCase()
              ? "Loan Requested"
              : eventName === events["LOAN_CREATED_TOKEN"].toLowerCase()
              ? "Loan Requested"
              : eventName === events["APPROVE_LOAN"].toLowerCase()
              ? "Loan Approved"
              : eventName === events["NEW_DEPOSIT_TOKEN"].toLowerCase()
              ? "Collateral Adjustment"
              : eventName === events["NEW_DEPOSIT_ETH"].toLowerCase()
              ? "Collateral Adjustment"
              : eventName === events["FORECLOSING"].toLowerCase()
              ? "Loan Foreclosing"
              : eventName === events["FORECLOSED"].toLowerCase()
              ? "Loan Foreclosed"
              : eventName === events["LOAN_CANCEL"].toLowerCase()
              ? "Loan Cancelled"
              : eventName === events["LOAN_CLOSING_BORROWER"].toLowerCase()
              ? "Loan Closing"
              : eventName === events["LOAN_CLOSED"].toLowerCase()
              ? "Loan Closed"
              : eventName === events["INTEREST_WITHDRAWN"].toLowerCase()
              ? "Interest Withdrawal"
              : eventName === events["REMOVE_COLLATERAL"].toLowerCase()
              ? "Collateral Removed"
              : "N/A"}
          </h2>
        </div>
      </div>
      <div className="table-more-row-sixth table-more-second-4 table-more-row-content"></div>
    </div>
  );
};

export default TableMoreRow;
