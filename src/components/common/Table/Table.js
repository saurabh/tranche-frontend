import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Pagination from 'react-paginating';
import ReactLoading from 'react-loading';
import {
  loansFetchData,
  changeFilter,
  loansIsLoading,
  paginationOffset,
  paginationCurrent
} from 'redux/actions/loans';
import { changePath } from 'redux/actions/TogglePath';
import TableHeader from './TableHeader';
import TableHead from './TableHead';
import TableCard from './TableCard';
import styled from 'styled-components';
import blockies from 'ethereum-blockies';
import { TableContentCardWrapper, TableContentCard } from '../Modals/ModalComponents';

const TableWrapper = styled.div`
  width: 100%;
  background: #ffffff;
  border: 1px solid #efefef;
  box-sizing: border-box;
  margin: 24px auto;
  border-radius: 12px;
`;

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
  loans,
  path,
  changePath,
  paginationOffset,
  paginationCurrent,
}) => {
  const { pathname } = useLocation();
  const [pageCount, setPageCount] = useState(5);
  const { filter, skip, limit, current } = loans;

  const loanListing = async (sort = null) => {
    if (sort) {
      await loansFetchData({
        sort,
        skip,
        limit,
        filter: {
          type: filter //ETH/JNT keep these in constant file
        }
      });
    } else {
      await loansFetchData({
        skip,
        limit,
        filter: {
          type: filter //ETH/JNT keep these in constant file
        }
      });
    }
    //page.current = currentPage;
  };

  useEffect(() => {
    const parsePath = () => {
      changePath(pathname.split('/')[1]);
    };

    let currentPath = pathname.split('/')[1];
    changePath(currentPath);
    parsePath();
    loanListing();
  }, [loansFetchData, pathname, changePath, filter, current]);

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

  const handleSorting = (name, type) => {
    let sort = {
      name: name,
      type: type
    };
    loanListing(sort);
  };

  const generateAvatar = () => {
    let avatar = blockies.create({
      size: 7,
      scale: 6
    });
    return avatar.toDataURL();
  };
  return (
    <div className='container content-container'>
      <div className='TableContentWrapper'>
        <TableWrapper>
          <TableHeader HandleNewLoan={HandleNewLoan} path={path} />
          <div className='table-container'>
            <TableHead handleSorting={(name, type) => handleSorting(name, type)} />
            <div className='table-content'>
              {loans &&
                loans.list.map((loan, i) => (
                  <TableCard key={i} loan={loan} avatar={generateAvatar()} path={path} />
                ))}
            </div>
          </div>
        </TableWrapper>

        {loans && loans.count > limit ? (
          <div className='paginationWrapper'>
            <Pagination
              total={loans && loans.count}
              limit={limit}
              pageCount={pageCount}
              currentPage={
                parseInt(current, 10)
              }
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
    loans: state.loans,
    path: state.path
  };
};

export default connect(mapStateToProps, {
  loansFetchData,
  changePath,
  changeFilter,
  loansIsLoading,
  paginationOffset,
  paginationCurrent
})(Table);
