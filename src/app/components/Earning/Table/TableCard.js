import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { change, destroy } from 'redux-form';
import PropTypes from 'prop-types';
import ReactLoading from 'react-loading';
import axios from 'axios';
import { useOuterClick } from 'services/useOuterClick';
import { ERC20Setup } from 'utils/contractConstructor';
import { toWei, allowanceCheck, buyTrancheTokens, sellTrancheTokens } from 'services/contractMethods';
import { setAddress, setNetwork, setBalance, setWalletAndWeb3, setTokenBalance } from 'redux/actions/ethereum';
import { trancheCardToggle } from 'redux/actions/tableData';
import { checkServer } from 'redux/actions/checkServer';
import { initOnboard } from 'services/blocknative';
import {
  addrShortener,
  readyToTransact,
  isGreaterThan,
  roundNumber
  // gweiOrEther,
  // roundBasedOnUnit
} from 'utils';
import { PagesData, etherScanUrl, statuses, zeroAddress, ApproveBigNumber, txMessage, apiUri, serverUrl } from 'config';
import { Lock, Info, LinkArrow, Up, Down, CompoundLogo, ChevronTable, DAITrancheTable, InfoWhite } from 'assets';
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
  AdustBtnWrapper,
  TableCardMore,
  TableCardMoreContent,
  TableContentCardWrapperMobile,
  TableContentCardMobile,
  TableColMobile,
  TableMobilColContent,
  TableMobilCardBtn
  // TableMoreRowContent
} from '../../Stake/Table/styles/TableComponents';
import i18n from 'app/components/locale/i18n';
const { graphUri } = apiUri;

