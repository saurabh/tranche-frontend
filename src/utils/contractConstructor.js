import { JFactoryABI, JLoanEthABI, JLoanTokenABI, ERC20ABI } from 'ABIs';
import { JFactoryAddress, DAIAddress, JPTAddress, USDCAddress } from 'config/ethereum';

export function JFactorySetup(web3) {
  return new web3.eth.Contract(JFactoryABI, JFactoryAddress);
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
