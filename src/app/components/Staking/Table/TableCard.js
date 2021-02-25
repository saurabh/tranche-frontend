import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactLoading from 'react-loading';
// import { postRequest } from 'services/axios';
import {
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
  setTokenBalances,
  setTrancheTokenBalances
} from 'redux/actions/ethereum';
import { checkServer } from 'redux/actions/checkServer';
import {
  addrShortener,
  gweiOrEther,
  roundBasedOnUnit
} from 'utils';
import {
  etherScanUrl,
  statuses
} from 'config';
import { LinkArrow, TrancheImg } from 'assets';
import TableMoreRow from './TableMoreRow';

import {
  TableContentCard,
  TableContentCardWrapper,
  FifthColContent,
  StatusTextWrapper,
  // AdjustLoanBtn,
  TableCardTag,
  TableCardImg,
  TableFirstCol,
  TableFirstColWrapper,
  FirstColContent,
  FirstColTitle,
  FirstColSubtitle,
  TableSecondCol,
  SecondColContent,
  TableThirdCol,
  ThirdColContent,
  TableFourthCol,
  FourthColContent,
  TableFifthCol,
  TableSixthCol,
  // AdustBtnWrapper,
  TableCardMore,
  TableCardMoreContent,
  TableContentCardWrapperMobile,
  TableContentCardMobile,
  TableColMobile,
  TableMobilColContent
  // TableMobilCardBtn
} from '../../Table/styles/TableComponents';

const TableCard = ({
  staking: { contractAddress, isActive, reward, staked, type },
  // trade: { tradeType },
  path,
  ethereum: { web3 }
  // checkServer
}) => {
  const [isDesktop, setDesktop] = useState(window.innerWidth > 1200);
  let isLoading = false;
  let moreCardToggle = false;
  let moreList = false;

  const updateMedia = () => {
    setDesktop(window.innerWidth > 1200);
  };

  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  });

  const searchObj = (val) => {
    return Object.fromEntries(
      Object.entries(statuses).filter(([key, value]) => value.status === val)
    );
  };

  const checkLoan = false;

  const TableCardDesktop = () => {
    return (
      <TableContentCardWrapper>
        <TableContentCard
          pointer={true}
          // onClick={() => cardToggle(contractAddress)}
          className={moreCardToggle ? 'table-card-toggle' : ''}
        >
          {checkLoan ? (
            <TableCardTag color={checkLoan.color}>
              <img src={checkLoan.img} alt='checkLoan' />
            </TableCardTag>
          ) : (
            ''
          )}
          <TableFirstCol className='table-col'>
            <TableFirstColWrapper>
              <TableCardImg tranche={true}>
                <img src={TrancheImg} alt='Tranche' />
              </TableCardImg>
              <FirstColContent>
                <FirstColTitle>
                  <h2>{type && type}</h2>
                </FirstColTitle>
                <FirstColSubtitle>
                  <h2>{addrShortener(contractAddress)}</h2>
                  <a
                    href={etherScanUrl + 'address/' + contractAddress}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <img src={LinkArrow} alt='' />
                  </a>
                </FirstColSubtitle>
              </FirstColContent>
            </TableFirstColWrapper>
          </TableFirstCol>

          <TableSecondCol className='table-col'>
            <SecondColContent className='content-3-col second-4-col-content'>
              <h2>{staked}</h2>
            </SecondColContent>
          </TableSecondCol>
          <TableThirdCol className={'table-col table-fourth-col-return '}>
            <ThirdColContent className='content-3-col second-4-col-content'>
              <h2>
                {roundBasedOnUnit(reward, 'SLICE')} {gweiOrEther(reward, 'SLICE')}
              </h2>
            </ThirdColContent>
          </TableThirdCol>
          <TableFourthCol tranche={true} className={'table-col table-fifth-col-subscription'}>
            <FourthColContent className='content-3-col second-4-col-content'>
              {/* <h2></h2> */}
            </FourthColContent>
          </TableFourthCol>
          <TableFifthCol className='table-col'>
            <FifthColContent>
              <StatusTextWrapper
                className='status-text-wrapper'
                color={Object.values(searchObj(isActive ? 1 : 0))[0].color}
                backgroundColor={Object.values(searchObj(1))[0].background}
                table='tranche'
              >
                {isActive ? 'ACTIVE' : ''}
              </StatusTextWrapper>
            </FifthColContent>
          </TableFifthCol>
          <TableSixthCol
            onClick={(e) => e.stopPropagation()}
            className='table-sixth-col table-col'
          ></TableSixthCol>
        </TableContentCard>
        <TableCardMore
          className={'table-card-more ' + (moreCardToggle ? 'table-more-card-toggle' : '')}
        >
          <TableCardMoreContent>
            {isLoading ? (
              <ReactLoading
                className='TableMoreLoading'
                type={'bubbles'}
                color='rgba(56,56,56,0.3)'
              />
            ) : (
              moreList &&
              moreList.map((i) => {
                return (
                  <TableMoreRow
                  // key={`${i.createdAt} +id: ${Math.random} => ${i.eventName}`}
                  // ethImg={ETH}
                  // arrow='downArrow'
                  // status={i.loanStatus}
                  // ratio={i.collateralRatio}
                  // createdAt={i.createdAt}
                  // hash={i.transactionHash}
                  // collateralTypeName={collateralTypeName}
                  // cryptoFromLenderName={cryptoFromLenderName}
                  // amount={i.amount}
                  // eventName={i.eventName}
                  />
                );
              })
            )}

            {/* <div className="more-transactions">
              <h2>
                this loan has 11 more transactions in its history.
                <a href="/">show more transactions</a>
              </h2>
            </div>*/}
          </TableCardMoreContent>
        </TableCardMore>
      </TableContentCardWrapper>
    );
  };
  const TableCardMobile = () => {
    return (
      <TableContentCardWrapperMobile>
        <TableContentCardMobile color={Object.values(searchObj(1))[0].background}>
          <span></span>
          <TableColMobile address>
            <TableMobilColContent>
              <h2>{type && type}</h2>
              <h2>{addrShortener(contractAddress)}</h2>
            </TableMobilColContent>
          </TableColMobile>

          <TableColMobile>
            <TableMobilColContent col>
              <h2>{staked}</h2>
              {/* <h2></h2> */}
            </TableMobilColContent>
          </TableColMobile>

          <TableColMobile>
            <TableMobilColContent col>
              <h2>{reward}</h2>
              {/* <h2></h2> */}
            </TableMobilColContent>
          </TableColMobile>

          <TableColMobile>
            <TableMobilColContent col>{/* <h2></h2> */}</TableMobilColContent>
          </TableColMobile>

          <TableColMobile btn></TableColMobile>
        </TableContentCardMobile>
      </TableContentCardWrapperMobile>
    );
  };
  return isDesktop ? TableCardDesktop() : TableCardMobile();
};

TableCard.propTypes = {
  ethereum: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  setAddress: PropTypes.func.isRequired,
  setNetwork: PropTypes.func.isRequired,
  setBalance: PropTypes.func.isRequired,
  setWalletAndWeb3: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  ethereum: state.ethereum,
  form: state.form,
  trade: state.trade
});

export default connect(mapStateToProps, {
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
  setTokenBalances,
  setTrancheTokenBalances,
  checkServer
})(TableCard);
