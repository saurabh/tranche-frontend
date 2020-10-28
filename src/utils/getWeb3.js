import Web3 from 'web3';
import { alchemyProviderUrl } from 'config/constants';

const provider = new Web3.providers.HttpProvider(alchemyProviderUrl);
export const web3 = new Web3(provider);
