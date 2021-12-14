import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import i18n from '../../locale/i18n';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { trancheMarketsToggle, setTxModalOpen, setTxModalStatus, setTxModalType, setTxModalLoading } from 'redux/actions/tableData';
import { AaveBtn, AAVEIconMobile, CloseModalWhite, CompoundBtn, CompoundBtnBlack, CompoundIconMobile, AVAX, ETHLOGO, FantomDark, FantomLight, FANTOMLOGO, FANTOMLOGOLIGHT, PolygonLogo, PolygonLogoBlack, YEARNIconMobile, YEARNLOGO, YEARNLOGOLIGHT } from 'assets';
import TrancheModal from '../../Modals/TrancheModal';
import { MarketsTabsWrapper, MarketsTabs, MarketTab, BridgeTokensWrapper } from './styles/HeaderComponents';
import { ModeThemes } from 'config';
import { HowToLink } from '../../Stake/Table/styles/TableComponents';
import useAnalytics from 'services/analytics';
import { networkId, maticNetworkId, fantomNetworkId, avalancheNetworkId } from 'config/constants'

export const baseUrl = i18n.language === 'en' ? '' : '/' + i18n.language;

const HeaderTabs = ({ ethereum: { network }, data, trancheMarketsToggle, setTxModalOpen, setTxModalStatus, setTxModalLoading, setTxModalType, theme }) => {
  const Tracker = useAnalytics('ExternalLinks');
  const { trancheMarket } = data;
  const [isDesktop, setDesktop] = useState(window.innerWidth > 992);
  const [tranchesToggle, setTranchesToggle] = useState('compound');
  
  
  const updateMedia = () => {
    setDesktop(window.innerWidth > 992);
  };
  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  });

  const trancheMarketsToggling = (val) => {
    setTranchesToggle(val);
    trancheMarketsToggle(val);
  }
  useEffect(() => {
    let trancheMarkets = network === networkId
        ? 'compound'
        : (network === maticNetworkId
          ? 'aavePolygon'
          : (network === fantomNetworkId
            ? 'fantom'
            : (network === avalancheNetworkId
              ? 'avalanche'
            : '')));
    setTranchesToggle(trancheMarkets);
  }, [network]);
  
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
      { isDesktop ?

      <MarketsTabs>
        
        <MarketTab
          market='compound'
          current={trancheMarket === 'compound' && network === networkId}
          onClick={() => trancheMarketsToggling('compound')}
          span={ModeThemes[theme].TrancheBtnSpan}
          background={ModeThemes[theme].TrancheBtnBackground}
          backgroundActive={ModeThemes[theme].TrancheBtnBackgroundCurrent}
          border={ModeThemes[theme].TrancheBtnBorder}
          color={ModeThemes[theme].TrancheBtnColor}
          theme={theme}
          btnShadow={ModeThemes[theme].btnShadow}
        >
          <img src={isDesktop ? (theme === 'light' ? CompoundBtnBlack : CompoundBtn) : CompoundIconMobile} alt='' /> 
          <span></span> 
          <img src={ETHLOGO} alt='' />
        </MarketTab>
        <MarketTab
          market='aavePolygon'
          current={trancheMarket === 'aavePolygon' && (network === maticNetworkId)}
          onClick={() => trancheMarketsToggling('aavePolygon')}
          span={ModeThemes[theme].TrancheBtnSpan}
          background={ModeThemes[theme].TrancheBtnBackground}
          backgroundActive={ModeThemes[theme].TrancheBtnBackgroundCurrent}
          border={ModeThemes[theme].TrancheBtnBorder}
          color={ModeThemes[theme].TrancheBtnColor}
          theme={theme}
          btnShadow={ModeThemes[theme].btnShadow}
        >
          <img src={isDesktop ? AaveBtn : AAVEIconMobile} alt='' /> 
          <span></span> 
          <img src={PolygonLogo} alt='' />
        </MarketTab>

        <MarketTab
          market='fantom'
          current={trancheMarket === 'fantom' && (network === fantomNetworkId)}
          onClick={() => trancheMarketsToggling('fantom')}
          span={ModeThemes[theme].TrancheBtnSpan}
          background={ModeThemes[theme].TrancheBtnBackground}
          backgroundActive={ModeThemes[theme].TrancheBtnBackgroundCurrent}
          border={ModeThemes[theme].TrancheBtnBorder}
          color={ModeThemes[theme].TrancheBtnColor}
          theme={theme}
          btnShadow={ModeThemes[theme].btnShadow}
        >
          <img src={isDesktop ? (theme === 'light' ? YEARNLOGOLIGHT : YEARNLOGO) : YEARNIconMobile} alt='' /> 
          <span></span> 
          <img src={theme === 'light' ? FANTOMLOGOLIGHT : FANTOMLOGO} alt='' />
        </MarketTab>

        <MarketTab
          market='avalanche'
          current={trancheMarket === 'avalanche' && (network === avalancheNetworkId)}
          onClick={() => trancheMarketsToggling('avalanche')}
          span={ModeThemes[theme].TrancheBtnSpan}
          background={ModeThemes[theme].TrancheBtnBackground}
          backgroundActive={ModeThemes[theme].TrancheBtnBackgroundCurrent}
          border={ModeThemes[theme].TrancheBtnBorder}
          color={ModeThemes[theme].TrancheBtnColor}
          theme={theme}
          btnShadow={ModeThemes[theme].btnShadow}
        >
          <img src={isDesktop ? (theme === 'light' ? AaveBtn : AaveBtn) : AAVEIconMobile} alt='' /> 
          <span></span> 
          <img src={AVAX} alt='' />
        </MarketTab> 
      </MarketsTabs>  : 
      <Carousel responsive={responsive} arrows={false} partialVisible={true} className="marketsCarousel">
      <MarketTab
        market='compound'
        current={trancheMarket === 'compound' && (network === networkId)}
        onClick={() => trancheMarketsToggling('compound')}
        span={ModeThemes[theme].TrancheBtnSpan}
        background={ModeThemes[theme].TrancheBtnBackground}
        backgroundActive={ModeThemes[theme].TrancheBtnBackgroundCurrent}
        border={ModeThemes[theme].TrancheBtnBorder}
        color={ModeThemes[theme].TrancheBtnColor}
        theme={theme}
        btnShadow={ModeThemes[theme].btnShadow}
        mobile
      >
        <img src={isDesktop ? (theme === 'light' ? CompoundBtnBlack : CompoundBtn) : CompoundIconMobile} alt='' /> 
        <span></span> 
        <img src={ETHLOGO} alt='' />
      </MarketTab>
      <MarketTab
        market='aavePolygon'
        current={trancheMarket === 'aavePolygon' && (network === maticNetworkId)}
        onClick={() => trancheMarketsToggling('aavePolygon')}
        span={ModeThemes[theme].TrancheBtnSpan}
        background={ModeThemes[theme].TrancheBtnBackground}
        backgroundActive={ModeThemes[theme].TrancheBtnBackgroundCurrent}
        border={ModeThemes[theme].TrancheBtnBorder}
        color={ModeThemes[theme].TrancheBtnColor}
        theme={theme}
        btnShadow={ModeThemes[theme].btnShadow}
        mobile
      >
        <img src={isDesktop ? AaveBtn : AAVEIconMobile} alt='' /> 
        <span></span> 
        <img src={theme === 'light' ? PolygonLogoBlack : PolygonLogo} alt='' />
      </MarketTab>

      <MarketTab
        market='fantom'
        current={trancheMarket === 'fantom' && (network === fantomNetworkId)}
        onClick={() => trancheMarketsToggling('fantom')}
        span={ModeThemes[theme].TrancheBtnSpan}
        background={ModeThemes[theme].TrancheBtnBackground}
        backgroundActive={ModeThemes[theme].TrancheBtnBackgroundCurrent}
        border={ModeThemes[theme].TrancheBtnBorder}
        color={ModeThemes[theme].TrancheBtnColor}
        theme={theme}
        btnShadow={ModeThemes[theme].btnShadow}
        mobile
      >
        <img src={isDesktop ? (theme === 'light' ? AaveBtn : AaveBtn) : AAVEIconMobile} alt='' /> 
        <span></span> 
        <img src={theme === 'light' ? FANTOMLOGOLIGHT : FANTOMLOGO} alt='' />
      </MarketTab>
      <MarketTab
          market='avalanche'
          current={trancheMarket === 'avalanche' && (network === avalancheNetworkId)}
          onClick={() => trancheMarketsToggling('avalanche')}
          span={ModeThemes[theme].TrancheBtnSpan}
          background={ModeThemes[theme].TrancheBtnBackground}
          backgroundActive={ModeThemes[theme].TrancheBtnBackgroundCurrent}
          border={ModeThemes[theme].TrancheBtnBorder}
          color={ModeThemes[theme].TrancheBtnColor}
          theme={theme}
          btnShadow={ModeThemes[theme].btnShadow}
          mobile
        >
          <img src={isDesktop ? (theme === 'light' ? AaveBtn : AaveBtn) : AAVEIconMobile} alt='' /> 
          <span></span> 
          <img src={AVAX} alt='' />
        </MarketTab> 
    </Carousel> }
      {tranchesToggle === 'aavePolygon' && (
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
      {tranchesToggle === 'fantom' && (
        <BridgeTokensWrapper>
          <p>
            To use Fantom markets, you will need to use the Fantom bridge to move your tokens from the Ethereum mainnet to the Fantom. After moving your assets to Fantom, you can buy different instruments on Tranche, trade on the Quickswap DEX, and explore other applications on the Fantom network.
          </p>
          <a href='https://fantom.foundation/' target='_blank' rel='noopener noreferrer'>
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
    theme: state.theme,
    ethereum: state.ethereum
  };
};

export default connect(mapStateToProps, { trancheMarketsToggle, setTxModalOpen, setTxModalStatus, setTxModalLoading, setTxModalType })(HeaderTabs);
