import Web3 from 'web3';
import { createAlchemyWeb3 } from '@alch/alchemy-web3';
import { alchemyHttpUrl, alchemyWebSocketsUrl } from 'config/constants';

const HTTPProvider = new Web3.providers.HttpProvider(alchemyHttpUrl);
export const web3 = new Web3(HTTPProvider);
export const wsWeb3 = createAlchemyWeb3(alchemyWebSocketsUrl);
