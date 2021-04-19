import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { ChevronDown } from 'assets';
import { useOuterClick } from 'services/useOuterClick'

import {
    changeSorting
} from 'redux/actions/tableData';
import {
    TableHeadWrapper,
    TableHeadTitle,
    SortingMenu,
    TableMarketsSortingDropdown,
    TableMarketsSortingDropdownContent,
    TableMarketSortingBtn,
    TableSubTitle,
    TableColMobile,
    TableHeadWrapperMobile,
    TableHeadTitleMobile
} from './styles/TableComponents';
import i18n from "app/components/locale/i18n";


const TableHead = ({changeSorting, path, color}) => {

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
                <TableHeadTitle defaultCursor={true} stakingPool color={color} stakingPoolStake>
                    <h2>{(path === "lend" || path === "borrow") ? "Address" : path === "stake" ? i18n.t('stake.table.tableHead.stakingPool') :  "INSTRUMENT"}</h2>
                </TableHeadTitle>
                <TableHeadTitle color={color} statusStake>
                    <h2>{(path === "lend" || path === "borrow" || path === "stake") ? i18n.t('stake.table.tableHead.status') : "BOND APY"}</h2>
                </TableHeadTitle>
                <TableHeadTitle color={color} staked>
                    <h2>{(path === "lend" || path === "borrow") ? "Amount" : path === "stake" ? i18n.t('stake.table.tableHead.staked') : "TRANCHE SIZE"}</h2>
                </TableHeadTitle>
                <TableHeadTitle color={color} reward>
                    <h2>{(path === "lend" || path === "borrow") ? "Ratio" : path === "stake" ? i18n.t('stake.table.tableHead.reward') : "RETURN/BLOCK"}</h2>
                </TableHeadTitle> 
                <TableHeadTitle color={color} APYStake>
                    <h2>{(path === "lend" || path === "borrow") ? "Rate/Payout" : path === "stake" ? "APY" : "SUBSCRIPTION"}</h2>
                </TableHeadTitle>
                <TableHeadTitle color={color} stakeCol>
                    <h2>Your stake</h2>
                </TableHeadTitle>
                <TableHeadTitle color={color} btnsStake>
                    <h2>manage STAKE</h2>
                </TableHeadTitle>


                <SortingMenu>
                    <TableSubTitle ref={innerRef} onClick={() => toggleSelectMarkets()} sorting={true}>
                        <h2>Sort <img src={ChevronDown} alt="img"/> </h2>
                    </TableSubTitle>
                    { menu ?

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
                    <TableHeadTitleMobile defaultCursor={true} address stakingPool color={color}>
                        <h2>{(path === "lend" || path === "borrow") ? "Address" : path === "stake" ? i18n.t('stake.table.tableHead.stakingPool') : "INSTRUMENT"}</h2>
                    </TableHeadTitleMobile>
                </TableColMobile>
                <TableColMobile>
                    <TableHeadTitleMobile color={color}>
                        <h2 onClick={() => sortLoans(path !== "tranche" ? "remainingLoan" : "amount")}>{(path === "lend" || path === "borrow") ? "Amount" : path === "stake" ? i18n.t('stake.table.tableHead.staked') : "SIZE"}</h2>
                    </TableHeadTitleMobile>
                </TableColMobile>
                <TableColMobile>
                    <TableHeadTitleMobile color={color}>
                        <h2 onClick={() => sortLoans(path !== "tranche" ? "remainingLoan" : "rpbRate")}>{(path === "lend" || path === "borrow") ? "Ratio" : path === "stake" ? i18n.t('stake.table.tableHead.reward') : "RETURN"}</h2>
                    </TableHeadTitleMobile>
                </TableColMobile>
                <TableColMobile>
                    <TableHeadTitleMobile color={color}>
                        <h2 onClick={() => sortLoans(path !== "tranche" ? "remainingLoan" : "subscriber")}>{(path === "lend" || path === "borrow") ? "Rate/Payout" : path === "stake" ? "APY"  : "SUBSCRIPTION"}</h2>
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
  