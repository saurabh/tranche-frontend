import Web3 from 'web3';
import { alchemyWebSocketsUrl } from 'config/constants';

export const options = {
  timeout: 30000, // ms

  clientConfig: {
      // Useful if requests are large
      maxReceivedFrameSize: 100000000,   // bytes - default: 1MiB
      maxReceivedMessageSize: 100000000, // bytes - default: 8MiB

      // Useful to keep a connection alive
      keepalive: true,
      keepaliveInterval: -1 // ms
  },

  // Enable auto reconnection
  reconnect: {
      auto: true,
      delay: 1000, // ms
      maxAttempts: 10,
      onTimeout: false
  }
};

const WSSProvider = new Web3.providers.WebsocketProvider(alchemyWebSocketsUrl, options);
export const web3 = new Web3(WSSProvider);
