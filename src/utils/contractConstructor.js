import { abi as JFactoryABI, networks as JFactoryNetworks } from 'build/contracts/JFactory.json';
import { abi as ERC20ABI } from 'build/contracts/myERC20.json';
import { abi as JLoanEthABI } from 'build/contracts/JLoanEth.json';
import { abi as JLoanTokenABI } from 'build/contracts/JLoanToken.json';
import { DAIAddress, JPTAddress, USDCAddress } from 'config/ethereum';

export function JFactorySetup(web3) {
  return new web3.eth.Contract(JFactoryABI, JFactoryNetworks[42].address);
}

export function JLoanEthSetup(web3, address) {
  return new web3.eth.Contract(JLoanEthABI, address);
}

export function JLoanTokenSetup(web3, address) {
  return new web3.eth.Contract(JLoanTokenABI, address);
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
