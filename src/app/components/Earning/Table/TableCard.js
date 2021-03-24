import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { change } from 'redux-form';
import PropTypes from 'prop-types';
import ReactLoading from 'react-loading';
import { useOuterClick } from 'services/useOuterClick';
import { fromWei, toWei, allowanceCheck, buyTrancheTokens, sellTrancheTokens } from 'services/contractMethods';
import { setAddress, setNetwork, setBalance, setWalletAndWeb3, setTokenBalance } from 'redux/actions/ethereum';
import { checkServer } from 'redux/actions/checkServer';
import { initOnboard } from 'services/blocknative';
import {
  addrShortener,
  readyToTransact,
  isGreaterThan,
  // gweiOrEther,
  // roundBasedOnUnit
} from 'utils';
import { PagesData, etherScanUrl, statuses } from 'config';
import { Adjust, AdjustEarn, AdjustTrade, Info, LinkArrow, ArrowGreen, CompoundLogo, ChevronTable, DAITrancheTable } from 'assets';
import TableMoreRow from './TableMoreRow';

import {
  TableContentCard,
  TableContentCardWrapper,
  FifthColContent,
  StatusTextWrapper,
  AdjustLoanBtn,
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
} from '../../Stake/Table/styles/TableComponents';
import i18n from "app/components/locale/i18n";

