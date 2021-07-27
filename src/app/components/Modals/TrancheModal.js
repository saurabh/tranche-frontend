import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { trancheMarketsToggle } from "redux/actions/tableData";
import { CheckBtnWhite, CloseModal, CloseModalWhite, CompoundLogo, DAICARD, LinkIcon, Migrated, TranchePending, TranchePendingLight, TrancheRejected, TrancheStake } from 'assets';
import { SLICEAddress } from '../../../config/constants'

// import 'react-confirm-alert/src/react-confirm-alert.css';
import {
  ModalHeader,
  ModalMarketWrapper,
  ModalMarketWrapperBtn,
  TrancheModalWrapper,
  TrancheModalHeader,
  TrancheModalContent,
  TrancheModalContentHeader,
  TrancheModalContentRow,
  TrancheModalFooter,
  TrancheModalContentHeaderImg,
  TrancheModalContentHeaderText,
  LoadingButton,
  LoadingButtonCircle,
  TrancheModalContentStatus
} from './styles/ModalsComponents';
import { ModeThemes } from 'config';
import { roundNumber, safeMultiply } from 'utils';
import { claimRewardsAllMarkets, fromWei } from 'services';
const TrancheMarketStyles = {
  overlay: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    zIndex: '2000',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  content: {
    position: 'relative',
    maxWidth: '372px',
    maxHeight: '388px',
    width: '100%',
    minHeight: '366px',
    //height: '326px',
    height: 'auto',
    border: 'none',
    boxShadow: '0px 1px 4px 1px rgba(0, 0, 0, 0.12)',
    borderRadius: '12px',
    padding: '0',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0'
  }
};
const TrancheRewardsStyles = {
  overlay: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    zIndex: '2000',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  content: {
    position: 'relative',
    maxWidth: '340px',
    maxHeight: '517px',
    width: '100%',
    minHeight: '517px',
    //height: '326px',
    height: 'auto',
    border: 'none',
    boxShadow: '0px 1px 4px 1px rgba(0, 0, 0, 0.12)',
    borderRadius: '12px',
    padding: '0',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0'
  }
};
const TrancheEnableModal = {
  overlay: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    zIndex: '2000',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  content: {
    position: 'relative',
    maxWidth: '438px',
    maxHeight: '571px',
    width: '100%',
    minHeight: '571px',
    //height: '326px',
    height: 'auto',
    border: 'none',
    boxShadow: '0px 1px 4px 1px rgba(0, 0, 0, 0.12)',
    borderRadius: '12px',
    padding: '0',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0'
  }
};
const TrancheConfirmModal = {
  overlay: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    zIndex: '2000',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  content: {
    position: 'relative',
    maxWidth: '438px',
    maxHeight: '685px',
    width: '100%',
    minHeight: '571px',
    height: '100%',
    //height: '326px',
    height: 'auto',
    border: 'none',
    boxShadow: '0px 1px 4px 1px rgba(0, 0, 0, 0.12)',
    borderRadius: '12px',
    padding: '0',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0'
  }
};



Modal.setAppElement('#root');

