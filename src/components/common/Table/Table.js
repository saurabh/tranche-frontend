import React from 'react';
import TableHeader from "./TableHeader";
import TableHead from "./TableHead";
import TableCard from "./TableCard";
import styled from 'styled-components';

const TableWrapper = styled.div`
  width: 100%;
  background: #FFFFFF;
  border: 1px solid #EFEFEF;
  box-sizing: border-box;
  margin: 24px auto;
  border-radius: 12px;
`;
function Table({HandleNewLoan}){
  const number = 9;
  return (
    <div className="container content-container">
      <TableWrapper>
          <TableHeader HandleNewLoan={HandleNewLoan}/>
          <div className="table-container">
              <TableHead />
              <div className="table-content">
                {
                  [...Array(number)].map((card, i) => <TableCard key={i}/>)
                }
              </div>
          </div>
      </TableWrapper>
    </div>
  );
}
export default Table;