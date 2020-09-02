import { abi } from 'build/JLoansFactory.json';
const address = '0xc90e8E5680340E72240c6322277FA9f9Ee93B7a5';

export default function gatewayContractSetup(web3) {
  return new web3.eth.Contract(abi, address);
}
