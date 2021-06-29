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
    TooltipWrapper
} from './styles/TableComponents';
import i18n from "app/components/locale/i18n";
import { ModeThemes } from "config";


const TableHead = ({changeSorting, path, color, theme, title}) => {

    const [order, setOrder] = useState("asc")
    const [menu, toggleMenu] = useState(false);
    const [TooltipToggle, setTooltipToggle] = useState("");
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
                <TableHeadTitle defaultCursor={true} stakingPool color={color} stakingPoolStake>
                    <h2 onMouseOver={() => tooltipToggle("stakingPool")} onMouseLeave={() => tooltipToggle("")}>{(path === "lend" || path === "borrow") ? "Address" : path === "stake" ? (title ===  "SLICE Staking Pools" ? i18n.t('stake.table.tableHead.stakingPool') : "Liquidity Provider Pool") :  "INSTRUMENT"}</h2>
                    {
                    title === "SLICE Staking Pools" &&
                    <TooltipWrapper tooltip={TooltipToggle === "stakingPool"} stakingPool color={ModeThemes[theme].Tooltip} language={i18n.language}>
                        <div>
                            <h2>Every pool has a different lock up duration</h2>
                        </div>
                    </TooltipWrapper>
                    }
                </TableHeadTitle>
                <TableHeadTitle color={color} statusStake sliceStaking={title === "SLICE Staking Pools"}>
                    <h2 onMouseOver={() => tooltipToggle("status")} onMouseLeave={() => tooltipToggle("")}>{(path === "lend" || path === "borrow" || path === "stake") ? (title ===  "SLICE Staking Pools" ? i18n.t('lockup') : ""): "BOND APY"}</h2>
                    {
                    title === "SLICE Staking Pools" &&
                    <TooltipWrapper tooltip={TooltipToggle === "status"} lockup status color={ModeThemes[theme].Tooltip} language={i18n.language}>
                        <div>
                            <h2>The total time your tokens will remain locked</h2>
                        </div>
                    </TooltipWrapper>
                    }
                </TableHeadTitle>
                <TableHeadTitle color={color} staked>
                    <h2 onMouseOver={() => tooltipToggle("staked")} onMouseLeave={() => tooltipToggle("")}>{(path === "lend" || path === "borrow") ? "Amount" : path === "stake" ? i18n.t('stake.table.tableHead.staked') : "TRANCHE SIZE"}</h2>
                    {
                    title === "SLICE Staking Pools" &&
                    <TooltipWrapper tooltip={TooltipToggle === "staked"} staked color={ModeThemes[theme].Tooltip} language={i18n.language}>
                        <div>
                            <h2>{i18n.t('toolTips.table.totalStaked')}</h2>
                        </div>
                    </TooltipWrapper>
                    }
                </TableHeadTitle>
                <TableHeadTitle color={color} reward>
                    <h2 onMouseOver={() => tooltipToggle("reward")} onMouseLeave={() => tooltipToggle("")}>{(path === "lend" || path === "borrow") ? "Ratio" : path === "stake" ? (title ===  "SLICE Staking Pools" ? i18n.t('poolCap') : i18n.t('stake.table.tableHead.reward')) : "RETURN/BLOCK"}</h2>
                    {
                    title === "SLICE Staking Pools" &&
                    <TooltipWrapper tooltip={TooltipToggle === "reward"} reward color={ModeThemes[theme].Tooltip} language={i18n.language}>
                        <div>
                            <h2>The total amount of tokens that can be locked at a certain time</h2>
                        </div>
                    </TooltipWrapper>
                    }
                </TableHeadTitle> 
                <TableHeadTitle color={color} APYStake>
                    <h2 onMouseOver={() => tooltipToggle("APY")} onMouseLeave={() => tooltipToggle("")}>{(path === "lend" || path === "borrow") ? "Rate/Payout" : path === "stake" ? i18n.t('stake.table.tableHead.apy') : "SUBSCRIPTION"}</h2>
                    {
                    title === "SLICE Staking Pools" &&
                    <TooltipWrapper tooltip={TooltipToggle === "APY"} APY color={ModeThemes[theme].Tooltip} language={i18n.language}>
                        <div>
                            <h2>{i18n.t('toolTips.table.apy')}</h2>
                        </div>
                    </TooltipWrapper>
                    }
                </TableHeadTitle>
                <TableHeadTitle color={color} stakeCol>
                    <h2 onMouseOver={() => tooltipToggle("yourStake")} onMouseLeave={() => tooltipToggle("")}>{i18n.t('stake.table.tableHead.yourStake')}</h2>
                    {
                    title === "SLICE Staking Pools" &&
                    <TooltipWrapper tooltip={TooltipToggle === "yourStake"} yourStake color={ModeThemes[theme].Tooltip} language={i18n.language}>
                        <div>
                            <h2>{i18n.t('toolTips.table.yourStake')}</h2>
                        </div>
                    </TooltipWrapper>
                    }
                </TableHeadTitle>
                <TableHeadTitle color={color} btnsStake sliceStaking={title === "SLICE Staking Pools"}>
                    <h2 onMouseOver={() => tooltipToggle("manageStake")} onMouseLeave={() => tooltipToggle("")}>{i18n.t('stake.table.tableHead.manageStake')}</h2>
                    {
                        title === "SLICE Staking Pools" &&
                        <TooltipWrapper sliceStaking={title === "SLICE Staking Pools"} tooltip={TooltipToggle === "manageStake"} manageStake color={ModeThemes[theme].Tooltip} language={i18n.language}>
                            <div>
                                <h2>Deposit your assets for the duration specified</h2>
                            </div>
                        </TooltipWrapper>
                    }
                    
                </TableHeadTitle>

            </TableHeadWrapper>  
        );
    }
    return TableHeadDesktop();

    
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
  