import React, { useState } from 'react';
import { connect } from 'react-redux';
import { destroy } from 'redux-form';
import PropTypes from 'prop-types';
import { ERC20Setup } from 'utils/contractConstructor';
import { toWei, buyTrancheTokens, sellTrancheTokens, fromWei } from 'services/contractMethods';
import { setAddress, setNetwork, setBalance, setWalletAndWeb3, toggleApproval, setTxLoading } from 'redux/actions/ethereum';
import useAnalytics from 'services/analytics';
import { trancheCardToggle } from 'redux/actions/tableData';
import { checkServer } from 'redux/actions/checkServer';
import { initOnboard } from 'services/blocknative';
import { addrShortener, readyToTransact, roundNumber, safeMultiply } from 'utils';
import { statuses, ApproveBigNumber, txMessage, trancheIcons, tokenDecimals, ETHorMaticCheck, ModeThemes, networkId } from 'config';
import { Lock, LockLight, LinkArrow, Up, Down, ChevronTable } from 'assets';
import TableMoreRow from './TableMoreRow';
import { useNotification } from "../../Notifications/NotificationProvider";

import {
  TableContentCard,
  TableContentCardWrapper,
  FifthColContent,
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
  TableMobileContent,
  TableMobileContentRow,
  TableMobileContentCol,
  TableCardImgWrapper
  // TableMoreRowContent
} from '../../Stake/Table/styles/TableComponents';
import { maticNetworkId } from 'config';
// import i18n from 'app/components/locale/i18n';

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
    trancheValueUSD,
    trancheValue,
    subscriptionUSD,
    cryptoTypePrice,
    subscription,
    apy,
    apyStatus,
    cryptoType,
    dividendType,
    protocolAPY,
    trancheToken,
    trancheRate
  },
  path,
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
  ethereum: { tokenBalance, balance, address, wallet, web3, network, notify, blockExplorerUrl, txOngoing },
  toggleApproval,
  setTxLoading,
  destroy,
  theme,
  isDesktop
  // checkServer
}) => {
  // const [isLoading, setIsLoading] = useState(false);
  const [isDepositApproved, setDepositApproved] = useState(false);
  const [isWithdrawApproved, setWithdrawApproved] = useState(false);
  const dispatch = useNotification();

  const apyImage =
    apyStatus && apyStatus === 'fixed'
      ? theme === 'light'
        ? LockLight
        : Lock
      : apyStatus === 'increase'
      ? Up
      : apyStatus === 'decrease'
      ? Down
      : '';
  const Tracker = useAnalytics('ButtonClicks');

  const searchArr = (key) => tokenDecimals.find((i) => i.key === key);
  let buyerTokenBalance =
    ETHorMaticCheck.indexOf(cryptoType) !== -1
      ? balance && balance !== -1 && fromWei(balance)
      : searchArr(cryptoType)
      ? tokenBalance[buyerCoinAddress] && fromWei(tokenBalance[buyerCoinAddress], 'Mwei')
      : tokenBalance[buyerCoinAddress] && fromWei(tokenBalance[buyerCoinAddress]);

  const onboard = initOnboard({
    address: setAddress,
    network: setNetwork,
    balance: setBalance,
    wallet: setWalletAndWeb3
  });

  const approveContract = async (type, isApproved, e) => {
    try {
      if (txOngoing) e.stopPropogation();
      const ready = await readyToTransact(wallet, onboard);
      if (!ready) return;
      const amount = isApproved ? 0 : toWei(ApproveBigNumber);
      const tokenAddress = type ? buyerCoinAddress : trancheTokenAddress;
      const token = ERC20Setup(web3, tokenAddress);
      await token.methods
        .approve(contractAddress, amount)
        .send({ from: address })
        .on('transactionHash', (hash) => {
          setTxLoading(true);
          if (network === networkId) {
            const { emitter } = notify.hash(hash);
            emitter.on('txPool', (transaction) => {
              return {
                message: txMessage(transaction.hash)
              };
            });
            emitter.on('txCancel', () => setTxLoading(false));
            emitter.on('txFailed', () => setTxLoading(false));
          }
          else if(network === maticNetworkId){
            dispatch({
              action: "ADD_NOTIFICATION",
              type: "PENDING",
              message: txMessage(hash),
              title: "pending transaction"
            })
          }
        })
        .on('confirmation', (count) => {
          if (count === 1) {
            type ? setDepositApproved(!isApproved) : setWithdrawApproved(!isApproved);
            toggleApproval(tokenAddress, contractAddress, !isApproved);
            setTxLoading(false);
            destroy('tranche');
            if(network === maticNetworkId){
              dispatch({
                action: "ADD_NOTIFICATION",
                type: "SUCCESS",
                message: "Your transaction has succeeded",
                title: "successful transaction"
              })
            }
          }
        });
    } catch (error) {
      return error;
    }
  };

  const buySellTrancheTokens = async (e, buy) => {
    try {
      e.preventDefault();
      const ready = await readyToTransact(wallet, onboard);
      if (!ready) return;
      buy ? buyTrancheTokens(contractAddress, trancheId, type, cryptoType) : sellTrancheTokens(contractAddress, trancheId, type);
      buy ? Tracker('Deposit', 'User address: ' + address) : Tracker('Withdraw', 'User address: ' + address);
    } catch (error) {
      console.error(error);
    }
  };

  const searchObj = (val) => {
    return Object.fromEntries(Object.entries(statuses).filter(([key, value]) => value.status === val));
  };

  const cardToggle = async () => {
    if (trancheCard.status && id === trancheCard.id) {
      trancheCardToggle({ status: false, id });
    } else if ((trancheCard.status && id !== trancheCard.id) || !trancheCard.status) {
      // setIsLoading(true);
      destroy('tranche');
      trancheCardToggle({ status: true, id });
    }
    // setIsLoading(false);
  };

  const checkLoan = false;

  const TableCardDesktop = () => {
    return (
      <TableContentCardWrapper
        color={ModeThemes[theme].TableCard}
        borderColor={ModeThemes[theme].TableCardBorderColor}
        shadow={ModeThemes[theme].tableCardShadow}
        cardShadow={ModeThemes[theme].cardShadow}
        tranche
      >
        <TableContentCard
          pointer={true}
          onClick={() => cardToggle()}
          // className={trancheCard.status && id === trancheCard.id ? 'table-card-toggle' : ''}
          border={trancheCard.status && id === trancheCard.id}
          color={ModeThemes[theme].borderColor}
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
                background={type === 'TRANCHE_A' ? '#68D2FF' : '#FF7A7F'}
                // type={type === 'TRANCHE_A' ? 'A' : type === 'TRANCHE_B' ? 'B' : ''}
                // color={type === 'TRANCHE_A' ? '#12BB7E' : type === 'TRANCHE_B' ? '#FD8383' : ''}
              >
                <img src={trancheIcons[trancheToken] && trancheIcons[trancheToken].protocolIcon} alt='ProtocolIcon' />
                <span>
                  <img src={trancheIcons[trancheToken] && trancheIcons[trancheToken].assetIcon} alt='AssetIcon' />
                </span>
              </TableCardImg>
              <FirstColContent instrument>
                <FirstColTitle color={ModeThemes[theme].tableText}>
                  <h2>{name && name}</h2>
                </FirstColTitle>
                <FirstColSubtitle>
                  <h2>{addrShortener(trancheTokenAddress)}</h2>
                  <a href={blockExplorerUrl + 'address/' + trancheTokenAddress} target='_blank' rel='noopener noreferrer'>
                    <img src={LinkArrow} alt='' />
                  </a>
                </FirstColSubtitle>
              </FirstColContent>
            </TableFirstColWrapper>
          </TableFirstCol>

          <TableSecondCol className='table-col' apy>
            <SecondColContent className='content-3-col second-4-col-content' color={ModeThemes[theme].tableText}>
              <img src={apyImage} alt='apyImage' />
              <h2>{roundNumber(apy, 2)}%</h2>
            </SecondColContent>
          </TableSecondCol>
          <TableThirdCol className={'table-col table-fourth-col-return '} totalValue>
            <ThirdColContent className='content-3-col second-4-col-content' color={ModeThemes[theme].tableText}>
              <h2>${roundNumber(trancheValueUSD)}</h2>
              <h2>
                ({roundNumber(trancheValue)} {cryptoType})
              </h2>
            </ThirdColContent>
          </TableThirdCol>
          <TableFourthCol tranche={true} className={'table-col table-fifth-col-subscription'} subscription>
            <FourthColContent className='content-3-col second-4-col-content' color={ModeThemes[theme].tableText}>
              <h2>${roundNumber(subscriptionUSD)}</h2>
              <h2>
                ({subscription ? roundNumber(subscription) : '0'} {trancheToken})
              </h2>
            </FourthColContent>
          </TableFourthCol>
          <TableFifthCol className='table-col' status>
            <FifthColContent color={ModeThemes[theme].tableText}>
              <h2>${buyerTokenBalance && cryptoTypePrice ? roundNumber(safeMultiply(cryptoTypePrice, buyerTokenBalance)) : '0'}</h2>
              <h2>
                ({buyerTokenBalance ? roundNumber(buyerTokenBalance) : '0'} {cryptoType})
              </h2>

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
            <AdustBtnWrapper className='adjust-btn-wrapper' chevron status={trancheCard.status && id === trancheCard.id}>
              <button>
                <img src={ChevronTable} alt='ChevronTable' />
              </button>
            </AdustBtnWrapper>
          </TableSixthCol>
        </TableContentCard>

        <TableCardMore
          className={'table-card-more ' + (trancheCard.status && id === trancheCard.id ? 'table-more-card-toggle' : '')}
          color={ModeThemes[theme].borderColor}
          border={trancheCard.status && id === trancheCard.id}
        >
          <TableCardMoreContent>
            <TableMoreRow
              name={name}
              type={type}
              apy={apy}
              contractAddress={contractAddress}
              cryptoType={cryptoType}
              dividendType={dividendType}
              protocolAPY={protocolAPY}
              buyerTokenBalance={buyerTokenBalance}
              trancheToken={trancheToken}
              trancheRate={trancheRate}
              buyerCoinAddress={buyerCoinAddress}
              trancheTokenAddress={trancheTokenAddress}
              isDepositApproved={isDepositApproved}
              setDepositApproved={setDepositApproved}
              isWithdrawApproved={isWithdrawApproved}
              setWithdrawApproved={setWithdrawApproved}
              approveContract={approveContract}
              buySellTrancheTokens={buySellTrancheTokens}
            />
          </TableCardMoreContent>
        </TableCardMore>
      </TableContentCardWrapper>
    );
  };
  const TableCardMobile = () => {
    return (
      <TableContentCardWrapperMobile tranche color={ModeThemes[theme].TableCard} borderColor={ModeThemes[theme].TableCardBorderColor}>
        <TableContentCardMobile
          color={Object.values(searchObj(1))[0].background}
          onClick={() => cardToggle()}
          className={trancheCard ? 'table-card-toggle' : ''}
          tranche
        >
          <TableCardImgWrapper>
            <TableCardImg
              tranche={true}
              background={type === 'TRANCHE_A' ? '#68D2FF' : '#FF7A7F'}
              // type={type === 'TRANCHE_A' ? 'A' : type === 'TRANCHE_B' ? 'B' : ''}
              // color={type === 'TRANCHE_A' ? '#12BB7E' : type === 'TRANCHE_B' ? '#FD8383' : ''}
            >
              <img src={trancheIcons[trancheToken] && trancheIcons[trancheToken].protocolIcon} alt='ProtocolIcon' />
              <span>
                <img src={trancheIcons[trancheToken] && trancheIcons[trancheToken].assetIcon} alt='AssetIcon' />
              </span>
            </TableCardImg>
          </TableCardImgWrapper>

          <TableMobileContent>
            <TableMobileContentRow>
              <TableFirstColWrapper>
                <FirstColContent instrument>
                  <FirstColTitle color={ModeThemes[theme].tableText} tranche>
                    <h2>{name && name}</h2>
                    <AdustBtnWrapper className='adjust-btn-wrapper' chevron status={trancheCard.status && id === trancheCard.id}>
                      <button>
                        <img src={ChevronTable} alt='ChevronTable' />
                      </button>
                    </AdustBtnWrapper>
                  </FirstColTitle>
                  <FirstColSubtitle>
                    <h2>{addrShortener(trancheTokenAddress)}</h2>
                    <a href={blockExplorerUrl + 'address/' + trancheTokenAddress} target='_blank' rel='noopener noreferrer'>
                      <img src={LinkArrow} alt='' />
                    </a>
                  </FirstColSubtitle>
                </FirstColContent>
              </TableFirstColWrapper>
            </TableMobileContentRow>

            <TableMobileContentRow>
              <TableMobileContentCol color={ModeThemes[theme].tableText}>
                <h2>annual yield (apy)</h2>
                <h2>
                  <img src={apyImage} alt='apyImage' />
                  {roundNumber(apy, 2)}%{/* <img src={Info} alt='infoImage' /> */}
                </h2>
              </TableMobileContentCol>
              <TableMobileContentCol color={ModeThemes[theme].tableText}>
                <h2>Total Deposits</h2>
                <h2>${roundNumber(trancheValueUSD)}</h2>
                <h2>
                  {trancheValue ? roundNumber(trancheValue) : '0'} <span>{cryptoType}</span>
                </h2>
              </TableMobileContentCol>
              <TableMobileContentCol color={ModeThemes[theme].tableText}>
                <h2>My Deposits</h2>
                <h2>${roundNumber(subscriptionUSD)}</h2>
                <h2>
                  {subscription ? roundNumber(subscription) : '0'} <span>{trancheToken}</span>
                </h2>
              </TableMobileContentCol>
            </TableMobileContentRow>
          </TableMobileContent>
        </TableContentCardMobile>

        <TableCardMore
          className={'table-card-more ' + (trancheCard.status && id === trancheCard.id ? 'table-more-card-toggle' : '')}
          color={ModeThemes[theme].backgroundBorder}
          border={trancheCard.status && id === trancheCard.id}
        >
          <TableCardMoreContent>
            <TableMoreRow
              name={name}
              type={type}
              apy={apy}
              contractAddress={contractAddress}
              cryptoType={cryptoType}
              dividendType={dividendType}
              protocolAPY={protocolAPY}
              buyerTokenBalance={buyerTokenBalance}
              trancheToken={trancheToken}
              trancheRate={trancheRate}
              buyerCoinAddress={buyerCoinAddress}
              trancheTokenAddress={trancheTokenAddress}
              isDepositApproved={isDepositApproved}
              setDepositApproved={setDepositApproved}
              isWithdrawApproved={isWithdrawApproved}
              setWithdrawApproved={setWithdrawApproved}
              approveContract={approveContract}
              buySellTrancheTokens={buySellTrancheTokens}
            />
          </TableCardMoreContent>
        </TableCardMore>
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
  setWalletAndWeb3: PropTypes.func.isRequired,
  trancheCardToggle: PropTypes.func.isRequired,
  toggleApproval: PropTypes.func.isRequired,
  setTxLoading: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  ethereum: state.ethereum,
  form: state.form,
  trancheCard: state.data.trancheCard,
  theme: state.theme
});

export default connect(mapStateToProps, {
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
  checkServer,
  trancheCardToggle,
  setTxLoading,
  toggleApproval,
  destroy
})(TableCard);
