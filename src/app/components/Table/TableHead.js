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


const TableHead = ({changeSorting, path}) => {

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
        <TableHeadWrapper path={path}>
            <TableHeadTitle className="address-wrapper" defaultCursor={true}>
                <div className="address-title-content">
                    <h2>{path !== "earn" ? "Address" : "INSTRUMENT"}</h2>
                </div>
            </TableHeadTitle>
            <TableHeadTitle className="remaining-wrapper">
                <div className={path !== "earn" ? "remaining-title-content" : "tranche-size-content"} onClick={() => sortLoans(path !== "earn" ? "remainingLoan" : "amount")}>
                    <h2>{path !== "earn" ? "Amount" : "TRANCHE SIZE"}</h2>
                    <SortChevronWrapper>
                        <img src={upChevron} alt="upChevron"/>
                        <img src={downChevron} alt="downChevron"/>
                    </SortChevronWrapper>
                </div>
            </TableHeadTitle>
            <TableHeadTitle className="ratio-wrapper">
                <div className={path !== "earn" ? "ratio-title-content" : "return-content"} onClick={() => sortLoans(path !== "earn" ? "collateralRatio" : "rpbRate")}>
                    <h2>{path !== "earn" ? "Ratio" : "RETURN/BLOCK"}</h2>
                    <SortChevronWrapper>
                        <img src={upChevron} alt="upChevron"/>
                        <img src={downChevron} alt="downChevron"/>
                    </SortChevronWrapper>
                </div>
            </TableHeadTitle>
            <TableHeadTitle className={path !== "earn" ? "interest-paid-wrapper" : "subscription-wrapper"}>
                <div className={path !== "earn" ? "interest-paid-title-content" : "subscription-title-content"} onClick={() => sortLoans(path !== "earn" ? "interestPaid" : "subscriber")}>
                    <h2>{path !== "earn" ? "Rate/Payout" : "SUBSCRIPTION"}</h2>
                    <SortChevronWrapper>
                        <img src={upChevron} alt="upChevron"/>
                        <img src={downChevron} alt="downChevron"/>
                    </SortChevronWrapper>
                </div>
            </TableHeadTitle>
            <TableHeadTitle className="status-wrapper">
                <div className={path !== "earn" ? "status-title-content" : "apy-content"}  onClick={() => sortLoans("displayPriority")}>
                    <h2>{path !== "earn" ? "Status" : ""}</h2>
                    {/* <h2>{path !== "earn" ? "Status" : "BOND APY"}</h2> */}
                    {path !== "earn" ?
                        <SortChevronWrapper>
                            <img src={upChevron} alt="upChevron"/>
                            <img src={downChevron} alt="downChevron"/>
                        </SortChevronWrapper> : ""
                    }
                    
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
      path: state.path
    };
  };
  
export default connect(mapStateToProps, {
    changeSorting
})(TableHead);
  