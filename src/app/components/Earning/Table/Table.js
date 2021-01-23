import React, { useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Pagination from 'react-paginating';
import {
  loansFetchData,
  changeFilter,
  paginationOffset,
  paginationCurrent,
  changeSorting,
  changeOwnAllFilter
} from 'redux/actions/loans';
import {
  sellBuyToggle
} from 'redux/actions/trade';


import { changePath } from 'redux/actions/TogglePath';
import TableHeader from '../../Table/TableHeader';
import TableHead from '../../Table/TableHead';
import TableCard from './TableCard';
import { TableWrapper, TableContentCard,
  CallToActionTradeWrapper,
  CallToActionTradeBtns,
  CallToActionTradeBtn,
  CallToActionTradetext
} from '../../Table/styles/TableComponents';
import { EmptyBox } from 'assets';
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
  loansFetchData,
  changeOwnAllFilter,
  loans,
  path,
  trade: { tradeType },
  changePath,
  paginationOffset,
  paginationCurrent,
  ethereum: { address },
  sellBuyToggle
}) => {
  const { pathname } = useLocation();
  const pageCount = 5;
  const { filter, skip, limit, current, filterType, sort, isLoading } = loans;

  const loanListing = useCallback(async () => {
    if (sort) {
      await loansFetchData({
        sort,
        skip,
        limit,
        filter: {
          borrowerAddress: path === 'borrow' && filterType === 'own' ? address : undefined,
          lenderAddress: path === 'earn' && filterType === 'own' ? address : path === 'trade' && tradeType === "sell" ? address : undefined,
          type: filter //ETH/JNT keep these in constant file
        }
      });
    } else {
      await loansFetchData({
        skip,
        limit,
        filter: {
          borrowerAddress: path === 'borrow' && filterType === 'own' ? address : undefined,
          lenderAddress: path === 'earn' && filterType === 'own' ? address : path === 'trade' && tradeType === "sell" ? address : undefined,
          type: filter //ETH/JNT keep these in constant file
        }
      });
    }
  }, [loansFetchData, filter, skip, limit, filterType, sort, address, path, tradeType]);

  useEffect(() => {
    let currentPath = pathname.split('/')[1];
    changePath(currentPath);
    changeOwnAllFilter('all');
    sellBuyToggle("buy");
  }, [changePath, pathname, changeOwnAllFilter, sellBuyToggle]);

  useEffect(() => {
    loanListing();
  }, [loanListing, filter, skip, limit, filterType, sort]);

  const handlePageChange = (p) => {
    paginationOffset((p - 1) * limit);
    paginationCurrent(p);
  };

  const handleSorting = () => {
    loanListing();
  };

  return (
    <div className='container content-container'>
      <div className='TableContentWrapper'>
        <TableWrapper>
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
                      
                  
                      </div> : (!isLoading && tradeType === 'sell' && loans.list.length === 0) ?
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
                  
                  : loans && loans.list.map((loan, i) => <TableCard key={i} loan={loan} path={path} />)
                  }
            </div>
          </div>
        </TableWrapper>

        {loans && loans.count > limit ? (
          <div className='paginationWrapper'>
            <Pagination
              total={loans && loans.count}
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
    loans: state.loans,
    trade: state.trade,
    path: state.path
  };
};

export default connect(mapStateToProps, {
  loansFetchData,
  changePath,
  changeFilter,
  paginationOffset,
  paginationCurrent,
  changeSorting,
  changeOwnAllFilter,
  sellBuyToggle
})(Table);
