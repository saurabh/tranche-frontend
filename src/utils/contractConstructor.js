import { abi as JLoanHelperABI, networks as JLoanHelperNetworks } from 'build/contracts/JLoanHelper.json';
import { abi as JPriceOracleABI, networks as JPONetworks } from 'build/contracts/JPriceOracle.json';
import { abi as JLoanABI } from 'build/contracts/JLoan.json';
// import { abi as JProtocolABI, networks as JPNetworks } from 'build/contracts/JProtocol.json';
import { abi as JCompoundABI } from 'build/contracts/JCompound.json';
import { abi as JAaveABI } from 'build/contracts/JAave.json';
import { abi as StakingABI } from 'build/contracts/StakingMilestones.json';
import { abi as LockupABI } from 'build/contracts/StakingWithLockup.json';
import { abi as YieldFarmABI } from 'build/contracts/YieldFarm.json';
import { abi as ERC20ABI } from 'build/contracts/myERC20.json';
// import { abi as RewardDistributionABI } from 'build/contracts/IncentivesController.json'
import {
  LoanContractAddress,
  DAIAddress,
  SLICEAddress,
  networkId
} from 'config/constants';

export function JLoanSetup(web3) {
  return new web3.eth.Contract(JLoanABI, LoanContractAddress);
}

// export function JProtocolSetup(web3) {
//   return new web3.eth.Contract(JProtocolABI, JPNetworks[networkId].address);
// }

export function JCompoundSetup(web3, address) {
  return new web3.eth.Contract(JCompoundABI, address);
}

export function JAaveSetup(web3, address) {
  return new web3.eth.Contract(JAaveABI, address);
}

export function JLoanHelperSetup(web3) {
  return new web3.eth.Contract(JLoanHelperABI, JLoanHelperNetworks[networkId].address);
}

export function JPriceOracleSetup(web3) {
  return new web3.eth.Contract(JPriceOracleABI, JPONetworks[networkId].address);
}

export function StakingSetup(web3, StakingAddress) {
  return new web3.eth.Contract(StakingABI, StakingAddress);
}

export function LockupSetup(web3, StakingAddress) {
  return new web3.eth.Contract(LockupABI, StakingAddress);
}

export function YieldFarmSetup(web3, YieldFarmAddress) {
  return new web3.eth.Contract(YieldFarmABI, YieldFarmAddress);
}

export function DAISetup(web3) {
  return new web3.eth.Contract(ERC20ABI, DAIAddress);
}

export function SLICESetup(web3) {
  return new web3.eth.Contract(ERC20ABI, SLICEAddress);
}

export function ERC20Setup(web3, address) {
  return new web3.eth.Contract(ERC20ABI, address);
}

// export function RewardDistributionSetup (web3, RewardDistributionAddress) {
//   return new web3.eth.Contract(RewardDistributionABI, RewardDistributionAddress);
// }
