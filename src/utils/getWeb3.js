import Web3 from 'web3';
import { alchemyWebSocketsUrl } from 'config/constants';

const WSSProvider = new Web3.providers.WebsocketProvider(alchemyWebSocketsUrl);
export const web3 = new Web3(WSSProvider);
