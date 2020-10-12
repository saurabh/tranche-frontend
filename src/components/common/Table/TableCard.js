import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3
} from 'redux/actions/ethereum';
import { initOnboard } from 'services/blocknative';
import { addrShortener, statusShortner, readyToTransact, isGreaterThan } from 'utils';
import { statuses, PagesData, pairData } from 'config/constants';
import styled from 'styled-components';
import { loansFetchData } from 'redux/actions/loans';
import LoanModal from '../Modals/LoanModal';
import UserImg from 'assets/images/svg/userImg.svg';
import Star from 'assets/images/svg/Star.svg';
import Adjust from 'assets/images/svg/adjust.svg';
import AdjustEarn from 'assets/images/svg/adjustEarn.svg';
import AdjustTrade from 'assets/images/svg/adjustTrade.svg';
import LinkArrow from 'assets/images/svg/linkArrow.svg';

const TableContentCardWrapper = styled.div`
  min-height: 66px;
`;
const TableContentCard = styled.div`
  display: flex;
  align-items: center;
  min-height: 66px;
  padding: 0 39px 0 47px;
  border-bottom: 1px solid #efefef;
  cursor: pointer;
  @media (max-width: 1200px) {
    flex-direction: column;
    align-items: flex-end;
    border-bottom: 3px solid #efefef;
    padding: 0 12px;
  }
`;

