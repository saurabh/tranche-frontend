import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactLoading from 'react-loading';
// import { postRequest } from 'services/axios';
import { useOuterClick } from 'services/useOuterClick';
import { JProtocolSetup, ERC20Setup, JTrancheTokenSetup } from 'utils/contractConstructor';
import { fromWei, toWei, getWithdrawableFunds } from 'services/contractMethods';
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
  readyToTransact,
  isGreaterThan,
  isEqualTo,
  gweiOrEther,
  roundBasedOnUnit
} from 'utils';
import {
  PagesData,
  txMessage,
  etherScanUrl,
  // apiUri,
  statuses
} from 'config';
import TradeModal from '../../Modals/TradeModal';
import {
  Adjust,
  AdjustEarn,
  AdjustTrade,
  CloseModal,
  Info,
  LinkArrow,
  TrancheImg,
  Withdraw
} from 'assets';
import TableMoreRow from './TableMoreRow';
// import ETH from 'assets/images/svg/EthForm.svg';

import {
  TableContentCard,
  TableContentCardWrapper,
  FifthColContent,
  StatusTextWrapper,
  AdjustLoanBtn,
  TableCardTag,
  TableCardImg,
  InfoBoxWrapper,
  InfoBox,
  WithdrawBtnWrapper,
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
  AdustBtnWrapper,
  TableCardMore,
  TableCardMoreContent,
  TableContentCardWrapperMobile,
  TableContentCardMobile,
  TableColMobile,
  TableMobilColContent,
  TableMobilCardBtn
} from '../../Table/styles/TableComponents';

