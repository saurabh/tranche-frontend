import React, { useState, useEffect } from "react";
import TableHeader from "./TableHeader";
import TableHead from "./TableHead";
import TableCard from "./TableCard";
import styled from "styled-components";
import LoanService from "services/loan.service";

const TableWrapper = styled.div`
  width: 100%;
  background: #ffffff;
  border: 1px solid #efefef;
  box-sizing: border-box;
  margin: 24px auto;
  border-radius: 12px;
`;

function Table({ HandleNewLoan }) {
  const [loanList, setLoanList] = useState([]);

  useEffect(() => {
    loanListing();
  }, []);

  const loanListing = async () => {
    const loanListResult = await LoanService.loanList({
      skip: 0,
      limit: 10000,
      filter: {
        type: null, //ETH/JNT keep these in constant file
      },
    });
    if (loanListResult && loanListResult.result) {
      const { list } = loanListResult.result;
      setLoanList(list);
    }
  };

  return (
    <div className="container content-container">
      <TableWrapper>
        <TableHeader HandleNewLoan={HandleNewLoan} />
        <div className="table-container">
          <TableHead />
          <div className="table-content">
            {loanList.map((loan, i) => (
              <TableCard key={i} loan={loan} />
            ))}
          </div>
        </div>
      </TableWrapper>
    </div>
  );
}
export default Table;
