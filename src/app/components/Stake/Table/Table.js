import React, { useEffect, useCallback, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
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
import { ModeThemes } from 'config/constants';

import ReactLoading from 'react-loading';

import { changePath } from 'redux/actions/TogglePath';
import TableHeader from './TableHeader';
import TableHead from './TableHead';
import TableCard from './TableCard';
import {
  TableWrapper,
  TableContentCard,
  CallToActionTradeWrapper,
  CallToActionTradeBtns,
  CallToActionTradeBtn,
  CallToActionTradetext,
  LoadingContent
} from './styles/TableComponents';
import { EmptyBox } from 'assets';
const { stakingList: stakingListUrl } = apiUri;

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
  openModal, closeModal, modalType, ModalIsOpen,
  HandleNewLoan,
  fetchTableData,
  changeOwnAllFilter,
  path,
  data,
  changePath,
  paginationOffset,
  paginationCurrent,
  ownAllToggle,
  theme,
  title
}) => {
  const { pathname } = useLocation();
  let localAddress = window.localStorage.getItem('address');
  const pageCount = 5;
  const [isDesktop, setDesktop] = useState(window.innerWidth > 992);
  const { filter, skip, limit, current, filterType, sort, isLoading, tradeType } = data;
  let parsedPath = pathname.split('/');
  let currentPath = parsedPath[parsedPath.length - 1];
  const updateMedia = () => {
    setDesktop(window.innerWidth > 992);
  };

  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  });
  const stakingListing = useCallback(
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
            stakingListUrl
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
            stakingListUrl
          );
        }
      },
      3000,
      { leading: true }
    ),
    [fetchTableData, filter, skip, limit, sort, tradeType, localAddress]
  );

  useEffect(() => {
    changePath(currentPath);
    changeOwnAllFilter('all');
    ownAllToggle('allTranches');
  }, [changePath, pathname, currentPath, changeOwnAllFilter, ownAllToggle]);

  useEffect(() => {
    stakingListing();
  }, [stakingListing, filter, skip, limit, filterType, sort]);

  const handlePageChange = (p) => {
    paginationOffset((p - 1) * limit);
    paginationCurrent(p);
  };

  const handleSorting = () => {
    stakingListing();
  };


  return (
    <div className='container content-container'>
      <div className='TableContentWrapper'>
        <TableWrapper mobile>
          <div className='table-content'>
            {isLoading ? (
              <div>
                <TableContentCard>
                  <ReactLoading className='TableMoreLoading' type={'bubbles'} color={ModeThemes[theme].TableHead} />
                </TableContentCard>
              </div>
            ) : (
              (title === "SLICE Staking Pools") ?
              (data.sliceStakingList.length > 0 && data.sliceStakingList[0])  && data.sliceStakingList.map((staking, i) => <TableCard key={i} openModal={openModal} title={title} closeModal={closeModal} ModalIsOpen={ModalIsOpen} modalType={modalType} staking={staking} path={path} isDesktop={isDesktop}  />)
              : (data.stakingList.length > 0 && data.stakingList[0])  && data.stakingList.map((staking, i) => <TableCard key={i} openModal={openModal} title={title} closeModal={closeModal} ModalIsOpen={ModalIsOpen} modalType={modalType} staking={staking} path={path} isDesktop={isDesktop}  />)
            )}
          </div>
        </TableWrapper>
        <TableWrapper desktop>
          <TableHeader HandleNewLoan={HandleNewLoan} path={path} filter={filter} title={title}/>
          <div className='table-container'>
            <TableHead handleSorting={(name, type) => handleSorting(name, type)} title={title} color={ModeThemes[theme].TableHead} />
            <div className='table-content'>
              {isLoading ? (
                <div>
                  {[...Array(5)].map((i, idx) => (
                    <TableContentCard key={idx} color={ModeThemes[theme].TableHead}>
                      <div className='loadingCard'>
                        <div className='loadingFirstCol'>
                          <div className='loadingFirslColContent'>
                            <LoadingContent className='loadingAvatar loadingContent ' colorOne={ModeThemes[theme].LoadingColorOne} colorTwo={ModeThemes[theme].LoadingColorTwo}></LoadingContent>
                            <LoadingContent className='loadingText loadingContentWrapper loadingContent' colorOne={ModeThemes[theme].LoadingColorOne} colorTwo={ModeThemes[theme].LoadingColorTwo}></LoadingContent>
                          </div>
                        </div>
                        <div className='loadingSecondCol'>
                          <LoadingContent className='loadingContentCol loadingContentWrapper loadingContent' colorOne={ModeThemes[theme].LoadingColorOne} colorTwo={ModeThemes[theme].LoadingColorTwo}></LoadingContent>
                        </div>
                        <div className='loadingFifthCol'>
                          <LoadingContent className='loadingFifthColContent loadingContentWrapper loadingContent' colorOne={ModeThemes[theme].LoadingColorOne} colorTwo={ModeThemes[theme].LoadingColorTwo}></LoadingContent>
                        </div>
                        <div className='loadingSixthCol'>
                          <LoadingContent className='loadingSixthColContent loadingContentWrapper loadingContent' colorOne={ModeThemes[theme].LoadingColorOne} colorTwo={ModeThemes[theme].LoadingColorTwo}></LoadingContent>
                        </div>
                      </div>
                    </TableContentCard>
                  ))}
                </div>
              ) : !isLoading && tradeType === 'sell' && data.stakingList.length === 0 ? (
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
              (title === "SLICE Staking Pools") ?
              (data.sliceStakingList.length > 0 && data.sliceStakingList[0])  && data.sliceStakingList.map((staking, i) => <TableCard key={i} title={title} openModal={openModal} closeModal={closeModal} ModalIsOpen={ModalIsOpen} modalType={modalType} staking={staking} path={path} isDesktop={isDesktop}  />)
              : (data.stakingList.length > 0 && data.stakingList[0])  && data.stakingList.map((staking, i) => <TableCard key={i} title={title} openModal={openModal} closeModal={closeModal} ModalIsOpen={ModalIsOpen} modalType={modalType} staking={staking} path={path} isDesktop={isDesktop}  />)              )}
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

Table.propTypes = {
  data: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  return {
    data: state.data,
    path: state.path,
    theme: state.theme
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
