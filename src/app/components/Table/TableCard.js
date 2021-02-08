import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactLoading from 'react-loading';
import { postRequest } from 'services/axios';
import { JLoanSetup } from 'utils/contractConstructor';
import {
  toWei,
  fromWei,
  getLoanStatus,
  calcAdjustCollateralRatio,
  getLoanForeclosingBlock,
  getAccruedInterests,
  allowanceCheck,
  getShareholderShares
} from 'services/contractMethods';
import {
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
  setTokenBalances
} from 'redux/actions/ethereum';
import { checkServer } from 'redux/actions/checkServer';
import { initOnboard } from 'services/blocknative';
import {
  addrShortener,
  valShortner,
  readyToTransact,
  isGreaterThan,
  gweiOrEther,
  roundBasedOnUnit
} from 'utils';
import { statuses, PagesData, pairData, etherScanUrl, apiUri, DAI, txMessage } from 'config';
import LoanModal from '../Modals/LoanModal';
import { Adjust, AdjustEarn, AdjustTrade, LinkArrow } from 'assets';
import TableMoreRow from './TableMoreRow';
import ETH from 'assets/images/svg/EthForm.svg';

import {
  TableContentCard,
  TableContentCardWrapper,
  StatusTextWrapper,
  AdjustLoanBtn,
  TableCardTag
} from './styles/TableComponents';

