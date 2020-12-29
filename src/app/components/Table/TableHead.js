import React, { useState } from "react";
import { connect } from 'react-redux';
import { downChevron, upChevron } from 'assets';
import {
    changeSorting
  } from 'redux/actions/loans';
import {
    TableHeadWrapper,
    TableHeadTitle,
    SortChevronWrapper,
} from './styles/TableComponents';


const TableHead = ({handleSorting, changeSorting, loans: {sort}, path}) => {

    const [order, setOrder] = useState("asc")

    const sortLoans = (val) => {
        let sortObj = {
            name: val,
            type: order
        };
        changeSorting(sortObj);
        setOrder(order === "asc" ? "desc" : "asc")
    }
    return (
        <TableHeadWrapper path={path}>
            <TableHeadTitle className="address-wrapper" defaultCursor={true}>
                <div className="address-title-content">
                    <h2>{path === "trade" ? "INSTRUMENT" : "Address"}</h2> 
                </div>
            </TableHeadTitle>
            <TableHeadTitle className="remaining-wrapper">
                <div className={path === "trade" ? "value-title-content" : "remaining-title-content"} onClick={() => sortLoans("remainingLoan")}>
                    <h2>{path === "trade" ? "LOAN(S) VALUE" : "Amount"}</h2>
                    <SortChevronWrapper>
                        <img src={upChevron} alt="upChevron"/>
                        <img src={downChevron} alt="downChevron"/>
                    </SortChevronWrapper>
                </div>
            </TableHeadTitle>
            <TableHeadTitle className={path === "trade" ? "return-wrapper" : "ratio-wrapper" }>
                <div className={path === "trade" ? "return-title-content" : "ratio-title-content"} onClick={() => sortLoans("collateralRatio")}>
                    <h2>{path === "trade" ? "RETURN/BLOCK" : "Ratio"}</h2>
                    <SortChevronWrapper>
                        <img src={upChevron} alt="upChevron"/>
                        <img src={downChevron} alt="downChevron"/>
                    </SortChevronWrapper>
                </div>
            </TableHeadTitle>
            <TableHeadTitle className={path === "trade" ? "subscription-wrapper" : "interest-paid-wrapper"}>
                <div className={path === "trade" ? "subscription-title-content" : "interest-paid-title-content"} onClick={() => sortLoans("interestPaid")}>
                    <h2>{path === "trade" ? "SUBSCRIPTION" : "Rate/Payout"}</h2>
                    <SortChevronWrapper>
                        <img src={upChevron} alt="upChevron"/>
                        <img src={downChevron} alt="downChevron"/>
                    </SortChevronWrapper>
                </div>
            </TableHeadTitle>
            <TableHeadTitle className="status-wrapper">
                <div className={path === "trade" ? "bondApy-title-content" : "status-title-content"} onClick={() => sortLoans("status")}>
                    <h2>{path === "trade" ? "BOND APY" : "Status"}</h2>
                    <SortChevronWrapper>
                        <img src={upChevron} alt="upChevron"/>
                        <img src={downChevron} alt="downChevron"/>
                    </SortChevronWrapper>
                </div>
            </TableHeadTitle>
            <TableHeadTitle className="head-btns-wrapper">

            </TableHeadTitle>
        </TableHeadWrapper>  
    );
}
const mapStateToProps = (state) => {
    return {
      loans: state.loans,
      path: state.path
    };
  };
  
export default connect(mapStateToProps, {
    changeSorting
})(TableHead);
  