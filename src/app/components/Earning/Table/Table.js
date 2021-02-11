import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Pagination from 'react-paginating';
import _ from 'lodash';
import {
  tranchesFetchData,
  changeFilter,
  paginationOffset,
  paginationCurrent,
  changeSorting,
  changeOwnAllFilter
} from 'redux/actions/tranches';
import {
  ownAllToggle
} from 'redux/actions/trade';
import ReactLoading from 'react-loading';


import { changePath } from 'redux/actions/TogglePath';
import TableHeader from '../../Table/TableHeader';
import TableHeadMobile from '../../Table/TableHeadMobile';
import TableHead from '../../Table/TableHead';
import TableCard from './TableCard';
import TableCardMobile from './TableCardMobile';
import { TableWrapper, TableContentCard,
  CallToActionTradeWrapper,
  CallToActionTradeBtns,
  CallToActionTradeBtn,
  CallToActionTradetext,
  TableMobileFiltersWrapper,
  TableMobileFilterRow,
  TableMobileFiltersMenu,
  TableMobileFilter,
  TableMobileFiltersText,
  TableMobileRowCreateLoan
} from '../../Table/styles/TableComponents';
import { EmptyBox, FilterChevron, CreateLoan } from 'assets';
const style = {
  pageItem: {
    fontFamily: 'Roboto, sans-serif',
    background: 'transparent',
    border: 'none',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '12px',
    letterSpacing: '.02em',
    textRransform: 'uppercase',
    color: '#BEBEBE',
    cursor: 'pointer',
    padding: '7px 12px'
  },
  pageItemActive: {
    color: '#DADADA',
    backgroundColor: '#FAF8FF',
    borderColor: '#FAF8FF',
    borderRadius: '7px'
  }
};

