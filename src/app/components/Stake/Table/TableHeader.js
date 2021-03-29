import React, { useState } from "react";
import Create from "assets/images/svg/create.svg";
import ChevronDown from "assets/images/svg/chevronDown.svg";
import { connect } from 'react-redux';
import { changeFilter } from 'redux/actions/tableData';
import { useOuterClick } from 'services/useOuterClick'
import { ETH } from 'config/constants';
import {
    TableContainerHeader,
    TableHeaderTitles,
    TableTitle,
    TableSubTitle,
    CreateLoanBtn,
    TableMarketsSortingDropdown,
    TableMarketsSortingDropdownContent,
    TableMarketSortingBtn
  } from './styles/TableComponents';
import i18n from "app/components/locale/i18n";

const TableHeader = ({ HandleNewLoan, path, filter, changeFilter }) => {
    const [menu, toggleMenu] = useState(false);
    const [filterValue, setFilter] = useState(null);
    const innerRef = useOuterClick(e => {
        toggleMenu(false);
    });

    const loanListing = async (filter = null) => {
      setFilter(filter);
      changeFilter(filter);
      toggleMenu(false);
    };

    const toggleSelectMarkets = () => {
        toggleMenu(!menu);
    }

    return (
        <TableContainerHeader>
            <TableHeaderTitles>
                <TableTitle>
                {   path === "lend" ?
                    <h2>Earning Assets</h2> :
                    path === "borrow" ?
                    <h2>Open Loans</h2> : 
                    path === "stake" ?
                    <h2>{i18n.t('stake.table.tableHeader.title')}</h2> :
                    <h2>{i18n.t('tranche.table.tableHeader.title')}</h2>
                }
                </TableTitle>
                {
                    path !== "stake" && path !== "tranche" ?
                    <TableSubTitle ref={innerRef} onClick={() => toggleSelectMarkets()}>
                        <h2>{`${filterValue === null ? 'All': filterValue} Markets`} <img src={ChevronDown} alt=""/> </h2>
                    </TableSubTitle> : 
                    path === "tranche" ?
                    <TableSubTitle>
                    <h2>{i18n.t('tranche.table.tableHeader.subtitle')}</h2>
                    </TableSubTitle> :
                    <TableSubTitle>
                        <h2>{i18n.t('stake.table.tableHeader.subtitle')}</h2>
                    </TableSubTitle> 
                }

                {   menu ?
                    <TableMarketsSortingDropdown path={path}>
                        <TableMarketsSortingDropdownContent>
                            <TableMarketSortingBtn onClick={() => loanListing(null)}>
                                All Markets
                            </TableMarketSortingBtn>
                            <TableMarketSortingBtn onClick={() => loanListing(ETH)}>
                                ETH Markets
                            </TableMarketSortingBtn>
                        </TableMarketsSortingDropdownContent>
                    </TableMarketsSortingDropdown> : ""
                }


            </TableHeaderTitles>

            <div className="create-loan-wrapper">
                {   path === "borrow" ?
                    <CreateLoanBtn>
                        <button onClick={HandleNewLoan}><img src={Create} alt="Create"/> <span>New loan</span></button>
                    </CreateLoanBtn> : ""
                }
                
            </div>
        </TableContainerHeader>
    );
}

const mapStateToProps = (state) => {
    return {
      path: state.path,
    };
  };
  
export default connect(mapStateToProps, { changeFilter })(TableHeader);
