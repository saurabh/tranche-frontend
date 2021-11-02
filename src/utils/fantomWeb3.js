import Web3 from 'web3';
import { fantomHttpUrl, fantomWebSocketsUrl } from 'config/constants';
import { options } from './getWeb3';

const HttpProvider = new Web3.providers.HttpProvider(fantomHttpUrl);
const WSSProvider = new Web3.providers.WebsocketProvider(fantomWebSocketsUrl, options);

export default {
  http: new Web3(HttpProvider),
  webSocket: new Web3(WSSProvider)
}
