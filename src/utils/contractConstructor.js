import { JFactoryABI, ERC20ABI } from 'ABIs';
import { JFactoryAddress, DaiAddress } from 'config/constants';

export function JFactorySetup(web3) {
  return new web3.eth.Contract(JFactoryABI, JFactoryAddress);
}

export function DaiSetup(web3) {
  return new web3.eth.Contract(ERC20ABI, DaiAddress);
}
