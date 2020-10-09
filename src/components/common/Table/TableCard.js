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
import { loansFetchData } from 'redux/actions/loans';
import TableMoreRow from './TableMoreRow';
import LoanModal from '../Modals/LoanModal';
import UserImg from 'assets/images/svg/userImg.svg';
import Star from 'assets/images/svg/Star.svg';
import ETHGOLD from 'assets/images/svg/ethGold.svg';
import ETH from 'assets/images/svg/eth.svg';
import Adjust from 'assets/images/svg/adjust.svg';
import AdjustEarn from 'assets/images/svg/adjustEarn.svg';
import AdjustTrade from 'assets/images/svg/adjustTrade.svg';

import styled from 'styled-components';
import { addrShortener, statusShortner, readyToTransact } from 'utils';
import { statuses, etherScanUrl, NA } from 'config/constants';
import LinkArrow from 'assets/images/svg/linkArrow.svg';
import { ColorData } from 'config/constants';
import {
  JLoanEthSetup,
  JLoanTokenSetup,
  DAISetup,
  USDCSetup
} from 'utils/contractConstructor';
import { isGreaterThan } from 'utils/helperFunctions';
import { DAI, USDC } from 'config/constants';

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
  loan,
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
  const [moreCardToggle, setMoreCardToggle] = useState(false);
  const [tooltipToggleRemaining, setTooltipToggleRemaining] = useState(false);
  let disableBtn = status === 5 || status === 6 || status === 7 || status === 8 || status === 9;
  const toWei = web3.utils.toWei;

  const onboard = initOnboard({
    address: setAddress,
    network: setNetwork,
    balance: setBalance,
    wallet: setWalletAndWeb3
  });

  useEffect(() => {}, [onboard, address, network, balance, wallet, web3]);

  //console.log(loan);

  const approveEthLoan = async (loanAddress, loanAmount, stableCoinAddress) => {
    try {
      const JLoanEth = JLoanEthSetup(web3, loanAddress);
      const DAI = DAISetup(web3);
      let userAllowance = await DAI.methods
        .allowance(address, loanAddress)
        .call();
      if (isGreaterThan(loanAmount, userAllowance)) {
        await DAI.methods
          .approve(loanAddress, loanAmount)
          .send({ from: address })
          .on('transactionHash', (hash) => {
            notify.hash(hash);
          });
        await JLoanEth.methods
          .lenderSendStableCoins(stableCoinAddress)
          .send({ from: address })
          .on('transactionHash', (hash) => {
            notify.hash(hash);
          })
          .on('receipt', async () => {
            await loansFetchData({
              skip: 0,
              limit: 10000,
              filter: {
                type: null //ETH/JNT keep these in constant file
              }
            });
          });
      } else {
        await JLoanEth.methods
          .lenderSendStableCoins(stableCoinAddress)
          .send({ from: address })
          .on('transactionHash', (hash) => {
            notify.hash(hash);
          })
          .on('receipt', async () => {
            await loansFetchData({
              skip: 0,
              limit: 10000,
              filter: {
                type: null //ETH/JNT keep these in constant file
              }
            });
          });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const approveTokenLoan = async (
    loanAddress,
    loanAmount,
    stableCoinAddress
  ) => {
    try {
      const JLoanToken = JLoanTokenSetup(web3, loanAddress);
      const USDC = USDCSetup(web3);
      let userAllowance = await USDC.methods
        .allowance(address, loanAddress)
        .call();
      console.log(userAllowance, loanAmount);
      console.log(loanAddress);
      console.log(stableCoinAddress);
      if (isGreaterThan(loanAmount, userAllowance)) {
        await USDC.methods
          .approve(loanAddress, loanAmount)
          .send({ from: address })
          .on('transactionHash', (hash) => {
            notify.hash(hash);
          });
        await JLoanToken.methods
          .lenderSendStableCoins(stableCoinAddress)
          .send({ from: address })
          .on('transactionHash', (hash) => {
            notify.hash(hash);
          })
          .on('receipt', async () => {
            await loansFetchData({
              skip: 0,
              limit: 10000,
              filter: {
                type: null //ETH/JNT keep these in constant file
              }
            });
          });
      } else {
        await JLoanToken.methods
          .lenderSendStableCoins(stableCoinAddress)
          .send({ from: address })
          .on('transactionHash', (hash) => {
            notify.hash(hash);
          })
          .on('receipt', async () => {
            await loansFetchData({
              skip: 0,
              limit: 10000,
              filter: {
                type: null //ETH/JNT keep these in constant file
              }
            });
          });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const approveLoan = () => {
    remainingLoan = toWei(remainingLoan.toString());
    if (cryptoFromLenderName === DAI) {
      approveEthLoan(contractAddress, remainingLoan, cryptoFromLender);
    } else if (cryptoFromLenderName === USDC) {
      approveTokenLoan(contractAddress, remainingLoan, cryptoFromLender);
    }
  };

  const addCollateralToEthLoan = async (loanAddress, collateralAmount) => {
    try {
      await web3.eth
        .sendTransaction({
          from: address,
          to: loanAddress,
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
              type: null //ETH/JNT keep these in constant file
            }
          });
        });
    } catch (error) {
      console.error(error);
    }
  };

  const addCollateralToTokenLoan = async (
    loanAddress,
    collateralAmount,
    stableCoinAddress
  ) => {
    try {
      const JLoanToken = JLoanTokenSetup(web3, loanAddress);
      await JLoanToken.methods
        .depositCollateral(stableCoinAddress, collateralAmount)
        .send({ from: address })
        .on('transactionHash', (hash) => {
          notify.hash(hash);
        })
        .on('receipt', async () => {
          await loansFetchData({
            skip: 0,
            limit: 10000,
            filter: {
              type: null //ETH/JNT keep these in constant file
            }
          });
        });
    } catch (error) {
      console.error(error);
    }
  };

  const addCollateral = () => {
    let { collateralAmount } = form.adjustLoan.values;
    collateralAmount = toWei(collateralAmount);
    if (cryptoFromLenderName === DAI) {
      let contractAddress = '0x844a8375bf59725D8bDbEe4885afe7f33e7aFD12';
      addCollateralToEthLoan(contractAddress, collateralAmount);
      closeModal();
    } else if (cryptoFromLenderName === USDC) {
      let contractAddress = '0x2eb5518d5C86cd9778Ee2668940064686c537cDc';
      addCollateralToTokenLoan(
        contractAddress,
        collateralAmount,
        collateralType
      );
      closeModal();
    }
  };

  const closeEthLoan = async (loanAddress, loanAmount) => {
    try {
      const JLoanEth = JLoanEthSetup(web3, loanAddress);
      const DAI = DAISetup(web3);
      if (status === 0) {
        JLoanEth.methods
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
                type: null //ETH/JNT keep these in constant file
              }
            });
          });
      } else {
        let userAllowance = await DAI.methods
          .allowance(address, loanAddress)
          .call();
        if (isGreaterThan(loanAmount, userAllowance)) {
          await DAI.methods
            .approve(loanAddress, loanAmount)
            .send({ from: address })
            .on('transactionHash', (hash) => {
              notify.hash(hash);
            });
          await JLoanEth.methods
            .loanClosing()
            .send({ from: address })
            .on('transactionHash', (hash) => {
              notify.hash(hash);
            })
            .on('receipt', async () => {
              await loansFetchData({
                skip: 0,
                limit: 10000,
                filter: {
                  type: null //ETH/JNT keep these in constant file
                }
              });
            });
        } else {
          await JLoanEth.methods
            .loanClosing()
            .send({ from: address })
            .on('transactionHash', (hash) => {
              notify.hash(hash);
            })
            .on('receipt', async () => {
              await loansFetchData({
                skip: 0,
                limit: 10000,
                filter: {
                  type: null //ETH/JNT keep these in constant file
                }
              });
            });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const closeTokenLoan = async (loanAddress, loanAmount) => {
    try {
      const JLoanToken = JLoanTokenSetup(web3, loanAddress);
      const USDC = USDCSetup(web3);
      if (status === 0) {
        JLoanToken.methods
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
                type: null //ETH/JNT keep these in constant file
              }
            });
          });
      } else {
        let userAllowance = await USDC.methods
          .allowance(address, loanAddress)
          .call();
        if (isGreaterThan(loanAmount, userAllowance)) {
          await USDC.methods
            .approve(loanAddress, loanAmount)
            .send({ from: address })
            .on('transactionHash', (hash) => {
              notify.hash(hash);
            });
          await JLoanToken.methods
            .loanClosing()
            .send({ from: address })
            .on('transactionHash', (hash) => {
              notify.hash(hash);
            })
            .on('receipt', async () => {
              await loansFetchData({
                skip: 0,
                limit: 10000,
                filter: {
                  type: null //ETH/JNT keep these in constant file
                }
              });
            });
        } else {
          await JLoanToken.methods
            .loanClosing()
            .send({ from: address })
            .on('transactionHash', (hash) => {
              notify.hash(hash);
            })
            .on('receipt', async () => {
              await loansFetchData({
                skip: 0,
                limit: 10000,
                filter: {
                  type: null //ETH/JNT keep these in constant file
                }
              });
            });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const closeLoan = () => {
    remainingLoan = toWei(remainingLoan.toString());
    if (cryptoFromLenderName === DAI) {
      closeEthLoan(contractAddress, remainingLoan);
    } else if (cryptoFromLenderName === USDC) {
      closeTokenLoan(contractAddress, remainingLoan);
    }
  };

  async function openModal() {
    const ready = await readyToTransact(wallet, onboard);
    if (!ready) return;
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

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
                  href={etherScanUrl + contractAddress + '/#internaltx'}
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
                color: statuses[status].color,
                backgroundColor: statuses[status].background
              }}
            >
              {statusShortner(statuses[status].status)}
            </h2>
          </div>
        </div>
        <div
          onClick={(e) => e.stopPropagation()}
          className='table-sixth-col table-col'
        >
          <div className='adjust-btn-wrapper'>
            <button
              style={
                ({ background: ColorData[path].btnColor },
                path === 'trade' || disableBtn
                  ? {
                      backgroundColor: '#cccccc',
                      color: '#666666',
                      cursor: 'default'
                    }
                  : {})
              }
              onClick={
                path === 'trade' || disableBtn ? false : () => openModal()
              }
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
