import React from "react";
import Create from "assets/images/svg/create.svg";
import {
    TableContainerHeader,
    TableTitle,
    TableSubTitle,
    CreateLoadBtn
  } from './styles/TableComponents';

const TableHeader = ({HandleNewLoan, path, filter}) => {
    return (
        <TableContainerHeader>
            <div className="table-header-titles">
                <TableTitle>
                {   path === "earn" ?
                    <h2>Earning Assets</h2> :
                    <h2>Open Loans</h2>
                }
                </TableTitle>
                <TableSubTitle>
                    <h2>{`${filter === null ? 'All': filter} Markets`}</h2>
                </TableSubTitle>
            </div>

            <div className="create-loan-wrapper">
                {   path !== "earn" ?
                    <CreateLoadBtn>
                        <button onClick={HandleNewLoan}><img src={Create} alt="Create"/> <span>New loan</span></button>
                    </CreateLoadBtn> : ""
                }
                
            </div>
        </TableContainerHeader>
    );
}

export default TableHeader;