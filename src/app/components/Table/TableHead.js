import React, { useState } from "react";
import { downChevron, upChevron } from 'assets';
import {
    TableHeadWrapper,
    TableHeadTitle,
    SortChevronWrapper,
  } from './styles/TableComponents';


const TableHead = ({handleSorting}) => {

    const [order, setOrder] = useState("asc")

    const sortLoans = (val) => {
        handleSorting(val, order)
        setOrder(order === "asc" ? "desc" : "asc")
    }
    return (
        <TableHeadWrapper>
            <TableHeadTitle className="address-wrapper" defaultCursor={true}>
                <div className="address-title-content">
                    <h2>Address</h2>
                </div>
            </TableHeadTitle>
            <TableHeadTitle className="remaining-wrapper">
                <div className="remaining-title-content" onClick={() => sortLoans("remainingLoan")}>
                    <h2>Amount</h2>
                    <SortChevronWrapper>
                        <img src={upChevron} />
                        <img src={downChevron} />
                    </SortChevronWrapper>
                </div>
            </TableHeadTitle>
            <TableHeadTitle className="ratio-wrapper">
                <div className="ratio-title-content" onClick={() => sortLoans("collateralRatio")}>
                    <h2>Ratio</h2>
                    <SortChevronWrapper>
                        <img src={upChevron} />
                        <img src={downChevron} />
                    </SortChevronWrapper>
                </div>
            </TableHeadTitle>
            <TableHeadTitle className="interest-paid-wrapper">
                <div className="interest-paid-title-content" onClick={() => sortLoans("interestPaid")}>
                    <h2>Payout/Rate</h2>
                    <SortChevronWrapper>
                        <img src={upChevron}/>
                        <img src={downChevron}/>
                    </SortChevronWrapper>
                </div>
            </TableHeadTitle>
            <TableHeadTitle className="status-wrapper">
                <div className="status-title-content" onClick={() => sortLoans("status")}>
                    <h2>Status</h2>
                    <SortChevronWrapper>
                        <img src={upChevron}/>
                        <img src={downChevron}/>
                    </SortChevronWrapper>
                </div>
            </TableHeadTitle>
            <TableHeadTitle className="head-btns-wrapper">

            </TableHeadTitle>
        </TableHeadWrapper>  
    );
}

export default TableHead;