const TableCard = ({
  loan: {
    loanId,
    status,
    pairId,
    borrowerAddress,
    lenderAddress,
    contractAddress,
    contractParams: { foreclosureWindow },
    loanCommonParams: { rpbRate },
    remainingLoan,
    apy,
    cryptoFromLender,
    cryptoFromLenderName,
    collateralRatio,
    interestPaid,
    collateralTypeName,
    collateralAmount,
    collateralType,
    image,
    name
  },
  loan,
  path,
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
  ethereum: { tokenBalance, address, wallet, web3, currentBlock, notify },
  form,
  setTokenBalances,
  checkServer
}) => {
  const JLoan = JLoanSetup(web3);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [newCollateralRatio, setNewCollateralRatio] = useState(0);
  const [moreCardToggle, setMoreCardToggle] = useState(false);
  const [moreList, setMoreList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const [hasBalance, setHasBalance] = useState(false);
  const [hasAllowance, setHasAllowance] = useState(false);
  const [isShareholder, setIsShareholder] = useState(false);
  const [shareholdersShares, setShareholderShares] = useState(0);
  const [blocksUntilForeclosure, setBlocksUntilForeclosure] = useState(0);
  const [loanForeclosingBlock, setLoanForeclosingBlock] = useState(0);
  const [canBeForeclosed, setCanBeForeclosed] = useState(false);
  const [accruedInterest, setAccruedInterest] = useState(0);
  const checkLoan =
    path === 'borrow' && address === borrowerAddress
      ? PagesData[path].userTag
      : path === 'lend' && isShareholder
      ? PagesData[path].userTag
      : false;

  const onboard = initOnboard({
    address: setAddress,
    network: setNetwork,
    balance: setBalance,
    wallet: setWalletAndWeb3
  });

  const searchArr = (key) => pairData.find((i) => i.key === key);

  let totalInterest = parseFloat(accruedInterest) + parseFloat(interestPaid);

  useEffect(() => {
    const balanceCheck = () => {
      try {
        if (
          cryptoFromLenderName !== 'N/A' &&
          remainingLoan !== 'N/A' &&
          isGreaterThan(
            Number(tokenBalance[cryptoFromLenderName]),
            Number(toWei(remainingLoan.toString()))
          )
        )
          setHasBalance(true);
      } catch (error) {
        console.error(error);
      }
    };

    balanceCheck();
  }, [status, address, tokenBalance, cryptoFromLenderName, remainingLoan]);

  useEffect(() => {
    if (
      (path === 'borrow' && borrowerAddress !== address) ||
      (path === 'borrow' &&
        (status === statuses['Foreclosed'].status ||
          status === statuses['Early_closing'].status ||
          status === statuses['Closing'].status)) ||
      (path === 'lend' &&
        !isShareholder &&
        (status === statuses['Active'].status ||
          status === statuses['Foreclosed'].status ||
          status === statuses['Early_closing'].status ||
          status === statuses['Closing'].status)) ||
      status === statuses['Closed'].status ||
      status === statuses['Cancelled'].status
    ) {
      setDisableBtn(true);
    } else setDisableBtn(false);
  }, [status, path, address, isShareholder, borrowerAddress]);

  useEffect(() => {
    const isShareholderCheck = async () => {
      try {
        if (address) {
          const result = lenderAddress.indexOf(address.toLowerCase());
          if (result !== -1) setIsShareholder(true);
          else setIsShareholder(false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    isShareholderCheck();
  }, [status, address, lenderAddress]);

  useEffect(() => {
    const forecloseWindowCheck = async () => {
      try {
        if (status === statuses['Foreclosing'].status) {
          const loanClosingBlock = await getLoanForeclosingBlock(loanId, web3);
          setLoanForeclosingBlock(loanClosingBlock);
        }
        if (
          loanForeclosingBlock !== 0 &&
          currentBlock >= loanForeclosingBlock + Number(foreclosureWindow)
        ) {
          setCanBeForeclosed(true);
        }
        setBlocksUntilForeclosure(loanForeclosingBlock + Number(foreclosureWindow) - currentBlock);
      } catch (error) {
        console.log(error);
      }
    };

    forecloseWindowCheck();
  }, [status, loanId, currentBlock, foreclosureWindow, loanForeclosingBlock, web3]);

  const approveContract = async (pairId, amount, adjust = false) => {
    try {
      amount = toWei(amount);
      const { lendTokenSetup, collateralTokenSetup } = pairData[pairId];
      const token = adjust ? collateralTokenSetup(web3) : lendTokenSetup(web3);
      await token.methods
        .approve(contractAddress, toWei(amount))
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

  const calcNewCollateralRatio = async (amount, actionType) => {
    try {
      const result = await calcAdjustCollateralRatio(loanId, amount, actionType, web3);
      setNewCollateralRatio(result);
    } catch (error) {
      console.error(error);
    }
  };

  const approveLoan = async () => {
    try {
      await JLoan.methods
        .lenderSendStableCoins(loanId, cryptoFromLender)
        .send({ from: address })
        .on('transactionHash', (hash) => {
          const { emitter } = notify.hash(hash);
          emitter.on('txPool', (transaction) => {
            return {
              message: txMessage(transaction.hash)
            };
          });
        });
    } catch (error) {
      console.error(error);
    }
  };

  const closeLoan = async () => {
    try {
      if (status === 0) {
        JLoan.methods
          .setLoanCancelled(loanId)
          .send({ from: address })
          .on('transactionHash', (hash) => {
            const { emitter } = notify.hash(hash);
            emitter.on('txPool', (transaction) => {
              return {
                message: txMessage(transaction.hash)
              };
            });
          });
      } else {
        await JLoan.methods
          .loanClosingByBorrower(loanId)
          .send({ from: address })
          .on('transactionHash', (hash) => {
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
  };

  const withdrawInterest = async () => {
    try {
      await JLoan.methods
        .withdrawInterests(loanId)
        .send({ from: address })
        .on('transactionHash', (hash) => {
          const { emitter } = notify.hash(hash);
          emitter.on('txPool', (transaction) => {
            return {
              message: txMessage(transaction.hash)
            };
          });
        });
    } catch (error) {
      console.error(error);
    }
  };

  const forecloseLoan = async () => {
    try {
      const onChainStatus = await getLoanStatus(loanId, web3);
      console.log('backend status: ' + status);
      console.log('onChain status: ' + onChainStatus);
      if (
        status === statuses['Under_Collateralized'].status ||
        onChainStatus === statuses['At_Risk'].status ||
        (status === statuses['At_Risk'].status && onChainStatus === statuses['Active'].status)
      ) {
        console.log('initiateLoanForeclose');
        await JLoan.methods
          .initiateLoanForeclose(loanId)
          .send({ from: address })
          .on('transactionHash', (hash) => {
            const { emitter } = notify.hash(hash);
            emitter.on('txPool', (transaction) => {
              return {
                message: txMessage(transaction.hash)
              };
            });
          });
      } else if (
        (onChainStatus === statuses['Foreclosing'].status &&
          status === statuses['At_Risk'].status) ||
        (currentBlock >= loanForeclosingBlock + Number(foreclosureWindow) &&
          status === statuses['Foreclosing'].status)
      ) {
        console.log('setLoanToForeclosed');
        await JLoan.methods
          .setLoanToForeclosed(loanId)
          .send({ from: address })
          .on('transactionHash', (hash) => {
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
  };

  const withdrawCollateral = async () => {
    try {
      let { collateralAmount } = form.adjustLoan.values;
      collateralAmount = toWei(collateralAmount);
      await JLoan.methods
        .withdrawCollateral(loanId, collateralAmount)
        .send({ from: address })
        .on('transactionHash', (hash) => {
          const { emitter } = notify.hash(hash);
          emitter.on('txPool', (transaction) => {
            return {
              message: txMessage(transaction.hash)
            };
          });
        });
    } catch (error) {
      console.error(error);
    }
  };

  const addCollateral = async () => {
    try {
      let { collateralAmount } = form.adjustLoan.values;
      collateralAmount = toWei(collateralAmount);
      if (cryptoFromLenderName === searchArr(DAI).key) {
        await JLoan.methods
          .depositEthCollateral(loanId)
          .send({ value: collateralAmount, from: address })
          .on('transactionHash', (hash) => {
            const { emitter } = notify.hash(hash);
            emitter.on('txPool', (transaction) => {
              return {
                message: txMessage(transaction.hash)
              };
            });
          });
      } else {
        await JLoan.methods
          .depositTokenCollateral(loanId, collateralType, collateralAmount)
          .send({ from: address })
          .on('transactionHash', (hash) => {
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
  };

  const adjustLoan = (e, type) => {
    e.preventDefault();
    if (type) {
      addCollateral();
      closeModal();
    } else {
      withdrawCollateral();
      closeModal();
    }
  };

  const sellToProtocol = async (e) => {
    try {
      e.preventDefault();
      let { shares } = form.sell.values;
      await JLoan.methods.sellToProtocol(loanId, shares)
        .send({ from: address })
        .on('transactionHash', (hash) => {
        const { emitter } = notify.hash(hash);
        emitter.on('txPool', (transaction) => {
          return {
            message: txMessage(transaction.hash)
          };
        });
      });
    } catch (error) {
      console.error(error);
    }
  }

  const openModal = async () => {
    const ready = await readyToTransact(wallet, onboard);
    if (!ready) return;
    address = !address ? onboard.getState().address : address;
    setTokenBalances(web3, address);
    const allowanceResult = await allowanceCheck(pairId, remainingLoan.toString(), address, web3);
    setHasAllowance(allowanceResult);
    const availableInterest = await getAccruedInterests(loanId, web3);
    setAccruedInterest(availableInterest);
    const loanClosingBlock = await getLoanForeclosingBlock(loanId, web3);
    setLoanForeclosingBlock(loanClosingBlock);
    const shares = await getShareholderShares(loanId, address, web3);
    setShareholderShares(shares);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const searchObj = (val) => {
    return Object.fromEntries(
      Object.entries(statuses).filter(([key, value]) => value.status === val)
    );
  };

  const cardToggle = (hash) => {
    console.log('Loan ID: ' + loanId);
    console.log(loan);
    setMoreCardToggle(!moreCardToggle);
    if (!moreCardToggle) {
      getTransaction(hash);
    }
  };

  const getTransaction = async (hash) => {
    const { transaction: transactionUrl } = apiUri;
    setIsLoading(true);
    try {
      const { data: result } = await postRequest(
        transactionUrl,
        {
          data: {
            skip: 0,
            limit: 100,
            filter: {
              loanId,
              contractAddress: hash
            }
          }
        },
        null,
        true
      );
      if (result.status) {
        checkServer(true);
        setIsLoading(false);
        setMoreList(result.result.list);
      } else {
        checkServer(false);
      }
    } catch (error) {
      checkServer(false);
      console.log(error);
    }
  };

  return (
    <TableContentCardWrapper>
      <TableContentCard
        pointer={true}
        onClick={() => cardToggle(contractAddress)}
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
              <img src={image} alt='User' />
            </div>
            <div className='first-col-content'>
              <div className='first-col-title'>
                <h2>{name && name}</h2>
              </div>
              <div className='first-col-subtitle'>
                <h2>{addrShortener(borrowerAddress)}</h2>
                <a
                  href={etherScanUrl + 'address/' + borrowerAddress}
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
              {remainingLoan} <span>{cryptoFromLenderName}</span>
            </h2>
          </div>
        </div>
        <div className='table-fourth-col table-col'>
          <div className='fourth-col-content content-3-col second-4-col-content'>
            <h2>
              {collateralRatio}
              <span>%</span>
            </h2>
          </div>
        </div>
        <div className='table-fifth-col table-col'>
          <div className='fifth-col-content content-3-col second-4-col-content'>
            <h2>
              {apy}%{' '}
              <span>
                ({roundBasedOnUnit(interestPaid, collateralTypeName)}{' '}
                {gweiOrEther(interestPaid, collateralTypeName)})
              </span>
            </h2>
          </div>
        </div>
        <div className='table-second-col table-col'>
          <div className='second-col-content'>
            <StatusTextWrapper
              className='status-text-wrapper'
              color={Object.values(searchObj(status))[0].color}
              backgroundColor={Object.values(searchObj(status))[0].background}
            >
              {Object.values(searchObj(status))[0].key === 'Under Collateralized'
                ? 'Under'
                : valShortner(Object.values(searchObj(status))[0].key)}
            </StatusTextWrapper>
          </div>
        </div>
        <div onClick={(e) => e.stopPropagation()} className='table-sixth-col table-col'>
          <div className='adjust-btn-wrapper'>
            <AdjustLoanBtn
              color={PagesData[path].btnColor}
              disabled={path === 'earn' || disableBtn}
              onClick={path === 'earn' || disableBtn ? undefined : () => openModal()}
            >
              <img
                src={
                  path === 'borrow'
                    ? Adjust
                    : path === 'lend'
                    ? AdjustEarn
                    : path === 'earn'
                    ? AdjustTrade
                    : Adjust
                }
                alt='adjust'
              />
            </AdjustLoanBtn>
          </div>
          <LoanModal
            // State Values
            path={path}
            modalIsOpen={modalIsOpen}
            approveLoading={approveLoading}
            address={address}
            hasBalance={hasBalance}
            hasAllowance={hasAllowance}
            isShareholder={isShareholder}
            shareholdersShares={shareholdersShares}
            canBeForeclosed={canBeForeclosed}
            blocksUntilForeclosure={blocksUntilForeclosure}
            accruedInterest={accruedInterest}
            totalInterest={totalInterest}
            newCollateralRatio={newCollateralRatio}
            setHasAllowance={setHasAllowance}
            setNewCollateralRatio={setNewCollateralRatio}
            // Functions
            closeModal={() => closeModal()}
            approveContract={approveContract}
            adjustLoan={adjustLoan}
            calcNewCollateralRatio={calcNewCollateralRatio}
            closeLoan={closeLoan}
            approveLoan={approveLoan}
            withdrawInterest={withdrawInterest}
            forecloseLoan={forecloseLoan}
            sellToProtocol={sellToProtocol}
            // API Values
            loanId={loanId}
            status={status}
            pairId={pairId}
            contractAddress={contractAddress}
            remainingLoan={remainingLoan}
            cryptoFromLenderName={cryptoFromLenderName}
            collateralAmount={collateralAmount}
            collateralTypeName={collateralTypeName}
            collateralRatio={collateralRatio}
            interestPaid={interestPaid}
            APY={apy}
            rpbRate={rpbRate && fromWei(rpbRate.toString())}
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
                  key={`${i.createdAt} +id: ${Math.random} => ${i.eventName}`}
                  ethImg={ETH}
                  arrow='downArrow'
                  status={i.loanStatus}
                  ratio={i.collateralRatio}
                  createdAt={i.createdAt}
                  hash={i.transactionHash}
                  collateralTypeName={collateralTypeName}
                  cryptoFromLenderName={cryptoFromLenderName}
                  amount={i.amount}
                  amountMetaData={i.metaData && i.metaData.amount}
                  eventName={i.eventName}
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
  form: state.form
});

export default connect(mapStateToProps, {
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
  setTokenBalances,
  checkServer
})(TableCard);