const TableCard = ({
  tranche: { name, contractAddress, trancheId, buyerCoinAddress, trancheTokenAddress, dividendCoinAddress, type, subscriber, rpbRate, cryptoType, amount },
  path,
  setAddress,
  setNetwork,
  setBalance,
  setWalletAndWeb3,
  ethereum: { tokenBalance, address, wallet },
  change
  // checkServer
}) => {
  const [InfoBoxToggle, setInfoBoxToggle] = useState(false);
  const [hasBalance, setHasBalance] = useState(false);
  const [isDesktop, setDesktop] = useState(window.innerWidth > 1200);
  const [moreCardToggle, setMoreCardToggle] = useState(false);
  rpbRate = rpbRate && rpbRate.toString().split('.')[0];
  rpbRate = rpbRate && fromWei(rpbRate);
  let disableBtn = false;
  let isLoading = false;
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

  const buySellTrancheTokens = (e, buy) => {
    try {
      e.preventDefault();
      buy ? buyTrancheTokens(contractAddress, trancheId, type) : sellTrancheTokens(contractAddress, trancheId, type);
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
    if (!moreCardToggle) {
      const ready = await readyToTransact(wallet, onboard);
      if (!ready) return;
      address = !address ? onboard.getState().address : address;
      setTokenBalance(buyerCoinAddress, address);
      setTokenBalance(trancheTokenAddress, address);
      const depositTokenHasAllowance = await allowanceCheck(buyerCoinAddress, contractAddress, address);
      change('earn', 'depositIsApproved', depositTokenHasAllowance);
      const withdrawTokenHasAllowance = await allowanceCheck(dividendCoinAddress, contractAddress, address);
      change('earn', 'withdrawIsApproved', withdrawTokenHasAllowance);
      setMoreCardToggle(!moreCardToggle);
    }
    setMoreCardToggle(!moreCardToggle);
  };

  const checkLoan = false;
  // let tranche = name === 'ETHDAI Tranche A' || name === 'ETHDAI Tranche B';

  const TableCardDesktop = () => {
    return (
      <TableContentCardWrapper>
        <TableContentCard pointer={true} onClick={() => cardToggle()} className={moreCardToggle ? 'table-card-toggle' : ''}>
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
                  <h2>{addrShortener(contractAddress)}</h2>
                  <a href={etherScanUrl + 'address/' + contractAddress} target='_blank' rel='noopener noreferrer'>
                    <img src={LinkArrow} alt='' />
                  </a>
                </FirstColSubtitle>
              </FirstColContent>
            </TableFirstColWrapper>
          </TableFirstCol>

          <TableSecondCol className='table-col' apy>
            <SecondColContent className='content-3-col second-4-col-content'>
              <img src={ArrowGreen} alt='arrow' />
              {/* <h2>
                {type === 'TRANCHE_A' ? amount : subscriber} <span>{cryptoType}</span>
              </h2> */}
              <h2>100</h2>
              <img src={Info} alt='info' />
            </SecondColContent>
          </TableSecondCol>
          <TableThirdCol className={'table-col table-fourth-col-return '} totalValue>
            <ThirdColContent className='content-3-col second-4-col-content'>
              {/* <h2>
                {roundBasedOnUnit(rpbRate, cryptoType)} {gweiOrEther(rpbRate, cryptoType)}
              </h2> */}
              <h2>100</h2>
            </ThirdColContent>
          </TableThirdCol>
          <TableFourthCol tranche={true} className={'table-col table-fifth-col-subscription'} subscription>
            <FourthColContent className='content-3-col second-4-col-content'>
              {/* <h2>{subscriber}</h2> */}
              <h2>100</h2>
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
                <img src={ChevronTable} alt="ChevronTable" />
              </button>              
            </AdustBtnWrapper>
            {/* <EarnModal
              // State Values
              path={path}
              modalIsOpen={modalIsOpen}
              hasAllowance={hasAllowance}
              withdraw={withdrawModal}
              approveLoading={approveLoading}
              hasBalance={hasBalance}
              availableAmount={availableAmount}
              // withdrawableFunds={withdrawableFunds}
              // Functions
              closeModal={() => closeModal()}
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
            /> */}
          </TableSixthCol>
        </TableContentCard>
        <TableCardMore className={'table-card-more ' + (moreCardToggle ? 'table-more-card-toggle' : '')}>
          <TableCardMoreContent>
            {isLoading ? (
              <ReactLoading className='TableMoreLoading' type={'bubbles'} color='rgba(56,56,56,0.3)' />
            ) : (
              <TableMoreRow
                buyerCoinAddress={buyerCoinAddress}
                dividendCoinAddress={dividendCoinAddress}
                contractAddress={contractAddress}
                buySellTrancheTokens={buySellTrancheTokens}
              />
            )}
          </TableCardMoreContent>
        </TableCardMore>
      </TableContentCardWrapper>
    );
  };
  const TableCardMobile = () => {
    return (
      <TableContentCardWrapperMobile tranche>
        <TableContentCardMobile color={Object.values(searchObj(1))[0].background} onClick={() => cardToggle()} className={moreCardToggle ? 'table-card-toggle' : ''} tranche>
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
              <h2>100</h2>
            </TableMobilColContent>
          </TableColMobile>

          <TableColMobile>
            <TableMobilColContent col>
              {/* <h2>{rpbRate}</h2> <h2>%</h2> */}
              <h2>100</h2>
            </TableMobilColContent>
          </TableColMobile>

          <TableColMobile>
            <TableMobilColContent col>
              {/* <h2>{subscriber}</h2> */}
              <h2>100</h2>
            </TableMobilColContent>
          </TableColMobile>

          <TableColMobile btn>
            <TableMobilCardBtn color={PagesData[path].btnColor} className='adjust-btn-wrapper' chevron>
              <button>
                <img src={ChevronTable} alt="ChevronTable" />
              </button>      
            </TableMobilCardBtn>
          </TableColMobile>
        </TableContentCardMobile>
        <TableCardMore className={'table-card-more ' + (moreCardToggle ? 'table-more-card-toggle' : '')}>
          <TableCardMoreContent>
            {isLoading ? (
              <ReactLoading className='TableMoreLoading' type={'bubbles'} color='rgba(56,56,56,0.3)' />
            ) : (
              <TableMoreRow
                buyerCoinAddress={buyerCoinAddress}
                dividendCoinAddress={dividendCoinAddress}
                contractAddress={contractAddress}
                buySellTrancheTokens={buySellTrancheTokens}
              />
            )}
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
  checkServer,
  change
})(TableCard);
