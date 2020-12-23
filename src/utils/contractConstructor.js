import {
  abi as JLoanHelperABI,
  networks as JLoanHelperNetworks
} from 'build/contracts/JLoanHelper.json';
import { abi as JPriceOracleABI, networks as JPONetworks } from 'build/contracts/JPriceOracle.json';
import { abi as JLoanABI } from 'build/contracts/JLoan.json';
import { abi as ERC20ABI } from 'build/contracts/myERC20.json';
import {
  LoanContractAddress,
  DAIAddress,
  SLICEAddress,
  USDCAddress,
  networkId
} from 'config/constants';

export function JLoanSetup(web3) {
  return new web3.eth.Contract(JLoanABI, LoanContractAddress);
}

export function JLoanHelperSetup(web3) {
  return new web3.eth.Contract(JLoanHelperABI, JLoanHelperNetworks[networkId].address);
}

export function JPriceOracleSetup(web3) {
  return new web3.eth.Contract(JPriceOracleABI, JPONetworks[networkId].address);
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
