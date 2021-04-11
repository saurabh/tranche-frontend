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
} from '../../Stake/Table/styles/TableComponents';
import i18n from "app/components/locale/i18n";


const TableHead = ({ changeSorting, path, color }) => {

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
                <TableHeadTitle platform defaultCursor={true} color={color}>
                    <h2>{i18n.t('tranche.table.tableHead.platform')}</h2>
                </TableHeadTitle>
                <TableHeadTitle instrument defaultCursor={true} color={color}>
                    <h2>{i18n.t('tranche.table.tableHead.instrument')}</h2>
                </TableHeadTitle>
                <TableHeadTitle apy color={color}>
                    <h2>{i18n.t('tranche.table.tableHead.apy')}</h2>
                </TableHeadTitle>
                <TableHeadTitle totalValue color={color}>
                    <h2>TOTAL DEPOSITS</h2>
                </TableHeadTitle>
                <TableHeadTitle subscription color={color}>
                    <h2>MY DEPOSITS</h2>
                </TableHeadTitle>
                <TableHeadTitle status color={color}>
                    <h2>AVAILABLE TO DEPOSIT</h2>
                </TableHeadTitle>
                <TableHeadTitle trancheTableBtns color={color}>

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
                    <TableHeadTitleMobile defaultCursor={true} address color={color}>
                        <h2>INSTRUMENT</h2>
                    </TableHeadTitleMobile>
                </TableColMobile>
                <TableColMobile>
                    <TableHeadTitleMobile color={color}>
                        <h2 onClick={() => sortLoans(path !== "tranche" ? "remainingLoan" : "amount")}>APY</h2>
                    </TableHeadTitleMobile>
                </TableColMobile>
                <TableColMobile>
                    <TableHeadTitleMobile color={color}>
                        <h2 onClick={() => sortLoans(path !== "eatranchern" ? "remainingLoan" : "rpbRate")}>Value Locked</h2>
                    </TableHeadTitleMobile>
                </TableColMobile>
                <TableColMobile>
                    <TableHeadTitleMobile color={color}>
                        <h2 onClick={() => sortLoans(path !== "tranche" ? "remainingLoan" : "subscriber")}>SUBSCRIPTION</h2>
                    </TableHeadTitleMobile>
                </TableColMobile>
                <TableColMobile btn>
                    <TableHeadTitleMobile color={color}>

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
  