import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { JLoanSetup } from 'utils/contractConstructor';
import {
  toWei,
  fromWei,
  getLoanStatus,
  calcAdjustCollateralRatio,
  getLoanForeclosingBlock,
  getAccruedInterests,
  allowanceCheck
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
  isGreaterThan
} from 'utils';
import { statuses, PagesData, pairData, DAI, txMessage } from 'config';
import LoanModal from '../Modals/LoanModal';
import { Adjust, AdjustEarn, AdjustTrade } from 'assets';

import {
    TableContentCardWrapperMobile,
    TableContentCardMobile,
    TableColMobile,
    TableMobilColContent,
    TableMobilCardBtn
} from './styles/TableComponents';

const TableCardMobile = ({
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
}) => {
  const JLoan = JLoanSetup(web3);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [newCollateralRatio, setNewCollateralRatio] = useState(0);
  const [approveLoading, setApproveLoading] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const [hasBalance, setHasBalance] = useState(false);
  const [hasAllowance, setHasAllowance] = useState(false);
  const [isShareholder, setIsShareholder] = useState(false);
  const [blocksUntilForeclosure, setBlocksUntilForeclosure] = useState(0);
  const [loanForeclosingBlock, setLoanForeclosingBlock] = useState(0);
  const [canBeForeclosed, setCanBeForeclosed] = useState(false);
  const [accruedInterest, setAccruedInterest] = useState(0);

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
          const result = lenderAddress.indexOf(address.toLowerCase());
          if (result !== -1) setIsShareholder(true);
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
    // if (loanId === 20) {
    //   console.log(currentBlock >= result + Number(foreclosureWindow))
    //   console.log(result + Number(foreclosureWindow) - currentBlock)
    // }
    // if (currentBlock >= loanClosingBlock + Number(foreclosureWindow)) setCanBeForeclosed(true);
    // setBlocksUntilForeclosure(loanClosingBlock + Number(foreclosureWindow) - currentBlock);
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


  return (
    <TableContentCardWrapperMobile>
        <TableContentCardMobile color={Object.values(searchObj(status))[0].background}>
            <span></span>
            <TableColMobile address>
                <TableMobilColContent>
                    <h2>{name && name}</h2>
                    <h2>{addrShortener(borrowerAddress)}</h2>
                </TableMobilColContent>
            </TableColMobile>

            <TableColMobile>
                <TableMobilColContent col>
                    <h2>{remainingLoan}</h2>
                    <h2>{cryptoFromLenderName}</h2>
                </TableMobilColContent>
            </TableColMobile>

            <TableColMobile>
                <TableMobilColContent col>
                    <h2>{collateralRatio}%</h2>
                    <h2>{Object.values(searchObj(status))[0].key === 'Under Collateralized'
                ? 'Under'
                : valShortner(Object.values(searchObj(status))[0].key)}</h2>
                </TableMobilColContent>
            </TableColMobile>

            <TableColMobile>
                <TableMobilColContent col>
                    <h2>{apy}%</h2>
                    <h2>apy</h2>
                </TableMobilColContent>
            </TableColMobile>

            <TableColMobile btn>
                <TableMobilCardBtn color={PagesData[path].btnColor} className='adjust-btn-wrapper'>
                    <button
                        disabled={path === 'earn' || disableBtn}
                        onClick={path === 'earn' || disableBtn ? undefined : () => openModal()}
                    ><img alt="adjust" 
                    src= {
                        path === 'borrow'
                          ? Adjust
                          : path === 'lend'
                          ? AdjustEarn
                          : path === 'earn'
                          ? AdjustTrade
                          : Adjust
                      } /></button>
                </TableMobilCardBtn>
            </TableColMobile>

        </TableContentCardMobile>
        <LoanModal
            // State Values
            path={path}
            modalIsOpen={modalIsOpen}
            approveLoading={approveLoading}
            hasBalance={hasBalance}
            hasAllowance={hasAllowance}
            isShareholder={isShareholder}
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
    </TableContentCardWrapperMobile>
  );
};

TableCardMobile.propTypes = {
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
})(TableCardMobile);