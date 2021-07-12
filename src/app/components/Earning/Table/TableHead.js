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
    TableHeadTitleMobile,
    TooltipWrapper
} from '../../Stake/Table/styles/TableComponents';
import i18n from "app/components/locale/i18n";
import { ModeThemes } from "config";


const TableHead = ({ changeSorting, path, color, theme }) => {

    const [order, setOrder] = useState("asc")
    const [TooltipToggle, setTooltipToggle] = useState("")
    const [menu, toggleMenu] = useState(false);
    const [isDesktop, setDesktop] = useState(window.innerWidth > 992);


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
    const tooltipToggle = (val) => {
        setTooltipToggle(val);
    }
    const updateMedia = () => {
        setDesktop(window.innerWidth > 992);
    };

    useEffect(() => {
        window.addEventListener('resize', updateMedia);
        return () => window.removeEventListener('resize', updateMedia);
    });
    

    const TableHeadDesktop = () => {
        return (
            <TableHeadWrapper path={path}>
                <TableHeadTitle platform defaultCursor={true} color={color} tranche>
                    <h2 onMouseOver={() => tooltipToggle("platform")} onMouseLeave={() => tooltipToggle("")}>{i18n.t('tranche.table.tableHead.platform')}</h2>
                    <TooltipWrapper tooltip={TooltipToggle === "platform"} platform color={ModeThemes[theme].Tooltip} language={i18n.language}>
                        <div>
                            <h2>{i18n.t('toolTips.table.platform')}</h2>
                        </div>
                    </TooltipWrapper>
                </TableHeadTitle>
                <TableHeadTitle apy color={color} tranche>
                    <h2 onMouseOver={() => tooltipToggle("apy")} onMouseLeave={() => tooltipToggle("")}>{i18n.t('tranche.table.tableHead.apy')}</h2>
                    <TooltipWrapper  tooltip={TooltipToggle === "apy"} apy color={ModeThemes[theme].Tooltip} language={i18n.language}>
                        <div>
                            <h2>{i18n.t('toolTips.table.netApy')}</h2>
                        </div>
                    </TooltipWrapper>
                </TableHeadTitle>
                <TableHeadTitle totalValue color={color} tranche>
                    <h2 onMouseOver={() => tooltipToggle("totalValue")} onMouseLeave={() => tooltipToggle("")}>{i18n.t('tranche.table.tableHead.totalDeposits')}</h2>
                    <TooltipWrapper tooltip={TooltipToggle === "totalValue"} totalValue color={ModeThemes[theme].Tooltip} language={i18n.language}>
                        <div>
                            <h2>{i18n.t('toolTips.table.totalDeposits')}</h2>
                        </div>
                    </TooltipWrapper>
                </TableHeadTitle>
                <TableHeadTitle subscription color={color} tranche>
                    <h2 onMouseOver={() => tooltipToggle("deposit")} onMouseLeave={() => tooltipToggle("")}>{i18n.t('tranche.table.tableHead.myDeposits')}</h2>
                    <TooltipWrapper tooltip={TooltipToggle === "deposit"} deposit color={ModeThemes[theme].Tooltip} language={i18n.language}>
                        <div>
                            <h2>{i18n.t('toolTips.table.myDeposits')}</h2>
                        </div>
                    </TooltipWrapper>
                </TableHeadTitle>
                <TableHeadTitle status color={color} tranche>
                    <h2 onMouseOver={() => tooltipToggle("available")} onMouseLeave={() => tooltipToggle("")}>{i18n.t('tranche.table.tableHead.available')}</h2>
                    <TooltipWrapper tooltip={TooltipToggle === "available"} available color={ModeThemes[theme].Tooltip} language={i18n.language}>
                        <div>
                            <h2>{i18n.t('toolTips.table.available')}</h2>
                        </div>
                    </TooltipWrapper>
                </TableHeadTitle>

               
                <TableHeadTitle trancheTableBtns color={color}>

                </TableHeadTitle>
            
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
      path: state.path,
      theme: state.theme
    };
  };
  
export default connect(mapStateToProps, {
    changeSorting
})(TableHead);
  