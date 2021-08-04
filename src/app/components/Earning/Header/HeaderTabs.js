import React, { useState } from 'react';
import { connect } from 'react-redux';
import i18n from '../../locale/i18n';
import { trancheMarketsToggle, setTxModalOpen } from 'redux/actions/tableData';
import { AaveBtn, CompoundBtn, CompoundBtnBlack, PolygonLogo, PolygonLogoBlack } from 'assets';
import TrancheModal from '../../Modals/TrancheModal';
import { MarketsTabsWrapper, MarketsTabs, MarketTab, BridgeTokensWrapper } from './styles/HeaderComponents';
import { ModeThemes } from 'config';
import { HowToLink } from '../../Stake/Table/styles/TableComponents';
import useAnalytics from 'services/analytics';

export const baseUrl = i18n.language === 'en' ? '' : '/' + i18n.language;

const HeaderTabs = ({ data, trancheMarketsToggle, setTxModalOpen, theme }) => {
  const [modalOpened, setModalOpened] = useState(false);
  const Tracker = useAnalytics('ExternalLinks');

  const { trancheMarket, txModalIsOpen } = data;

  const openModal = () => {
    setModalOpened(true);
    if (!modalOpened) {
      setTxModalOpen(true);
    } else {
      trancheMarketsToggle('aavePolygon');
    }
  };
  
  const closeModal = () => {
    setTxModalOpen(false);
    // onClick={() => trancheMarketsToggle("aavePolygon")}>
  };

  return (
    <MarketsTabsWrapper color={ModeThemes[theme].TrancheMarketsTitle} className='TrancheMarkets'>
      <div>
        <h2>{i18n.t('tranche.trancheData.TrancheMarkets')}</h2>
        <HowToLink
          href='https://docs.tranche.finance/tranchefinance/'
          onClick={(e) => Tracker('Documentation', 'https://docs.tranche.finance/tranchefinance/')}
          target='_blank'
          rel='noopener noreferrer'
          color={ModeThemes[theme].HowToText}
          background={ModeThemes[theme].HowTo}
          shadow={ModeThemes[theme].HowToShadow}
          border={ModeThemes[theme].HowToBorder}
        >
          {i18n.t('footer.docs')}
        </HowToLink>
      </div>
      <MarketsTabs>
        <MarketTab
          market='compound'
          current={trancheMarket === 'compound'}
          onClick={() => trancheMarketsToggle('compound')}
          background={ModeThemes[theme].TrancheBtnBackground}
          backgroundActive={ModeThemes[theme].TrancheBtnBackgroundCurrent}
          border={ModeThemes[theme].TrancheBtnBorder}
          color={ModeThemes[theme].TrancheBtnColor}
          theme={theme}
          btnShadow={ModeThemes[theme].btnShadow}
        >
          <img src={theme === 'light' ? CompoundBtnBlack : CompoundBtn} alt='' />
        </MarketTab>
        <MarketTab
          market='aavePolygon'
          current={trancheMarket === 'aavePolygon'}
          onClick={() => trancheMarket !== 'aavePolygon' && openModal()}
          span={ModeThemes[theme].TrancheBtnSpan}
          background={ModeThemes[theme].TrancheBtnBackground}
          backgroundActive={ModeThemes[theme].TrancheBtnBackgroundCurrent}
          border={ModeThemes[theme].TrancheBtnBorder}
          color={ModeThemes[theme].TrancheBtnColor}
          theme={theme}
          btnShadow={ModeThemes[theme].btnShadow}
        >
          <h2>
            <img src={AaveBtn} alt='' /> Market
          </h2>{' '}
          <span></span> <img src={theme === 'light' ? PolygonLogoBlack : PolygonLogo} alt='' />
        </MarketTab>
      </MarketsTabs>
      {trancheMarket === 'aavePolygon' && (
        <BridgeTokensWrapper>
          <p>
            To use Polygon markets, you will need to use the Polygon bridge to move your tokens from the Ethereum mainnet to the Polygon side chain.
            After moving your assets to the Polygon side chain, you can buy different instruments on Tranche, trade on the Quickswap DEX, and explore
            other applications on the Polygon network.
          </p>
          <a href='https://wallet.matic.network/login/' target='_blank' rel='noopener noreferrer'>
            <button>Bridge Tokens</button>
          </a>
        </BridgeTokensWrapper>
      )}
      <TrancheModal closeModal={() => closeModal()} />
    </MarketsTabsWrapper>
  );
};

const mapStateToProps = (state) => {
  return {
    data: state.data,
    theme: state.theme
  };
};

export default connect(mapStateToProps, { trancheMarketsToggle, setTxModalOpen })(HeaderTabs);
