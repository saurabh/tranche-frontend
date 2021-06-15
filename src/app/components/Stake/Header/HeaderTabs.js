import React from 'react';
import { connect } from 'react-redux';
import { ModeThemes } from 'config';
import { changeOwnAllFilter, ownAllToggle } from 'redux/actions/tableData';
// import { initOnboard } from 'services/blocknative';
// import { setAddress, setNetwork, setBalance, setWalletAndWeb3 } from 'redux/actions/ethereum';
import i18n from '../../locale/i18n';
// import { readyToTransact } from 'utils/helperFunctions';
import StakingModal from '../../Modals/StakingModal';
import useAnalytics from 'services/analytics';
import {
  StakeHeaderWrapper,
  StakeSummaryCard,
  WithdrawStakeCard,
  StackSummaryCol,
  WithdrawStakeCardText,
  WithdrawStakeCardBtns,
  StakeSummaryCardWrapper
} from './styles/HeaderComponents';
import {
  TableTitle,
  HowToLink
} from '../Table/styles/TableComponents';
import ProgressBar from '../ProgressBar/ProgressBar';
export const baseUrl = i18n.language === 'en' ? '' : '/' + i18n.language;

const HeaderTabs = ({ theme, ethereum: { wallet, address, network }, openModal, closeModal, modalType, ModalIsOpen }) => {
  const Tracker = useAnalytics("ExternalLinks");
  // const [ModalIsOpen, setModalOpen] = useState(false);
  // const [modalType, setModalType] = useState('');
  // const onboard = initOnboard({
  //   address: setAddress,
  //   network: setNetwork,
  //   balance: setBalance,
  //   wallet: setWalletAndWeb3
  // });
  
  return (
    <StakeHeaderWrapper>
      <TableTitle color={ModeThemes[theme].HeaderTitle} withHowto stake>
          <h2>{i18n.t('stake.table.tableHeader.title')}</h2> :
        <HowToLink href="https://docs.tranche.finance/tranchefinance/tranche-app/staking"  onClick={(e) => Tracker("Documentation", "https://docs.tranche.finance/tranchefinance/tranche-app/staking")} target="_blank" rel="noopener noreferrer" color={ModeThemes[theme].HowToText} background={ModeThemes[theme].HowTo} shadow={ModeThemes[theme].HowToShadow} border={ModeThemes[theme].HowToBorder}>
            {i18n.t('footer.docs')}
        </HowToLink>  
      </TableTitle>
      <StakeSummaryCardWrapper>     
        <StakeSummaryCard color="#4441CF">
          <StackSummaryCol stake>
            <h2>SLICE Staking Pools Stakes</h2>
            <h2>102.00</h2>
            <h2>Current Value is $0</h2>
            <span></span>
            <h2>14,140.12 SLICE Available</h2>
          </StackSummaryCol>
          <StackSummaryCol stake> 
            <h2>Total Liquidity Provider Pools Stakes</h2>
            <h2>102.00</h2>
            <h2>Current Value is $0</h2>
            <span></span>
            <h2>14,140.12 SLICE Available</h2>
          </StackSummaryCol>
        </StakeSummaryCard>
        <StakeSummaryCard color="#369987" claim>
          <StackSummaryCol>
            <h2>Accrued Rewards</h2>
            <h2>100 SLICE</h2>
            <h2>Current Value is $70</h2>
            <ProgressBar progress="50" widthBar="90" colorOne="rgba(255,255,255,0.5)" colorTwo="#FFFFFF"/>
            <h2>6 Days until next distribution</h2>
          </StackSummaryCol>
          <button onClick={() => openModal('claim')}>Claim</button>
        </StakeSummaryCard>
      </StakeSummaryCardWrapper>
      <WithdrawStakeCard>
        <WithdrawStakeCardText>
          <h2>WITHDRAW YOUR SLICE TOKENS</h2>
          <p>Tranche is migrating to new staking contracts which will require you to withdraw your tokens. In order to continue staking in SLICE Staking pools, please withdraw your current SLICE tokens and rewards in order to use them in SLICE staking pools.</p>
        </WithdrawStakeCardText>
        <WithdrawStakeCardBtns>
          <button onClick={() => openModal('withdrawTokens')}>Withdraw Tokens</button>
        </WithdrawStakeCardBtns>
      </WithdrawStakeCard>
      <StakingModal
        // State Values
        modalIsOpen={ModalIsOpen}
        modalType={modalType}
        // Functions
        closeModal={() => closeModal()}
        openModal={() => openModal('')}
        // Functions
      />
    </StakeHeaderWrapper>
  );
};

const mapStateToProps = (state) => {
  return {
    ethereum: state.ethereum,
    data: state.data,
    path: state.path,
    trade: state.trade,
    theme: state.theme
  };
};

export default connect(mapStateToProps, { changeOwnAllFilter, ownAllToggle })(HeaderTabs);