const TableCard = ({
  id,
  trancheCard,
  trancheCardToggle,
  tranche: {
    name,
    contractAddress,
    trancheId,
    buyerCoinAddress,
    trancheTokenAddress,
    type,
    subscriber,
    subscription,
    apy,
    apyStatus,
    cryptoType,
    trancheToken,
    amount
  },
  path,
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
  setTokenBalance,
  ethereum: { tokenBalance, address, wallet, web3, notify },
  change,
  destroy
  // checkServer
}) => {
  const [InfoBoxToggle, setInfoBoxToggle] = useState(false);
  const [graphData, setGraphData] = useState(false);
  const [hasBalance, setHasBalance] = useState(false);
  const [isDesktop, setDesktop] = useState(window.innerWidth > 1200);
  const [isLoading, setIsLoading] = useState(false);
  const [isApproveLoading, setApproveLoading] = useState(false);
  const [isDepositApproved, setDepositApproved] = useState(false);
  const [isWithdrawApproved, setWithdrawApproved] = useState(false);
  const [isEth, setIsEth] = useState(false);
  const apyImage = apyStatus && apyStatus === 'fixed' ? Lock : apyStatus === 'increase' ? Up : apyStatus === 'decrease' ? Down : '';
  const graphTimeFrame = 'date';
  const innerRef = useOuterClick((e) => {
    setInfoBoxToggle(false);
  });
  const availableAmount = subscriber === 'N/A' && amount === 'N/A' ? 0 : subscriber === 'N/A' ? amount : amount - subscriber;

  useEffect(() => {
    const balanceCheck = () => {
      try {
        if (type === 'TRANCHE_A') {
          if (cryptoType !== 'N/A' && amount !== 'N/A' && isGreaterThan(Number(tokenBalance[cryptoType]), Number(toWei(availableAmount.toString()))))
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

  const approveContract = async (type, isApproved, e) => {
    try {
      if (isApproveLoading) e.stopPropogation();
      const amount = isApproved ? 0 : toWei(ApproveBigNumber);
      const tokenAddress = type ? buyerCoinAddress : trancheTokenAddress;
      const token = ERC20Setup(web3, tokenAddress);
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
        })
        .on('confirmation', () => {
          type ? setDepositApproved(!isApproved) : setWithdrawApproved(!isApproved);
          setApproveLoading(false);
        });
    } catch (error) {
      return error;
    }
  };

  const buySellTrancheTokens = (e, buy) => {
    try {
      e.preventDefault();
      buy
        ? cryptoType === 'ETH'
          ? buyTrancheTokens(contractAddress, trancheId, type, true)
          : buyTrancheTokens(contractAddress, trancheId, type, false)
        : sellTrancheTokens(contractAddress, trancheId, type);
    } catch (error) {
      console.error(error);
    }
  };

  // const openModal = async () => {
  //   const ready = await readyToTransact(wallet, onboard);
  //   if (!ready) return;
  // };

  // const closeModal = () => {
  // };

  const searchObj = (val) => {
    return Object.fromEntries(Object.entries(statuses).filter(([key, value]) => value.status === val));
  };

  const cardToggle = async () => {
    const ready = await readyToTransact(wallet, onboard);
    if (!ready) return;
    address = !address ? onboard.getState().address : address;

    if (trancheCard.status && id === trancheCard.id) {
      trancheCardToggle({ status: false, id });
    } else if ((trancheCard.status && id !== trancheCard.id) || !trancheCard.status) {
      setIsLoading(true);
      destroy('tranche');
      const res = await axios(
        `${serverUrl + graphUri}trancheId=${trancheId}&contractAddress=${contractAddress}&type=${graphTimeFrame}&trancheType=${type}`
      );
      const { result } = res.data;
      setGraphData(result);
      if (buyerCoinAddress === zeroAddress) {
        setIsEth(true);
        await setTokenBalance(trancheTokenAddress, address);
        const withdrawTokenHasAllowance = await allowanceCheck(trancheTokenAddress, contractAddress, address);
        setDepositApproved(true);
        setWithdrawApproved(withdrawTokenHasAllowance);
        change('tranche', 'withdrawIsApproved', withdrawTokenHasAllowance);
      } else {
        await setTokenBalance(buyerCoinAddress, address);
        await setTokenBalance(trancheTokenAddress, address);
        const depositTokenHasAllowance = await allowanceCheck(buyerCoinAddress, contractAddress, address);
        setDepositApproved(depositTokenHasAllowance);
        change('tranche', 'depositIsApproved', depositTokenHasAllowance);
        const withdrawTokenHasAllowance = await allowanceCheck(trancheTokenAddress, contractAddress, address);
        setWithdrawApproved(withdrawTokenHasAllowance);
        change('tranche', 'withdrawIsApproved', withdrawTokenHasAllowance);
      }
      trancheCardToggle({ status: true, id });
    }
    setIsLoading(false);
  };

  const checkLoan = false;
  // let tranche = name === 'ETHDAI Tranche A' || name === 'ETHDAI Tranche B';

  const TableCardDesktop = () => {
    return (
      <TableContentCardWrapper>
        <TableContentCard
          pointer={true}
          onClick={() => cardToggle()}
          className={trancheCard.status && id === trancheCard.id ? 'table-card-toggle' : ''}
        >
          {checkLoan ? (
            <TableCardTag color={checkLoan.color}>
              <img src={checkLoan.img} alt='checkLoan' />
            </TableCardTag>
          ) : (
            ''
          )}
          <TableFirstCol className='table-col' platform>
            <TableFirstColWrapper>
              <TableCardImg
                tranche={true}
                // type={type === 'TRANCHE_A' ? 'A' : type === 'TRANCHE_B' ? 'B' : ''}
                // color={type === 'TRANCHE_A' ? '#12BB7E' : type === 'TRANCHE_B' ? '#FD8383' : ''}
              >
                <img src={CompoundLogo} alt='CompoundLogo' />
                <span>
                  <img src={DAITrancheTable} alt='DAITrancheTable' />
                </span>
              </TableCardImg>
            </TableFirstColWrapper>
          </TableFirstCol>
          <TableFirstCol className='table-col' instrument>
            <TableFirstColWrapper>
              <FirstColContent instrument>
                <FirstColTitle>
                  <h2>{name && name}</h2>
                </FirstColTitle>
                <FirstColSubtitle>
                  <h2>{addrShortener(trancheTokenAddress)}</h2>
                  <a href={etherScanUrl + 'address/' + trancheTokenAddress} target='_blank' rel='noopener noreferrer'>
                    <img src={LinkArrow} alt='' />
                  </a>
                </FirstColSubtitle>
              </FirstColContent>
            </TableFirstColWrapper>
          </TableFirstCol>

          <TableSecondCol className='table-col' apy>
            <SecondColContent className='content-3-col second-4-col-content' tooltip={InfoBoxToggle}>
              <img src={apyImage} alt='apyImage' />
              <h2>{apy}</h2>
              <div>
                <img src={Info} alt='infoImage' onMouseEnter={() => setInfoBoxToggle(true)} onMouseLeave={() => setInfoBoxToggle(false)} />
                <div>
                  <h2>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.
                  </h2>
                </div>
              </div>
            </SecondColContent>
          </TableSecondCol>
          <TableThirdCol className={'table-col table-fourth-col-return '} totalValue>
            <ThirdColContent className='content-3-col second-4-col-content'>
              <h2>{roundNumber(subscriber)}</h2>
            </ThirdColContent>
          </TableThirdCol>
          <TableFourthCol tranche={true} className={'table-col table-fifth-col-subscription'} subscription>
            <FourthColContent className='content-3-col second-4-col-content'>
              <h2>{subscription ? roundNumber(subscription) : '0'}</h2>
            </FourthColContent>
          </TableFourthCol>
          <TableFifthCol className='table-col' status>
            <FifthColContent>
              <StatusTextWrapper
                className='status-text-wrapper'
                color={Object.values(searchObj(1))[0].color}
                backgroundColor={Object.values(searchObj(1))[0].background}
              >
                {i18n.t('tranche.table.statuses.active')}
              </StatusTextWrapper>

              {/* <InfoBoxWrapper ref={innerRef}>
                <img src={Info} alt='info' onClick={() => setInfoBoxToggle(!InfoBoxToggle)} />
                {InfoBoxToggle && (
                  <InfoBox>
                    <div>
                      <div>
                        <button>
                          <img src={CloseModal} alt='close' onClick={() => setInfoBoxToggle(false)} />
                        </button>
                      </div>
                      <div>
                        <h2>ETH Investment Grade</h2>
                        <h2>Fixed Rate Instrument</h2>
                      </div>
                      <div>
                        <p>
                          The ETH investment grade bond is purchased with DAI and pays out a <strong>fixed interest 5% APY</strong> in{' '}
                          <strong>ETH</strong>. Returns are generated through ETH:DAI loans borrowed through the Tranche Platform.
                        </p>
                        <p>
                          This instrument has the <strong>highest payment seniority</strong>and is <strong>suitable for low-risk investors</strong>{' '}
                          who wish to earn ETH on a block by block pay-out schedule.
                        </p>
                      </div>
                    </div>
                    <div>
                      <div>
                        <button>LEARN MORE BY VISITING OUR DOCS</button>
                      </div>
                    </div>
                  </InfoBox>
                )}
              </InfoBoxWrapper> */}
            </FifthColContent>
          </TableFifthCol>
          <TableSixthCol className='table-sixth-col table-col' trancheTableBtns>
            <AdustBtnWrapper className='adjust-btn-wrapper' chevron>
              <button>
                <img src={ChevronTable} alt='ChevronTable' />
              </button>
            </AdustBtnWrapper>
          </TableSixthCol>
        </TableContentCard>
        {isLoading ? (
          <TableCardMoreContent>
            <ReactLoading className='TableMoreLoading' type={'bubbles'} color='rgba(56,56,56,0.3)' />
          </TableCardMoreContent>
        ) : (
          <TableCardMore className={'table-card-more ' + (trancheCard.status && id === trancheCard.id ? 'table-more-card-toggle' : '')}>
            <TableCardMoreContent>
              <TableMoreRow
                graphData={graphData}
                isEth={isEth}
                cryptoType={cryptoType}
                buyerCoinAddress={buyerCoinAddress}
                trancheToken={trancheToken}
                trancheTokenAddress={trancheTokenAddress}
                isApproveLoading={isApproveLoading}
                isDepositApproved={isDepositApproved}
                isWithdrawApproved={isWithdrawApproved}
                approveContract={approveContract}
                buySellTrancheTokens={buySellTrancheTokens}
              />
            </TableCardMoreContent>
          </TableCardMore>
        )}
      </TableContentCardWrapper>
    );
  };
  const TableCardMobile = () => {
    return (
      <TableContentCardWrapperMobile tranche>
        <TableContentCardMobile
          color={Object.values(searchObj(1))[0].background}
          onClick={() => cardToggle()}
          className={trancheCard ? 'table-card-toggle' : ''}
          tranche
        >
          <span></span>
          <TableColMobile address>
            <TableMobilColContent>
              <h2>{name && name}</h2>
              <h2>{addrShortener(contractAddress)}</h2>
            </TableMobilColContent>
          </TableColMobile>

          <TableColMobile>
            <TableMobilColContent col>
              {/* <h2>{amount.toString().length > 5 ? amount.toString().substring(0, 5) + '... ' : amount.toString() + ' '}</h2>
              <h2>{cryptoType}</h2> */}
              <h2>{apy}</h2>
              <h2>{cryptoType}</h2>
            </TableMobilColContent>
          </TableColMobile>

          <TableColMobile>
            <TableMobilColContent col>
              <h2>{apy}</h2> <h2>%</h2>
            </TableMobilColContent>
          </TableColMobile>

          <TableColMobile>
            <TableMobilColContent col>
              <h2>{roundNumber(subscriber)}</h2>
            </TableMobilColContent>
          </TableColMobile>

          <TableColMobile btn>
            <TableMobilCardBtn color={PagesData[path].btnColor} className='adjust-btn-wrapper' chevron>
              <button>
                <img src={ChevronTable} alt='ChevronTable' />
              </button>
            </TableMobilCardBtn>
          </TableColMobile>
        </TableContentCardMobile>
        {isLoading ? (
          <TableCardMore className={'table-card-more'}>
            <TableCardMoreContent>
              <ReactLoading className='TableMoreLoading' type={'bubbles'} color='rgba(56,56,56,0.3)' />
            </TableCardMoreContent>
          </TableCardMore>
        ) : (
          <TableCardMore className={'table-card-more ' + (trancheCard.status && id === trancheCard.id ? 'table-more-card-toggle' : '')}>
            <TableCardMoreContent>
              <TableMoreRow
                graphData={graphData}
                isEth={isEth}
                cryptoType={cryptoType}
                buyerCoinAddress={buyerCoinAddress}
                trancheToken={trancheToken}
                trancheTokenAddress={trancheTokenAddress}
                isApproveLoading={isApproveLoading}
                isDepositApproved={isDepositApproved}
                isWithdrawApproved={isWithdrawApproved}
                approveContract={approveContract}
                buySellTrancheTokens={buySellTrancheTokens}
              />
            </TableCardMoreContent>
          </TableCardMore>
        )}
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
  trancheCard: state.data.trancheCard
});

export default connect(mapStateToProps, {
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
  setTokenBalance,
  checkServer,
  trancheCardToggle,
  change,
  destroy
})(TableCard);
