import React, { useState } from 'react';
import { connect } from 'react-redux';
import i18n from "../../locale/i18n";
import { trancheMarketsToggle } from "redux/actions/tableData";
import { AaveBtn, CompoundBtn , CompoundBtnBlack, PolygonLogo, PolygonLogoBlack} from 'assets';
import TrancheModal from '../../Modals/TrancheModal';
import {
  MarketsTabsWrapper,
  MarketsTabs,
  MarketTab,
  BridgeTokensWrapper
} from './styles/HeaderComponents';
import { ModeThemes } from 'config';
import {
  HowToLink
} from '../../Stake/Table/styles/TableComponents';
export const baseUrl = i18n.language === 'en' ? '' : '/'+i18n.language;

const HeaderTabs = ({ data, trancheMarketsToggle, theme }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { trancheMarket } = data;

  const openModal = () =>{
    setModalIsOpen(true);
  }
  const closeModal = () =>{
    setModalIsOpen(false);
    // onClick={() => trancheMarketsToggle("aavePolygon")}>
  }
  return (
    <MarketsTabsWrapper color={ModeThemes[theme].TrancheMarketsTitle}>
      <div>
        <h2>
        {i18n.t('tranche.trancheData.TrancheMarkets')}
        </h2>
        <HowToLink href="https://docs.tranche.finance/tranchefinance/" target="_blank" rel="noopener noreferrer" color={ModeThemes[theme].HowToText} background={ModeThemes[theme].HowTo} shadow={ModeThemes[theme].HowToShadow} border={ModeThemes[theme].HowToBorder}>
          {i18n.t('footer.docs')}
        </HowToLink>
      </div>
      <MarketsTabs>
          <MarketTab market="compound" current={trancheMarket === "compound"} onClick={() => trancheMarketsToggle("compound")} background={ModeThemes[theme].TrancheBtnBackground} backgroundActive={ModeThemes[theme].TrancheBtnBackgroundCurrent} border={ModeThemes[theme].TrancheBtnBorder} color={ModeThemes[theme].TrancheBtnColor}><img src={theme === "light" ? CompoundBtnBlack : CompoundBtn} alt="" /></MarketTab>
          <MarketTab market="aavePolygon" current={trancheMarket === "aavePolygon"} onClick={() => (trancheMarket !== "aavePolygon" || true) && openModal()} span={ModeThemes[theme].TrancheBtnSpan} background={ModeThemes[theme].TrancheBtnBackground} backgroundActive={ModeThemes[theme].TrancheBtnBackgroundCurrent} border={ModeThemes[theme].TrancheBtnBorder} color={ModeThemes[theme].TrancheBtnColor}><h2><span><img src={AaveBtn} alt="" /> Market</span> <span>coming soon</span></h2> <span></span> <img src={theme === "light" ? PolygonLogoBlack : PolygonLogo } alt="" /></MarketTab>
      </MarketsTabs>
      {trancheMarket === "aavePolygon" &&
        <BridgeTokensWrapper>
          <p>
            To use polygon markets, you will need use the Matic bridge to move your tokens from the Ethereum mainnet to the polygon side chain. After you move your assets to the polygon side chain, you can buy different instruments on Tranche, trade on the Quickswap DEX, and explore other applications on the Polygon network.
          </p>
          <button>Bridge Tokens</button>
        </BridgeTokensWrapper>
      }
      <TrancheModal
        modalIsOpen={modalIsOpen}
        closeModal={() => closeModal()}
      />

    </MarketsTabsWrapper>
  );
};

const mapStateToProps = (state) => {
  return {
    data: state.data,
    theme: state.theme
  };
};

export default connect(mapStateToProps, { trancheMarketsToggle })(HeaderTabs);