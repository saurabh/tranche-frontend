import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactLoading from 'react-loading';
import { postRequest } from 'services/axios';
import { JLoanSetup } from 'utils/contractConstructor';
import {
  calcAdjustCollateralRatio,
  fromWei,
  getPairDetails
} from 'services/contractMethods';
import TableMoreRow from './TableMoreRow';

import ETH from 'assets/images/svg/EthForm.svg';

import {
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3
} from 'redux/actions/ethereum';
import { loansFetchData } from 'redux/actions/loans';
import { initOnboard } from 'services/blocknative';
import {
  addrShortener,
  valShortner,
  readyToTransact,
  isGreaterThan,
  roundNumber
} from 'utils';
import {
  statuses,
  PagesData,
  pairData,
  etherScanUrl,
  apiUri,
  USDC,
  DAI,
  generalParams,
  blocksPerYear,
  txMessage
} from 'config';

import LoanModal from '../Modals/LoanModal';
import { UserImg, Star, Adjust, AdjustEarn, AdjustTrade, LinkArrow, Key, Agree } from 'assets';
import {
  TableContentCard,
  TableContentCardWrapper,
  StatusTextWrapper,
  AdjustLoanBtn,
  TableCardTag,
  AdjustModalBtn
} from './styles/TableComponents';