const TrancheModal = ({
  // Redux
  ethereum: { txOngoing, tokenBalance, unclaimedSIRRewards },
  data: { txModalIsOpen, txModalType, txModalStatus, txLoading, exchangeRates = {}},
  // Props
  type,
  theme,
  // Functions
  trancheMarketsToggle,
  closeModal
  // API Values,
}) => {
  const [ totalSliceBalance, setTotalSliceBalance ] = useState(0);
  const [ unclaimedSlice, setUnclaimedSlice ] = useState(0);
  const [ totalSlice, setTotalSlice ] = useState(0);
  const[totalSliceInUSD, setTotalSliceInUSD] = useState(0);

  useEffect(() => {
    setTotalSliceBalance(fromWei(tokenBalance[ SLICEAddress ]));
  }, [ tokenBalance ]);
  useEffect(() => {
    setUnclaimedSlice(fromWei(`${unclaimedSIRRewards || 0}`));
  }, [ unclaimedSIRRewards ]);
  
  useEffect(() => {
    setTotalSliceInUSD(roundNumber(safeMultiply(totalSliceBalance + unclaimedSlice, exchangeRates.SLICE)));
    setTotalSlice(roundNumber(totalSliceBalance + unclaimedSlice));
  }, [exchangeRates.SLICE, totalSliceBalance, unclaimedSlice]);

  const trancheMarketsToggling = () => {
    trancheMarketsToggle("aavePolygon");
    closeModal();
  }

  const TrancheMarket = () => {
    return (
      <Modal
        isOpen={txModalIsOpen}
        onRequestClose={closeModal}
        style={TrancheMarketStyles}
        closeTimeoutMS={200}
        shouldCloseOnOverlayClick={false}
        contentLabel='Adjust'
        portalClassName="TrancheMarketsModal"
      >
        <ModalHeader notFound ModalBackground={ModeThemes[theme].ModalBackground}>
          <button onClick={() => closeModal()}>
            <img src={theme === "light" ? CloseModal : CloseModalWhite}alt='' />
          </button>
        </ModalHeader>
          <ModalMarketWrapper ModalBackground={ModeThemes[theme].ModalBackground} ModalText={ModeThemes[theme].ModalText} linkColor={ModeThemes[theme].TrancheModalLinkColor} linkBackground={ModeThemes[theme].TrancheModalLinkBackground}>
              <div>
                <p>
                    Polygon Markets are AAVE’s first implementation on the Polygon network, a layer 2 solution that highly improves the scalability of the Ethereum network in terms of cost and speed. To access Polygon markets, you will need to move your assets to the Polygon side chain using the Polygon Bridge. After that, your transactions will cost near 0 and settle instantly.
                </p>
                <a
                    href='https://docs.tranche.finance/tranchefinance/tranche-app/tranche-on-polygon'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                     Learn More
                </a>
              </div>
            <ModalMarketWrapperBtn color='#4939D7'  ModalBackground={ModeThemes[theme].SelectedStaking}>
              <button onClick={() => trancheMarketsToggling("aavePolygon")}>
                Continue to Polygon/AAVE Markets
              </button>
            </ModalMarketWrapperBtn>
          </ModalMarketWrapper>
      </Modal>
    );
  };
  const TrancheRewards = () => {
    const onClaimReward = async () => {
      await claimRewardsAllMarkets()
      closeModal();
    }
    return (
      <Modal
        isOpen={txModalIsOpen}
        onRequestClose={closeModal}
        style={TrancheRewardsStyles}
        closeTimeoutMS={200}
        shouldCloseOnOverlayClick={false}
        contentLabel='Adjust'
        portalClassName="TrancheRewardsModal"
      >

        <TrancheModalWrapper
          backgroundColor={ModeThemes[theme].ModalBackground}
        >
          <TrancheModalHeader color={ModeThemes[theme].ModalTrancheTextColor} border={ModeThemes[theme].ModalTrancheTextRowBorder} trancheRewardsModal>
            <h2>TRANCHE REWARDS</h2>
            <ModalHeader tranche ModalBackground={ModeThemes[theme].ModalBackground}>
              <button onClick={() => closeModal()}>
                <img src={theme === "light" ? CloseModal : CloseModalWhite}alt='' />
              </button>
            </ModalHeader>
          </TrancheModalHeader>

          <TrancheModalContent color={ModeThemes[theme].ModalTrancheTextColor}>
            <TrancheModalContentHeader color={ModeThemes[theme].ModalTrancheTextColor} trancheRewardsModal>
              <img src={TrancheStake} alt="img" />
              <h2>{totalSlice}</h2>
              <h2>(${totalSliceInUSD})</h2>
            </TrancheModalContentHeader>
            <TrancheModalContentRow color={ModeThemes[theme].ModalTrancheTextColor} border={ModeThemes[theme].ModalTrancheTextRowBorder}>
              <h2>Wallet Balance </h2>
              <h2>{ roundNumber(totalSliceBalance) }</h2>
            </TrancheModalContentRow>
            <TrancheModalContentRow color={ModeThemes[theme].ModalTrancheTextColor} border={ModeThemes[theme].ModalTrancheTextRowBorder}>
              <h2>Unclaimed Balance</h2>
              <h2>{ roundNumber(unclaimedSlice) }</h2>
            </TrancheModalContentRow>
            <TrancheModalContentRow noBorder color={ModeThemes[theme].ModalTrancheTextColor} border={ModeThemes[theme].ModalTrancheTextRowBorder}>
              <h2>Price</h2>
              <h2>${roundNumber(exchangeRates.SLICE, 2)}</h2>
            </TrancheModalContentRow>
          </TrancheModalContent>

          <TrancheModalFooter color={ModeThemes[theme].ModalTrancheTextColor}>
            <button onClick={ onClaimReward} disabled={txOngoing}>
              Claim {roundNumber(unclaimedSlice)} SLICE 
            </button>
            <h2>
              Looking for Staking Rewards? <a href="/stake">Click Here</a>
            </h2>
          </TrancheModalFooter>


        </TrancheModalWrapper>

        
      </Modal>
    );
  };
  const TrancheEnable = () => {
    return (
      <Modal
        isOpen={txModalIsOpen}
        onRequestClose={closeModal}
        style={TrancheEnableModal}
        closeTimeoutMS={200}
        shouldCloseOnOverlayClick={false}
        contentLabel='Adjust'
        portalClassName="TrancheEnableModal"
      >

        <TrancheModalWrapper
          backgroundColor={ModeThemes[theme].ModalBackground}
          TrancheEnable
        >
          <TrancheModalHeader color={ModeThemes[theme].ModalTrancheTextColor} border={ModeThemes[theme].ModalTrancheTextRowBorder}
            TrancheEnable
          >
            {/* <h2>TRANCHE REWARDS</h2> */}
            <ModalHeader tranche ModalBackground={ModeThemes[theme].ModalBackground} enableModal>
              <button onClick={() => closeModal()}>
                <img src={theme === "light" ? CloseModal : CloseModalWhite}alt='' />
              </button>
            </ModalHeader>
            <TrancheModalContentHeader color={ModeThemes[theme].ModalTrancheTextColor} enableModal>
              <TrancheModalContentHeaderImg>
              <img src={CompoundLogo} alt="img" />
              <span>
                <img src={DAICARD} alt="img" />                
              </span>
              </TrancheModalContentHeaderImg>
              <TrancheModalContentHeaderText rateColor={ModeThemes[theme].TrancheRateTypeColor} color={ModeThemes[theme].ModalTrancheTextColor} textColor={ModeThemes[theme].textColor}>
                <h2>Compound Dai</h2>
                <div>
                  <h2>ACDAI</h2>
                  <h2>Fixed</h2>
                </div>
              </TrancheModalContentHeaderText>
            </TrancheModalContentHeader>
          </TrancheModalHeader>
        {

          txModalStatus === "notApproved" ?
            <TrancheModalContent color={ModeThemes[theme].ModalTrancheTextColor}>
              <h2>To deposit in Tranche A, you need to enable it first</h2>
              <TrancheModalContentRow color={ModeThemes[theme].ModalTrancheTextColor} border={ModeThemes[theme].ModalTrancheTextRowBorder}>
                <h2>CToken APY</h2>
                <h2>900</h2>
              </TrancheModalContentRow>
              <TrancheModalContentRow color={ModeThemes[theme].ModalTrancheTextColor} border={ModeThemes[theme].ModalTrancheTextRowBorder}>
                <h2>Tranche APY</h2>
                <h2>105.125</h2>
              </TrancheModalContentRow>
              <TrancheModalContentRow color={ModeThemes[theme].ModalTrancheTextColor} border={ModeThemes[theme].ModalTrancheTextRowBorder}>
                <h2>SLICE APY</h2>
                <h2>$0.865</h2>
              </TrancheModalContentRow>
              <TrancheModalContentRow noBorder color={ModeThemes[theme].ModalTrancheTextColor} border={ModeThemes[theme].ModalTrancheTextRowBorder}>
                <h2>Net APY</h2>
                <h2>$0.865</h2>
              </TrancheModalContentRow>
            </TrancheModalContent> :
          txModalStatus === "confirm" ?

          <TrancheModalContent trancheStatus color={ModeThemes[theme].ModalTrancheTextColor}>
            <h2>To deposit in Tranche A, you need to enable it first</h2>
            <TrancheModalContentStatus color={ModeThemes[theme].ModalTrancheTextColor}>
              <img src={theme === "light" ? TranchePendingLight : TranchePending} alt="img" />
              <h2>Confirm Transaction</h2>
            </TrancheModalContentStatus>
          </TrancheModalContent> : 
          txModalStatus === "pending" ?

          <TrancheModalContent trancheStatus color={ModeThemes[theme].ModalTrancheTextColor}>
            <h2>To deposit in Tranche A, you need to enable it first</h2>
            <TrancheModalContentStatus color={ModeThemes[theme].ModalTrancheTextColor}>
              <img src={theme === "light" ? TranchePendingLight : TranchePending} alt="img" />
              <h2>Transaction Pending</h2>
            </TrancheModalContentStatus>
          </TrancheModalContent> :

          txModalStatus === "success" ?
          <TrancheModalContent trancheStatus color={ModeThemes[theme].ModalTrancheTextColor}>
            <h2>To deposit in Tranche A, you need to enable it first</h2>
            <TrancheModalContentStatus color={ModeThemes[theme].ModalTrancheTextColor}>
              <img src={Migrated} alt="img" />
              <h2>Transaction Successful</h2>
            </TrancheModalContentStatus>
          </TrancheModalContent> :

          txModalStatus === "failed" ?

          <TrancheModalContent trancheStatus color={ModeThemes[theme].ModalTrancheTextColor}>
            <h2>To deposit in Tranche A, you need to enable it first</h2>
            <TrancheModalContentStatus color={ModeThemes[theme].ModalTrancheTextColor}>
              <img src={TrancheRejected} alt="img" />
              <h2>Transaction Failed</h2>
            </TrancheModalContentStatus>
          </TrancheModalContent> : ""

        }
          

          

         {
           txModalStatus === "notApproved" || txModalStatus === "confirm" ?

          <TrancheModalFooter color={ModeThemes[theme].ModalTrancheTextColor}>
            {
              txLoading ? 
              <button>
                <LoadingButton>
                  {[...Array(4).keys()].map((idx) => {
                    return <LoadingButtonCircle i={idx + 1}></LoadingButtonCircle>;
                  })}
                </LoadingButton>
              </button> :
            <button>
              <img src={CheckBtnWhite} alt="img" /> Enable
            </button>
            }
          </TrancheModalFooter> : 
          <TrancheModalFooter color={ModeThemes[theme].ModalTrancheTextColor} link TrancheEnableConfirm>
            <a href="/" target="_blank" rel='noreferrer noopener'>
              <img src={LinkIcon} alt="img" /> View on Etherscan
            </a>
          </TrancheModalFooter>
         }
          
        </TrancheModalWrapper>

      </Modal>
    );
  };

  const TrancheConfirm = () => {
    return (
      <Modal
        isOpen={txModalIsOpen}
        onRequestClose={closeModal}
        style={TrancheConfirmModal}
        closeTimeoutMS={200}
        shouldCloseOnOverlayClick={false}
        contentLabel='Adjust'
        portalClassName="TrancheConfirmModal"
      >

        <TrancheModalWrapper
          backgroundColor={ModeThemes[theme].ModalBackground}
          TrancheConfirm
        >
          <TrancheModalHeader color={ModeThemes[theme].ModalTrancheTextColor} border={ModeThemes[theme].ModalTrancheTextRowBorder}
            TrancheConfirm
          >
            {/* <h2>TRANCHE REWARDS</h2> */}
            <ModalHeader tranche ModalBackground={ModeThemes[theme].ModalBackground} enableModal>
              <button onClick={() => closeModal()}>
                <img src={theme === "light" ? CloseModal : CloseModalWhite}alt='' />
              </button>
            </ModalHeader>
            <TrancheModalContentHeader color={ModeThemes[theme].ModalTrancheTextColor} enableModal>
              <TrancheModalContentHeaderImg>
              <img src={CompoundLogo} alt="img" />
              <span>
                <img src={DAICARD} alt="img" />                
              </span>
              </TrancheModalContentHeaderImg>
              <TrancheModalContentHeaderText rateColor={ModeThemes[theme].TrancheRateTypeColor} color={ModeThemes[theme].ModalTrancheTextColor} textColor={ModeThemes[theme].textColor}>
                <h2>Compound Dai</h2>
                <div>
                  <h2>ACDAI</h2>
                  <h2>Fixed</h2>
                </div>
              </TrancheModalContentHeaderText>
            </TrancheModalContentHeader>
          </TrancheModalHeader>
        { 
        txModalStatus === "notApproved" ?
          <TrancheModalContent color={ModeThemes[theme].ModalTrancheTextColor}>
            <h2>Deposit in Tranche A</h2>
            <TrancheModalContentRow color={ModeThemes[theme].ModalTrancheTextColor} border={ModeThemes[theme].ModalTrancheTextRowBorder}>
              <h2>CToken APY</h2>
              <h2>900</h2>
            </TrancheModalContentRow>
            <TrancheModalContentRow color={ModeThemes[theme].ModalTrancheTextColor} border={ModeThemes[theme].ModalTrancheTextRowBorder}>
              <h2>Tranche APY</h2>
              <h2>105.125</h2>
            </TrancheModalContentRow>
            <TrancheModalContentRow color={ModeThemes[theme].ModalTrancheTextColor} border={ModeThemes[theme].ModalTrancheTextRowBorder}>
              <h2>SLICE APY</h2>
              <h2>$0.865</h2>
            </TrancheModalContentRow>
            <TrancheModalContentRow color={ModeThemes[theme].ModalTrancheTextColor} border={ModeThemes[theme].ModalTrancheTextRowBorder}>
              <h2>Net APY</h2>
              <h2>$0.865</h2>
            </TrancheModalContentRow>
            <TrancheModalContentRow color={ModeThemes[theme].ModalTrancheTextColor} border={ModeThemes[theme].ModalTrancheTextRowBorder}>
              <h2>DAI Spend</h2>
              <h2>$0.865</h2>
            </TrancheModalContentRow>
            <TrancheModalContentRow noBorder color={ModeThemes[theme].ModalTrancheTextColor} border={ModeThemes[theme].ModalTrancheTextRowBorder}>
              <h2>Your Wallet Balance</h2>
              <h2>$0.865</h2>
            </TrancheModalContentRow>
          </TrancheModalContent> :
        txModalStatus === "pending" ?
          <TrancheModalContent trancheStatus color={ModeThemes[theme].ModalTrancheTextColor}>
            <h2>To deposit in Tranche A, you need to enable it first</h2>
            <TrancheModalContentStatus color={ModeThemes[theme].ModalTrancheTextColor}>
              <img src={theme === "light" ? TranchePendingLight : TranchePending} alt="img" />
              <h2>Confirm Transaction</h2>
            </TrancheModalContentStatus>
          </TrancheModalContent> :
        txModalStatus === "success" ?
          <TrancheModalContent trancheStatus color={ModeThemes[theme].ModalTrancheTextColor}>
            <h2>To deposit in Tranche A, you need to enable it first</h2>
            <TrancheModalContentStatus color={ModeThemes[theme].ModalTrancheTextColor}>
              <img src={Migrated} alt="img" />
              <h2>Transaction Successful</h2>
            </TrancheModalContentStatus>
          </TrancheModalContent> : 
          txModalStatus === "failed" ?
          <TrancheModalContent trancheStatus color={ModeThemes[theme].ModalTrancheTextColor}>
            <h2>To deposit in Tranche A, you need to enable it first</h2>
            <TrancheModalContentStatus color={ModeThemes[theme].ModalTrancheTextColor}>
              <img src={TrancheRejected} alt="img" />
              <h2>Transaction Failed</h2>
            </TrancheModalContentStatus>
          </TrancheModalContent> : ""


        }
          

         

          {
           txModalStatus === "notApproved" ?
            <TrancheModalFooter color={ModeThemes[theme].ModalTrancheTextColor}>
              {
                txLoading ?
                <button>
                  <LoadingButton>
                    {[...Array(4).keys()].map((idx) => {
                      return <LoadingButtonCircle i={idx + 1}></LoadingButtonCircle>;
                    })}
                  </LoadingButton>
                </button> : 
                <button>
                  <img src={CheckBtnWhite} alt="img" /> Confirm
                </button>
              }
              
            </TrancheModalFooter> :

            <TrancheModalFooter color={ModeThemes[theme].ModalTrancheTextColor} link TrancheEnableConfirm>
              <a href="/" target="_blank" rel='noreferrer noopener'>
                <img src={LinkIcon} alt="img" /> View on Etherscan
              </a>
            </TrancheModalFooter>

          }

        </TrancheModalWrapper>

      </Modal>
    );
  };

  return txModalType === "trancheRewards" ? TrancheRewards() : txModalType === "trancheEnable" ? TrancheEnable() : txModalType === "trancheConfirm" ? TrancheConfirm() : TrancheMarket();
};


const mapStateToProps = (state) => ({
    theme: state.theme,
    ethereum: state.ethereum,
    data: state.data
});

export default connect(mapStateToProps, { trancheMarketsToggle })(TrancheModal);