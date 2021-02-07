import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactLoading from 'react-loading';
// import { postRequest } from 'services/axios';
import { JProtocolSetup } from 'utils/contractConstructor';
import {
  toWei,
  fromWei,
} from 'services/contractMethods';
import {
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
  setTokenBalances,
  setTrancheTokenBalances
} from 'redux/actions/ethereum';
import { checkServer } from 'redux/actions/checkServer';
import { initOnboard } from 'services/blocknative';
import {
  addrShortener,
  // valShortner,
  readyToTransact,
  isGreaterThan,
  isEqualTo,
  // gweiOrEther,
  // roundBasedOnUnit
} from 'utils';
import {
  PagesData,
  txMessage,
  tokenConstructors,
  etherScanUrl,
  // apiUri
} from 'config';
import TradeModal from '../../Modals/TradeModal';
import {
  Adjust,
  AdjustEarn,
  AdjustTrade,
   LinkArrow,
  UserImg
} from 'assets';
import TableMoreRow from './TableMoreRow';
// import ETH from 'assets/images/svg/EthForm.svg';

import {
  TableContentCard,
  TableContentCardWrapper,
  StatusTextWrapper,
  AdjustLoanBtn,
  TableCardTag
} from '../../Table/styles/TableComponents';

const TableCard = ({
  tranche: {
    name,
    contractAddress,
    trancheId,
    type,
    subscriber,
    rpbRate,
    cryptoType,
    amount
    // collateralType,
  },
  // trade: { tradeType },
  path,
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
  ethereum: { tokenBalance, address, wallet, web3, notify },
  form,
  setTokenBalances,
  setTrancheTokenBalances,
  // checkServer
}) => {
  const JProtocol = JProtocolSetup(web3);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [hasAllowance, setHasAllowance] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  // const [hasBalance, setHasBalance] = useState(false);
  // const [moreCardToggle, setMoreCardToggle] = useState(false);
  // const [moreList, setMoreList] = useState([]);

  // const [isLoading, setIsLoading] = useState(false);
  // const [disableBtn, setDisableBtn] = useState(false);
  let disableBtn = false;
  let isLoading = false;
  let moreCardToggle = false;
  let moreList = false;

  const searchArr = (key) => tokenConstructors.find((i) => i.key === key);

  const onboard = initOnboard({
    address: setAddress,
    network: setNetwork,
    balance: setBalance,
    wallet: setWalletAndWeb3
  });

  
  const allowanceCheck = async (amount) => {
  try {
    amount = toWei(amount);
    const tokenSetup = searchArr(cryptoType).tokenSetup
    const token = tokenSetup(web3);
    let userAllowance = await token.methods.allowance(address, contractAddress).call();
    if (isGreaterThan(userAllowance, amount) || isEqualTo(userAllowance, amount)) {
      setHasAllowance(true);
    } else {
      setHasAllowance(false);
    }
  } catch (error) {
    console.error(error);
  }
};
  
  const approveContract = async (amount) => {
    try {
      amount = toWei(amount);
      const tokenSetup = searchArr(cryptoType).tokenSetup
      const token = tokenSetup(web3);
      await token.methods
        .approve(contractAddress, amount)
        .send({ from: address })
        .on('transactionHash', (hash) => {
          setApproveLoading(true);
          const { emitter } = notify.hash(hash);
          emitter.on('txPool', (transaction) => {
            return {
              message: txMessage(transaction.hash)
            };
          });
          emitter.on('txConfirmed', () => {
            setHasAllowance(true);
            setApproveLoading(false);
          });
          emitter.on('txCancel', () => setApproveLoading(false));
          emitter.on('txFailed', () => setApproveLoading(false));
        });
    } catch (error) {
      console.error(error);
    }
  };

  const buyTrancheTokens = async (e) => {
    try {
      e.preventDefault();
      let { amount } = form.sell.values;
      amount = toWei(amount);
      if (type === 'TRANCHE_A') {
        await JProtocol.methods
          .buyTrancheAToken(trancheId, amount)
          .send({ from: address })
          .on('transactionHash', (hash) => {
            closeModal(); 
            const { emitter } = notify.hash(hash);
            emitter.on('txPool', (transaction) => {
              return {
                message: txMessage(transaction.hash)
              };
            });
          });
      } else {
        await JProtocol.methods
          .buyTrancheBToken(trancheId, amount)
          .send({ from: address })
          .on('transactionHash', (hash) => {
            closeModal(); 
            const { emitter } = notify.hash(hash);
            emitter.on('txPool', (transaction) => {
              return {
                message: txMessage(transaction.hash)
              };
            });
          });
      }
    } catch (error) {
      console.error(error);
    }
  }

  const openModal = async () => {
    const ready = await readyToTransact(wallet, onboard);
    if (!ready) return;
    address = !address ? onboard.getState().address : address;
    setTokenBalances(web3, address);
    setTrancheTokenBalances()
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setHasAllowance(false);
  };

  // const searchObj = (val) => {
  //   return Object.fromEntries(
  //     Object.entries(statuses).filter(([key, value]) => value.status === val)
  //   );
  // };

  // const cardToggle = (hash) => {
  //   console.log('Loan ID: ' + loanId);
  //   // console.log(loan);
  //   setMoreCardToggle(!moreCardToggle);
  //   if (!moreCardToggle) {
  //     getTransaction(hash);
  //   }
  // };

  // const getTransaction = async (hash) => {
  //   const { transaction: transactionUrl } = apiUri;
  //   setIsLoading(true);
  //   try {
  //     const { data: result } = await postRequest(
  //       transactionUrl,
  //       {
  //         data: {
  //           skip: 0,
  //           limit: 100,
  //           filter: {
  //             loanId,
  //             contractAddress: hash
  //           }
  //         }
  //       },
  //       null,
  //       true
  //     );
  //     if (result.status) {
  //       checkServer(true);
  //       setIsLoading(false);
  //       setMoreList(result.result.list);
  //     } else {
  //       checkServer(false);
  //     }
  //   } catch (error) {
  //     checkServer(false);
  //     console.log(error);
  //   }
  // };

  const checkLoan = false;

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
        <div className='table-first-col table-col'>
          <div className='table-first-col-wrapper'>
            <div className='first-col-img'>
              <img src={UserImg} alt='User' />
            </div>
            <div className='first-col-content'>
              <div className='first-col-title'>
                <h2>{name && name}</h2>
              </div>
              <div className='first-col-subtitle'>
                <h2>{addrShortener(contractAddress)}</h2>
                <a
                  href={etherScanUrl + 'address/' + contractAddress}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <img src={LinkArrow} alt='' />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className='table-third-col table-col'>
          <div className='third-col-content content-3-col second-4-col-content'>
            <h2>
              {fromWei(amount.toString())} <span>{cryptoType}</span>
            </h2>
          </div>
        </div>
        <div
          className={
            'table-col ' + (path === 'earn' ? 'table-fourth-col-return ' : 'table-fourth-col')
          }
        >
          <div className='fourth-col-content content-3-col second-4-col-content'>
            <h2>
              {rpbRate}
            </h2>
          </div>
        </div>
        <div
          className={
            'table-col ' + (path === 'earn' ? 'table-fifth-col-subscription ' : 'table-fifth-col')
          }
        >
          <div className='fifth-col-content content-3-col second-4-col-content'>
            <h2>
              {(subscriber.toString())}
            </h2>
          </div>
        </div>
        <div className='table-second-col table-col'>
          <div className='second-col-content'>
            <StatusTextWrapper
              className='status-text-wrapper'
              // color={Object.values(searchObj(status))[0].color}
              // backgroundColor={Object.values(searchObj(status))[0].background}
            >
              {/* {Object.values(searchObj(status))[0].key === 'Under Collateralized'
                ? 'Under'
                : valShortner(Object.values(searchObj(status))[0].key)} */}
            </StatusTextWrapper>
          </div>
        </div>
        <div onClick={(e) => e.stopPropagation()} className='table-sixth-col table-col'>
          <div className='adjust-btn-wrapper'>
            <AdjustLoanBtn
              color={PagesData[path].btnColor}
              // disabled={disableBtn}
              onClick={disableBtn ? undefined : () => openModal()}
            >
              <img
                src={
                  path === 'borrow'
                    ? Adjust
                    : path === 'lend'
                    ? AdjustEarn
                    : path === 'earn' && !disableBtn
                    ? AdjustTrade
                    : Adjust
                }
                alt='adjust'
              />
            </AdjustLoanBtn>
          </div>
          <TradeModal
            // State Values
            path={path}
            modalIsOpen={modalIsOpen}
            hasAllowance={hasAllowance}
            approveLoading={approveLoading}
            // Functions
            closeModal={() => closeModal()}
            allowanceCheck={allowanceCheck}
            approveContract={approveContract}
            buyTrancheTokens={buyTrancheTokens}
            // API Values
            trancheName={name}
            trancheType={type}
          />
        </div>
      </TableContentCard>
      <div className={'table-card-more ' + (moreCardToggle ? 'table-more-card-toggle' : '')}>
        <div className='table-card-more-content'>
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
        </div>
      </div>
    </TableContentCardWrapper>
  );
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
