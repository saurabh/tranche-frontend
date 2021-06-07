import React from 'react';
import { connect } from 'react-redux';
import { ModeThemes } from 'config';
import { changeOwnAllFilter, ownAllToggle } from 'redux/actions/tableData';
import i18n from '../../locale/i18n';
import useAnalytics from 'services/analytics';
import {
  StakeHeaderWrapper,
  StakeSummaryCard,
  WithdrawStakeCard,
  StackSummaryCol,
  WithdrawStakeCardText,
  WithdrawStakeCardBtns
} from './styles/HeaderComponents';
import {
  TableTitle,
  HowToLink
} from '../Table/styles/TableComponents';
import ProgressBar from '../ProgressBar/ProgressBar';
export const baseUrl = i18n.language === 'en' ? '' : '/' + i18n.language;

const HeaderTabs = ({ theme }) => {
  const Tracker = useAnalytics("ExternalLinks");
  
  return (
    <StakeHeaderWrapper>
      <TableTitle color={ModeThemes[theme].HeaderTitle} withHowto stake>
          <h2>{i18n.t('stake.table.tableHeader.title')}</h2> :
        <HowToLink href="https://docs.tranche.finance/tranchefinance/tranche-app/staking"  onClick={(e) => Tracker("Documentation", "https://docs.tranche.finance/tranchefinance/tranche-app/staking")} target="_blank" rel="noopener noreferrer" color={ModeThemes[theme].HowToText} background={ModeThemes[theme].HowTo} shadow={ModeThemes[theme].HowToShadow} border={ModeThemes[theme].HowToBorder}>
            {i18n.t('footer.docs')}
        </HowToLink>  
      </TableTitle>
      <StakeSummaryCard>
        <StackSummaryCol>
          <h2>Accrued Rewards</h2>
          <h2>100 SLICE</h2>
          <h2>Current Value is $70</h2>
          <ProgressBar progress="50" />
          <h2>6 Days until next distribution</h2>
        </StackSummaryCol>
        <StackSummaryCol>
          <h2>Total Staked SLICE Tokens</h2>
          <h2>102.00</h2>
          <h2>14,140.12 SLICE Available</h2>
        </StackSummaryCol>
        <StackSummaryCol>
          <h2>Total Staked SLICE LP Tokens</h2>
          <h2>00.00</h2>
          <h2>14,140.12 SLICE-LP Available</h2>
        </StackSummaryCol>
        <StackSummaryCol claim>
          <button>Claim</button>
        </StackSummaryCol>
      </StakeSummaryCard>
      <WithdrawStakeCard>
        <WithdrawStakeCardText>
          <h2>WITHDRAW YOUR SLICE TOKENS</h2>
          <p>Tranche is migrating to new staking contracts which will require you to withdraw your tokens. In order to continue staking in SLICE Staking pools, please withdraw your current SLICE tokens and rewards in order to use them in SLICE staking pools.</p>
        </WithdrawStakeCardText>
        <WithdrawStakeCardBtns>
          <button>Withdraw REWARDS</button>
          <button>Withdraw STAKE</button>
        </WithdrawStakeCardBtns>
      </WithdrawStakeCard>
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
