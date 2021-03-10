import { abi as JLoanHelperABI, networks as JLoanHelperNetworks } from 'build/contracts/JLoanHelper.json';
import { abi as JPriceOracleABI, networks as JPONetworks } from 'build/contracts/JPriceOracle.json';
import { abi as JLoanABI } from 'build/contracts/JLoan.json';
import { abi as JProtocolABI, networks as JPNetworks } from 'build/contracts/JProtocol.json';
import { abi as StakingABI } from 'build/contracts/StakingMilestones.json';
import { abi as YieldFarmABI } from 'build/contracts/YieldFarm.json';
import { abi as ERC20ABI } from 'build/contracts/myERC20.json';
import { abi as TrancheTokenABI } from 'build/contracts/JETHTrancheA.json';
import {
  LoanContractAddress,
  StakingAddress,
  YieldFarmAddress,
  DAIAddress,
  SLICEAddress,
  USDCAddress,
  networkId
} from 'config/constants';

export function JLoanSetup(web3) {
  return new web3.eth.Contract(JLoanABI, LoanContractAddress);
}

export function JProtocolSetup(web3) {
  return new web3.eth.Contract(JProtocolABI, JPNetworks[networkId].address);
}

export function JLoanHelperSetup(web3) {
  return new web3.eth.Contract(JLoanHelperABI, JLoanHelperNetworks[networkId].address);
}

export function JPriceOracleSetup(web3) {
  return new web3.eth.Contract(JPriceOracleABI, JPONetworks[networkId].address);
}

export function StakingSetup(web3) {
  return new web3.eth.Contract(StakingABI, StakingAddress);
}

export function YieldFarmSetup(web3) {
  return new web3.eth.Contract(YieldFarmABI, YieldFarmAddress);
}

export function DAISetup(web3) {
  return new web3.eth.Contract(ERC20ABI, DAIAddress);
}

export function SLICESetup(web3) {
  return new web3.eth.Contract(ERC20ABI, SLICEAddress);
}

export function USDCSetup(web3) {
  return new web3.eth.Contract(ERC20ABI, USDCAddress);
}

export function ERC20Setup(web3, address) {
  return new web3.eth.Contract(ERC20ABI, address);
}

export function JTrancheTokenSetup(web3, address) {
  return new web3.eth.Contract(TrancheTokenABI, address);
}
