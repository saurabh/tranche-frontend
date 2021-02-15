import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactLoading from 'react-loading';
// import { postRequest } from 'services/axios';
// import { useOuterClick } from 'services/useOuterClick';
import { JProtocolSetup, ERC20Setup } from 'utils/contractConstructor';
import { fromWei, toWei } from 'services/contractMethods';
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
  gweiOrEther,
  roundBasedOnUnit
} from 'utils';
import {
  PagesData,
  txMessage,
  etherScanUrl
  // apiUri
} from 'config';
import TradeModal from '../../Modals/TradeModal';
import {
  Adjust,
  AdjustEarn,
  AdjustTrade,
  // CloseModal,
  // Info,
  LinkArrow,
  TrancheImg
} from 'assets';
import TableMoreRow from './TableMoreRow';
// import ETH from 'assets/images/svg/EthForm.svg';

import {
  TableContentCard,
  TableContentCardWrapper,
  // StatusTextWrapper,
  AdjustLoanBtn,
  TableCardTag,
  TableCardImg
  // InfoBoxWrapper,
  // InfoBox
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
  // const [InfoBoxToggle, setInfoBoxToggle] = useState(false);
  const [hasAllowance, setHasAllowance] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [hasBalance, setHasBalance] = useState(false);
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
  // const innerRef = useOuterClick((e) => {
  //   setInfoBoxToggle(false);
  // });
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

  const onboard = initOnboard({
    address: setAddress,
    network: setNetwork,
    balance: setBalance,
    wallet: setWalletAndWeb3
  });

  const allowanceCheck = async (amount, sellToggle) => {
    try {
      amount = toWei(amount);
      const token = sellToggle ? ERC20Setup(web3, trancheTokenAddress) : ERC20Setup(web3, buyerCoinAddress);
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

  const approveContract = async (amount, sellToggle) => {
    try {
      amount = toWei(amount);
      const token =  sellToggle ? ERC20Setup(web3, trancheTokenAddress) : ERC20Setup(web3, buyerCoinAddress);
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
          .redeemTrancheBToken(trancheId, amount)
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

  const buySellTrancheTokens = (e, buyToggle) => {
    try {
      e.preventDefault();
      buyToggle ? buyTrancheTokens() : sellTrancheTokens();
    } catch (error) {
      console.error(error);
    }
  }

  const openModal = async () => {
    const ready = await readyToTransact(wallet, onboard);
    if (!ready) return;
    address = !address ? onboard.getState().address : address;
    setTokenBalances(web3, address);
    setTrancheTokenBalances();
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
  let tranche = name === 'ETHDAI Tranche A' || name === 'ETHDAI Tranche B';
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
            <TableCardImg
              tranche={true}
              type={type === 'TRANCHE_A' ? 'A' : type === 'TRANCHE_B' ? 'B' : ''}
              color={type === 'TRANCHE_A' ? '#12BB7E' : type === 'TRANCHE_B' ? '#FD8383' : ''}
            >
              <img src={tranche ? TrancheImg : ''} alt='Tranche' />
            </TableCardImg>
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
              {type === 'TRANCHE_A' ? amount : subscriber} <span>{cryptoType}</span>
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
              {roundBasedOnUnit(rpbRate, cryptoType)} {gweiOrEther(rpbRate, cryptoType)}
            </h2>
          </div>
        </div>
        <div
          className={
            'table-col ' + (path === 'earn' ? 'table-fifth-col-subscription ' : 'table-fifth-col')
          }
        >
          <div className='fifth-col-content content-3-col second-4-col-content'>
            <h2>{subscriber}</h2>
          </div>
        </div>
        <div className='table-second-col table-col'>
          <div className='second-col-content'>
            {/* <StatusTextWrapper
              // className='status-text-wrapper'
              // color={Object.values(searchObj(status))[0].color}
              // backgroundColor={Object.values(searchObj(status))[0].background}
            > */}
            {/* {Object.values(searchObj(status))[0].key === 'Under Collateralized'
                ? 'Under'
                : valShortner(Object.values(searchObj(status))[0].key)} */}
            {/* </StatusTextWrapper> 
            
            
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
            
            */}
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
            hasBalance={hasBalance}
            availableAmount={availableAmount}
            trancheTokenBalance={trancheTokenBalance}
            // Functions
            closeModal={() => closeModal()}
            allowanceCheck={allowanceCheck}
            approveContract={approveContract}
            buySellTrancheTokens={buySellTrancheTokens}
            // API Values
            trancheName={name}
            trancheType={type}
            amount={amount}
            subscriber={subscriber}
            cryptoType={cryptoType}
            rpbRate={rpbRate}
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
