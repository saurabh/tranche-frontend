import Web3 from 'web3';
import { alchemyWebSocketsUrl, infuraWebSocketsUrl } from 'config/constants';

const WSSProvider = new Web3.providers.WebsocketProvider(infuraWebSocketsUrl);
export const web3 = new Web3(WSSProvider);
