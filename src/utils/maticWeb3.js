import Web3 from 'web3';
import { maticHttpUrl, maticWebSocketsUrl } from 'config/constants';
import { options } from './getWeb3';

const HttpProvider = new Web3.providers.HttpProvider(maticHttpUrl);
const WSSProvider = new Web3.providers.WebsocketProvider(maticWebSocketsUrl, options);

export default {
  http: new Web3(HttpProvider),
  webSocket: new Web3(WSSProvider)
}
