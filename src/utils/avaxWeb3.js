import Web3 from 'web3';
import { avalancheHttpUrl, avalancheWebSocketsUrl } from 'config/constants';
import { options } from './getWeb3';

const HttpProvider = new Web3.providers.HttpProvider(avalancheHttpUrl);
const WSSProvider = new Web3.providers.WebsocketProvider(avalancheWebSocketsUrl, options);

export default {
  http: new Web3(HttpProvider),
  webSocket: new Web3(WSSProvider)
}