const Table = ({
  HandleNewLoan,
  tranchesFetchData,
  changeOwnAllFilter,
  tranches,
  path,
  trade: { tradeType },
  changePath,
  paginationOffset,
  paginationCurrent,
  ethereum: { address },
  ownAllToggle
}) => {
  const { pathname } = useLocation();
  const pageCount = 5;
  const { filter, skip, limit, current, filterType, sort, isLoading } = tranches;
  const [openFilterMenu, setOpenFilterMenu] = useState(false);
  const [currentFilter, setCurrentFilter] = useState("All tranches");
  let parsedPath = pathname.split('/');
  let currentPath = parsedPath[parsedPath.length - 1];

  const trancheListing = useCallback(_.debounce(async () => {
    if (sort) {
      await tranchesFetchData({
        sort,
        skip,
        limit,
        filter: {
          address: path === 'earn' && tradeType === "own" ? address : undefined,
          type: filter //ETH/JNT keep these in constant file
        }
      });
    } else {
      await tranchesFetchData({
        skip,
        limit,
        filter: {
          address: path === 'earn' && tradeType === "own" ? address : undefined,
          type: filter //ETH/JNT keep these in constant file
        }
      });
    }
    
  }, 3000, {leading: true}), [tranchesFetchData, filter, skip, limit, sort, address, tradeType]);

  useEffect(() => {
    changePath(currentPath);
    changeOwnAllFilter('all');
    ownAllToggle("allTranches");
  }, [changePath, pathname, currentPath, changeOwnAllFilter, ownAllToggle]);

  useEffect(() => {
    trancheListing();
  }, [trancheListing, filter, skip, limit, filterType, sort]);

  const handlePageChange = (p) => {
    paginationOffset((p - 1) * limit);
    paginationCurrent(p);
  };
  const changeLoansFilter = useCallback(
    (filter) => {
      changeOwnAllFilter(filter);
      let val = filter === "own" ? "My tranches" : filter === "all" ? "All tranches" : "";
      setCurrentFilter(val);
      setOpenFilterMenu(false);
    },
    [changeOwnAllFilter]
  );

  const changeOwnAllFilterHandler = (val) => {
    ownAllToggle(val);
    changeLoansFilter(val);
  }


  const handleSorting = () => {
    trancheListing();
  };

  return (
    <div className='container content-container'>
      <div className='TableContentWrapper'>
      <TableMobileFiltersWrapper  width={path === "borrow" ? "80%" : "100%"}>
        <TableMobileFilterRow>
          <TableMobileFilter onClick={() => setOpenFilterMenu(!openFilterMenu)}>  
            <TableMobileFiltersText>{currentFilter}</TableMobileFiltersText>
            <img alt="filter" src={FilterChevron} />
          </TableMobileFilter>
          { path === "borrow" ?
            <TableMobileRowCreateLoan>
              <button onClick={HandleNewLoan}><img src={CreateLoan} alt="" /></button>
            </TableMobileRowCreateLoan> : ""
          }
        </TableMobileFilterRow>

        <TableMobileFiltersMenu className={openFilterMenu ? "" : "hideMenu"}>
          <TableMobileFilter menu onClick={() => changeOwnAllFilterHandler('all')}>
            <TableMobileFiltersText>All tranches</TableMobileFiltersText>
          </TableMobileFilter>
          <TableMobileFilter menu onClick={() => changeOwnAllFilterHandler('own')}>
            <TableMobileFiltersText>My tranches</TableMobileFiltersText>
          </TableMobileFilter>
        </TableMobileFiltersMenu>
      </TableMobileFiltersWrapper>
      <TableWrapper mobile>
          <TableHeadMobile />
          <div className='table-content'>
              {isLoading ? (
                <div>
                  <TableContentCard>
                    <ReactLoading
                      className='TableMoreLoading'
                      type={'bubbles'}
                      color='rgba(56,56,56,0.3)'
                    />
                  </TableContentCard>
                </div>
              ) 
                
              :
              
              (
                tranches && tranches.list.map((tranche, i) => <TableCardMobile key={i} tranche={tranche} path={path} />)
              )}
            </div>
        </TableWrapper>
        <TableWrapper desktop>
          <TableHeader HandleNewLoan={HandleNewLoan} path={path} filter={filter} />
          <div className='table-container'>
            <TableHead handleSorting={(name, type) => handleSorting(name, type)} />
            <div className='table-content'>
                {
                    isLoading ? <div>
                      {
                      [...Array(5)].map((i, idx) =>

                      <TableContentCard key={idx}>
                        <div className="loadingCard">
                          <div className="loadingFirstCol">
                            <div className="loadingFirslColContent">
                              <div className="loadingAvatar loadingContent "></div>
                              <div className="loadingText loadingContentWrapper loadingContent">
                              </div>
                            </div>
                          </div>
                          <div className="loadingSecondCol">
                            <div className="loadingContentCol loadingContentWrapper loadingContent"></div>
                          </div>
                          <div className="loadingFifthCol">
                            <div className="loadingFifthColContent loadingContentWrapper loadingContent"></div>
                          </div>
                          <div className="loadingSixthCol">
                            <div className="loadingSixthColContent loadingContentWrapper loadingContent"></div>
                          </div>
                        </div>
                      </TableContentCard>)
                      }
                      
                  
                      </div> : (!isLoading && tradeType === 'sell' && tranches.list.length === 0) ?
                  // </div> : (!isLoading && loans.list.length === 0 && tradeType === 'sell') ?

                          <TableContentCard pointer={false}>

                            <CallToActionTradeWrapper>
                              <img src={EmptyBox} alt="EmptyBox"/>
                              
                              <CallToActionTradetext>
                                <h2>You don’t have any loans, assets or instruments to sell.</h2>
                                <h2>Buy a tranche or provide a loan to get started!</h2>
                              </CallToActionTradetext>

                              <CallToActionTradeBtns>

                                <CallToActionTradeBtn type="loans">BROWSE <span>LOANS</span></CallToActionTradeBtn>
                                <CallToActionTradeBtn>BROWSE <span>TRANCHES</span></CallToActionTradeBtn>

                              </CallToActionTradeBtns>

                            </CallToActionTradeWrapper>

                          </TableContentCard>
                  
                  : tranches && tranches.list.map((tranche, i) => <TableCard key={i} tranche={tranche} path={path} />)
                  }
            </div>
          </div>
        </TableWrapper>

        {tranches && tranches.count > limit ? (
          <div className='paginationWrapper'>
            <Pagination
              total={tranches && tranches.count}
              limit={limit}
              pageCount={pageCount}
              currentPage={parseInt(current, 10)}
            >
              {({
                pages,
                currentPage,
                hasNextPage,
                hasPreviousPage,
                previousPage,
                nextPage,
                totalPages,
                getPageItemProps
              }) => (
                <div>
                  <a
                    {...getPageItemProps({
                      pageValue: 1,
                      onPageChange: () => handlePageChange(1),
                      className: 'first',
                      style: style.pageItem
                    })}
                  >
                    First
                  </a>

                  {hasPreviousPage && (
                    <a
                      {...getPageItemProps({
                        pageValue: previousPage,
                        onPageChange: (previousPage) => handlePageChange(previousPage),
                        className: 'first',
                        style: style.pageItem
                      })}
                    >
                      {'<'}
                    </a>
                  )}

                  {pages.map((page) => {
                    let activePage = {};
                    if (currentPage === page) {
                      activePage = style.pageItemActive;
                    }
                    return (
                      <a
                        {...getPageItemProps({
                          key: page,
                          pageValue: page,
                          onPageChange: (page) => handlePageChange(page),
                          className: 'first',
                          style: { ...style.pageItem, ...activePage }
                        })}
                      >
                        {page}
                      </a>
                    );
                  })}

                  {hasNextPage && (
                    <a
                      {...getPageItemProps({
                        pageValue: nextPage,
                        onPageChange: (nextPage) => handlePageChange(nextPage),
                        className: 'first',
                        style: style.pageItem
                      })}
                    >
                      {'>'}
                    </a>
                  )}

                  <a
                    {...getPageItemProps({
                      pageValue: totalPages,
                      onPageChange: (totalPages) => handlePageChange(totalPages),
                      className: 'first',
                      style: style.pageItem
                    })}
                  >
                    Last
                  </a>
                </div>
              )}
            </Pagination>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    ethereum: state.ethereum,
    tranches: state.tranches,
    trade: state.trade,
    path: state.path
  };
};

export default connect(mapStateToProps, {
  tranchesFetchData,
  changePath,
  changeFilter,
  paginationOffset,
  paginationCurrent,
  changeSorting,
  changeOwnAllFilter,
  ownAllToggle
})(Table);