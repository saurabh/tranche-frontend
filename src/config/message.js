import { etherScanUrl } from './constants';

export const txMessage = (hash) =>
  `Your transaction is pending, click <a href="${etherScanUrl}/tx/${hash}" rel="noopener noreferrer" target="_blank">here</a> for more info.`;