const TableCard = ({
  tranche: {
    name,
    contractAddress,
    trancheId,
    buyerCoinAddress,
    trancheTokenAddress,
    type,
    subscriber,
    rpbRate,
    cryptoType,
    amount
  },
  // trade: { tradeType },
  path,
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
  ethereum: { tokenBalance, trancheTokenBalance, address, wallet, web3, notify },
  form,
  setTokenBalances,
  setTrancheTokenBalances
  // checkServer
}) => {
  const JProtocol = JProtocolSetup(web3);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [InfoBoxToggle, setInfoBoxToggle] = useState(false);
  const [hasAllowance, setHasAllowance] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [hasBalance, setHasBalance] = useState(false);
  const [withdrawableFunds, setWithdrawableFunds] = useState(0);
  const [isDesktop, setDesktop] = useState(window.innerWidth > 1200);
  // const [moreCardToggle, setMoreCardToggle] = useState(false);
  // const [moreList, setMoreList] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [disableBtn, setDisableBtn] = useState(false);
  rpbRate = rpbRate && rpbRate.toString().split('.')[0];
  rpbRate = rpbRate && fromWei(rpbRate);
  let disableBtn = false;
  let isLoading = false;
  let moreCardToggle = false;
  let moreList = false;
  const innerRef = useOuterClick((e) => {
    setInfoBoxToggle(false);
  });
  const availableAmount =
    subscriber === 'N/A' && amount === 'N/A'
      ? 0
      : subscriber === 'N/A'
      ? amount
      : amount - subscriber;

  useEffect(() => {
    const balanceCheck = () => {
      try {
        if (type === 'TRANCHE_A') {
          if (
            cryptoType !== 'N/A' &&
            amount !== 'N/A' &&
            isGreaterThan(
              Number(tokenBalance[cryptoType]),
              Number(toWei(availableAmount.toString()))
            )
          )
            setHasBalance(true);
        } else setHasBalance(true);
      } catch (error) {
        console.error(error);
      }
    };

    balanceCheck();
  }, [amount, type, cryptoType, subscriber, tokenBalance, availableAmount]);

  const updateMedia = () => {
    setDesktop(window.innerWidth > 1200);
  };

  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  });

  const onboard = initOnboard({
    address: setAddress,
    network: setNetwork,
    balance: setBalance,
    wallet: setWalletAndWeb3
  });

  const earnAllowanceCheck = async (amount, sellToggle) => {
    try {
      amount = toWei(amount);
      const token = sellToggle
        ? ERC20Setup(web3, trancheTokenAddress)
        : ERC20Setup(web3, buyerCoinAddress);
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

  const earnApproveContract = async (amount, sellToggle) => {
    try {
      amount = toWei(amount);
      const token = sellToggle
        ? ERC20Setup(web3, trancheTokenAddress)
        : ERC20Setup(web3, buyerCoinAddress);
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

  const buyTrancheTokens = async () => {
    try {
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
  };

  const sellTrancheTokens = async () => {
    try {
      let { amount } = form.sell.values;
      amount = toWei(amount);
      if (type === 'TRANCHE_A') {
        await JProtocol.methods
          .redeemTrancheAToken(trancheId, amount)
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
        await JProtocol.methods
          .redeemTrancheBToken(trancheId, amount)
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

  const buySellTrancheTokens = (e, buyToggle) => {
    try {
      e.preventDefault();
      buyToggle ? buyTrancheTokens() : sellTrancheTokens();
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  const withdrawFundsFromTranche = async () => {
    try {
      const TrancheToken = JTrancheTokenSetup(web3, trancheTokenAddress);
      await TrancheToken.methods
        .withdrawFunds()
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
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = async () => {
    const ready = await readyToTransact(wallet, onboard);
    if (!ready) return;
    address = !address ? onboard.getState().address : address;
    setTokenBalances(address);
    setTrancheTokenBalances(name, trancheTokenAddress, address);
    const result = await getWithdrawableFunds(trancheTokenAddress, address);
    setWithdrawableFunds(fromWei(result));
    setIsOpen(true);
  };

  const widthdrawToggle = () => {
    openModal();
    setWithdrawModal(true);
  }

  const closeModal = () => {
    setIsOpen(false);
    setHasAllowance(false);
    setWithdrawModal(false);
  };

  const searchObj = (val) => {
    return Object.fromEntries(
      Object.entries(statuses).filter(([key, value]) => value.status === val)
    );
  };

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
  let tranche = name === 'ETHDAI Tranche A' || name === 'ETHDAI Tranche B';

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
              <TableCardImg
                tranche={true}
                type={type === 'TRANCHE_A' ? 'A' : type === 'TRANCHE_B' ? 'B' : ''}
                color={type === 'TRANCHE_A' ? '#12BB7E' : type === 'TRANCHE_B' ? '#FD8383' : ''}
              >
                <img src={tranche ? TrancheImg : ''} alt='Tranche' />
              </TableCardImg>
              <FirstColContent>
                <FirstColTitle>
                  <h2>{name && name}</h2>
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
              <h2>
                {type === 'TRANCHE_A' ? amount : subscriber} <span>{cryptoType}</span>
              </h2>
            </SecondColContent>
          </TableSecondCol>
          <TableThirdCol
            className={
              'table-col table-fourth-col-return '
            }
          >
            <ThirdColContent className='content-3-col second-4-col-content'>
              <h2>
                {roundBasedOnUnit(rpbRate, cryptoType)} {gweiOrEther(rpbRate, cryptoType)}
              </h2>
            </ThirdColContent>
          </TableThirdCol>
          <TableFourthCol
            tranche={true}
            className={
              'table-col table-fifth-col-subscription'
            }
          >
            <FourthColContent className='content-3-col second-4-col-content'>
              <h2>{subscriber}</h2>
            </FourthColContent>
          </TableFourthCol>
          <TableFifthCol className='table-col'>
            <FifthColContent>
              <StatusTextWrapper
                className='status-text-wrapper'
                color={Object.values(searchObj(1))[0].color}
                backgroundColor={Object.values(searchObj(1))[0].background}
                table="tranche"
              >
                12%
              </StatusTextWrapper> 

              <WithdrawBtnWrapper>
                <button 
                  onClick={disableBtn ? undefined : () => widthdrawToggle()}
                ><img src={Withdraw} alt="action" /></button>
              </WithdrawBtnWrapper>
              
              
              <InfoBoxWrapper ref={innerRef}>
                  <img src={Info} alt="info" onClick={() => setInfoBoxToggle(!InfoBoxToggle)} />
                  {
                  InfoBoxToggle && <InfoBox>
                      <div>
                        <div>
                          <button>
                            <img src={CloseModal} alt="close" onClick={() => setInfoBoxToggle(false)}  />
                          </button>
                        </div>
                        <div>
                          <h2>ETH Investment Grade</h2>
                          <h2>Fixed Rate Instrument</h2>
                        </div>
                        <div>
                          <p>The ETH investment grade bond is purchased with DAI and pays out a <strong>fixed interest 5% APY</strong> in <strong>ETH</strong>. Returns are generated through ETH:DAI loans borrowed through the Tranche Platform.</p>
                          <p>This instrument has the <strong>highest payment seniority</strong>and is <strong>suitable for low-risk investors</strong> who wish to earn ETH on a block by block pay-out schedule.</p>
                        </div>
                      </div>
                      <div>
                        <div>
                          <button>LEARN MORE BY VISITING OUR DOCS</button>
                        </div>
                      </div>
                    </InfoBox>
                  }
                  
                </InfoBoxWrapper>
                
              
            </FifthColContent>
          </TableFifthCol>
          <TableSixthCol onClick={(e) => e.stopPropagation()} className='table-sixth-col table-col'>
            <AdustBtnWrapper className='adjust-btn-wrapper'>
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
            </AdustBtnWrapper>
            <TradeModal
              // State Values
              path={path}
              modalIsOpen={modalIsOpen}
              hasAllowance={hasAllowance}
              withdraw={withdrawModal}
              approveLoading={approveLoading}
              hasBalance={hasBalance}
              availableAmount={availableAmount}
              trancheTokenBalance={trancheTokenBalance}
              withdrawableFunds={withdrawableFunds}
              // Functions
              closeModal={() => closeModal()}
              earnAllowanceCheck={earnAllowanceCheck}
              earnApproveContract={earnApproveContract}
              buySellTrancheTokens={buySellTrancheTokens}
              withdrawFundsFromTranche={withdrawFundsFromTranche}
              // API Values
              trancheName={name}
              trancheType={type}
              trancheTokenAddress={trancheTokenAddress}
              amount={amount}
              subscriber={subscriber}
              cryptoType={cryptoType}
              rpbRate={rpbRate}
            />
          </TableSixthCol>
        </TableContentCard>
        <TableCardMore className={'table-card-more ' + (moreCardToggle ? 'table-more-card-toggle' : '')}>
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
  }
  const TableCardMobile = () => {
    return (
      <TableContentCardWrapperMobile>
          <TableContentCardMobile>
              <span></span>
              <TableColMobile address>
                  <TableMobilColContent>
                      <h2>{name && name}</h2>
                      <h2>{addrShortener(contractAddress)}</h2>
                  </TableMobilColContent>
              </TableColMobile>

              <TableColMobile>
                  <TableMobilColContent col>
                      <h2>{amount.toString().length > 5 ? amount.toString().substring(0,5) + "... " : amount.toString() + " "}</h2> 
                      <h2>{cryptoType}</h2>
                  </TableMobilColContent>
              </TableColMobile>

              <TableColMobile>
                  <TableMobilColContent col>
                  <h2>{rpbRate}</h2> <h2>%</h2>
                  </TableMobilColContent>
              </TableColMobile>

              <TableColMobile>
                  <TableMobilColContent col>
                    <h2>{subscriber}</h2>
                  </TableMobilColContent>
              </TableColMobile>

              <TableColMobile btn>
                  <TableMobilCardBtn color={PagesData[path].btnColor} className='adjust-btn-wrapper'>
                      <button
                          // disabled={path === 'earn' || disableBtn}
                          onClick={() => openModal()}
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
          <TradeModal
              // State Values
              path={path}
              modalIsOpen={modalIsOpen}
              // approveLoading={approveLoading}
              // hasBalance={hasBalance}
              // hasAllowance={hasAllowance}
              // isShareholder={isShareholder}
              // canBeForeclosed={canBeForeclosed}
              // blocksUntilForeclosure={blocksUntilForeclosure}
              // accruedInterest={accruedInterest}
              // totalInterest={totalInterest}
              // newCollateralRatio={newCollateralRatio}
              // setHasAllowance={setHasAllowance}
              // setNewCollateralRatio={setNewCollateralRatio}
              // Functions
              closeModal={() => closeModal()}
              // approveContract={approveContract}
              // adjustLoan={adjustLoan}
              // calcNewCollateralRatio={calcNewCollateralRatio}
              // closeLoan={closeLoan}
              // approveLoan={approveLoan}
              // withdrawInterest={withdrawInterest}
              // forecloseLoan={forecloseLoan}
              // tradeType={tradeType}
              // // API Values
              // loanId={loanId}
              // status={status}
              // pairId={pairId}
              // contractAddress={contractAddress}
              // remainingLoan={remainingLoan}
              // cryptoFromLenderName={cryptoFromLenderName}
              // collateralAmount={collateralAmount}
              // collateralTypeName={collateralTypeName}
              // collateralRatio={collateralRatio}
              // interestPaid={interestPaid}
              // APY={apy}
              // rpbRate={rpbRate && fromWei(rpbRate.toString())}
            />
      </TableContentCardWrapperMobile>
    );
  }
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
