import React from 'react';
import { connect } from 'react-redux';
import { change } from 'redux-form';
import PropTypes from 'prop-types';
import { fromWei } from 'services/contractMethods';
import { setTokenBalances } from 'redux/actions/ethereum';
import { trancheCardToggle } from 'redux/actions/tableData';
import { checkServer } from 'redux/actions/checkServer';
import { roundNumber, safeDivide, safeMultiply, searchTokenDecimals } from 'utils';
import { statuses, trancheIcons, ModeThemes, landingUrl } from 'config';
import { LinkArrow, ChevronTable, LinkArrowWhite } from 'assets';
import TableMoreRow from './TableMoreRow';

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
  TableCardImgWrapper,
  TrancheRateType
  // TableMoreRowContent
} from '../../Stake/Table/styles/TableComponents';
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
    sliceAPY,
    netAPY,
    apyStatus,
    cryptoType,
    dividendType,
    protocolAPY,
    trancheToken,
    trancheRate,
    network
  },
  setTokenBalances,
  ethereum: { tokenBalance, balance, address },
  change,
  theme,
  isDesktop
  // checkServer
}) => {
  let buyerTokenBalance =
    cryptoType === 'ETH' || cryptoType === 'MATIC'
      ? balance && balance !== -1 && fromWei(balance)
      : searchTokenDecimals(cryptoType)
      ? tokenBalance[buyerCoinAddress] && safeDivide(tokenBalance[buyerCoinAddress], 10 ** searchTokenDecimals(cryptoType).decimals)
      : tokenBalance[buyerCoinAddress] && fromWei(tokenBalance[buyerCoinAddress]);

  const searchObj = (val) => {
    return Object.fromEntries(Object.entries(statuses).filter(([key, value]) => value.status === val));
  };

  const cardToggle = async () => {
    if (trancheCard.status && id === trancheCard.id) {
      trancheCardToggle({ status: false, id });
    } else if ((trancheCard.status && id !== trancheCard.id) || !trancheCard.status) {
      setTimeout(() => {
        address && setTokenBalances(address);
      }, 500);
      change('tranche', 'depositAmount', '');
      change('tranche', 'withdrawAmount', '');
      trancheCardToggle({ status: true, id });
    }
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
                <FirstColTitle color={ModeThemes[theme].tableText} tranche>
                  <a href={`${landingUrl}analytics/${network}/${trancheId}/${type === 'TRANCHE_A' ? 0 : 1}`} target='_blank' rel='noopener noreferrer'>
                    <h2>{cryptoType && cryptoType}</h2>
                    <img src={theme === 'dark' ? LinkArrowWhite : LinkArrow} alt='' />
                  </a>
                </FirstColTitle>
                {/* <FirstColSubtitle>
                  <h2>{type === 'TRANCHE_A' ? 'A' + dividendType : 'B' + dividendType}</h2>
                  <a href={blockExplorerUrl + 'token/' + trancheTokenAddress} target='_blank' rel='noopener noreferrer'>
                    <img src={LinkArrow} alt='' />
                  </a>
                </FirstColSubtitle> */}
              </FirstColContent>
              <TrancheRateType
                TrancheRateColor={type === 'TRANCHE_A' ? ModeThemes[theme].TrancheRateFixedColor : ModeThemes[theme].TrancheRateVariableColor}
                TrancheRateTextColor={theme === 'dark' ? "#FFFFFF" : (type === 'TRANCHE_A' ? ModeThemes[theme].TrancheRateFixedColor : ModeThemes[theme].TrancheRateVariableColor)}
              >
                {type === 'TRANCHE_A' ? 'Fixed' : 'Variable'}
              </TrancheRateType>
            </TableFirstColWrapper>
          </TableFirstCol>

          <TableSecondCol className='table-col' apy>
            <SecondColContent className='content-3-col second-4-col-content' color={ModeThemes[theme].tableText}>
              {/* <img src={apyImage} alt='apyImage' /> */}
              <h2>{roundNumber(netAPY, 2)}%</h2>
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
              network={network}
              trancheId={trancheId}
              trancheValue={trancheValue}
              apyStatus={apyStatus}
              apy={apy}
              sliceAPY={sliceAPY || 0}
              netAPY={netAPY}
              contractAddress={contractAddress}
              cryptoType={cryptoType}
              dividendType={dividendType}
              protocolAPY={protocolAPY}
              buyerTokenBalance={buyerTokenBalance}
              trancheToken={trancheToken}
              trancheRate={trancheRate}
              buyerCoinAddress={buyerCoinAddress}
              trancheTokenAddress={trancheTokenAddress}
            />
          </TableCardMoreContent>
        </TableCardMore>
      </TableContentCardWrapper>
    );
  };
  const TableCardMobile = () => {
    return (
      <TableContentCardWrapperMobile tranche color={ModeThemes[theme].TableCard} borderColor={ModeThemes[theme].TableCardBorderColor} toggleCard={trancheCard.status}>
        <TableContentCardMobile
          color={Object.values(searchObj(1))[0].background}
          onClick={() => cardToggle()}
          className={trancheCard ? 'table-card-toggle' : ''}
          tranche
          trancheMobile
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

          <TableMobileContent trancheMobile>

            <TableMobileContentRow trancheMobile>
              <TableMobileContentCol color={ModeThemes[theme].tableText}>
                <FirstColTitle color={ModeThemes[theme].tableText} tranche trancheMobile>
                    <a href={`${landingUrl}analytics/${network}/${trancheId}/${type === 'TRANCHE_A' ? 0 : 1}`} target='_blank' rel='noopener noreferrer'>
                      <h2>{cryptoType && cryptoType}</h2>
                      {/* <img src={theme === 'dark' ? LinkArrowWhite : LinkArrow} alt='' /> */}
                    </a>
                </FirstColTitle>
              </TableMobileContentCol>
              <TableMobileContentCol color={ModeThemes[theme].tableText} trancheMobileRows>
                <TrancheRateType
                  trancheMobile
                  TrancheRateColor={type === 'TRANCHE_A' ? ModeThemes[theme].TrancheRateFixedColor : ModeThemes[theme].TrancheRateVariableColor}
                  TrancheRateTextColor={theme === 'dark' ? "#FFFFFF" : (type === 'TRANCHE_A' ? ModeThemes[theme].TrancheRateFixedColor : ModeThemes[theme].TrancheRateVariableColor)}
                >
                  {type === 'TRANCHE_A' ? 'Fixed' : 'Variable'}
                </TrancheRateType>
              </TableMobileContentCol>
              <TableMobileContentCol color={ModeThemes[theme].tableText} trancheMobileRows>
                <h2>NET APY</h2>
                <h2>
                  {/* <img src={apyImage} alt='apyImage' /> */}
                  {roundNumber(netAPY, 2)}%
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
              network={network}
              trancheId={trancheId}
              trancheValue={trancheValue}
              apyStatus={apyStatus}
              apy={apy}
              sliceAPY={sliceAPY || 0}
              netAPY={netAPY}
              contractAddress={contractAddress}
              cryptoType={cryptoType}
              dividendType={dividendType}
              protocolAPY={protocolAPY}
              buyerTokenBalance={buyerTokenBalance}
              trancheToken={trancheToken}
              trancheRate={trancheRate}
              buyerCoinAddress={buyerCoinAddress}
              trancheTokenAddress={trancheTokenAddress}
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
  setTokenBalances: PropTypes.func.isRequired,
  trancheCardToggle: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  ethereum: state.ethereum,
  form: state.form,
  trancheCard: state.data.trancheCard,
  theme: state.theme
});

export default connect(mapStateToProps, {
  setTokenBalances,
  checkServer,
  trancheCardToggle,
  change
})(TableCard);