import React, { useState } from "react";
import { connect } from 'react-redux';
import { downChevron, upChevron, ChevronDown } from 'assets';
import { useOuterClick } from 'services/useOuterClick'

import {
    changeSorting
  } from 'redux/actions/loans';
import {
    TableHeadWrapper,
    TableHeadTitle,
    SortChevronWrapper,
    SortingMenu,
    TableMarketsSortingDropdown,
    TableMarketsSortingDropdownContent,
    TableMarketSortingBtn,
    TableSubTitle
} from './styles/TableComponents';


const TableHead = ({changeSorting, loans: {sort}}) => {

    const [order, setOrder] = useState("asc")
    const [menu, toggleMenu] = useState(false);

    const innerRef = useOuterClick(e => {
        toggleMenu(false);
    });

    const sortLoans = (val) => {
        let sortObj = {
            name: val,
            type: order
        };
        changeSorting(sortObj);
        setOrder(order === "asc" ? "desc" : "asc")
    }
    const toggleSelectMarkets = () => {
        toggleMenu(!menu);
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
                        <img src={upChevron} alt="upChevron"/>
                        <img src={downChevron} alt="downChevron"/>
                    </SortChevronWrapper>
                </div>
            </TableHeadTitle>
            <TableHeadTitle className="ratio-wrapper">
                <div className="ratio-title-content" onClick={() => sortLoans("collateralRatio")}>
                    <h2>Ratio</h2>
                    <SortChevronWrapper>
                        <img src={upChevron} alt="upChevron"/>
                        <img src={downChevron} alt="downChevron"/>
                    </SortChevronWrapper>
                </div>
            </TableHeadTitle>
            <TableHeadTitle className="interest-paid-wrapper">
                <div className="interest-paid-title-content" onClick={() => sortLoans("interestPaid")}>
                    <h2>Rate/Payout</h2>
                    <SortChevronWrapper>
                        <img src={upChevron} alt="upChevron"/>
                        <img src={downChevron} alt="downChevron"/>
                    </SortChevronWrapper>
                </div>
            </TableHeadTitle>
            <TableHeadTitle className="status-wrapper">
                <div className="status-title-content" onClick={() => sortLoans("displayPriority")}>
                    <h2>Status</h2>
                    <SortChevronWrapper>
                        <img src={upChevron} alt="upChevron"/>
                        <img src={downChevron} alt="downChevron"/>
                    </SortChevronWrapper>
                </div>
            </TableHeadTitle>
            <TableHeadTitle className="head-btns-wrapper">

            </TableHeadTitle>
            <SortingMenu>
                <TableSubTitle ref={innerRef} onClick={() => toggleSelectMarkets()} sorting={true}>
                    <h2>Sort <img src={ChevronDown} alt="img"/> </h2>
                </TableSubTitle>
                {   menu ?

                 <TableMarketsSortingDropdown sorting={true}>
                        <TableMarketsSortingDropdownContent>
                            <TableMarketSortingBtn onClick={() => sortLoans("remainingLoan")}>
                                Amount
                            </TableMarketSortingBtn>
                            <TableMarketSortingBtn onClick={() => sortLoans("remainingLoan")}>
                                Ratio
                            </TableMarketSortingBtn>
                            <TableMarketSortingBtn onClick={() => sortLoans("interestPaid")}>
                                Rate/Payout
                            </TableMarketSortingBtn>
                            <TableMarketSortingBtn onClick={() => sortLoans("displayPriority")}>
                                Status
                            </TableMarketSortingBtn>
                        </TableMarketsSortingDropdownContent>
                    </TableMarketsSortingDropdown>  : ""
                }
            </SortingMenu>
        </TableHeadWrapper>  
    );
}
const mapStateToProps = (state) => {
    return {
      loans: state.loans,
    };
  };
  
export default connect(mapStateToProps, {
    changeSorting
})(TableHead);
  