import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { ModeThemes, serverUrl, apiUri, networkId } from 'config';
import { changeOwnAllFilter, ownAllToggle } from 'redux/actions/tableData';
import { fromWei } from 'services/contractMethods';
// import { initOnboard } from 'services/blocknative';
import { summaryFetchSuccess } from 'redux/actions/summaryData';
// import { setAddress, setNetwork, setBalance, setWalletAndWeb3 } from 'redux/actions/ethereum';
import i18n from '../../locale/i18n';
import { roundNumber, safeAdd, safeMultiply } from 'utils/helperFunctions';
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
import { TableTitle, HowToLink } from '../Table/styles/TableComponents';
import CountdownWrapper from '../ProgressBar/Countdown';
const { stakingSummary } = apiUri;

export const baseUrl = i18n.language === 'en' ? '' : '/' + i18n.language;

const HeaderTabs = ({
  theme,
  ethereum: { wallet, address, network, tokenBalance },
  summaryData: { slice, lp, lpList, totalAccruedRewards },
  data: {
    userStakingList: { slice: sliceStakes },
    hasMigrated,
    exchangeRates
  },
  summaryFetchSuccess,
  openModal,
  closeModal,
  modalType,
  ModalIsOpen
}) => {
  const Tracker = useAnalytics('ExternalLinks');
  const [progress, setProgress] = useState(0);
  const [timerData, setTimerData] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const { pathname } = window.location;
  let parsedPath = pathname.split('/');
  let currentPath = parsedPath[parsedPath.length - 1];
  const sliceBalance = tokenBalance[slice.address] ? roundNumber(fromWei(tokenBalance[slice.address])) : '0';
  const lpBalance =
    lpList &&
    lpList.reduce((accumulator, lp) => {
      return safeAdd(accumulator, fromWei(tokenBalance[lp.address]));
    }, '0');
  const newSliceRewards = sliceStakes.filter((s) => s.duration).reduce((acc, cur) => acc + cur.reward, 0);

  useEffect(() => {
    const getStakingData = async () => {
      const res = await axios(`${serverUrl}${stakingSummary}${address}`);
      const { result } = res.data;
      summaryFetchSuccess(result);
    };
    if (network === networkId && currentPath === 'stake' && address) {
      getStakingData();
    }
  }, [currentPath, network, address, summaryFetchSuccess]);

  return (
    <StakeHeaderWrapper>
      <TableTitle color={ModeThemes[theme].HeaderTitle} withHowto stakeTitle>
        <h2>{i18n.t('stake.table.tableHeader.title')}</h2>
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

      {!hasMigrated && (
        <WithdrawStakeCard>
          <WithdrawStakeCardText>
            <h2>{i18n.t('migrateYour')}</h2>
            <p>{i18n.t('migrationText')}</p>
          </WithdrawStakeCardText>
          <WithdrawStakeCardBtns>
            <button onClick={() => openModal('withdrawTokens')}>{i18n.t('migrateTokens')}</button>
          </WithdrawStakeCardBtns>
        </WithdrawStakeCard>
      )}
      <StakeSummaryCardWrapper>
        <StakeSummaryCard color='#4441CF'>
          <StackSummaryCol stake>
            <h2>{i18n.t('slicePoolsStakes')}</h2>
            <h2>{slice.balance ? roundNumber(slice.balance) : '0'}</h2>
            <h2>{sliceBalance} SLICE Available</h2>
            <span></span>
            <h2>
              {i18n.t('currentVal')} ${slice.balanceUSD ? roundNumber(slice.balanceUSD) : '0'}
            </h2>
          </StackSummaryCol>
          <StackSummaryCol stake>
            <h2>{i18n.t('liqPoolsStakes')}</h2>
            <h2>{lp.balance ? roundNumber(lp.balance) : '0'}</h2>
            <h2>
              {lpBalance ? roundNumber(lpBalance.toString()) : '0'} {i18n.t('lpTokens')}
            </h2>
            <span></span>
            <h2>
              {i18n.t('currentVal')} ${lp.balanceUSD ? roundNumber(lp.balanceUSD) : '0'}
            </h2>
          </StackSummaryCol>
        </StakeSummaryCard>
        <StakeSummaryCard color='#369987' claim>
          <StackSummaryCol claim>
            <h2>{i18n.t('Accrued')}</h2>
            <h2>
              {totalAccruedRewards && roundNumber(safeAdd(totalAccruedRewards, newSliceRewards)) !== 'NaN'
                ? roundNumber(totalAccruedRewards + newSliceRewards)
                : '0'}{' '}
              SLICE
            </h2>
            <h2>{sliceBalance} SLICE Available</h2>
            <span></span>
            <h2>
              {i18n.t('currentVal')} $
              {exchangeRates && roundNumber(safeMultiply(totalAccruedRewards + newSliceRewards, exchangeRates.SLICE)) !== 'NaN'
                ? roundNumber(safeMultiply(totalAccruedRewards + newSliceRewards, exchangeRates.SLICE))
                : 0}
            </h2>
          </StackSummaryCol>
          <StackSummaryCol claimBtn>
            <h2>{i18n.t('nextLiqIn')}</h2>
            <CountdownWrapper theme={theme} />
            <button onClick={() => openModal('claim')}>{i18n.t('claimRewards')}</button>
          </StackSummaryCol>
        </StakeSummaryCard>
      </StakeSummaryCardWrapper>
      <StakingModal
        // State Values
        modalIsOpen={ModalIsOpen}
        modalType={modalType}
        progress={progress}
        timerData={timerData}
        // Functions
        closeModal={() => closeModal()}
        openModal={(type = '') => openModal(type)}
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
