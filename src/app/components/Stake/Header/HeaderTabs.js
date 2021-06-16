import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { ModeThemes, serverUrl, apiUri, networkId } from 'config';
import { changeOwnAllFilter, ownAllToggle } from 'redux/actions/tableData';
// import { initOnboard } from 'services/blocknative';
import { summaryFetchSuccess } from 'redux/actions/summaryData';
// import { setAddress, setNetwork, setBalance, setWalletAndWeb3 } from 'redux/actions/ethereum';
import i18n from '../../locale/i18n';
import { roundNumber, safeAdd } from 'utils/helperFunctions';
import StakingModal from '../../Modals/StakingModal';
import { withdrawStakeAndRewards } from 'services/contractMethods';
import useAnalytics from 'services/analytics';
import {
  StakeHeaderWrapper,
  StakeSummaryCard,
  WithdrawStakeCard,
  StackSummaryCol,
  WithdrawStakeCardText,
  WithdrawStakeCardBtns,
  StakeSummaryCardWrapper,
  Countdown
} from './styles/HeaderComponents';
import { TableTitle, HowToLink } from '../Table/styles/TableComponents';
import ProgressBar from '../ProgressBar/ProgressBar';
import { fromWei } from 'services';
export const baseUrl = i18n.language === 'en' ? '' : '/' + i18n.language;

const { stakingSummary } = apiUri;

const HeaderTabs = ({
  theme,
  ethereum: { address, network, tokenBalance },
  summaryData: { slice, lp, lpList, totalAccruedRewards },
  summaryFetchSuccess,
  openModal,
  closeModal,
  modalType,
  ModalIsOpen
}) => {
  const { pathname } = window.location;
  let parsedPath = pathname.split('/');
  let currentPath = parsedPath[parsedPath.length - 1];
  const Tracker = useAnalytics('ExternalLinks');
  const sliceBalance = tokenBalance[slice.address] ? roundNumber(fromWei(tokenBalance[slice.address])) : '0';
  const lpBalance =
    lpList &&
    lpList.reduce((accumulator, lp) => {
      return safeAdd(accumulator, fromWei(tokenBalance[lp.address]));
    }, '0');
  // const [ModalIsOpen, setModalOpen] = useState(false);
  // const [modalType, setModalType] = useState('');
  // const onboard = initOnboard({
  //   address: setAddress,
  //   network: setNetwork,
  //   balance: setBalance,
  //   wallet: setWalletAndWeb3
  // });

  useEffect(() => {
    const getStakingData = async () => {
      const res = await axios(`${serverUrl + stakingSummary + address}`);
      const { result } = res.data;
      console.log(result);
      summaryFetchSuccess(result);
    };
    if (network === networkId && currentPath === 'stake' && address) {
      getStakingData();
    }
  }, [currentPath, network, address, summaryFetchSuccess]);

  return (
    <StakeHeaderWrapper>
      <TableTitle color={ModeThemes[theme].HeaderTitle} withHowto stake>
        <h2>{i18n.t('stake.table.tableHeader.title')}</h2> :
        <HowToLink
          href='https://docs.tranche.finance/tranchefinance/tranche-app/staking'
          onClick={(e) => Tracker('Documentation', 'https://docs.tranche.finance/tranchefinance/tranche-app/staking')}
          target='_blank'
          rel='noopener noreferrer'
          color={ModeThemes[theme].HowToText}
          background={ModeThemes[theme].HowTo}
          shadow={ModeThemes[theme].HowToShadow}
          border={ModeThemes[theme].HowToBorder}
        >
          {i18n.t('footer.docs')}
        </HowToLink>
      </TableTitle>
      <StakeSummaryCardWrapper>
        <StakeSummaryCard color='#4441CF'>
          <StackSummaryCol stake>
            <h2>SLICE Staking Pools Stakes</h2>
            <h2>{slice.balance ? roundNumber(slice.balance) : '0'}</h2>
            <h2>{sliceBalance} SLICE Available</h2>
            <span></span>
            <h2>Current Value ${slice.balanceUSD ? roundNumber(slice.balanceUSD) : '0'}</h2>
          </StackSummaryCol>
          <StackSummaryCol stake>
            <h2>Total Liquidity Provider Pools Stakes</h2>
            <h2>{lp.balance ? roundNumber(lp.balance) : '0'}</h2>
            <h2>{lpBalance ? roundNumber(lpBalance.toString()) : '0'} LP Tokens Available</h2>
            <span></span>
            <h2>Current Value ${lp.balanceUSD ? roundNumber(lp.balanceUSD) : '0'}</h2>
          </StackSummaryCol>
        </StakeSummaryCard>
        <StakeSummaryCard color='#369987' claim>
          <StackSummaryCol>
            <h2>Accrued Rewards</h2>
            <h2>{totalAccruedRewards && roundNumber(totalAccruedRewards, 2) !== 'NaN' ? roundNumber(totalAccruedRewards, 2) : '0'} SLICE</h2>
            <h2>Current Value is $Soon™</h2>
            <ProgressBar progress='50' widthBar='90' colorOne='rgba(255,255,255,0.5)' colorTwo='#FFFFFF' />
            <h2>6 Days until next distribution</h2>
          </StackSummaryCol>
        </StakeSummaryCard>
      </StakeSummaryCardWrapper>
      <WithdrawStakeCard>
        <WithdrawStakeCardText>
          <h2>WITHDRAW YOUR SLICE TOKENS</h2>
          <p>
            Tranche is migrating to new staking contracts which will require you to withdraw your tokens. In order to continue staking in SLICE
            Staking pools, please withdraw your current SLICE tokens and rewards in order to use them in SLICE staking pools.
          </p>
        </WithdrawStakeCardText>
        <WithdrawStakeCardBtns>
          <button onClick={() => withdrawStakeAndRewards(slice.stakingAddress, slice.address, slice.yieldAddress)}>Withdraw Tokens</button>
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

const mapStateToProps = (state) => ({
  ethereum: state.ethereum,
  data: state.data,
  summaryData: state.summaryData,
  path: state.path,
  trade: state.trade,
  theme: state.theme
});

export default connect(mapStateToProps, { changeOwnAllFilter, ownAllToggle, summaryFetchSuccess })(HeaderTabs);
