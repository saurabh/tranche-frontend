import { abi as JFactoryABI, networks as JFactoryNetworks } from 'build/contracts/JFactory.json';
import { abi as JPriceOracleABI, networks as JPONetworks } from 'build/contracts/JPriceOracle.json';
import { abi as JLoanABI } from 'build/contracts/JLoan.json';
import { abi as ERC20ABI } from 'build/contracts/myERC20.json';
import { DAIAddress, JPTAddress, USDCAddress, networkId } from 'config/constants';

export function JFactorySetup(web3) {
  return new web3.eth.Contract(JFactoryABI, JFactoryNetworks[networkId].address);
}

export function JPriceOracleSetup(web3) {
  return new web3.eth.Contract(JPriceOracleABI, JPONetworks[networkId].address);
}

export function JLoanSetup(web3, address) {
  return new web3.eth.Contract(JLoanABI, address);
}

export function DAISetup(web3) {
  return new web3.eth.Contract(ERC20ABI, DAIAddress);
}

export function JPTSetup(web3) {
  return new web3.eth.Contract(ERC20ABI, JPTAddress);
}

export function USDCSetup(web3) {
  return new web3.eth.Contract(ERC20ABI, USDCAddress);
}
