import React, { useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Pagination from 'react-paginating';
import { apiUri } from 'config/constants';
import _ from 'lodash';
import {
  fetchTableData,
  changeFilter,
  paginationOffset,
  paginationCurrent,
  changeSorting,
  changeOwnAllFilter,
  ownAllToggle
} from 'redux/actions/tableData';
import ReactLoading from 'react-loading';

import { changePath } from 'redux/actions/TogglePath';
import TableHeader from '../../Stake/Table/TableHeader';
import TableHead from './TableHead';
import TableCard from './TableCard';
import {
  TableWrapper,
  TableContentCard,
  CallToActionTradeWrapper,
  CallToActionTradeBtns,
  CallToActionTradeBtn,
  CallToActionTradetext
} from '../../Stake/Table/styles/TableComponents';
import { EmptyBox } from 'assets';
const { tranchesList: tranchesListUrl } = apiUri;

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
  fetchTableData,
  changeOwnAllFilter,
  path,
  data,
  changePath,
  paginationOffset,
  paginationCurrent,
  ownAllToggle
}) => {
  const { pathname } = useLocation();
  let localAddress = window.localStorage.getItem('address');
  const pageCount = 5;
  const { filter, skip, limit, current, filterType, sort, isLoading, tradeType } = data;
  // const [openFilterMenu, setOpenFilterMenu] = useState(false);
  // const [currentFilter, setCurrentFilter] = useState('All tranches');
  let parsedPath = pathname.split('/');
  let currentPath = parsedPath[parsedPath.length - 1];

  const trancheListing = useCallback(
    _.debounce(
      async () => {
        if (sort) {
          await fetchTableData(
            {
              sort,
              skip,
              limit,
              filter: {
                address: localAddress ? localAddress : undefined,
                type: filter //ETH/JNT keep these in constant file
              }
            },
            tranchesListUrl
          );
        } else {
          await fetchTableData(
            {
              skip,
              limit,
              filter: {
                address: localAddress ? localAddress : undefined,
                type: filter //ETH/JNT keep these in constant file
              }
            },
            tranchesListUrl
          );
        }
      },
      3000,
      { leading: true }
    ),
    [fetchTableData, filter, skip, limit, sort, localAddress]
  );

  useEffect(() => {
    window.ethereum.on('accountsChanged', function () {
      window.location.reload();
    });
  }, []);

  useEffect(() => {
    changePath(currentPath);
    changeOwnAllFilter('all');
    ownAllToggle('allTranches');
  }, [changePath, pathname, currentPath, changeOwnAllFilter, ownAllToggle]);

  useEffect(() => {
    path === 'tranche' && trancheListing();
  }, [path, trancheListing, filter, skip, limit, filterType, sort]);

  const handlePageChange = (p) => {
    paginationOffset((p - 1) * limit);
    paginationCurrent(p);
  };

  // const changeLoansFilter = useCallback(
  //   (filter) => {
  //     changeOwnAllFilter(filter);
  //     // let val = filter === 'own' ? 'My tranches' : filter === 'all' ? 'All tranches' : '';
  //     // setCurrentFilter(val);
  //     // setOpenFilterMenu(false);
  //   },
  //   [changeOwnAllFilter]
  // );

  // const changeOwnAllFilterHandler = (val) => {
  //   ownAllToggle(val);
  //   changeLoansFilter(val);
  // };

  const handleSorting = () => {
    trancheListing();
  };

  return (
    <div className='container content-container'>
      <div className='TableContentWrapper'>
        <TableWrapper mobile>
          <TableHead />
          <div className='table-content'>
            {isLoading ? (
              <div>
                <TableContentCard>
                  <ReactLoading className='TableMoreLoading' type={'bubbles'} color='rgba(56,56,56,0.3)' />
                </TableContentCard>
              </div>
            ) : (
              data &&
              data.tranchesList.map((tranche, i) => (
                <TableCard key={i} id={i} tranche={tranche} path={path} />
              ))
            )}
          </div>
        </TableWrapper>
        <TableWrapper desktop>
          <TableHeader HandleNewLoan={HandleNewLoan} path={path} filter={filter} />
          <div className='table-container'>
            <TableHead handleSorting={(name, type) => handleSorting(name, type)} />
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
              ) : !isLoading && tradeType === 'myTranches' && data.tranchesList.length === 0 ? (
                // </div> : (!isLoading && loans.tranchesList.length === 0 && tradeType === 'sell') ?

                <TableContentCard pointer={false}>
                  <CallToActionTradeWrapper>
                    <img src={EmptyBox} alt='EmptyBox' />

                    <CallToActionTradetext>
                      <h2>You don’t have any loans, assets or instruments to sell.</h2>
                      <h2>Buy a tranche or provide a loan to get started!</h2>
                    </CallToActionTradetext>

                    <CallToActionTradeBtns>
                      <CallToActionTradeBtn type='loans'>
                        BROWSE <span>LOANS</span>
                      </CallToActionTradeBtn>
                      <CallToActionTradeBtn>
                        BROWSE <span>TRANCHES</span>
                      </CallToActionTradeBtn>
                    </CallToActionTradeBtns>
                  </CallToActionTradeWrapper>
                </TableContentCard>
              ) : (
                data &&
                data.tranchesList.map((tranche, i) => (
                  <TableCard key={i} id={i} tranche={tranche} path={path} />
                ))
              )}
            </div>
          </div>
        </TableWrapper>

        {data && data.count > limit ? (
          <div className='paginationWrapper'>
            <Pagination total={data && data.count} limit={limit} pageCount={pageCount} currentPage={parseInt(current, 10)}>
              {({ pages, currentPage, hasNextPage, hasPreviousPage, previousPage, nextPage, totalPages, getPageItemProps }) => (
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
  changeOwnAllFilter,
  ownAllToggle
})(Table);
