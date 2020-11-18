import React, { useState } from "react";
import Create from "assets/images/svg/create.svg";
import ChevronDown from "assets/images/svg/chevronDown.svg";
import { connect } from 'react-redux';
import { changeFilter } from 'redux/actions/loans';
import { ETH, JNT, PagesData } from 'config/constants';
import {
    TableContainerHeader,
    TableHeaderTitles,
    TableTitle,
    TableSubTitle,
    CreateLoadBtn,
    TableMarketsDropdown,
    TableMarketsDropdownContent,
    TableMarketBtn
  } from './styles/TableComponents';

const TableHeader = ({ HandleNewLoan, path, filter, changeFilter }) => {
    const [menu, toggleMenu] = useState(false);
    const [filterValue, setFilter] = useState(null);

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
                {   path === "earn" ?
                    <h2>Earning Assets</h2> :
                    <h2>Open Loans</h2>
                }
                </TableTitle>
                <TableSubTitle onClick={() => toggleSelectMarkets()}>
                    <h2>{`${filterValue === null ? 'All': filterValue} Markets`} <img src={ChevronDown} alt=""/> </h2>
                </TableSubTitle>
                {   menu ?
                    <TableMarketsDropdown>
                        <TableMarketsDropdownContent>
                            <TableMarketBtn onClick={() => loanListing(null)}>
                                All Markets
                            </TableMarketBtn>
                            <TableMarketBtn onClick={() => loanListing(ETH)}>
                                ETH Markets
                            </TableMarketBtn>
                            <TableMarketBtn onClick={() => loanListing(JNT)}>
                                JNT Markets
                            </TableMarketBtn>
                        </TableMarketsDropdownContent>
                    </TableMarketsDropdown> : ""
                }
                
            </TableHeaderTitles>

            <div className="create-loan-wrapper">
                {   path !== "earn" ?
                    <CreateLoadBtn>
                        <button onClick={HandleNewLoan}><img src={Create} alt="Create"/> <span>New loan</span></button>
                    </CreateLoadBtn> : ""
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