import React, { useEffect, useCallback, useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { useLocation } from 'react-router-dom';
import Pagination from 'react-paginating';
import { apiUri } from 'config/constants';
import {
  fetchTableData,
  changeFilter,
  paginationOffset,
  paginationCurrent,
  changeSorting,
  changeOwnAllFilter,
  ownAllToggle
} from 'redux/actions/tableData';
import {
  ModeThemes
} from 'config/constants';
import ReactLoading from 'react-loading';
import { changePath } from 'redux/actions/TogglePath';
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
} from '../../Stake/Table/styles/TableComponents';
import { EmptyBox } from 'assets';
import HeaderTabs from '../Header/HeaderTabs';
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
  ownAllToggle,
  theme,
}) => {
  const { pathname } = useLocation();
  let localAddress = window.localStorage.getItem('address');
  const [isDesktop, setDesktop] = useState(window.innerWidth > 992);
  const pageCount = 5;
  const { filter, skip, limit, current, filterType, sort, isLoading, tradeType } = data;
  // const [openFilterMenu, setOpenFilterMenu] = useState(false);
  // const [currentFilter, setCurrentFilter] = useState('All tranches');
  let parsedPath = pathname.split('/');
  let currentPath = parsedPath[parsedPath.length - 1];

  const updateMedia = () => {
    setDesktop(window.innerWidth > 992);
  };

  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  });

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

  const handleSorting = () => {
    trancheListing();
  };

  return (
    <div className='container content-container'>
      <div>
        <TableWrapper mobile>
          <HeaderTabs />
          <div className='table-content'>
            {isLoading ? (
              <div>
                <TableContentCard>
                  <ReactLoading className='TableMoreLoading' type={'bubbles'} color='rgba(56,56,56,0.3)' />
                </TableContentCard>
              </div>
            ) : (
              data && data.tranchesList.map((tranche, i) => <TableCard key={i} id={i} tranche={tranche} path={path} isDesktop={isDesktop}/>)
            )}
          </div>
        </TableWrapper>
        <TableWrapper desktop>
          <div className='table-container'>
            <HeaderTabs />
            <TableHead handleSorting={(name, type) => handleSorting(name, type)} color={ModeThemes[theme].TableHead}/>
            <div className='table-content'>
              {isLoading ? (
                <div>
                  {[...Array(5)].map((i, idx) => (
                    <TableContentCard key={idx} color={ModeThemes[theme].TableHead}>
                      <div className='loadingCard flex'>
                        <div className='loadingFirstCol'>
                          <div className='loadingFirslColContent flex'>
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
                data && data.tranchesList.map((tranche, i) => <TableCard key={i} id={i} tranche={tranche} path={path} isDesktop={isDesktop} />)
              )}
            </div>
          </div>
        </TableWrapper>

      </div>
    </div>
  );
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
