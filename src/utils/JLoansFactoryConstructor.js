import { abi } from 'build/JLoansFactory.json';
const address = '0x8740b7022f53053b7f150d95b9a63a8b39fd17ff';

export default function gatewayContractSetup(web3) {
  return new web3.eth.Contract(abi, address);
}
