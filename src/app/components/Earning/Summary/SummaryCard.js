import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  fromWei,
  addStake,
  withdrawStake,
  epochTimeRemaining
  // getAccruedStakingRewards
} from 'services/contractMethods';
import { txMessage, StakingAddresses } from 'config';
import { ERC20Setup, roundNumber, isGreaterThan, isEqualTo, safeAdd } from 'utils';
import {
  SummaryCardWrapper,
  SummaryCardContainer,
  SummaryCardTitle,
  SummaryCardValue,
  SummaryCardDetails,
  SummaryCardCounter,
  SummaryClaimBtn,
  SummaryCardBtn,
  StakeCardText,
  StakeCardBtn
} from './styles/SummaryComponents';
import StakingModal from '../../Modals/StakingModal';
import i18n from '../../locale/i18n';
import { TooltipWrapper } from 'app/components/Stake/Table/styles/TableComponents';
import { InfoWhite } from 'assets';
import { ModeThemes } from 'config';

const SummaryCard = ({
  title,
  tokenAddress,
  lpList,
  value,
  type,
  details,
  path,
  openModal,
  closeModal,
  modalIsOpen,
  modalType,
  summaryModal,
  ethereum: { web3, address, tokenBalance, notify },
  hasAllowance,
  setHasAllowance,
  color,
  stakeCard,
  theme
}) => {
  const [isLPToken, setLPToken] = useState(false);
  const [balance, setBalance] = useState(0);
  const [epochTimeLeft, setEpochTimeLeft] = useState(0);
  const [approveLoading, setApproveLoading] = useState(false);
  const [TooltipToggle, setTooltipToggle] = useState("");
  const toWei = web3.utils.toWei;
  const setBalanceCB = useCallback((balance) => {
    setBalance(roundNumber(balance));
  }, []);


  useEffect(() => {
    const setEpochTime = async () => {
      if (type === 'reward') {
        const result = await epochTimeRemaining(StakingAddresses[StakingAddresses.length - 1]);
        setEpochTimeLeft((result));
      }
    };

    setEpochTime();
  }, [type]);

  useEffect(() => {
    type === 'lp' ? setLPToken(true) : setLPToken(false);
  }, [type]);

  useEffect(() => {
    const setBalance = async () => {
      if (tokenBalance) {
        if (type === 'slice' && tokenAddress) setBalanceCB(fromWei(tokenBalance[tokenAddress]));
        if (type === 'lp' && lpList) {
          let lpBalance = 0;
          lpList.forEach((lp) => {
            if (tokenBalance[lp.address]) {
              lpBalance = safeAdd(lpBalance, fromWei(tokenBalance[lp.address]));
            }
          });
          setBalanceCB(lpBalance);
        }
      }
    };

    setBalance();
  }, [type, tokenBalance, tokenAddress, lpList, setBalanceCB]);

  const stakingAllowanceCheck = async (stakingAddress, tokenAddress, amount) => {
    try {
      if (modalType && amount !== '') {
        amount = toWei(amount);
        const token = ERC20Setup(web3, tokenAddress);
        let userAllowance = await token.methods.allowance(address, stakingAddress).call();
        if (isGreaterThan(userAllowance, amount) || isEqualTo(userAllowance, amount)) {
          setHasAllowance(true);
        } else {
          setHasAllowance(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const stakingApproveContract = async (stakingAddress, tokenAddress, amount) => {
    try {
      amount = toWei(amount);
      const token = ERC20Setup(web3, tokenAddress);
      await token.methods
        .approve(stakingAddress, amount)
        .send({ from: address })
        .on('transactionHash', (hash) => {
          setApproveLoading(true);
          const { emitter } = notify.hash(hash);
          emitter.on('txPool', (transaction) => {
            return {
              message: txMessage(transaction.hash)
            };
          });
          emitter.on('txConfirmed', () => {
            setHasAllowance(true);
            setApproveLoading(false);
          });
          emitter.on('txCancel', () => setApproveLoading(false));
          emitter.on('txFailed', () => setApproveLoading(false));
        });
    } catch (error) {
      console.error(error);
    }
  };
  const tooltipToggle = (val) => {
    setTooltipToggle(val);
  }

  const adjustStake = (e, stakingAddress, tokenAddress) => {
    try {
      e.preventDefault();
      modalType
        ? addStake(stakingAddress, tokenAddress)
        : withdrawStake(stakingAddress, tokenAddress);
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  const Card = () =>{
    return (
      <div>
          <SummaryCardWrapper color={color}>
            {value || value === 0 ? (
              <SummaryCardContainer>
                <SummaryCardTitle>
                  {title}
                  {
                    title === i18n.t('tranche.summary.valueLocked.title') &&
                    <div>
                      <img src={InfoWhite} alt="info" onMouseOver={() => tooltipToggle("valueLocked")} onMouseLeave={() => tooltipToggle("")}/>
                      <TooltipWrapper tooltip={TooltipToggle === "valueLocked"} summary color={ModeThemes[theme].Tooltip}> 
                        <div>
                            <h2>
                              The total amount of staked or deposited assets in USD on the Tranche Protocol.
                            </h2>
                        </div>
                      </TooltipWrapper>
                    </div>
                    
                  }
                  
                </SummaryCardTitle>
  
                <SummaryCardValue>
                  {'$' + roundNumber(value)}
                  <div></div>
                </SummaryCardValue>
                <SummaryCardDetails>
                  {type === 'slice'
                    ? balance + ' SLICE Available'
                    : type === 'lp'
                    ? balance + ' SLICE-LP Available'
                    : path === 'tranche' ? ""
                    : epochTimeLeft + ' Until Next Distribution'}
                </SummaryCardDetails>
                {path === 'stake' && type !== 'reward' && (
                  <SummaryCardCounter>
                    <SummaryCardBtn onClick={() => openModal(true)}>+</SummaryCardBtn>
                    <SummaryCardBtn onClick={() => openModal(false)}>-</SummaryCardBtn>
                  </SummaryCardCounter>
                )}
                {path === 'stake' && type === 'reward' && (
                  <SummaryClaimBtn claim>
                    <button onClick={() => openModal()}>Claim</button>
                  </SummaryClaimBtn>
                )}
              </SummaryCardContainer>
            ) : (
              <SummaryCardContainer loading='true'>
                <div></div>
                <div></div>
                <div></div>
              </SummaryCardContainer>
            )}
  
            <StakingModal
              // State Values
              path={path}
              modalIsOpen={modalIsOpen}
              modalType={modalType}
              summaryModal={summaryModal}
              tokenAddress={tokenAddress}
              noBalance={Number(balance) === 0}
              // Functions
              closeModal={() => closeModal()}
              openModal={(bool) => openModal(bool)}
              hasAllowance={hasAllowance}
              approveLoading={approveLoading}
              isLPToken={isLPToken}
              // Functions
              stakingAllowanceCheck={stakingAllowanceCheck}
              stakingApproveContract={stakingApproveContract}
              adjustStake={adjustStake}
              type={type}
            />
          </SummaryCardWrapper>
      </div>
    );
  }
  const StakeCard = () =>{
    return (
      <div>
          <SummaryCardWrapper color={color} stakeCard={stakeCard}>
            {value || value === 0 ? (
              <SummaryCardContainer stakeCard>
                <StakeCardText>
                  <h2>{i18n.t('tranche.summary.stakeLive.title')}</h2>
                  <h2>{i18n.t('tranche.summary.stakeLive.details')}</h2>
                </StakeCardText>
                <StakeCardBtn>
                  <button><a href="/stake">STAKE</a></button>
                </StakeCardBtn>
              </SummaryCardContainer>
            ) : (
              <SummaryCardContainer loading='true'>
                <div></div>
                <div></div>
                <div></div>
              </SummaryCardContainer>
            )}
          </SummaryCardWrapper>      
      </div>
    );
  }
  return stakeCard ? StakeCard() : Card();
};

SummaryCard.propTypes = {
  ethereum: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  ethereum: state.ethereum,
  theme: state.theme
});

export default connect(mapStateToProps, {})(SummaryCard);
