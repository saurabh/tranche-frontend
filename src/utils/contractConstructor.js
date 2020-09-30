import { JFactoryABI, ERC20ABI } from 'ABIs';
import { JFactoryAddress, JPTAddress, USDCAddress } from 'config/ethereum';

export function JFactorySetup(web3) {
  return new web3.eth.Contract(JFactoryABI, JFactoryAddress);
}

export function JPTSetup(web3) {
  return new web3.eth.Contract(ERC20ABI, JPTAddress);
}

export function USDCSetup(web3) {
  return new web3.eth.Contract(ERC20ABI, USDCAddress);
}