const TableCard = ({
  loan: {
    status,
    contractAddress,
    remainingLoan,
    cryptoFromLender,
    cryptoFromLenderName,
    collateralRatio,
    interestPaid,
    collateralTypeName,
    collateralType
  },
  path,
  loansFetchData,
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
  ethereum: { address, network, balance, wallet, web3, notify },
  form
}) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [newCollateralRatio, setNewCollateralRatio] = useState(0);
  const [moreCardToggle, setMoreCardToggle] = useState(false);
  const [tooltipToggleRemaining, setTooltipToggleRemaining] = useState(false);
  let disableBtn =
    status === statuses['Foreclosed'].status ||
    status === statuses['Early_closing'].status ||
    status === statuses['Closed'].status ||
    status === statuses['Cancelled'].status;
  const toWei = web3.utils.toWei;

  const onboard = initOnboard({
    address: setAddress,
    network: setNetwork,
    balance: setBalance,
    wallet: setWalletAndWeb3
  });

  useEffect(() => {}, [onboard, address, network, balance, wallet, web3]);

  const searchArr = (key) => pairData.find((i) => i.key === key);

  const calcNewCollateralRatio = async (amount) => {
    try {
      const { loanContractSetup } = searchArr(cryptoFromLenderName);
      const JLoan = loanContractSetup(web3, contractAddress);
      const result = await JLoan.methods.calcRatioAddingCollateral(toWei(amount)).call();
      setNewCollateralRatio(result);
    } catch (error) {
      console.error(error);
    }
  };

  const approveLoan = async () => {
    try {
      const { lendTokenSetup, loanContractSetup } = searchArr(cryptoFromLenderName);
      const JLoan = loanContractSetup(web3, contractAddress);
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
            notify.hash(hash);
          });
        await JLoan.methods
          .lenderSendStableCoins(cryptoFromLender)
          .send({ from: address })
          .on('transactionHash', (hash) => {
            notify.hash(hash);
          })
          .on('receipt', async () => {
            await loansFetchData({
              skip: 0,
              limit: 10000,
              filter: {
                type: null
              }
            });
          });
      } else {
        await JLoan.methods
          .lenderSendStableCoins(cryptoFromLender)
          .send({ from: address })
          .on('transactionHash', (hash) => {
            notify.hash(hash);
          })
          .on('receipt', async () => {
            await loansFetchData({
              skip: 0,
              limit: 10000,
              filter: {
                type: null
              }
            });
          });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const closeLoan = async () => {
    try {
      const { lendTokenSetup, loanContractSetup } = searchArr(cryptoFromLenderName);
      const JLoan = loanContractSetup(web3, contractAddress);
      const lendToken = lendTokenSetup(web3);
      remainingLoan = toWei(remainingLoan.toString());
      if (status === 0) {
        JLoan.methods
          .setLoanCancelled()
          .send({ from: address })
          .on('transactionHash', (hash) => {
            notify.hash(hash);
          })
          .on('receipt', async () => {
            await loansFetchData({
              skip: 0,
              limit: 10000,
              filter: {
                type: null
              }
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
              notify.hash(hash);
            });
          await JLoan.methods
            .loanClosingByBorrower()
            .send({ from: address })
            .on('transactionHash', (hash) => {
              notify.hash(hash);
            })
            .on('receipt', async () => {
              await loansFetchData({
                skip: 0,
                limit: 10000,
                filter: {
                  type: null
                }
              });
            });
        } else {
          await JLoan.methods
            .loanClosingByBorrower()
            .send({ from: address })
            .on('transactionHash', (hash) => {
              notify.hash(hash);
            })
            .on('receipt', async () => {
              await loansFetchData({
                skip: 0,
                limit: 10000,
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
      const { loanContractSetup } = searchArr(cryptoFromLenderName);
      const JLoan = loanContractSetup(web3, contractAddress);
      await JLoan.methods
        .withdrawInterests()
        .send({ from: address })
        .on('transactionHash', (hash) => {
          notify.hash(hash);
        })
        .on('receipt', async () => {
          await loansFetchData({
            skip: 0,
            limit: 10000,
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
      const { loanContractSetup } = searchArr(cryptoFromLenderName);
      const JLoan = loanContractSetup(web3, contractAddress);
      await JLoan.methods
        .initiateLoanForeClose()
        .send({ from: address })
        .on('transactionHash', (hash) => {
          notify.hash(hash);
        })
        .on('receipt', async () => {
          await loansFetchData({
            skip: 0,
            limit: 10000,
            filter: {
              type: null
            }
          });
        });
    } catch (error) {
      console.error(error);
    }
  };

  const addCollateralToEthLoan = async (contractAddress, collateralAmount) => {
    try {
      await web3.eth
        .sendTransaction({
          from: address,
          to: contractAddress,
          value: collateralAmount
        })
        .on('transactionHash', (hash) => {
          notify.hash(hash);
        })
        .on('receipt', async () => {
          await loansFetchData({
            skip: 0,
            limit: 10000,
            filter: {
              type: null
            }
          });
        });
    } catch (error) {
      console.error(error);
    }
  };

  const addCollateralToTokenLoan = async (
    contractAddress,
    collateralAmount,
    cryptoFromLender
  ) => {
    try {
      const { collateralTokenSetup, loanContractSetup } = searchArr(cryptoFromLenderName);
      const JLoanToken = loanContractSetup(web3, contractAddress);
      const collateralToken = collateralTokenSetup(web3);
      let userAllowance = await collateralToken.methods
        .allowance(address, contractAddress)
        .call();
      if (isGreaterThan(collateralAmount, userAllowance)) {
        await collateralToken.methods
          .approve(contractAddress, collateralAmount)
          .send({ from: address })
          .on('transactionHash', (hash) => {
            notify.hash(hash);
          });
        await JLoanToken.methods
          .depositCollateral(cryptoFromLender, collateralAmount)
          .send({ from: address })
          .on('transactionHash', (hash) => {
            notify.hash(hash);
          })
          .on('receipt', async () => {
            await loansFetchData({
              skip: 0,
              limit: 10000,
              filter: {
                type: null
              }
            });
          });
      } else {
        await JLoanToken.methods
          .depositCollateral(cryptoFromLender, collateralAmount)
          .send({ from: address })
          .on('transactionHash', (hash) => {
            notify.hash(hash);
          })
          .on('receipt', async () => {
            await loansFetchData({
              skip: 0,
              limit: 10000,
              filter: {
                type: null
              }
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
    if (cryptoFromLenderName === searchArr(cryptoFromLenderName).key) {
      addCollateralToEthLoan(contractAddress, collateralAmount);
      closeModal();
    } else if (cryptoFromLenderName === searchArr(cryptoFromLenderName).key) {
      addCollateralToTokenLoan(contractAddress, collateralAmount, collateralType);
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

  const searchObj = (val) =>
    Object.fromEntries(
      Object.entries(statuses).filter(([key, value]) => value.status === val)
    );

  const cardToggle = () => {
    setMoreCardToggle(!moreCardToggle);
  };

  const remainingToggle = (hover) => {
    setTooltipToggleRemaining(hover);
  };

  return (
    <TableContentCardWrapper>
      <TableContentCard
        onClick={() => cardToggle()}
        className={moreCardToggle ? 'table-card-toggle' : ''}
      >
        <div className='table-first-col table-col'>
          <div className='table-first-col-wrapper'>
            <div className='first-col-img'>
              <img src={UserImg} alt='User' />
            </div>
            <div className='first-col-content'>
              {/*<div className="first-col-title">
                              <h2>Pragmatic owl</h2>
                          </div>*/}
              <div className='first-col-subtitle'>
                <h2>{addrShortener(contractAddress)}</h2>
                <a
                  href={process.env.REACT_APP_etherScanUrl + contractAddress + '/#internaltx'}
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
          <div className='third-col-content second-4-col-content'>
            <h2
              onMouseEnter={() => remainingToggle(true)}
              onMouseLeave={() => remainingToggle(false)}
            >
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
          <div className='fourth-col-content second-4-col-content'>
            <h2>
              {collateralRatio}
              <span>%</span>
            </h2>
          </div>
        </div>
        <div className='table-fifth-col table-col'>
          <div className='fifth-col-content second-4-col-content'>
            <h2>
              {interestPaid && addrShortener(interestPaid)}{' '}
              <span>{collateralTypeName}</span>
            </h2>
          </div>
        </div>
        <div className='table-second-col table-col'>
          <div className='second-col-content'>
            <h2
              className='status-text-wrapper'
              style={{
                color: Object.values(searchObj(status))[0].color,
                backgroundColor: Object.values(searchObj(status))[0].background
              }}
            >
              {statusShortner(Object.values(searchObj(status))[0].key)}
            </h2>
          </div>
        </div>
        <div onClick={(e) => e.stopPropagation()} className='table-sixth-col table-col'>
          <div className='adjust-btn-wrapper'>
            <button
              style={
                ({ background: PagesData[path].btnColor },
                path === 'trade' || disableBtn
                  ? {
                      backgroundColor: '#cccccc',
                      color: '#666666',
                      cursor: 'default'
                    }
                  : {})
              }
              onClick={path === 'trade' || disableBtn ? undefined : () => openModal()}
              disabled={path === 'trade' || disableBtn}
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
            </button>
          </div>
          <div className='star-btn-wrapper'>
            <button>
              <img src={Star} alt='' />
            </button>
          </div>
          <LoanModal
            status={status}
            path={path}
            modalIsOpen={modalIsOpen}
            closeModal={() => closeModal()}
            approveLoan={approveLoan}
            closeLoan={closeLoan}
            addCollateral={addCollateral}
            withdrawInterest={withdrawInterest}
            forecloseLoan={forecloseLoan}
            newCollateralRatio={newCollateralRatio}
            calcNewCollateralRatio={calcNewCollateralRatio}
          />
        </div>
      </TableContentCard>
      {/* <div
        className={
          "table-card-more " +
          (moreCardToggle ? "table-more-card-toggle" : "")
        }
      >
        <div className="table-card-more-content">
          <TableMoreRow ethImg={ETHGOLD} arrow="upArrow" />
          <TableMoreRow ethImg={ETH} arrow="downArrow" />

          <div className="more-transactions">
            <h2>
              this loan has 11 more transactions in its history.
              <a href="/">show more transactions</a>
            </h2>
          </div>
        </div>
      </div> */}
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
