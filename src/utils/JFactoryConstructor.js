import abi from 'ABIs/JFactoryABI';
import {JFactoryAddress} from 'config/constants';

export default function JFactorySetup(web3) {
  return new web3.eth.Contract(abi, JFactoryAddress);
}
