import React, { useEffect, useCallback, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import _ from 'lodash';
import ReactLoading from 'react-loading';
import Pagination from 'react-paginating';
import { useHistory } from "react-router-dom";
import {
  loansFetchData,
  changeFilter,
  paginationOffset,
  paginationCurrent,
  changeSorting,
  changeOwnAllFilter
} from 'redux/actions/loans';
import { changePath } from 'redux/actions/TogglePath';
import TableHeader from './TableHeader';
import TableHead from './TableHead';
import TableHeadMobile from './TableHeadMobile';
import TableCard from './TableCard';
import TableCardMobile from './TableCardMobile';
import { TableWrapper, TableContentCard, CallToActionWrapper,
  TableMobileFiltersWrapper,
  TableMobileFilter,
  TableMobileFiltersMenu,
  TableMobileFiltersText,
  TableMobileFilterRow,
  TableMobileRowCreateLoan
} from './styles/TableComponents';
import { RequestLoan, EarningAsset, FilterChevron, CreateLoan } from 'assets';

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
  changePath,
  changeFilter,
  paginationOffset,
  paginationCurrent,
  ethereum: { address }
}) => {
  const { pathname } = useLocation();
  const history = useHistory();
  const pageCount = 5;
  const { filter, skip, limit, current, filterType, sort, isLoading } = loans;
  const [openFilterMenu, setOpenFilterMenu] = useState(false);
  const [currentFilter, setCurrentFilter] = useState("All loans");

  const loanListing = useCallback(_.debounce(async () => {
    if (sort) {
      await loansFetchData({
        sort,
        skip,
        limit,
        filter: {
          borrowerAddress: path === 'borrow' && filterType === 'own' ? address : undefined,
          lenderAddress: path === 'earn' && filterType === 'own' ? address : undefined,
          type: filter
        }
      });
    } else {
      await loansFetchData({
        skip,
        limit,
        filter: {
          borrowerAddress: path === 'borrow' && filterType === 'own' ? address : undefined,
          lenderAddress: path === 'earn' && filterType === 'own' ? address : undefined,
          type: filter
        }
      });
    }
    //page.current = currentPage;
  }, 3000, {leading: true}), [loansFetchData, filter, skip, limit, filterType, sort, address, path]);

  const changeLoansFilter = useCallback(
    (filter) => {
      changeOwnAllFilter(filter);
      let val = filter === "own" ? "My loans" : filter === "all" ? "All loans" : "";
      setCurrentFilter(val);
      setOpenFilterMenu(false);
    },
    [changeOwnAllFilter]
  );

  useEffect(() => {
    let currentPath = pathname.split('/')[1];
    changePath(currentPath);
    changeOwnAllFilter('all');
  }, [changePath, pathname, changeOwnAllFilter]);

  useEffect(() => {
    loanListing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, skip, limit, filterType, sort]);

  const handlePageChange = (p) => {
    //page.current = p;
    // let currentPage = current;
    // if (!currentPage || currentPage === 0) {
    //   currentPage = 1;
    // }
    //const offset = currentPage * limit;
    paginationOffset((p - 1) * limit);
    paginationCurrent(p);
  };

  // const handleSorting = () => {
  //   loanListing();
  // };

  // const generateAvatar = () => {
  //   let avatar = blockies.create({
  //     size: 7,
  //     scale: 6
  //   });
  //   return avatar.toDataURL();
  // };
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
              <TableMobileFilter menu onClick={() => changeLoansFilter('all')}>
                <TableMobileFiltersText>All loans</TableMobileFiltersText>
              </TableMobileFilter>
              <TableMobileFilter menu onClick={() => changeLoansFilter('own')}>
                <TableMobileFiltersText>My loans</TableMobileFiltersText>
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
              ) : !isLoading && loans.list.length === 0 && filterType === 'own' ? (
                <TableContentCard pointer={false}>
                  <CallToActionWrapper>
                    <h2>
                      You don’t have any{' '}
                      {path === 'borrow' ? 'loans' : path === 'earn' ? 'assets' : ''} yet
                    </h2>
                    <button
                      onClick={() =>
                        path === 'borrow'
                          ? HandleNewLoan()
                          : path === 'earn'
                          ? changeOwnAllFilter('all')
                          : false
                      }
                    >
                      <img
                        src={path === 'borrow' ? RequestLoan : path === 'earn' ? EarningAsset : ''}
                        alt='img'
                      />{' '}
                      {path === 'borrow'
                        ? 'Request New Loan'
                        : path === 'earn'
                        ? 'Start Earning  Assets'
                        : ''}
                    </button>
                  </CallToActionWrapper>
                </TableContentCard>
              ) :
              !isLoading && loans.list.length === 0 && filterType === 'all' ? (
                <TableContentCard pointer={false}>
                  <CallToActionWrapper>
                    <button
                      onClick={() =>
                        path === 'borrow'
                          ? HandleNewLoan()
                          : path === 'earn'
                          ? history.push("/borrow")
                          : false
                      }
                    >
                      <img
                        src={RequestLoan}
                        alt='img'
                      />{' '}
                      {path === 'borrow'
                        ? 'Request New Loan'
                        : path === 'earn'
                        ? 'Navigate to Borrow'
                        : ''}
                    </button>
                  </CallToActionWrapper>
                </TableContentCard>
              ) :
              
              (
                loans && loans.list.map((loan, i) => <TableCardMobile key={i} loan={loan} path={path} />)
              )}
            </div>
        </TableWrapper>
        <TableWrapper desktop>
          <TableHeader HandleNewLoan={HandleNewLoan} path={path} filter={filter} />
          <div className='table-container'>
            <TableHead />
            <div className='table-content'>
              {isLoading ? (
                <div>
                  {[...Array(5)].map((i, idx) => (
                    <TableContentCard key={idx}>
                      <div className='loadingCard'>
                        <div className='loadingFirstCol'>
                          <div className='loadingFirslColContent'>
                            <div className='loadingAvatar loadingContent '></div>
                            <div className='loadingText loadingContentWrapper loadingContent'></div>
                          </div>
                        </div>
                        <div className='loadingSecondCol'>
                          <div className='loadingContentCol loadingContentWrapper loadingContent'></div>
                        </div>
                        <div className='loadingFifthCol'>
                          <div className='loadingFifthColContent loadingContentWrapper loadingContent'></div>
                        </div>
                        <div className='loadingSixthCol'>
                          <div className='loadingSixthColContent loadingContentWrapper loadingContent'></div>
                        </div>
                      </div>
                    </TableContentCard>
                  ))}
                </div>
              ) : !isLoading && loans.list.length === 0 && filterType === 'own' ? (
                <TableContentCard pointer={false}>
                  <CallToActionWrapper>
                    <h2>
                      You don’t have any{' '}
                      {path === 'borrow' ? 'loans' : path === 'earn' ? 'assets' : ''} yet
                    </h2>
                    <button
                      onClick={() =>
                        path === 'borrow'
                          ? HandleNewLoan()
                          : path === 'earn'
                          ? changeOwnAllFilter('all')
                          : false
                      }
                    >
                      <img
                        src={path === 'borrow' ? RequestLoan : path === 'earn' ? EarningAsset : ''}
                        alt='img'
                      />{' '}
                      {path === 'borrow'
                        ? 'Request New Loan'
                        : path === 'earn'
                        ? 'Start Earning  Assets'
                        : ''}
                    </button>
                  </CallToActionWrapper>
                </TableContentCard>
              ) :
              !isLoading && loans.list.length === 0 && filterType === 'all' ? (
                <TableContentCard pointer={false}>
                  <CallToActionWrapper>
                    <button
                      onClick={() =>
                        path === 'borrow'
                          ? HandleNewLoan()
                          : path === 'earn'
                          ? history.push("/borrow")
                          : false
                      }
                    >
                      <img
                        src={RequestLoan}
                        alt='img'
                      />{' '}
                      {path === 'borrow'
                        ? 'Request New Loan'
                        : path === 'earn'
                        ? 'Navigate to Borrow'
                        : ''}
                    </button>
                  </CallToActionWrapper>
                </TableContentCard>
              ) :
              
              (
                loans && loans.list.map((loan, i) => <TableCard key={i} loan={loan} path={path} />)
              )}
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
  changeOwnAllFilter
})(Table);