import abi from './JFactoryABI';
import JFactoryAddress from 'constants';

export default function JFactorySetup(web3) {
  return new web3.eth.Contract(abi, JFactoryAddress);
}
