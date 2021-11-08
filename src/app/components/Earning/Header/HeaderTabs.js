import React, { useState } from 'react';
import { connect } from 'react-redux';
import i18n from '../../locale/i18n';
import { trancheMarketsToggle, setTxModalOpen, setTxModalStatus, setTxModalType, setTxModalLoading } from 'redux/actions/tableData';
import { AaveBtn, CompoundBtn, CompoundBtnBlack, PolygonLogo, PolygonLogoBlack, ETHLOGO, YEARNLOGOLIGHT, YEARNLOGO, FANTOMLOGOLIGHT, FANTOMLOGO } from 'assets';
import TrancheModal from '../../Modals/TrancheModal';
import Carousel from 'react-multi-carousel';
import { MarketsTabsWrapper, MarketsTabs, MarketTab, BridgeTokensWrapper } from './styles/HeaderComponents';
import { ModeThemes } from 'config';
import { HowToLink } from '../../Stake/Table/styles/TableComponents';
import useAnalytics from 'services/analytics';
const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    paritialVisibilityGutter: 60
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    paritialVisibilityGutter: 50
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2,
    paritialVisibilityGutter: 30
  }
};
export const baseUrl = i18n.language === 'en' ? '' : '/' + i18n.language;

const HeaderTabs = ({ data, trancheMarketsToggle, setTxModalOpen, setTxModalStatus, setTxModalLoading, setTxModalType, theme }) => {
  const [modalOpened, setModalOpened] = useState(false);
  const Tracker = useAnalytics('ExternalLinks');

  const { trancheMarket, txModalIsOpen } = data;

  const openModal = () => {
    setModalOpened(true);
    if (!modalOpened) {
      setTxModalOpen(true);
      setTxModalType('trancheMarkets');
    } else {
      trancheMarketsToggle('aavePolygon');
    }
  };
  const closeModal = () => {
    setTxModalOpen(false);
    setTxModalStatus('initialState');
    setTxModalLoading(false);
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
          span={ModeThemes[theme].TrancheBtnSpan}
          background={ModeThemes[theme].TrancheBtnBackground}
          backgroundActive={ModeThemes[theme].TrancheBtnBackgroundCurrent}
          border={ModeThemes[theme].TrancheBtnBorder}
          color={ModeThemes[theme].TrancheBtnColor}
          theme={theme}
          btnShadow={ModeThemes[theme].btnShadow}
        >
          <img src={theme === 'light' ? CompoundBtnBlack : CompoundBtn} alt='' /> 
          <span></span> 
          <img src={ETHLOGO} alt='' />
        </MarketTab>
        <MarketTab
          market='aavePolygon'
          current={trancheMarket === 'aavePolygon'}
          onClick={() => trancheMarketsToggle('aavePolygon')}
          span={ModeThemes[theme].TrancheBtnSpan}
          background={ModeThemes[theme].TrancheBtnBackground}
          backgroundActive={ModeThemes[theme].TrancheBtnBackgroundCurrent}
          border={ModeThemes[theme].TrancheBtnBorder}
          color={ModeThemes[theme].TrancheBtnColor}
          theme={theme}
          btnShadow={ModeThemes[theme].btnShadow}
        >
          <img src={AaveBtn} alt='' /> 
          <span></span> 
          <img src={theme === 'light' ? PolygonLogoBlack : PolygonLogo} alt='' />
        </MarketTab>

        <MarketTab
          market='fantom'
          current={trancheMarket === 'fantom'}
          onClick={() => trancheMarketsToggle('fantom')}
          span={ModeThemes[theme].TrancheBtnSpan}
          background={ModeThemes[theme].TrancheBtnBackground}
          backgroundActive={ModeThemes[theme].TrancheBtnBackgroundCurrent}
          border={ModeThemes[theme].TrancheBtnBorder}
          color={ModeThemes[theme].TrancheBtnColor}
          theme={theme}
          btnShadow={ModeThemes[theme].btnShadow}
        >
          <img src={theme === 'light' ? YEARNLOGOLIGHT : YEARNLOGO} alt='' /> 
          <span></span> 
          <img src={theme === 'light' ? FANTOMLOGOLIGHT : FANTOMLOGO} alt='' />
        </MarketTab>


        
      </MarketsTabs> :
      <Carousel responsive={responsive} arrows={false} partialVisible={true} className="marketsCarousel">
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
          onClick={() => trancheMarketsToggle('aavePolygon')}
          span={ModeThemes[theme].TrancheBtnSpan}
          background={ModeThemes[theme].TrancheBtnBackground}
          backgroundActive={ModeThemes[theme].TrancheBtnBackgroundCurrent}
          border={ModeThemes[theme].TrancheBtnBorder}
          color={ModeThemes[theme].TrancheBtnColor}
          theme={theme}
          btnShadow={ModeThemes[theme].btnShadow}
          mobile
        >
          <img src={AaveBtn} alt='' /> 
          <span></span> 
          <img src={theme === 'light' ? PolygonLogoBlack : PolygonLogo} alt='' />
        </MarketTab>

        <MarketTab
          market='fantom'
          current={trancheMarket === 'fantom'}
          onClick={() => trancheMarketsToggle('fantom')}
          span={ModeThemes[theme].TrancheBtnSpan}
          background={ModeThemes[theme].TrancheBtnBackground}
          backgroundActive={ModeThemes[theme].TrancheBtnBackgroundCurrent}
          border={ModeThemes[theme].TrancheBtnBorder}
          color={ModeThemes[theme].TrancheBtnColor}
          theme={theme}
          btnShadow={ModeThemes[theme].btnShadow}
        >
          <h2>
            <img src={AaveBtn} alt='' /> <span>Market</span>
          </h2>{' '}
          <span></span> <img src={theme === 'light' ? PolygonLogoBlack : PolygonLogo} alt='' />
        </MarketTab>
      </Carousel>
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

export default connect(mapStateToProps, { trancheMarketsToggle, setTxModalOpen, setTxModalStatus, setTxModalLoading, setTxModalType })(HeaderTabs);
