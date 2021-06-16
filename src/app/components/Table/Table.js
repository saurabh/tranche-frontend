import React, { useEffect, useCallback, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import _ from 'lodash';
import { apiUri } from 'config/constants';
import ReactLoading from 'react-loading';
import Pagination from 'react-paginating';
import { useHistory } from "react-router-dom";
import {
  fetchTableData,
  changeFilter,
  paginationOffset,
  paginationCurrent,
  changeSorting,
  changeOwnAllFilter
} from 'redux/actions/tableData';
import { changePath } from 'redux/actions/TogglePath';
import TableHeader from './TableHeader';
import TableHead from './TableHead';
import TableCard from './TableCard';
import { TableWrapper, TableContentCard, CallToActionWrapper,
  TableMobileFiltersWrapper,
  TableMobileFilter,
  TableMobileFiltersMenu,
  TableMobileFiltersText,
  TableMobileFilterRow,
  TableMobileRowCreateLoan
} from './styles/TableComponents';
import { RequestLoan, FilterChevron, CreateLoan, EarningAsset} from 'assets';


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
const { loanList: loanListUrl } = apiUri;
const Table = ({
  HandleNewLoan,
  fetchTableData,
  changeOwnAllFilter,
  data,
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
  const { filter, skip, limit, current, filterType, sort, isLoading } = data;
  const [openFilterMenu, setOpenFilterMenu] = useState(false);
  const [currentFilter, setCurrentFilter] = useState(`${pathname === "/borrow" ? "All loans" : pathname === "/lend" ? "All assets" : ""}`);
  let parsedPath = pathname.split('/');
  let currentPath = parsedPath[parsedPath.length - 1];

  const loanListing = useCallback(_.debounce(async () => {
    if (sort) {
      await fetchTableData({
        sort,
        skip,
        limit,
        filter: {
          borrowerAddress: path === 'borrow' && filterType === 'own' ? address : undefined,
          lenderAddress: path === 'lend' && filterType === 'own' ? address : undefined
        }
      }, loanListUrl);
    } else {
      await fetchTableData({
        skip,
        limit,
        filter: {
          borrowerAddress: path === 'borrow' && filterType === 'own' ? address : undefined,
          lenderAddress: path === 'lend' && filterType === 'own' ? address : undefined
        }
      }, loanListUrl);
    }
    //page.current = currentPage;
  }, 3000, {leading: true}), [fetchTableData, filter, skip, limit, filterType, sort, address, path]);

  
  

  const changeLoansAssetsFilter = useCallback(
    (filter) => {
      changeOwnAllFilter(filter);
      let val = (filter === "own" && pathname === "/borrow") ? "My loans" : (filter === "all" && pathname === "/borrow")  ? "All loans" : (filter === "own" && pathname === "/lend") ? "My assets" : (filter === "all" && pathname === "/lend") ?  "All assets" :  "";
      setCurrentFilter(val);
      setOpenFilterMenu(false);
    },
    [changeOwnAllFilter, pathname]
  );

  const changeOwnAllFilterHandler = (val) => {
    changeOwnAllFilter(val);
    changeLoansAssetsFilter(val);
  }

  useEffect(() => {
    changePath(currentPath);
    changeOwnAllFilter('all');
  }, [changePath, pathname, changeOwnAllFilter, currentPath]);

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
          { path !== "staking" &&
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
                  <TableMobileFilter menu onClick={() => changeLoansAssetsFilter('all')}>
                    <TableMobileFiltersText>{path === "borrow"  ? "All loans" : path === "lend" ? "All assets" : ""}</TableMobileFiltersText>
                  </TableMobileFilter>
                  <TableMobileFilter menu onClick={() => changeLoansAssetsFilter('own')}>
                    <TableMobileFiltersText>{path === "borrow" ? "My loans": path === "lend" ? "My assets" :  ""}</TableMobileFiltersText>
                  </TableMobileFilter>
                </TableMobileFiltersMenu>
              </TableMobileFiltersWrapper>
          }
        <TableWrapper mobile>
          <TableHead />
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
              ) : !isLoading && data.loansList.length === 0 && filterType === 'own' ? (
                <TableContentCard pointer={false}>
                  <CallToActionWrapper>
                    <h2>
                      You don’t have any{' '}
                      {path === 'borrow' ? 'loans' : path === 'tranche' ? 'assets' : ''} yet
                    </h2>
                    <button
                      onClick={() =>
                        path === 'borrow'
                          ? HandleNewLoan()
                          : path === 'lend'
                          ? changeOwnAllFilterHandler('all')
                          : false
                      }
                    >
                      <img
                        src={path === 'borrow' ? RequestLoan : path === 'lend' ? EarningAsset : ''}
                        alt='img'
                      />{' '}
                      {path === 'borrow'
                        ? 'Request New Loan'
                        : path === 'lend'
                        ? 'Start Earning  Assets'
                        : ''}
                    </button>
                  </CallToActionWrapper>
                </TableContentCard>
              ) :
              !isLoading && data.loansList.length === 0 && filterType === 'all' ? (
                <TableContentCard pointer={false}>
                  <CallToActionWrapper>
                    <button
                      onClick={() =>
                        path === 'borrow'
                          ? HandleNewLoan()
                          : path === 'tranche'
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
                        : path === 'lend'
                        ? 'Navigate to Borrow'
                        : ''}
                    </button>
                  </CallToActionWrapper>
                </TableContentCard>
              ) :
              
              (
                data && data.loansList.map((loan, i) => <TableCard key={i} loan={loan} path={path} />)
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
              ) : !isLoading && data.loansList.length === 0 && filterType === 'own' ? (
                <TableContentCard pointer={false}>
                  <CallToActionWrapper>
                    <h2>
                      You don’t have any{' '}
                      {path === 'borrow' ? 'loans' : path === 'lend' ? 'assets' : ''} yet
                    </h2>
                    <button
                      onClick={() =>
                        path === 'borrow'
                          ? HandleNewLoan()
                          : path === 'lend'
                          ? changeOwnAllFilter('all')
                          : false
                      }
                    >
                      <img
                        src={path === 'borrow' ? RequestLoan : path === 'lend' ? EarningAsset : ''}
                        alt='img'
                      />{' '}
                      {path === 'borrow'
                        ? 'Request New Loan'
                        : path === 'lend'
                        ? 'Buy Earning  Assets'
                        : ''}
                    </button>
                  </CallToActionWrapper>
                </TableContentCard>
              ) :
              !isLoading && data.loansList.length === 0 && filterType === 'all' ? (
                <TableContentCard pointer={false}>
                  <CallToActionWrapper>
                    <button
                      onClick={() =>
                        path === 'borrow'
                          ? HandleNewLoan()
                          : path === 'lend'
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
                        : path === 'lend'
                        ? 'Navigate to Borrow'
                        : ''}
                    </button>
                  </CallToActionWrapper>
                </TableContentCard>
              ) :
              
              (
                data && data.loansList.map((loan, i) => <TableCard key={i} loan={loan} path={path} />)
              )}
            </div>
          </div>
        </TableWrapper>

        {data && data.count > limit ? (
          <div className='paginationWrapper'>
            <Pagination
              total={data && data.count}
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
    data: state.data,
    path: state.path
  };
};

export default connect(mapStateToProps, {
  fetchTableData,
  changePath,
  changeFilter,
  paginationOffset,
  paginationCurrent,
  changeSorting,
  changeOwnAllFilter
})(Table);
