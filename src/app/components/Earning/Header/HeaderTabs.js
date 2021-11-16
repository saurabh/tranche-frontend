import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import i18n from '../../locale/i18n';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { trancheMarketsToggle, setTxModalOpen, setTxModalStatus, setTxModalType, setTxModalLoading } from 'redux/actions/tableData';
import { AaveBtn, CloseModalWhite, CompoundBtn, CompoundBtnBlack, ETHLOGO, FantomDark, FantomLight, FANTOMLOGO, FANTOMLOGOLIGHT, PolygonLogo, PolygonLogoBlack, YEARNLOGO, YEARNLOGOLIGHT } from 'assets';
import TrancheModal from '../../Modals/TrancheModal';
import { MarketsTabsWrapper, MarketsTabs, MarketTab, BridgeTokensWrapper, YearnNoticeWrapper } from './styles/HeaderComponents';
import { ModeThemes } from 'config';
import { HowToLink } from '../../Stake/Table/styles/TableComponents';
import useAnalytics from 'services/analytics';

export const baseUrl = i18n.language === 'en' ? '' : '/' + i18n.language;

const HeaderTabs = ({ ethereum: { network }, data, trancheMarketsToggle, setTxModalOpen, setTxModalStatus, setTxModalLoading, setTxModalType, theme }) => {
  const Tracker = useAnalytics('ExternalLinks');
  const { trancheMarket } = data;
  const [isDesktop, setDesktop] = useState(window.innerWidth > 992);
  const [fantomNotice, setFantomNotice] = useState(true);
  
  const updateMedia = () => {
    setDesktop(window.innerWidth > 992);
  };
  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  });
  useEffect(() => {
    console.log(network)
  }, [network]); 
  //1 42
  //137 
  //250
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
          span={ModeThemes[theme].TrancheBtnSpan}
          background={ModeThemes[theme].TrancheBtnBackground}
          backgroundActive={ModeThemes[theme].TrancheBtnBackgroundCurrent}
          border={ModeThemes[theme].TrancheBtnBorder}
          color={ModeThemes[theme].TrancheBtnColor}
          theme={theme}
          btnShadow={ModeThemes[theme].btnShadow}
          mobile
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
          mobile
        >
          <img src={theme === 'light' ? YEARNLOGOLIGHT : YEARNLOGO} alt='' /> 
          <span></span> 
          <img src={theme === 'light' ? FANTOMLOGOLIGHT : FANTOMLOGO} alt='' />
        </MarketTab>
      </Carousel> }
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
      {trancheMarket === 'fantom' && fantomNotice && (
        <YearnNoticeWrapper>
          <p><span>Notice:
              <button onClick={() => setFantomNotice(false)}><img src={CloseModalWhite} alt="close"/></button>
            </span> Yearn V3 is still in beta and is not dispensing yields at this time. APYs will initiate once Yearn V3 launches. </p>
          <div>
            <span></span>
            <button onClick={() => setFantomNotice(false)}><img src={CloseModalWhite} alt="close"/></button>
          </div>
        </YearnNoticeWrapper>
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
