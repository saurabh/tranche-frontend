import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { downChevron, upChevron, ChevronDown } from 'assets';
import { useOuterClick } from 'services/useOuterClick'

import {
    changeSorting
  } from 'redux/actions/LoansTranchesData';
import {
    TableHeadWrapper,
    TableHeadTitle,
    SortChevronWrapper,
    SortingMenu,
    TableMarketsSortingDropdown,
    TableMarketsSortingDropdownContent,
    TableMarketSortingBtn,
    TableSubTitle,
    TableColMobile,
    TableHeadWrapperMobile,
    TableHeadTitleMobile
} from './styles/TableComponents';


const TableHead = ({changeSorting, path}) => {

    const [order, setOrder] = useState("asc")
    const [menu, toggleMenu] = useState(false);
    const [isDesktop, setDesktop] = useState(window.innerWidth > 1200);


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
    const updateMedia = () => {
        setDesktop(window.innerWidth > 1200);
    };

    useEffect(() => {
        window.addEventListener('resize', updateMedia);
        return () => window.removeEventListener('resize', updateMedia);
    });
    

    const TableHeadDesktop = () => {
        return (
            <TableHeadWrapper path={path}>
                <TableHeadTitle className="address-wrapper" defaultCursor={true}>
                    <div className="address-title-content">
                        <h2>{(path === "lend" || path === "borrow") ? "Address" : path === "staking" ? "STAKING POOL" :  "INSTRUMENT"}</h2>
                    </div>
                </TableHeadTitle>
                <TableHeadTitle className="remaining-wrapper">
                    <div className={path !== "earn" ? "remaining-title-content" : "tranche-size-content"} onClick={() => sortLoans(path !== "earn" ? "remainingLoan" : "amount")}>
                        <h2>{(path === "lend" || path === "borrow") ? "Amount" : path === "staking" ? "staked" : "TRANCHE SIZE"}</h2>
                        <SortChevronWrapper>
                            <img src={upChevron} alt="upChevron"/>
                            <img src={downChevron} alt="downChevron"/>
                        </SortChevronWrapper>
                    </div>
                </TableHeadTitle>
                <TableHeadTitle className={path !== "earn" ? "ratio-wrapper" : "return-wrapper"}>
                    <div className={path !== "earn" ? "ratio-title-content" : "return-content"} onClick={() => sortLoans(path !== "earn" ? "collateralRatio" : "rpbRate")}>
                        <h2>{(path === "lend" || path === "borrow") ? "Ratio" : path === "staking" ? "accru" : "RETURN/BLOCK"}</h2>
                        <SortChevronWrapper>
                            <img src={upChevron} alt="upChevron"/>
                            <img src={downChevron} alt="downChevron"/>
                        </SortChevronWrapper>
                    </div>
                </TableHeadTitle>
                <TableHeadTitle className={path !== "earn" ? "interest-paid-wrapper" : "subscription-wrapper"}>
                    <div className={path !== "earn" ? "interest-paid-title-content" : "subscription-title-content"} onClick={() => sortLoans(path !== "earn" ? "interestPaid" : "subscriber")}>
                        <h2>{(path === "lend" || path === "borrow") ? "Rate/Payout" : path === "staking" ? "REWARD/BLOCK" : "SUBSCRIPTION"}</h2>
                        <SortChevronWrapper>
                            <img src={upChevron} alt="upChevron"/>
                            <img src={downChevron} alt="downChevron"/>
                        </SortChevronWrapper>
                    </div>
                </TableHeadTitle>
                <TableHeadTitle className="status-wrapper">
                    <div className={path !== "earn" ? "status-title-content" : "apy-content"}  onClick={() => sortLoans("displayPriority")}>
                        <h2>{(path === "lend" || path === "borrow" || path === "staking") ? "Status" : "BOND APY"}</h2>
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
    const TableHeadMobile = () => {
        return (
            <TableHeadWrapperMobile path={path}>
                <TableColMobile address>
                    <TableHeadTitleMobile defaultCursor={true} address>
                        <h2>{(path === "lend" || path === "borrow") ? "Address" : path === "staking" ? "STAKING POOL"  : "INSTRUMENT"}</h2>
                    </TableHeadTitleMobile>
                </TableColMobile>
                <TableColMobile>
                    <TableHeadTitleMobile>
                        <h2 onClick={() => sortLoans(path !== "earn" ? "remainingLoan" : "amount")}>{(path === "lend" || path === "borrow") ? "Amount" : path === "staking" ? "staked" : "SIZE"}</h2>
                    </TableHeadTitleMobile>
                </TableColMobile>
                <TableColMobile>
                    <TableHeadTitleMobile>
                        <h2 onClick={() => sortLoans(path !== "earn" ? "remainingLoan" : "rpbRate")}>{(path === "lend" || path === "borrow") ? "Ratio" : path === "staking" ? "REWARD / BLOCK"  : "RETURN"}</h2>
                    </TableHeadTitleMobile>
                </TableColMobile>
                <TableColMobile>
                    <TableHeadTitleMobile>
                        <h2 onClick={() => sortLoans(path !== "earn" ? "remainingLoan" : "subscriber")}>{(path === "lend" || path === "borrow") ? "Rate/Payout" : path === "staking" ? "accrued"  : "SUBSCRIPTION"}</h2>
                    </TableHeadTitleMobile>
                </TableColMobile>
                <TableColMobile btn>
                    <TableHeadTitleMobile>

                    </TableHeadTitleMobile>
                </TableColMobile>
            </TableHeadWrapperMobile>  
        );
    }
    return isDesktop ? TableHeadDesktop() : TableHeadMobile();

    
}
const mapStateToProps = (state) => {
    return {
      path: state.path
    };
  };
  
export default connect(mapStateToProps, {
    changeSorting
})(TableHead);
  