const TableCard = ({
  loan: {
    loanId,
    status,
    contractParams,
    borrowerAddress,
    loanActiveBlock,
    contractAddress,
    remainingLoan,
    apy,
    cryptoFromLender,
    cryptoFromLenderName,
    collateralRatio,
    interestPaid,
    collateralTypeName,
    collateralAmount,
    loanCommonParams,
    collateralType,
    name
  },
  path,
  avatar,
  loansFetchData,
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
  ethereum: { address, wallet, web3, notify },
  form
}) => {
  const JLoan = JLoanSetup(web3, contractAddress);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [newCollateralRatio, setNewCollateralRatio] = useState(0);
  const [moreCardToggle, setMoreCardToggle] = useState(false);
  const [tooltipToggleRemaining, setTooltipToggleRemaining] = useState(false);
  const [moreList, setMoreList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const [isShareholder, setIsShareholder] = useState(false);
  const [APYValue, setAPY] = useState(0);
  const [canBeForeclosed, setCanBeForeclosed] = useState(false);
  const [accruedInterest, setAccruedInterest] = useState(0);
  const { rpbRate } = loanCommonParams;
  const { pairId } = contractParams;
  const toWei = web3.utils.toWei;

  const onboard = initOnboard({
    address: setAddress,
    network: setNetwork,
    balance: setBalance,
    wallet: setWalletAndWeb3
  });
  const userTags = {
    borrower: {
      color: "#5411e2",
      img: Key
    },
    lender: {
      color: "#1ebb1b",
      img: Agree
    }
  }
  const searchArr = (key) => pairData.find((i) => i.key === key);
  const checkLoan = (path === "borrow" && address === borrowerAddress) ? userTags['borrower'] : (path === "earn" && isShareholder) ? userTags['lender'] : false;
  useEffect(() => {
    if (
      (path === 'borrow' && borrowerAddress !== address) ||
      (path === 'borrow' &&
        (status === statuses['Foreclosed'].status ||
          status === statuses['Early_closing'].status ||
          status === statuses['Closing'].status)) ||
      (path === 'earn' &&
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
          const JLoan = JLoanSetup(web3, contractAddress);
          const result = await JLoan.methods.isShareholder(loanId, address).call();
          setIsShareholder(result);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const forecloseWindowCheck = async () => {
      const currentBlock = await web3.eth.getBlockNumber();
      if (currentBlock >= loanActiveBlock + generalParams.foreclosureWindow)
        setCanBeForeclosed(true);
    };

    const calculateAPY = async () => {
      try {
        if (remainingLoan && rpbRate > 0) {
          const result = await getPairDetails(pairId);
          let { pairValue, pairDecimals } = result;
          let APYValue =
            (fromWei(rpbRate) * blocksPerYear * 100 * (pairValue / 10 ** pairDecimals)) /
            remainingLoan;
            APYValue = APYValue.toFixed(2).toString();
          setAPY(APYValue);
        } else {
          setAPY(0);
        }
      } catch (error) {
        console.error(error);
      }
    };

    calculateAPY();
    forecloseWindowCheck();
    isShareholderCheck();
  }, [
    address,
    contractAddress,
    loanId,
    status,
    rpbRate,
    pairId,
    remainingLoan,
    loanActiveBlock,
    web3
  ]);

  useEffect(() => {
    const getAccruedInterest = async () => {
      try {
        const JLoan = JLoanSetup(web3, contractAddress);
        const result = await JLoan.methods.getAccruedInterests(loanId).call();
        setAccruedInterest(web3.utils.fromWei(result));
      } catch (error) {
        console.error(error);
      }
    };

    getAccruedInterest();
  }, [contractAddress, loanId, web3]);

  const calcNewCollateralRatio = async (amount, actionType) => {
    try {
      const result = await calcAdjustCollateralRatio(
        contractAddress,
        loanId,
        amount,
        actionType
      );
      setNewCollateralRatio(result);
    } catch (error) {
      console.error(error);
    }
  };

  const approveLoan = async () => {
    try {
      const { lendTokenSetup } = searchArr(cryptoFromLenderName);
      const lendToken = lendTokenSetup(web3);
      remainingLoan = toWei(remainingLoan.toString());
      let userAllowance = await lendToken.methods
        .allowance(address, contractAddress)
        .call();
      if (isGreaterThan(remainingLoan, userAllowance)) {
        await lendToken.methods
          .approve(contractAddress, remainingLoan)
          .send({ from: address })
          .on('transactionHash', (hash) => {
            const { emitter } = notify.hash(hash);
            emitter.on('txPool', (transaction) => {
              return {
                message: txMessage(transaction.hash)
              };
            });
          });
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
      } else {
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
      }
    } catch (error) {
      console.error(error);
    }
  };

  const closeLoan = async () => {
    try {
      const { lendTokenSetup } = searchArr(cryptoFromLenderName);
      const lendToken = lendTokenSetup(web3);
      remainingLoan = toWei(remainingLoan.toString());
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
        let userAllowance = await lendToken.methods
          .allowance(address, contractAddress)
          .call();
        if (isGreaterThan(remainingLoan, userAllowance)) {
          await lendToken.methods
            .approve(contractAddress, remainingLoan)
            .send({ from: address })
            .on('transactionHash', (hash) => {
              const { emitter } = notify.hash(hash);
              emitter.on('txPool', (transaction) => {
                return {
                  message: txMessage(transaction.hash)
                };
              });
            });
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
            })
            .on('receipt', async () => {
              await loansFetchData({
                skip: 0,
                limit: 100,
                filter: {
                  type: null
                }
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
            })
            .on('receipt', async () => {
              await loansFetchData({
                skip: 0,
                limit: 100,
                filter: {
                  type: null
                }
              });
            });
        }
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
        })
        .on('receipt', async () => {
          await loansFetchData({
            skip: 0,
            limit: 100,
            filter: {
              type: null
            }
          });
        });
    } catch (error) {
      console.error(error);
    }
  };

  const forecloseLoan = async () => {
    try {
      const currentBlock = await web3.eth.getBlockNumber();
      let onChainStatus = await JLoan.methods.getLoanStatus(loanId).call();
      onChainStatus = parseInt(onChainStatus);
      if (
        status === statuses['Under_Collateralized'].status ||
        (status === statuses['At_Risk'].status &&
          onChainStatus === statuses['Active'].status)
      ) {
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
        (currentBlock >= loanActiveBlock + generalParams.foreclosureWindow &&
          status === statuses['Foreclosing'].status)
      ) {
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
    let { collateralAmount } = form.adjustLoan.values;
    collateralAmount = toWei(collateralAmount);
    try {
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
        })
        .on('receipt', async () => {
          await loansFetchData({
            skip: 0,
            limit: 100,
            filter: {
              type: null
            }
          });
        });
    } catch (error) {
      console.error(error);
    }
  };

  const addCollateralToEthLoan = async (collateralAmount) => {
    try {
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
        })
        .on('receipt', async () => {
          await loansFetchData({
            skip: 0,
            limit: 100,
            filter: {
              type: null
            }
          });
        });
    } catch (error) {
      console.error(error);
    }
  };

  const addCollateralToTokenLoan = async (collateralAmount, collateralAddress) => {
    try {
      const { collateralTokenSetup } = searchArr(cryptoFromLenderName);
      const collateralToken = collateralTokenSetup(web3);
      let userAllowance = await collateralToken.methods
        .allowance(address, contractAddress)
        .call();
      if (isGreaterThan(collateralAmount, userAllowance)) {
        await collateralToken.methods
          .approve(contractAddress, collateralAmount)
          .send({ from: address })
          .on('transactionHash', (hash) => {
            const { emitter } = notify.hash(hash);
            emitter.on('txPool', (transaction) => {
              return {
                message: txMessage(transaction.hash)
              };
            });
          });
        await JLoan.methods
          .depositTokenCollateral(loanId, collateralAddress, collateralAmount)
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
          .depositTokenCollateral(loanId, collateralAddress, collateralAmount)
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

  const addCollateral = () => {
    let { collateralAmount } = form.adjustLoan.values;
    collateralAmount = toWei(collateralAmount);
    if (cryptoFromLenderName === searchArr(DAI).key) {
      addCollateralToEthLoan(collateralAmount);
    } else if (cryptoFromLenderName === searchArr(USDC).key) {
      addCollateralToTokenLoan(collateralAmount, collateralType);
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

  const openModal = async () => {
    const ready = await readyToTransact(wallet, onboard);
    if (!ready) return;
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
    console.log(loanId);
    setMoreCardToggle(!moreCardToggle);
    getTransaction(hash);
  };

  const remainingToggle = (hover) => {
    setTooltipToggleRemaining(hover);
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
      setIsLoading(false);
      setMoreList(result.result.list);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TableContentCardWrapper>
      <TableContentCard
        onClick={() => cardToggle(contractAddress)}
        className={moreCardToggle ? 'table-card-toggle' : ''}
      >
        { checkLoan ?
          <TableCardTag color={checkLoan.color}>
            <img src={checkLoan.img} />
          </TableCardTag> : ''
        }
        <div className='table-first-col table-col'>
          <div className='table-first-col-wrapper'>
            <div className='first-col-img'>
              <img src={avatar} alt='User' />
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
            <h2 onMouseEnter={() => remainingToggle(true)} onMouseLeave={() => remainingToggle(false)}>
              {Math.round(remainingLoan)} <span>{cryptoFromLenderName}</span>
            </h2>
            <h2
              className={
                'table-tool-tip ' +
                (tooltipToggleRemaining ? 'table-tool-tip-toggle' : '')
              }
            >
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
              {apy}%
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

            <AdjustLoanBtn color={PagesData[path].btnColor} disabled={path === 'trade' || disableBtn}
              onClick={path === 'trade' || disableBtn ? undefined : () => openModal()}
            >
              <img
                src={
                  path === 'borrow'
                    ? Adjust
                    : path === 'earn'
                      ? AdjustEarn
                      : path === 'trade'
                        ? AdjustTrade
                        : Adjust
                }
                alt=''
              />
            </AdjustLoanBtn>
          </div>
          <LoanModal
            loanId={loanId}
            status={status}
            path={path}
            interestPaid={interestPaid}
            modalIsOpen={modalIsOpen}
            closeModal={() => closeModal()}
            contractAddress={contractAddress}
            isShareholder={isShareholder}
            canBeForeclosed={canBeForeclosed}
            accruedInterest={accruedInterest}
            approveLoan={approveLoan}
            closeLoan={closeLoan}
            APY={apy}
            adjustLoan={adjustLoan}
            withdrawCollateral={withdrawCollateral}
            withdrawInterest={withdrawInterest}
            forecloseLoan={forecloseLoan}
            newCollateralRatio={newCollateralRatio}
            setNewCollateralRatio={setNewCollateralRatio}
            calcNewCollateralRatio={calcNewCollateralRatio}
            rpbRate={loanCommonParams && fromWei(rpbRate)}
            collateralAmount={collateralAmount}
            collateralRatio={collateralRatio}
            remainingLoan={remainingLoan}
            collateralTypeName={collateralTypeName}
            cryptoFromLenderName={cryptoFromLenderName}
          />
        </div>
      </TableContentCard>
      <div
        className={'table-card-more ' + (moreCardToggle ? 'table-more-card-toggle' : '')}
      >
        <div className='table-card-more-content'>
          {isLoading ? (
            <ReactLoading
              className='TableMoreLoading'
              type={'bubbles'}
              color='rgba(56,56,56,0.3)'
            />
          ) : (
            moreList &&
            moreList.map((i, index) => {
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
                  interest={i.interestPaid}
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
  loansFetchData,
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3
})(TableCard);
